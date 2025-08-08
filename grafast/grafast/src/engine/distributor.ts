import type { Maybe } from "..";
import type { Deferred } from "../deferred";
import { defer } from "../deferred";
import type { Step } from "../step";
import { sleep } from "../utils";

const DEFAULT_DISTRIBUTOR_BUFFER_SIZE = 250;
const DEFAULT_DISTRIBUTOR_BUFFER_SIZE_INCREMENT = 250;
const DEFAULT_DISTRIBUTOR_PAUSE_DURATION = 25; // milliseconds

const $$isDistributor = Symbol("$$isDistributor");

export interface Distributor<TData> {
  [$$isDistributor]: true;
  iterableFor(stepId: number): AsyncIterable<TData, void, never>;
  releaseIfUnused(stepId: number): void;
}

export function isDistributor<TData = any>(
  value: null | undefined | (object & { [$$isDistributor]?: true }),
): value is Distributor<TData> {
  return value != null && value[$$isDistributor] === true;
}

// Save on garbage collection by just using this promise for everything
const DONE_PROMISE: Promise<IteratorReturnResult<void>> = Promise.resolve({
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
 * @param grafastOptions - the options (from the preset) that may be relevant
 */
export function distributor<TData>(
  sourceIterable:
    | AsyncIterable<TData, void, never>
    | Iterable<TData, void, never>,
  dependentSteps: readonly Step[],
  distributorOptions: DistributorOptions,
): Distributor<TData> {
  const {
    distributorTargetBufferSize: targetBufferSize,
    distributorTargetBufferSizeIncrement: bufferSizeIncrement,
    distributorPauseDuration: pauseDuration,
  } = distributorOptions;
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
  const terminalResult: Array<Promise<IteratorReturnResult<void>> | null> =
    dependentSteps.map(() => null);

  /**
   * What's the lowest index we must retain? Equal to the lowest
   * `deliveredIndex` + 1
   */
  let lowWaterMark = 0;

  /**
   * This is our buffer of iterator results, the first consumer to request the
   * next index will fetch from the underlying stream and store the value here,
   * as the slowest consumers catch up, old results will be shifted from the
   * start of the array and the `lowWaterMark` will be advanced. The item to
   * pull for a given position is `buffer[requestedIndex[stepIndex] -
   * lowWaterMark]`.
   */
  const buffer: Array<Promise<IteratorResult<TData, void>>> = [];

  // Easy way to resolve a promise for slowing down the fastest consumer
  let wmi: [Deferred<void>, Promise<void>] | null = null;
  function lowWaterMarkIncreased() {
    if (wmi === null) {
      const d = defer<void>();
      wmi = [d, Promise.resolve(d)];
    }
    return wmi[1];
  }

  /**
   * The maximum index that can be retrieved from our sourceIterator. Infinity
   * until the iterator terminates.
   */
  let finalIndex = Infinity;
  /** The final result from our sourceIterator (at index `finalIndex`), or `null` if it hasn't terminated yet. */
  let finalResult: Promise<IteratorResult<TData, void>> | null = null;

  /**
   * Once termination has been handled, this will be true.
   *
   * NOTE: when this is `true`, `finalResult` will be set, but the reverse is
   * not necessarily true.
   */
  let stopped = false;

  // Stop us retaining data we don't need to retain
  function maybeAdvanceLowWaterMark() {
    if (stopped) {
      console.warn(
        `Attempted to advance low water mark after distributor completed for steps: ${dependentSteps}`,
      );
      return;
    }
    const smallest = Math.min(...deliveredIndex);
    if (!Number.isFinite(smallest) || smallest >= finalIndex) {
      // They're all done
      stopped = true;
      if (finalResult === null) {
        // finalIndex was Infinity
        finalIndex = 0;
        finalResult = DONE_PROMISE;
      }

      if (!sourceIterator) {
        // We never started the iterator... do we need to?
        // For now, lets' start and then immediately terminate it
        sourceIterator =
          Symbol.asyncIterator in sourceIterable
            ? sourceIterable[Symbol.asyncIterator]()
            : sourceIterable[Symbol.iterator]();
      }

      if (sourceIterator.return) {
        sourceIterator.return();
      } else if (sourceIterator?.throw) {
        sourceIterator.throw(new Error("Stop"));
      } else {
        // Just ignore it? Or do we need to call `.next()` indefinitely?
        // Since it could be infinite, the next chain doesn't make sense, so
        // we'll just stop.
      }
    } else {
      // Advance the lowWaterMark as far as we can
      let advanced = false;
      while (smallest >= lowWaterMark) {
        advanced = true;
        buffer.shift();
        lowWaterMark++;
      }

      // Announce that the lowWaterMark advanced
      if (advanced && wmi !== null) {
        // Avoid race condition
        const deferred = wmi[0];
        wmi = null;
        deferred.resolve();
      }
    }
  }

  /**
   * Called when the sourceIterator completes - either with success or error.
   */
  function sourceIteratorCompleted(
    _finalIndex: number,
    _finalResult: Promise<IteratorResult<TData, void>>,
  ) {
    // This indicates that sourceIterator has completed at index `finalIndex`.
    // This does not mean that we are `stopped`, since some clients still need
    // to catch up.

    // Note that this might be called more than once (because promises), we
    // want the earliest termination index to "win".
    if (finalResult === null || _finalIndex < finalIndex) {
      finalIndex = _finalIndex;
      finalResult = _finalResult;
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
    enableDelay = true,
  ): Promise<IteratorResult<TData>> {
    const bufferLength = buffer.length;
    /** The index within the buffer that we'd like to retrieve */
    const bufferIndex = index - lowWaterMark;
    /** Is it our responsibility to pull the next record? */
    const shouldPullNext = bufferIndex >= bufferLength;

    if (
      enableDelay &&
      shouldPullNext &&
      bufferIndex >= targetBufferSize &&
      // If terminated, no need to delay
      finalResult === null
    ) {
      if ((bufferIndex - targetBufferSize) % bufferSizeIncrement === 0) {
        // Whoa there! Getting a little ahead of ourselves! Wait for the slowest
        // consumer to advance (or for it to time out), then try again.
        const oldLowWaterMark = lowWaterMark;
        return Promise.race([
          lowWaterMarkIncreased(),
          sleep(pauseDuration),
        ]).then(() => {
          const terminal = terminalResult[stepIndex];
          if (terminal) return terminal;
          /** Delay again iff the lowWaterMark advanced */
          const enableDelay = lowWaterMark > oldLowWaterMark;
          return yieldValue(stepIndex, index, enableDelay);
        });
      } else {
        // The slowest consumer is too slow - race ahead (until the next
        // `bufferSizeIncrement`)
      }
    }

    // !! Below here must be entirely synchronous! !!

    let result: Promise<IteratorResult<TData, void>>;
    if (shouldPullNext) {
      // assert.equal(bufferIndex, bufferLength, "We've missed some indexes?!")
      // It's our job to pull the next value!
      // But first... did the source iterator already complete?
      if (finalResult !== null) {
        result = finalResult;
      } else {
        result = Promise.resolve(sourceIterator!.next());
        buffer[bufferIndex] = result;

        // See if this is the result that completes sourceIterator
        result.then(
          (value) => {
            if (value.done) {
              sourceIteratorCompleted(index, result);
            }
          },
          () => void sourceIteratorCompleted(index, result),
        );
      }
    } else {
      // The next value already exists
      result = buffer[bufferIndex];
    }

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

    // assert.equal(deliveredIndex[stepIndex], index - 1);
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

    const iterator: AsyncIterableIterator<TData, void, never> = {
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

export type DistributorOptions = Required<
  Pick<
    GraphileConfig.GrafastOptions,
    | "distributorPauseDuration"
    | "distributorTargetBufferSize"
    | "distributorTargetBufferSizeIncrement"
  >
>;

export function resolveDistributorOptions(
  options: Maybe<GraphileConfig.GrafastOptions>,
): DistributorOptions {
  return {
    distributorTargetBufferSize:
      options?.distributorTargetBufferSize ?? DEFAULT_DISTRIBUTOR_BUFFER_SIZE,
    distributorTargetBufferSizeIncrement:
      options?.distributorTargetBufferSizeIncrement ??
      DEFAULT_DISTRIBUTOR_BUFFER_SIZE_INCREMENT,
    distributorPauseDuration:
      options?.distributorPauseDuration ?? DEFAULT_DISTRIBUTOR_PAUSE_DURATION,
  };
}
