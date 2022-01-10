/* eslint-disable no-restricted-syntax */
import type {
  PgExecutorContextPlans,
  PgSourceColumns,
  WithPgClient,
} from "@dataplan/pg";
import { PgSourceBuilder } from "@dataplan/pg";
import { PgExecutor, recordType, TYPES } from "@dataplan/pg";
import { makeNodePostgresWithPgClient } from "@dataplan/pg/adaptors/node-postgres";
import chalk from "chalk";
import { readFile } from "fs/promises";
import {
  buildSchema,
  defaultPreset as graphileBuildPreset,
  QueryQueryPlugin,
} from "graphile-build";
import { context, object } from "graphile-crystal";
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
  const executor = EXPORTABLE(
    (PgExecutor, context, object) =>
      new PgExecutor({
        name: "main",
        context: () =>
          object({
            pgSettings:
              context<GraphileEngine.GraphileResolverContext>().get(
                "pgSettings",
              ),
            withPgClient:
              context<GraphileEngine.GraphileResolverContext>().get(
                "withPgClient",
              ),
          } as PgExecutorContextPlans<any>),
      }),
    [PgExecutor, context, object],
  );
  const config = resolvePresets([
    {
      extends: [graphileBuildPreset, graphileBuildPgPreset],
      plugins: [QueryQueryPlugin],
    },
  ]);

  const usersCodec = EXPORTABLE(
    (TYPES, recordType, sql) =>
      recordType(sql`app_public.users`, {
        id: {
          codec: TYPES.uuid,
          notNull: true,
          extensions: {
            tags: {
              hasDefault: true,
            },
          },
        },
        username: {
          codec: TYPES.text,
          notNull: true,
        },
        gravatar_url: {
          codec: TYPES.text,
          notNull: false,
        },
        created_at: {
          codec: TYPES.timestamptz,
          notNull: true,
        },
      }),
    [TYPES, recordType, sql],
  );

  const forumsCodec = EXPORTABLE(
    (TYPES, recordType, sql) =>
      recordType(
        sql`app_public.forums`,
        {
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
        },
        {
          tags: {
            name: "forums",
          },
        },
      ),
    [TYPES, recordType, sql],
  );

  const messagesCodec = EXPORTABLE(
    (TYPES, recordType, sql) =>
      recordType(sql`app_public.messages`, {
        id: {
          codec: TYPES.uuid,
          notNull: true,
          extensions: {
            tags: {
              hasDefault: true,
            },
          },
        },
        forum_id: {
          codec: TYPES.uuid,
          notNull: true,
        },
        author_id: {
          codec: TYPES.uuid,
          notNull: true,
        },
        body: {
          codec: TYPES.text,
          notNull: true,
        },
        featured: {
          codec: TYPES.boolean,
          notNull: true,
        },
        created_at: {
          codec: TYPES.timestamptz,
          notNull: true,
        },
        archived_at: {
          codec: TYPES.timestamptz,
          notNull: false,
        },
      }),
    [TYPES, recordType, sql],
  );

  const usersSourceBuilder = EXPORTABLE(
    (PgSourceBuilder, executor, usersCodec) =>
      new PgSourceBuilder({
        name: "users",
        executor,
        source: usersCodec.sqlType,
        codec: usersCodec,
        uniques: [["id"]],
      }),
    [PgSourceBuilder, executor, usersCodec],
  );

  const forumsSourceBuilder = EXPORTABLE(
    (PgSourceBuilder, executor, forumsCodec) =>
      new PgSourceBuilder({
        //name: "main.app_public.forums",
        name: "forums",
        executor,
        source: forumsCodec.sqlType,
        codec: forumsCodec,
        uniques: [["id"]],
      }),
    [PgSourceBuilder, executor, forumsCodec],
  );

  const messagesSourceBuilder = EXPORTABLE(
    (PgSourceBuilder, executor, messagesCodec) =>
      new PgSourceBuilder({
        name: "messages",
        executor,
        source: messagesCodec.sqlType,
        codec: messagesCodec,
        uniques: [["id"]],
      }),
    [PgSourceBuilder, executor, messagesCodec],
  );

  const usersSource = EXPORTABLE((messagesSourceBuilder, usersSourceBuilder) => usersSourceBuilder.build({
      relations: {
        messages: {
          source: messagesSourceBuilder,
          isUnique: false,
          localColumns: ["id"],
          remoteColumns: ["author_id"],
        },
      },
    }),
  [messagesSourceBuilder, usersSourceBuilder]);
  const forumsSource = EXPORTABLE((forumsSourceBuilder, messagesSourceBuilder) => forumsSourceBuilder.build({
      relations: {
        messages: {
          source: messagesSourceBuilder,
          isUnique: false,
          localColumns: ["id"],
          remoteColumns: ["forum_id"],
        },
      },
    }),
  [forumsSourceBuilder, messagesSourceBuilder]);
  const messagesSource = EXPORTABLE((forumsSource, messagesSourceBuilder, usersSource) => messagesSourceBuilder.build({
      relations: {
        author: {
          source: usersSource,
          isUnique: true,
          localColumns: ["author_id"],
          remoteColumns: ["id"],
        },
        forum: {
          source: forumsSource,
          isUnique: true,
          localColumns: ["forum_id"],
          remoteColumns: ["id"],
        },
      },
    }),
  [forumsSource, messagesSourceBuilder, usersSource]);

  // We're crafting our own input
  const input: GraphileEngine.BuildInput = {
    pgSources: [usersSource, forumsSource, messagesSource],
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
      allForums {
        nodes {
          id
          name
          archivedAt
        }
        edges {
          cursor
          node {
            id
            name
            archivedAt
          }
        }
      }
      allUsersList {
        id
        username
        gravatarUrl
        createdAt
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
