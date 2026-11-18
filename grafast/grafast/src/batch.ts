import type { GraphQLSchema } from "graphql";

import { BatchOptionsIndex, getOptionsMatcher } from "./batchOptions.ts";
import type { BatchTupleIndex } from "./batchTupleIndex.ts";
import { internBatchTupleEntry } from "./batchTupleIndex.ts";
import { isDev, noop } from "./dev.ts";
import { flagError } from "./error.ts";
import type {
  BatchExecutor,
  ExecutionResultValue,
  PromiseOrDirect,
} from "./interfaces.ts";
import { isPojo, isPromiseLike } from "./utils.ts";

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
  entries?: CompositeEntry<TKeyset, TResult>[];
  /** Deduplicated canonical specifiers, used by the callback and cache maps. */
  keysets: TKeyset[];
}

interface CompositeEntry<K, R> {
  keyset: K;
  /** Undefined before queuing or after failure, null once the result is cached. */
  batch: PendingBatch<K, R> | null | undefined;
  index: number;
  result: R | undefined;
}

function createEntry<K, R>(keyset: K): CompositeEntry<K, R> {
  return { keyset, batch: undefined, index: -1, result: undefined };
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
  tupleKeyIndex?: BatchTupleIndex<CompositeEntry<TKeyset, TResult>>;
  objectKeyIndexes?: Map<string, KeysetTrieNode<TKeyset, TResult>>;
};

type BatchMeta = Record<PropertyKey, unknown> & {
  [batchesSymbol]?: Map<
    BatchExecutor<any, any, any>,
    BatchOptionsIndex<any, BatchFamily<any, any, any>>
  >;
};

const batchesSymbol = Symbol("Grafast batch caches");

type KeysetTrieNode<TKeyset, TResult> = {
  children?: Map<unknown, KeysetTrieNode<TKeyset, TResult>>;
  /** First keyset at this terminal node; subsequent lookups reuse its identity. */
  entry?: CompositeEntry<TKeyset, TResult>;
};

function canonicalizeTuple<TKeyset, TResult>(
  index: BatchTupleIndex<CompositeEntry<TKeyset, TResult>>,
  keyset: TKeyset,
): CompositeEntry<TKeyset, TResult> {
  if (!Array.isArray(keyset)) {
    throw new Error("batch(..., 'tuple') requires array keysets");
  }
  return internBatchTupleEntry(
    index,
    keyset,
    (entry) => entry.keyset as TKeyset & readonly unknown[],
    createEntry<TKeyset, TResult>,
  );
}

