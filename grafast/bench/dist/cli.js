"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = options;
exports.run = run;
const tslib_1 = require("tslib");
const fsp = tslib_1.__importStar(require("node:fs/promises"));
const path = tslib_1.__importStar(require("node:path"));
const node_url_1 = require("node:url");
const glob_1 = require("glob");
const graphql_1 = require("grafast/graphql");
const graphile_config_1 = require("graphile-config");
const load_1 = require("graphile-config/load");
const index_js_1 = require("./index.js");
function options(yargs) {
    return yargs
        .usage("$0", "Benchmark a Grafast schema")
        .option("schema", {
        alias: "s",
        type: "string",
        description: "path to the GraphQL schema",
    })
        .option("operations", {
        alias: "o",
        type: "string",
        description: "glob pattern for the operations to test",
    })
        .option("config", {
        alias: "C",
        type: "string",
        description: "The path to the graphile.config.mjs (or similar) file",
        normalize: true,
    });
}
async function configFromArgs(args) {
    const { schema, operations, config: configFileLocation } = args;
    const userPreset = await (0, load_1.loadConfig)(configFileLocation);
    const preset = {
        extends: [...(userPreset ? [userPreset] : [])],
        bench: {},
    };
    if (schema) {
        preset.bench.schema = schema;
    }
    if (operations !== undefined) {
        preset.bench.operations = operations;
    }
    const config = (0, graphile_config_1.resolvePreset)(preset);
    return config;
}
async function run(args) {
    const config = await configFromArgs(args);
    const { schema: schemaFile = "schema.mjs", operations: operationsGlob = "queries/*.graphql", } = config.bench ?? {};
    const mod = await import((0, node_url_1.pathToFileURL)(schemaFile).href);
    const schema = (0, graphql_1.isSchema)(mod.default)
        ? mod.default
        : (0, graphql_1.isSchema)(mod.schema)
            ? mod.schema
            : (0, graphql_1.isSchema)(mod)
                ? mod
                : (0, graphql_1.isSchema)(mod.default.default)
                    ? mod.default.default
                    : (0, graphql_1.isSchema)(mod.default.schema)
                        ? mod.default.schema
                        : null;
    if (!schema) {
        throw new Error(`Could not find a schema exported from that file - please export the schema as 'schema' or 'default'. Exports: ${Object.keys(mod)}`);
    }
    const operationFiles = await (0, glob_1.glob)(operationsGlob);
    operationFiles.sort();
    const operations = await Promise.all(operationFiles.map(async (f) => {
        return {
            name: path.basename(path.dirname(f)) + "/" + path.basename(f),
            source: await fsp.readFile(f, "utf8"),
        };
    }));
    await (0, index_js_1.bench)(schema, operations, config.bench ?? {});
}
//# sourceMappingURL=cli.js.map