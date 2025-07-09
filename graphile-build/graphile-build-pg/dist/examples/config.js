"use strict";
/*
 * This file contains configuration that's used across many of the examples.
 * Mostly it's where you tell it what database you want it to run the GraphQL
 * schema against.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPool = getPool;
exports.makeSharedPresetAndClient = makeSharedPresetAndClient;
require("graphile-config");
const pg_1 = require("@dataplan/pg");
const pg_2 = require("@dataplan/pg/adaptors/pg");
const graphile_build_1 = require("graphile-build");
const pg_3 = require("pg");
const index_js_1 = require("../index.js");
// You should set these to be the values you want to use for demonstration
const DATABASE_CONNECTION_STRING = "postgres:///pagila";
const DATABASE_SCHEMAS = ["public", "app_public"];
/* ************************************************************************** */
/* **                                                                      ** */
/* **         BELOW HERE IS WHERE THE CODE LIVES, ABOVE IS CONFIG          ** */
/* **                                                                      ** */
/* ************************************************************************** */
function getPool() {
    const pool = new pg_3.Pool({
        connectionString: DATABASE_CONNECTION_STRING,
    });
    pool.on("error", (e) => {
        console.log("Client error", e);
    });
    return pool;
}
const EnumManglingPlugin = {
    name: "EnumManglingPlugin",
    description: "Mangles enum value names so that they're more likely to be compatible with GraphQL",
    version: "0.0.0",
    inflection: {
        replace: {
            // Help make enums more forgiving
            enumValue(previous, options, value, codec) {
                const base = previous?.(value, codec) ?? value;
                return base
                    .replace(/[^A-Za-z0-9_]+/g, "_")
                    .replace(/^__+/, "_")
                    .replace(/__+$/, "_");
            },
        },
    },
};
async function makeSharedPresetAndClient(pool) {
    const preset = {
        extends: [graphile_build_1.defaultPreset, index_js_1.defaultPreset],
        plugins: [graphile_build_1.QueryQueryPlugin, graphile_build_1.SwallowErrorsPlugin, EnumManglingPlugin],
        pgServices: [
            (0, pg_2.makePgService)({
                name: "main",
                schemas: DATABASE_SCHEMAS,
                pgSettingsKey: "pgSettings",
                withPgClientKey: "withPgClient",
                pool,
            }),
        ],
        gather: {
        // pgJwtTypes: "jwt_token",
        },
        schema: {
        // pgJwtSecret: "secret",
        },
    };
    const withPgClient = await (0, pg_1.getWithPgClientFromPgService)(preset.pgServices[0]);
    return {
        preset,
        withPgClient,
    };
}
//# sourceMappingURL=config.js.map