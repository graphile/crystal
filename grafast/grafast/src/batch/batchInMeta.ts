import type { GraphQLSchema } from "graphql";

import { isDev, noop } from "../dev.ts";
import { flagError } from "../error.ts";
import type {
  BatchExecutor,
  ExecutionResultValue,
  PromiseOrDirect,
} from "../interfaces.ts";
import { isPojo } from "../utils.ts";
import type { BatchFamily, CompositeEntry } from "./batchInterfaces.ts";
import { BatchOptionsIndex, getOptionsMatcher } from "./batchOptions.ts";
import { canonicalizeObject, canonicalizeTuple } from "./canonicalize.ts";
import { checkExecutor } from "./checkExecutor.ts";
import { executeBatch } from "./executeBatch.ts";

type BatchMeta = Record<PropertyKey, unknown> & {
  [batchesSymbol]?: Map<
    BatchExecutor<any, any, any>,
    BatchOptionsIndex<any, BatchFamily<any, any, any>>
  >;
};

const batchesSymbol = Symbol("Grafast batch caches");

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
        queued: null,
        tupleKeyIndex: null,
        objectKeyIndexes: null,
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
      entries = [];
      for (let i = 0; i < keysets.length; i++) {
        entries.push(canonicalizeTuple(index, keysets[i]));
      }
      break;
    }
    case "object": {
      const indexes = (family.objectKeyIndexes ??= new Map());
      entries = [];
      for (let i = 0; i < keysets.length; i++) {
        entries.push(canonicalizeObject(indexes, keysets[i]));
      }
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
        if (loadBatch === null) {
          const deferred = Promise.withResolvers<ReadonlyArray<TResult>>();
          deferred.promise.catch(noop); // Guard against unhandledPromiseRejection
          loadBatch = { deferred, entries: null, keysets: [] };
          family.queued = loadBatch;

          // Kick off the batch
          const currentFamily = family;
          const currentBatch = loadBatch;
          queueMicrotask(() => {
            // Don't allow adding anything else to this batch.
            currentFamily.queued = null;
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
