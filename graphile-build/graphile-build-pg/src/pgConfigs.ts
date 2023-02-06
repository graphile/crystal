import type { PgClient, WithPgClient } from "@dataplan/pg";
import type { PromiseOrDirect } from "grafast";
import { defer, isPromiseLike } from "grafast";
import type { IncomingMessage } from "node:http";
import type { Socket } from "node:net";

import type { KeysOfType, PgAdaptor } from "./interfaces.js";

const isTest = process.env.NODE_ENV === "test";

declare global {
  namespace Grafast {
    interface PgDatabaseAdaptorOptions {
      /* This will be filled out via declaration merging */
    }
  }

  namespace GraphileConfig {
    /**
     * Details about the incoming GraphQL request - e.g. if it was sent over an
     * HTTP request, the request itself so headers can be interrogated.
     *
     * It's anticipated this will be expanded via declaration merging, e.g. if
     * your server is Koa then a `koaCtx` might be added.
     */
    interface GraphQLRequestContext {
      // TODO: add things like operationName, operation, etc?
      httpRequest?: IncomingMessage;
      socket?: Socket;
    }

    // TODO: rename
    interface PgDatabaseConfiguration<
      TAdaptor extends keyof Grafast.PgDatabaseAdaptorOptions = keyof Grafast.PgDatabaseAdaptorOptions,
    > {
      name: string;
      schemas?: string[];

      adaptor: TAdaptor;
      adaptorSettings?: Grafast.PgDatabaseAdaptorOptions[TAdaptor];

      /** The key on 'context' where the withPgClient function will be sourced */
      withPgClientKey: KeysOfType<
        GraphileBuild.GraphileResolverContext,
        WithPgClient
      >;
      listen?(topic: string): AsyncIterable<string>;

      /** Return settings to set in the session */
      pgSettings?: (
        graphqlRequestContext: GraphileConfig.GraphQLRequestContext,
      ) => { [key: string]: string } | null;

      /** Settings to set in the session that performs introspection (during gather phase) */
      pgSettingsForIntrospection?: { [key: string]: string } | null;

      /** The key on 'context' where the pgSettings for this DB will be sourced */
      pgSettingsKey?: KeysOfType<
        GraphileBuild.GraphileResolverContext,
        { [key: string]: string } | null
      >;
    }

    interface Preset {
      pgConfigs?: ReadonlyArray<PgDatabaseConfiguration>;
    }
  }
}

interface PgClientBySourceCacheValue {
  withPgClient: WithPgClient;
  retainers: number;
}

const withPgClientDetailsByConfigCache = new Map<
  GraphileConfig.PgDatabaseConfiguration,
  PromiseOrDirect<PgClientBySourceCacheValue>
>();

function reallyLoadAdaptor<
  TAdaptor extends keyof Grafast.PgDatabaseAdaptorOptions = keyof Grafast.PgDatabaseAdaptorOptions,
>(adaptorString: TAdaptor): PromiseOrDirect<PgAdaptor<TAdaptor>> {
  try {
    const adaptor = require(adaptorString);
    return adaptor?.createWithPgClient ? adaptor : adaptor?.default;
  } catch (e) {
    if (e.code === "ERR_REQUIRE_ESM") {
      const adaptorPromise = import(adaptorString);
      return adaptorPromise.then((adaptor) =>
        adaptor?.createWithPgClient ? adaptor : adaptor?.default,
      );
    } else {
      throw e;
    }
  }
}

const loadAdaptorCache = new Map<string, PromiseOrDirect<PgAdaptor<any>>>();
function loadAdaptor<
  TAdaptor extends keyof Grafast.PgDatabaseAdaptorOptions = keyof Grafast.PgDatabaseAdaptorOptions,
>(adaptorString: TAdaptor): PromiseOrDirect<PgAdaptor<TAdaptor>> {
  let cached = loadAdaptorCache.get(adaptorString);
  if (cached) {
    return cached;
  } else {
    const result = reallyLoadAdaptor(adaptorString);
    loadAdaptorCache.set(adaptorString, result);
    if (isPromiseLike(result)) {
      result.then(
        (resolved) => {
          loadAdaptorCache.set(adaptorString, resolved);
        },
        () => {},
      );
    }
    return result;
  }
}

