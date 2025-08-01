import type { Deferred } from "../deferred";
import { defer } from "../deferred";
import type { Step } from "../step";

export const DEFAULT_DISTRIBUTOR_BUFFER_SIZE = 100;

const $$isDistributor = Symbol("$$isDistributor");

export interface Distributor<TData> {
  [$$isDistributor]: true;
  iterableFor(stepId: number): AsyncIterable<TData, undefined, never>;
  releaseIfUnused(stepId: number): void;
}

export function isDistributor<TData = any>(
  value: null | undefined | (object & { [$$isDistributor]?: true }),
): value is Distributor<TData> {
  return value != null && value[$$isDistributor] === true;
}

// Save on garbage collection by just using this promise for everything
const DONE_PROMISE: Promise<IteratorReturnResult<undefined>> = Promise.resolve({
  done: true,
  value: undefined,
});

/**
 * Creates a "distributor" for the sourceIterable such that the dependent steps
 * may each consume it independently and safely.
 *
 * @param sourceIterable - the iterable or async iterable to clone
 * @param dependentSteps - the steps we're expecting to depend on this (so we
 * know how many clones we'll need)
 * @param distributorBufferSize - Maximum amount any one consumer can be
 * ahead of any other - if they attempt to exceed this then we'll
 * automatically have the promise wait until the slowest consumer has caught
 * up.
 */
