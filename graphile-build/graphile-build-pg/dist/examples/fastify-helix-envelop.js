"use strict";
/* eslint-disable no-restricted-syntax */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/*
 * This shows how to build a GraphQL schema from plugins (PostGraphile-like)
 * and then serve it from a Fastify webserver using Helix and Envelop.
 *
 * We serve:
 *
 * / - Ruru (GraphiQL)
 * /graphql - the GraphQL API
 */
const core_1 = require("@envelop/core");
const parser_cache_1 = require("@envelop/parser-cache");
const validation_cache_1 = require("@envelop/validation-cache");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const fastify_1 = tslib_1.__importDefault(require("fastify"));
const envelop_1 = require("grafast/envelop");
const graphile_build_1 = require("graphile-build");
const graphile_config_1 = require("graphile-config");
const graphql_helix_1 = require("graphql-helix");
const config_js_1 = require("./config.js");
const pool = (0, config_js_1.getPool)();
async function main() {
    // Get our preset and withPgClient function (common across examples)
    const { preset, withPgClient } = await (0, config_js_1.makeSharedPresetAndClient)(pool);
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
    // Now we set about creating our GraphQL server
    /** Our GraphQL context, saying how to communicate with Postgres. */
    const contextValue = {
        withPgClient,
    };
    /** Our envelop setup, with all the plugins we need */
    const getEnveloped = (0, core_1.envelop)({
        plugins: [
            // Use our executable schema
            (0, core_1.useSchema)(schema),
            // Caching the parser results is critical for Grafast, otherwise it
            // must re-plan every GraphQL request!
            (0, parser_cache_1.useParserCache)(),
            (0, validation_cache_1.useValidationCache)(),
            // Our context says how to communicate with Postgres
            (0, core_1.useExtendContext)(() => contextValue),
            // This replaces graphql-js' `execute` with Grafast's own
            (0, envelop_1.useGrafast)(),
            // Useful for debugging; DO NOT USE IN PRODUCTION!
            (0, envelop_1.useMoreDetailedErrors)(),
        ],
    });
    /** Our fastify (server) app */
    const app = (0, fastify_1.default)();
    const { ruruHTML } = await import("ruru/server");
    // The root URL ('/') serves Ruru (GraphiQL)
    app.route({
        method: ["GET"],
        url: "/",
        exposeHeadRoute: true,
        async handler(req, res) {
            res.type("text/html").send(ruruHTML({
                endpoint: "/graphql",
            }));
        },
    });
    // The GraphQL route is at '/graphql' as usual
    app.route({
        method: ["POST"],
        url: "/graphql",
        async handler(req, res) {
            // Here we can pass the request and make available as part of the "context".
            // The return value is the a GraphQL-proxy that exposes all the functions.
            const { parse, validate, contextFactory, execute, schema } = getEnveloped({
                req,
            });
            const request = {
                body: req.body,
                headers: req.headers,
                method: req.method,
                query: req.query,
            };
            const { operationName, query, variables } = (0, graphql_helix_1.getGraphQLParameters)(request);
            // Here, we pass our custom functions to Helix, and it will take care of the rest.
            const result = await (0, graphql_helix_1.processRequest)({
                operationName,
                query,
                variables,
                request,
                schema,
                parse,
                validate,
                execute,
                contextFactory,
                // sendResponseResult: true,
            });
            (0, graphql_helix_1.sendResult)(result, res.raw);
        },
    });
    app.listen(4000, () => {
        /* success */
    });
    console.log(`\


Running a GraphQL API server.
For Ruru (GraphQL IDE), see     ${chalk_1.default.blue.underline("http://localhost:4000/")}
Issue GraphQL queries via HTTP POST to  ${chalk_1.default.blue.underline("http://localhost:4000/graphql")}

`);
    // Keep alive forever.
    return new Promise(() => { });
}
main()
    .then(() => pool.end())
    .catch((e) => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=fastify-helix-envelop.js.map