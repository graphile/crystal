/* eslint-disable no-restricted-syntax */

/*
 * This is more a test script than an example, I've used it heavily whilst
 * developing so it has grown in scope and is a bit of a mess. Nonetheless it
 * demonstrates how to build a Graphile Build schema that leverages
 * dataplanner, @dataplan/pg, graphile-build-pg, envelop, fastify, helix, and
 * even has a mermaid-js endpoint for viewing the execution and output plan of
 * the latest query.
 */

import type { WithPgClient } from "@dataplan/pg";
import { makeNodePostgresWithPgClient } from "@dataplan/pg/adaptors/node-postgres";
import type { Plugin } from "@envelop/core";
import { envelop, useExtendContext, useSchema } from "@envelop/core";
import { useParserCache } from "@envelop/parser-cache";
import { useValidationCache } from "@envelop/validation-cache";
import {
  $$setPlanGraph,
  execute as dataplannerExecute,
  stripAnsi,
} from "dataplanner";
import type { FastifyReply, FastifyRequest } from "fastify";
import fastify from "fastify";
import fastifyStatic from "fastify-static";
import {
  buildInflection,
  buildSchema,
  defaultPreset as graphileBuildPreset,
  gather,
  QueryQueryPlugin,
  SwallowErrorsPlugin,
} from "graphile-build";
import { exportSchema } from "graphile-export";
import { resolvePresets } from "graphile-plugin";
import { graphql } from "graphql";
import {
  getGraphQLParameters,
  processRequest,
  renderGraphiQL,
  sendResult,
} from "graphql-helix";
import * as jsonwebtoken from "jsonwebtoken";
import { Pool } from "pg";
import { inspect } from "util";

import { defaultPreset as graphileBuildPgPreset } from "../index.js";

declare global {
  namespace GraphileEngine {
    interface GraphileResolverContext {
      pgSettings: {
        [key: string]: string;
      } | null;
      withPgClient: WithPgClient;
    }
  }
}

const pool = new Pool({
  connectionString: "pggql_test",
});
pool.on("error", (e) => {
  console.log("Client error", e);
});
const withPgClient: WithPgClient = makeNodePostgresWithPgClient(pool);

