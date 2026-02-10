import { isAsyncIterable, isIterable } from "iterall";

import * as assert from "../assert.ts";
import type { Bucket, RequestTools, SharedBucketState } from "../bucket.ts";
import {
  $$streamMore,
  $$timeout,
  FLAG_ERROR,
  FLAG_INHIBITED,
  FLAG_NULL,
  FLAG_POLY_SKIPPED,
  FLAG_STOPPED,
  NO_FLAGS,
} from "../constants.ts";
import { isDev } from "../dev.ts";
import { flagError, isFlaggedValue, SafeError } from "../error.ts";
import { inspect } from "../inspect.ts";
import type {
  BatchExecutionValue,
  ExecuteStepEvent,
  ExecutionDetails,
  ExecutionDetailsStream,
  ExecutionEntryFlags,
  ExecutionExtra,
  ExecutionResults,
  ExecutionValue,
  ForcedValues,
  GrafastInternalResultsOrStream,
  IndexForEach,
  IndexMap,
  PromiseOrDirect,
  StreamMaybeMoreableArray,
  UnaryExecutionValue,
  UnbatchedExecutionExtra,
} from "../interfaces.ts";
import type { Step, UnbatchedStep } from "../step.ts";
import { __ItemStep } from "../steps/__item.ts";
import { __ValueStep } from "../steps/__value.ts";
import { timeSource } from "../timeSource.ts";
import {
  arrayOfLength,
  isPhaseTransitionLayerPlan,
  isPromiseLike,
  sudo,
} from "../utils.ts";
import type { DistributorOptions } from "./distributor.ts";
import {
  distributor,
  isDistributor,
  resolveDistributorOptions,
} from "./distributor.ts";
import type { LayerPlan } from "./LayerPlan.ts";
import type { MetaByMetaKey } from "./OperationPlan.ts";

/** Default recoverable/trappable flags (excluding NULL) */
const INHIBIT_OR_ERROR_FLAGS = FLAG_INHIBITED | FLAG_ERROR;

const timeoutError = Object.freeze(
  new SafeError(
    "Execution timeout exceeded, please simplify or add limits to your request.",
    Object.freeze({ [$$timeout]: true }),
  ),
);

function noop() {
  /*noop*/
}

/**
 * Takes a list of `results` (shorter than `resultCount`) and an object with
 * errors and indexes; returns a list of length `resultCount` with the results
 * from `results` but with errors injected at the indexes specified in
 * `errors`.
 *
 * ASSERT: `results.length + Object.values(errors).length === resultCount`
 *
 * @internal
 */
function mergeErrorsBackIn(
  results: ReadonlyArray<any>,
  forcedValues: ForcedValues,
  resultCount: number,
): GrafastInternalResultsOrStream<any> {
  const finalFlags: ExecutionEntryFlags[] = [];
  const finalResults: any[] = [];
  /** The index within `results`, which is shorter than `resultCount` */
  let resultIndex = 0;

  for (let finalIndex = 0; finalIndex < resultCount; finalIndex++) {
    const flags = forcedValues.flags[finalIndex];
    if (flags !== undefined) {
      const value = forcedValues.results[finalIndex];
      finalResults[finalIndex] = value;
      finalFlags[finalIndex] = flags;
    } else {
      finalResults[finalIndex] = results[resultIndex++];
      finalFlags[finalIndex] = 0;
    }
  }
  return { flags: finalFlags, results: finalResults };
}

