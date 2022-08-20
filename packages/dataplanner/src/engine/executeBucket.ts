import * as assert from "assert";
import { inspect } from "util";

import type { Bucket, RequestContext } from "../bucket.js";
import { isDev } from "../dev.js";
import type { CrystalError } from "../error.js";
import { isCrystalError, newCrystalError } from "../error.js";
import type { ExecutableStep } from "../index.js";
import { __ItemStep } from "../index.js";
import { __ListTransformStep } from "../index.js";
import type {
  CrystalValuesList,
  ExecutionExtra,
  PromiseOrDirect,
} from "../interfaces.js";
import { $$concreteType } from "../interfaces.js";
import { assertPolymorphicData } from "../polymorphic.js";
import { __ValueStep } from "../steps/__value.js";
import { arrayOfLength, isPromiseLike } from "../utils.js";
import type { LayerPlan } from "./LayerPlan.js";

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

  const starterPromises: PromiseLike<void>[] = [];
  for (const step of startSteps) {
    const r = rejectOnThrow(() => executeStep(step));
    if (isPromiseLike(r)) {
      starterPromises.push(r);
    }
  }

  if (starterPromises.length > 0) {
    return Promise.all(starterPromises).then(executeSamePhaseChildren);
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
      // Need to complete promises, check for errors, etc
      return Promise.allSettled(result).then((rs) => {
        // Deliberate shadowing
        const result = rs.map((t) => {
          if (t.status === "fulfilled") {
            return t.value;
          } else {
            bucket.hasErrors = true;
            return newCrystalError(t.reason, finishedStep.id);
          }
        });
        store[finishedStep.id] = result;
        return reallyCompletedStep(finishedStep);
      });
    }
  }

  // Slow mode...
  /**
   * Execute the step, filtering out errors from the input dependencies and
   * then padding the lists back out at the end.
   */
  function reallyExecuteStepWithErrors(
    step: ExecutableStep,
    dependencies: ReadonlyArray<any>[],
    extra: ExecutionExtra,
  ) {
    const errors: { [index: number]: CrystalError } = Object.create(null);
    let foundErrors = false;
    for (const depList of dependencies) {
      for (let index = 0, l = depList.length; index < l; index++) {
        const v = depList[index];
        if (isCrystalError(v)) {
          if (!errors[index]) {
            foundErrors = true;
            errors[index] = v;
          }
        }
      }
    }
    if (foundErrors) {
      const dependenciesWithoutErrors = dependencies.map((depList) =>
        depList.filter((_, index) => !errors[index]),
      );
      const resultWithoutErrors = step.execute(
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
    return step.execute(dependencies, extra);
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
      const result = bucket.hasErrors
        ? reallyExecuteStepWithErrors(step, dependencies, extra)
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
        `executeSamePhaseChildren called before all steps were complete! Remaining steps were: ${[
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
          const map: Map<number, number[]> = new Map();
          const noDepsList: undefined[] = [];

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
                const newIndex = noDepsList.push(undefined) - 1;
                newIndexes.push(newIndex);
                store[itemStepId][newIndex] = list[j];
                for (const planId of copyStepIds) {
                  store[planId][newIndex] = bucket.store[planId][originalIndex];
                }
              }
            }
          }

          if (noDepsList.length > 0) {
            // Reference
            const childBucket = newBucket(childLayerPlan, noDepsList, store);
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
          const map: Map<number, number> = new Map();
          // This is a 1-to-1 map, so we can mostly just copy from parent bucket
          const noDepsList = bucket.noDepsList;
          for (let i = 0; i < bucket.size; i++) {
            map.set(i, i);
          }
          for (const planId of copyStepIds) {
            store[planId] = bucket.store[planId];
          }

          // Reference
          const childBucket = newBucket(childLayerPlan, noDepsList, store);
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
          const store: Bucket["store"] = Object.create(null);
          const map: Map<number, number> = new Map();
          const noDepsList: undefined[] = [];

          // We're only copying over the entries that match this type (note:
          // they may end up being null, but that's okay)
          const targetTypeNames = childLayerPlan.reason.typeNames;
          const polymorphicPlanId = childLayerPlan.reason.parentPlanId;
          const polymorphicPlanStore = bucket.store[polymorphicPlanId];

          for (
            let originalIndex = 0;
            originalIndex < bucket.size;
            originalIndex++
          ) {
            const value = polymorphicPlanStore[originalIndex];
            if (value == null) {
              continue;
            }
            assertPolymorphicData(value);
            const typeName = value[$$concreteType];
            if (!targetTypeNames.includes(typeName)) {
              continue;
            }
            const newIndex = noDepsList.push(undefined) - 1;
            map.set(originalIndex, newIndex);
            for (const planId of copyStepIds) {
              store[planId][newIndex] = bucket.store[planId][originalIndex];
            }
          }

          // Reference
          const childBucket = newBucket(childLayerPlan, noDepsList, store);
          bucket.children[childLayerPlan.id] = {
            bucket: childBucket,
            map,
          };

          // Execute
          const result = executeBucket(childBucket, requestContext);
          if (isPromiseLike(result)) {
            childPromises.push(result);
          }

          break;
        }
        case "subroutine":
        case "subscription":
        case "defer":
        case "stream": {
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
  layerPlan: LayerPlan,
  noDepsList: readonly undefined[],
  store: Bucket["store"],
): Bucket {
  if (isDev) {
    // Some validations
    const l = noDepsList.length;
    assert.ok(l > 0, "No need to create an empty bucket!");
    for (const [key, list] of Object.entries(store)) {
      assert.ok(
        Array.isArray(list),
        `Store entry for step '${key}' for layerPlan '${layerPlan.id}' should be a list`,
      );
      assert.strictEqual(
        list.length,
        l,
        `Store entry for step '${key}' for layerPlan '${layerPlan.id}' should have same length as bucket`,
      );
    }
  }
  return {
    layerPlan,
    isComplete: false,
    size: noDepsList.length,
    store,
    hasErrors: false,
    noDepsList,
    children: Object.create(null),
  };
}
