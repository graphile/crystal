"use strict";
/* eslint-disable no-restricted-syntax */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/*
 * This is more a test script than an example, I've used it heavily whilst
 * developing so it has grown in scope and is a bit of a mess. Nonetheless it
 * demonstrates how to build a Graphile Build schema that leverages
 * grafast, @dataplan/pg, graphile-build-pg, envelop, fastify, helix, and
 * ruru for viewing the execution and output plan of the latest
 * query.
 */
const node_url_1 = require("node:url");
const node_util_1 = require("node:util");
const pg_1 = require("@dataplan/pg");
const pg_2 = require("@dataplan/pg/adaptors/pg");
const core_1 = require("@envelop/core");
const parser_cache_1 = require("@envelop/parser-cache");
const validation_cache_1 = require("@envelop/validation-cache");
const fastify_1 = tslib_1.__importDefault(require("fastify"));
const envelop_1 = require("grafast/envelop");
const graphql_1 = require("grafast/graphql");
const grafserv_1 = require("grafserv");
const graphile_build_1 = require("graphile-build");
const graphile_config_1 = require("graphile-config");
const graphile_export_1 = require("graphile-export");
const graphql_helix_1 = require("graphql-helix");
const ws_1 = require("graphql-ws/lib/use/ws");
const jsonwebtoken = tslib_1.__importStar(require("jsonwebtoken"));
const pg_3 = require("pg");
const ws = tslib_1.__importStar(require("ws"));
const index_js_1 = require("../index.js");
const pool = new pg_3.Pool({
    connectionString: "graphilecrystaltest",
});
pool.on("error", (e) => {
    console.log("Client error", e);
});
(async function () {
    // Create our GraphQL schema by applying all the plugins
    const config = (0, graphile_config_1.resolvePreset)({
        extends: [graphile_build_1.defaultPreset, index_js_1.defaultPreset],
        plugins: [graphile_build_1.QueryQueryPlugin, graphile_build_1.SwallowErrorsPlugin],
        pgServices: [
            (0, pg_2.makePgService)({
                name: "main",
                schemas: ["a", "b", "c"],
                pgSettingsKey: "pgSettings",
                withPgClientKey: "withPgClient",
                pool,
            }),
        ],
        gather: {
            pgJwtTypes: "b.jwt_token",
        },
        schema: {
            pgJwtSecret: "secret",
        },
    });
    // Perform the "inflection" phase
    const shared = { inflection: (0, graphile_build_1.buildInflection)(config) };
    // Perform the "data gathering" phase
    const input = await (0, graphile_build_1.gather)(config, shared);
    /*
    console.log("Sources:");
    console.log(
      "  " +
        input.pgRegistry.pgResources
          .map(
            (s) => grafastPrint((s as any).name),
            // + ` => ${(s as any).extensions?.tags?.name}`,
          )
          .join("\n  "),
    );
    */
    // Perform the "schema build" phase
    const schema = (0, graphile_build_1.buildSchema)(config, input, shared);
    // Output our schema
    // console.log(chalk.blue(printSchema(schema)));
    console.log("");
    console.log("");
    console.log("");
    // The GraphQL query we'll be using
    const source = /* GraphQL */ `
    {
      allPosts {
        nodes {
          id
          rowId
        }
      }
    }
  `;
    // The 'rootValue' we'll be passing to GraphQL
    const rootValue = null;
    const contextValue = {
        withPgClient: (0, pg_1.getWithPgClientFromPgService)(config.pgServices[0]),
    };
    // Our operation requires no variables
    const variableValues = Object.create(null);
    // Run our query on our initial schema
    const result = await (0, graphql_1.graphql)({
        schema,
        source,
        rootValue,
        variableValues,
        contextValue,
    });
    if ("errors" in result) {
        console.log((0, node_util_1.inspect)(result, { depth: 12, colors: true })); // { data: { random: 4 } }
        process.exit(1);
    }
    // Export the GraphQL schema to an executable file
    // const exportFileLocation = new URL("../../temp.js", import.meta.url);
    const exportFileLocation = `${__dirname}/../../temp.mjs`;
    await (0, graphile_export_1.exportSchema)(schema, exportFileLocation, {
        mode: "typeDefs",
        modules: {
            jsonwebtoken: jsonwebtoken,
        },
    });
    // output code
    //console.log(chalk.green(await readFile(exportFileLocation, "utf8")));
    // Import this exported schema so that we can test it
    const { schema: schema2 } = await import((0, node_url_1.pathToFileURL)(exportFileLocation).href);
    // Rerun the previous operation, using the freshly imported schema
    const result2 = await (0, graphql_1.graphql)({
        schema: schema2,
        source,
        rootValue,
        variableValues,
        contextValue,
    });
    if ("errors" in result2) {
        console.log((0, node_util_1.inspect)(result2, { depth: 12, colors: true })); // { data: { random: 4 } }
        process.exit(1);
    }
    const contextCallback = () => contextValue;
    // Our envelop setup, with all the plugins we need
    const getEnveloped = (0, core_1.envelop)({
        plugins: [
            (0, core_1.useSchema)(schema),
            // Logger disabled on performance grounds (for benchmarking)
            // useLogger(),
            (0, parser_cache_1.useParserCache)(),
            (0, validation_cache_1.useValidationCache)(),
            (0, core_1.useExtendContext)(contextCallback),
            (0, envelop_1.useGrafast)(),
            (0, envelop_1.useMoreDetailedErrors)(),
        ],
    });
    // Create our fastify (server) app
    const app = (0, fastify_1.default)();
    const { ruruHTML } = await import("ruru/server");
    // The root URL ('/') serves GraphiQL
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
    // CORS headers to allow cross-origin requests; handy for connecting a remote
    // GraphiQL/similar.
    const setCORSHeaders = (req, res) => {
        // We use 'res.raw' because that's what Helix uses and otherwise our
        // headers don't get set.
        res.raw.setHeader("Access-Control-Allow-Origin", "*");
        res.raw.setHeader("Access-Control-Allow-Methods", "HEAD, GET, POST");
        res.raw.setHeader("Access-Control-Allow-Headers", [
            "Origin",
            "X-Requested-With",
            // Used by `express-graphql` to determine whether to expose the GraphiQL
            // interface (`text/html`) or not.
            "Accept",
            // Used by PostGraphile for auth purposes.
            "Authorization",
            // Used by GraphQL Playground and other Apollo-enabled servers
            "X-Apollo-Tracing",
            // The `Content-*` headers are used when making requests with a body,
            // like in a POST request.
            "Content-Type",
            "Content-Length",
            // For PostGraphile V4's 'Explain' feature
            "X-PostGraphile-Explain",
            "X-GraphQL-Explain",
        ].join(", "));
        res.raw.setHeader("Access-Control-Expose-Headers", ["X-GraphQL-Event-Stream"].join(", "));
    };
    // The GraphQL route is at '/graphql' as usual
    app.route({
        method: ["OPTIONS"],
        url: "/graphql",
        async handler(req, res) {
            setCORSHeaders(req, res);
            res.send();
        },
    });
    app.route({
        method: ["POST"],
        url: "/graphql",
        async handler(req, res) {
            setCORSHeaders(req, res);
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
        console.log(`GraphQL server is running...`);
        const wsServer = new ws.Server({
            server: app.server,
            path: "/graphql",
        });
        (0, ws_1.useServer)({
            execute: (args) => args.rootValue.execute(args),
            subscribe: (args) => args.rootValue.subscribe(args),
            onSubscribe: async (ctx, msg) => {
                const { parse, validate, contextFactory, execute, schema, subscribe, } = getEnveloped({
                    connectionParams: ctx.connectionParams,
                    normalizedConnectionParams: (0, grafserv_1.normalizeConnectionParams)(ctx.connectionParams),
                    socket: ctx.extra.socket,
                    request: ctx.extra.request,
                });
                const args = {
                    schema,
                    operationName: msg.payload.operationName,
                    document: parse(msg.payload.query),
                    variableValues: msg.payload.variables,
                    contextValue: await contextFactory(),
                    rootValue: {
                        execute,
                        subscribe,
                    },
                };
                const errors = validate(args.schema, args.document);
                if (errors.length)
                    return errors;
                return args;
            },
        }, wsServer);
    });
    console.log("Running a GraphQL API server at http://localhost:4000/graphql");
    // Keep alive forever.
    return new Promise(() => { });
})()
    .then(() => pool.end())
    .catch((e) => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=benjies-test-script.js.map