/** @internal */
export function executeBucket(
  bucket: Bucket,
  requestContext: RequestTools,
): PromiseOrDirect<void> {
  const distributorOptions = resolveDistributorOptions(
    requestContext.args.resolvedPreset?.grafast,
  );

  /**
   * Execute the step directly; since there's no errors we can pass the
   * dependencies through verbatim.
   */
  function reallyExecuteStepWithoutFiltering(
    size: number,
    step: Step,
    dependencies: ReadonlyArray<ExecutionValue>,
    extra: ExecutionExtra,
  ): PromiseOrDirect<GrafastInternalResultsOrStream<any>> {
    const results = executeOrStream(size, step, dependencies, extra);
    const flags = arrayOfLength(size, NO_FLAGS);
    if (isPromiseLike(results)) {
      return results.then((results) => ({ flags, results }));
    } else {
      return { flags, results };
    }
  }

  const { stopTime, eventEmitter, args } = requestContext;
  const { middleware } = args;
  const {
    metaByMetaKey,
    size,
    store,
    layerPlan: { phases },
  } = bucket;

  const phaseCount = phases.length;

  // Like a `for(i = 0; i < phaseCount; i++)` loop with some `await`s in it, except it does promise
  // handling manually so that it can complete synchronously (no promises) if
  // possible.
  const nextPhase = (phaseIndex: number): PromiseOrDirect<void> => {
    if (phaseIndex >= phaseCount) {
      return;
    }
    const phase = phases[phaseIndex];
    const { _allSteps } = phase;
    /**
     * To ensure we don't enter a situation where an "unhandled" promise
     * rejection causes Node to exit, we must process each completed step during the
     * same tick in which it completes.
     */
    let indexesPendingLoopOver: Array<number> = [];

    let executePromises:
      | PromiseLike<GrafastInternalResultsOrStream<any>>[]
      | null = null;
    let executePromiseResultIndex: number[] | null = null;
    const resultList: Array<GrafastInternalResultsOrStream<any> | undefined> =
      [];
    if (
      phase.checkTimeout &&
      stopTime !== null &&
      timeSource.now() >= stopTime
    ) {
      // ABORT!
      if (phase.normalSteps !== undefined) {
        const normalSteps = phase.normalSteps;
        for (
          let normalStepIndex = 0, l = normalSteps.length;
          normalStepIndex < l;
          normalStepIndex++
        ) {
          const step = normalSteps[normalStepIndex].step;
          const stepSize = step._isUnary ? 1 : bucket.size;
          const r = timeoutError;
          const results = arrayOfLength(stepSize, r);
          const flags = arrayOfLength(stepSize, FLAG_ERROR);
          resultList[normalStepIndex] = { flags, results };
          indexesPendingLoopOver.push(normalStepIndex);

          // TODO: I believe we can remove this line?
          bucket.flagUnion |= FLAG_ERROR;
        }
      }
    } else if (phase.normalSteps !== undefined) {
      const normalSteps = phase.normalSteps;
      for (
        let normalStepIndex = 0, l = normalSteps.length;
        normalStepIndex < l;
        normalStepIndex++
      ) {
        const step = normalSteps[normalStepIndex].step;
        const stepSize = step._isUnary ? 1 : bucket.size;
        try {
          const r = executeStep(step);
          if (isPromiseLike(r)) {
            resultList[normalStepIndex] = undefined /* will populate shortly */;
            if (!executePromises) {
              executePromises = [r];
              executePromiseResultIndex = [normalStepIndex];
            } else {
              const newIndex = executePromises.push(r) - 1;
              executePromiseResultIndex![newIndex] = normalStepIndex;
            }
          } else {
            resultList[normalStepIndex] = r;
            indexesPendingLoopOver.push(normalStepIndex);
          }
        } catch (e) {
          const r = e;
          const results = arrayOfLength(stepSize, r);
          const flags = arrayOfLength(stepSize, FLAG_ERROR);
          resultList[normalStepIndex] = { flags, results };
          indexesPendingLoopOver.push(normalStepIndex);

          // TODO: I believe we can remove this line?
          bucket.flagUnion |= FLAG_ERROR;
        }
      }
    }

    const next = () => {
      return nextPhase(phaseIndex + 1);
    };

    /**
     * Loops over (and resets) the indexesPendingLoopOver array, ensuring that
     * all errors are handled.
     */
    const loopOverResults = (): PromiseOrDirect<undefined | unknown> => {
      if (indexesPendingLoopOver.length === 0) return;
      const indexesToProcess = indexesPendingLoopOver;
      indexesPendingLoopOver = [];

      // Validate executed steps
      for (const allStepsIndex of indexesToProcess) {
        const finishedStep = _allSteps[allStepsIndex];
        const internalResult = resultList[allStepsIndex];
        if (!internalResult) {
          throw new Error(
            `GrafastInternalError<166ef53d-b80d-4bea-8b54-803c2694112a>: Result from ${finishedStep} should exist`,
          );
        }
        const { /* flags, */ results } = internalResult;
        const resultLength = results?.length;
        const expectedSize = finishedStep._isUnary ? 1 : size;
        if (resultLength !== expectedSize) {
          if (!Array.isArray(results)) {
            throw new Error(
              `Result from ${finishedStep} should be an array, instead received ${inspect(
                results,
                { colors: true },
              )}`,
            );
          }
          throw new Error(
            `Result array from ${finishedStep} should have length ${expectedSize}${
              finishedStep._isUnary ? " (because it's unary)" : ""
            }, instead it had length ${results.length}`,
          );
        }
        if (finishedStep._isUnary) {
          // Handled later
        } else {
          bucket.store.set(
            finishedStep.id,
            batchExecutionValue(arrayOfLength(size)),
          );
        }
      }

      // Need to complete promises, check for errors, etc.
      // **DO NOT THROW, DO NOT ALLOW AN ERROR TO BE RAISED!**
      // **USE DEFENSIVE PROGRAMMING HERE!**

      /** PROMISES ADDED HERE MUST NOT REJECT */
      let promises: PromiseLike<void>[] | undefined;
      let pendingPromises: PromiseLike<any>[] | undefined;

      // TODO: it seems that if this throws an error it results in a permanent
      // hang of defers? In the mean time... Don't throw any errors here!
      const success = (
        finishedStep: Step,
        bucket: Bucket,
        resultIndex: number,
        rawValue: unknown,
        flags: ExecutionEntryFlags,
      ) => {
        // Fast lanes
        if (rawValue == null) {
          // null / undefined
          const finalFlags = flags | FLAG_NULL;
          bucket.setResult(finishedStep, resultIndex, rawValue, finalFlags);
          return;
        } else if (typeof rawValue !== "object") {
          // non-objects
          bucket.setResult(finishedStep, resultIndex, rawValue, flags);
          return;
        } else if (isFlaggedValue(rawValue)) {
          // flagged values
          const finalFlags = flags | rawValue.flags;
          bucket.setResult(
            finishedStep,
            resultIndex,
            rawValue.value,
            finalFlags,
          );
          return;
        }

        // PERF: do we want to handle arrays differently?
        let valueIsIterable = false;
        let valueIsAsyncIterable = false;
        if (
          finishedStep.cloneStreams ||
          finishedStep._stepOptions.walkIterable
        ) {
          valueIsIterable = isIterable(rawValue);
          valueIsAsyncIterable = !valueIsIterable && isAsyncIterable(rawValue);
        }

        let stream: ExecutionDetailsStream | null = null;
        if (
          finishedStep._stepOptions.walkIterable &&
          (valueIsAsyncIterable || valueIsIterable)
        ) {
          // PERF: we've already calculated this once; can we reference that again here?
          stream = evaluateStream(bucket, finishedStep, distributorOptions);
        }

        if (!stream && !valueIsAsyncIterable && Array.isArray(rawValue)) {
          // Fast mode
          const value = rawValue;

          const valueCount = value.length;
          /** We only create a duplicate array if the source array contains promises */
          let replacement: Array<any> | null = null;
          for (let i = 0; i < valueCount; i++) {
            const item = value[i];
            if (isPromiseLike(item)) {
              if (replacement === null) {
                // Copy up to here!
                replacement = value.slice(0, i);
              }
              replacement[i] = null;
              const index = i;
              const promise = item.then(
                (v) => void (replacement![index] = v),
                (e) => void (replacement![index] = flagError(e)),
              );
              if (!promises) {
                promises = [promise];
              } else {
                promises.push(promise);
              }
            } else if (replacement !== null) {
              replacement[i] = item;
            }
          }
          const list = replacement === null ? value : replacement;
          bucket.setResult(finishedStep, resultIndex, list, flags);
          return;
        }

        const willConsumeAsIterator =
          finishedStep._stepOptions.walkIterable &&
          (valueIsAsyncIterable || valueIsIterable);

        /**
         * If 'cloneStreams' is set, we clone iff it's an iterable and we're
         * not walking it ourselves.
         */
        const shouldUseDistributor =
          finishedStep.cloneStreams &&
          (valueIsIterable || valueIsAsyncIterable) &&
          !Array.isArray(rawValue) &&
          // A single `__ItemStep` is fine, but more than that and we need a distributor
          finishedStep.dependents.length > 1;

        if (shouldUseDistributor) {
          if (finishedStep._stepOptions.walkIterable) {
            const error = new Error(
              `GrafastInternalError<ea0665f6-1b5c-4f7f-bcf0-92ddc112dcf3>: ${finishedStep} needs to be walked (it is used for a list field or subscription), but should use a distributor (it's dependend on by other steps too). We should be using a wrapping 'cloneStream' step for this, but we don't seem to be doing so.`,
            );
            bucket.setResult(
              finishedStep,
              resultIndex,
              error,
              flags | FLAG_ERROR,
            );
          } else {
            const value = distributor(
              rawValue as AsyncIterable<any> | Iterable<any>,
              finishedStep.dependents.map((d) => d.step),
              requestContext.abortSignal,
              distributorOptions,
            );
            // TODO: add distributor to cleanup
            bucket.setResult(finishedStep, resultIndex, value, flags);
          }
        } else if (willConsumeAsIterator) {
          const value = rawValue;
          const initialCount = stream?.initialCount ?? Infinity;

          let iterator: Iterator<any, any, any> | AsyncIterator<any, any, any>;
          try {
            iterator = valueIsAsyncIterable
              ? (value as AsyncIterable<any>)[Symbol.asyncIterator]()
              : (value as Iterable<any>)[Symbol.iterator]();
          } catch (e) {
            bucket.setResult(finishedStep, resultIndex, e, flags | FLAG_ERROR);
            return;
          }

          // Here we track the iterator via the bucket, this allows us to
          // ensure that the iterator is terminated even if the stream is never
          // consumed (e.g. if an error is thrown/caught during execution of
          // the output plan).
          if (!bucket.iterators[resultIndex]) {
            bucket.iterators[resultIndex] = new Set();
          }
          bucket.iterators[resultIndex]!.add(iterator);

          if (initialCount === 0) {
            // Optimization - defer everything
            const arr: StreamMaybeMoreableArray<any> = [];
            arr[$$streamMore] = iterator;
            bucket.setResult(finishedStep, resultIndex, arr, flags);
          } else {
            // Evaluate the first initialCount entries, rest is streamed.
            const promise = (async () => {
              try {
                let valuesSeen = 0;
                const arr: StreamMaybeMoreableArray<any> = [];

                /*
                 * We need to "shift" a few entries off the top of the
                 * iterator, but still keep it iterable for the later
                 * stream. To accomplish this we have to do manual
                 * looping
                 */

                let resultPromise:
                  | Promise<IteratorResult<any, any>>
                  | IteratorResult<any, any>;
                while ((resultPromise = iterator.next())) {
                  const resolvedResult = await resultPromise;
                  if (resolvedResult.done) {
                    break;
                  }
                  try {
                    const v = resolvedResult.value;
                    if (isPromiseLike(v)) {
                      arr.push(await v);
                    } else {
                      arr.push(v);
                    }
                  } catch (e) {
                    arr.push(flagError(e));
                  }
                  if (++valuesSeen >= initialCount) {
                    // This is safe to do in the `while` since we checked
                    // the `0` entries condition in the optimization
                    // above.
                    arr[$$streamMore] = iterator;
                    break;
                  }
                }

                bucket.setResult(finishedStep, resultIndex, arr, flags);
              } catch (e) {
                bucket.setResult(
                  finishedStep,
                  resultIndex,
                  e,
                  flags | FLAG_ERROR,
                );
              }
            })();
            if (!promises) {
              promises = [promise];
            } else {
              promises.push(promise);
            }
          }
        } else {
          bucket.setResult(finishedStep, resultIndex, rawValue, flags);
        }
      };

      for (const allStepsIndex of indexesToProcess) {
        const step = _allSteps[allStepsIndex];
        const internalResult = resultList[allStepsIndex];
        if (!internalResult) {
          throw new Error(
            `GrafastInternalError<b82038d6-ca4e-4b55-8ed4-4d7c879f5dc2>: Result from ${step} should exist`,
          );
        }
        const { flags, results } = internalResult;
        const count = step._isUnary ? 1 : size;
        for (let dataIndex = 0; dataIndex < count; dataIndex++) {
          const val = results[dataIndex];
          if (step.isSyncAndSafe || !isPromiseLike(val)) {
            if (flags[dataIndex] == null) {
              throw new Error(
                `GraphileInternalError<75df71bb-0f76-4a98-9664-9167d502296a>: result for ${step} has no flag at index ${dataIndex} (value = ${inspect(
                  val,
                )})`,
              );
            }
            success(step, bucket, dataIndex, val, flags[dataIndex]);
          } else {
            const valSuccess = val.then(
              (val) =>
                void success(
                  step,
                  bucket,
                  dataIndex,
                  val,
                  NO_FLAGS, // TODO: where does `flags[dataIndex]` come into this?
                ),
              (error) =>
                void bucket.setResult(step, dataIndex, error, FLAG_ERROR),
            );

            if (!pendingPromises) {
              pendingPromises = [valSuccess];
            } else {
              pendingPromises.push(valSuccess);
            }
          }
        }
      }

      if (pendingPromises !== undefined) {
        return Promise.all(pendingPromises).then(() =>
          promises ? Promise.all(promises) : undefined,
        );
      } else {
        return promises ? Promise.all(promises) : undefined;
      }
    };

    const runSyncSteps = () => {
      const executedLength = resultList.length;
      if (isDev) {
        assert.strictEqual(
          executedLength,
          phase.normalSteps?.length ?? 0,
          "Expected only and all normalSteps to have executed",
        );
      }
      if (!phase.unbatchedSyncAndSafeSteps) {
        return next();
      }
      const allStepsLength = _allSteps.length;
      const extras: UnbatchedExecutionExtra[] = [];
      for (
        let allStepsIndex = executedLength;
        allStepsIndex < allStepsLength;
        allStepsIndex++
      ) {
        const step = _allSteps[allStepsIndex];
        const meta =
          step.metaKey !== undefined ? metaByMetaKey[step.metaKey] : undefined;
        extras[allStepsIndex] = {
          stopTime,
          meta,
          eventEmitter,
          stream: evaluateStream(bucket, step, distributorOptions),
          _bucket: bucket,
          _requestContext: requestContext,
        };
        if (step._isUnary) {
          // Handled later
        } else {
          bucket.store.set(step.id, batchExecutionValue(arrayOfLength(size)));
        }
      }
      for (let dataIndex = 0; dataIndex < size; dataIndex++) {
        stepLoop: for (
          let allStepsIndex = executedLength;
          allStepsIndex < allStepsLength;
          allStepsIndex++
        ) {
          const step = sudo(_allSteps[allStepsIndex] as UnbatchedStep);

          // Unary steps only need to be processed once
          if (step._isUnary && dataIndex !== 0) {
            continue;
          }

          // Check if the side effect errored
          const $sideEffect = step.implicitSideEffectStep;
          if ($sideEffect) {
            let currentPolymorphicPath: string | null;
            if (
              $sideEffect.polymorphicPaths === null ||
              (currentPolymorphicPath =
                bucket.polymorphicPathList[dataIndex]) === null ||
              $sideEffect.polymorphicPaths.has(currentPolymorphicPath)
            ) {
              const depExecutionValue = bucket.store.get($sideEffect.id);
              if (depExecutionValue === undefined) {
                throw new Error(
                  `GrafastInternalError<fcc8d302-ac66-40e8-aaea-ee2c7e2b30b2>: failed to get result for side effect ${$sideEffect} which impacts ${step}`,
                );
              }
              const depFlags = depExecutionValue._flagsAt(dataIndex);
              if (depFlags & FLAG_POLY_SKIPPED) {
                /* noop */
              } else if (depFlags & FLAG_ERROR) {
                if (step._isUnary) {
                  // COPY the unary value
                  bucket.store.set(step.id, depExecutionValue);
                  bucket.flagUnion |= depFlags;
                } else {
                  const depVal = depExecutionValue.at(dataIndex);
                  bucket.setResult(step, dataIndex, depVal, depFlags);
                }
                continue stepLoop;
              }
            }
          }

          try {
            const deps: any = [];
            const extra = extras[allStepsIndex];
            let forceIndexValue: Error | null | undefined = undefined;
            let rejectValue: Error | null | undefined = undefined;
            let indexFlags: ExecutionEntryFlags = NO_FLAGS;

            // Check polymorphism matches
            const stepPolymorphicPaths = step.polymorphicPaths;
            if (
              stepPolymorphicPaths !== null &&
              (step._isUnary
                ? /*
                   * already asserted that it matches;
                   * !! search "f4ce2c83"
                   */ false
                : /* batch check */
                  !stepPolymorphicPaths.has(
                    bucket.polymorphicPathList[dataIndex] as string,
                  ))
            ) {
              indexFlags |= FLAG_POLY_SKIPPED;
              forceIndexValue = null;
            } else {
              for (let i = 0, l = step.dependencies.length; i < l; i++) {
                const $dep = step.dependencies[i];
                const forbiddenFlags = step.dependencyForbiddenFlags[i];
                const onReject = step.dependencyOnReject[i];
                const depExecutionVal = bucket.store.get($dep.id);
                if (depExecutionVal === undefined) {
                  throw new Error(
                    `GrafastInternalError<480e7c98-a777-4efb-b826-c339129ccff8>: could not find value in ${bucket} for ${$dep}, dependency ${i} of ${step}`,
                  );
                }
                // Search for "f2b3b1b3" for similar block
                const flags = depExecutionVal._flagsAt(dataIndex);
                const disallowedFlags = flags & forbiddenFlags;
                if (disallowedFlags) {
                  indexFlags |= disallowedFlags;
                  // If there's a reject behavior and we're FRESHLY rejected (weren't
                  // already inhibited), use that as a fallback.
                  // TODO: validate this.
                  // If dep is inhibited and we don't allow inhibited, copy through (null or error).
                  // If dep is inhibited and we do allow inhibited, but we're disallowed, use our onReject.
                  // If dep is not inhibited, but we're disallowed, use our onReject.
                  if (
                    onReject !== undefined &&
                    (disallowedFlags & INHIBIT_OR_ERROR_FLAGS) === NO_FLAGS
                  ) {
                    rejectValue ||= onReject;
                  }
                  if (forceIndexValue == null) {
                    if ((flags & FLAG_ERROR) !== NO_FLAGS) {
                      const v = depExecutionVal.at(dataIndex);
                      forceIndexValue = v;
                    } else {
                      forceIndexValue = null;
                    }
                  } else {
                    // First error wins, ignore this second error.
                  }
                  // End "f2b3b1b3" block
                } else if (forceIndexValue === undefined) {
                  const depVal = depExecutionVal.at(dataIndex);
                  let depFlags;
                  if (
                    (bucket.flagUnion & FLAG_ERROR) === FLAG_ERROR &&
                    ((depFlags = depExecutionVal._flagsAt(dataIndex)) &
                      FLAG_ERROR) ===
                      FLAG_ERROR
                  ) {
                    if (step._isUnary) {
                      // COPY the unary value
                      bucket.store.set(step.id, depExecutionVal);
                      bucket.flagUnion |= depFlags;
                    } else {
                      bucket.setResult(step, dataIndex, depVal, FLAG_ERROR);
                    }
                    continue stepLoop;
                  }
                  if ($dep.cloneStreams) {
                    // if (isDistributor(depVal)) {
                    //   deps.push(depVal.iterableFor(step.id));
                    // }
                    const err = new Error(
                      `It's not safe for an unbatched isSyncAndSafe step (${step}) to consume a step that has cloneStreams=true (${$dep})`,
                    );
                    if (step._isUnary) {
                      const uev = unaryExecutionValue(err, FLAG_ERROR);
                      bucket.store.set(step.id, uev);
                      bucket.flagUnion |= FLAG_ERROR;
                    } else {
                      bucket.setResult(step, dataIndex, err, FLAG_ERROR);
                    }
                    continue stepLoop;
                  } else {
                    deps.push(depVal);
                  }
                }
              }
            }

            let stepResult, stepFlags;

            if (forceIndexValue !== undefined) {
              // Search for "17217999b7a7" for similar block
              if ((indexFlags & FLAG_POLY_SKIPPED) === FLAG_POLY_SKIPPED) {
                // Already skipped
              } else if (forceIndexValue == null && rejectValue != null) {
                indexFlags |= FLAG_ERROR;
                forceIndexValue = rejectValue;
              } else {
                indexFlags |= FLAG_INHIBITED;
              }
              // End "17217999b7a7" block

              stepResult = forceIndexValue;
              stepFlags = indexFlags;
            } else {
              const rawStepResult = step.unbatchedExecute(extra, ...deps);
              if (
                typeof rawStepResult === "object" &&
                rawStepResult !== null &&
                isFlaggedValue(rawStepResult)
              ) {
                stepResult = rawStepResult.value;
                stepFlags = rawStepResult.flags;
              } else {
                stepResult = rawStepResult;
                stepFlags = rawStepResult == null ? FLAG_NULL : NO_FLAGS;
              }
            }
            // TODO: what if stepResult is _returned_ error (as opposed to
            // thrown)?
            // NOTE: we are in `runSyncSteps` so this step is guaranteed to
            // be "isSyncAndSafe". As such, we don't need to worry about it
            // returning an error (unsafe) or a promise (async), we only
            // need to check if it's null.
            bucket.setResult(step, dataIndex, stepResult, stepFlags);
          } catch (e) {
            bucket.setResult(step, dataIndex, e, FLAG_ERROR);
          }
        }
      }
      // Note: we don't need to release the distributors for sync steps because
      // we specifically forbid isSyncAndSafe steps from having distributors as
      // deps.
      return next();
    };

    if (executePromises !== null) {
      const processedPromises: PromiseLike<any>[] = [];
      if (indexesPendingLoopOver.length > 0) {
        // This **must be done in the same tick**
        const promiseOrNot = loopOverResults();
        if (isPromiseLike(promiseOrNot)) {
          processedPromises.push(promiseOrNot);
        }
      }
      for (let i = 0, l = executePromises.length; i < l; i++) {
        const executePromise = executePromises[i];
        const index = executePromiseResultIndex![i];
        processedPromises.push(
          executePromise.then((promiseResult) => {
            resultList[index] = promiseResult;
            indexesPendingLoopOver.push(index);
            // We must loop over the results in the same tick in which the
            // promise resolved.
            return loopOverResults();
          }),
        );
      }
      return Promise.all(processedPromises).then(runSyncSteps);
    } else {
      const promiseOrNot = loopOverResults();
      if (isPromiseLike(promiseOrNot)) {
        return promiseOrNot.then(runSyncSteps);
      } else {
        return runSyncSteps();
      }
    }
  };

  const promise = nextPhase(0);

  if (isPromiseLike(promise)) {
    return promise.then(executeSamePhaseChildren);
  } else {
    return executeSamePhaseChildren();
  }

  // Function definitions below here

  function executeOrStream(
    count: number,
    step: Step,
    values: ReadonlyArray<ExecutionValue>,
    extra: ExecutionExtra,
  ): ExecutionResults<any> {
    if (isDev) {
      if (step._isUnary && count !== 1) {
        throw new Error(
          `GrafastInternalError<84a6cdfa-e8fe-4dea-85fe-9426a6a78027>: ${step} is a unary step, but we're attempting to pass it ${count} (!= 1) values`,
        );
      }
      if (step.execute.length > 1) {
        throw new Error(
          `${step} is using a legacy form of 'execute' which accepts multiple arguments, please see https://err.red/gev2`,
        );
      }
    }
    const executeDetails: ExecutionDetails<readonly any[]> = {
      indexMap: makeIndexMap(count),
      indexForEach: makeIndexForEach(count),
      count,
      values,
      extra,
      stream: evaluateStream(bucket, step, distributorOptions),
    };
    if (!step.isSyncAndSafe && middleware != null) {
      return middleware.run(
        "executeStep",
        { args, step, executeDetails },
        executeStepFromEvent,
      );
    } else {
      return step.execute(executeDetails);
    }
  }

  // Slow mode...
  /**
   * Execute the step, filtering out errors and entries with non-matching
   * polymorphicPaths from the input dependencies and then padding the lists
   * back out at the end.
   */
  function reallyExecuteStepWithFiltering(
    step: Step,
    dependenciesIncludingSideEffects: ReadonlyArray<ExecutionValue>,
    dependencyForbiddenFlags: ReadonlyArray<ExecutionEntryFlags>,
    dependencyOnReject: ReadonlyArray<Error | null | undefined>,
    polymorphicPathList: readonly (string | null)[],
    extra: ExecutionExtra,
  ): PromiseOrDirect<GrafastInternalResultsOrStream<any>> {
    const expectedSize = step._isUnary ? 1 : size;
    const forcedValues: ForcedValues = {
      flags: arrayOfLength(expectedSize, undefined),
      results: arrayOfLength(expectedSize, undefined),
    };

    /**
     * If there's errors/forbidden values, we must manipulate the arrays being
     * passed into the step execution
     */
    let needsTransform = false;

    /** If all we see is errors, there's no need to execute! */
    let newSize = 0;
    const newPolymorphicPathList: (string | null)[] = [];
    let stepPolymorphicPaths = step.polymorphicPaths;
    const legitDepsCount = sudo(step).dependencies.length;
    const dependenciesIncludingSideEffectsCount =
      dependenciesIncludingSideEffects.length;
    let dependencies =
      dependenciesIncludingSideEffectsCount > legitDepsCount
        ? dependenciesIncludingSideEffects.slice(0, legitDepsCount)
        : dependenciesIncludingSideEffects;

    // OPTIM: if unariesIncludingSideEffects.some(isGrafastError) then shortcut execution because everything fails

    let hasPolyMatch = true;
    if (step._isUnary && stepPolymorphicPaths !== null) {
      // Check that at least one datapoint matches one of our paths
      hasPolyMatch = false;
      for (let dataIndex = 0; dataIndex < size; dataIndex++) {
        if (
          stepPolymorphicPaths.has(polymorphicPathList[dataIndex] as string)
        ) {
          hasPolyMatch = true;
          break;
        }
      }
      stepPolymorphicPaths = null;
    }
    for (let dataIndex = 0; dataIndex < expectedSize; dataIndex++) {
      let forceIndexValue: Error | null | undefined = hasPolyMatch
        ? undefined
        : null;
      let rejectValue: Error | null | undefined = undefined;
      let indexFlags: ExecutionEntryFlags = hasPolyMatch
        ? NO_FLAGS
        : FLAG_POLY_SKIPPED;
      if (
        stepPolymorphicPaths !== null &&
        !stepPolymorphicPaths.has(polymorphicPathList[dataIndex] as string)
      ) {
        indexFlags |= FLAG_POLY_SKIPPED;
        forceIndexValue = null;
      } else if (extra._bucket.flagUnion !== NO_FLAGS) {
        for (let i = 0; i < dependenciesIncludingSideEffectsCount; i++) {
          const depExecutionVal = dependenciesIncludingSideEffects[i];
          const forbiddenFlags = dependencyForbiddenFlags[i];
          const onReject = dependencyOnReject[i];

          // Search for "f2b3b1b3" for similar block
          const flags = depExecutionVal._flagsAt(dataIndex);
          const disallowedFlags = flags & forbiddenFlags;
          if (disallowedFlags) {
            indexFlags |= disallowedFlags;
            // If there's a reject behavior and we're FRESHLY rejected (weren't
            // already inhibited), use that as a fallback.
            // TODO: validate this.
            // If dep is inhibited and we don't allow inhibited, copy through (null or error).
            // If dep is inhibited and we do allow inhibited, but we're disallowed, use our onReject.
            // If dep is not inhibited, but we're disallowed, use our onReject.
            if (
              onReject !== undefined &&
              (disallowedFlags & (FLAG_INHIBITED | FLAG_ERROR)) === NO_FLAGS
            ) {
              rejectValue ||= onReject;
            }
            if (forceIndexValue == null) {
              if ((flags & FLAG_ERROR) !== 0) {
                const v = depExecutionVal.at(dataIndex);
                forceIndexValue = v;
              } else {
                forceIndexValue = null;
              }
            } else {
              // First error wins, ignore this second error.
            }
            // End "f2b3b1b3" block

            break;
          }
        }
      } else {
        // All good
      }

      if (forceIndexValue !== undefined) {
        if (!needsTransform) {
          needsTransform = true;
          // Clone up until this point, make mutable, don't add self
          dependencies = dependencies.map((ev) =>
            ev.isBatch
              ? // TODO: move this creation to happen once the full list is
                // already built, ideally we shouldn't be mutating an execution
                // value later.
                batchExecutionValue(ev.entries.slice(0, dataIndex))
              : ev,
          );
        }

        // Search for "17217999b7a7" for similar block
        if (forceIndexValue == null && rejectValue != null) {
          indexFlags |= FLAG_ERROR;
          forceIndexValue = rejectValue;
        } else {
          indexFlags |= FLAG_INHIBITED;
        }
        // End "17217999b7a7" block

        forcedValues.flags[dataIndex] = indexFlags;
        forcedValues.results[dataIndex] = forceIndexValue;
      } else {
        const newIndex = newSize++;
        newPolymorphicPathList[newIndex] = polymorphicPathList[dataIndex];
        if (needsTransform) {
          // dependenciesWithoutErrors has limited content; add this non-error value
          for (
            let depListIndex = 0;
            depListIndex < legitDepsCount;
            depListIndex++
          ) {
            const depList = dependencies[depListIndex];
            if (depList.isBatch) {
              const depVal = dependenciesIncludingSideEffects[depListIndex];
              (depList.entries as any[]).push(depVal.at(dataIndex));
              depList._flags.push(depVal._flagsAt(dataIndex));
            }
          }
        }
      }
    }

    if (newSize === 0) {
      // Everything is errors; we can skip execution
      return forcedValues as GrafastInternalResultsOrStream<any>;
    } else if (needsTransform) {
      const resultWithoutErrors = executeOrStream(
        newSize,
        step,
        dependencies,
        extra,
      );
      if (isPromiseLike(resultWithoutErrors)) {
        return resultWithoutErrors.then((r) =>
          mergeErrorsBackIn(r, forcedValues, expectedSize),
        );
      } else {
        return mergeErrorsBackIn(
          resultWithoutErrors,
          forcedValues,
          expectedSize,
        );
      }
    } else {
      if (isDev) {
        assert.ok(
          newSize === expectedSize,
          "GrafastInternalError<47fca4ab-069c-428f-8374-267479c7fd27>: Expected newSize to equal expectedSize",
        );
      }
      return reallyExecuteStepWithoutFiltering(
        newSize,
        step,
        dependencies,
        extra,
      );
    }
  }

  /**
   * This function MIGHT throw or reject, so be sure to handle that.
   */
  function executeStep(
    step: Step,
  ): PromiseOrDirect<GrafastInternalResultsOrStream<any>> {
    // DELIBERATE SHADOWING!
    const size = step._isUnary ? 1 : bucket.size;
    try {
      const meta =
        step.metaKey !== undefined ? metaByMetaKey[step.metaKey] : undefined;
      const extra: ExecutionExtra = {
        stopTime,
        meta,
        eventEmitter,
        stream: evaluateStream(bucket, step, distributorOptions),
        _bucket: bucket,
        _requestContext: requestContext,
      };
      /** Only mutate this inside `addDependency` */
      const _rawDependencies: Array<ExecutionValue> = [];
      const _rawForbiddenFlags: Array<ExecutionEntryFlags> = [];
      const _rawOnReject: Array<Error | null | undefined> = [];
      const dependencies: ReadonlyArray<ExecutionValue> = _rawDependencies;
      let needsFiltering = false;
      const defaultForbiddenFlags = sudo(step).defaultForbiddenFlags;
      const addDependency = (
        $dep: Step,
        forbiddenFlags: ExecutionEntryFlags,
        onReject: Error | null | undefined,
      ) => {
        if (step._isUnary && !$dep._isUnary) {
          throw new Error(
            `GrafastInternalError<58bc38e2-8722-4c19-ba38-fd01a020654b>: unary step ${step} cannot be made dependent on non-unary step ${$dep}!`,
          );
        }
        const rawExecutionValue = store.get($dep.id);
        if (rawExecutionValue === undefined) {
          throw new Error(
            `GrafastInternalError<d9e9eb37-4251-4659-a545-4730826ecf0e>: ${$dep} data couldn't be found, but required by ${step} (with side effect ${step.implicitSideEffectStep})!`,
          );
        }

        let executionValue: ExecutionValue;
        if ($dep.cloneStreams) {
          // Need to check if the EV contains distributors
          if (rawExecutionValue.isBatch) {
            const firstDistributorIndex =
              rawExecutionValue.entries.findIndex(isDistributor);
            if (firstDistributorIndex >= 0) {
              const entries = [];
              for (let i = 0; i < size; i++) {
                const val = rawExecutionValue.entries[i];
                if (i < firstDistributorIndex || !isDistributor(val)) {
                  entries.push(val);
                } else {
                  entries.push(val.iterableFor(step.id));
                }
              }
              executionValue = batchExecutionValue(
                entries,
                rawExecutionValue._flags,
              );
            } else {
              executionValue = rawExecutionValue;
            }
          } else {
            if (isDistributor(rawExecutionValue.value)) {
              executionValue = unaryExecutionValue(
                rawExecutionValue.value.iterableFor(step.id),
                rawExecutionValue._entryFlags,
              );
            } else {
              executionValue = rawExecutionValue;
            }
          }
        } else {
          executionValue = rawExecutionValue;
        }

        _rawDependencies.push(executionValue);
        _rawForbiddenFlags.push(forbiddenFlags);
        _rawOnReject.push(onReject);
        if (!needsFiltering && (bucket.flagUnion & forbiddenFlags) !== 0) {
          const flags = executionValue._getStateUnion();
          needsFiltering = (flags & forbiddenFlags) !== 0;
        }
      };
      const sstep = sudo(step);
      const depCount = sstep.dependencies.length;
      if (depCount > 0) {
        for (let i = 0, l = depCount; i < l; i++) {
          const $dep = sstep.dependencies[i];
          addDependency(
            $dep,
            sstep.dependencyForbiddenFlags[i],
            sstep.dependencyOnReject[i],
          );
        }
      }
      const $sideEffect = step.implicitSideEffectStep;
      if ($sideEffect) {
        if ($sideEffect._isUnary || !step._isUnary) {
          addDependency($sideEffect, defaultForbiddenFlags, undefined);
        }
      }
      if (
        isDev &&
        (step.layerPlan.reason.type === "polymorphic" ||
          step.layerPlan.reason.type === "polymorphicPartition") &&
        step.polymorphicPaths === null
      ) {
        throw new Error(
          `GrafastInternalError<c33328fe-6758-4699-8ac6-7be41ce58bfb>: a step without polymorphic paths cannot belong to a polymorphic bucket`,
        );
      }
      needsFiltering ||= step._isSelectiveStep;
      const result = needsFiltering
        ? reallyExecuteStepWithFiltering(
            step,
            dependencies,
            _rawForbiddenFlags,
            _rawOnReject,
            bucket.polymorphicPathList,
            extra,
          )
        : reallyExecuteStepWithoutFiltering(
            size,
            step,
            $sideEffect ? dependencies.slice(0, depCount) : dependencies,
            extra,
          );
      if (isPromiseLike(result)) {
        return result.then(null, (error) => {
          // Don't need to do this here, it will be done where the
          // ExecutionValue is created:
          //   bucket.hasNonZeroStatus = true;
          return {
            flags: arrayOfLength(size, FLAG_ERROR | FLAG_STOPPED),
            results: arrayOfLength(size, error),
          };
        });
      } else {
        return result;
      }
    } catch (error) {
      // Don't need to do this here, it will be done where the
      // ExecutionValue is created:
      //   bucket.hasNonZeroStatus = true;
      return {
        flags: arrayOfLength(size, FLAG_ERROR | FLAG_STOPPED),
        results: arrayOfLength(size, error),
      };
    }
  }

  function executeSamePhaseChildren(): PromiseOrDirect<void> {
    const result = completeBucketAndExecuteSamePhaseChildren(
      bucket,
      requestContext,
    );

    if (result != null) {
      return result.then(() => {
        // PERF: this seems like a bad idea! We're forcing the bucket to be
        // retained in this closure? Why?
        bucket.isComplete = true;
        return;
      });
    } else {
      bucket.isComplete = true;
      return;
    }
  }
}

