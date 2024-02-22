import LRU from "@graphile/lru";
import type { TE } from "tamedevil";
import te from "tamedevil";

import * as assert from "../assert.js";
import type { Bucket } from "../bucket.js";
import { isDev } from "../dev.js";
import type { GrafastError } from "../error.js";
import { isGrafastError } from "../error.js";
import { inspect } from "../inspect.js";
import { resolveType } from "../polymorphic.js";
import type {
  ExecutableStep,
  ModifierStep,
  UnbatchedExecutableStep,
} from "../step";
import { newBucket } from "./executeBucket.js";
import type { OperationPlan } from "./OperationPlan";

/*
 * Branching: e.g. polymorphic, conditional, etc - means that different
 * directions can be chosen - the plan "branches" at that point based on a
 * condition. We should not push plans up into parents _unless_ every branch
 * uses the same plan; otherwise we're making the parent do more work than
 * necessary.
 *
 * Deferred: e.g. mutation, subscription, defer, stream - means that the values
 * are calculated "at a later time". We must not push plans up into parents
 * because the values could be out of date (mutations, subscriptions) or would
 * do premature calculation (stream, defer) thus slowing initial payload
 * delivery.
 */

/** Non-branching, non-deferred */
export interface LayerPlanReasonRoot {
  type: "root";
}
/** Non-branching, non-deferred */
export interface LayerPlanReasonNullableField {
  type: "nullableBoundary";
  /**
   * Can be used such that the same LayerPlan can be used for two selection
   * sets for the same parent plan. In this case an additional output plan
   * would be added to the LayerPlan.
   *
   * Also needed for execution (see `executeBucket`).
   */
  parentStep: ExecutableStep;
}
/** Non-branching, non-deferred */
export interface LayerPlanReasonListItem {
  type: "listItem";
  /**
   * Can be used such that the same LayerPlan can be used for two lists for
   * the same parent plan. In this case an additional output plan would be
   * added to the LayerPlan.
   *
   * Also needed for execution (see `executeBucket`).
   */
  parentStep: ExecutableStep;

  /** If this listItem is to be streamed, the configuration for that streaming */
  stream?: {
    initialCount: number;
    label?: string;
  };
}
/** Non-branching, deferred */
export interface LayerPlanReasonSubscription {
  type: "subscription";
}
/** Non-branching, deferred */
export interface LayerPlanReasonMutationField {
  type: "mutationField";
  mutationIndex: number;
}
/** Non-branching, deferred */
export interface LayerPlanReasonDefer {
  type: "defer";
  label?: string;
}
/** Branching, non-deferred */
export interface LayerPlanReasonPolymorphic {
  type: "polymorphic";
  typeNames: string[];
  /**
   * Needed for execution (see `executeBucket`).
   */
  parentStep: ExecutableStep;
  polymorphicPaths: Set<string>;
}
/** Non-branching, non-deferred */
export interface LayerPlanReasonSubroutine {
  // NOTE: the plan that has a subroutine should call executeBucket from within
  // `execute`.
  type: "subroutine";
  parentStep: ExecutableStep;
}

export function isBranchingLayerPlan(layerPlan: LayerPlan<any>): boolean {
  return layerPlan.reason.type === "polymorphic";
}
export function isDeferredLayerPlan(layerPlan: LayerPlan<any>): boolean {
  const t = layerPlan.reason.type;
  return (
    t === "stream" ||
    t === "subscription" ||
    t === "mutationField" ||
    t === "defer"
  );
}
export function isPolymorphicLayerPlan(layerPlan: LayerPlan<any>): boolean {
  const t = layerPlan.reason.type;
  return t === "polymorphic";
}

export type LayerPlanReason =
  | LayerPlanReasonRoot
  | LayerPlanReasonNullableField
  | LayerPlanReasonListItem
  | LayerPlanReasonSubscription
  | LayerPlanReasonMutationField
  | LayerPlanReasonDefer
  | LayerPlanReasonPolymorphic
  | LayerPlanReasonSubroutine;

