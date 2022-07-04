import { inspect } from "util";

import type { Aether, CrystalError } from ".";
import type {
  Bucket,
  BucketDefinitionFieldOutputMap,
  RequestContext,
} from "./bucket.js";
import { BucketSetter, bucketValue } from "./bucket.js";
import { isCrystalError, newCrystalError } from "./error.js";
import type {
  CrystalContext,
  CrystalValuesList,
  ExecutionExtra,
  PromiseOrDirect,
} from "./interfaces.js";
import { $$concreteType } from "./interfaces.js";
import type { ExecutableStep } from "./step.js";
import { __ListTransformStep } from "./steps/index.js";
import { arrayOfLength, isPromiseLike } from "./utils.js";

// optimization
export const $$keys = Symbol("keys");

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

/**
 * The execution v2 strategy resolves around "Buckets"; this method executes
 * all of the plans in the given bucket and then returns the output data. If
 * all the plans are synchronous then the result will be the data directly,
 * otherwise a promise will be returned.
 *
 * @privateRemarks
 *
 * Because this is performance critical code it unfortunately makes more sense
 * right now to have one massive function that contains the values in a closure
 * than to pass all the values around to lots of separate functions. To try and
 * make this more manageable we've relied on JavaScript hoisting the function
 * definitions and have pushed the sub-functions to the bottom of the various
 * scopes. Sorry.
 *
 * @internal
 */
