import "@dataplan/pg/adaptors/node-postgres";

import type { WithPgClient } from "@dataplan/pg";
import {
  buildInflection,
  buildSchema,
  gather,
  watchGather,
} from "graphile-build";
import { withPgClientFromPgSource } from "graphile-build-pg";
import { resolvePresets } from "graphile-config";
import * as pg from "pg";

const Pool = pg.Pool || (pg as any).default?.Pool;

import type { SchemaResult } from "./interfaces.js";
import { defaultPreset as postgraphilePreset } from "./preset.js";

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

export function makePgDatabasesFromConnectionString(
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

function makeConfigFromConnectionString(
  connectionString: string,
  schemas?: string | string[],
): GraphileConfig.Preset {
  const pgSources = makePgDatabasesFromConnectionString(
    connectionString,
    schemas,
  );

  // Create our GraphQL schema by applying all the plugins
  return {
    extends: [postgraphilePreset],
    pgSources,
    gather: {
      // jwtType: ["b", "jwt_token"],
    },
    schema: {
      // pgJwtSecret: "secret",
    },
  };
}

// TODO: should we move this to graphile-build-pg?
/**
 * @internal
 */
function makeContextCallback(config: GraphileConfig.ResolvedPreset) {
  return (graphqlRequestContext: GraphileConfig.GraphQLRequestContext) => {
    const contextValue: Record<string, any> = {};
    if (config.pgSources) {
      for (const pgSource of config.pgSources) {
        const { pgSettings, pgSettingsKey, withPgClientKey } = pgSource;
        if (pgSettings && pgSettingsKey == null) {
          throw new Error(
            `pgSource '${pgSource.name}' specifies pgSettings, but has no pgSettingsKey.`,
          );
        }
        if (pgSettingsKey != null) {
          if (pgSettingsKey in contextValue) {
            throw new Error(
              `Key '${pgSettingsKey}' already set on the context; refusing to overwrite - please check your configuration.`,
            );
          }
          if (pgSettings) {
            Object.assign(contextValue, {
              [pgSettingsKey]:
                typeof pgSettings === "function"
                  ? pgSettings(graphqlRequestContext)
                  : pgSettings,
            });
          } else {
            contextValue[pgSettingsKey] = undefined;
          }
        }
        if (withPgClientKey in contextValue) {
          throw new Error(
            `Key '${withPgClientKey}' already set on the context; refusing to overwrite - please check your configuration.`,
          );
        }
        contextValue[withPgClientKey] = withPgClientFromPgSource.bind(
          null,
          pgSource,
        );
      }
    }
    return contextValue;
  };
}

/**
 * Builds the GraphQL schema by resolving the preset, running inflection then
 * gather and building the schema. Returns the results.
 *
 * @experimental
 */
export async function makeSchema(
  preset: GraphileConfig.Preset,
): Promise<SchemaResult> {
  const config = resolvePresets([preset]);
  const shared = { inflection: buildInflection(config) };
  const input = await gather(config, shared);
  const schema = buildSchema(config, input, shared);
  const contextCallback = makeContextCallback(config);
  return { schema, config, contextCallback };
}

/**
 * Runs the "gather" phase in watch mode and calls 'callback' with the
 * generated SchemaResult each time a new schema is generated.
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
  callback: (error: Error | null, schema?: SchemaResult) => void,
): Promise<() => void> {
  const config = resolvePresets([preset]);
  const shared = { inflection: buildInflection(config) };
  const stopWatching = await watchGather(config, shared, (input, error) => {
    if (error) {
      callback(error);
    } else {
      const schema = buildSchema(config, input!, shared);
      const contextCallback = makeContextCallback(config);
      callback(null, { schema, config, contextCallback });
    }
  });
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
