import type { PgClient, WithPgClient } from "@dataplan/pg";
import type { PromiseOrDirect } from "grafast";
import { isPromiseLike } from "grafast";
import { pathToFileURL } from "node:url";

import type { PgAdaptor } from "./interfaces.js";

const isTest = process.env.NODE_ENV === "test";

interface PgClientBySourceCacheValue {
  withPgClient: WithPgClient;
  retainers: number;
}

const withPgClientDetailsByConfigCache = new Map<
  GraphileConfig.PgServiceConfiguration,
  PromiseOrDirect<PgClientBySourceCacheValue>
>();

function reallyLoadAdaptor<
  TAdaptor extends keyof GraphileConfig.PgDatabaseAdaptorOptions = keyof GraphileConfig.PgDatabaseAdaptorOptions,
>(adaptorString: TAdaptor): PromiseOrDirect<PgAdaptor<TAdaptor>> {
  try {
    const adaptor = require(adaptorString);
    return adaptor?.createWithPgClient ? adaptor : adaptor?.default;
  } catch (e) {
    if (e.code === "ERR_REQUIRE_ESM") {
      const importSpecifier = adaptorString.match(/^([a-z]:|\.\/|\/)/i)
        ? pathToFileURL(adaptorString).href
        : adaptorString;
      const adaptorPromise = import(importSpecifier);
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
  TAdaptor extends keyof GraphileConfig.PgDatabaseAdaptorOptions = keyof GraphileConfig.PgDatabaseAdaptorOptions,
>(adaptorString: TAdaptor): PromiseOrDirect<PgAdaptor<TAdaptor>> {
  const cached = loadAdaptorCache.get(adaptorString);
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
export function getWithPgClientFromPgService(
  config: GraphileConfig.PgServiceConfiguration,
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

export async function withPgClientFromPgService<T>(
  config: GraphileConfig.PgServiceConfiguration,
  pgSettings: { [key: string]: string } | null,
  callback: (client: PgClient) => T | Promise<T>,
): Promise<T> {
  const withPgClientFromPgService = getWithPgClientFromPgService(config);
  const withPgClient = isPromiseLike(withPgClientFromPgService)
    ? await withPgClientFromPgService
    : withPgClientFromPgService;
  try {
    return await withPgClient(pgSettings, callback);
  } finally {
    withPgClient.release!();
  }
}

// We don't cache superuser withPgClients
export async function withSuperuserPgClientFromPgService<T>(
  config: GraphileConfig.PgServiceConfiguration,
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
