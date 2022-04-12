/* eslint-disable no-restricted-syntax */

/*
 * This shows how to build a GraphQL schema from plugins (PostGraphile-like)
 * and then serve it from a Fastify webserver using Helix and Envelop.
 *
 * We serve:
 *
 * / - GraphiQL
 * /graphql - the GraphQL API
 * /plan - the mermaid-js diagram of the plan for the last query executed
 */

import type { WithPgClient } from "@dataplan/pg";
import { makeNodePostgresWithPgClient } from "@dataplan/pg/adaptors/node-postgres";
import { envelop, useExtendContext, useSchema } from "@envelop/core";
import { useParserCache } from "@envelop/parser-cache";
import { useValidationCache } from "@envelop/validation-cache";
import LRU from "@graphile/lru";
import chalk from "chalk";
import {
  $$data,
  $$setPlanGraph,
  crystalPrint,
  dataplannerPrepare,
  execute as dataplannerExecute,
  stripAnsi,
} from "dataplanner";
import fastify from "fastify";
import fastifyStatic from "fastify-static";
import { readFile } from "fs/promises";
import {
  buildInflection,
  buildSchema,
  defaultPreset as graphileBuildPreset,
  gather,
  QueryQueryPlugin,
  SwallowErrorsPlugin,
} from "graphile-build";
import { exportSchema } from "graphile-exporter";
import type { Plugin } from "graphile-plugin";
import { resolvePresets } from "graphile-plugin";
import type { DocumentNode, Source } from "graphql";
import {
  execute,
  graphql,
  GraphQLError,
  parse,
  printSchema,
  validate,
} from "graphql";
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
import { makeSharedPresetAndClient } from "./config";
import { getPool } from "./config.js";
import { useDataPlanner, useMoreDetailedErrors } from "./utils/envelop.js";
import { mermaidTemplate } from "./utils/mermaid.js";

const pool = getPool();

async function main() {
  // Get our preset and withPgClient function (common across examples)
  const { preset, withPgClient } = makeSharedPresetAndClient(pool);

  // ---------------------------------------------------------------------------
  // Resolve the preset(s)

  /** Our final resolved preset; containing all plugins and configs */
  const config = resolvePresets([preset]);

  // ---------------------------------------------------------------------------
  // Perform the "inflection" phase

  /** Shared data used across other phases. Mostly inflection at this point */
  const shared = { inflection: buildInflection(config) };

  // ---------------------------------------------------------------------------
  // Perform the "data gathering" phase

  /** The result of the gather phase, ready to feed into 'buildSchema' */
  const input = await gather(config, shared);

  // NOTE: at this point `input.pgSources` contains all your
  // Postgres sources (tables, views, functions, etc).

  // ---------------------------------------------------------------------------
  // Perform the "schema build" phase

  /** Our executable GraphQL schema */
  const schema = buildSchema(config, input, shared);

  // 'schema' is now an executable GraphQL schema. You could print it with:
  // console.log(chalk.blue(printSchema(schema)));

  // ---------------------------------------------------------------------------
  // Now we set about creating our GraphQL server

  /**
   * This will store the latest plan graph in mermaid-js text format for use by
   * our mermaid-js endpoint. We populate this by passing $$setPlanGraph as
   * part of the context to our GraphQL operation which will have DataPlanner
   * populate it for us.
   */
  let graph: string | null = null;

  /**
   * Our GraphQL context, saying how to communicate with Postgres and where the
   * plan should be written to (for debugging).
   */
  const contextValue = {
    withPgClient,
    [$$setPlanGraph](_graph: string) {
      graph = _graph;
    },
  };

  /** Our envelop setup, with all the plugins we need */
  const getEnveloped = envelop({
    plugins: [
      // Use our executable schema
      useSchema(schema),

      // Caching the parser results is critical for DataPlanner, otherwise it
      // must re-plan every GraphQL request!
      useParserCache(),
      useValidationCache(),

      // Our context says how to communicate with Postgres
      useExtendContext(() => contextValue),

      // This replaces graphql-js' `execute` with DataPlanner's own
      useDataPlanner(),

      // Useful for debugging; DO NOT USE IN PRODUCTION!
      useMoreDetailedErrors(),
    ],
  });

  /** Our fastify (server) app */
  const app = fastify();

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
      res.type("text/html").send(mermaidTemplate(graph));
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
For GraphiQL (the GraphQL IDE), see     ${chalk.blue.underline(
    "http://localhost:4000/",
  )}
Issue GraphQL queries via HTTP POST to  ${chalk.blue.underline(
    "http://localhost:4000/graphql",
  )}
The latest GraphQL request's plan is at ${chalk.blue.underline(
    "http://localhost:4000/plan",
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
