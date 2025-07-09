"use strict";
/* eslint-disable no-restricted-syntax */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const pg_1 = require("@dataplan/pg/adaptors/pg");
const graphile_build_1 = require("graphile-build");
const graphile_config_1 = require("graphile-config");
const graphile_export_1 = require("graphile-export");
const pg_2 = require("pg");
const webpack_1 = tslib_1.__importDefault(require("webpack"));
const index_js_1 = require("../index.js");
/**
 * Set this to 'false' for production and the bundle will be minified.
 */
const DEBUG_MODE = true;
// Create a pool and add the error handler
const pool = new pg_2.Pool({
    connectionString: "postgres://postgres:unsecured@localhost:6432/chinook",
    // --simple-collections only
});
pool.on("error", (e) => {
    console.log("Client error", e);
});
// We're using the 'pg' adaptor
async function main() {
    // The Graphile configuration
    const config = (0, graphile_config_1.resolvePreset)({
        extends: [graphile_build_1.defaultPreset, index_js_1.defaultPreset],
        plugins: [graphile_build_1.QueryQueryPlugin, graphile_build_1.SwallowErrorsPlugin],
        pgServices: [
            // Configuration of our main (and only) Postgres database
            (0, pg_1.makePgService)({
                name: "main",
                schemas: ["public"],
                pgSettingsKey: "pgSettings",
                withPgClientKey: "withPgClient",
                pool,
            }),
        ],
        gather: {},
        schema: {
            defaultBehavior: "+list -connection",
        },
    });
    // Inflection phase
    const shared = { inflection: (0, graphile_build_1.buildInflection)(config) };
    // Gather phase
    const input = await (0, graphile_build_1.gather)(config, shared);
    // Schema build phase
    const schema = (0, graphile_build_1.buildSchema)(config, input, shared);
    // Export schema to JavaScript file
    await (0, graphile_export_1.exportSchema)(schema, `${__dirname}/../../exported-schema-for-webpack.mjs`, {
        mode: "graphql-js",
    });
    // Now webpack it
    const finalFileLocation = `${__dirname}/../../webpacked`;
    await new Promise((resolve, reject) => {
        (0, webpack_1.default)({
            // Node.js
            target: "node",
            // We want the schema bundled up, but also Grafast's execute
            // method, etc, so we use an entry file that pulls both in.
            entry: `${__dirname}/webpack-entry-file.js`,
            output: {
                library: {
                    // TODO: make this work with ESM!
                    type: "commonjs",
                },
                path: finalFileLocation,
            },
            // These things should come from `node_modules` rather than being
            // bundled; this is primarily because we expect you to bring your own
            // GraphQL server. (Also: node builtins.)
            externals: [
                "graphql",
                "util",
                "assert",
                "crypto",
                "fs",
                "fs/promises",
                "inspector",
            ],
            // Production optimisations!
            plugins: [
                new webpack_1.default.DefinePlugin({
                    "process.env.NODE_ENV": JSON.stringify(DEBUG_MODE ? "development" : "production"),
                    "process.env.GRAPHILE_ENV": JSON.stringify(DEBUG_MODE ? "development" : "production"),
                }),
            ],
            // Minify the resulting code.
            optimization: {
                minimize: DEBUG_MODE ? false : true,
            },
        }, (err, stats) => {
            if (err) {
                reject(err);
            }
            else if (stats.hasErrors()) {
                console.dir(stats.toJson().errors);
                reject(new Error("Webpack compilation faield"));
            }
            else {
                resolve();
            }
        });
    });
    // All done!
    console.log(`Schema exported to ${finalFileLocation}`);
}
main()
    .then(() => pool.end())
    .catch((e) => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=webpack.js.map