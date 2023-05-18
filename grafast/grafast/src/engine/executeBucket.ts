import { isAsyncIterable, isIterable } from "iterall";

import * as assert from "../assert.js";
import type { Bucket, RequestTools } from "../bucket.js";
import { isDev } from "../dev.js";
import type { GrafastError } from "../error.js";
import { $$error, isGrafastError, newGrafastError } from "../error.js";
import { SafeError, __ItemStep, isStreamableStep } from "../index.js";
import { inspect } from "../inspect.js";
import type {
  ExecutionExtra,
  GrafastResultsList,
  GrafastResultStreamList,
  PromiseOrDirect,
} from "../interfaces.js";
import { $$streamMore, $$timeout } from "../interfaces.js";
import type { ExecutableStep, UnbatchedExecutableStep } from "../step.js";
import { __ValueStep } from "../steps/__value.js";
import { arrayOfLength, isPromiseLike } from "../utils.js";
import { timeSource } from "../timeSource.js";

const DEBUG_POLYMORPHISM = false;

// An error that indicates this entry was skipped because it didn't match
// polymorphicPath.
const POLY_SKIPPED = newGrafastError(
  new Error("Polymorphic skipped; you should never see this"),
  null,
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
  let resultIndex = 0;

  for (let i = 0; i < resultCount; i++) {
    const error = errors[i];
    if (error !== undefined) {
      finalResults[i] = error;
    } else {
      finalResults[i] = results[resultIndex++];
    }
  }
  return finalResults;
}