// The `A extends any ? ... : never` tells TypeScript to make this
// distributive. TypeScript can be a bit arcane.
export type HasParent<A extends LayerPlanReason> = A extends any
  ? A extends { parentStep: ExecutableStep }
    ? A
    : never
  : never;

export type LayerPlanReasonsWithParentStep = HasParent<LayerPlanReason>;

/** @internal */
export interface LayerPlanPhase {
  /**
   * If true, we should check before the layer plan executes to see if the
   * execution has already timed out.
   *
   * @see {@link RequestTools.stopTime}
   */
  checkTimeout: boolean;

  /**
   * A list of steps that can be ran in parallel at this point, since all
   * their previous dependencies have already been satisfied.
   */
  normalSteps:
    | Array<{
        step: ExecutableStep;
      }>
    | undefined;

  /**
   * A list of 'isSyncAndSafe' steps with unbatchedExecute methods that can be
   * ran once the `normalSteps` have completed; they must only depend on steps
   * that have already been executed before them (including previous
   * unbatchedSyncAndSafeSteps in the same list).
   */
  unbatchedSyncAndSafeSteps:
    | Array<{
        step: UnbatchedExecutableStep;

        /**
         * Store the result of the step here if you want - useful to avoid lookups
         * and when there's no storage. HIGHLY VOLATILE, will not survive a tick!
         */
        scratchpad: any;
      }>
    | undefined;

  /**
   * Optimization - a digest of all steps in normalSteps and unbatchedSyncAndSafeSteps
   *
   * @internal
   */
  _allSteps: ExecutableStep[];
}

/**
 * A LayerPlan represents (via "reason") either the root (root), when something
 * happens at a later time (mutationField, defer), when plurality changes
 * (list, stream, subscription, polymorphic), or when a subprocess needs to be
 * computed (subroutine).
 *
 * Layer plans belong to an operation plan.
 *
 * Every layer plan (except for the root layer plan) has exactly one parent
 * layer plan.
 *
 * Every layer plan is caused by a parent step.
 *
 * The LayerPlan of a step influences:
 *
 * 1. how steps are deduplicated
 * 2. the order in which the steps are executed
 * 3. where the result of executing the step is stored
 * 4. when the step execution cache is allowed to be GC'd
 *
 * NOTE: `__ListTransformStep`'s effectively have a temporary bucket inside
 * them (built on the `__Item`) that's thrown away once the transform is
 * complete.
 *
 */
export class LayerPlan<TReason extends LayerPlanReason = LayerPlanReason> {
  id: number;

  /**
   * Every layer plan has a "root step" that shapes the value the layer
   * returns. Note that this step may be dependent on other steps included in
   * the LayerPlan, or could be provided externally.
   *
   * The root step is different for different layer step reasons:
   *
   * - root: the `operationPlan.rootValue`
   * - listItem: the `__ItemStep`
   * - stream: also the `__ItemStep`
   * - subscription: also the `__ItemStep`
   * - mutationField: the result plan of the mutation field
   * - defer: the parent layer's rootStep (defer always results in an object, unless an error occurs)
   * - polymorphic: the plan for the particular type
   * - subroutine: the result (returned) plan of the subroutine
   *
   * @internal
   */
  public readonly rootStep: ExecutableStep | null = null;

  /**
   * Which steps the results for which are available in a parent bucket need to
   * be "copied across" to this bucket because steps in this bucket still
   * reference them? Batch steps only.
   *
   * @internal
   */
  public copyBatchStepIds: number[] = [];
  /**
   * Which steps the results for which are available in a parent bucket need to
   * be "copied across" to this bucket because steps in this bucket still
   * reference them? Unary steps only.
   *
   * @internal
   */
  public copyUnaryStepIds: number[] = [];

  /** @internal */
  public children: LayerPlan[] = [];

  /** @internal */
  steps: ExecutableStep[] = [];
  /** @internal */
  pendingSteps: ExecutableStep[] = [];

