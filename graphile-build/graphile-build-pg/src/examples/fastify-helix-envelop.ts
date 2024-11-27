/* eslint-disable no-restricted-syntax */

/*
 * This shows how to build a GraphQL schema from plugins (PostGraphile-like)
 * and then serve it from a Fastify webserver using Helix and Envelop.
 *
 * We serve:
 *
 * / - Ruru (GraphiQL)
 * /graphql - the GraphQL API
 */

import { envelop, useExtendContext, useSchema } from "@envelop/core";
import { useParserCache } from "@envelop/parser-cache";
import { useValidationCache } from "@envelop/validation-cache";
import chalk from "chalk";
import fastify from "fastify";
import { useGrafast, useMoreDetailedErrors } from "grafast/envelop";
import { buildInflection, buildSchema, gather } from "graphile-build";
import { resolvePreset } from "graphile-config";
import {
  getGraphQLParameters,
  processRequest,
  sendResult,
} from "graphql-helix";

import { getPool, makeSharedPresetAndClient } from "./config.js";

const pool = getPool();

async function main() {
  // Get our preset and withPgClient function (common across examples)
  const { preset, withPgClient } = await makeSharedPresetAndClient(pool);

  // ---------------------------------------------------------------------------
  // Resolve the preset(s)

  /** Our final resolved preset; containing all plugins and configs */
  const config = resolvePreset(preset);

  // ---------------------------------------------------------------------------
  // Perform the "inflection" phase

  /** Shared data used across other phases. Mostly inflection at this point */
  const shared = { inflection: buildInflection(config) };

  // ---------------------------------------------------------------------------
  // Perform the "data gathering" phase

  /** The result of the gather phase, ready to feed into 'buildSchema' */
  const input = await gather(config, shared);

  // NOTE: at this point `input.pgRegistry.pgResources` contains all your
  // Postgres sources (tables, views, functions, etc).

  // ---------------------------------------------------------------------------
  // Perform the "schema build" phase

  /** Our executable GraphQL schema */
  const schema = buildSchema(config, input, shared);

  // 'schema' is now an executable GraphQL schema. You could print it with:
  // console.log(chalk.blue(printSchema(schema)));

  // ---------------------------------------------------------------------------
  // Now we set about creating our GraphQL server

  /** Our GraphQL context, saying how to communicate with Postgres. */
  const contextValue = {
    withPgClient,
  };

  /** Our envelop setup, with all the plugins we need */
  const getEnveloped = envelop({
    plugins: [
      // Use our executable schema
      useSchema(schema),

      // Caching the parser results is critical for Grafast, otherwise it
      // must re-plan every GraphQL request!
      useParserCache(),
      useValidationCache(),

      // Our context says how to communicate with Postgres
      useExtendContext(() => contextValue),

      // This replaces graphql-js' `execute` with Grafast's own
      useGrafast(),

      // Useful for debugging; DO NOT USE IN PRODUCTION!
      useMoreDetailedErrors(),
    ],
  });

  /** Our fastify (server) app */
  const app = fastify();

  const { ruruHTML } = await import("ruru/server");

  // The root URL ('/') serves Ruru (GraphiQL)
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

  // The GraphQL route is at '/graphql' as usual
  app.route({
    method: ["POST"],
    url: "/graphql",
    async handler(req, res) {
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
    /* success */
  });
  console.log(`\


Running a GraphQL API server.
For Ruru (GraphQL IDE), see     ${chalk.blue.underline(
    "http://localhost:4000/",
  )}
Issue GraphQL queries via HTTP POST to  ${chalk.blue.underline(
    "http://localhost:4000/graphql",
  )}

`);

  // Keep alive forever.
  return new Promise(() => {});
}

main()
  .then(() => pool.end())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
