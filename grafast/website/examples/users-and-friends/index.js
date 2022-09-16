const { buildSchema, printSchema, graphql } = require("graphql");
const { makeGrafastSchema, context, each, grafast } = require("grafast");
const { makeDataLoaders } = require("./dataloaders");
const { userById, friendshipsByUserId } = require("./plans");
const fsp = require("node:fs/promises");

const typeDefs = /* GraphQL */ `
  type Query {
    currentUser: User
  }
  type User {
    name: String!
    friends: [User]!
  }
`;
const resolvers = {
  Query: {
    async currentUser(_, args, context) {
      return context.userLoader.load(context.currentUserId);
    },
  },
  User: {
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
};

const planResolvers = {
  Query: {
    currentUser() {
      return userById(context().get("currentUserId"));
    },
  },
  User: {
    name($user) {
      return $user.get("full_name");
    },
    friends($user) {
      const $friendships = friendshipsByUserId($user.get("id"));
      return each($friendships, ($friendship) =>
        userById($friendship.get("friend_id")),
      );
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

const graphqlSchema = makeGraphQLSchema();
const grafastSchema = makeGrafastSchema({
  typeDefs,
  plans: planResolvers,
  enableDeferStream: false,
});
// console.log(printSchema(graphqlSchema));
// console.log(printSchema(grafastSchema));

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

async function main() {
  console.log("GRAPHQL");
  const graphqlResult = await graphql({
    schema: graphqlSchema,
    source,
    contextValue: {
      currentUserId: 1,
      ...makeDataLoaders(),
    },
  });
  console.dir(graphqlResult, { depth: Infinity });

  console.log("GRAFAST");
  const grafastResult = await grafast({
    schema: grafastSchema,
    source,
    contextValue: { currentUserId: 1 },
  });
  console.dir(grafastResult, { depth: Infinity });

  console.log(
    "Same?",
    JSON.stringify(graphqlResult) === JSON.stringify(grafastResult),
  );

  console.log("GRAFAST AGAIN");
  const grafastResultWithPlan = await grafast(
    {
      schema: grafastSchema,
      source,
      contextValue: { currentUserId: 1 },
    },
    { explain: ["mermaid-js"] },
  );
  await fsp.writeFile(
    `${__dirname}/plan.mermaid`,
    grafastResultWithPlan.extensions.explain.operations[0].diagram,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