  /**
   * Describes the order in which the steps within this LayerPlan are executed.
   *
   * Special attention must be paid to steps that have side effects.
   *
   * @internal
   */
  phases: Array<LayerPlanPhase> = [];

  /**
   * The list of layerPlans that steps added to this LayerPlan may depend upon.
   * Note this includes self, so it has one more entry than `depth`.
   *
   * ```
   * this.ancestry[this.depth] === this;
   * ```
   *
   * @internal
   */
  ancestry: LayerPlan[];

  /** How "deep" this layer plan is (how many ancestors it has). The root layer plan has a depth of 0. */
  depth: number;
  /** The depth at which a "defer boundary" occurs (OperationPlan.getPeers cannot pass a defer boundary), or 0. */
  deferBoundaryDepth: number;

  /**
   * An optimization for OperationPlan.getPeers; this tracks the steps in this
   * layer plan, grouped by their step class.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  stepsByConstructor: Map<Function, Set<ExecutableStep>>;

  constructor(
    public readonly operationPlan: OperationPlan,
    public parentLayerPlan: LayerPlan | null,
    public readonly reason: TReason, //parentStep: ExecutableStep | null,
  ) {
    this.stepsByConstructor = new Map();
    if (parentLayerPlan !== null) {
      this.depth = parentLayerPlan.depth + 1;
      this.ancestry = [...parentLayerPlan.ancestry, this];
      if (isDeferredLayerPlan(this)) {
        this.deferBoundaryDepth = this.depth;
      } else {
        this.deferBoundaryDepth = parentLayerPlan.deferBoundaryDepth;
      }
    } else {
      this.depth = 0;
      this.ancestry = [this];
      this.deferBoundaryDepth = 0;
    }
    this.id = operationPlan.addLayerPlan(this);
    if (!parentLayerPlan) {
      assert.strictEqual(
        this.id,
        0,
        "All but the first LayerPlan must have a parent",
      );
    } else {
      assert.ok(
        reason.type != "root",
        "Non-root LayerPlan must have a parentStep",
      );
      parentLayerPlan.children.push(this);
    }
  }

  toString() {
    let chain = "";
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let current: LayerPlan | null = this;
    while ((current = current.parentLayerPlan)) {
      chain = chain + `∈${current.id}`;
    }
    const reasonExtra =
      this.reason.type === "polymorphic"
        ? `{${this.reason.typeNames.join(",")}}`
        : "";
    const deps =
      (this.copyUnaryStepIds.length > 0 ? `/${this.copyUnaryStepIds}` : "") +
      (this.copyBatchStepIds.length > 0 ? `%${this.copyBatchStepIds}` : "");
    return `LayerPlan<${this.id}${chain}?${this.reason.type}${reasonExtra}!${
      this.rootStep?.id ?? "x"
    }${deps}>`;
  }

  print(depth = 0) {
    const output = [`${" ".repeat(depth * 2)}${this}`];
    for (const child of this.children) {
      output.push(child.print(depth + 1));
    }
    return output.join("\n");
  }

  setRootStep($root: ExecutableStep): void {
    this.operationPlan.stepTracker.setLayerPlanRootStep(this, $root);
  }

  /** @internal Use plan.getStep(id) instead. */
  public getStep(id: number, requestingStep: ExecutableStep): ExecutableStep {
    return this.operationPlan.getStep(id, requestingStep);
  }

  /** @internal */
  public _addStep(step: ExecutableStep): number {
    return this.operationPlan._addStep(step);
  }

  /** @internal */
  public _addModifierStep(step: ModifierStep<any>): string {
    return this.operationPlan._addModifierStep(step);
  }

  public finalize(): void {
    if (
      // this.reason.type === "nullableBoundary" ||
      this.reason.type === "listItem"
    ) {
      const u = this.copyUnaryStepIds.length;
      const b = this.copyBatchStepIds.length;
      const signature = `${this.reason.type[0]}_${u}_${b}`;
      withNewBucketFactory(signature, u, b, this.reason.type, (fn) => {
        this.newBucket = fn(this.copyUnaryStepIds, this.copyBatchStepIds);
      });
    }
  }