function canonicalizeObject<TKeyset, TResult>(
  indexes: Map<string, KeysetTrieNode<TKeyset, TResult>>,
  keyset: TKeyset,
): CompositeEntry<TKeyset, TResult> {
  if (!isPojo(keyset)) {
    throw new Error("batch(..., 'object') requires object keysets");
  }
  const record = keyset as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  const shape = JSON.stringify(keys);
  let node = indexes.get(shape);
  if (node === undefined) {
    node = {};
    indexes.set(shape, node);
  }
  for (const key of keys) {
    const value = record[key];
    const children: Map<
      unknown,
      KeysetTrieNode<TKeyset, TResult>
    > = (node.children ??= new Map());
    let child: KeysetTrieNode<TKeyset, TResult> | undefined =
      children.get(value);
    if (child === undefined) {
      child = {};
      children.set(value, child);
    }
    node = child;
  }
  return (node.entry ??= createEntry(keyset));
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
    | BatchOptionsIndex<TOptions, BatchFamily<TOptions, TKeyset, TResult>>
    | undefined;
  if (families === undefined) {
    families = new BatchOptionsIndex(
      getOptionsMatcher(executor.optionsMatch),
      (options: TOptions) => ({
        executor,
        options,
        cache: new Map(),
        pending: new Map(),
      }),
    );
    batches.set(executor, families);
  }
  // ExecutionDetails.batch requires options unless TOptions includes undefined.
  const family = families.getOrCreate(options as TOptions);

  // Validate composite keys before queuing any work. A malformed later key
  // must not leave an earlier key's batch running without a caller.
  let entries: CompositeEntry<TKeyset, TResult>[] | undefined;
  switch (keysetEquality) {
    case "strict": {
      break;
    }
    case "tuple": {
      const index = (family.tupleKeyIndex ??= new Map());
      entries = keysets.map((keyset) => canonicalizeTuple(index, keyset));
      break;
    }
    case "object": {
      const indexes = (family.objectKeyIndexes ??= new Map());
      entries = keysets.map((keyset) => canonicalizeObject(indexes, keyset));
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
    const composite = entries?.[i];
    const spec = composite === undefined ? keysets[i] : composite.keyset;
    if (composite === undefined ? cache.has(spec) : composite.batch === null) {
      results.push(
        composite === undefined ? cache.get(spec)! : composite.result!,
      );
    } else {
      // Placeholder
      const targetIndex = results.push(null as TResult) - 1;

      const existing = composite === undefined ? pending.get(spec) : composite;
      let batchForKey = existing?.batch;
      let sourceIndex = existing?.index;
      if (batchForKey == null) {
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
        batchForKey = loadBatch;
        sourceIndex = index;
        if (composite === undefined) {
          pending.set(spec, { batch: loadBatch, index });
        } else {
          composite.batch = loadBatch;
          composite.index = index;
          (loadBatch.entries ??= []).push(composite);
        }
      }
      let indexes = batch.get(batchForKey.deferred.promise);
      if (indexes === undefined) {
        indexes = [];
        batch.set(batchForKey.deferred.promise, indexes);
      }
      // Pairs of source index in the pending batch and target result index.
      indexes.push(sourceIndex!, targetIndex);
    }
  }
  if (batch.size === 0) {
    return results;
  } else {
    const promises: Promise<any>[] = [];
    for (const [promise, indexes] of batch.entries()) {
      promises.push(
        promise.then(
          (loadResults) => {
            for (let i = 0; i < indexes.length; i += 2) {
              const pendingIndex = indexes[i];
              const targetIndex = indexes[i + 1];
              results[targetIndex] = loadResults[pendingIndex];
            }
          },
          (e) => {
            const err = flagError(e);
            for (let i = 0; i < indexes.length; i += 2) {
              // const pendingIndex = indexes[i];
              const targetIndex = indexes[i + 1];
              results[targetIndex] = err;
            }
          },
        ),
      );
    }
    if (promises.length === 1) {
      return promises[0].then(() => results);
    } else {
      return Promise.all(promises).then(() => results);
    }
  }
}

function executeBatch<TOptions extends BatchOptions, TKeyset, TResult>(
  family: BatchFamily<TOptions, TKeyset, TResult>,
  loadBatch: PendingBatch<TKeyset, TResult>,
): PromiseOrDirect<void> {
  const { deferred, keysets } = loadBatch;
  try {
    const promiseOrValue = family.executor.callback(family.options, keysets);
    if (isPromiseLike(promiseOrValue)) {
      return promiseOrValue.then(processResults).then(null, handleError);
    } else {
      return processResults(promiseOrValue);
    }
  } catch (e) {
    handleError(e);
  }

  function processResults(loadResults: readonly TResult[]) {
    if (loadResults.length !== keysets.length) {
      // This path shouldn't happen, so expensively handle the case that
      // loadResults may include promises
      void Promise.all(loadResults).catch(noop);
      throw new Error(
        `batch callback returned ${loadResults.length} results for ${keysets.length} keysets`,
      );
    }
    for (let pendingIndex = 0; pendingIndex < keysets.length; pendingIndex++) {
      const spec = keysets[pendingIndex];
      const result = loadResults[pendingIndex];
      const entry = loadBatch.entries?.[pendingIndex];
      if (entry === undefined) {
        family.cache.set(spec, result);
        family.pending.delete(spec);
      } else {
        entry.result = result;
        entry.batch = null;
      }
      if (isPromiseLike(result)) {
        result.then(null, noop);
      }
    }
    deferred.resolve(loadResults);
  }
  function handleError(error: unknown) {
    if (loadBatch.entries !== undefined) {
      for (const entry of loadBatch.entries) {
        entry.batch = undefined;
        entry.result = undefined;
      }
    } else {
      for (const spec of keysets) {
        family.cache.delete(spec);
        family.pending.delete(spec);
      }
    }
    deferred.reject(error);
  }
}
