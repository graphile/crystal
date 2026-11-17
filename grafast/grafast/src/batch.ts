import type { GraphQLSchema } from "graphql";

import { isDev, noop } from "./dev.ts";
import type {
  BatchExecutor,
  BatchKeysetEquality,
  PromiseOrDirect,
} from "./interfaces.ts";
import { recordsMatch } from "./utils.ts";

/** Define once at module scope, or during schema construction. */
export function defineBatchExecutor<
  TOptions extends Record<string, unknown> | undefined,
  TKeyset,
  TResult,
>(
  executor: BatchExecutor<TOptions, TKeyset, TResult>,
): BatchExecutor<TOptions, TKeyset, TResult> {
  return executor;
}

type ExecutorRegistration = {
  executor: BatchExecutor<any, any, any>;
  warned: boolean;
};
const executorsBySchema = new WeakMap<
  GraphQLSchema,
  Map<string, ExecutorRegistration>
>();

function checkExecutor(
  schema: GraphQLSchema,
  executor: BatchExecutor<any, any, any>,
): void {
  let registry = executorsBySchema.get(schema);
  if (registry == null) {
    registry = new Map();
    executorsBySchema.set(schema, registry);
  }
  const registration = registry.get(executor.name);
  if (registration == null) {
    registry.set(executor.name, { executor, warned: false });
  } else if (registration.executor !== executor) {
    const message = `Batch executor '${executor.name}' has multiple definitions in the same schema. Define it once outside step execution and reuse the same executor object.`;
    if (isDev) {
      throw new Error(message);
    } else if (!registration.warned) {
      registration.warned = true;
      console.warn(message);
    }
  }
}

type BatchOptions = Record<string, unknown> | undefined;

// Strict keys retain the original value.
// Tuple/object keys use the terminal node of their canonical trie path.
type BatchCacheKey<TKeyset> = TKeyset | KeysetTrieNode;

interface PendingBatch<TKeyset, TResult> {
  deferred: PromiseWithResolvers<ReadonlyArray<TResult>>;
  /** Deduplicated original specifiers, passed to the callback. */
  keysets: TKeyset[];
  /** Corresponding canonical identities, used by the cache and pending maps. */
  cacheKeys: BatchCacheKey<TKeyset>[];
}

type BatchFamily<TOptions extends BatchOptions, TKeyset, TResult> = {
  executor: BatchExecutor<TOptions, TKeyset, TResult>;
  options: TOptions;
  cache: Map<BatchCacheKey<TKeyset>, TResult>;
  pending: Map<
    BatchCacheKey<TKeyset>,
    {
      batch: PendingBatch<TKeyset, TResult>;
      index: number;
    }
  >;
  queued?: PendingBatch<TKeyset, TResult>;
  keyIndex?: KeysetTrieNode;
};

type BatchMeta = Record<PropertyKey, unknown> & {
  [batchesSymbol]?: Map<
    BatchExecutor<any, any, any>,
    Map<BatchOptions, BatchFamily<any, any, any>>
  >;
};

const batchesSymbol = Symbol("Grafast batch caches");

type KeysetTrieNode = { children: Map<unknown, KeysetTrieNode> };

// Composite keys share a cache key when their parts match. Strict keys can use
// the cache Map directly, as in the original loader implementation.
function compositeCacheKey<TOptions extends BatchOptions, TKeyset, TResult>(
  family: BatchFamily<TOptions, TKeyset, TResult>,
  keyset: TKeyset,
  mode: BatchKeysetEquality,
): KeysetTrieNode {
  let node = (family.keyIndex ??= { children: new Map() });
  for (const part of keyParts(keyset, mode)) {
    let child = node.children.get(part);
    if (child == null) {
      child = { children: new Map() };
      node.children.set(part, child);
    }
    node = child;
  }
  return node;
}

