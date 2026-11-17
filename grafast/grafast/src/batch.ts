import type { GraphQLSchema } from "graphql";

import { isDev, noop } from "./dev.ts";
import type {
  BatchExecutor,
  ExecutionResultValue,
  GrafastResultsList,
  PromiseOrDirect,
} from "./interfaces.ts";
import { isPojo, recordsMatch } from "./utils.ts";
import { flagError } from "./error.ts";

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
  if (registry === undefined) {
    registry = new Map();
    executorsBySchema.set(schema, registry);
  }
  const registration = registry.get(executor.name);
  if (registration === undefined) {
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

interface PendingBatch<TKeyset, TResult> {
  deferred: PromiseWithResolvers<ReadonlyArray<TResult>>;
  /** Deduplicated canonical specifiers, used by the callback and cache maps. */
  keysets: TKeyset[];
}

type BatchFamily<TOptions extends BatchOptions, TKeyset, TResult> = {
  executor: BatchExecutor<TOptions, TKeyset, TResult>;
  options: TOptions;
  cache: Map<TKeyset, TResult>;
  pending: Map<
    TKeyset,
    {
      batch: PendingBatch<TKeyset, TResult>;
      index: number;
    }
  >;
  queued?: PendingBatch<TKeyset, TResult>;
  tupleKeyIndex?: KeysetTrieNode<TKeyset>;
  objectKeyIndexes?: Map<string, KeysetTrieNode<TKeyset>>;
};

type BatchMeta = Record<PropertyKey, unknown> & {
  [batchesSymbol]?: Map<
    BatchExecutor<any, any, any>,
    Map<BatchOptions, BatchFamily<any, any, any>>
  >;
};

const batchesSymbol = Symbol("Grafast batch caches");

type KeysetTrieNode<TKeyset> = {
  children: Map<unknown, KeysetTrieNode<TKeyset>>;
  /** First keyset at this terminal node; subsequent lookups reuse its identity. */
  keyset: TKeyset | undefined;
};

function canonicalizeTuple<TKeyset>(
  node: KeysetTrieNode<TKeyset>,
  keyset: TKeyset,
): TKeyset {
  if (!Array.isArray(keyset)) {
    throw new Error("batch(..., 'tuple') requires array keysets");
  }
  for (const value of keyset) {
    let child = node.children.get(value);
    if (child === undefined) {
      child = { children: new Map(), keyset: undefined };
      node.children.set(value, child);
    }
    node = child;
  }
  return (node.keyset ??= keyset);
}

function canonicalizeObject<TKeyset>(
  indexes: Map<string, KeysetTrieNode<TKeyset>>,
  keyset: TKeyset,
): TKeyset {
  if (!isPojo(keyset)) {
    throw new Error("batch(..., 'object') requires object keysets");
  }
  const record = keyset as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  const shape = JSON.stringify(keys);
  let node = indexes.get(shape);
  if (node === undefined) {
    node = { children: new Map(), keyset: undefined };
    indexes.set(shape, node);
  }
  for (const key of keys) {
    const value = record[key];
    let child: KeysetTrieNode<TKeyset> | undefined = node.children.get(value);
    if (child === undefined) {
      child = { children: new Map(), keyset: undefined };
      node.children.set(value, child);
    }
    node = child;
  }
  return (node.keyset ??= keyset);
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
): PromiseOrDirect<ReadonlyArray<ExecutionResultValue<TResult>>> {
  if (isDev && options !== undefined && !isPojo(options)) {
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
  if (batches === undefined) {
    typedMeta[batchesSymbol] = batches = new Map();
  }
  // Executor identity determines the options, keyset and result types of all
  // families stored under it; only the heterogeneous registry erases them.
  let families = batches.get(executor) as
    | Map<TOptions, BatchFamily<TOptions, TKeyset, TResult>>
    | undefined;
  // ExecutionDetails.batch requires options unless TOptions includes undefined.
  const batchOptions = options as TOptions;
  if (families === undefined) {
    families = new Map();
    batches.set(executor, families);
  }

  // Get identical family
  let family = families.get(batchOptions);
  if (family === undefined) {
    // Identical family not found, get equivalent family
    family = findMatchingFamily(families, executor, batchOptions);
    if (family === undefined) {
      // Create my own family
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
  let canonicalKeysets: readonly TKeyset[];
  switch (keysetEquality) {
    case "strict": {
      canonicalKeysets = keysets;
      break;
    }
    case "tuple": {
      const index = (family.tupleKeyIndex ??= {
        children: new Map(),
        keyset: undefined,
      });
      canonicalKeysets = keysets.map((keyset) =>
        canonicalizeTuple(index, keyset),
      );
      break;
    }
    case "object": {
      const indexes = (family.objectKeyIndexes ??= new Map());
      canonicalKeysets = keysets.map((keyset) =>
        canonicalizeObject(indexes, keyset),
      );
      break;
    }
    default: {
      const never: never = keysetEquality;
      throw new Error(`Unknown keysetEquality: '${never}'`);
    }
  }
  const { cache, pending } = family;
  const batch = new Map<Promise<ReadonlyArray<TResult>>, number[]>();
  const results: ExecutionResultValue<TResult>[] = [];
  for (let i = 0; i < keysets.length; i++) {
    const spec = canonicalKeysets[i];
    if (cache.has(spec)) {
      results.push(cache.get(spec)!);
    } else {
      // Placeholder
      const targetIndex = results.push(null as TResult) - 1;

      let entry = pending.get(spec);
      if (entry === undefined) {
        let loadBatch = family.queued;
        if (loadBatch === undefined) {
          const deferred = Promise.withResolvers<ReadonlyArray<TResult>>();
          deferred.promise.catch(noop); // Guard against unhandledPromiseRejection
          loadBatch = { deferred, keysets: [] };
          family.queued = loadBatch;

          // Kick off the batch
          const currentFamily = family;
          const currentBatch = loadBatch;
          queueMicrotask(() => {
            // Don't allow adding anything else to this batch.
            currentFamily.queued = undefined;
            void executeBatch(currentFamily, currentBatch);
          });
        }
        const index = loadBatch.keysets.push(spec) - 1;
        entry = { batch: loadBatch, index };
        pending.set(spec, entry);
      }
      let indexes = batch.get(entry.batch.deferred.promise);
      if (indexes === undefined) {
        indexes = [];
        batch.set(entry.batch.deferred.promise, indexes);
      }
      // Pairs of source index in the pending batch and target result index.
      indexes.push(entry.index, targetIndex);
    }
  }
  if (batch.size === 0) {
    return results;
  } else {
    return (async () => {
      for (const [promise, indexes] of batch.entries()) {
        try {
          // Usually there is just one batch (one promise). I suspect it's
          // unlikely that there will often be sufficiently many that switching
          // to `Promise.allSettled` would be worthwhile.
          const loadResults = await promise;
          for (let i = 0; i < indexes.length; i += 2) {
            const pendingIndex = indexes[i];
            const targetIndex = indexes[i + 1];
            results[targetIndex] = loadResults[pendingIndex];
          }
        } catch (e) {
          const err = flagError(e);
          for (let i = 0; i < indexes.length; i += 2) {
            // const pendingIndex = indexes[i];
            const targetIndex = indexes[i + 1];
            results[targetIndex] = err;
          }
        }
      }
      return results;
    })();
  }
}

async function executeBatch<TOptions extends BatchOptions, TKeyset, TResult>(
  family: BatchFamily<TOptions, TKeyset, TResult>,
  loadBatch: PendingBatch<TKeyset, TResult>,
): Promise<void> {
  const { deferred, keysets } = loadBatch;
  try {
    const loadResults = await family.executor.callback(family.options, keysets);
    if (loadResults.length !== keysets.length) {
      throw new Error(
        `batch callback returned ${loadResults.length} results for ${keysets.length} keysets`,
      );
    }
    for (let pendingIndex = 0; pendingIndex < keysets.length; pendingIndex++) {
      const spec = keysets[pendingIndex];
      family.cache.set(spec, loadResults[pendingIndex]);
      family.pending.delete(spec);
    }
    deferred.resolve(loadResults);
  } catch (error) {
    for (const spec of keysets) {
      family.pending.delete(spec);
    }
    deferred.reject(error);
  }
}
