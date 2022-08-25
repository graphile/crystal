import * as assert from "assert";
import { isAsyncIterable, isIterable } from "iterall";
import { inspect } from "util";

import type { Bucket, RequestContext } from "../bucket.js";
import { isDev } from "../dev.js";
import type { CrystalError } from "../error.js";
import { isCrystalError, newCrystalError } from "../error.js";
import type { ExecutableStep } from "../index.js";
import { __ItemStep, isStreamableStep } from "../index.js";
import type {
  CrystalResultsList,
  CrystalResultStreamList,
  CrystalValuesList,
  ExecutionExtra,
  PromiseOrDirect,
} from "../interfaces.js";
import { $$concreteType, $$streamMore } from "../interfaces.js";
import { assertPolymorphicData } from "../polymorphic.js";
import { __ValueStep } from "../steps/__value.js";
import { arrayOfLength, isPromiseLike } from "../utils.js";
import type { LayerPlan } from "./LayerPlan.js";

// An error that indicates this entry was skipped because it didn't match
// polymorphicPath.
const POLY_SKIPPED = newCrystalError(
  new Error("Polymorphic skipped; you should never see this"),
  null,
);

function noop() {
  /*noop*/
}

/**
 * Calls the callback, catching any errors and turning them into rejected
 * promises.
 *
 * @remarks
 *
 * When we're calling functions in loops and they may or may not be async
 * functions, there's a risk that they may throw and previous promises that may
 * have been added to an array to be handled later never get handled, causing
 * an unhandled promise rejection error which crashes the entire Node process.
 * This is not ideal. Thus we use this method to try to call the function, but
 * if it throws we turn it into a promise rejection which will not interrupt
 * the flow of these loops.
 */
function rejectOnThrow<T>(cb: () => T): T | Promise<never> {
  try {
    return cb();
  } catch (e) {
    return Promise.reject(e);
  }
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
  errors: { [index: number]: CrystalError },
  resultCount: number,
): any[] {
  const finalResults: any[] = [];
  let resultIndex = 0;

  for (let i = 0; i < resultCount; i++) {
    const error = errors[i];
    if (error) {
      finalResults[i] = error;
    } else {
      finalResults[i] = results[resultIndex++];
    }
  }
  return finalResults;
}

