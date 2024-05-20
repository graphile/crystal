import { isAsyncIterable, isIterable } from "iterall";

import * as assert from "../assert.js";
import type { Bucket, RequestTools } from "../bucket.js";
import { isDev } from "../dev.js";
import { isFlaggedValue, SafeError } from "../error.js";
import { inspect } from "../inspect.js";
import type {
  BatchExecutionValue,
  ExecuteStepEvent,
  ExecutionDetails,
  ExecutionEntryFlags,
  ExecutionExtra,
  ExecutionValue,
  ForcedValues,
  GrafastExecutionArgs,
  GrafastInternalResultsOrStream,
  GrafastResultsList,
  GrafastResultStreamList,
  IndexForEach,
  IndexMap,
  PromiseOrDirect,
  StreamDetails,
  StreamMaybeMoreableArray,
  StreamStepEvent,
  UnaryExecutionValue,
  UnbatchedExecutionExtra,
} from "../interfaces.js";
import {
  $$streamMore,
  $$timeout,
  FLAG_ERROR,
  FLAG_INHIBITED,
  FLAG_NULL,
  FLAG_POLY_SKIPPED,
  FLAG_STOPPED,
  NO_FLAGS,
} from "../interfaces.js";
import type { ExecutableStep, UnbatchedExecutableStep } from "../step.js";
import { isStreamableStep } from "../step.js";
import { __ItemStep } from "../steps/__item.js";
import { __ValueStep } from "../steps/__value.js";
import { timeSource } from "../timeSource.js";
import { arrayOfLength, isPromiseLike, sudo } from "../utils.js";
import type { MetaByMetaKey } from "./OperationPlan.js";