/**
 * Get or build the 'withPgClient' callback function for a given database
 * config, caching it to make future lookups faster.
 */
export function getWithPgClientFromPgConfig(
  config: GraphileConfig.PgDatabaseConfiguration,
): PromiseOrDirect<WithPgClient> {
  const existing = withPgClientDetailsByConfigCache.get(config);
  if (existing) {
    if (isPromiseLike(existing)) {
      return existing.then((v) => {
        v.retainers++;
        return v.withPgClient;
      });
    } else {
      existing.retainers++;
      return existing.withPgClient;
    }
  } else {
    const promise = (async () => {
      const adaptor = await loadAdaptor(config.adaptor);
      const factory = adaptor?.createWithPgClient;
      if (typeof factory !== "function") {
        throw new Error(
          `'${config.adaptor}' does not look like a withPgClient adaptor - please ensure it exports a method called 'createWithPgClient'`,
        );
      }

      const originalWithPgClient = await factory(config.adaptorSettings);
      const withPgClient = ((...args) =>
        originalWithPgClient.apply(null, args)) as WithPgClient;
      const cachedValue: PgClientBySourceCacheValue = {
        withPgClient,
        retainers: 1,
      };
      let released = false;
      withPgClient.release = () => {
        cachedValue.retainers--;

        // To allow for other promises to resolve and add/remove from the retaininers, check after a tick
        setTimeout(
          () => {
            if (cachedValue.retainers === 0 && !released) {
              released = true;
              withPgClientDetailsByConfigCache.delete(config);
              return originalWithPgClient.release?.();
            }
            // TODO: this used to be zero, but that seems really inefficient...
            // Figure out why I did that?
            // }, 0);
          },
          isTest ? 500 : 5000,
        );
      };
      withPgClientDetailsByConfigCache.set(config, cachedValue);
      return cachedValue;
    })();
    if (!withPgClientDetailsByConfigCache.has(config)) {
      withPgClientDetailsByConfigCache.set(config, promise);
    }
    promise.catch(() => {
      withPgClientDetailsByConfigCache.delete(config);
    });
    return promise.then((v) => v.withPgClient);
  }
}

export async function withPgClientFromPgConfig<T>(
  config: GraphileConfig.PgDatabaseConfiguration,
  pgSettings: { [key: string]: string } | null,
  callback: (client: PgClient) => T | Promise<T>,
): Promise<T> {
  const withPgClientFromPgConfig = getWithPgClientFromPgConfig(config);
  const withPgClient = isPromiseLike(withPgClientFromPgConfig)
    ? await withPgClientFromPgConfig
    : withPgClientFromPgConfig;
  try {
    return await withPgClient(pgSettings, callback);
  } finally {
    withPgClient.release!();
  }
}

export async function listenWithPgClientFromPgConfig(
  config: GraphileConfig.PgDatabaseConfiguration,
  topic: string,
  callback: (event: any) => void,
): Promise<() => void> {
  const deferredUnlisten = defer<() => void>();
  withPgClientFromPgConfig(config, null, async (client) => {
    if (!client.listen) {
      throw new Error(`Client for '${config.name}' does not support listening`);
    }
    const keepalive = defer();
    const unlisten = await client.listen!(topic, callback);
    deferredUnlisten.resolve(() => {
      unlisten();
      keepalive.resolve();
    });
    return keepalive;
  }).catch((e) => deferredUnlisten.reject(e));
  return deferredUnlisten;
}

// We don't cache superuser withPgClients
export async function withSuperuserPgClientFromPgConfig<T>(
  config: GraphileConfig.PgDatabaseConfiguration,
  pgSettings: { [key: string]: string } | null,
  callback: (client: PgClient) => T | Promise<T>,
): Promise<T> {
  const adaptor = await loadAdaptor(config.adaptor);
  const withPgClient = await adaptor.createWithPgClient(
    config.adaptorSettings,
    "SUPERUSER",
  );
  try {
    return await withPgClient(pgSettings, callback);
  } finally {
    withPgClient.release?.();
  }
}
