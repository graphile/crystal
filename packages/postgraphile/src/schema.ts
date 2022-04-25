import type { WithPgClient } from "@dataplan/pg";
import { makeNodePostgresWithPgClient } from "@dataplan/pg/adaptors/node-postgres";
import { buildInflection, buildSchema, gather } from "graphile-build";
import type {} from "graphile-build-pg";
import type { Preset } from "graphile-plugin";
import { resolvePresets } from "graphile-plugin";
import * as pg from "pg";

const { Pool } = pg;

import type { ContextCallback, SchemaResult } from "./interfaces.js";
import { defaultPreset as postgraphilePreset } from "./preset.js";

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

export function makePgDatabasesAndContextFromConnectionString(
  connectionString: string,
  schemas?: string | string[],
): [GraphileEngine.GraphileBuildGatherOptions["pgDatabases"], ContextCallback] {
  const pool = new Pool({
    connectionString,
  });
  pool.on("error", (e) => {
    console.log("Client error", e);
  });
  const withPgClient: WithPgClient = makeNodePostgresWithPgClient(pool);
  const contextCallback: ContextCallback = () => ({ withPgClient });
  return [
    [
      {
        name: "main",
        schemas: Array.isArray(schemas) ? schemas : [schemas ?? "public"],
        pgSettingsKey: "pgSettings",
        withPgClientKey: "withPgClient",
        withPgClient,
      },
    ],
    contextCallback,
  ];
}

function makeConfigFromConnectionString(
  connectionString: string,
  schemas?: string | string[],
): [Preset, ContextCallback] {
  const [pgDatabases, contextCallback] =
    makePgDatabasesAndContextFromConnectionString(connectionString, schemas);

  // Create our GraphQL schema by applying all the plugins
  return [
    {
      extends: [postgraphilePreset],
      gather: {
        // jwtType: ["b", "jwt_token"],
        pgDatabases,
      },
      schema: {
        // pgJwtSecret: "secret",
      },
    },
    contextCallback,
  ];
}

export async function makeSchema(
  preset: Preset,
  contextCallback: ContextCallback,
): Promise<SchemaResult>;
export async function makeSchema(
  connectionString: string,
  schemas?: string | string[],
): Promise<SchemaResult>;
export async function makeSchema(
  connectionStringOrPreset: string | Preset,
  schemasOrContextCallback: string | string[] | ContextCallback | undefined,
): Promise<SchemaResult> {
  const [preset, contextCallback] =
    typeof connectionStringOrPreset === "string"
      ? makeConfigFromConnectionString(
          connectionStringOrPreset,
          schemasOrContextCallback as string | string[] | undefined,
        )
      : [connectionStringOrPreset, schemasOrContextCallback as ContextCallback];
  const config = resolvePresets([preset]);
  const shared = { inflection: buildInflection(config) };
  const input = await gather(config, shared);
  const schema = buildSchema(config, input, shared);
  return { schema, config, contextCallback };
}

/*
import { exportSchema } from "graphile-export";

  const exportFileLocation = `${__dirname}/../../temp.mjs`;
  await exportSchema(schema, exportFileLocation, {
    mode: "typeDefs",
    modules: {
      jsonwebtoken: jsonwebtoken,
    },
  });
  const { schema: schema2 } = await import(exportFileLocation.toString());
  */
