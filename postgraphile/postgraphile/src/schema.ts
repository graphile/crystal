import "@dataplan/pg/adaptors/node-postgres";

import type { WithPgClient } from "@dataplan/pg";
import {
  buildInflection,
  buildSchema,
  gather,
  watchGather,
} from "graphile-build";
import { resolvePresets } from "graphile-config";
import * as pg from "pg";

const Pool = pg.Pool || (pg as any).default?.Pool;

import type { ServerParams } from "grafserv";

declare global {
  namespace GraphileBuild {
    interface GraphileResolverContext {
      pgSettings: {
        [key: string]: string;
      } | null;
      withPgClient: WithPgClient;
    }
  }
}

export function makePgSources(
  connectionString?: string,
  schemas?: string | string[],
): ReadonlyArray<GraphileConfig.PgDatabaseConfiguration> {
  const pool = new Pool({
    connectionString,
  });
  pool.on("error", (e) => {
    console.log("Client error", e);
  });
  const source: GraphileConfig.PgDatabaseConfiguration = {
    name: "main",
    schemas: Array.isArray(schemas) ? schemas : [schemas ?? "public"],
    pgSettingsKey: "pgSettings",
    withPgClientKey: "withPgClient",
    adaptor: "@dataplan/pg/adaptors/node-postgres",
    adaptorSettings: {
      pool,
    },
  };
  return [source];
}

/**
 * Builds the GraphQL schema by resolving the preset, running inflection then
 * gather and building the schema. Returns the results.
 *
 * @experimental
 */
export async function makeSchema(
  preset: GraphileConfig.Preset,
): Promise<ServerParams> {
  const resolvedPreset = resolvePresets([preset]);
  const shared = { inflection: buildInflection(resolvedPreset) };
  const input = await gather(resolvedPreset, shared);
  const schema = buildSchema(resolvedPreset, input, shared);
  return { schema, resolvedPreset };
}

/**
 * Runs the "gather" phase in watch mode and calls 'callback' with the
 * generated ServerParams each time a new schema is generated.
 *
 * It is guaranteed that `callback` will be called at least once before the
 * promise resolves.
 *
 * Returns a function that can be called to stop watching.
 *
 * @experimental
 */
export async function watchSchema(
  preset: GraphileConfig.Preset,
  callback: (error: Error | null, params?: ServerParams) => void,
): Promise<() => void> {
  const resolvedPreset = resolvePresets([preset]);
  const shared = { inflection: buildInflection(resolvedPreset) };
  const stopWatching = await watchGather(
    resolvedPreset,
    shared,
    (input, error) => {
      if (error) {
        callback(error);
      } else {
        const schema = buildSchema(resolvedPreset, input!, shared);
        callback(null, { schema, resolvedPreset });
      }
    },
  );
  return stopWatching;
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