/** @internal */
export function executeBucket(
  bucket: Bucket,
  requestContext: RequestContext,
): PromiseOrDirect<void> {
  const { metaByStepId } = requestContext;
  const inProgressSteps = new Set();
  const pendingSteps = new Set(bucket.layerPlan.steps);
  const {
    size,
    store,
    noDepsList,
    layerPlan: { startSteps, children: childLayerPlans },
  } = bucket;

  const l = startSteps.length;

  // Like a `for(i = 0; i < l; i++)` loop with some `await`s in it, except it does promise
  // handling manually so that it can complete synchronously (no promises) if
  // possible.
  const nextSteps = (i: number): PromiseOrDirect<void> => {
    if (i >= l) {
      return;
    }
    bucket.cascadeEnabled = i === l - 1;
    const steps = startSteps[i];
    const starterPromises: PromiseLike<void>[] = [];
    for (const step of steps) {
      const r = rejectOnThrow(() => executeStep(step));
      if (isPromiseLike(r)) {
        starterPromises.push(r);
      }
    }
    if (starterPromises.length > 0) {
      return Promise.all(starterPromises).then(() => nextSteps(i + 1));
    } else {
      return nextSteps(i + 1);
    }
  };

  const promise = nextSteps(0);

  if (isPromiseLike(promise)) {
    return promise.then(executeSamePhaseChildren);
  } else {
    return executeSamePhaseChildren();
  }

  // Function definitions below here

  function reallyCompletedStep(
    finishedStep: ExecutableStep,
  ): void | Promise<void> {
    inProgressSteps.delete(finishedStep);
    pendingSteps.delete(finishedStep);
    if (pendingSteps.size === 0) {
      // Finished!
      return;
    }
    if (!bucket.cascadeEnabled) {
      // Must be some side effects yet to run
      return;
    }
    const promises: PromiseLike<void>[] = [];
    for (const potentialNextStep of finishedStep.dependentPlans) {
      const isPending = pendingSteps.has(potentialNextStep);
      const isSuitable = isPending
        ? potentialNextStep.dependencies.every(
            isDev
              ? (depId) => {
                  if (Array.isArray(store[depId])) {
                    return true;
                  } else {
                    const dep =
                      bucket.layerPlan.operationPlan.dangerouslyGetStep(depId)!;
                    assert.strictEqual(
                      dep.layerPlan,
                      bucket.layerPlan,
                      `GraphileInternalError<4ca7f9f9-0a00-415f-b6f7-46858fde17c3>: Waiting on ${dep} but it'll never complete because it's not in this bucket (${bucket.layerPlan.id}); this is most likely a bug in copyPlanIds`,
                    );
                    return false;
                  }
                }
              : (depId) => Array.isArray(store[depId]),
          )
        : false;
      if (isSuitable) {
        const r = rejectOnThrow(() => executeStep(potentialNextStep));
        if (isPromiseLike(r)) {
          promises.push(r);
        }
      }
    }
    if (promises.length > 0) {
      return Promise.all(promises) as Promise<any> as Promise<void>;
    } else {
      return;
    }
  }

  function completedStep(
    finishedStep: ExecutableStep,
    result: CrystalValuesList<any>,
    noNewErrors = false,
  ): void | Promise<void> {
    if (!Array.isArray(result)) {
      throw new Error(
        `Result from ${finishedStep} should be an array, instead received ${inspect(
          result,
          { colors: true },
        )}`,
      );
    }
    if (result.length !== size) {
      throw new Error(
        `Result array from ${finishedStep} should have length ${size}, instead it had length ${result.length}`,
      );
    }
    if (finishedStep.isSyncAndSafe && noNewErrors) {
      // It promises not to add new errors, and not to include promises in the result array
      store[finishedStep.id] = result;
      return reallyCompletedStep(finishedStep);
    } else {
      // Need to complete promises, check for errors, etc.
      // **DO NOT THROW, DO NOT ALLOW AN ERROR TO BE RAISED!**
      // **USE DEFENSIVE PROGRAMMING HERE!**
      return Promise.allSettled(result)
        .then((resultSettledResult) => {
          // Deliberate shadowing
          const result: any[] = [];
          const promises: PromiseLike<void>[] = [];
          resultSettledResult.forEach((settledResult, resultIndex): void => {
            if (settledResult.status === "fulfilled") {
              if (
                // This is to stop some basic types being accidentally recogized as iterable/async iterator
                Array.isArray(settledResult.value) ||
                settledResult.value instanceof Map ||
                settledResult.value instanceof Set
              ) {
                result[resultIndex] = settledResult.value;
                // TODO: isIterable and isAsyncIterable are causing all _sorts_ of pain here. AVOID!
              } else if (isIterable(settledResult.value)) {
                // Turn it from iterable into an array.
                try {
                  result[resultIndex] = [...settledResult.value];
                } catch (e) {
                  bucket.hasErrors = true;
                  result[resultIndex] = newCrystalError(e, finishedStep.id);
                }
              } else if (isAsyncIterable(settledResult.value)) {
                const iterator = settledResult.value[Symbol.asyncIterator]();

                const streamOptions = finishedStep._stepOptions.stream;
                const initialCount: number = streamOptions
                  ? streamOptions.initialCount
                  : Infinity;

                // TODO:critical: need to ensure that iterator is terminated
                // even if the stream is never consumed (e.g. if something else
                // errors). For query/mutation we can do this when operation
                // completes, for subscription we should do it after each
                // individual payload (and all its streamed/deferred children)
                // are complete before processing the next subscription event.

                if (initialCount === 0) {
                  // Optimization - defer everything
                  const arr: any[] = [];
                  arr[$$streamMore] = iterator;
                  result[resultIndex] = arr;
                } else {
                  // Evaluate the first initialCount entries, rest is streamed.
                  const promise = (async () => {
                    try {
                      let valuesSeen = 0;
                      const arr: any[] = [];

                      /*
                       * We need to "shift" a few entries off the top of the
                       * iterator, but still keep it iterable for the later
                       * stream. To accomplish this we have to do manual
                       * looping
                       */

                      let resultPromise: Promise<IteratorResult<any, any>>;
                      while ((resultPromise = iterator.next())) {
                        const result = await resultPromise;
                        if (result.done) {
                          break;
                        }
                        arr.push(await result.value);
                        if (++valuesSeen >= initialCount) {
                          // This is safe to do in the `while` since we checked
                          // the `0` entries condition in the optimization
                          // above.
                          arr[$$streamMore] = iterator;
                          break;
                        }
                      }

                      result[resultIndex] = arr;
                    } catch (e) {
                      bucket.hasErrors = true;
                      result[resultIndex] = newCrystalError(e, finishedStep.id);
                    }
                  })();
                  promises.push(promise);
                }
              } else {
                result[resultIndex] = settledResult.value;
              }
            } else {
              bucket.hasErrors = true;
              result[resultIndex] = newCrystalError(
                settledResult.reason,
                finishedStep.id,
              );
            }
          });
          if (promises.length > 0) {
            // This _should not_ throw.
            return Promise.all(promises).then(() => {
              store[finishedStep.id] = result;
              return reallyCompletedStep(finishedStep);
            });
          } else {
            store[finishedStep.id] = result;
            return reallyCompletedStep(finishedStep);
          }
        })
        .then(null, (e) => {
          // THIS SHOULD NEVER HAPPEN!
          const crystalError = newCrystalError(
            new Error(
              `GraphileInternalError<1e9731b4-005e-4b0e-bc61-43baa62e6444>: error occurred whilst performing completedStep(${finishedStep.id})`,
            ),
            finishedStep.id,
          );
          console.error(`${crystalError.originalError}\n  ${e}`);
          store[finishedStep.id] = result.map(() => crystalError);
          return reallyCompletedStep(finishedStep);
        });
    }
  }

  function executeOrStream(
    step: ExecutableStep,
    dependencies: ReadonlyArray<any>[],
    extra: ExecutionExtra,
  ): PromiseOrDirect<CrystalResultsList<any> | CrystalResultStreamList<any>> {
    if (step._stepOptions.stream && isStreamableStep(step)) {
      return step.stream(dependencies, extra, step._stepOptions.stream);
    } else {
      return step.execute(dependencies, extra);
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
    dependencies: ReadonlyArray<any>[],
    polymorphicPathList: readonly string[],
    extra: ExecutionExtra,
  ) {
    const errors: { [index: number]: CrystalError } = Object.create(null);
    let foundErrors = false;
    for (let index = 0, l = polymorphicPathList.length; index < l; index++) {
      const polymorphicPath = polymorphicPathList[index];
      if (!step.polymorphicPaths.has(polymorphicPath)) {
        foundErrors = true;
        if (isDev) {
          errors[index] = newCrystalError(
            new Error(
              `GraphileInternalError<00d52055-06b0-4b25-abeb-311b800ea284>: ${step} (polymorphicPaths ${[
                ...step.polymorphicPaths,
              ]}) has no match for '${polymorphicPath}'`,
            ),
            step.id,
          );
        } else {
          errors[index] = POLY_SKIPPED;
        }
      } else if (extra._bucket.hasErrors) {
        for (const depList of dependencies) {
          const v = depList[index];
          if (isCrystalError(v)) {
            if (!errors[index]) {
              foundErrors = true;
              errors[index] = v;
            }
          }
        }
      }
    }
    if (foundErrors) {
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

  // TODO: if this is what we end up with, remove the indirection.
  /**
   * Execute the step directly; since there's no errors we can pass the
   * dependencies through verbatim!
   */
  function reallyExecuteStepWithNoErrors(
    step: ExecutableStep,
    dependencies: ReadonlyArray<any>[],
    extra: ExecutionExtra,
  ) {
    return executeOrStream(step, dependencies, extra);
  }

  // TODO: this function used to state that it would never throw/reject... but,
  // no code is perfect... so that just seemed like it was asking for
  // trouble. Lets make sure if it throws/rejects that nothing bad will happen.
  /**
   * This function MIGHT throw or reject, so be sure to handle that.
   */
  function executeStep(step: ExecutableStep): void | PromiseLike<void> {
    if (inProgressSteps.has(step)) {
      return;
    }
    inProgressSteps.add(step);
    if (step instanceof __ValueStep || step instanceof __ItemStep) {
      // Bypass execution
      return reallyCompletedStep(step);
    }
    try {
      const meta = metaByStepId[step.id]!;
      const extra: ExecutionExtra = {
        meta,
        eventEmitter: requestContext.eventEmitter,
        _bucket: bucket,
        _requestContext: requestContext,
      };
      const dependencies: ReadonlyArray<any>[] = [];
      const depCount = step.dependencies.length;
      if (depCount > 0) {
        for (let i = 0, l = depCount; i < l; i++) {
          const depId = step.dependencies[i];
          dependencies[i] = store[depId];
        }
      } else {
        dependencies.push(noDepsList);
      }
      const isSelectiveStep =
        step.polymorphicPaths.size !== step.layerPlan.polymorphicPaths.size;
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
        return result.then(
          (values) => {
            return completedStep(step, values);
          },
          (error) => {
            bucket.hasErrors = true;
            return completedStep(
              step,
              arrayOfLength(size, newCrystalError(error, step.id)),
            );
          },
        );
      } else {
        return completedStep(step, result, true);
      }
    } catch (error) {
      bucket.hasErrors = true;
      return completedStep(
        step,
        arrayOfLength(size, newCrystalError(error, step.id)),
        true,
      );
    }
  }

  function executeSamePhaseChildren(): PromiseOrDirect<void> {
    if (pendingSteps.size > 0) {
      throw new Error(
        `GraphileInternalError<8c518856-6e96-425e-91ce-0e0713dbdead>: executeSamePhaseChildren called before all steps were complete! Remaining steps were: ${[
          ...pendingSteps,
        ].join(", ")}`,
      );
    }

    // TODO: create a JIT factory for this at planning time
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
      const copyStepIds = childLayerPlan.copyPlanIds;
      switch (childLayerPlan.reason.type) {
        case "listItem": {
          const store: Bucket["store"] = Object.create(null);
          const polymorphicPathList: string[] = [];
          const map: Map<number, number[]> = new Map();
          let size = 0;

          const listStepId = childLayerPlan.reason.parentPlanId;
          const listStepStore = bucket.store[listStepId];
          assert.ok(
            listStepStore,
            `GraphileInternalError<314865b0-f7e8-4e81-b966-56e5a0de562e>: could not found entry '${listStepId}' (${bucket.layerPlan.operationPlan.dangerouslyGetStep(
              listStepId,
            )}) in store`,
          );

          const itemStepId = childLayerPlan.rootStepId;
          assert.ok(
            itemStepId != null,
            "GraphileInternalError<b3a2bff9-15c6-47e2-aa82-19c862324f1a>: listItem layer plan has no rootStepId",
          );
          store[itemStepId] = [];

          // Prepare store with an empty list for each copyPlanId
          for (const planId of copyStepIds) {
            store[planId] = [];
          }

          // We'll typically be creating more listItem bucket entries than we
          // have parent buckets, so we must "multiply up" the store entries.
          for (
            let originalIndex = 0;
            originalIndex < bucket.size;
            originalIndex++
          ) {
            const list: any[] | null | undefined | CrystalError =
              listStepStore[originalIndex];
            if (Array.isArray(list)) {
              const newIndexes: number[] = [];
              map.set(originalIndex, newIndexes);
              for (let j = 0, l = list.length; j < l; j++) {
                const newIndex = size++;
                newIndexes.push(newIndex);
                store[itemStepId][newIndex] = list[j];

                polymorphicPathList[newIndex] =
                  bucket.polymorphicPathList[originalIndex];
                for (const planId of copyStepIds) {
                  store[planId][newIndex] = bucket.store[planId][originalIndex];
                }
              }
            }
          }

          if (size > 0) {
            // Reference
            const childBucket = newBucket({
              layerPlan: childLayerPlan,
              size,
              store,
              hasErrors: bucket.hasErrors,
              polymorphicPathList,
            });
            bucket.children[childLayerPlan.id] = {
              bucket: childBucket,
              map,
            };

            // Execute
            const result = executeBucket(childBucket, requestContext);
            if (isPromiseLike(result)) {
              childPromises.push(result);
            }
          }

          break;
        }
        case "mutationField": {
          const store: Bucket["store"] = Object.create(null);
          const polymorphicPathList = bucket.polymorphicPathList;
          const map: Map<number, number> = new Map();
          // This is a 1-to-1 map, so we can mostly just copy from parent bucket
          const size = bucket.size;
          for (let i = 0; i < bucket.size; i++) {
            map.set(i, i);
          }
          for (const planId of copyStepIds) {
            store[planId] = bucket.store[planId];
          }

          // Reference
          const childBucket = newBucket({
            layerPlan: childLayerPlan,
            size,
            store,
            hasErrors: bucket.hasErrors,
            polymorphicPathList,
          });
          bucket.children[childLayerPlan.id] = {
            bucket: childBucket,
            map,
          };

          // Enqueue for execution (mutations must run in order)
          const promise = enqueue(() =>
            executeBucket(childBucket, requestContext),
          );
          childPromises.push(promise);

          break;
        }
        case "polymorphic": {
          const polymorphicPlanId = childLayerPlan.reason.parentPlanId;
          const polymorphicPlanStore = bucket.store[polymorphicPlanId];
          if (!polymorphicPlanStore) {
            throw new Error(
              `GraphileInternalError<af1417c6-752b-466e-af7e-cfc35724c3bc>: Entry for '${bucket.layerPlan.operationPlan.dangerouslyGetStep(
                polymorphicPlanId,
              )}' not found in bucket for '${bucket.layerPlan}'`,
            );
          }
          const store: Bucket["store"] = Object.create(null);
          const polymorphicPathList: string[] = [];
          const map: Map<number, number> = new Map();
          let size = 0;

          // We're only copying over the entries that match this type (note:
          // they may end up being null, but that's okay)
          const targetTypeNames = childLayerPlan.reason.typeNames;

          for (const planId of copyStepIds) {
            store[planId] = [];
            if (!bucket.store[planId]) {
              throw new Error(
                `GraphileInternalError<548f0d84-4556-4189-8655-fb16aa3345a6>: new bucket for ${childLayerPlan} wants to copy ${childLayerPlan.operationPlan.dangerouslyGetStep(
                  planId,
                )}, but bucket for ${
                  bucket.layerPlan
                } doesn't contain that plan`,
              );
            }
          }

          for (
            let originalIndex = 0;
            originalIndex < bucket.size;
            originalIndex++
          ) {
            const value = polymorphicPlanStore[originalIndex];
            if (value == null) {
              continue;
            }
            if (isCrystalError(value)) {
              continue;
            }
            assertPolymorphicData(value);
            const typeName = value[$$concreteType];
            if (!targetTypeNames.includes(typeName)) {
              continue;
            }
            const newIndex = size++;
            map.set(originalIndex, newIndex);

            // TODO:perf: might be faster if we look this up as a constant rather than using concatenation here
            const newPolymorphicPath =
              bucket.polymorphicPathList[originalIndex] + ">" + typeName;

            polymorphicPathList[newIndex] = newPolymorphicPath;
            for (const planId of copyStepIds) {
              store[planId][newIndex] = bucket.store[planId][originalIndex];
            }
          }

          if (size > 0) {
            // Reference
            const childBucket = newBucket({
              layerPlan: childLayerPlan,
              size,
              store,
              hasErrors: bucket.hasErrors,
              polymorphicPathList,
            });
            bucket.children[childLayerPlan.id] = {
              bucket: childBucket,
              map,
            };

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
            "GraphileInternalError<05fb7069-81b5-43f7-ae71-f62547d2c2b7>: root cannot be not the root (...)",
          );
        }
        default: {
          const never: never = childLayerPlan.reason;
          throw new Error(
            `GraphileInternalError<>: unhandled reason '${inspect(never)}'`,
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
    assert.ok(spec.size > 0, "No need to create an empty bucket!");
    assert.strictEqual(
      spec.polymorphicPathList.length,
      spec.size,
      "polymorphicPathList length must match bucket size",
    );
    for (let i = 0, l = spec.size; i < l; i++) {
      const p = spec.polymorphicPathList[i];
      assert.strictEqual(
        typeof p,
        "string",
        `Entry ${i} in polymorphicPathList for bucket for ${spec.layerPlan} was not a string`,
      );
    }
    for (const [key, list] of Object.entries(spec.store)) {
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
    ...spec,
    isComplete: false,
    cascadeEnabled: false,
    noDepsList: arrayOfLength(spec.size, undefined),
    children: Object.create(null),
  };
}
