import type { PgClient, PgExecutorContext, WithPgClient } from "./executor.ts";
import type { SharedPgClient, WithSharedPgClient } from "./sharedClient.ts";

type PromiseOrDirect<T> = T | PromiseLike<T>;

/** @experimental */
export interface PgAdaptor<
  TAdaptor extends
    keyof GraphileConfig.PgAdaptors = keyof GraphileConfig.PgAdaptors,
> {
  /** Every provider created by this adaptor exposes withSharedPgClient. */
  providesSharedPgClient?: boolean;
  createWithPgClient: (
    adaptorSettings: GraphileConfig.PgAdaptors[TAdaptor]["adaptorSettings"],
    variant?: "SUPERUSER" | string | null,
  ) => PromiseOrDirect<
    WithPgClient<GraphileConfig.PgAdaptors[TAdaptor]["client"]>
  >;
  makePgService: (
    options: GraphileConfig.PgAdaptors[TAdaptor]["makePgServiceOptions"],
  ) => GraphileConfig.PgServiceConfiguration<TAdaptor>;
}

/**
 * Is "thenable".
 */
export function isPromiseLike<T>(
  t: T | Promise<T> | PromiseLike<T>,
): t is PromiseLike<T> {
  return t != null && typeof (t as any).then === "function";
}

const isTest = process.env.NODE_ENV === "test";

interface PgClientBySourceCacheValue<
  TPgClient extends PgClient = GraphileConfig.DataplanPgClient,
> {
  withPgClient: WithPgClient<TPgClient>;
  retainers: number;
}

const withPgClientDetailsByConfigCache = new Map<
  GraphileConfig.PgServiceConfiguration<any>,
  PromiseOrDirect<PgClientBySourceCacheValue>
>();

/**
 * Get or build the 'withPgClient' callback function for a given database
 * config, caching it to make future lookups faster.
 */
export function getWithPgClientFromPgService<
  TAdaptor extends
    keyof GraphileConfig.PgAdaptors = keyof GraphileConfig.PgAdaptors,
>(
  config: GraphileConfig.PgServiceConfiguration<TAdaptor>,
): PromiseOrDirect<
  WithPgClient<GraphileConfig.PgAdaptors[TAdaptor]["client"]>
> {
  type TPgClient = GraphileConfig.PgAdaptors[TAdaptor]["client"];
  const existing = withPgClientDetailsByConfigCache.get(config);
  if (existing) {
    if (isPromiseLike(existing)) {
      return existing.then((v) => {
        v.retainers++;
        return v.withPgClient as WithPgClient<TPgClient>;
      });
    } else {
      existing.retainers++;
      return existing.withPgClient as WithPgClient<TPgClient>;
    }
  } else {
    const promise = (async () => {
      const factory = config.adaptor?.createWithPgClient;
      if (typeof factory !== "function") {
        throw new Error(
          `'${config.adaptor}' does not look like a withPgClient adaptor - please ensure it exports a method called 'createWithPgClient'`,
        );
      }

      const originalWithPgClient = await factory(config.adaptorSettings);
      const withPgClient = ((...args) =>
        originalWithPgClient.apply(null, args)) as WithPgClient;
      withPgClient.withSharedPgClient = originalWithPgClient.withSharedPgClient;
      const cachedValue: PgClientBySourceCacheValue = {
        withPgClient,
        retainers: 1,
      };
      let released = false;
      withPgClient.release = () => {
        cachedValue.retainers--;

        // To allow for other promises to resolve and add/remove from the retaininers, check after a tick
        const tid = setTimeout(
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
        tid.unref?.(); // Don't block process exit
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
    return promise.then((v) => v.withPgClient as WithPgClient<TPgClient>);
  }
}

async function withProviderFromPgService<T>(
  config: GraphileConfig.PgServiceConfiguration,
  callback: (provider: WithPgClient) => Promise<T>,
): Promise<T> {
  const result = getWithPgClientFromPgService(config);
  const provider = isPromiseLike(result) ? await result : result;
  try {
    return await callback(provider);
  } finally {
    provider.release!();
  }
}

export function withPgClientFromPgService<T>(
  config: GraphileConfig.PgServiceConfiguration,
  pgSettings: Record<string, string | undefined> | null,
  callback: (client: GraphileConfig.DataplanPgClient) => T | Promise<T>,
  signal?: AbortSignal,
): Promise<T> {
  return withProviderFromPgService(config, (provider) => {
    signal?.throwIfAborted();
    return provider(pgSettings, callback, signal);
  });
}

/** Use the adaptor's physical pool when the service has no explicit sharing configuration. */
export function withSharedPgClientFromPgService<T>(
  config: GraphileConfig.PgServiceConfiguration,
  context: PgExecutorContext,
  options: Parameters<WithSharedPgClient>[1],
  callback: (client: SharedPgClient) => T | Promise<T>,
): Promise<T> {
  return withProviderFromPgService(config, (provider) =>
    provider.withSharedPgClient!(context, options, callback),
  );
}

// We don't cache superuser withPgClients
export async function withSuperuserPgClientFromPgService<T>(
  config: GraphileConfig.PgServiceConfiguration,
  pgSettings: Record<string, string | undefined> | null,
  callback: (client: GraphileConfig.DataplanPgClient) => T | Promise<T>,
): Promise<T> {
  const withPgClient = await config.adaptor.createWithPgClient(
    config.adaptorSettings,
    "SUPERUSER",
  );
  try {
    return await withPgClient(pgSettings, callback);
  } finally {
    withPgClient.release?.();
  }
}