function completeBucketAndExecuteSamePhaseChildren(
  bucket: Bucket,
  requestContext: RequestTools,
) {
  const { layerPlan, sharedState } = bucket;

  const result = markLayerPlanAsDone(
    requestContext,
    sharedState,
    layerPlan,
    bucket,
  );

  bucket.sharedState.release(bucket);

  return result;
}

function markLayerPlanAsDone(
  requestContext: RequestTools,
  sharedState: SharedBucketState,
  layerPlan: LayerPlan,
  bucket: Bucket | null,
): PromiseOrDirect<void> {
  if (sharedState._doneBucketIds.has(layerPlan.id)) {
    throw new Error(
      `${bucket} has already completed, it cannot complete again!`,
    );
  }
  sharedState._doneBucketIds.add(layerPlan.id);

  const childPromises: PromiseLike<any>[] = [];

  // This promise should never reject
  let mutationQueue: PromiseLike<void> | null = null;
  /**
   * Ensures that callback is only called once all other enqueued callbacks
   * are called.
   */
  const enqueue = <T>(
    callback: () => PromiseOrDirect<T>,
  ): PromiseOrDirect<T> => {
    const result = mutationQueue ? mutationQueue.then(callback) : callback();
    if (isPromiseLike(result)) {
      mutationQueue = result.then(noop, noop);
    }
    return result;
  };
  const { children: childLayerPlans } = layerPlan;

  // PERF: create a JIT factory for this at planning time
  loop: for (const childLayerPlan of childLayerPlans) {
    switch (childLayerPlan.reason.type) {
      case "nullableBoundary":
      case "listItem":
      case "polymorphic":
      case "polymorphicPartition": {
        const childBucket =
          bucket == null ? null : childLayerPlan.newBucket(bucket);
        // Execute
        const result: PromiseOrDirect<void> =
          childBucket !== null
            ? executeBucket(childBucket, requestContext)
            : markLayerPlanAsDone(
                requestContext,
                sharedState,
                childLayerPlan,
                null,
              );
        if (isPromiseLike(result)) {
          childPromises.push(result);
        }
        break;
      }
      case "mutationField": {
        const childBucket =
          bucket == null ? null : childLayerPlan.newBucket(bucket);
        // Enqueue for execution (mutations must run in order)
        const promise: PromiseOrDirect<void> = enqueue(() =>
          childBucket !== null
            ? executeBucket(childBucket, requestContext)
            : markLayerPlanAsDone(
                requestContext,
                sharedState,
                childLayerPlan,
                null,
              ),
        );
        if (isPromiseLike(promise)) {
          childPromises.push(promise);
        }

        break;
      }
      case "combined": {
        // First, see if _all_ parent layer plans are ready
        let allParentLayerPlansAreReady = true;
        for (const lp of childLayerPlan.reason.parentLayerPlans) {
          if (lp === layerPlan) continue;
          if (!sharedState._doneBucketIds.has(lp.id)) {
            allParentLayerPlansAreReady = false;
            break;
          }
        }
        if (!allParentLayerPlansAreReady) {
          // The last parent layer plan to complete will handle it.
          // Make sure we're retained so it can use our data!
          // Will be released inside the "combined" branch in childLayerPlan.newBucket
          if (bucket != null) {
            bucket.sharedState.retain(bucket);
          }

          // TODO: MAKE SURE CANCELLED BUCKETS ARE HANDLED!

          continue loop;
        }
        const childBucket = childLayerPlan.newCombinedBucket({ sharedState });
        if (childBucket !== null) {
          // Execute
          const result = executeBucket(childBucket, requestContext);
          if (isPromiseLike(result)) {
            childPromises.push(result);
          }
        }
        break;
      }
      case "subroutine":
      case "subscription":
      case "defer": {
        // Ignore; these are handled elsewhere
        continue loop;
      }
      case "root": {
        throw new Error(
          // *confused emoji*
          "GrafastInternalError<05fb7069-81b5-43f7-ae71-f62547d2c2b7>: root cannot be not the root (...)",
        );
      }
      default: {
        const never: never = childLayerPlan.reason;
        throw new Error(
          `GrafastInternalError<c6984a96-050e-4d40-ab18-a8c5dc7e239b>: unhandled reason '${inspect(
            never,
          )}'`,
        );
      }
    }
  }
  if (childPromises.length > 0) {
    // These should never reject; rejections will bubble up through the promise chain
    return Promise.all(childPromises).then(noop);
  } else {
    return;
  }
}

