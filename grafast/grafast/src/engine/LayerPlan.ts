import * as assert from "../assert.js";
import type { Bucket } from "../bucket.js";
import { inspect } from "../inspect.js";
import type { ExecutionValue, UnaryExecutionValue } from "../interfaces.js";
import {
  FLAG_ERROR,
  FLAG_INHIBITED,
  FLAG_NULL,
  FORBIDDEN_BY_NULLABLE_BOUNDARY_FLAGS,
  NO_FLAGS,
} from "../interfaces.js";
import { resolveType } from "../polymorphic.js";
import type { Step, UnbatchedStep } from "../step";
import { batchExecutionValue, newBucket } from "./executeBucket.js";
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
  parentStep: Step;
}
export interface LayerPlanReasonListItemStream {
  initialCountStepId?: number;
  ifStepId?: number;
  labelStepId?: number;
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
  parentStep: Step;

  /**
   * If this listItem is to be streamed, the configuration for that streaming.
   */
  stream?: LayerPlanReasonListItemStream;
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
  // TODO: change to labelStepId, also add ifStepId. See listItem.stream for
  // examples.
  label?: string;
}
/** Branching, non-deferred */
export interface LayerPlanReasonPolymorphic {
  type: "polymorphic";
  typeNames: string[];
  /**
   * Needed for execution (see `executeBucket`).
   */
  parentStep: Step;
  polymorphicPaths: Set<string>;
}
/** Non-branching, non-deferred */
export interface LayerPlanReasonSubroutine {
  // NOTE: the plan that has a subroutine should call executeBucket from within
  // `execute`.
  type: "subroutine";
  parentStep: Step;
}

