import type {} from "grafast";

import type { WithPgClient } from "../executor.ts";
import type {} from "../interfaces.ts";
import {
  withPgClientFromPgService,
  withSharedPgClientFromPgService,
} from "../pgServices.ts";
import { version } from "../version.ts";

type SharedClientCache = WeakMap<
  GraphileConfig.PgServiceConfiguration,
  import("../sharedClient.ts").WithSharedPgClient
>;
const sharedClients: SharedClientCache = new WeakMap();
const watchSharedClients: SharedClientCache = new WeakMap();

export const EMPTY_OBJECT: Record<string, never> = Object.freeze(
  Object.create(null),
);

declare global {
  namespace GraphileConfig {
    interface Plugins {
      PgContextPlugin: true;
    }
  }
}

export const PgContextPlugin: GraphileConfig.Plugin = {
  name: "PgContextPlugin",
  description:
    "Extends the runtime GraphQL context with details needed to support your configured pgServices",
  version: version,

  grafast: {
    middleware: {
      prepareArgs(next, { args }) {
        if (!args.contextValue) {
          args.contextValue = Object.create(null);
        }
        const { resolvedPreset: config, requestContext: ctx } = args;
        const contextValue = args.contextValue as Record<string, any>;
        if (config?.pgServices) {
          for (const pgService of config.pgServices) {
            const {
              pgSettings,
              pgSettingsKey,
              withPgClientKey,
              pgSubscriberKey,
              pgSubscriber,
            } = pgService;
            if (pgSettings && pgSettingsKey == null) {
              throw new Error(
                `pgService '${pgService.name}' specifies pgSettings, but has no pgSettingsKey.`,
              );
            }
            if (pgSubscriber && pgSubscriberKey == null) {
              throw new Error(
                `pgService '${pgService.name}' specifies pgSubscriber, but has no pgSubscriberKey.`,
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
                  ? pgSettings(ctx ?? EMPTY_OBJECT)
                  : (pgSettings ?? undefined);
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
            const withPgClient: WithPgClient = (settings, callback, signal) =>
              withPgClientFromPgService(pgService, settings, callback, signal);
            const key = pgService.withSharedPgClientKey;
            if (pgService.sharedClientFactory) {
              const watch =
                (config as { grafserv?: { watch?: boolean } }).grafserv
                  ?.watch === true;
              const cache = watch ? watchSharedClients : sharedClients;
              let shared = cache.get(pgService);
              if (shared === undefined) {
                shared = pgService.sharedClientFactory(watch);
                cache.set(pgService, shared);
              }
              withPgClient.withSharedPgClient = shared;
            } else if (pgService.adaptor.providesSharedPgClient) {
              withPgClient.withSharedPgClient = (context, options, callback) =>
                withSharedPgClientFromPgService(
                  pgService,
                  context,
                  options,
                  callback,
                );
            }
            if (key != null && withPgClient.withSharedPgClient) {
              if (key in contextValue) {
                throw new Error("Duplicate PostgreSQL context key " + key);
              }
              contextValue[key] = withPgClient.withSharedPgClient;
            }
            contextValue[withPgClientKey] = withPgClient;
          }
        }
        return next();
      },
    },
  },
};
