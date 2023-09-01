import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

import chalk from "chalk";
import { lambda } from "grafast";
import { graphql, printSchema } from "grafast/graphql";
import { resolvePresets } from "graphile-config";
import { exportSchema } from "graphile-export";

import { buildSchema, defaultPreset, EXPORTABLE } from "../index.js";

/*
 * This example shows how to write a graphile-build plugin that adds a field
 * called `random` that returns a random number to every GraphQL Object Type in
 * the entire GraphQL schema. Of course, this is useless and not something
 * you'd do, but it's an example of a simple plugin.
 */

declare global {
  namespace GraphileBuild {
    interface SchemaOptions {
      myDefaultMin?: number;
      myDefaultMax?: number;
    }
  }
}

const MyRandomFieldPlugin: GraphileConfig.Plugin = {
  name: "MyRandomFieldPlugin",
  description: "Adds a random field to every GraphQLObject",
  version: "1.0.0",
  schema: {
    hooks: {
      GraphQLObjectType_fields: {
        callback: (fields, build, context) => {
          const {
            extend,
            graphql: { GraphQLInt },
          } = build;
          const { Self, fieldWithHooks } = context;
          const { myDefaultMin = 1, myDefaultMax = 100 } = build.options;
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
                plan: EXPORTABLE(
                  (lambda, myDefaultMax, myDefaultMin) => (_$parent, args) => {
                    return lambda(
                      args.get("sides"),
                      (sides = myDefaultMax) =>
                        Math.floor(Math.random() * (sides + 1 - myDefaultMin)) +
                        myDefaultMin,
                    );
                  },
                  [lambda, myDefaultMax, myDefaultMin],
                ),
              })),
            },
            `adding 'random' field to ${Self.name}`,
          );
        },
      },
    },
  },
};

/*
 * This is a really long example of running the above plugin - it:
 *
 * 1. builds the schema
 * 2. outputs the schema
 * 3. runs a GraphQL query against the schema
 * 4. exports the schema to a JavaScript file
 * 5. imports the exported schema from said file
 * 6. runs the same GraphQL query against the freshly imported schema
 *
 * Normally you'd stop after step 3, the other lines are there for testing and
 * for your interest.
 */

(async function () {
  // Create our GraphQL schema by applying all the plugins
  const config = resolvePresets([
    {
      extends: [defaultPreset],
      plugins: [MyRandomFieldPlugin],
      schema: {
        myDefaultMin: 1,
        myDefaultMax: 6,
      },
    },
  ]);

  // This'd normally be the "gather" phase, but we don't need one
  const input: GraphileBuild.BuildInput = Object.create(null);

  // Build the schema:
  const schema = buildSchema(config, input);

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

  // console.dir(schema.toConfig());

  // Export schema
  // const exportFileLocation = new URL("../../temp.js", import.meta.url);
  const exportFileLocation = `${__dirname}/../../temp.mjs`;
  await exportSchema(schema, exportFileLocation);

  // output code
  console.log(chalk.green(await readFile(exportFileLocation, "utf8")));

  // run code
  const { schema: schema2 } = await import(
    pathToFileURL(exportFileLocation).href
  );
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
