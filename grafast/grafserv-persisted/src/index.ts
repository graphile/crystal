import fsp from "node:fs/promises";

import type { PromiseOrDirect } from "grafast";
import { SafeError } from "grafast";
import type {
  ParsedGraphQLBody,
  ProcessGraphQLRequestBodyEvent,
} from "grafserv";
import type {} from "graphile-config";

export type { PersistedOperationGetter } from "./interfaces.js";
import LRU from "@graphile/lru";

import type { PersistedOperationGetter } from "./interfaces.js";
import { version } from "./version.js";

const PersistedPlugin: GraphileConfig.Plugin = {
  name: "PersistedPlugin",
  description: "Enables persisted operations in Grafserv",
  version,

  grafserv: {
    middlewares: {
      processGraphQLRequestBody(next, event) {
        const { body, resolvedPreset } = event;
        const options = resolvedPreset.grafserv;
        if (!options) {
          throw new SafeError(
            "Persisted operations misconfigured; rejecting requests.",
            { statusCode: 500 },
          );
        }
        const realQuery = persistedOperationFromPayload(
          body,
          options,
          shouldAllowUnpersistedOperation(options, event),
        );
        // Always overwrite
        if (realQuery != null && typeof realQuery !== "string") {
          return realQuery.then((q) => {
            if (typeof q === "string") {
              body.query = q;
            } else {
              throw new SafeError(
                "Persisted operations are enabled on this server, please provide an approved document id.",
                { statusCode: 400 },
              );
            }
          });
        } else {
          if (typeof realQuery === "string") {
            body.query = realQuery;
          } else {
            throw new SafeError(
              "Persisted operations are enabled on this server, please provide an approved document id.",
              { statusCode: 400 },
            );
          }
        }
        return next();
      },
    },
  },
};

export default PersistedPlugin;

/**
 * This fallback hashFromPayload method is compatible with Apollo Client and
 * Relay.
 */
function defaultHashFromPayload(payload: RequestPayload) {
  return (
    // https://github.com/apollographql/apollo-link-persisted-queries#protocol
    payload?.extensions?.persistedQuery?.sha256Hash ||
    // https://relay.dev/docs/en/persisted-queries#network-layer-changes
    payload?.documentId ||
    // Benjie's memory
    payload?.id
  );
}

/**
 * Given a cache object, returns a persisted operation getter that looks up the
 * given hash in said cache object.
 */
function persistedOperationGetterForCache(cache: { [key: string]: string }) {
  return (key: string) => cache[key];
}