function makeSharedState(layerPlan: LayerPlan): SharedBucketState {
  // This is from a stream/defer/similar.
  // There might be combined layer plans in it.
  // These combined layer plans might reference other layer plans which will
  // never execute (they're outside of our tree).
  // We should mark these other layer plans as "done".
  const _doneBucketIds = new Set<number>(layerPlan.outOfBoundsLayerPlanIds);

  return {
    _doneBucketIds,
    _retainedBuckets: new Map(),
    retain(bucket) {
      this._retainedBuckets.set(bucket.layerPlan.id, bucket);
      bucket.retainCount++;
    },
    release(bucket) {
      bucket.retainCount--;
      if (bucket.retainCount <= 0) {
        this._retainedBuckets.delete(bucket.layerPlan.id);
      }
    },
  };
}

/** @internal */
export function newBucket(
  parent: {
    metaByMetaKey: MetaByMetaKey | undefined;
    sharedState: SharedBucketState;
  } | null,
  spec: Pick<
    Bucket,
    | "layerPlan"
    | "store"
    | "size"
    | "flagUnion"
    | "polymorphicPathList"
    | "polymorphicType"
    | "iterators"
  >,
): Bucket {
  const parentMetaByMetaKey = parent?.metaByMetaKey;
  const sharedState: SharedBucketState =
    // Do not copy state across phase transitions
    isPhaseTransitionLayerPlan(spec.layerPlan)
      ? makeSharedState(spec.layerPlan)
      : (parent?.sharedState ?? makeSharedState(spec.layerPlan));
  if (isDev) {
    // Some validations
    if (!(spec.size > 0)) {
      throw new Error(
        "GrafastInternalError<eb5c962d-c748-4759-95e3-52c50c873593>: No need to create an empty bucket!",
      );
    }
    assert.strictEqual(
      spec.polymorphicPathList.length,
      spec.size,
      "polymorphicPathList length must match bucket size",
    );
    /*
    for (let i = 0, l = spec.size; i < l; i++) {
      const p = spec.polymorphicPathList[i];
      assert.strictEqual(
        typeof p,
        "string",
        `Entry ${i} in polymorphicPathList for bucket for ${spec.layerPlan} was not a string`,
      );
    }
    */
    for (const [key, list] of spec.store.entries()) {
      assert.ok(
        typeof list.isBatch === "boolean",
        `Store entry for step '${key}' for layerPlan '${spec.layerPlan.id}' should be an ExecutionValue`,
      );
      if (list.isBatch) {
        assert.strictEqual(
          list.entries.length,
          spec.size,
          `Store entry for step '${key}' for layerPlan '${spec.layerPlan.id}' should have same length as bucket`,
        );
      }
    }
    if (!spec.iterators) {
      throw new Error(`newBucket called but no iterators array was specified`);
    }
  }
  const type = spec.layerPlan.reason.type;
  const metaByMetaKey =
    parentMetaByMetaKey == null ||
    type === "root" ||
    type === "mutationField" ||
    type === "subscription"
      ? // Reset the metaByMetaKey
        spec.layerPlan.operationPlan.makeMetaByMetaKey()
      : parentMetaByMetaKey;
  // Copy from spec
  const {
    layerPlan,
    store,
    size,
    flagUnion,
    polymorphicPathList,
    polymorphicType,
    iterators,
  } = spec;
  const children = Object.create(null);
  const bucket: Bucket = {
    sharedState,
    retainCount: 0,
    toString: bucketToString,
    layerPlan,
    store,
    size,
    flagUnion,
    polymorphicPathList,
    polymorphicType,
    iterators,
    metaByMetaKey,
    isComplete: false,
    children,
    setResult(step, index, value, flags) {
      const stepId = step.id;
      if (index >= size) {
        throw new Error(
          `GrafastInternalError<9465db89-cc9d-415c-97e7-57bb19ddebe0>: attempt to write to out of bounds index ${index} for bucket of size ${size} for step ${step}`,
        );
      }
      if (flags !== NO_FLAGS) {
        this.flagUnion |= flags;
      }
      if (step._isUnary) {
        if (isDev && store.has(stepId)) {
          const ev = store.get(stepId);
          console.error(
            `GrafastInternalWarning<603e635f-af46-4feb-abb1-bac184bf7ef2>: value for step ${step} has already been stored to bucket ${layerPlan}; overwriting.`,
            {
              isBatch: ev?.isBatch,
              value0: ev?.at(0),
              flags0: ev?._flagsAt(0),
            },
            { isBatch: false, value, flags },
          );
        }
        const ev = unaryExecutionValue(value, flags);
        store.set(stepId, ev);
      } else {
        const storeEntry = store.get(stepId);
        if (!storeEntry || !storeEntry.isBatch) {
          if (!storeEntry) {
            throw new Error(
              `GrafastInternalError<e2ba1e4a-5391-4f81-bb21-fb200e29aea2>: value for step ${step} expected to be a batch value, but is not set`,
            );
          } else {
            throw new Error(
              `GrafastInternalError<f587d317-8919-4f14-905a-ab7bb338dd2b>: value for step ${step} expected to be a batch value, but is unary (non-batch)`,
            );
          }
        }
        storeEntry._setResult(index, value, flags);
      }
    },
  };

  // Will be released when setDone is called
  sharedState.retain(bucket);

  return bucket;
}