function keyParts(
  keyset: unknown,
  mode: BatchKeysetEquality,
): readonly unknown[] {
  if (mode === "strict") {
    return [keyset];
  }
  if (mode === "tuple") {
    if (!Array.isArray(keyset)) {
      throw new Error("batch(..., 'tuple') requires array keysets");
    }
    return keyset;
  }
  if (typeof keyset !== "object" || keyset === null || Array.isArray(keyset)) {
    throw new Error("batch(..., 'object') requires object keysets");
  }
  return Object.keys(keyset)
    .sort()
    .flatMap((key) => [key, (keyset as Record<string, unknown>)[key]]);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function defaultOptionsMatch(
  left: Record<string, unknown> | undefined,
  right: Record<string, unknown> | undefined,
): boolean {
  return (
    left === right ||
    (left !== undefined && right !== undefined && recordsMatch(left, right))
  );
}

function findMatchingFamily<TOptions extends BatchOptions, TKeyset, TResult>(
  families: Map<TOptions, BatchFamily<TOptions, TKeyset, TResult>>,
  executor: BatchExecutor<TOptions, TKeyset, TResult>,
  options: TOptions,
): BatchFamily<TOptions, TKeyset, TResult> | undefined {
  const optionsMatch = executor.optionsMatch ?? defaultOptionsMatch;
  for (const [knownOptions, family] of families) {
    if (optionsMatch(knownOptions, options)) {
      // The family already retains the canonical options used by its callback.
      return family;
    }
  }
  return undefined;
}

/** @internal Used to implement `ExecutionDetails.batch`. */
export function batchInMeta<
  TOptions extends Record<string, unknown> | undefined,
  TKeyset,
  TResult,
>(
  schema: GraphQLSchema,
  metaByMetaKey: Record<PropertyKey, unknown>,
  executor: BatchExecutor<TOptions, TKeyset, TResult>,
  keysets: readonly TKeyset[],
  options?: TOptions,
): PromiseOrDirect<ReadonlyArray<TResult>> {
  if (isDev && options !== undefined && !isPlainObject(options)) {
    throw new Error(
      "Batch executor options must be a plain object, or omitted.",
    );
  }
  checkExecutor(schema, executor);
  const { keysetEquality } = executor;
  if (keysets.length === 0) {
    return [];
  }

  const typedMeta = metaByMetaKey as BatchMeta;
  let batches = typedMeta[batchesSymbol];
  if (batches == null) {
    typedMeta[batchesSymbol] = batches = new Map();
  }
  // Executor identity determines the options, keyset and result types of all
  // families stored under it; only the heterogeneous registry erases them.
  let families = batches.get(executor) as
    | Map<TOptions, BatchFamily<TOptions, TKeyset, TResult>>
    | undefined;
  // ExecutionDetails.batch requires options unless TOptions includes undefined.
  const batchOptions = options as TOptions;
  if (families == null) {
    families = new Map();
    batches.set(executor, families);
  }

  let family = families.get(batchOptions);
  if (family == null) {
    family = findMatchingFamily(families, executor, batchOptions);
    if (family == null) {
      family = {
        executor,
        options: batchOptions,
        cache: new Map(),
        pending: new Map(),
      };
      families.set(batchOptions, family);
    }
  }

  // Validate composite keys before queuing any work. A malformed later key
  // must not leave an earlier key's batch running without a caller.
  const cacheKeys: readonly BatchCacheKey<TKeyset>[] =
    keysetEquality === "strict"
      ? keysets
      : keysets.map((keyset) =>
          compositeCacheKey(family, keyset, keysetEquality),
        );
  const { cache, pending } = family;
  const batch = new Map<PendingBatch<TKeyset, TResult>, number[]>();
  const results: TResult[] = [];
  for (let i = 0; i < keysets.length; i++) {
    const spec = cacheKeys[i];
    if (cache.has(spec)) {
      results.push(cache.get(spec)!);
    } else {
      // We'll fill this in in a minute.
      const targetIndex = results.push(null as TResult) - 1;
      let entry = pending.get(spec);
      if (entry === undefined) {
        let loadBatch = family.queued;
        if (loadBatch == null) {
          const deferred = Promise.withResolvers<ReadonlyArray<TResult>>();
          deferred.promise.catch(noop); // Guard against unhandledPromiseRejection
          loadBatch = { deferred, keysets: [], cacheKeys: [] };
          family.queued = loadBatch;
          const currentFamily = family;
          const currentBatch = loadBatch;
          queueMicrotask(() => {
            // Don't allow adding anything else to this batch.
            currentFamily.queued = undefined;
            void executeBatch(currentFamily, currentBatch);
          });
        }
        const index = loadBatch.keysets.push(keysets[i]) - 1;
        loadBatch.cacheKeys.push(spec);
        entry = { batch: loadBatch, index };
        pending.set(spec, entry);
      }
      let indexes = batch.get(entry.batch);
      if (indexes == null) {
        indexes = [];
        batch.set(entry.batch, indexes);
      }
      // Pairs of source index in the pending batch and target result index.
      indexes.push(entry.index, targetIndex);
    }
  }
  if (batch.size > 0) {
    return (async () => {
      // Usually there is just one batch. If a call also references older
      // in-flight batches, observe all failures without waiting on them in turn.
      const loadBatches = [...batch.keys()];
      const allLoadResults =
        loadBatches.length === 1
          ? [await loadBatches[0].deferred.promise]
          : await Promise.all(
              loadBatches.map(({ deferred }) => deferred.promise),
            );
      let batchIndex = 0;
      for (const indexes of batch.values()) {
        const loadResults = allLoadResults[batchIndex++];
        for (let i = 0; i < indexes.length; i += 2) {
          const pendingIndex = indexes[i];
          const targetIndex = indexes[i + 1];
          results[targetIndex] = loadResults[pendingIndex];
        }
      }
      return results;
    })();
  }
  return results;
}

async function executeBatch<TOptions extends BatchOptions, TKeyset, TResult>(
  family: BatchFamily<TOptions, TKeyset, TResult>,
  loadBatch: PendingBatch<TKeyset, TResult>,
): Promise<void> {
  const { deferred, keysets, cacheKeys } = loadBatch;
  try {
    const loadResults = await family.executor.callback(family.options, keysets);
    if (loadResults.length !== keysets.length) {
      throw new Error(
        `batch callback returned ${loadResults.length} results for ${keysets.length} keysets`,
      );
    }
    for (let pendingIndex = 0; pendingIndex < keysets.length; pendingIndex++) {
      const spec = cacheKeys[pendingIndex];
      family.cache.set(spec, loadResults[pendingIndex]);
      family.pending.delete(spec);
    }
    deferred.resolve(loadResults);
  } catch (error) {
    for (const spec of cacheKeys) {
      family.pending.delete(spec);
    }
    deferred.reject(error);
  }
}
