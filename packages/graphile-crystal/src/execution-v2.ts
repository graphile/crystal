import { inspect } from "util";

import type { Aether } from ".";
import { CrystalError } from ".";
import type {
  Bucket,
  BucketDefinition,
  BucketDefinitionFieldOutputMap,
  RequestContext,
} from "./bucket";
import { BucketSetter, bucketValue } from "./bucket";
import type {
  CrystalContext,
  CrystalValuesList,
  PromiseOrDirect,
} from "./interfaces";
import { $$concreteType } from "./interfaces";
import type { ExecutablePlan } from "./plan";
import { __ListTransformPlan } from "./plans";
import { arrayOfLength, isPromiseLike } from "./utils";

// optimization
export const $$keys = Symbol("keys");

function writeListValueIntoChildBucket(
  store: {
    [planId: string]: any[];
  },
  child: Pick<Bucket, "store" | "definition" | "input" | "hasErrors">,
  rootPathIdentity: string,
  index: number,
  parentObject: object | unknown[],
  parentKey: number,
  entry: any,
): void {
  const {
    store: itemStore,
    input: itemInputs,
    definition: { copyPlanIds, itemPlanId: rawItemPlanId },
  } = child;
  const itemPlanId = rawItemPlanId!;
  itemInputs.push(
    new BucketSetter(
      // TODO: what should this "rootPathIdentity" be?
      rootPathIdentity,
      parentObject,
      parentKey,
    ),
  );
  const l = itemStore[itemPlanId].push(entry);
  for (const planId of copyPlanIds) {
    const val = store[planId][index];
    itemStore[planId].push(val);
  }
}