export function bucketToString(this: Bucket) {
  return `Bucket<${this.layerPlan}>`;
}

// NOTE: I evaluated using `__proto__: batchExecutionValueProto` to extract the
// shared properties of these objects to see if performance was improved, but
// this was actually a net loss in performance.
//
// This is also evidence that you shouldn't trust ChatGPT for performance
// advice, and should always run your own benchmarks instead:
// https://chatgpt.com/share/67d1746f-4da8-8012-bdf8-707e54a4238e

// TODO: memoize?
export function batchExecutionValue<TData>(
  entries: TData[],
  _flags: ExecutionEntryFlags[] = arrayOfLength(entries.length, 0),
): BatchExecutionValue<TData> {
  return {
    // Try and keep these properties in the same order as unaryExecutionValue
    isBatch: true,
    at: batchEntriesAt,
    unaryValue: batchThrowNotUnary,
    _flagsAt: batchFlagsAt,
    _getStateUnion: batchGetStateUnion,
    _setResult: batchSetResult,
    _copyResult: batchCopyResult,

    entries,
    _flags,
    _cachedStateUnion: null,
  };
}

// TODO: memoize?
export function unaryExecutionValue<TData>(
  value: TData,
  _entryFlags: ExecutionEntryFlags = 0,
): UnaryExecutionValue<TData> {
  return {
    // Try and keep these properties in the same order as batchExecutionValue
    isBatch: false,
    at: unaryAt,
    unaryValue: unaryThisDotValue,
    _flagsAt: unaryFlagsAt,
    _getStateUnion: unaryGetStateUnion,
    _setResult: unarySetResult,
    _copyResult: unaryCopyResult,

    value,
    _entryFlags,
  };
}

