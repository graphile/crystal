"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const promises_1 = require("node:fs/promises");
const node_url_1 = require("node:url");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const grafast_1 = require("grafast");
const graphql_1 = require("grafast/graphql");
const graphile_config_1 = require("graphile-config");
const graphile_export_1 = require("graphile-export");
const index_js_1 = require("../index.js");
const MyRandomFieldPlugin = {
    name: "MyRandomFieldPlugin",
    description: "Adds a random field to every GraphQLObject",
    version: "1.0.0",
    schema: {
        hooks: {
            GraphQLObjectType_fields: {
                callback: (fields, build, context) => {
                    const { extend, graphql: { GraphQLInt }, } = build;
                    const { Self, fieldWithHooks } = context;
                    const { myDefaultMin = 1, myDefaultMax = 100 } = build.options;
                    return extend(fields, {
                        random: fieldWithHooks({ fieldName: "random" }, () => ({
                            type: GraphQLInt,
                            args: {
                                sides: {
                                    type: GraphQLInt,
                                },
                            },
                            plan: (0, index_js_1.EXPORTABLE)((lambda, myDefaultMax, myDefaultMin) => (_$parent, { $sides }) => {
                                return lambda($sides, (sides = myDefaultMax) => Math.floor(Math.random() * (sides + 1 - myDefaultMin)) + myDefaultMin);
                            }, [grafast_1.lambda, myDefaultMax, myDefaultMin]),
                        })),
                    }, `adding 'random' field to ${Self.name}`);
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
    const config = (0, graphile_config_1.resolvePreset)({
        extends: [index_js_1.defaultPreset],
        plugins: [MyRandomFieldPlugin],
        schema: {
            myDefaultMin: 1,
            myDefaultMax: 6,
        },
    });
    // This'd normally be the "gather" phase, but we don't need one
    const input = Object.create(null);
    // Build the schema:
    const schema = (0, index_js_1.buildSchema)(config, input);
    // Output our schema
    console.log(chalk_1.default.blue((0, graphql_1.printSchema)(schema)));
    console.log();
    console.log();
    console.log();
    // Run our query
    const result = await (0, graphql_1.graphql)({
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
    await (0, graphile_export_1.exportSchema)(schema, exportFileLocation);
    // output code
    console.log(chalk_1.default.green(await (0, promises_1.readFile)(exportFileLocation, "utf8")));
    // run code
    const { schema: schema2 } = await import((0, node_url_1.pathToFileURL)(exportFileLocation).href);
    const result2 = await (0, graphql_1.graphql)({
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
//# sourceMappingURL=README-1.js.map