import chalk from "chalk";
import { readFile } from "fs/promises";
import { lambda } from "graphile-crystal";
import { graphql, printSchema } from "graphql";

import { buildSchema, defaultPlugins, exportSchema } from "../src";

function FN<T>(
  t: T,
  $$scope: { [key: string]: any } | undefined = undefined,
): T {
  if ($$scope) {
    return Object.assign(t, { $$scope });
  } else {
    return t;
  }
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
          plan: FN(
            (_$parent, args) => {
              return lambda(
                args.sides,
                (sides = myDefaultMax) =>
                  Math.floor(Math.random() * (sides + 1 - myDefaultMin)) +
                  myDefaultMin,
              );
            },
            { myDefaultMax, myDefaultMin, lambda },
          ),
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
  console.log(chalk.blue(printSchema(schema)));
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

  console.dir(schema.toConfig());

  // Export schema
  const exportFileLocation = `${__dirname}/../temp.ts`;
  await exportSchema(schema, exportFileLocation);

  // output code
  console.log(chalk.green(await readFile(exportFileLocation, "utf8")));

  // run code
  const { schema: schema2 } = await import(exportFileLocation);
  const result2 = await graphql({
    schema: schema2,
    source: `
      query {
        random
      }
    `,
    rootValue: null,
    variableValues: {},
  });
  console.log(result2); // { data: { random: 4 } }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
