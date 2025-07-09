"use strict";
/* eslint-disable no-restricted-syntax */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/*
 * This script demonstrates how to export your executable GraphQL schema to a file;
 * later you would just `import { schema } from 'path/to/file';` to pull it back in.
 */
const graphile_build_1 = require("graphile-build");
const graphile_config_1 = require("graphile-config");
const graphile_export_1 = require("graphile-export");
const jsonwebtoken = tslib_1.__importStar(require("jsonwebtoken"));
const config_js_1 = require("./config.js");
const pool = (0, config_js_1.getPool)();
async function main() {
    // Get our preset (common across examples)
    const { preset } = await (0, config_js_1.makeSharedPresetAndClient)(pool);
    // ---------------------------------------------------------------------------
    // Resolve the preset(s)
    /** Our final resolved preset; containing all plugins and configs */
    const config = (0, graphile_config_1.resolvePreset)(preset);
    // ---------------------------------------------------------------------------
    // Perform the "inflection" phase
    /** Shared data used across other phases. Mostly inflection at this point */
    const shared = { inflection: (0, graphile_build_1.buildInflection)(config) };
    // ---------------------------------------------------------------------------
    // Perform the "data gathering" phase
    /** The result of the gather phase, ready to feed into 'buildSchema' */
    const input = await (0, graphile_build_1.gather)(config, shared);
    // NOTE: at this point `input.pgRegistry.pgResources` contains all your
    // Postgres sources (tables, views, functions, etc).
    // ---------------------------------------------------------------------------
    // Perform the "schema build" phase
    /** Our executable GraphQL schema */
    const schema = (0, graphile_build_1.buildSchema)(config, input, shared);
    // 'schema' is now an executable GraphQL schema. You could print it with:
    // console.log(chalk.blue(printSchema(schema)));
    // ---------------------------------------------------------------------------
    // Export the GraphQL schema to an executable file
    // const exportFileLocation = new URL("../../temp.js", import.meta.url);
    const exportFileLocation = `${__dirname}/../../schema-export-output.mjs`;
    await (0, graphile_export_1.exportSchema)(schema, exportFileLocation, {
        mode: "graphql-js",
        // or:
        // mode: "typeDefs",
        modules: {
            jsonwebtoken: jsonwebtoken,
        },
    });
    console.log(`Exported GraphQL schema to ${exportFileLocation}`);
}
main()
    .then(() => pool.end())
    .catch((e) => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=schema-export.js.map