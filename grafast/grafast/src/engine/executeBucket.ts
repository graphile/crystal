import { isAsyncIterable, isIterable } from "iterall";

import * as assert from "../assert.js";
import type { Bucket, RequestTools } from "../bucket.js";
import { isDev } from "../dev.js";
import type { GrafastError } from "../error.js";
import {
  $$error,
  isGrafastError,
  newGrafastError,
  SafeError,
} from "../error.js";
import { inspect } from "../inspect.js";
import type {
  ExecutionExtra,
  GrafastResultsList,
  GrafastResultStreamList,
  PromiseOrDirect,
  StreamMaybeMoreableArray,
  UnbatchedExecutionExtra,
} from "../interfaces.js";
import { $$streamMore, $$timeout } from "../interfaces.js";
import type { ExecutableStep, UnbatchedExecutableStep } from "../step.js";
import { isStreamableStep, isStreamV2ableStep } from "../step.js";
import { __ItemStep } from "../steps/__item.js";
import { __ValueStep } from "../steps/__value.js";
import { timeSource } from "../timeSource.js";
import { arrayOfLength, isPromiseLike, sudo } from "../utils.js";
import type { MetaByMetaKey } from "./OperationPlan.js";

const DEBUG_POLYMORPHISM = false;

/** Path to use when there's no polymorphic paths. */
const NO_POLY_PATH = "";

// TODO: the handling of polymorphism via POLY_SKIPPED is distasteful. Find a
// better approach.

// An error that indicates this entry was skipped because it didn't match
// polymorphicPath.
const POLY_SKIPPED = newGrafastError(
  new Error(
    "GrafastInternalError<757b99f9-cb4d-4141-895d-8c687b2048fd>: Polymorphic skipped; you should never see this",
  ),
  null,
);

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
  errors: { [index: number]: GrafastError | undefined },
  resultCount: number,
): any[] {
  const finalResults: any[] = [];
  /** The index within `results`, which is shorter than `resultCount` */
  let resultIndex = 0;

  for (let finalIndex = 0; finalIndex < resultCount; finalIndex++) {
    const error = errors[finalIndex];
    if (error !== undefined) {
      finalResults[finalIndex] = error;
    } else {
      finalResults[finalIndex] = results[resultIndex++];
    }
  }
  return finalResults;
}

