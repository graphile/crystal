import type {} from "grafast";

import { withPgClientFromPgConfig } from "../pgConfigs.js";
import { version } from "../version.js";

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
        if (config.pgConfigs) {
          for (const pgConfig of config.pgConfigs) {
            const {
              pgSettings,
              pgSettingsKey,
              withPgClientKey,
              pgSubscriberKey,
              pgSubscriber,
            } = pgConfig;
            if (pgSettings && pgSettingsKey == null) {
              throw new Error(
                `pgConfig '${pgConfig.name}' specifies pgSettings, but has no pgSettingsKey.`,
              );
            }
            if (pgSubscriber && pgSubscriberKey == null) {
              throw new Error(
                `pgConfig '${pgConfig.name}' specifies pgSubscriber, but has no pgSubscriberKey.`,
              );
            }
            if (pgSettingsKey != null) {
              if (pgSettingsKey in contextValue) {
                throw new Error(
                  `Key '${pgSettingsKey}' already set on the context; refusing to overwrite - please check your configuration.`,
                );
              }
              contextValue[pgSettingsKey] =
                typeof pgSettings === "function"
                  ? pgSettings(ctx)
                  : pgSettings ?? undefined;
            }
            if (pgSubscriberKey != null) {
              if (pgSubscriberKey in contextValue) {
                throw new Error(
                  `Key '${pgSubscriberKey}' already set on the context; refusing to overwrite - please check your configuration.`,
                );
              }
              contextValue[pgSubscriberKey] = pgSubscriber;
            }
            if (withPgClientKey in contextValue) {
              throw new Error(
                `Key '${withPgClientKey}' already set on the context; refusing to overwrite - please check your configuration.`,
              );
            }
            contextValue[withPgClientKey] = withPgClientFromPgConfig.bind(
              null,
              pgConfig,
            );
          }
        }
        return args;
      },
    },
  },
};
