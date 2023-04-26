import type { PromiseOrDirect } from "grafast";
import type { ParsedGraphQLBody, ProcessBodyEvent } from "grafserv";
import type {} from "graphile-config";
import fsp from "node:fs/promises";

import {} from "./interfaces.js";

const version = require("./package.json").version;

const PersistedPlugin: GraphileConfig.Plugin = {
  name: "PersistedPlugin",
  description: "Enables persisted operations in Grafserv",
  version,

  grafserv: {
    hooks: {
      init(info) {
        const options = info.resolvedPreset.grafserv;
        // In case there's a filesystem getter, this lets us get a head-start on
        // scanning the directory before the first request comes in.
        if (options) getterFromOptions(options);
      },
      processBody(info, event) {
        const { body } = event;
        const options = info.resolvedPreset.grafserv;
        if (!options) {
          throw Object.assign(
            new Error(
              "Persisted operations misconfigured; rejecting requests.",
            ),
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
            body.query = q;
          });
        } else {
          body.query = realQuery;
        }
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

function makeGetterForDirectory(directory: string) {
  // NOTE: We periodically scan the folder to see what files it contains so
  // that we can reject requests to non-existent files to avoid DOS attacks
  // having us make lots of requests to the filesystem.

  let files: string[] = [];

  /**
   * This function must never reject.
   */
  async function scanDirectory() {
    try {
      const allFiles = await fsp.readdir(directory);
      files = allFiles.filter((name) => name.endsWith(".graphql"));
    } catch (e) {
      console.error(`Error occurred whilst scanning '${directory}'`);
      console.error(e);
    } finally {
      // TODO: This interval should be configurable.
      // TODO: This might not be needed in production, and if so should be able to be disabled.
      // TODO: In dev watching the folder might be a better experience.

      // We don't know how long the scanning takes, so rather than setting an
      // interval, we wait 5 seconds between scans before kicking off the next
      // one.
      setTimeout(scanDirectory, 5000);
    }
  }

  scanDirectory();

  const operationFromHash = new Map<string, Promise<string> | string>();
  function getOperationFromHash(hash: string): PromiseOrDirect<string> {
    if (!/^[a-zA-Z0-9_-]+$/.test(hash)) {
      throw new Error("Invalid hash");
    }
    let operation = operationFromHash.get(hash);
    if (!operation) {
      const filename = `${hash}.graphql`;
      if (!files.includes(filename)) {
        throw new Error(`Could not find file for hash '${hash}'`);
      }
      operation = fsp.readFile(`${directory}/${filename}`, "utf8");
      operationFromHash.set(hash, operation);
      // Once resolved, replace reference to string to avoid unnecessary ticks
      operation
        .then((operationText) => {
          operationFromHash.set(hash, operationText);
        })
        .catch(() => {
          /* noop */
        });
    }
    return operation;
  }

  return getOperationFromHash;
}

const directoryGetterByDirectory = new Map<
  string,
  ReturnType<typeof makeGetterForDirectory>
>();

/**
 * Given a directory, get or make the persisted operations getter.
 */
function getterForDirectory(directory: string) {
  let getter = directoryGetterByDirectory.get(directory);
  if (!getter) {
    getter = makeGetterForDirectory(directory);
    directoryGetterByDirectory.set(directory, getter);
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
    return getterForDirectory(options.persistedOperationsDirectory);
  } else {
    throw new Error(
      "Server misconfiguration issue: persisted operations (operation allowlist) is in place, but the server has not been told how to fetch the allowed operations. Please provide one of the persisted operations configuration options.",
    );
  }
}

// TODO: use an LRU? For users using lots of new options objects this will
// cause a memory leak. But LRUs have a performance cost... Maybe switch to LRU
// once the size has grown?
const getterFromOptionsCache = new Map<
  GraphileConfig.GrafservOptions,
  ReturnType<typeof getterFromOptionsCore>
>();

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
  event: ProcessBodyEvent,
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