  public newBucket(parentBucket: Bucket): Bucket | null {
    const { copyUnaryStepIds, copyBatchStepIds } = this;
    const unaryStore = new Map();
    const store: Bucket["store"] = new Map();
    const polymorphicPathList: (string | null)[] =
      this.reason.type === "mutationField"
        ? (parentBucket.polymorphicPathList as string[])
        : [];
    const iterators: Array<Set<AsyncIterator<any> | Iterator<any>>> =
      this.reason.type === "mutationField" ? parentBucket.iterators : [];
    const map: Map<number, number | number[]> = new Map();
    let size = 0;
    switch (this.reason.type) {
      case "nullableBoundary": {
        if (this.rootStep == null) {
          throw new Error(
            "GrafastInternalError<f8136364-46c7-4886-b2ae-51319826f97d>: nullableStepStore layer plan has no rootStepId",
          );
        }
        const itemStepId = this.rootStep.id;

        // PERF: if parent bucket has no nulls/errors in `itemStepId`
        // then we can just copy everything wholesale rather than building
        // new arrays and looping.
        const hasNoNullsOrErrors = false;

        if (this.rootStep._isUnary) {
          assert.ok(
            parentBucket.size == 1,
            "GrafastInternalError<8c26e449-26ad-4192-b95d-170c59a024a4>: unary step must be in bucket of size 1 (otherwise it's not unary...)",
          );
          size = 1;
          unaryStore.set(itemStepId, parentBucket.unaryStore.get(itemStepId));
          for (const stepId of copyUnaryStepIds) {
            unaryStore.set(stepId, parentBucket.unaryStore.get(stepId)!);
          }
          for (const stepId of copyBatchStepIds) {
            store.set(stepId, parentBucket.store.get(stepId)!);
          }
          map.set(0, 0);
          polymorphicPathList[0] = parentBucket.polymorphicPathList[0];
          iterators[0] = parentBucket.iterators[0];
        } else if (hasNoNullsOrErrors) {
          if (this.rootStep._isUnary) {
            unaryStore.set(itemStepId, parentBucket.unaryStore.get(itemStepId));
          } else {
            const nullableStepStore = parentBucket.store.get(itemStepId);
            if (!nullableStepStore) {
              throw new Error(
                `GrafastInternalError<017dc8bf-1db1-4983-a41e-e69c6652e4c7>: could not find entry '${itemStepId}' (${parentBucket.layerPlan.operationPlan.dangerouslyGetStep(
                  itemStepId,
                )}) in store for ${parentBucket.layerPlan}`,
              );
            }
            store.set(itemStepId, nullableStepStore);
          }
          for (const stepId of copyUnaryStepIds) {
            unaryStore.set(stepId, parentBucket.unaryStore.get(stepId)!);
          }
          for (const stepId of copyBatchStepIds) {
            store.set(stepId, parentBucket.store.get(stepId)!);
          }
          for (
            let originalIndex = 0;
            originalIndex < parentBucket.size;
            originalIndex++
          ) {
            const newIndex = size++;
            map.set(originalIndex, newIndex);
            polymorphicPathList[newIndex] =
              parentBucket.polymorphicPathList[originalIndex];
            iterators[newIndex] = parentBucket.iterators[originalIndex];
          }
        } else {
          const itemStepIdList: any[] = [];
          store.set(itemStepId, itemStepIdList);

          for (const stepId of copyUnaryStepIds) {
            unaryStore.set(stepId, parentBucket.unaryStore.get(stepId));
          }
          // Prepare store with an empty list for each copyPlanId
          for (const stepId of copyBatchStepIds) {
            store.set(stepId, []);
          }

          const nullableStepStore = parentBucket.store.get(itemStepId);
          if (!nullableStepStore) {
            throw new Error(
              `GrafastInternalError<017dc8bf-1db1-4983-a41e-e69c6652e4c7>: could not find entry '${itemStepId}' (${parentBucket.layerPlan.operationPlan.dangerouslyGetStep(
                itemStepId,
              )}) in store for ${parentBucket.layerPlan}`,
            );
          }

          // We'll typically be creating fewer nullableBoundary bucket entries
          // than we have parent bucket entries (because we exclude nulls), so
          // we must "multiply up" (down) the store entries.
          for (
            let originalIndex = 0;
            originalIndex < parentBucket.size;
            originalIndex++
          ) {
            const fieldValue: any[] | null | undefined | GrafastError =
              nullableStepStore[originalIndex];
            if (fieldValue != null) {
              const newIndex = size++;
              map.set(originalIndex, newIndex);
              itemStepIdList[newIndex] = fieldValue;

              polymorphicPathList[newIndex] =
                parentBucket.polymorphicPathList[originalIndex];
              iterators[newIndex] = parentBucket.iterators[originalIndex];
              for (const stepId of copyBatchStepIds) {
                store.get(stepId)![newIndex] =
                  parentBucket.store.get(stepId)![originalIndex];
              }
            }
          }
        }

        break;
      }
      case "listItem": {
        const listStepId = this.reason.parentStep.id;
        const listStepStore = this.reason.parentStep._isUnary
          ? [parentBucket.unaryStore.get(listStepId)]
          : parentBucket.store.get(listStepId);
        if (!listStepStore) {
          throw new Error(
            `GrafastInternalError<314865b0-f7e8-4e81-b966-56e5a0de562e>: could not find entry '${listStepId}' (${parentBucket.layerPlan.operationPlan.dangerouslyGetStep(
              listStepId,
            )}) in store for layerPlan ${parentBucket.layerPlan}`,
          );
        }

        if (this.rootStep == null) {
          throw new Error(
            "GrafastInternalError<b3a2bff9-15c6-47e2-aa82-19c862324f1a>: listItem layer plan has no rootStepId",
          );
        }
        const itemStepId = this.rootStep.id;
        // Item steps are **NOT** unary
        const itemStepIdList: any[] = [];
        if (this.rootStep._isUnary) {
          // handled later
        } else {
          store.set(itemStepId, itemStepIdList);
        }

        for (const stepId of copyUnaryStepIds) {
          unaryStore.set(stepId, parentBucket.unaryStore.get(stepId));
        }
        // Prepare store with an empty list for each copyPlanId
        for (const stepId of copyBatchStepIds) {
          store.set(stepId, []);
        }

        // We'll typically be creating more listItem bucket entries than we
        // have parent buckets, so we must "multiply up" the store entries.
        for (
          let originalIndex = 0;
          originalIndex < parentBucket.size;
          originalIndex++
        ) {
          const list: any[] | null | undefined | GrafastError =
            listStepStore[originalIndex];
          if (Array.isArray(list)) {
            const newIndexes: number[] = [];
            map.set(originalIndex, newIndexes);
            for (let j = 0, l = list.length; j < l; j++) {
              const newIndex = size++;
              newIndexes.push(newIndex);
              if (this.rootStep._isUnary) {
                unaryStore.set(itemStepId, list[j]);
              } else {
                itemStepIdList[newIndex] = list[j];
              }

              polymorphicPathList[newIndex] =
                parentBucket.polymorphicPathList[originalIndex];
              iterators[newIndex] = parentBucket.iterators[originalIndex];
              for (const stepId of copyBatchStepIds) {
                store.get(stepId)![newIndex] =
                  parentBucket.store.get(stepId)![originalIndex];
              }
            }
          }
        }

        break;
      }
      case "mutationField": {
        // This is a 1-to-1 map, so we can mostly just copy from parent bucket
        size = parentBucket.size;
        for (let i = 0; i < parentBucket.size; i++) {
          map.set(i, i);
        }
        for (const stepId of copyUnaryStepIds) {
          unaryStore.set(stepId, parentBucket.unaryStore.get(stepId)!);
        }
        for (const stepId of copyBatchStepIds) {
          store.set(stepId, parentBucket.store.get(stepId)!);
        }

        break;
      }
      case "polymorphic": {
        const polymorphicPlanId = this.reason.parentStep.id;
        const polymorphicPlanStore = this.reason.parentStep._isUnary
          ? [parentBucket.unaryStore.get(polymorphicPlanId)]
          : parentBucket.store.get(polymorphicPlanId);
        if (!polymorphicPlanStore) {
          throw new Error(
            `GrafastInternalError<af1417c6-752b-466e-af7e-cfc35724c3bc>: Entry for '${parentBucket.layerPlan.operationPlan.dangerouslyGetStep(
              polymorphicPlanId,
            )}' not found in bucket for '${parentBucket.layerPlan}'`,
          );
        }

        // We're only copying over the entries that match this type (note:
        // they may end up being null, but that's okay)
        const targetTypeNames = this.reason.typeNames;

        for (const stepId of copyUnaryStepIds) {
          unaryStore.set(stepId, parentBucket.unaryStore.get(stepId));
        }
        for (const stepId of copyBatchStepIds) {
          store.set(stepId, []);
          if (isDev && !parentBucket.store.has(stepId)) {
            throw new Error(
              `GrafastInternalError<548f0d84-4556-4189-8655-fb16aa3345a6>: new bucket for ${this} wants to copy ${this.operationPlan.dangerouslyGetStep(
                stepId,
              )}, but bucket for ${
                parentBucket.layerPlan
              } doesn't contain that plan`,
            );
          }
        }

        for (
          let originalIndex = 0;
          originalIndex < parentBucket.size;
          originalIndex++
        ) {
          const value = polymorphicPlanStore[originalIndex];
          if (value == null) {
            continue;
          }
          if (isGrafastError(value)) {
            continue;
          }
          const typeName = resolveType(value);
          if (!targetTypeNames.includes(typeName)) {
            continue;
          }
          const newIndex = size++;
          map.set(originalIndex, newIndex);

          // PERF: might be faster if we look this up as a constant rather than using concatenation here
          const newPolymorphicPath =
            (parentBucket.polymorphicPathList[originalIndex] ?? "") +
            ">" +
            typeName;

          polymorphicPathList[newIndex] = newPolymorphicPath;
          iterators[newIndex] = parentBucket.iterators[originalIndex];
          for (const planId of copyBatchStepIds) {
            store.get(planId)![newIndex] =
              parentBucket.store.get(planId)![originalIndex];
          }
        }

        break;
      }
      case "subscription":
      case "defer": {
        // TODO
        throw new Error("TODO");
      }
      case "subroutine": {
        throw new Error(
          "Subroutines are experimental and must currently handle their own bucket creation",
        );
      }
      case "root": {
        throw new Error(
          // *confused emoji*
          "GrafastInternalError<05fb7069-81b5-43f7-ae71-f62547d2c2b7>: root cannot be not the root (...)",
        );
      }
      default: {
        const never: never = this.reason;
        throw new Error(
          `GrafastInternalError<8162e6c2-3d66-4d67-ba03-5310a4f9a6d4>: unhandled reason '${inspect(
            never,
          )}'`,
        );
      }
    }

    if (size > 0) {
      // Reference
      const childBucket = newBucket(
        {
          layerPlan: this,
          size,
          store,
          unaryStore,
          // PERF: not necessarily, if we don't copy the errors, we don't have the errors.
          hasErrors: parentBucket.hasErrors,
          polymorphicPathList,
          iterators,
        },
        parentBucket.metaByMetaKey,
      );
      parentBucket.children[this.id] = {
        bucket: childBucket,
        map,
      };

      return childBucket;
    } else {
      return null;
    }
  }
}