type StreamMoreableArray<T> = Array<T> & {
  [$$streamMore]?: AsyncIterator<any, any, any>;
};

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

  // TODO: metaByMetaKey might belong to the bucket (`inheritMeta: boolean`)
  // rather than the request context? Mutations and subscriptions shouldn't
  // re-use caches.
  const { layerPlan } = bucket;
  if (
    layerPlan.reason.type === "root" ||
    layerPlan.reason.type === "mutationField" ||
    layerPlan.reason.type === "subscription"
  ) {
    // Reset the metaByMetaKey
    requestContext.metaByMetaKey = layerPlan.operationPlan.makeMetaByMetaKey();
  }

  const { metaByMetaKey } = requestContext;
  const {
    size,
    store,
    layerPlan: { phases, children: childLayerPlans },
  } = bucket;

  const phaseCount = phases.length;

  let sideEffectPlanIdsWithErrors: null | number[] = null;

  // Like a `for(i = 0; i < phaseCount; i++)` loop with some `await`s in it, except it does promise
  // handling manually so that it can complete synchronously (no promises) if
  // possible.
  const nextPhase = (phaseIndex: number): PromiseOrDirect<void> => {
    if (phaseIndex >= phaseCount) {
      return;
    }
    const phase = phases[phaseIndex];

    let executePromises:
      | PromiseLike<GrafastResultsList<any> | GrafastResultStreamList<any>>[]
      | null = null;
    let sideEffectPlanIds: null | number[] = null;
    let executePromiseResultIndex: number[] | null = null;
    const results: Array<
      GrafastResultsList<any> | GrafastResultStreamList<any> | undefined
    > = [];
    if (
      phase.checkTimeout &&
      requestContext.stopTime !== null &&
      timeSource.now() >= requestContext.stopTime
    ) {
      // ABORT!
      const timeoutError = new SafeError(
        "Execution timeout exceeded, please simplify or add limits to your request.",
        { [$$timeout]: true },
      );
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
          if (sideEffectPlanIds === null) {
            sideEffectPlanIds = [step.id];
          } else {
            sideEffectPlanIds.push(step.id);
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
          }
        } catch (e) {
          const r = newGrafastError(e, step.id);
          const result = arrayOfLength(bucket.size, r);
          bucket.store.set(step.id, result);
          results[normalStepIndex] = undefined;
          // TODO: shouldn't this ^ be `results[normalStepIndex] = result;` ?
          bucket.hasErrors = true;
        }
      }
    }
    const handleSideEffectPlanIds = () => {
      if (!sideEffectPlanIdsWithErrors) {
        sideEffectPlanIdsWithErrors = [];
      }
      for (const id of sideEffectPlanIds!) {
        sideEffectPlanIdsWithErrors.push(id);
      }
    };

    const next = () => {
      return nextPhase(phaseIndex + 1);
    };

    const loopOverResults = () => {
      const { _allSteps } = phase;
      const allStepsLength = _allSteps.length;
      const executedLength = results.length;

      if (isDev) {
        assert.strictEqual(
          executedLength,
          phase.normalSteps?.length ?? 0,
          "Expected only and all normalSteps to have executed",
        );
      }

      // Validate executed steps
      for (
        let allStepsIndex = 0;
        allStepsIndex < executedLength;
        allStepsIndex++
      ) {
        const result = results[allStepsIndex];
        if (!Array.isArray(result)) {
          const finishedStep = _allSteps[allStepsIndex];
          throw new Error(
            `Result from ${finishedStep} should be an array, instead received ${inspect(
              result,
              { colors: true },
            )}`,
          );
        }
        const resultLength = result.length;
        if (resultLength !== size) {
          const finishedStep = _allSteps[allStepsIndex];
          throw new Error(
            `Result array from ${finishedStep} should have length ${size}, instead it had length ${result.length}`,
          );
        }
      }

      // Need to complete promises, check for errors, etc.
      // **DO NOT THROW, DO NOT ALLOW AN ERROR TO BE RAISED!**
      // **USE DEFENSIVE PROGRAMMING HERE!**

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

      for (const step of _allSteps) {
        bucket.store.set(step.id, arrayOfLength(size));
      }

      const success = (
        finishedStep: ExecutableStep,
        finalResult: any[],
        resultIndex: number,
        value: unknown,
      ) => {
        let proto: any;
        if (
          // Fast-lane for non-objects
          typeof value !== "object" ||
          value === null
        ) {
          finalResult[resultIndex] = value;
        } else if (
          // Detects async iterables (but excludes all the basic types
          // like arrays, Maps, Sets, etc that are also iterables) and
          // handles them specially.
          isAsyncIterable(value) &&
          !isIterable(value)
        ) {
          const iterator = value[Symbol.asyncIterator]();

          const streamOptions = finishedStep._stepOptions.stream;
          const initialCount: number = streamOptions
            ? streamOptions.initialCount
            : Infinity;

          // FIXME: potential memory leak; need to ensure that iterator is
          // terminated even if the stream is never consumed (e.g. if something
          // else errors). For query/mutation we can do this when operation
          // completes, for subscription we should do it after each individual
          // payload (and all its streamed/deferred children) are complete
          // before processing the next subscription event.

          if (initialCount === 0) {
            // Optimization - defer everything
            const arr: StreamMoreableArray<any> = [];
            arr[$$streamMore] = iterator;
            finalResult[resultIndex] = arr;
          } else {
            // Evaluate the first initialCount entries, rest is streamed.
            const promise = (async () => {
              try {
                let valuesSeen = 0;
                const arr: StreamMoreableArray<any> = [];

                /*
                 * We need to "shift" a few entries off the top of the
                 * iterator, but still keep it iterable for the later
                 * stream. To accomplish this we have to do manual
                 * looping
                 */

                let resultPromise: Promise<IteratorResult<any, any>>;
                while ((resultPromise = iterator.next())) {
                  const finalResult = await resultPromise;
                  if (finalResult.done) {
                    break;
                  }
                  arr.push(await finalResult.value);
                  if (++valuesSeen >= initialCount) {
                    // This is safe to do in the `while` since we checked
                    // the `0` entries condition in the optimization
                    // above.
                    arr[$$streamMore] = iterator;
                    break;
                  }
                }

                finalResult[resultIndex] = arr;
              } catch (e) {
                bucket.hasErrors = true;
                finalResult[resultIndex] = newGrafastError(e, finishedStep.id);
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
          finalResult[resultIndex] = value;
        } else if (value instanceof Error) {
          const e =
            $$error in value ? value : newGrafastError(value, finishedStep.id);
          finalResult[resultIndex] = e;
          bucket.hasErrors = true;
        } else {
          finalResult[resultIndex] = value;
        }
      };

      const runSyncSteps = () => {
        if (!phase.unbatchedSyncAndSafeSteps) {
          return next();
        }
        const extras: ExecutionExtra[] = [];
        for (
          let allStepsIndex = executedLength;
          allStepsIndex < allStepsLength;
          allStepsIndex++
        ) {
          const step = _allSteps[allStepsIndex];
          const meta =
            step.metaKey !== undefined
              ? metaByMetaKey[step.metaKey]
              : undefined;
          extras[allStepsIndex] = {
            meta,
            eventEmitter: requestContext.eventEmitter,
            _bucket: bucket,
            _requestContext: requestContext,
          };
        }
        outerLoop: for (let dataIndex = 0; dataIndex < size; dataIndex++) {
          if (sideEffectPlanIdsWithErrors) {
            for (const depId of sideEffectPlanIdsWithErrors) {
              const depVal = bucket.store.get(depId)![dataIndex];
              if (isGrafastError(depVal)) {
                for (
                  let allStepsIndex = executedLength;
                  allStepsIndex < allStepsLength;
                  allStepsIndex++
                ) {
                  const step = _allSteps[
                    allStepsIndex
                  ] as UnbatchedExecutableStep;
                  const storeEntry = bucket.store.get(step.id)!;
                  storeEntry[dataIndex] = depVal;
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
            const step = _allSteps[allStepsIndex] as UnbatchedExecutableStep;
            const storeEntry = bucket.store.get(step.id)!;
            try {
              const deps: any = [];
              for (const $dep of step.dependencies) {
                const depVal = bucket.store.get($dep.id)![dataIndex];
                if (bucket.hasErrors && isGrafastError(depVal)) {
                  storeEntry[dataIndex] = depVal;
                  continue stepLoop;
                }
                deps.push(depVal);
              }
              storeEntry[dataIndex] = step.unbatchedExecute(
                extras[allStepsIndex],
                ...deps,
              );
            } catch (e) {
              bucket.hasErrors = true;
              storeEntry[dataIndex] = newGrafastError(e, step.id);
            }
          }
        }
        return next();
      };

      const awaitPromises = async () => {
        // This _should not_ throw.
        await Promise.all(promises!);
        return runSyncSteps();
      };

      for (
        let allStepsIndex = 0;
        allStepsIndex < executedLength;
        allStepsIndex++
      ) {
        const step = _allSteps[allStepsIndex];
        const result = results[allStepsIndex]!;
        const storeEntry = bucket.store.get(step.id)!;
        for (let dataIndex = 0; dataIndex < size; dataIndex++) {
          const val = result[dataIndex];
          if (step.isSyncAndSafe || !isPromiseLike(val)) {
            success(step, storeEntry, dataIndex, val);
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
              const storeEntry = bucket.store.get(finishedStep.id)!;
              if (settledResult.status === "fulfilled") {
                success(
                  finishedStep,
                  storeEntry,
                  dataIndex,
                  settledResult.value,
                );
              } else {
                bucket.hasErrors = true;
                storeEntry[dataIndex] = newGrafastError(
                  settledResult.reason,
                  finishedStep.id,
                );
              }
            }
            if (bucket.hasErrors && sideEffectPlanIds) {
              handleSideEffectPlanIds();
            }
            return promises ? awaitPromises() : runSyncSteps();
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
              const storeEntry = bucket.store.get(finishedStep.id)!;
              storeEntry[dataIndex] = newGrafastError(
                new Error(
                  `GrafastInternalError<1e9731b4-005e-4b0e-bc61-43baa62e6444>: error occurred whilst performing completedStep(${finishedStep.id})`,
                ),
                finishedStep.id,
              );
            }
          });
      } else {
        if (bucket.hasErrors && sideEffectPlanIds) {
          handleSideEffectPlanIds();
        }
        return promises ? awaitPromises() : runSyncSteps();
      }
    };

    if (executePromises !== null) {
      return Promise.all(executePromises).then((promiseResults) => {
        for (let i = 0, l = promiseResults.length; i < l; i++) {
          const index = executePromiseResultIndex![i];
          results[index] = promiseResults[i];
        }
        return loopOverResults();
      });
    } else {
      return loopOverResults();
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
    step: ExecutableStep,
    dependencies: ReadonlyArray<any>[],
    extra: ExecutionExtra,
  ): PromiseOrDirect<GrafastResultsList<any> | GrafastResultStreamList<any>> {
    if (step._stepOptions.stream && isStreamableStep(step)) {
      return step.stream(size, dependencies, extra, step._stepOptions.stream);
    } else {
      return step.execute(size, dependencies, extra);
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
    dependenciesIncludingSideEffects: ReadonlyArray<any>[],
    polymorphicPathList: readonly (string | null)[],
    extra: ExecutionExtra,
  ): PromiseOrDirect<GrafastResultsList<any> | GrafastResultStreamList<any>> {
    const errors: { [index: number]: GrafastError | undefined } =
      Object.create(null);

    /** If there's errors, we must manipulate the arrays being passed into the step execution */
    let foundErrors = false;

    /** If all we see is errors, there's no need to execute! */
    let needsNoExecution = true;
    const stepPolymorphicPaths = step.polymorphicPaths;

    for (let index = 0, l = polymorphicPathList.length; index < l; index++) {
      const polymorphicPath = polymorphicPathList[index];
      if (
        stepPolymorphicPaths !== null &&
        !stepPolymorphicPaths.has(polymorphicPath as string)
      ) {
        foundErrors = true;
        const e =
          isDev && DEBUG_POLYMORPHISM
            ? newGrafastError(
                new Error(
                  `GrafastInternalError<00d52055-06b0-4b25-abeb-311b800ea284>: step ${
                    step.id
                  } (polymorphicPaths ${[
                    ...stepPolymorphicPaths,
                  ]}) has no match for '${polymorphicPath}'`,
                ),
                step.id,
              )
            : POLY_SKIPPED;

        errors[index] = e;
      } else if (extra._bucket.hasErrors) {
        let noError = true;
        for (const depList of dependenciesIncludingSideEffects) {
          const v = depList[index];
          if (isGrafastError(v)) {
            if (!errors[index]) {
              noError = false;
              foundErrors = true;
              errors[index] = v;
              break;
            }
          }
        }
        if (noError) {
          needsNoExecution = false;
        }
      } else {
        needsNoExecution = false;
      }
    }

    // Trim the side-effect dependencies back out again
    const dependencies = sideEffectPlanIdsWithErrors
      ? dependenciesIncludingSideEffects.slice(0, step.dependencies.length)
      : dependenciesIncludingSideEffects;

    if (needsNoExecution) {
      // Everything is errors; we can skip execution
      return Object.values(errors);
    } else if (foundErrors) {
      const dependenciesWithoutErrors = dependencies.map((depList) =>
        depList.filter((_, index) => !errors[index]),
      );
      const resultWithoutErrors = executeOrStream(
        step,
        dependenciesWithoutErrors,
        extra,
      );
      if (isPromiseLike(resultWithoutErrors)) {
        return resultWithoutErrors.then((r) =>
          mergeErrorsBackIn(r, errors, dependencies[0].length),
        );
      } else {
        return mergeErrorsBackIn(
          resultWithoutErrors,
          errors,
          dependencies[0].length,
        );
      }
    } else {
      return reallyExecuteStepWithNoErrors(step, dependencies, extra);
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
      const extra: ExecutionExtra = {
        meta,
        eventEmitter: requestContext.eventEmitter,
        _bucket: bucket,
        _requestContext: requestContext,
      };
      const dependencies: ReadonlyArray<any>[] = [];
      const depCount = step.dependencies.length;
      if (depCount > 0 || sideEffectPlanIdsWithErrors !== null) {
        for (let i = 0, l = depCount; i < l; i++) {
          const $dep = step.dependencies[i];
          dependencies[i] = store.get($dep.id)!;
        }
        if (sideEffectPlanIdsWithErrors !== null) {
          for (const sideEffectPlanId of sideEffectPlanIdsWithErrors) {
            const sideEffectStoreEntry = store.get(sideEffectPlanId)!;
            if (!dependencies.includes(sideEffectStoreEntry)) {
              dependencies.push(sideEffectStoreEntry);
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
          : reallyExecuteStepWithNoErrors(step, dependencies, extra);
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
    "layerPlan" | "store" | "size" | "hasErrors" | "polymorphicPathList"
  >,
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
  }
  return {
    // Copy from spec
    layerPlan: spec.layerPlan,
    store: spec.store,
    size: spec.size,
    hasErrors: spec.hasErrors,
    polymorphicPathList: spec.polymorphicPathList,

    isComplete: false,
    children: Object.create(null),
  };
}
