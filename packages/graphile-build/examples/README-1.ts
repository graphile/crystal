import { lambda } from "graphile-crystal";
import { graphql, printSchema } from "graphql";

import { buildSchema, defaultPlugins } from "../src";

function FN<T>(t: T): T {
  return t;
}

declare global {
  namespace GraphileEngine {
    interface GraphileBuildOptions {
      myDefaultMin?: number;
      myDefaultMax?: number;
    }
  }
}

// Create a simple plugin that adds a random field to every GraphQLObject
const MyRandomFieldPlugin: GraphileEngine.Plugin = (
  builder,
  { myDefaultMin = 1, myDefaultMax = 100 },
) => {
  builder.hook("GraphQLObjectType:fields", (fields, build, context) => {
    const {
      extend,
      graphql: { GraphQLInt },
    } = build;
    const { Self, fieldWithHooks } = context;
    return extend<typeof fields, typeof fields>(
      fields,
      {
        random: fieldWithHooks({ fieldName: "random" }, () => ({
          type: GraphQLInt,
          args: {
            sides: {
              type: GraphQLInt,
            },
          },
          plan: FN((_$parent, args) => {
            return lambda(
              args.sides,
              (sides = myDefaultMax) =>
                Math.floor(Math.random() * (sides + 1 - myDefaultMin)) +
                myDefaultMin,
            );
          }),
        })),
      },
      `adding 'random' field to ${Self.name}`,
    );
  });
};

(async function () {
  // Create our GraphQL schema by applying all the plugins
  const schema = await buildSchema([...defaultPlugins, MyRandomFieldPlugin], {
    // ... options
    myDefaultMin: 1,
    myDefaultMax: 6,
  });

  // Output our schema
  console.log(printSchema(schema));
  console.log();
  console.log();
  console.log();

  // Run our query
  const result = await graphql({
    schema,
    source: `
      query {
        random
      }
    `,
    rootValue: null,
    variableValues: {},
  });
  console.log(result); // { data: { random: 4 } }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
