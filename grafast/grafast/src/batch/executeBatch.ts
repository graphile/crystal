import { noop } from "../dev.ts";
import type { PromiseOrDirect } from "../interfaces.ts";
import { isPromiseLike } from "../utils.ts";
import type {
  BatchFamily,
  BatchOptions,
  PendingBatch,
} from "./batchInterfaces.ts";

export function executeBatch<TOptions extends BatchOptions, TKeyset, TResult>(
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
    if (loadBatch.entries !== null) {
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