type Factory = (
  copyUnaryStepIds: number[],
  copyBatchStepIds: number[],
) => typeof LayerPlan.prototype.newBucket;

const makeNewBucketCache = new LRU<string, Factory>({
  maxLength: 1000,
});
const makingNewBucketCallbacks = new Map<
  string,
  Array<(factory: Factory) => void>
>();
const te_parentBucketDotPolymorphicPathList = te`parentBucket.polymorphicPathList`;
const te_parentBucketDotIterators = te`parentBucket.iterators`;
const te_emptyArray = te`[]`;
const ref_newBucket = te.ref(newBucket, "newBucket");

function makeNewBucketExpression(
  signature: string,
  reasonType: "nullableBoundary" | "listItem" | "mutationField",
  inner: TE,
): TE {
  const expr = te`\
(function ${te.identifier(`newBucket_${signature}`)}(parentBucket) {
  const unaryStore = new Map();
  const store = new Map();
  const polymorphicPathList = ${
    reasonType === "mutationField"
      ? te_parentBucketDotPolymorphicPathList
      : te_emptyArray
  };
  const iterators = ${
    reasonType === "mutationField" ? te_parentBucketDotIterators : te_emptyArray
  };
  const map = new Map();
  let size = 0;

${inner}

  if (size > 0) {
    // Reference
    const childBucket = ${ref_newBucket}({
      layerPlan: this,
      size,
      store,
      unaryStore,
      // PERF: not necessarily, if we don't copy the errors, we don't have the errors.
      hasErrors: parentBucket.hasErrors,
      polymorphicPathList,
      iterators,
    }, parentBucket.metaByMetaKey);
    // PERF: set ourselves in more places so that we never have to call 'getChildBucketAndIndex'.
    parentBucket.children[this.id] = { bucket: childBucket, map };

    return childBucket;
  } else {
    return null;
  }
})`;
  // te.debug(expr);
  return expr;
}