/** @internal */
export function executeBucket(
  bucket: Bucket,
  requestContext: RequestTools,
): PromiseOrDirect<void> {
  /**
   * Execute the step directly; since there's no errors we can pass the
   * dependencies through verbatim!
   */
  const reallyExecuteStepWithNoErrors = executeOrStream;

  const { stopTime, eventEmitter } = requestContext;
  const {
    metaByMetaKey,
    size,
    store,
    unaryStore,
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
      | PromiseLike<GrafastResultsList<any> | GrafastResultStreamList<any>>[]
      | null = null;
    let sideEffectSteps: null | ExecutableStep[] = null;
    let executePromiseResultIndex: number[] | null = null;
    const results: Array<
      GrafastResultsList<any> | GrafastResultStreamList<any> | undefined
    > = [];
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
          const r = newGrafastError(timeoutError, step.id);
          const result = arrayOfLength(bucket.size, r);
          results[normalStepIndex] = result;
          indexesPendingLoopOver.push(normalStepIndex);
          bucket.hasErrors = true;
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
            results[normalStepIndex] = undefined /* will populate shortly */;
            if (!executePromises) {
              executePromises = [r];
              executePromiseResultIndex = [normalStepIndex];
            } else {
              const newIndex = executePromises.push(r) - 1;
              executePromiseResultIndex![newIndex] = normalStepIndex;
            }
          } else {
            results[normalStepIndex] = r;
            indexesPendingLoopOver.push(normalStepIndex);
          }
        } catch (e) {
          const r = newGrafastError(e, step.id);
          const result = arrayOfLength(bucket.size, r);
          results[normalStepIndex] = result;
          indexesPendingLoopOver.push(normalStepIndex);
          bucket.hasErrors = true;
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
        const result = results[allStepsIndex];
        const finishedStep = _allSteps[allStepsIndex];
        const resultLength = result?.length;
        if (resultLength !== size) {
          if (!Array.isArray(result)) {
            throw new Error(
              `Result from ${finishedStep} should be an array, instead received ${inspect(
                result,
                { colors: true },
              )}`,
            );
          }
          throw new Error(
            `Result array from ${finishedStep} should have length ${size}, instead it had length ${result.length}`,
          );
        }
        if (finishedStep._isUnary) {
          bucket.unaryStore.set(finishedStep.id, null); // TODO: what placeholder value should we use?
        } else {
          bucket.store.set(finishedStep.id, arrayOfLength(size));
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
      ) => {
        let proto: any;
        if (
          // Fast-lane for non-objects
          typeof value !== "object" ||
          value === null
        ) {
          if (finishedStep._isUnary) {
            bucket.unaryStore.set(finishedStep.id, value);
          } else {
            const finalResult = bucket.store.get(finishedStep.id)!;
            finalResult[resultIndex] = value;
          }
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
            if (finishedStep._isUnary) {
              bucket.unaryStore.set(finishedStep.id, arr);
            } else {
              const finalResult = bucket.store.get(finishedStep.id)!;
              finalResult[resultIndex] = arr;
            }
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

                if (finishedStep._isUnary) {
                  bucket.unaryStore.set(finishedStep.id, arr);
                } else {
                  const finalResult = bucket.store.get(finishedStep.id)!;
                  finalResult[resultIndex] = arr;
                }
              } catch (e) {
                bucket.hasErrors = true;
                const error = newGrafastError(e, finishedStep.id);
                if (finishedStep._isUnary) {
                  bucket.unaryStore.set(finishedStep.id, error);
                } else {
                  const finalResult = bucket.store.get(finishedStep.id)!;
                  finalResult[resultIndex] = error;
                }
              }
            })();
            if (!promises) {
              promises = [promise];
            } else {
              promises.push(promise);
            }
          }
        } else if (
          (proto = Object.getPrototypeOf(value)) === null ||
          proto === Object.prototype
        ) {
          if (finishedStep._isUnary) {
            bucket.unaryStore.set(finishedStep.id, value);
          } else {
            const finalResult = bucket.store.get(finishedStep.id)!;
            finalResult[resultIndex] = value;
          }
        } else if (value instanceof Error) {
          const e =
            $$error in value ? value : newGrafastError(value, finishedStep.id);
          if (finishedStep._isUnary) {
            bucket.unaryStore.set(finishedStep.id, e);
          } else {
            const finalResult = bucket.store.get(finishedStep.id)!;
            finalResult[resultIndex] = e;
          }
          bucket.hasErrors = true;
        } else {
          if (finishedStep._isUnary) {
            bucket.unaryStore.set(finishedStep.id, value);
          } else {
            const finalResult = bucket.store.get(finishedStep.id)!;
            finalResult[resultIndex] = value;
          }
        }
      };

      for (const allStepsIndex of indexesToProcess) {
        const step = _allSteps[allStepsIndex];
        const result = results[allStepsIndex]!;
        for (let dataIndex = 0; dataIndex < size; dataIndex++) {
          const val = result[dataIndex];
          if (step.isSyncAndSafe || !isPromiseLike(val)) {
            success(step, bucket, dataIndex, val);
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
                success(finishedStep, bucket, dataIndex, settledResult.value);
              } else {
                bucket.hasErrors = true;
                const error = newGrafastError(
                  settledResult.reason,
                  finishedStep.id,
                );
                if (finishedStep._isUnary) {
                  bucket.unaryStore.set(finishedStep.id, error);
                } else {
                  const storeEntry = bucket.store.get(finishedStep.id)!;
                  storeEntry[dataIndex] = error;
                }
              }
            }
            if (bucket.hasErrors && sideEffectSteps) {
              handleSideEffectSteps();
            }
            return promises ? Promise.all(promises) : undefined;
          })
          .then(null, (e) => {
            // THIS SHOULD NEVER HAPPEN!
            console.error(
              `GrafastInternalError<1e9731b4-005e-4b0e-bc61-43baa62e6444>: this error should never occur! Please file an issue against grafast. Details: ${e}`,
            );

            bucket.hasErrors = true;
            for (
              let i = 0, pendingPromisesLength = pendingPromises!.length;
              i < pendingPromisesLength;
              i++
            ) {
              const { s: allStepsIndex, i: dataIndex } =
                pendingPromiseIndexes![i];
              const finishedStep = _allSteps[allStepsIndex];
              const error = newGrafastError(
                new Error(
                  `GrafastInternalError<1e9731b4-005e-4b0e-bc61-43baa62e6444>: error occurred whilst performing completedStep(${finishedStep.id})`,
                ),
                finishedStep.id,
              );
              if (finishedStep._isUnary) {
                bucket.unaryStore.set(finishedStep.id, error);
              } else {
                const storeEntry = bucket.store.get(finishedStep.id)!;
                storeEntry[dataIndex] = error;
              }
            }
          });
      } else {
        if (bucket.hasErrors && sideEffectSteps) {
          handleSideEffectSteps();
        }
        return promises ? Promise.all(promises) : undefined;
      }
    };

    const runSyncSteps = () => {
      const executedLength = results.length;
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
          bucket.store.set(step.id, arrayOfLength(size));
        }
      }
      outerLoop: for (let dataIndex = 0; dataIndex < size; dataIndex++) {
        if (sideEffectStepsWithErrors) {
          const currentPolymorphicPath = bucket.polymorphicPathList[dataIndex];
          for (const dep of sideEffectStepsWithErrors[
            currentPolymorphicPath ?? NO_POLY_PATH
          ]) {
            const depVal = dep._isUnary
              ? bucket.unaryStore.get(dep.id)
              : bucket.store.get(dep.id)![dataIndex];
            if (
              depVal === POLY_SKIPPED ||
              (isDev && depVal?.$$error === POLY_SKIPPED)
            ) {
              /* noop */
            } else if (isGrafastError(depVal)) {
              for (
                let allStepsIndex = executedLength;
                allStepsIndex < allStepsLength;
                allStepsIndex++
              ) {
                const step = _allSteps[
                  allStepsIndex
                ] as UnbatchedExecutableStep;
                if (step._isUnary) {
                  bucket.unaryStore.set(step.id, depVal);
                } else {
                  const storeEntry = bucket.store.get(step.id)!;
                  storeEntry[dataIndex] = depVal;
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
          try {
            const deps: any = [];
            const extra = extras[allStepsIndex];
            for (const $dep of step.dependencies) {
              const depVal = $dep._isUnary
                ? bucket.unaryStore.get($dep.id)
                : bucket.store.get($dep.id)![dataIndex];
              if (bucket.hasErrors && isGrafastError(depVal)) {
                if (step._isUnary) {
                  bucket.unaryStore.set(step.id, depVal);
                } else {
                  const storeEntry = bucket.store.get(step.id)!;
                  storeEntry[dataIndex] = depVal;
                }
                continue stepLoop;
              }
              deps.push(depVal);
            }
            const stepResult = step.unbatchedExecute(extra, ...deps);
            if (step._isUnary) {
              bucket.unaryStore.set(step.id, stepResult);
            } else {
              const storeEntry = bucket.store.get(step.id)!;
              storeEntry[dataIndex] = stepResult;
            }
          } catch (e) {
            bucket.hasErrors = true;
            const error = newGrafastError(e, step.id);
            if (step._isUnary) {
              bucket.unaryStore.set(step.id, error);
            } else {
              const storeEntry = bucket.store.get(step.id)!;
              storeEntry[dataIndex] = error;
            }
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
            results[index] = promiseResult;
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
    size: number,
    step: ExecutableStep,
    dependencies: Array<ReadonlyArray<any> | null>,
    extra: ExecutionExtra,
  ): PromiseOrDirect<GrafastResultsList<any> | GrafastResultStreamList<any>> {
    if (step._stepOptions.stream && isStreamV2ableStep(step)) {
      return step.streamV2(size, dependencies, extra, step._stepOptions.stream);
    } else if (step._stepOptions.stream && isStreamableStep(step)) {
      // Backwards compatibility
      const backfilledValues = dependencies.map((v, i) =>
        v === null ? arrayOfLength(size, extra.unaries[i]) : v,
      );
      return step.stream(
        size,
        backfilledValues,
        extra,
        step._stepOptions.stream,
      );
    } else {
      return step.executeV2(size, dependencies, extra);
    }
  }

  // Slow mode...
  /**
   * Execute the step, filtering out errors and entries with non-matching
   * polymorphicPaths from the input dependencies and then padding the lists
   * back out at the end.
   */
  function reallyExecuteStepWithErrorsOrSelective(
    step: ExecutableStep,
    dependenciesIncludingSideEffects: Array<ReadonlyArray<any> | null>,
    polymorphicPathList: readonly (string | null)[],
    extra: ExecutionExtra,
  ): PromiseOrDirect<GrafastResultsList<any> | GrafastResultStreamList<any>> {
    const errors: { [index: number]: GrafastError | undefined } =
      arrayOfLength(size);

    /** If there's errors, we must manipulate the arrays being passed into the step execution */
    let foundErrors = false;

    /** If all we see is errors, there's no need to execute! */
    let newSize = 0;
    const stepPolymorphicPaths = step.polymorphicPaths;
    const legitDepsCount = sudo(step).dependencies.length;
    let dependencies = (
      sideEffectStepsWithErrors
        ? dependenciesIncludingSideEffects.slice(0, legitDepsCount)
        : dependenciesIncludingSideEffects
    ) as (any[] | null)[];

    // OPTIM: if extra.unaries.some(isGrafastError) then shortcut execution because everything fails

    // for (let index = 0, l = polymorphicPathList.length; index < l; index++) {
    for (let index = 0; index < size; index++) {
      let indexError: GrafastError | null = null;
      const polymorphicPath = polymorphicPathList[index];
      if (
        stepPolymorphicPaths !== null &&
        !stepPolymorphicPaths.has(polymorphicPath as string)
      ) {
        const e =
          isDev && DEBUG_POLYMORPHISM
            ? Object.assign(
                newGrafastError(
                  new Error(
                    `GrafastInternalError<00d52055-06b0-4b25-abeb-311b800ea284>: step ${
                      step.id
                    } (polymorphicPaths ${[
                      ...stepPolymorphicPaths,
                    ]}) has no match for '${polymorphicPath}'`,
                  ),
                  step.id,
                ),
                { $$error: POLY_SKIPPED },
              )
            : POLY_SKIPPED;

        indexError = e;
      } else if (extra._bucket.hasErrors) {
        for (
          let i = 0, l = dependenciesIncludingSideEffects.length;
          i < l;
          i++
        ) {
          const depList = dependenciesIncludingSideEffects[i];
          const v = depList ? depList[index] : extra.unaries[i];
          if (isGrafastError(v)) {
            indexError = v;
            break;
          }
        }
      } else {
        // All good
      }
      if (indexError) {
        if (!foundErrors) {
          foundErrors = true;
          // Clone up until this point, make mutable, don't add self
          dependencies = dependencies.map((depList) =>
            depList ? depList.slice(0, index) : depList,
          );
        }
        errors[index] = indexError;
      } else {
        newSize++;
        if (foundErrors) {
          // dependenciesWithoutErrors has limited content; add this non-error value
          for (
            let depListIndex = 0;
            depListIndex < legitDepsCount;
            depListIndex++
          ) {
            const depList = dependencies[depListIndex];
            if (depList) {
              depList.push(
                dependenciesIncludingSideEffects[depListIndex]![index],
              );
            }
          }
        }
      }
    }

    // Trim the side-effect dependencies back out again
    if (sideEffectStepsWithErrors) {
      extra.unaries = extra.unaries.slice(0, legitDepsCount);
    }

    if (newSize === 0) {
      // Everything is errors; we can skip execution
      return Object.values(errors);
    } else if (foundErrors) {
      const resultWithoutErrors = executeOrStream(
        newSize,
        step,
        dependencies,
        extra,
      );
      if (isPromiseLike(resultWithoutErrors)) {
        return resultWithoutErrors.then((r) =>
          mergeErrorsBackIn(r, errors, size),
        );
      } else {
        return mergeErrorsBackIn(resultWithoutErrors, errors, size);
      }
    } else {
      return reallyExecuteStepWithNoErrors(size, step, dependencies, extra);
    }
  }

  /**
   * This function MIGHT throw or reject, so be sure to handle that.
   */
  function executeStep(
    step: ExecutableStep,
  ): PromiseOrDirect<GrafastResultsList<any> | GrafastResultStreamList<any>> {
    try {
      const meta =
        step.metaKey !== undefined ? metaByMetaKey[step.metaKey] : undefined;
      const unaries: Array<any | null> = [];
      const extra: ExecutionExtra = {
        unaries,
        stopTime,
        meta,
        eventEmitter,
        _bucket: bucket,
        _requestContext: requestContext,
      };
      const dependencies: Array<ReadonlyArray<any> | null> = [];
      const sstep = sudo(step);
      const depCount = sstep.dependencies.length;
      if (depCount > 0 || sideEffectStepsWithErrors !== null) {
        for (let i = 0, l = depCount; i < l; i++) {
          const $dep = sstep.dependencies[i];
          if ($dep._isUnary) {
            dependencies[i] = null;
            unaries[i] = unaryStore.get($dep.id);
          } else {
            dependencies[i] = store.get($dep.id)!;
            unaries[i] = null;
          }
        }
        if (sideEffectStepsWithErrors !== null) {
          if (sstep.polymorphicPaths) {
            for (const path of sstep.polymorphicPaths) {
              for (const sideEffectStep of sideEffectStepsWithErrors[path]) {
                if (sideEffectStep._isUnary) {
                  const sideEffectStoreEntry = unaryStore.get(
                    sideEffectStep.id,
                  )!;
                  if (!unaries.includes(sideEffectStoreEntry)) {
                    dependencies.push(null);
                    unaries.push(sideEffectStoreEntry);
                  }
                } else {
                  const sideEffectStoreEntry = store.get(sideEffectStep.id)!;
                  if (!dependencies.includes(sideEffectStoreEntry)) {
                    dependencies.push(sideEffectStoreEntry);
                    unaries.push(null);
                  }
                }
              }
            }
          } else {
            for (const sideEffectStep of sideEffectStepsWithErrors[
              NO_POLY_PATH
            ]) {
              if (sideEffectStep._isUnary) {
                const sideEffectStoreEntry = unaryStore.get(sideEffectStep.id)!;
                if (!unaries.includes(sideEffectStoreEntry)) {
                  dependencies.push(null);
                  unaries.push(sideEffectStoreEntry);
                }
              } else {
                const sideEffectStoreEntry = store.get(sideEffectStep.id)!;
                if (!dependencies.includes(sideEffectStoreEntry)) {
                  dependencies.push(sideEffectStoreEntry);
                  unaries.push(null);
                }
              }
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
      const isSelectiveStep =
        step.layerPlan.reason.type === "polymorphic" &&
        step.polymorphicPaths!.size !==
          step.layerPlan.reason.polymorphicPaths.size;
      const result =
        bucket.hasErrors || isSelectiveStep
          ? reallyExecuteStepWithErrorsOrSelective(
              step,
              dependencies,
              bucket.polymorphicPathList,
              extra,
            )
          : reallyExecuteStepWithNoErrors(size, step, dependencies, extra);
      if (isPromiseLike(result)) {
        return result.then(null, (error) => {
          // bucket.hasErrors = true;
          return arrayOfLength(size, error);
        });
      } else {
        return result;
      }
    } catch (error) {
      // bucket.hasErrors = true;
      return arrayOfLength(size, error);
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
    | "unaryStore"
    | "size"
    | "hasErrors"
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
        Array.isArray(list),
        `Store entry for step '${key}' for layerPlan '${spec.layerPlan.id}' should be a list`,
      );
      assert.strictEqual(
        list.length,
        spec.size,
        `Store entry for step '${key}' for layerPlan '${spec.layerPlan.id}' should have same length as bucket`,
      );
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
  return {
    // Copy from spec
    layerPlan: spec.layerPlan,
    store: spec.store,
    unaryStore: spec.unaryStore,
    size: spec.size,
    hasErrors: spec.hasErrors,
    polymorphicPathList: spec.polymorphicPathList,
    iterators: spec.iterators,
    metaByMetaKey,
    isComplete: false,
    children: Object.create(null),
  };
}