function batchThrowNotUnary(): never {
  throw new Error(
    `This is not a unary value so we cannot get the single value - there may be more than one!`,
  );
}

function batchGetStateUnion(this: BatchExecutionValue) {
  if (this._cachedStateUnion === null) {
    let u = NO_FLAGS;
    for (const flag of this._flags) {
      u = u | flag;
    }
    this._cachedStateUnion = u;
  }
  return this._cachedStateUnion;
}

function batchEntriesAt(this: BatchExecutionValue, i: number) {
  return this.entries[i];
}

function batchFlagsAt(this: BatchExecutionValue, i: number) {
  return this._flags[i];
}

function batchSetResult(
  this: BatchExecutionValue,
  i: number,
  value: any,
  flags: ExecutionEntryFlags,
) {
  (this.entries as any[])[i] = value;
  this._flags[i] = flags;
}

// NOTE: batchCopyResult and unaryCopyResult are **identical**, but we don't
// want a single megamorphic function so we define it twice.
function batchCopyResult(
  this: BatchExecutionValue,
  targetIndex: number,
  source: ExecutionValue,
  sourceIndex: number,
): void {
  this._setResult(
    targetIndex,
    source.at(sourceIndex),
    source._flagsAt(sourceIndex),
  );
}
function unaryCopyResult(
  this: UnaryExecutionValue,
  targetIndex: number,
  source: ExecutionValue,
  sourceIndex: number,
): void {
  this._setResult(
    targetIndex,
    source.at(sourceIndex),
    source._flagsAt(sourceIndex),
  );
}