export function executeBucket(
  aether: Aether,
  metaByPlanId: CrystalContext["metaByPlanId"],
  bucket: Bucket,
  requestContext: RequestContext,
): PromiseOrDirect<Array<any>> {
  const inProgressPlans = new Set();
  const pendingPlans = new Set(bucket.definition.plans);
  const store = bucket.store;
  const rootOutputModeType = bucket.definition.rootOutputModeType;
  const isNestedListBucket = rootOutputModeType === "A";
  const isLeafBucket = rootOutputModeType === "L";
  const isObjectBucket = rootOutputModeType === "O";
  const {
    input,
    noDepsList,
    definition: {
      id: bucketId,
      startPlans,
      children: childBucketDefinitions,
      rootOutputPlanId,
      singleTypeNameByRootPathIdentity,
      rootOutputModeByRootPathIdentity,
      outputMap,
    },
  } = bucket;
  const size = input.length;

  const reallyCompletedPlan = (
    finishedPlan: ExecutablePlan,
  ): void | Promise<void> => {
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
        // executePlan never THROW/REJECTs
        const r = executePlan(potentialNextPlan);
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
  };

  const completedPlan = (
    finishedPlan: ExecutablePlan,
    result: CrystalValuesList<any>,
    noNewErrors = false,
  ): void | Promise<void> => {
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
    if (finishedPlan.sync && noNewErrors) {
      // It promises not to add new errors, and not to include promises in the result array
      store[finishedPlan.id] = result;
      return reallyCompletedPlan(finishedPlan);
    } else {
      // Need to complete promises, check for errors, etc
      return Promise.allSettled(result).then((rs) => {
        const finalResult = rs.map((t, i) => {
          if (t.status === "fulfilled") {
            return t.value;
          } else {
            bucket.hasErrors = true;
            return new CrystalError(t.reason);
          }
        });
        store[finishedPlan.id] = result;
        return reallyCompletedPlan(finishedPlan);
      });
    }
  };

  const executeListTransform = (
    plan: __ListTransformPlan<any, any, any>,
    dependencies: (readonly any[])[],
    meta: Record<string, unknown>,
  ): PromiseOrDirect<any[]> => {
    const itemPlan = aether.dangerouslyGetPlan(plan.itemPlanId!);
    const itemPlanId = itemPlan.id;
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
    itemStore[itemPlanId] = [];

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

    const listsLength = lists.length;
    for (let i = 0, l = listsLength; i < l; i++) {
      const list = lists[i];
      if (Array.isArray(list)) {
        const listLength = list.length;
        const innerList = arrayOfLength(listLength);
        for (let j = 0, m = listLength; j < m; j++) {
          writeListValueIntoChildBucket(
            store,
            itemBucket,
            "",
            i,
            innerList,
            j,
            list[j],
          );
        }
      } else {
        // Noop
      }
    }

    const result = executeBucket(
      aether,
      metaByPlanId,
      itemBucket,
      requestContext,
    );

    const performTransform = (): any[] => {
      const result: any[] = [];
      const transformDepPlanId =
        aether.transformDependencyPlanIdByTransformPlanId[plan.id];
      const depResults = itemStore[transformDepPlanId];
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
    };

    if (isPromiseLike(result)) {
      return result.then(performTransform);
    } else {
      return performTransform();
    }
  };

  /**
   * This function MUST NEVER THROW/REJECT.
   */
  const executePlan = (plan: ExecutablePlan): void | PromiseLike<void> => {
    if (inProgressPlans.has(plan)) {
      return;
    }
    inProgressPlans.add(plan);
    try {
      const meta = metaByPlanId[plan.id]!;
      const dependencies: any[] = [];
      const depCount = plan.dependencies.length;
      if (depCount > 0) {
        for (let i = 0, l = depCount; i < l; i++) {
          const depId = plan.dependencies[i];
          dependencies[i] = store[depId];
        }
      } else {
        dependencies.push(noDepsList);
      }
      const result =
        plan instanceof __ListTransformPlan
          ? executeListTransform(plan, dependencies, meta)
          : plan.execute(dependencies, meta);
      if (isPromiseLike(result)) {
        return result.then(
          (values) => {
            return completedPlan(plan, values);
          },
          (error) => {
            return completedPlan(
              plan,
              arrayOfLength(size, new CrystalError(error)),
            );
          },
        );
      } else {
        return completedPlan(plan, result, true);
      }
    } catch (error) {
      return completedPlan(
        plan,
        arrayOfLength(size, new CrystalError(error)),
        true,
      );
    }
  };
  const starterPromises: PromiseLike<void>[] = [];
  for (const plan of startPlans) {
    const r = executePlan(plan);
    if (isPromiseLike(r)) {
      starterPromises.push(r);
    }
  }

  const produceOutput = (): PromiseOrDirect<Array<any>> => {
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
      if (childBucketDefinition.itemPlanId) {
        entry.store[childBucketDefinition.itemPlanId] = [];
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

    const processListChildren = (
      nestedPathIdentity: string,
      rawValue: any,
      value: any,
      index: number,
    ) => {
      if (pathIdentitiesWithChildren.includes(nestedPathIdentity)) {
        for (const child of childrenByPathIdentity[nestedPathIdentity]!) {
          const {
            input: childInputs,
            store: childStore,
            definition: { itemPlanId, polymorphicPlanIds, groupId },
          } = child;
          if (itemPlanId == null) {
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
            writeListValueIntoChildBucket(
              store,
              child,
              nestedPathIdentity,
              index,
              value,
              i,
              rawValue[i],
            );
          }
        }
      }
    };

    const rootOutputStore =
      rootOutputPlanId != null ? store[rootOutputPlanId] : null;

    const processObject = (
      obj: object,
      map: { [responseKey: string]: BucketDefinitionFieldOutputMap },
      pathIdentity: string,
      setter: BucketSetter,
      index: number,
    ) => {
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
          if (d !== null && d !== undefined && d.constructor !== CrystalError) {
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
                if (child.definition.itemPlanId != null) {
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
    };

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
      if (
        isObjectBucket &&
        setterRoot !== null &&
        setterRoot !== undefined &&
        setterRoot.constructor !== CrystalError
      ) {
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
          for (const child of childrenByPathIdentity[
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
        const r = executeBucket(
          aether,
          metaByPlanId,
          childBucket,
          requestContext,
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
  };

  if (starterPromises.length > 0) {
    return Promise.all(starterPromises).then(produceOutput);
  } else {
    return produceOutput();
  }
}