function makeGetterForDirectory(
  directory: string,
  scanInterval: number | "watch" = -1,
) {
  // TODO: implement AbortController integration for timer, etc.
  const abortController = new AbortController();
  const { signal } = abortController;

  // NOTE: We periodically scan the folder to see what files it contains so
  // that we can reject requests to non-existent files to avoid DOS attacks
  // having us make lots of requests to the filesystem.

  let files: string[] | null = null;
  /** is scanDirectory active? */
  let scanning = false;
  /** Should we scan the directory again once the current scanDirectory is complete? */
  let scanAgain = false;

  /**
   * This function must never reject.
   */
  async function scanDirectory() {
    if (scanning) {
      scanAgain = true;
      return;
    }
    scanning = true;
    scanAgain = false;
    try {
      const allFiles = await fsp.readdir(directory);
      files = allFiles.filter((name) => name.endsWith(".graphql"));
    } catch (e) {
      console.error(`Error occurred whilst scanning '${directory}'`);
      console.error(e);
    } finally {
      scanning = false;
      if (scanInterval === "watch") {
        if (scanAgain) {
          scanDirectory();
        }
      } else if (typeof scanInterval === "number" && scanInterval >= 0) {
        // We don't know how long the scanning takes, so rather than setting an
        // interval, we wait for a scan to complete before kicking off the next
        // one.
        setTimeout(scanDirectory, scanInterval);
      }
    }
  }

  scanDirectory();
  if (scanInterval === "watch") {
    (async () => {
      try {
        const watcher = fsp.watch(directory, { signal, recursive: false });
        for await (const _event of watcher) {
          scanDirectory();
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error(
          `Error occurred whilst watching the persisted operations directory. Folder is no longer being watched. Recommend you restart your server (and file an issue explaining what happened).`,
        );
        console.error(err);
      }
    })();
  }

  const operationFromHash = new Map<
    string,
    Promise<string | null> | string | null
  >();
  function getOperationFromHash(hash: string): PromiseOrDirect<string | null> {
    if (!/^[a-zA-Z0-9_-]+$/.test(hash)) {
      throw new Error("Invalid hash");
    }
    let operation = operationFromHash.get(hash);
    if (!operation) {
      const filename = `${hash}.graphql`;
      if (files && !files.includes(filename)) {
        throw new Error(`Could not find file for hash '${hash}'`);
      }
      operation = fsp
        .readFile(`${directory}/${filename}`, "utf8")
        .catch(() => null);
      operationFromHash.set(hash, operation);
      // Once resolved, replace reference to string to avoid unnecessary ticks
      operation.then((operationText) => {
        operationFromHash.set(hash, operationText);
      });
    }
    return operation;
  }

  return { getter: getOperationFromHash, abortController };
}

const directoryGetterByDirectory = new Map<
  string,
  ReturnType<typeof makeGetterForDirectory>
>();

/**
 * Given a directory, get or make the persisted operations getter.
 */
function getterForDirectory(
  directory: string,
  scanInterval: number | "watch" | undefined,
) {
  const key = `${scanInterval}|${directory}`;
  let getter = directoryGetterByDirectory.get(key);
  if (!getter) {
    getter = makeGetterForDirectory(directory, scanInterval);
    directoryGetterByDirectory.set(key, getter);
  }
  return getter;
}

/**
 * Extracts or creates a persisted operation getter function from the
 * PostGraphile options.
 */
function getterFromOptionsCore(options: GraphileConfig.GrafservOptions) {
  const optionsSpecified = Object.keys(options).filter((key) =>
    [
      "persistedOperationsGetter",
      "persistedOperationsDirectory",
      "persistedOperations",
    ].includes(key),
  );
  if (optionsSpecified.length > 1) {
    // If you'd like support for more than one of these options; send a PR!
    throw new Error(
      `'${optionsSpecified.join(
        "' and '",
      )}' were specified, at most one of these operations can be specified.`,
    );
  }
  if (options.persistedOperationsGetter) {
    return options.persistedOperationsGetter;
  } else if (options.persistedOperations) {
    return persistedOperationGetterForCache(options.persistedOperations);
  } else if (options.persistedOperationsDirectory) {
    // TODO: do something with abortController? abortController.abort()
    const { getter, abortController: _abortController } = getterForDirectory(
      options.persistedOperationsDirectory,
      options.persistedOperationsDirectoryScanInterval,
    );
    return getter;
  } else {
    throw new Error(
      "Server misconfiguration issue: persisted operations (operation allowlist) is in place, but the server has not been told how to fetch the allowed operations. Please provide one of the persisted operations configuration options.",
    );
  }
}

const getterFromOptionsCache = new LRU<
  GraphileConfig.GrafservOptions,
  ReturnType<typeof getterFromOptionsCore>
>({
  maxLength: 100,
});

/**
 * Returns a cached getter for performance reasons.
 */
function getterFromOptions(options: GraphileConfig.GrafservOptions) {
  let getter = getterFromOptionsCache.get(options);
  if (!getter) {
    getter = getterFromOptionsCore(options);
    getterFromOptionsCache.set(options, getter);
  }
  return getter;
}

/**
 * The payload of the request would normally have
 * query/operationName/variables/extensions; but in persisted operations it may
 * have something else other than `query`. We've typed a few of the more common
 * versions, if this doesn't work for you you'll need to cast `payload as any`.
 */
interface RequestPayload extends ParsedGraphQLBody {
  /** As used by Relay https://relay.dev/docs/en/persisted-queries#network-layer-changes */
  documentId: string | undefined;

  /** Non-standard. */
  id: string | undefined;

  /** The actual query; we're generally expecting a hash via one of the methods above instead */
  query: string | undefined;

  /** GraphQL operation variables */
  variables: Record<string, unknown> | undefined;

  /** If the document contains more than one operation; the name of the one to execute. */
  operationName: string | undefined;

  /** As used by Apollo https://github.com/apollographql/apollo-link-persisted-queries#protocol */
  extensions:
    | {
        [key: string]: any;
        persistedQuery?: {
          [key: string]: any;
          sha256Hash?: string;
        };
      }
    | undefined;
}

function shouldAllowUnpersistedOperation(
  options: GraphileConfig.GrafservOptions,
  event: ProcessGraphQLRequestBodyEvent,
): boolean {
  const { allowUnpersistedOperation } = options;
  if (typeof allowUnpersistedOperation === "function") {
    return allowUnpersistedOperation(event);
  }
  return !!allowUnpersistedOperation;
}

/**
 * Given a payload, this method returns the GraphQL operation document
 * (string), or null on failure. It **never throws**.
 */
function persistedOperationFromPayload(
  payload: ParsedGraphQLBody,
  options: GraphileConfig.GrafservOptions,
  allowUnpersistedOperation: boolean,
): PromiseOrDirect<string | null> {
  try {
    const hashFromPayload = options.hashFromPayload || defaultHashFromPayload;
    const hash = hashFromPayload(payload as RequestPayload);
    if (typeof hash !== "string") {
      if (allowUnpersistedOperation && typeof payload?.query === "string") {
        return payload.query;
      }

      throw new Error(
        "We could not find a persisted operation hash string in the request.",
      );
    }
    const getter = getterFromOptions(options);
    return getter(hash);
  } catch (e) {
    console.error("Failed to get persisted operation from payload", payload, e);

    // We must not throw, instead just overwrite the query with null (the error
    // will be thrown elsewhere).
    return null;
  }
}

declare global {
  namespace GraphileConfig {
    interface GrafservOptions {
      /**
       * This function will be passed a GraphQL request object (normally
       * `{query: string, variables?: any, operationName?: string, extensions?: any}`,
       * but in the case of persisted operations it likely won't have a `query`
       * property), and must extract the hash to use to identify the persisted
       * operation. For Apollo Client, this might be something like:
       * `request?.extensions?.persistedQuery?.sha256Hash`; for Relay something
       * like: `request?.documentId`.
       */
      hashFromPayload?(request: ParsedGraphQLBody): string | undefined;

      /**
       * We can read persisted operations from a folder (they must be named
       * `<hash>.graphql`). When used in this way, the first request for a hash
       * will read the file, and then the result will be cached such that the
       * **filesystem read** will only impact the first use of that hash. We
       * periodically scan the folder for new files, requests for hashes that
       * were not present in our last scan of the folder will be rejected to
       * mitigate denial of service attacks asking for non-existent hashes.
       */
      persistedOperationsDirectory?: string;

      /**
       * How many milliseconds should we leave it between scans of the persisted
       * operations folder, checking for new files?
       *
       * Set this to the string "watch" to use `fs.watch` to monitor for changes. [EXPERIMENTAL].
       *
       * Set to `-1` to disable.
       *
       * Default: -1
       */
      persistedOperationsDirectoryScanInterval?: number | "watch";

      /**
       * An optional string-string key-value object defining the persisted
       * operations, where the keys are the hashes, and the values are the
       * operation document strings to use.
       */
      persistedOperations?: { [hash: string]: string };

      /**
       * If your known persisted operations may change over time, or you'd rather
       * load them on demand, you may supply this function. Note this function is
       * **performance critical** so you should use caching to improve
       * performance of any follow-up requests for the same hash.
       */
      persistedOperationsGetter?: PersistedOperationGetter;

      /**
       * There are situations where you may want to allow arbitrary operations
       * (for example using GraphiQL in development, or allowing an admin to
       * make arbitrary requests in production) whilst enforcing Persisted
       * Operations for the application and non-admin users. This function
       * allows you to determine under which circumstances persisted operations
       * may be bypassed.
       *
       * IMPORTANT: this function must not throw!
       *
       * @example
       *
       * ```
       * app.use(postgraphile(DATABASE_URL, SCHEMAS, {
       *   allowUnpersistedOperation(event) {
       *     return process.env.NODE_ENV === "development" && event.request?.getHeader('referer')?.endsWith("/graphiql");
       *   }
       * });
       * ```
       */
      allowUnpersistedOperation?:
        | boolean
        | ((event: ProcessGraphQLRequestBodyEvent) => boolean);
    }
  }
}
