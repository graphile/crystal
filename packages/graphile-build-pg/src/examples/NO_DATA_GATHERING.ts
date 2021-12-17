/* eslint-disable no-restricted-syntax */

import type { PgExecutorContextPlans, WithPgClient } from "@dataplan/pg";
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
import { exportSchema } from "graphile-exporter";
import { resolvePresets } from "graphile-plugin";
import { graphql, printSchema } from "graphql";
import { Pool } from "pg";
import sql from "pg-sql2";

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

  const appPublicForumsColumns = {};
  const mainAppPublicForumsCodec = recordType(
    sql`app_public.forums`,
    appPublicForumsColumns,
  );
  // We're crafting our own input
  const input: GraphileEngine.BuildInput = {
    pgSources: [
      new PgSource({
        name: "main.app_public.forums",
        executor,
        source: sql`app_public.forums`,
        codec: mainAppPublicForumsCodec,
        extensions: {
          tags: {
            name: "forums",
          },
        },
      }),
    ],
  };
  console.log(
    input.pgSources.map((s) => crystalPrint((s as any)._options)).join("\n"),
  );
  const schema = buildSchema(config, input);

  // Output our schema
  console.log(chalk.blue(printSchema(schema)));
  console.log();
  console.log();
  console.log();
  if (Math.random() < 2) process.exit(1);

  // Run our query
  const result = await graphql({
    schema,
    source: `
      query {
        random
      }
    `,
    rootValue: null,
    variableValues: {},
  });
  console.log(result); // { data: { random: 4 } }

  console.dir(schema.toConfig());

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
    source: `
      query {
        random
      }
    `,
    rootValue: null,
    variableValues: {},
  });
  console.log(result2); // { data: { random: 4 } }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