export function executeBucket(
  aether: Aether,
  metaByStepId: CrystalContext["metaByStepId"],
  bucket: Bucket,
  requestContext: RequestContext,
): PromiseOrDirect<Array<any>> {
  const inProgressPlans = new Set();
  const pendingPlans = new Set(bucket.definition.plans);
  const store = bucket.store;
  const rootOutputModeType = bucket.definition.rootOutputModeType;
  const isNestedListBucket = rootOutputModeType === "A";
  // const isLeafBucket = rootOutputModeType === "L";
  const isObjectBucket = rootOutputModeType === "O";
  const {
    input,
    noDepsList,
    definition: {
      id: bucketId,
      startPlans,
      children: childBucketDefinitions,
      rootOutputStepId,
      singleTypeNameByRootPathIdentity,
      rootOutputModeByRootPathIdentity,
      outputMap,
    },
  } = bucket;
  const size = input.length;

  const starterPromises: PromiseLike<void>[] = [];
  for (const plan of startPlans) {
    const r = rejectOnThrow(() => executePlan(plan));
    if (isPromiseLike(r)) {
      starterPromises.push(r);
    }
  }

  if (starterPromises.length > 0) {
    return Promise.all(starterPromises).then(produceOutput);
  } else {
    return produceOutput();
  }

  // Function definitions below here

  function reallyCompletedPlan(
    finishedPlan: ExecutableStep,
  ): void | Promise<void> {
    inProgressPlans.delete(finishedPlan);
    pendingPlans.delete(finishedPlan);
    if (pendingPlans.size === 0) {
      // Finished!
      return;
    }
    const promises: PromiseLike<void>[] = [];
    for (const potentialNextPlan of finishedPlan.dependentPlans) {
      const isPending = pendingPlans.has(potentialNextPlan);
      const isSuitable = isPending
        ? potentialNextPlan.dependencies.every((depId) =>
            Array.isArray(store[depId]),
          )
        : false;
      if (isSuitable) {
        const r = rejectOnThrow(() => executePlan(potentialNextPlan));
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

  function completedPlan(
    finishedPlan: ExecutableStep,
    result: CrystalValuesList<any>,
    noNewErrors = false,
  ): void | Promise<void> {
    if (!Array.isArray(result)) {
      throw new Error(
        `Result from ${finishedPlan} should be an array, instead received ${inspect(
          result,
          { colors: true },
        )}`,
      );
    }
    if (result.length !== size) {
      throw new Error(
        `Result array from ${finishedPlan} should have length ${size}, instead it had length ${result.length}`,
      );
    }
    if (finishedPlan.isSyncAndSafe && noNewErrors) {
      // It promises not to add new errors, and not to include promises in the result array
      store[finishedPlan.id] = result;
      return reallyCompletedPlan(finishedPlan);
    } else {
      // Need to complete promises, check for errors, etc
      return Promise.allSettled(result).then((rs) => {
        // Deliberate shadowing
        const result = rs.map((t) => {
          if (t.status === "fulfilled") {
            return t.value;
          } else {
            requestContext.hasIssue();
            bucket.hasErrors = true;
            return newCrystalError(t.reason, finishedPlan.id);
          }
        });
        store[finishedPlan.id] = result;
        return reallyCompletedPlan(finishedPlan);
      });
    }
  }

  function executeListTransform(
    plan: __ListTransformStep<any, any, any>,
    // TODO: review these unused arguments
    _dependencies: (readonly any[])[],
    _extra: ExecutionExtra,
  ): PromiseOrDirect<any[]> {
    const itemPlan = aether.dangerouslyGetStep(plan.itemStepId!);
    const itemStepId = itemPlan.id;
    const itemBucketDefinition = aether.buckets[itemPlan.bucketId];
    if (!itemBucketDefinition) {
      throw new Error(
        `Could not determing the bucket to execute ${plan}'s inner data with`,
      );
    }
    const listPlan = plan.dangerouslyGetListPlan();
    const lists: any[][] = store[listPlan.id];

    const itemInputs: BucketSetter[] = [];
    const itemStore: {
      [planId: string]: any[];
    } = Object.create(null);
    itemStore[itemStepId] = [];

    for (const planId of itemBucketDefinition.copyPlanIds) {
      itemStore[planId] = [];
    }

    const itemBucket: Bucket = {
      definition: itemBucketDefinition,
      store: itemStore,
      noDepsList: arrayOfLength(itemInputs.length),
      input: itemInputs,
      hasErrors: bucket.hasErrors,
    };
    const { copyPlanIds } = itemBucketDefinition;

    const listsLength = lists.length;
    for (let i = 0, l = listsLength; i < l; i++) {
      const list = lists[i];
      if (Array.isArray(list)) {
        const listLength = list.length;
        const innerList = arrayOfLength(listLength);
        for (let j = 0, m = listLength; j < m; j++) {
          itemInputs.push(
            new BucketSetter(
              // TODO: what should this "rootPathIdentity" be?
              "",
              innerList,
              j,
            ),
          );
          itemStore[itemStepId].push(list[j]);
          for (const planId of copyPlanIds) {
            const val = store[planId][i];
            itemStore[planId].push(val);
          }
        }
      } else {
        // Noop
      }
    }

    const result = executeBucket(
      aether,
      metaByStepId,
      itemBucket,
      requestContext,
    );

    if (isPromiseLike(result)) {
      return result.then(performTransform);
    } else {
      return performTransform();
    }

    // Internal functions below here

    function performTransform(): any[] {
      const result: any[] = [];
      const transformDepStepId =
        aether.transformDependencyPlanIdByTransformStepId[plan.id];
      const depResults = itemStore[transformDepStepId];
      let offset = 0;
      for (let i = 0, l = listsLength; i < l; i++) {
        const list = lists[i];
        if (Array.isArray(list)) {
          const valuesCount = list.length;
          const values = depResults.slice(offset, offset + valuesCount);
          offset = offset + valuesCount;
          const initialState = plan.initialState();
          const reduceResult = list.reduce(
            (memo, entireItemValue, listEntryIndex) =>
              plan.reduceCallback(
                memo,
                entireItemValue,
                values[listEntryIndex],
              ),
            initialState,
          );
          const finalResult = plan.finalizeCallback
            ? plan.finalizeCallback(reduceResult)
            : reduceResult;
          result.push(finalResult);
        } else {
          result.push(list);
        }
      }
      return result;
    }
  }

  // Slow mode...
  function reallyExecutePlanWithErrors(
    plan: ExecutableStep,
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
      const resultWithoutErrors =
        plan instanceof __ListTransformStep
          ? executeListTransform(plan, dependenciesWithoutErrors, extra)
          : plan.execute(dependenciesWithoutErrors, extra);
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
      return reallyExecutePlanWithNoErrors(plan, dependencies, extra);
    }
  }

  // Fast mode!
  function reallyExecutePlanWithNoErrors(
    plan: ExecutableStep,
    dependencies: ReadonlyArray<any>[],
    extra: ExecutionExtra,
  ) {
    return plan instanceof __ListTransformStep
      ? executeListTransform(plan, dependencies, extra)
      : plan.execute(dependencies, extra);
  }

  // TODO: this function used to state that it would never throw/reject... but,
  // no code is perfect... so that just seemed like it was asking for
  // trouble. Lets make sure if it throws/rejects that nothing bad will happen.
  /**
   * This function MIGHT throw or reject, so be sure to handle that.
   */
  function executePlan(plan: ExecutableStep): void | PromiseLike<void> {
    if (inProgressPlans.has(plan)) {
      return;
    }
    inProgressPlans.add(plan);
    try {
      const meta = metaByStepId[plan.id]!;
      const extra = {
        meta,
        eventEmitter: requestContext.eventEmitter,
      };
      const dependencies: ReadonlyArray<any>[] = [];
      const depCount = plan.dependencies.length;
      if (depCount > 0) {
        for (let i = 0, l = depCount; i < l; i++) {
          const depId = plan.dependencies[i];
          dependencies[i] = store[depId];
        }
      } else {
        dependencies.push(noDepsList);
      }
      const result = bucket.hasErrors
        ? reallyExecutePlanWithErrors(plan, dependencies, extra)
        : reallyExecutePlanWithNoErrors(plan, dependencies, extra);
      if (isPromiseLike(result)) {
        return result.then(
          (values) => {
            return completedPlan(plan, values);
          },
          (error) => {
            bucket.hasErrors = true;
            requestContext.hasIssue();
            return completedPlan(
              plan,
              arrayOfLength(size, newCrystalError(error, plan.id)),
            );
          },
        );
      } else {
        return completedPlan(plan, result, true);
      }
    } catch (error) {
      requestContext.hasIssue();
      bucket.hasErrors = true;
      return completedPlan(
        plan,
        arrayOfLength(size, newCrystalError(error, plan.id)),
        true,
      );
    }
  }

  function produceOutput(): PromiseOrDirect<Array<any>> {
    if (pendingPlans.size > 0) {
      throw new Error(
        `produceOutput called before all plans were complete! Remaining plans were: ${[
          ...pendingPlans,
        ].join(", ")}`,
      );
    }

    // TODO: create a JIT factory for this at planning time
    type Child = Pick<Bucket, "definition" | "input" | "store" | "hasErrors">;
    const children: Array<Child> = [];
    const childrenByPathIdentity: {
      [pathIdentity: string]: Array<Child> | undefined;
    } = Object.create(null);
    for (const childBucketDefinition of childBucketDefinitions) {
      const entry: Child = {
        definition: childBucketDefinition,
        input: [],
        store: Object.create(null),
        hasErrors: bucket.hasErrors,
      };
      children.push(entry);
      for (const planId of childBucketDefinition.copyPlanIds) {
        entry.store[planId] = [];
      }
      if (childBucketDefinition.itemStepId) {
        entry.store[childBucketDefinition.itemStepId] = [];
      }
      for (const childRootPathIdentity of childBucketDefinition.rootPathIdentities) {
        if (!childrenByPathIdentity[childRootPathIdentity]) {
          childrenByPathIdentity[childRootPathIdentity] = [];
        }
        childrenByPathIdentity[childRootPathIdentity]!.push(entry);
      }
    }

    /**
     * Doing repeated key checks in the childrenByPathIdentity object was very
     * slow (as revealed by a node profile, 500 requests of a particular query
     * was clocking in at 365ms). Instead checking if something is in an array
     * is much faster (9.8ms by comparison); thus this variable:
     */
    const pathIdentitiesWithChildren = Object.keys(childrenByPathIdentity);

    const rootOutputStore =
      rootOutputStepId != null ? store[rootOutputStepId] : null;

    const result: any[] = [];
    for (let index = 0, l = input.length; index < l; index++) {
      const setter = input[index];
      if (rootOutputStore) {
        const rawValue = rootOutputStore[index];
        const concreteType = isObjectBucket
          ? singleTypeNameByRootPathIdentity![setter.rootPathIdentity]
          : null;

        const value = bucketValue(
          setter.parentObject,
          setter.parentKey,
          rawValue,
          rootOutputModeByRootPathIdentity![setter.rootPathIdentity]!,
          concreteType,
          requestContext,
        );
        setter.setRoot(value);

        if (isNestedListBucket) {
          if (Array.isArray(value)) {
            const nestedPathIdentity = setter.rootPathIdentity + "[]";
            processListChildren(nestedPathIdentity, rawValue, value, index);
          }
        }
      }
      const setterRoot = setter.getRoot();
      if (isObjectBucket && setterRoot != null && !isCrystalError(setterRoot)) {
        const typeName = setterRoot[$$concreteType];
        if (typeName == null) {
          throw new Error(`Could not determine typeName in bucket ${bucketId}`);
        }
        processObject(
          setterRoot,
          outputMap,
          `${setter.rootPathIdentity}>${typeName}.`,
          setter,
          index,
        );
      }

      // And any root buckets
      {
        if (pathIdentitiesWithChildren.includes(setter.rootPathIdentity)) {
          for (const _child of childrenByPathIdentity[
            setter.rootPathIdentity
          ]!) {
            throw new Error(
              `This should not be able to happen until we support stream/defer`,
            );
          }
        }
      }

      result.push(setterRoot);
    }

    // Now to call any nested buckets
    const childPromises: PromiseLike<any>[] = [];
    for (const child of children!) {
      if (child.input.length > 0) {
        const childBucket: Bucket = {
          definition: child.definition,
          store: child.store,
          input: child.input,
          noDepsList: arrayOfLength(child.input.length),
          hasErrors: bucket.hasErrors,
        };
        const r = rejectOnThrow(() =>
          executeBucket(aether, metaByStepId, childBucket, requestContext),
        );
        if (isPromiseLike(r)) {
          childPromises.push(r);
        }
      }
    }

    if (childPromises.length > 0) {
      return Promise.all(childPromises).then(() => result);
    } else {
      return result;
    }

    // Function definitions below here

    function processListChildren(
      nestedPathIdentity: string,
      rawValue: any,
      value: any,
      index: number,
    ): void {
      if (pathIdentitiesWithChildren.includes(nestedPathIdentity)) {
        for (const child of childrenByPathIdentity[nestedPathIdentity]!) {
          const {
            input: childInputs,
            store: childStore,
            definition: {
              itemStepId,
              polymorphicPlanIds,
              groupId,
              copyPlanIds,
            },
          } = child;
          if (itemStepId == null) {
            throw new Error(
              `INCONSISTENCY! A list bucket, but this bucket isn't list capable`,
            );
          }
          if (polymorphicPlanIds) {
            // TODO: will this ever be supported?
            throw new Error("Polymorphism inside list currently unsupported");
          }
          if (groupId != null) {
            throw new Error("Group inside list currently unsupported");
          }
          for (let i = 0, l = value.length; i < l; i++) {
            childInputs.push(new BucketSetter(nestedPathIdentity, value, i));
            childStore[itemStepId].push(rawValue[i]);
            for (const planId of copyPlanIds) {
              const val = store[planId][index];
              childStore[planId].push(val);
            }
          }
        }
      }
    }

    function processObject(
      obj: object,
      map: { [responseKey: string]: BucketDefinitionFieldOutputMap },
      pathIdentity: string,
      setter: BucketSetter,
      index: number,
    ): void {
      const concreteType = setter.concreteType!;
      const rootPathIdentity = setter.rootPathIdentity;
      for (const responseKey of (map as any)[$$keys]) {
        const field = map[responseKey];
        const keyPathIdentity = pathIdentity + responseKey;
        // console.log(keyPathIdentity);
        if (field.typeNames && !field.typeNames.includes(concreteType)) {
          continue;
        }
        const planId = field.planIdByRootPathIdentity[rootPathIdentity];
        if (planId == null) {
          continue;
        }
        const rawValue = store[planId][index];
        const mode = field.modeByRootPathIdentity[rootPathIdentity];
        const value = bucketValue(
          obj,
          responseKey,
          rawValue,
          mode,
          field.typeName,
          requestContext,
        );
        obj[responseKey] = value;

        if (mode.type === "A") {
          if (Array.isArray(value)) {
            const nestedPathIdentity = keyPathIdentity + "[]";
            processListChildren(nestedPathIdentity, rawValue, value, index);
          }
        } else if (mode.type === "O") {
          const d = value;
          if (d != null && !isCrystalError(d)) {
            if (field.children) {
              processObject(
                d,
                field.children,
                `${keyPathIdentity}>${d[$$concreteType]}.`,
                setter,
                index,
              );
            }
            if (pathIdentitiesWithChildren.includes(keyPathIdentity)) {
              const valueConcreteType = value[$$concreteType];
              for (const child of childrenByPathIdentity[keyPathIdentity]!) {
                if (child.definition.itemStepId != null) {
                  throw new Error("INCONSISTENT!");
                }
                if (child.definition.groupId != null) {
                  throw new Error("Group inside list currently unsupported");
                }
                const match =
                  !child.definition.polymorphicTypeNames ||
                  child.definition.polymorphicTypeNames.includes(
                    valueConcreteType,
                  );
                if (match) {
                  child.input.push(
                    new BucketSetter(keyPathIdentity, obj, responseKey),
                  );
                  for (const planId of child.definition.copyPlanIds) {
                    child.store[planId].push(store[planId][index]);
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
