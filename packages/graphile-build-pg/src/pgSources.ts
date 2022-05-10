import { PgClient, WithPgClient } from "@dataplan/pg";
import { isPromiseLike, PromiseOrDirect } from "dataplanner";
import { KeysOfType } from "./interfaces";

declare global {
  namespace DataPlanner {
    interface PgDatabaseAdaptorOptions {
      /* This will be filled out via declaration merging */
    }
  }

  namespace GraphilePlugin {
    // TODO: rename
    interface PgDatabaseConfiguration<
      TAdaptor extends keyof DataPlanner.PgDatabaseAdaptorOptions = keyof DataPlanner.PgDatabaseAdaptorOptions,
    > {
      name: string;
      adaptor: TAdaptor;
      adaptorSettings?: DataPlanner.PgDatabaseAdaptorOptions[TAdaptor];
      schemas?: string[];

      /** The key on 'context' where the pgSettings for this DB will be sourced */
      pgSettingsKey?: KeysOfType<
        GraphileBuild.GraphileResolverContext,
        { [key: string]: string } | null
      >;
      /** The key on 'context' where the withPgClient function will be sourced */
      withPgClientKey: KeysOfType<
        GraphileBuild.GraphileResolverContext,
        WithPgClient
      >;

      listen?(topic: string): AsyncIterable<string>;
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
  GraphilePlugin.PgDatabaseConfiguration,
  PromiseOrDirect<PgClientBySourceCacheValue>
>();

/**
 * Get or build the 'withPgClient' callback function for a given database
 * source, caching it to make future lookups faster.
 */
export function getWithPgClientFromPgSource(
  source: GraphilePlugin.PgDatabaseConfiguration,
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
      withPgClient.release = () => {
        cachedValue.retainers--;

        // To allow for other promises to resolve and add/remove from the retaininers, check after a tick
        setTimeout(() => {
          if (cachedValue.retainers === 0) {
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
    promise.catch((e) => {
      pgClientBySourceCache.delete(source);
    });
    return promise.then((v) => v.withPgClient);
  }
}

export async function withPgClientFromPgSource<T>(
  source: GraphilePlugin.PgDatabaseConfiguration,
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