(async function () {
  // Create our GraphQL schema by applying all the plugins
  const config = resolvePresets([
    {
      extends: [graphileBuildPreset, graphileBuildPgPreset],
      plugins: [QueryQueryPlugin, SwallowErrorsPlugin],
      gather: {
        jwtType: ["b", "jwt_token"],
        pgDatabases: [
          {
            name: "main",
            schemas: ["a", "b", "c"],
            pgSettingsKey: "pgSettings",
            withPgClientKey: "withPgClient",
            withPgClient: withPgClient,
          },
        ],
      },
      schema: {
        pgJwtSecret: "secret",
      },
    },
  ]);

  // Perform the "inflection" phase
  const shared = { inflection: buildInflection(config) };

  // Perform the "data gathering" phase
  const input = await gather(config, shared);
  /*
  console.log("Sources:");
  console.log(
    "  " +
      input.pgSources
        .map(
          (s) => crystalPrint((s as any).name),
          // + ` => ${(s as any).extensions?.tags?.name}`,
        )
        .join("\n  "),
  );
  */

  // Perform the "schema build" phase
  const schema = buildSchema(config, input, shared);

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

  // This will store the latest plan graph for use by our mermaid-js endpoint;
  // we populate this by passing $$setPlanGraph as part of the context to our
  // GraphQL operation which will have DataPlanner populate it for us.
  let graph: string | null = null;
  const contextValue = {
    withPgClient,
    [$$setPlanGraph](_graph: string) {
      graph = _graph;
    },
  };

  // Our operation requires no variables
  const variableValues = {};

  // Run our query on our initial schema
  const result = await graphql({
    schema,
    source,
    rootValue,
    variableValues,
    contextValue,
  });

  if ("errors" in result) {
    console.log(inspect(result, { depth: 12, colors: true })); // { data: { random: 4 } }
    process.exit(1);
  }

  // Export the GraphQL schema to an executable file
  // const exportFileLocation = new URL("../../temp.js", import.meta.url);
  const exportFileLocation = `${__dirname}/../../temp.mjs`;
  await exportSchema(schema, exportFileLocation, {
    mode: "typeDefs",
    modules: {
      jsonwebtoken: jsonwebtoken,
    },
  });

  // output code
  //console.log(chalk.green(await readFile(exportFileLocation, "utf8")));

  // Import this exported schema so that we can test it
  const { schema: schema2 } = await import(exportFileLocation.toString());

  // Rerun the previous operation, using the freshly imported schema
  const result2 = await graphql({
    schema: schema2,
    source,
    rootValue,
    variableValues,
    contextValue,
  });

  if ("errors" in result2) {
    console.log(inspect(result2, { depth: 12, colors: true })); // { data: { random: 4 } }
    process.exit(1);
  }

  /**
   * An Envelop plugin that uses DataPlanner to prepare and execute the GraphQL
   * query.
   */
  const useDataPlanner = (): Plugin => ({
    async onExecute(opts) {
      opts.setExecuteFn(dataplannerExecute);
    },
  });

  /**
   * An Envelop plugin that will make any GraphQL errors easier to read from
   * inside of GraphiQL.
   */
  const useMoreDetailedErrors = (): Plugin => ({
    onExecute: () => ({
      onExecuteDone({ result }) {
        if ("errors" in result && result.errors) {
          (result.errors as any) = result.errors.map((e) => {
            const obj = e.toJSON();
            return Object.assign(obj, {
              message: stripAnsi(obj.message),
              extensions: { stack: stripAnsi(e.stack ?? "").split("\n") },
            });
          });
        }
      },
    }),
  });

  const contextCallback = () => contextValue;

  // Our envelop setup, with all the plugins we need
  const getEnveloped = envelop({
    plugins: [
      useSchema(schema),
      // Logger disabled on performance grounds (for benchmarking)
      // useLogger(),
      useParserCache(),
      useValidationCache(),
      useExtendContext(contextCallback),
      useDataPlanner(),
      useMoreDetailedErrors(),
    ],
  });

  // Create our fastify (server) app
  const app = fastify();

  /** Escaping of HTML entities for mermaid */
  function escapeHTMLEntities(str: string): string {
    return str.replace(
      /[&"<>]/g,
      (l) =>
        ({ "&": "&amp;", '"': "&quot;", "<": "&lt;", ">": "&gt;" }[l as any]),
    );
  }

  // Serve the mermaid-js resources
  app.register(fastifyStatic, {
    root: `${__dirname}/../../../../node_modules/mermaid/dist`,
  });

  // The root URL ('/') serves GraphiQL
  app.route({
    method: ["GET"],
    url: "/",
    async handler(req, res) {
      res.type("text/html").send(renderGraphiQL());
    },
  });

  // The '/plan' URL serves mermaid-js rendering our latest query plan
  app.route({
    method: ["GET"],
    url: "/plan",
    async handler(req, res) {
      res.type("text/html").send(`\
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Crystal Example</title>
</head>
<body>
<div class="mermaid">
${escapeHTMLEntities(graph ?? 'graph LR\nA["No query exists yet"]')}
</div>
<script src="/mermaid.js"></script>
<script>
  mermaid.initialize({ startOnLoad: true });
</script>
</body>
</html>
`);
    },
  });

  const setCORSHeaders = (req: FastifyRequest, res: FastifyReply) => {
    // We use 'res.raw' because that's what Helix uses and otherwise our
    // headers don't get set.
    res.raw.setHeader("Access-Control-Allow-Origin", "*");
    res.raw.setHeader("Access-Control-Allow-Methods", "HEAD, GET, POST");
    res.raw.setHeader(
      "Access-Control-Allow-Headers",
      [
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
      ].join(", "),
    );
    res.raw.setHeader(
      "Access-Control-Expose-Headers",
      ["X-GraphQL-Event-Stream"].join(", "),
    );
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
      const { parse, validate, contextFactory, execute, schema } = getEnveloped(
        {
          req,
        },
      );
      const request = {
        body: req.body,
        headers: req.headers,
        method: req.method,
        query: req.query,
      };
      const { operationName, query, variables } = getGraphQLParameters(request);

      // Here, we pass our custom functions to Helix, and it will take care of the rest.
      const result = await processRequest({
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

      sendResult(result, res.raw);
    },
  });

  app.listen(4000, () => {
    console.log(`GraphQL server is running...`);
  });
  console.log("Running a GraphQL API server at http://localhost:4000/graphql");

  // Keep alive forever.
  return new Promise(() => {});
})()
  .then(() => pool.end())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
