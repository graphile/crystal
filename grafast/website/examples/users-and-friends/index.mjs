import assert from "node:assert";
import { writeFile } from "node:fs/promises";

import {
  condition,
  context,
  each,
  execute as grafastExecute,
  grafast,
  inhibitOnNull,
  makeGrafastSchema,
  nodeIdFromNode,
  specFromNodeId,
  stringifyPayload,
  trap,
  TRAP_INHIBITED,
} from "grafast";
import { planToMermaid } from "grafast/mermaid";
import { resolvePreset } from "graphile-config";
import {
  buildSchema,
  execute as graphqlExecute,
  graphql,
  parse,
  validate,
} from "graphql";

import { makeDataLoaders } from "./dataloaders.mjs";
import { base64JSONCodec, handlers } from "./nodeIds.mjs";
import { friendshipsByUserId, postsByAuthorId, userById } from "./plans.mjs";

// ESM port of Node.js __dirname
const __dirname = new URL(".", import.meta.url).pathname;

// Benchmark settings
const NUMBER_OF_REQUESTS = 10000;
const CONCURRENCY = 3;
/** Should we use the grafast string optimization */
const asString = true;

const typeDefs = /* GraphQL */ `
  type Query {
    currentUser: User
    # Note: null 'id' is valid: that would be anonymous posts.
    postsByAuthorId(id: ID): [Post]
  }
  interface Node {
    id: ID!
  }
  type User implements Node {
    id: ID!
    name: String!
    friends: [User]!
  }
  type Post implements Node {
    id: ID!
    author: User
    content: String
  }
`;
const resolvers = {
  Query: {
    async currentUser(_, args, context) {
      return context.userLoader.load(context.currentUserId);
    },
    postsByAuthorId(_, args, context) {
      const nodeId = args.id;
      if (nodeId == null) {
        return context.postsByAuthorIdLoader.load(
          // DataLoader doesn't support null here, so we're using -1 as a
          // stand-in
          -1,
        );
      }
      const tuple = base64JSONCodec.decode(nodeId);
      if (
        Array.isArray(tuple) &&
        tuple.length === 2 &&
        tuple[0] === "User" &&
        typeof tuple[1] === "number"
      ) {
        return context.postsByAuthorIdLoader.load(tuple[1]);
      } else {
        // Only Users can author posts, posts by any other entity is an empty array
        return [];
      }
    },
  },
  User: {
    id(user) {
      return base64JSONCodec.encode(["User", user.id]);
    },
    name(user) {
      return user.full_name;
    },
    async friends(user, args, context) {
      const friendships = await context.friendshipsByUserIdLoader.load(user.id);
      const friends = await Promise.all(
        friendships.map((friendship) =>
          context.userLoader.load(friendship.friend_id),
        ),
      );
      return friends;
    },
  },
  Post: {
    id(post) {
      return base64JSONCodec.encode(["Post", post.id]);
    },
    author(post) {
      return post.author_id ? context.userLoader.load(post.author_id) : null;
    },
  },
};

const planResolvers = {
  Query: {
    currentUser() {
      return userById(context().get("currentUserId"));
    },
    postsByAuthorId(_, { $id }) {
      const spec = specFromNodeId(handlers.User, $id);
      // This will be null if the ID is null or invalid
      const $userIdOrNull = spec.id;
      // Inhibit the ID if the spec returns null but the $id was non-null
      const $validUserIdOrNull = inhibitOnNull($userIdOrNull, {
        if: condition("not null", $id),
      });
      // Fetch the posts (if not inhibited)
      const $posts = postsByAuthorId($validUserIdOrNull);
      return trap($posts, TRAP_INHIBITED, {
        valueForInhibited: "EMPTY_LIST",
      });
    },
  },
  User: {
    id($user) {
      return nodeIdFromNode(handlers.User, $user);
    },
    name($user) {
      return $user.get("full_name");
    },
    friends($user) {
      const $friendships = friendshipsByUserId($user.get("id"));
      const $friends = each($friendships, ($friendship) =>
        userById($friendship.get("friend_id")),
      );
      return $friends;
    },
  },
  Post: {
    id($post) {
      return nodeIdFromNode(handlers.Post, $post);
    },
    author($post) {
      return userById($post.get("author_id"));
    },
  },
};