/** Path to use when there's no polymorphic paths. */
const NO_POLY_PATH = "";

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
  /**
   * Execute the step directly; since there's no errors we can pass the
   * dependencies through verbatim.
   */
  function reallyExecuteStepWithoutFiltering(
    size: number,
    step: ExecutableStep,
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
  const { middlewares } = args;
  const {
    metaByMetaKey,
    size,
    store,
    layerPlan: { phases, children: childLayerPlans },
  } = bucket;

  const phaseCount = phases.length;

  let sideEffectStepsWithErrors: null | Record<string, ExecutableStep[]> = null;

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
    let sideEffectSteps: null | ExecutableStep[] = null;
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
          const r = timeoutError;
          const results = arrayOfLength(bucket.size, r);
          const flags = arrayOfLength(bucket.size, FLAG_ERROR);
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
        if (step.hasSideEffects) {
          if (sideEffectSteps === null) {
            sideEffectSteps = [step];
          } else {
            sideEffectSteps.push(step);
          }
        }
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
          const results = arrayOfLength(bucket.size, r);
          const flags = arrayOfLength(bucket.size, FLAG_ERROR);
          resultList[normalStepIndex] = { flags, results };
          indexesPendingLoopOver.push(normalStepIndex);

          // TODO: I believe we can remove this line?
          bucket.flagUnion |= FLAG_ERROR;
        }
      }
    }
    const handleSideEffectSteps = () => {
      if (!sideEffectStepsWithErrors) {
        sideEffectStepsWithErrors = bucket.polymorphicPathList.reduce(
          (memo, path) => {
            memo[path ?? NO_POLY_PATH] = [];
            return memo;
          },
          Object.create(null) as Record<string, ExecutableStep[]>,
        );
      }
      for (const step of sideEffectSteps!) {
        if (step.polymorphicPaths) {
          for (const path of step.polymorphicPaths) {
            sideEffectStepsWithErrors[path].push(step);
          }
        } else {
          sideEffectStepsWithErrors[NO_POLY_PATH].push(step);
        }
      }
    };

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
      let pendingPromiseIndexes:
        | Array<{
            /** The step (results) index */
            s: number;
            /** The data index */
            i: number;
          }>
        | undefined;

      // TODO: it seems that if this throws an error it results in a permanent
      // hang of defers? In the mean time... Don't throw any errors here!
      const success = (
        finishedStep: ExecutableStep,
        bucket: Bucket,
        resultIndex: number,
        value: unknown,
        flags: ExecutionEntryFlags,
      ) => {
        // Fast lanes
        if (typeof value !== "object") {
          // non-objects
          bucket.setResult(finishedStep, resultIndex, value, flags);
          return;
        } else if (value === null) {
          // nulls
          const finalFlags = flags | FLAG_NULL;
          bucket.setResult(finishedStep, resultIndex, null, finalFlags);
          return;
        } else if (isFlaggedValue(value)) {
          // flagged values
          const finalFlags = flags | value.flags;
          bucket.setResult(finishedStep, resultIndex, value.value, finalFlags);
          return;
        }

        let valueIsAsyncIterable;
        if (
          // Are we streaming this? If so, we need an iterable or async
          // iterable.
          finishedStep._stepOptions.stream &&
          ((valueIsAsyncIterable = isAsyncIterable(value)) || isIterable(value))
        ) {
          const streamOptions = finishedStep._stepOptions.stream;
          const initialCount: number = streamOptions
            ? streamOptions.initialCount
            : Infinity;

          const iterator = valueIsAsyncIterable
            ? (value as AsyncIterable<any>)[Symbol.asyncIterator]()
            : (value as Iterable<any>)[Symbol.iterator]();

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
                  arr.push(await resolvedResult.value);
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
          bucket.setResult(finishedStep, resultIndex, value, flags);
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
            if (!pendingPromises) {
              pendingPromises = [val];
              pendingPromiseIndexes = [{ s: allStepsIndex, i: dataIndex }];
            } else {
              pendingPromises.push(val);
              pendingPromiseIndexes!.push({ s: allStepsIndex, i: dataIndex });
            }
          }
        }
      }

      if (pendingPromises !== undefined) {
        return Promise.allSettled(pendingPromises)
          .then((resultSettledResult) => {
            for (
              let i = 0, pendingPromisesLength = resultSettledResult.length;
              i < pendingPromisesLength;
              i++
            ) {
              const settledResult = resultSettledResult[i];
              const { s: allStepsIndex, i: dataIndex } =
                pendingPromiseIndexes![i];
              const finishedStep = _allSteps[allStepsIndex];
              if (settledResult.status === "fulfilled") {
                success(
                  finishedStep,
                  bucket,
                  dataIndex,
                  settledResult.value,
                  NO_FLAGS,
                );
              } else {
                const error = settledResult.reason;
                bucket.setResult(finishedStep, dataIndex, error, FLAG_ERROR);
              }
            }
            if (
              (bucket.flagUnion & FLAG_ERROR) === FLAG_ERROR &&
              sideEffectSteps
            ) {
              handleSideEffectSteps();
            }
            return promises ? Promise.all(promises) : undefined;
          })
          .then(null, (e) => {
            // THIS SHOULD NEVER HAPPEN!
            console.error(
              `GrafastInternalError<1e9731b4-005e-4b0e-bc61-43baa62e6444>: this error should never occur! Please file an issue against grafast. Details: ${e}`,
            );

            bucket.flagUnion |= FLAG_ERROR;
            for (
              let i = 0, pendingPromisesLength = pendingPromises!.length;
              i < pendingPromisesLength;
              i++
            ) {
              const { s: allStepsIndex, i: dataIndex } =
                pendingPromiseIndexes![i];
              const finishedStep = _allSteps[allStepsIndex];
              const error = new Error(
                `GrafastInternalError<1e9731b4-005e-4b0e-bc61-43baa62e6444>: error occurred whilst performing completedStep(${finishedStep.id})`,
              );
              bucket.setResult(finishedStep, dataIndex, error, FLAG_ERROR);
            }
          });
      } else {
        if ((bucket.flagUnion & FLAG_ERROR) === FLAG_ERROR && sideEffectSteps) {
          handleSideEffectSteps();
        }
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
          _bucket: bucket,
          _requestContext: requestContext,
        };
        if (step._isUnary) {
          // Handled later
        } else {
          bucket.store.set(step.id, batchExecutionValue(arrayOfLength(size)));
        }
      }
      outerLoop: for (let dataIndex = 0; dataIndex < size; dataIndex++) {
        if (sideEffectStepsWithErrors) {
          const currentPolymorphicPath = bucket.polymorphicPathList[dataIndex];
          for (const dep of sideEffectStepsWithErrors[
            currentPolymorphicPath ?? NO_POLY_PATH
          ]) {
            const depExecutionValue = bucket.store.get(dep.id)!;
            const depFlags = depExecutionValue._flagsAt(dataIndex);
            if ((depFlags & FLAG_POLY_SKIPPED) === FLAG_POLY_SKIPPED) {
              /* noop */
            } else if ((depFlags & FLAG_ERROR) === FLAG_ERROR) {
              for (
                let allStepsIndex = executedLength;
                allStepsIndex < allStepsLength;
                allStepsIndex++
              ) {
                const step = _allSteps[
                  allStepsIndex
                ] as UnbatchedExecutableStep;
                if (step._isUnary) {
                  // COPY the unary value
                  bucket.store.set(step.id, depExecutionValue);
                  bucket.flagUnion |= depFlags;
                } else {
                  const depVal = depExecutionValue.at(dataIndex);
                  bucket.setResult(step, dataIndex, depVal, depFlags);
                }
              }
              continue outerLoop;
            }
          }
        }

        stepLoop: for (
          let allStepsIndex = executedLength;
          allStepsIndex < allStepsLength;
          allStepsIndex++
        ) {
          const step = sudo(
            _allSteps[allStepsIndex] as UnbatchedExecutableStep,
          );

          // Unary steps only need to be processed once
          if (step._isUnary && dataIndex !== 0) {
            continue;
          }

          try {
            const deps: any = [];
            const extra = extras[allStepsIndex];
            let forceIndexValue: Error | null | undefined = undefined;
            let rejectValue: Error | null | undefined = undefined;
            let indexFlags: ExecutionEntryFlags = NO_FLAGS;
            for (let i = 0, l = step.dependencies.length; i < l; i++) {
              const $dep = step.dependencies[i];
              const forbiddenFlags = step.dependencyForbiddenFlags[i];
              const onReject = step.dependencyOnReject[i];
              const depExecutionVal = bucket.store.get($dep.id)!;

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
              } else {
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
                deps.push(depVal);
              }
            }

            let stepResult, stepFlags;

            if (forceIndexValue !== undefined) {
              // Search for "17217999b7a7" for similar block
              if (forceIndexValue == null && rejectValue != null) {
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
    step: ExecutableStep,
    values: ReadonlyArray<ExecutionValue>,
    extra: ExecutionExtra,
  ): PromiseOrDirect<GrafastResultsList<any> | GrafastResultStreamList<any>> {
    if (isDev && step._isUnary && count !== 1) {
      throw new Error(
        `GrafastInternalError<84a6cdfa-e8fe-4dea-85fe-9426a6a78027>: ${step} is a unary step, but we're attempting to pass it ${count} (!= 1) values`,
      );
    }
    const streamOptions = step._stepOptions.stream;
    if (streamOptions && isStreamableStep(step)) {
      if (step.stream.length > 1) {
        throw new Error(
          `${step} is using a legacy form of 'stream' which accepts multiple arguments, please see https://err.red/gev2`,
        );
      }
      const streamDetails: StreamDetails<readonly any[]> = {
        indexMap: makeIndexMap(count),
        indexForEach: makeIndexForEach(count),
        count,
        values,
        extra,
        streamOptions,
      };
      if (!step.isSyncAndSafe && middlewares) {
        return middlewares.run(
          "streamStep",
          { args, step, streamDetails },
          streamStepFromEvent,
        );
      } else {
        return step.stream(streamDetails);
      }
    } else {
      if (step.execute.length > 1) {
        throw new Error(
          `${step} is using a legacy form of 'execute' which accepts multiple arguments, please see https://err.red/gev2`,
        );
      }
      const executeDetails: ExecutionDetails<readonly any[]> = {
        indexMap: makeIndexMap(count),
        indexForEach: makeIndexForEach(count),
        count,
        values,
        extra,
      };
      if (!step.isSyncAndSafe && middlewares) {
        return middlewares.run(
          "executeStep",
          { args, step, executeDetails },
          executeStepFromEvent,
        );
      } else {
        return step.execute(executeDetails);
      }
    }
  }

  // Slow mode...
  /**
   * Execute the step, filtering out errors and entries with non-matching
   * polymorphicPaths from the input dependencies and then padding the lists
   * back out at the end.
   */
  function reallyExecuteStepWithFiltering(
    step: ExecutableStep,
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
    const stepPolymorphicPaths = step.polymorphicPaths;
    const legitDepsCount = sudo(step).dependencies.length;
    let dependencies = sideEffectStepsWithErrors
      ? dependenciesIncludingSideEffects.slice(0, legitDepsCount)
      : dependenciesIncludingSideEffects;

    // OPTIM: if unariesIncludingSideEffects.some(isGrafastError) then shortcut execution because everything fails

    // for (let index = 0, l = polymorphicPathList.length; index < l; index++) {
    for (let dataIndex = 0; dataIndex < expectedSize; dataIndex++) {
      let forceIndexValue: Error | null | undefined = undefined;
      let rejectValue: Error | null | undefined = undefined;
      let indexFlags: ExecutionEntryFlags = NO_FLAGS;
      if (
        stepPolymorphicPaths !== null &&
        !stepPolymorphicPaths.has(polymorphicPathList[dataIndex] as string)
      ) {
        indexFlags |= FLAG_POLY_SKIPPED;
        forceIndexValue = null;
      } else if (extra._bucket.flagUnion) {
        for (
          let i = 0, l = dependenciesIncludingSideEffects.length;
          i < l;
          i++
        ) {
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
        newSize++;
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
    step: ExecutableStep,
  ): PromiseOrDirect<GrafastInternalResultsOrStream<any>> {
    try {
      const meta =
        step.metaKey !== undefined ? metaByMetaKey[step.metaKey] : undefined;
      const extra: ExecutionExtra = {
        stopTime,
        meta,
        eventEmitter,
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
        step: ExecutableStep,
        forbiddenFlags: ExecutionEntryFlags,
        onReject: Error | null | undefined,
      ) => {
        const executionValue = store.get(step.id)!;
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
      if (depCount > 0 || sideEffectStepsWithErrors !== null) {
        for (let i = 0, l = depCount; i < l; i++) {
          const $dep = sstep.dependencies[i];
          addDependency(
            $dep,
            sstep.dependencyForbiddenFlags[i],
            sstep.dependencyOnReject[i],
          );
        }
        if (sideEffectStepsWithErrors !== null) {
          if (sstep.polymorphicPaths) {
            for (const path of sstep.polymorphicPaths) {
              for (const sideEffectStep of sideEffectStepsWithErrors[path]) {
                // TODO: revisit this, feels like we might be adding the same
                // effect multiple times if it matches multiple paths.
                addDependency(sideEffectStep, defaultForbiddenFlags, undefined);
              }
            }
          } else {
            for (const sideEffectStep of sideEffectStepsWithErrors[
              NO_POLY_PATH
            ]) {
              addDependency(sideEffectStep, defaultForbiddenFlags, undefined);
            }
          }
        }
      }
      if (
        isDev &&
        step.layerPlan.reason.type === "polymorphic" &&
        step.polymorphicPaths === null
      ) {
        throw new Error(
          `GrafastInternalError<c33328fe-6758-4699-8ac6-7be41ce58bfb>: a step without polymorphic paths cannot belong to a polymorphic bucket`,
        );
      }
      if (!needsFiltering) {
        const isSelectiveStep =
          step.layerPlan.reason.type === "polymorphic" &&
          step.polymorphicPaths!.size !==
            step.layerPlan.reason.polymorphicPaths.size;
        needsFiltering ||= isSelectiveStep;
      }
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
            step._isUnary ? 1 : size,
            step,
            dependencies,
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
    // PERF: create a JIT factory for this at planning time
    const childPromises: PromiseLike<any>[] = [];

    // This promise should never reject
    let mutationQueue: PromiseLike<void> | null = null;
    /**
     * Ensures that callback is only called once all other enqueued callbacks
     * are called.
     */
    const enqueue = <T>(callback: () => PromiseOrDirect<T>): PromiseLike<T> => {
      const result = (mutationQueue ?? Promise.resolve()).then(callback);
      mutationQueue = result.then(noop, noop);
      return result;
    };

    loop: for (const childLayerPlan of childLayerPlans) {
      switch (childLayerPlan.reason.type) {
        case "nullableBoundary":
        case "listItem":
        case "polymorphic": {
          const childBucket = childLayerPlan.newBucket(bucket);
          if (childBucket !== null) {
            // Execute
            const result = executeBucket(childBucket, requestContext);
            if (isPromiseLike(result)) {
              childPromises.push(result);
            }
          }
          break;
        }
        case "mutationField": {
          const childBucket = childLayerPlan.newBucket(bucket);
          if (childBucket !== null) {
            // Enqueue for execution (mutations must run in order)
            const promise = enqueue(() =>
              executeBucket(childBucket, requestContext),
            );
            childPromises.push(promise);
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
      return Promise.all(childPromises).then(() => {
        bucket.isComplete = true;
        return;
      });
    } else {
      bucket.isComplete = true;
      return;
    }
  }
}

/** @internal */
export function newBucket(
  spec: Pick<
    Bucket,
    | "layerPlan"
    | "store"
    | "size"
    | "flagUnion"
    | "polymorphicPathList"
    | "iterators"
  >,
  parentMetaByMetaKey: MetaByMetaKey | null,
): Bucket {
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
    parentMetaByMetaKey === null ||
    type === "root" ||
    type === "mutationField" ||
    type === "subscription"
      ? // Reset the metaByMetaKey
        spec.layerPlan.operationPlan.makeMetaByMetaKey()
      : parentMetaByMetaKey;
  // Copy from spec
  const { layerPlan, store, size, flagUnion, polymorphicPathList, iterators } =
    spec;
  const children = Object.create(null);
  return {
    toString: bucketToString,
    layerPlan,
    store,
    size,
    flagUnion,
    polymorphicPathList,
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
      if (flags !== 0) {
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
}

export function bucketToString(this: Bucket) {
  return `Bucket<${this.layerPlan}>`;
}

// TODO: memoize?
export function batchExecutionValue<TData>(
  entries: TData[],
  _flags: ExecutionEntryFlags[] = arrayOfLength(entries.length, 0),
): BatchExecutionValue<TData> {
  let cachedStateUnion: ExecutionEntryFlags | null = null;
  return {
    at: batchEntriesAt,
    isBatch: true,
    entries,
    _flags,
    _flagsAt: batchFlagsAt,
    _getStateUnion() {
      if (cachedStateUnion === null) {
        cachedStateUnion = _flags.reduce(bitwiseOr, NO_FLAGS);
      }
      return cachedStateUnion;
    },
    _setResult: batchSetResult,
    _copyResult,
  };
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

function bitwiseOr(memo: number, a: number) {
  return memo | a;
}

function _copyResult(
  this: ExecutionValue,
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

// TODO: memoize?
export function unaryExecutionValue<TData>(
  value: TData,
  _entryFlags: ExecutionEntryFlags = 0,
): UnaryExecutionValue<TData> {
  return {
    at: unaryAt,
    isBatch: false,
    value,
    _entryFlags,
    _flagsAt: unaryFlagsAt,
    _getStateUnion: unaryGetStateUnion,
    _setResult: unarySetResult,
    _copyResult,
  };
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

function streamStepFromEvent(event: StreamStepEvent) {
  return event.step.stream(event.streamDetails);
}

function executeStepFromEvent(event: ExecuteStepEvent) {
  return event.step.execute(event.executeDetails);
}