function newBucketFactoryInnerExpression(
  signature: string,
  unaryCopyCount: number,
  batchCopyCount: number,
  reasonType: "nullableBoundary" | "listItem",
) {
  if (reasonType === "nullableBoundary") {
    if (Math.random() < 2) {
      throw new Error("This code no longer works since we added unary steps.");
    }
    // PERF: if parent bucket has no nulls/errors in itemStepId
    // then we can just copy everything wholesale rather than building
    // new arrays and looping.

    const blocks: TE[] = [];
    const copyBlocks: TE[] = [];
    for (let i = 0; i < unaryCopyCount; i++) {
      const te_i = te.lit(i);
      blocks.push(
        te`\
  unaryStore.set(copyUnaryStepIds[${te_i}], parentBucket.unaryStore.get(copyUnaryStepIds[${te_i}]));
`,
      );
    }
    for (let i = 0; i < batchCopyCount; i++) {
      const te_source = te.identifier(`source${i}`);
      const te_target = te.identifier(`target${i}`);
      const te_i = te.lit(i);
      blocks.push(
        te`\
  const ${te_source} = parentBucket.store.get(copyBatchStepIds[${te_i}]);
  const ${te_target} = [];
  store.set(copyBatchStepIds[${te_i}], ${te_target});
`,
      );
      copyBlocks.push(
        te`\
      ${te_target}[newIndex] = ${te_source}[originalIndex];
`,
      );
    }

    return makeNewBucketExpression(
      signature,
      reasonType,
      te`\
  const itemStepId = this.rootStep.id;
  const nullableStepStore = parentBucket.store.get(itemStepId);

  const itemStepIdList = [];
  store.set(itemStepId, itemStepIdList);

  // Prepare store with an empty list for each copyPlanId
${te.join(blocks, "")}

  // We'll typically be creating fewer nullableBoundary bucket entries
  // than we have parent bucket entries (because we exclude nulls), so
  // we must "multiply up" (down) the store entries.
  for (
    let originalIndex = 0;
    originalIndex < parentBucket.size;
    originalIndex++
  ) {
    const fieldValue = nullableStepStore[originalIndex];
    if (fieldValue != null) {
      const newIndex = size++;
      map.set(originalIndex, newIndex);
      itemStepIdList[newIndex] = fieldValue;

      polymorphicPathList[newIndex] = parentBucket.polymorphicPathList[originalIndex];
      iterators[newIndex] = parentBucket.iterators[originalIndex];
${te.join(copyBlocks, "")}
    }
  }
`,
    );
  } else if (reasonType === "listItem") {
    const blocks: TE[] = [];
    const copyBlocks: TE[] = [];
    for (let i = 0; i < unaryCopyCount; i++) {
      const te_i = te.lit(i);
      blocks.push(
        te`\
  unaryStore.set(copyUnaryStepIds[${te_i}], parentBucket.unaryStore.get(copyUnaryStepIds[${te_i}]));
  `,
      );
    }
    for (let i = 0; i < batchCopyCount; i++) {
      const te_source = te.identifier(`source${i}`);
      const te_target = te.identifier(`target${i}`);
      const te_i = te.lit(i);
      blocks.push(
        te`\
  const ${te_source} = parentBucket.store.get(copyBatchStepIds[${te_i}]);
  const ${te_target} = [];
  store.set(copyBatchStepIds[${te_i}], ${te_target});
  `,
      );
      copyBlocks.push(te`\
        ${te_target}[newIndex] = ${te_source}[originalIndex];
        `);
    }
    return makeNewBucketExpression(
      signature,
      reasonType,
      te`\
  const listStepId = this.reason.parentStep.id;
  const listStepStore =
    this.reason.parentStep._isUnary
      ? [parentBucket.unaryStore.get(listStepId)]
      : parentBucket.store.get(listStepId);

  const itemStepIdList = [];
  store.set(this.rootStep.id, itemStepIdList);

  // Prepare store with an empty list for each copyPlanId
  ${te.join(blocks, "")}

  // We'll typically be creating more listItem bucket entries than we
  // have parent buckets, so we must "multiply up" the store entries.
  for (
    let originalIndex = 0;
    originalIndex < parentBucket.size;
    originalIndex++
  ) {
    const list = listStepStore[originalIndex];
    if (Array.isArray(list)) {
      const newIndexes = [];
      map.set(originalIndex, newIndexes);
      for (let j = 0, l = list.length; j < l; j++) {
        const newIndex = size++;
        newIndexes.push(newIndex);
        itemStepIdList[newIndex] = list[j];

        polymorphicPathList[newIndex] = parentBucket.polymorphicPathList[originalIndex];
        iterators[newIndex] = parentBucket.iterators[originalIndex];
        ${te.join(copyBlocks, "")}
      }
    }
  }

`,
    );
  } else {
    const never: never = reasonType;
    return never;
  }
}

function withNewBucketFactory(
  signature: string,
  unaryCopyCount: number,
  batchCopyCount: number,
  reasonType: "nullableBoundary" | "listItem",
  callback: (factory: Factory) => void,
) {
  const fn = makeNewBucketCache.get(signature);
  if (fn !== undefined) {
    return callback(fn);
  }
  const building = makingNewBucketCallbacks.get(signature);
  if (building !== undefined) {
    building.push(callback as (factory: Factory) => void);
    return;
  }

  const callbacks = [callback as (factory: Factory) => void];
  makingNewBucketCallbacks.set(signature, callbacks);

  const executorExpression = newBucketFactoryInnerExpression(
    signature,
    unaryCopyCount,
    batchCopyCount,
    reasonType,
  );

  const factoryExpression = te`\
function ${te.identifier(
    `layerPlanNewBucketFactory_${signature}`,
  )}(copyUnaryStepIds, copyBatchStepIds) {
  return ${executorExpression};
}`;
  te.runInBatch<Factory>(factoryExpression, (factory) => {
    makeNewBucketCache.set(signature, factory);
    makingNewBucketCallbacks.delete(signature);
    for (const callback of callbacks) {
      callback(factory);
    }
  });
}
