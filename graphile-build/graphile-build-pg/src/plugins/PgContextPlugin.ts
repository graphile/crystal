import type {} from "grafast";

import { version } from "../index.js";
import { withPgClientFromPgSource } from "../pgSources.js";

export const PgContextPlugin: GraphileConfig.Plugin = {
  name: "PgContextPlugin",
  description: "Extends the runtime GraphQL context with details needed",
  version: version,

  schema: {},

  grafast: {
    hooks: {
      args({ args, ctx, resolvedPreset: config }) {
        if (!args.contextValue) {
          args.contextValue = Object.create(null);
        }
        const contextValue = args.contextValue as Record<string, any>;
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
                      ? pgSettings(ctx)
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
        return args;
      },
    },
  },
};
