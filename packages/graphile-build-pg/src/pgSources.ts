import type { PgClient, WithPgClient } from "@dataplan/pg";
import type { PromiseOrDirect } from "dataplanner";
import { defer, isPromiseLike } from "dataplanner";
import type { IncomingMessage } from "node:http";
import type { Socket } from "node:net";

import type { KeysOfType } from "./interfaces.js";

declare global {
  namespace DataPlanner {
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
      TAdaptor extends keyof DataPlanner.PgDatabaseAdaptorOptions = keyof DataPlanner.PgDatabaseAdaptorOptions,
    > {
      name: string;
      schemas?: string[];

      adaptor: TAdaptor;
      adaptorSettings?: DataPlanner.PgDatabaseAdaptorOptions[TAdaptor];

      /** The key on 'context' where the withPgClient function will be sourced */
      withPgClientKey: KeysOfType<
        GraphileBuild.GraphileResolverContext,
        WithPgClient
      >;
      listen?(topic: string): AsyncIterable<string>;

      /** Return settings to set in the session */
      pgSettings?: (
        graphqlRequestContext: GraphileConfig.GraphQLRequestContext,
      ) => object | null;

      /** The key on 'context' where the pgSettings for this DB will be sourced */
      pgSettingsKey?: KeysOfType<
        GraphileBuild.GraphileResolverContext,
        { [key: string]: string } | null
      >;
    }

    interface Preset {
      pgSources?: ReadonlyArray<PgDatabaseConfiguration>;
    }
  }
}

interface PgClientBySourceCacheValue {
  withPgClient: WithPgClient;
  retainers: number;
}

const pgClientBySourceCache = new Map<
  GraphileConfig.PgDatabaseConfiguration,
  PromiseOrDirect<PgClientBySourceCacheValue>
>();

/**
 * Get or build the 'withPgClient' callback function for a given database
 * source, caching it to make future lookups faster.
 */
export function getWithPgClientFromPgSource(
  source: GraphileConfig.PgDatabaseConfiguration,
): PromiseOrDirect<WithPgClient> {
  const existing = pgClientBySourceCache.get(source);
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
      const adaptor = await import(source.adaptor);
      const factory =
        adaptor?.createWithPgClient ?? adaptor?.default?.createWithPgClient;
      if (typeof factory !== "function") {
        throw new Error(
          `'${source.adaptor}' does not look like a withPgClient adaptor - please ensure it exports a method called 'createWithPgClient'`,
        );
      }
      const originalWithPgClient = await factory(source.adaptorSettings);
      const withPgClient: WithPgClient = (...args) =>
        originalWithPgClient.apply(null, args);
      const cachedValue: PgClientBySourceCacheValue = {
        withPgClient,
        retainers: 1,
      };
      let released = false;
      withPgClient.release = () => {
        cachedValue.retainers--;

        // To allow for other promises to resolve and add/remove from the retaininers, check after a tick
        setTimeout(() => {
          if (cachedValue.retainers === 0 && !released) {
            released = true;
            pgClientBySourceCache.delete(source);
            return originalWithPgClient.release();
          }
        }, 0);
      };
      pgClientBySourceCache.set(source, cachedValue);
      return cachedValue;
    })();
    if (!pgClientBySourceCache.has(source)) {
      pgClientBySourceCache.set(source, promise);
    }
    promise.catch(() => {
      pgClientBySourceCache.delete(source);
    });
    return promise.then((v) => v.withPgClient);
  }
}

export async function withPgClientFromPgSource<T>(
  source: GraphileConfig.PgDatabaseConfiguration,
  pgSettings: { [key: string]: string } | null,
  callback: (client: PgClient) => T | Promise<T>,
): Promise<T> {
  const withPgClientFromPgSource = getWithPgClientFromPgSource(source);
  const withPgClient = isPromiseLike(withPgClientFromPgSource)
    ? await withPgClientFromPgSource
    : withPgClientFromPgSource;
  try {
    return await withPgClient(pgSettings, callback);
  } finally {
    withPgClient.release!();
  }
}

export async function listenWithPgClientFromPgSource(
  source: GraphileConfig.PgDatabaseConfiguration,
  topic: string,
  callback: (event: any) => void,
): Promise<() => void> {
  const deferredUnlisten = defer<() => void>();
  withPgClientFromPgSource(source, null, async (client) => {
    if (!client.listen) {
      throw new Error(`Client for '${source.name}' does not support listening`);
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
