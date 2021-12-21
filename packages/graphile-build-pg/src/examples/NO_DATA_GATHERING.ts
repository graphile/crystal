/* eslint-disable no-restricted-syntax */
import type {
  PgExecutorContextPlans,
  PgSourceColumns,
  WithPgClient,
} from "@dataplan/pg";
import { TYPES } from "@dataplan/pg";
import { PgExecutor, PgSource, recordType } from "@dataplan/pg";
import { makeNodePostgresWithPgClient } from "@dataplan/pg/adaptors/node-postgres";
import chalk from "chalk";
import { readFile } from "fs/promises";
import {
  buildSchema,
  defaultPreset as graphileBuildPreset,
  QueryQueryPlugin,
} from "graphile-build";
import { context, crystalPrint, object } from "graphile-crystal";
import { EXPORTABLE, exportSchema } from "graphile-exporter";
import { resolvePresets } from "graphile-plugin";
import { graphql, printSchema } from "graphql";
import { Pool } from "pg";
import sql from "pg-sql2";
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
const withPgClient: WithPgClient = makeNodePostgresWithPgClient(pool);

async function main() {
  // Create our GraphQL schema by applying all the plugins
  const executor = new PgExecutor({
    name: "main",
    context: () =>
      object({
        pgSettings:
          context<GraphileEngine.GraphileResolverContext>().get("pgSettings"),
        withPgClient:
          context<GraphileEngine.GraphileResolverContext>().get("withPgClient"),
      } as PgExecutorContextPlans<any>),
  });
  const config = resolvePresets([
    {
      extends: [graphileBuildPreset, graphileBuildPgPreset],
      plugins: [QueryQueryPlugin],
    },
  ]);

  const appPublicForumsColumns: PgSourceColumns = {
    id: {
      codec: TYPES.uuid,
      notNull: true,
      extensions: {
        tags: {
          hasDefault: true,
        },
      },
    },
    name: {
      codec: TYPES.text,
      notNull: true,
    },
    archived_at: {
      codec: TYPES.timestamptz,
      notNull: false,
    },
  };
  const mainAppPublicForumsCodec = recordType(
    sql`app_public.forums`,
    appPublicForumsColumns,
    {
      tags: {
        name: "forums",
      },
    },
  );
  // We're crafting our own input
  const input: GraphileEngine.BuildInput = {
    pgSources: [
      new PgSource({
        //name: "main.app_public.forums",
        name: "forums",
        executor,
        source: sql`app_public.forums`,
        codec: mainAppPublicForumsCodec,
      }),
    ],
  };
  const schema = buildSchema(config, input);

  // Output our schema
  console.log(chalk.blue(printSchema(schema)));
  console.log();
  console.log();
  console.log();

  // Common GraphQL arguments
  const source = /* GraphQL */ `
    query {
      allForumsList {
        id
        name
        archivedAt
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
  console.log(inspect(result, { depth: Infinity, colors: true }));

  // Export schema
  // const exportFileLocation = new URL("../../temp.js", import.meta.url);
  const exportFileLocation = `${__dirname}/../../temp.mjs`;
  await exportSchema(schema, exportFileLocation);

  // output code
  console.log(chalk.green(await readFile(exportFileLocation, "utf8")));

  // run code
  const { schema: schema2 } = await import(exportFileLocation.toString());
  const result2 = await graphql({
    schema: schema2,
    source,
    rootValue,
    variableValues,
    contextValue,
  });
  console.log(inspect(result2, { depth: Infinity, colors: true }));
}

main()
  .then(() => pool.end())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