export function distributor<TData>(
  sourceIterable:
    | AsyncIterable<TData, undefined, never>
    | Iterable<TData, undefined, never>,
  dependentSteps: readonly Step[],
  distributorBufferSize: number,
): Distributor<TData> {
  /**
   * Once we start the underlying sourceIterable, we store the iterator here.
   */
  let sourceIterator: AsyncIterator<TData> | Iterator<TData> | null = null;

  /**
   * An array of the currently delivered index for each of the dependent steps.
   * One a given index has been delivered by all streams, the lowWaterMark may
   * advance.
   * -1 indicates that no item has been delivered yet.
   */
  const deliveredIndex: number[] = dependentSteps.map(() => -1);

  /**
   * An array of the highest index requested for each of the dependent steps.
   * -1 indicates that no item has been requested yet.
   */
  const requestedIndex: number[] = dependentSteps.map(() => -1);

  /**
   * If a consumer is terminated via `.return()` or `.throw()` (or if the
   * underlying stream terminates) then the `deliveredIndex` for that consumer
   * will be set to `Infinity` and their final result, to be returned from all
   * further `.next()` calls, will be stored here.
   */
  const terminalResult: Array<Promise<IteratorReturnResult<undefined>> | null> =
    dependentSteps.map(() => null);

  /**
   * What's the lowest index we must retain? Equal to the lowest
   * `deliveredIndex` + 1
   */
  let lowWaterMark = 0;

  /**
   * This is our buffer (max: `distributorBufferSize`) of iterator results, the first
   * consumer to request the next index will fetch from the underlying stream and store
   * the value here, as the slowest consumers catch up, old results will be shifted from
   * the start of the array and the `lowWaterMark` will be advanced. The item to pull
   * for a given position is `buffer[requestedIndex[stepIndex] - lowWaterMark]`.
   */
  const buffer: Array<Promise<IteratorResult<TData, undefined>>> = [];

  // Easy way to resolve a promise for slowing down the fastest consumer
  let wmi: [Deferred<void>, Promise<void>] | null = null;
  function lowWaterMarkIncreased() {
    if (wmi === null) {
      const d = defer<void>();
      wmi = [d, Promise.resolve(d)];
    }
    return wmi[1];
  }

  // Stop us retaining data we don't need to retain
  function maybeAdvanceLowWaterMark() {
    if (deliveredIndex.every((i) => i >= lowWaterMark)) {
      buffer.shift();
      lowWaterMark++;
      if (wmi !== null) {
        // Avoid race condition
        const deferred = wmi[0];
        wmi = null;
        deferred.resolve();
      }
    }
  }

  function advance(stepIndex: number) {
    const terminal = terminalResult[stepIndex];
    if (terminal) return terminal;

    // Keep in mind `advance(stepIndex)` might be called more than once for the
    // same step without waiting for previous calls to resolve.
    const index = ++requestedIndex[stepIndex];

    return yieldValue(stepIndex, index);
  }

  /**
   * **ONLY CALL THIS** if you've already checked for a terminal result.
   *
   * Called from advance(), returns the relevant iterator result. If
   * necessary, waits for the low water mark to advance.
   */
  function yieldValue(
    stepIndex: number,
    index: number,
  ): Promise<IteratorResult<TData>> {
    if (index >= lowWaterMark + distributorBufferSize) {
      // Whoa there! Getting a little ahead of ourselves! Wait for the slowest
      // consumer to advance, then try again.
      return lowWaterMarkIncreased().then(() => {
        const terminal = terminalResult[stepIndex];
        if (terminal) return terminal;
        return yieldValue(stepIndex, index);
      });
    }

    // !! Below here must be entirely synchronous! !!

    const bufferIndex = index - lowWaterMark;
    let result: Promise<IteratorResult<TData, undefined>>;
    if (buffer.length <= bufferIndex) {
      // assert.equal(buffer.length, bufferIndex, "We've missed some indexes?!")
      // It's our job to pull the next value!
      result = Promise.resolve(sourceIterator!.next());
      buffer[bufferIndex] = result;
    } else {
      // The next value already exists
      result = buffer[bufferIndex];
    }

    // assert.equal(deliveredIndex[stepIndex], index - 1);
    if (result == null) {
      return stop(
        stepIndex,
        new Error(
          `GrafastInternalError<330dba8c-baf0-4352-9cb7-3445e7f14bfc>: bug in Distributor; deliveredIndex: ${
            deliveredIndex[stepIndex]
          }, requestedIndex: ${
            requestedIndex[stepIndex]
          }, currentIndex: ${index}, bufferIndex: ${
            bufferIndex
          }, buffer.length: ${buffer.length}`,
        ),
      );
    }

    deliveredIndex[stepIndex] = index;
    maybeAdvanceLowWaterMark();

    return result;
  }

  function stop(stepIndex: number, error?: unknown) {
    if (!terminalResult[stepIndex]) {
      deliveredIndex[stepIndex] = Infinity;
      terminalResult[stepIndex] = error ? Promise.reject(error) : DONE_PROMISE;
      maybeAdvanceLowWaterMark();
    }
    return terminalResult[stepIndex];
  }

  function getStepIndex(stepId: number) {
    const stepIndex = dependentSteps.findIndex((s) => s.id === stepId);

    if (stepIndex === -1) {
      throw new Error(
        `Didn't expect step ${stepId} to depend on this distributor. Expected one of ${dependentSteps}`,
      );
    }
    return stepIndex;
  }

  function newIterator(stepIndex: number): AsyncIterator<TData> {
    // Kick-start the source iterator if need be
    if (sourceIterator === null) {
      sourceIterator =
        Symbol.asyncIterator in sourceIterable
          ? sourceIterable[Symbol.asyncIterator]()
          : sourceIterable[Symbol.iterator]();
    }

    const iterator: AsyncIterableIterator<TData, undefined, never> = {
      [Symbol.asyncIterator]() {
        return this;
      },
      next: () => advance(stepIndex),
      return: () => stop(stepIndex),
      throw: (e) => stop(stepIndex, e),
    };

    return iterator;
  }

  const hasIterator = dependentSteps.map(() => false);
  return {
    [$$isDistributor]: true,
    iterableFor(stepId) {
      const stepIndex = getStepIndex(stepId);
      return {
        [Symbol.asyncIterator]() {
          if (hasIterator[stepIndex]) {
            throw new Error(
              `Attempted to create iterator a second time (or possibly after release)!`,
            );
          }
          hasIterator[stepIndex] = true;
          return newIterator(stepIndex);
        },
      };
    },
    releaseIfUnused(stepId: number) {
      const stepIndex = getStepIndex(stepId);
      if (!hasIterator[stepIndex]) {
        hasIterator[stepIndex] = true;
        stop(stepIndex);
      }
    },
  };
}