export function isBranchingLayerPlan(layerPlan: LayerPlan): boolean {
  return layerPlan.reason.type === "polymorphic";
}
export function isDeferredLayerPlan(layerPlan: LayerPlan): boolean {
  const t = layerPlan.reason.type;
  return (
    (t === "listItem" && layerPlan.reason.stream != null) ||
    t === "subscription" ||
    t === "mutationField" ||
    t === "defer"
  );
}
export function isPolymorphicLayerPlan(layerPlan: LayerPlan): boolean {
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
  ? A extends { parentStep: Step }
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
        step: Step;
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
        step: UnbatchedStep;

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
  _allSteps: Step[];
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
   * - subscription: also the `__ItemStep`
   * - mutationField: the result plan of the mutation field
   * - defer: the parent layer's rootStep (defer always results in an object, unless an error occurs)
   * - polymorphic: the plan for the particular type
   * - subroutine: the result (returned) plan of the subroutine
   *
   * @internal
   */
  public readonly rootStep: Step | null = null;

  /**
   * Which steps the results for which are available in a parent bucket need to
   * be "copied across" to this bucket because steps in this bucket still
   * reference them?
   *
   * @internal
   */
  public copyStepIds: number[] = [];

  /** @internal */
  public children: LayerPlan[] = [];

  /** @internal */
  steps: Step[] = [];
  /** @internal */
  pendingSteps: Step[] = [];

  /**
   * This goes along with `parentStep` in the reason, except it applies to all
   * layer plan types and we figure it out automatically from the parent layer
   * plan. If this step has an error at a given index, then it should be
   * treated as if the parentStep had an error at that same index.
   *
   * @internal
   */
  public parentSideEffectStep: Step | null = null;

  /**
   * This tracks the latest seen side effect at the current point in planning
   * (such that created steps take this to be their implicitSideEffectStep).
   * This isn't used once planning is complete.
   *
   * @internal
   */
  public latestSideEffectStep: Step | null = null;

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
  stepsByConstructor: Map<Function, Set<Step>>;

  constructor(
    public readonly operationPlan: OperationPlan,
    public parentLayerPlan: LayerPlan | null,
    public readonly reason: TReason, //parentStep: ExecutableStep | null,
  ) {
    // This layer plan is dependent on the latest side effect. Note that when
    // we set a `rootStep` later, if the root step is dependent on this step
    // (directly or indirectly) we will clear this property.
    this.parentSideEffectStep = parentLayerPlan?.latestSideEffectStep ?? null;

    // There has yet to be any side effects created in this layer.
    this.latestSideEffectStep = null;

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
    const deps = this.copyStepIds.length > 0 ? `/${this.copyStepIds}` : "";
    return `LayerPlan<${this.id}${chain}${
      this.parentSideEffectStep ? `^${this.parentSideEffectStep.id}` : ""
    }?${this.reason.type}${reasonExtra}!${this.rootStep?.id ?? "x"}${deps}>`;
  }

  print(depth = 0) {
    const output = [`${" ".repeat(depth * 2)}${this}`];
    for (const child of this.children) {
      output.push(child.print(depth + 1));
    }
    return output.join("\n");
  }

  _hasSetRootStep = false;
  setRootStep($root: Step): void {
    if (this._hasSetRootStep) {
      throw new Error(`Set root step on ${this} more than once`);
    }
    this._hasSetRootStep = true;
    this.operationPlan.stepTracker.setLayerPlanRootStep(this, $root);

    // NOTE: we may clear `this.parentSideEffectStep` based on the `$root` step
    // having an explicit dependency on `this.parentSideEffectStep`; but that
    // will be done as part of `OperationPlan::finalizeLayerPlans()` because
    // steps aren't assigned `implicitSideEffectStep`s until that point.
  }

  /** @internal Use plan.getStep(id) instead. */
  public getStep(id: number, requestingStep: Step): Step {
    return this.operationPlan.getStep(id, requestingStep);
  }

  /** @internal */
  public _addStep(step: Step): number {
    return this.operationPlan._addStep(step);
  }

  public finalize(): void {}

  public newBucket(parentBucket: Bucket): Bucket | null {
    const { copyStepIds } = this;
    const store: Bucket["store"] = new Map();
    const polymorphicPathList: (string | null)[] =
      this.reason.type === "mutationField"
        ? (parentBucket.polymorphicPathList as string[])
        : [];
    const iterators: Array<Set<AsyncIterator<any> | Iterator<any>>> =
      this.reason.type === "mutationField" ? parentBucket.iterators : [];
    const map: Map<number, number | number[]> = new Map();

    const $parentSideEffect = this.parentSideEffectStep;
    let parentSideEffectValue: ExecutionValue | null;
    if ($parentSideEffect) {
      parentSideEffectValue = parentBucket.store.get($parentSideEffect.id)!;
    } else {
      parentSideEffectValue = null;
    }

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
          const fieldValue = parentBucket.store.get(
            itemStepId,
          )! as UnaryExecutionValue;
          const forbiddenFlags =
            fieldValue._entryFlags & FORBIDDEN_BY_NULLABLE_BOUNDARY_FLAGS;
          if (forbiddenFlags) {
            size = 0;
          } else {
            store.set(itemStepId, fieldValue);
            for (const stepId of copyStepIds) {
              store.set(stepId, parentBucket.store.get(stepId)!);
            }
            const parentBucketSize = parentBucket.size;
            for (
              let originalIndex = 0;
              originalIndex < parentBucketSize;
              originalIndex++
            ) {
              if (
                parentSideEffectValue === null ||
                !(parentSideEffectValue._flagsAt(originalIndex) & FLAG_ERROR)
              ) {
                const newIndex = size++;
                map.set(originalIndex, newIndex);
                polymorphicPathList[newIndex] =
                  parentBucket.polymorphicPathList[originalIndex];
                iterators[newIndex] = parentBucket.iterators[originalIndex];
              }
            }
          }
        } else if (hasNoNullsOrErrors) {
          const nullableStepStore = parentBucket.store.get(itemStepId);
          if (!nullableStepStore) {
            throw new Error(
              `GrafastInternalError<017dc8bf-1db1-4983-a41e-e69c6652e4c7>: could not find entry '${itemStepId}' (${parentBucket.layerPlan.operationPlan.dangerouslyGetStep(
                itemStepId,
              )}) in store for ${parentBucket.layerPlan}`,
            );
          }
          store.set(itemStepId, nullableStepStore);
          for (const stepId of copyStepIds) {
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
          store.set(itemStepId, batchExecutionValue(itemStepIdList));

          for (const stepId of copyStepIds) {
            const ev = parentBucket.store.get(stepId)!;
            if (ev.isBatch) {
              // Prepare store with an empty list for each copyPlanId
              store.set(stepId, batchExecutionValue([]));
            } else {
              store.set(stepId, ev);
            }
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
            if (
              (parentSideEffectValue === null ||
                !(
                  parentSideEffectValue._flagsAt(originalIndex) & FLAG_ERROR
                )) &&
              !(nullableStepStore._flagsAt(originalIndex) & FLAG_NULL)
            ) {
              const newIndex = size++;
              map.set(originalIndex, newIndex);
              const fieldValue: any[] | null | undefined | Error =
                nullableStepStore.at(originalIndex);
              itemStepIdList[newIndex] = fieldValue;

              polymorphicPathList[newIndex] =
                parentBucket.polymorphicPathList[originalIndex];
              iterators[newIndex] = parentBucket.iterators[originalIndex];
              for (const stepId of copyStepIds) {
                const ev = store.get(stepId)!;
                if (ev.isBatch) {
                  const orig = parentBucket.store.get(stepId)!;
                  ev._copyResult(newIndex, orig, originalIndex);
                }
              }
            }
          }
        }

        break;
      }
      case "listItem": {
        const listStepId = this.reason.parentStep.id;
        const listStepStore = parentBucket.store.get(listStepId);
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
        if (this.rootStep._isUnary) {
          throw new Error("listItem layer plan can't have a unary root step!");
        }
        const ev = batchExecutionValue([] as any[]);
        store.set(itemStepId, ev);

        for (const stepId of copyStepIds) {
          // Deliberate shadowing
          const ev = parentBucket.store.get(stepId)!;
          if (ev.isBatch) {
            // Prepare store with an empty list for each copyPlanId
            store.set(stepId, batchExecutionValue([]));
          } else {
            store.set(stepId, ev);
          }
        }

        // We'll typically be creating more listItem bucket entries than we
        // have parent buckets, so we must "multiply up" the store entries.
        for (
          let originalIndex = 0;
          originalIndex < parentBucket.size;
          originalIndex++
        ) {
          const list: any[] | null | undefined | Error =
            listStepStore.at(originalIndex);
          if (
            (parentSideEffectValue === null ||
              !(parentSideEffectValue._flagsAt(originalIndex) & FLAG_ERROR)) &&
            Array.isArray(list)
          ) {
            const newIndexes: number[] = [];
            map.set(originalIndex, newIndexes);
            for (let j = 0, l = list.length; j < l; j++) {
              const newIndex = size++;
              newIndexes.push(newIndex);
              (ev.entries as any[])[newIndex] = list[j];
              // TODO: are these the right flags?
              ev._flags[newIndex] = list[j] == null ? FLAG_NULL : NO_FLAGS;

              polymorphicPathList[newIndex] =
                parentBucket.polymorphicPathList[originalIndex];
              iterators[newIndex] = parentBucket.iterators[originalIndex];
              for (const stepId of copyStepIds) {
                const ev = store.get(stepId)!;
                if (ev.isBatch) {
                  const orig = parentBucket.store.get(stepId)!;
                  ev._copyResult(newIndex, orig, originalIndex);
                }
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
        for (const stepId of copyStepIds) {
          store.set(stepId, parentBucket.store.get(stepId)!);
        }

        break;
      }
      case "polymorphic": {
        const polymorphicPlanId = this.reason.parentStep.id;
        const polymorphicPlanStore = parentBucket.store.get(polymorphicPlanId);
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

        for (const stepId of copyStepIds) {
          const ev = parentBucket.store.get(stepId);
          if (!ev) {
            throw new Error(
              `GrafastInternalError<548f0d84-4556-4189-8655-fb16aa3345a6>: new bucket for ${this} wants to copy ${this.operationPlan.dangerouslyGetStep(
                stepId,
              )}, but bucket for ${
                parentBucket.layerPlan
              } doesn't contain that plan`,
            );
          }
          if (ev.isBatch) {
            store.set(stepId, batchExecutionValue([]));
          } else {
            store.set(stepId, ev);
          }
        }

        for (
          let originalIndex = 0;
          originalIndex < parentBucket.size;
          originalIndex++
        ) {
          const flags = polymorphicPlanStore._flagsAt(originalIndex);
          if (flags & (FLAG_ERROR | FLAG_INHIBITED | FLAG_NULL)) {
            continue;
          }
          if (
            parentSideEffectValue !== null &&
            parentSideEffectValue._flagsAt(originalIndex) & FLAG_ERROR
          ) {
            continue;
          }
          const value = polymorphicPlanStore.at(originalIndex);
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
          for (const planId of copyStepIds) {
            const ev = store.get(planId)!;
            if (ev.isBatch) {
              const orig = parentBucket.store.get(planId)!;
              ev._copyResult(newIndex, orig, originalIndex);
            }
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
          // PERF: not necessarily, if we don't copy the errors, we don't have the errors.
          flagUnion: parentBucket.flagUnion,
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
