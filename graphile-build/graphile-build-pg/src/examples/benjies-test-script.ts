/* eslint-disable no-restricted-syntax */

/*
 * This is more a test script than an example, I've used it heavily whilst
 * developing so it has grown in scope and is a bit of a mess. Nonetheless it
 * demonstrates how to build a Graphile Build schema that leverages
 * grafast, @dataplan/pg, graphile-build-pg, envelop, fastify, helix, and
 * ruru for viewing the execution and output plan of the latest
 * query.
 */

import type { WithPgClient } from "@dataplan/pg";
import { envelop, useExtendContext, useSchema } from "@envelop/core";
import { useParserCache } from "@envelop/parser-cache";
import { useValidationCache } from "@envelop/validation-cache";
import type { FastifyReply, FastifyRequest } from "fastify";
import fastify from "fastify";
import { useGrafast, useMoreDetailedErrors } from "grafast/envelop";
import {
  buildInflection,
  buildSchema,
  defaultPreset as graphileBuildPreset,
  gather,
  QueryQueryPlugin,
  SwallowErrorsPlugin,
} from "graphile-build";
import { resolvePresets } from "graphile-config";
import { exportSchema } from "graphile-export";
import { graphql } from "graphql";
import {
  getGraphQLParameters,
  processRequest,
  sendResult,
} from "graphql-helix";
import { useServer } from "graphql-ws/lib/use/ws";
import * as jsonwebtoken from "jsonwebtoken";
import { Pool } from "pg";
import { inspect } from "util";
import * as ws from "ws";

import { defaultPreset as graphileBuildPgPreset } from "../index.js";
import { getWithPgClientFromPgService } from "../pgServices.js";

declare global {
  namespace Grafast {
    interface Context {
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

(async function () {
  // Create our GraphQL schema by applying all the plugins
  const config = resolvePresets([
    {
      extends: [graphileBuildPreset, graphileBuildPgPreset],
      plugins: [QueryQueryPlugin, SwallowErrorsPlugin],
      pgServices: [
        {
          name: "main",
          schemas: ["a", "b", "c"],
          pgSettingsKey: "pgSettings",
          withPgClientKey: "withPgClient",
          adaptor: "@dataplan/pg/adaptors/pg",
          adaptorSettings: {
            pool,
          },
        },
      ],
      gather: {
        pgJwtType: ["b", "jwt_token"],
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
      input.pgRegistry.pgResources
        .map(
          (s) => grafastPrint((s as any).name),
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

  const contextValue = {
    withPgClient: getWithPgClientFromPgService(config.pgServices![0]!),
  };

  // Our operation requires no variables
  const variableValues = Object.create(null);

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
      useGrafast(),
      useMoreDetailedErrors(),
    ],
  });

  // Create our fastify (server) app
  const app = fastify();

  const { ruruHTML } = await import("ruru/server");

  // The root URL ('/') serves GraphiQL
  app.route({
    method: ["GET"],
    url: "/",
    exposeHeadRoute: true,
    async handler(req, res) {
      res.type("text/html").send(
        ruruHTML({
          endpoint: "/graphql",
        }),
      );
    },
  });

  // CORS headers to allow cross-origin requests; handy for connecting a remote
  // GraphiQL/similar.
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
        "X-GraphQL-Explain",
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
    const wsServer = new ws.Server({
      server: app.server,
      path: "/graphql",
    });

    useServer(
      {
        execute: (args: any) => args.rootValue.execute(args),
        subscribe: (args: any) => args.rootValue.subscribe(args),
        onSubscribe: async (ctx, msg) => {
          const {
            parse,
            validate,
            contextFactory,
            execute,
            schema,
            subscribe,
          } = getEnveloped({
            connectionParams: ctx.connectionParams,
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
          if (errors.length) return errors;

          return args;
        },
      },
      wsServer,
    );
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