const makeGraphQLSchema = () => {
  const schema = buildSchema(typeDefs);
  // Mutating a schema after it's generated is a Bad Idea. Don't do this in your own code.
  for (const [typeName, fieldResolvers] of Object.entries(resolvers)) {
    const type = schema.getType(typeName);
    const fields = type.getFields();
    for (const [fieldName, resolver] of Object.entries(fieldResolvers)) {
      const field = fields[fieldName];
      field.resolve = resolver;
    }
  }
  return schema;
};

const schemaDL = makeGraphQLSchema();
const schemaGF = makeGrafastSchema({
  typeDefs,
  plans: planResolvers,
  enableDeferStream: false,
});
// console.log(printSchema(schemaDL));
// console.log(printSchema(schemaGF));

const source = /* GraphQL */ `
  {
    currentUser {
      name
      friends {
        name
        friends {
          name
        }
      }
    }
  }
`;

// To make it fair, we parse and validate the query ahead of time and just time
// execution (because grafast caches parse results).

const document = parse(source);
const errors1 = validate(schemaDL, document);
const errors2 = validate(schemaGF, document);
if (errors1.length) {
  throw errors1[0];
}
if (errors2.length) {
  throw errors2[0];
}

async function runGraphQL() {
  const result = await graphqlExecute({
    schema: schemaDL,
    document,
    contextValue: {
      ...baseContext,
      ...makeDataLoaders(),
    },
  });
  return JSON.stringify(result);
}

const baseContext = { currentUserId: 1 };
const resolvedPreset = resolvePreset({});
async function runGrafastWithGraphQLSchema() {
  const result = await grafastExecute({
    schema: schemaDL,
    document,
    contextValue: { ...baseContext, ...makeDataLoaders() },
    resolvedPreset,
    outputDataAsString: asString,
  });
  return stringifyPayload(result, asString);
}