function unaryThisDotValue(this: UnaryExecutionValue) {
  return this.value;
}

function unaryAt(this: UnaryExecutionValue) {
  return this.value;
}

function unaryFlagsAt(this: UnaryExecutionValue) {
  return this._entryFlags;
}

function unaryGetStateUnion(this: UnaryExecutionValue) {
  return this._entryFlags;
}

function unarySetResult(
  this: UnaryExecutionValue,
  i: number,
  value: any,
  flags: any,
) {
  if (i !== 0) {
    throw new Error(`Unary step only expects one result`);
  }
  this.value = value;
  this._entryFlags = flags;
}

const indexMapCache = new Map<number, IndexMap>();
function makeIndexMap(count: number) {
  const existing = indexMapCache.get(count);
  if (existing !== undefined) {
    return existing;
  }
  const result: IndexMap = (callback) => {
    const results = [];
    for (let i = 0; i < count; i++) {
      results.push(callback(i));
    }
    return results;
  };
  if (count <= 100) {
    indexMapCache.set(count, result);
  }
  return result;
}
const indexForEachCache = new Map<number, IndexForEach>();
function makeIndexForEach(count: number) {
  const existing = indexForEachCache.get(count);
  if (existing !== undefined) {
    return existing;
  }
  const result: IndexForEach = (callback) => {
    for (let i = 0; i < count; i++) {
      callback(i);
    }
  };
  if (count <= 100) {
    indexForEachCache.set(count, result);
  }
  return result;
}
function executeStepFromEvent(event: ExecuteStepEvent) {
  return event.step.execute(event.executeDetails);
}

function evaluateStream(
  bucket: Bucket,
  step: Step,
  distributorOptions: DistributorOptions,
): ExecutionDetailsStream | null {
  const stream = step._stepOptions.stream;
  if (stream === null) return null;

  const shouldStream =
    stream === true || stream.ifStepId == null
      ? true
      : (bucket.store.get(stream.ifStepId)?.unaryValue() ?? true);
  if (!shouldStream) return null;

  const initialCount =
    stream === true || stream.initialCountStepId == null
      ? 0
      : (bucket.store.get(stream.initialCountStepId)?.unaryValue() ?? 0);
  if (initialCount >= distributorOptions.distributorTargetBufferSize) {
    // Streaming this would cause a delay, so let's just fetch it all up front.
    // (Really a user should have a validation cap on the maximum size of an
    // incremental initialCount.)
    return null;
  }
  return { initialCount };
}
