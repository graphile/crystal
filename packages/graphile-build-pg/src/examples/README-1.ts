/* eslint-disable no-restricted-syntax */

import type { WithPgClient } from "@dataplan/pg";
import { makeNodePostgresWithPgClient } from "@dataplan/pg/adaptors/node-postgres";
import chalk from "chalk";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import { readFile } from "fs/promises";
import {
  buildInflection,
  buildSchema,
  defaultPreset as graphileBuildPreset,
  gather,
  QueryQueryPlugin,
  SwallowErrorsPlugin,
} from "graphile-build";
import { crystalPrint, stripAnsi } from "graphile-crystal";
import { exportSchema } from "graphile-exporter";
import { resolvePresets } from "graphile-plugin";
import { graphql, printSchema } from "graphql";
import { Pool } from "pg";
import { inspect } from "util";
import * as jsonwebtoken from "jsonwebtoken";

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
  const shared = { inflection: buildInflection(config) };
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
  const schema = buildSchema(config, input, shared);

  // Output our schema
  // console.log(chalk.blue(printSchema(schema)));
  console.log("");
  console.log("");
  console.log("");
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
  const rootValue = null;
  const contextValue = {
    withPgClient,
  };
  const variableValues = {};

  // Run our query
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

  // Export schema
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

  // run code
  const { schema: schema2 } = await import(exportFileLocation.toString());
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

  const app = express();
  app.use(
    "/graphql",
    graphqlHTTP({
      schema: schema2,
      graphiql: true,
      context: contextValue,
      pretty: true,
      customFormatErrorFn(e) {
        const obj = e.toJSON();
        return Object.assign(obj, {
          message: stripAnsi(obj.message),
          extensions: { stack: stripAnsi(e.stack ?? "").split("\n") },
        });
      },
    }),
  );
  app.listen(4000);
  console.log("Running a GraphQL API server at http://localhost:4000/graphql");
  // Keep alive forever.
  return new Promise(() => {});
})()
  .then(() => pool.end())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