async function runGrafast() {
  const result = await grafastExecute({
    schema: schemaGF,
    document,
    contextValue: baseContext,
    resolvedPreset,
    outputDataAsString: asString,
  });
  return stringifyPayload(result, asString);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function benchmark(callback) {
  // Warmup
  for (let i = 0; i < 500; i++) {
    await callback();
  }
  await sleep(5000);

  // Setup
  let result;
  function run() {
    function pass(res) {
      result = res;
      return runner();
    }
    function fail(e) {
      console.error(e);
      process.exit(1);
    }
    let remaining = NUMBER_OF_REQUESTS;
    async function runner() {
      if (remaining > 0) {
        --remaining;
        return callback().then(pass, fail);
      }
    }
    const promises = [];
    for (let i = 0; i < CONCURRENCY; i++) {
      promises.push(runner());
    }
    return Promise.all(promises);
  }

  // Benchmark
  const start = process.hrtime.bigint();
  await run();
  const stop = process.hrtime.bigint();

  // Output
  console.log(result.replace(/\n/g, "").slice(0, 200));
  console.log(
    `Served ${NUMBER_OF_REQUESTS} requests, each producing the above. Took ${
      (stop - start) / 1000000n
    }ms`,
  );

  return result;
}

async function runCompare() {
  const graphqlResult = await graphql({
    schema: schemaDL,
    source,
    contextValue: {
      ...baseContext,
      ...makeDataLoaders(),
    },
  });
  const grafastResult = await grafast({
    schema: schemaGF,
    source,
    contextValue: baseContext,
  });
  const grafastResolversResult = await grafast({
    schema: schemaDL,
    source,
    contextValue: {
      ...baseContext,
      ...makeDataLoaders(),
    },
  });
  console.log("GRAPHQL");
  console.dir(graphqlResult, { depth: Infinity });

  console.log("GRAFAST");
  console.dir(grafastResult, { depth: Infinity });

  console.log("GRAFAST (RESOLVERS)");
  console.dir(grafastResolversResult, { depth: Infinity });

  const same =
    JSON.stringify(graphqlResult) === JSON.stringify(grafastResult) &&
    JSON.stringify(graphqlResult) === JSON.stringify(grafastResolversResult);

  if (!same) {
    console.error("Results do not match!");
    process.exit(1);
  } else {
    console.error("All results match");
  }
}

async function main() {
  switch (process.argv[2]) {
    case "nodeId": {
      const source = /* GraphQL */ `
        query PostsByAuthorId($id: ID) {
          postsByAuthorId(id: $id) {
            content
            #id
            #author {
            #  id
            #  name
            #  friends {
            #    name
            #  }
            #}
          }
        }
      `;

      // To make it fair, we parse and validate the query ahead of time and just time
      // execution (because grafast caches parse results).

      const document = parse(source);
      const errors1 = validate(schemaDL, document);
      const errors2 = validate(schemaGF, document);
      if (errors1.length) {
        throw errors1[0];
      }
      if (errors2.length) {
        throw errors2[0];
      }
      const vars = [
        // User 1
        { id: base64JSONCodec.encode(["User", 1]) },
        // Anonymous posts
        { id: null },
        // Invalid Node ID for this query, expect empty array
        { id: base64JSONCodec.encode(["Post", 2]) },
      ];
      for (const variableValues of vars) {
        const result1 = JSON.stringify(
          await graphqlExecute({
            schema: schemaDL,
            document,
            variableValues,
            contextValue: {
              ...baseContext,
              ...makeDataLoaders(),
            },
          }),
        );
        const grafastRawResult = await grafastExecute({
          schema: schemaGF,
          document,
          variableValues,
          contextValue: { ...baseContext },
          resolvedPreset: {
            extends: [resolvedPreset],
            grafast: {
              explain: ["plan"],
            },
          },
          outputDataAsString: asString,
        });
        //const extensions = grafastRawResult.extensions;
        delete grafastRawResult.extensions;

        const result2 = stringifyPayload(grafastRawResult, asString);
        assert.equal(result2, result1);
        console.log(result1);
        // await writeFile(
        //   `${__dirname}/planforjem.mermaid`,
        //   planToMermaid(extensions.explain.operations[0].plan, {
        //     skipBuckets: false,
        //     concise: true,
        //   }),
        // );
      }
      break;
    }
    case "docs": {
      console.log("Generating query plans for documentation");

      // Simplified query
      const source = /* GraphQL */ `
        {
          currentUser {
            name
            friends {
              name
            }
          }
        }
      `;

      const grafastResultWithPlan = await grafast({
        schema: schemaGF,
        source,
        contextValue: baseContext,
        resolvedPreset: { grafast: { explain: ["plan"] } },
      });

      await writeFile(
        `${__dirname}/plan.mermaid`,
        planToMermaid(
          grafastResultWithPlan.extensions.explain.operations[0].plan,
          { skipBuckets: false, concise: true },
        ),
      );
      await writeFile(
        `${__dirname}/plan-simplified.mermaid`,
        planToMermaid(
          grafastResultWithPlan.extensions.explain.operations[0].plan,
          { skipBuckets: true, concise: true },
        ),
      );

      console.log("... query plans written successfully");
      return;
    }
    case "graphql": {
      console.log("Benchmarking GraphQL.js");
      return benchmark(runGraphQL);
    }
    case "grafast": {
      console.log("Benchmarking Grafast");
      return benchmark(runGrafast);
    }
    case "grafast-resolvers": {
      console.log("Benchmarking Grafast with resolvers");
      return benchmark(runGrafastWithGraphQLSchema);
    }
    default: {
      return runCompare();
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
