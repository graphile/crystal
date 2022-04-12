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
import type { Plugin as EnvelopPlugin } from "@envelop/core";
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

// You should set these to be the values you want to use for demonstration
const DATABASE_CONNECTION_STRING = "postgres:///pagila";
const DATABASE_SCHEMAS: string[] = ["public", "app_public"];

/* ************************************************************************** */
/* **                                                                      ** */
/* **         BELOW HERE IS WHERE THE CODE LIVES, ABOVE IS CONFIG          ** */
/* **                                                                      ** */
/* ************************************************************************** */

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

/**
 * An Envelop plugin that uses DataPlanner to prepare and execute the GraphQL
 * query.
 */
const useDataPlanner = (): EnvelopPlugin => ({
  async onExecute(opts) {
    opts.setExecuteFn(dataplannerExecute);
  },
});

/**
 * An Envelop plugin that will make any GraphQL errors easier to read from
 * inside of GraphiQL.
 */
const useMoreDetailedErrors = (): EnvelopPlugin => ({
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

const pool = new Pool({
  connectionString: DATABASE_CONNECTION_STRING,
});
pool.on("error", (e) => {
  console.log("Client error", e);
});
const withPgClient: WithPgClient = makeNodePostgresWithPgClient(pool);

const EnumManglingPlugin: Plugin = {
  name: "EnumManglingPlugin",
  description:
    "Mangles enum value names so that they're more likely to be compatible with GraphQL",
  version: "0.0.0",
  inflection: {
    replace: {
      // Help make enums more forgiving
      enumValue(previous, options, value, codec) {
        const base = previous?.call(this, value, codec) ?? value;
        return base
          .replace(/[^A-Za-z0-9_]+/g, "_")
          .replace(/^__+/, "_")
          .replace(/__+$/, "_");
      },
    },
  },
};

async function main() {
  // Our Graphile config pulling together plugins, presets and config options
  const config = resolvePresets([
    {
      extends: [graphileBuildPreset, graphileBuildPgPreset],
      plugins: [QueryQueryPlugin, SwallowErrorsPlugin, EnumManglingPlugin],
      gather: {
        pgDatabases: [
          {
            name: "main",
            schemas: DATABASE_SCHEMAS,
            pgSettingsKey: "pgSettings",
            withPgClientKey: "withPgClient",
            withPgClient: withPgClient,
          },
        ],
        // jwtType: ["public", "jwt_token"],
      },
      schema: {
        // pgJwtSecret: "secret",
      },
    },
  ]);

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
    console.log(`GraphQL server is running...`);
  });
  console.log("Running a GraphQL API server at http://localhost:4000/graphql");

  // Keep alive forever.
  return new Promise(() => {});
}

main()
  .then(() => pool.end())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
