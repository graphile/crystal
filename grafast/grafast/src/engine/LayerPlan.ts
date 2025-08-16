import * as assert from "../assert.js";
import type { Bucket } from "../bucket.js";
import {
  FLAG_ERROR,
  FLAG_INHIBITED,
  FLAG_NULL,
  FLAG_POLY_SKIPPED,
  FLAG_STOPPED,
  FORBIDDEN_BY_NULLABLE_BOUNDARY_FLAGS,
  NO_FLAGS,
} from "../constants.js";
import { isDev } from "../dev.js";
import { isFlaggedValue } from "../error.js";
import { inspect } from "../inspect.js";
import type { ExecutionValue, UnaryExecutionValue } from "../interfaces.js";
import type { Step, UnbatchedStep } from "../step";
import type { __ValueStep } from "../steps/index.js";
import { arrayOfLength, arraysMatch, setsMatch } from "../utils.js";
import { isDistributor } from "./distributor.js";
import { batchExecutionValue, newBucket } from "./executeBucket.js";
import type { OperationPlan } from "./OperationPlan";

/**
 * If any of these flags exist on a value then it isn't the value we want to
 * include for the combo step.
 */
const SKIP_FLAGS =
  FLAG_ERROR | FLAG_STOPPED | FLAG_POLY_SKIPPED | FLAG_INHIBITED;

/**
 * If any of these flags exist on the "$__typename" step, then the value
 * should resolve to null
 */
const NO_TYPENAME_FLAGS =
  FLAG_ERROR | FLAG_STOPPED | FLAG_POLY_SKIPPED | FLAG_INHIBITED | FLAG_NULL;

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
  parentLayerPlan: LayerPlan;
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
  parentLayerPlan: LayerPlan;
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
  parentLayerPlan: LayerPlan;
}

/** Non-branching, deferred */
export interface LayerPlanReasonMutationField {
  type: "mutationField";
  parentLayerPlan: LayerPlan;
  mutationIndex: number;
}

/** Non-branching, deferred */
export interface LayerPlanReasonDefer {
  type: "defer";
  parentLayerPlan: LayerPlan;
  // TODO: change to labelStepId, also add ifStepId. See listItem.stream for
  // examples.
  label?: string;
}

/**
 * Non-branching, non-deferred
 *
 * A polymorphic bucket indicates a transition between values of unknown type
 * and values of a known polymorphic type. This is predicated based on the
 * given typename - before the typename is known, we must run all steps for all
 * types, but once the type is known we can be more selective about which steps
 * to run.
 *
 * When a polymorphic type is met, there will always be a polymorphic layer
 * plan, even if all steps within it run for all types. This is necessary to
 * advance the `polymorphicPathList` index for the relevant indicies.
 */
export interface LayerPlanReasonPolymorphic {
  type: "polymorphic";
  parentLayerPlan: LayerPlan;
  typeNames: string[];
  /**
   * Stores the __typename, needed for execution (see `executeBucket`).
   */
  parentStep: Step<string | null>;
  polymorphicPaths: Set<string>;
}

/**
 * Branching, non-deferred
 *
 * A polymorphicPartition bucket accepts a subset of types and contains only
 * steps relevant to those types; it's a way to avoid having to do a lot of
 * filtering of values being passed into steps' execute methods by
 * pre-filtering the values.
 */
export interface LayerPlanReasonPolymorphicPartition {
  type: "polymorphicPartition";
  parentLayerPlan: LayerPlan<LayerPlanReasonPolymorphic>;
  typeNames: string[];
  polymorphicPaths: ReadonlySet<string>;
}

/** Non-branching, non-deferred */
export interface LayerPlanReasonSubroutine {
  // NOTE: the plan that has a subroutine should call executeBucket from within
  // `execute`.
  type: "subroutine";
  parentLayerPlan: LayerPlan;
  parentStep: Step;
}

/**
 * Anti-branching, non-deferred
 *
 * A "combined" layer plan exists to re-combine values from multiple layer
 * plans together again, to allow future steps to be more efficient. It's
 * typically relevant when polymorphism has occurred and has caused branching,
 * the combined layer plan allows the values to be recombined before branching
 * again, such that L layers of polymorphism, where there are P different
 * polymorphic branches at each layer, results in P*L branches rather than P^L
 * branches - i.e. it scales linary with number of layers rather than
 * exponentially.
 */
export interface LayerPlanReasonCombined {
  type: "combined";
  parentLayerPlans: ReadonlyArray<LayerPlan>;
}

export function hasParentLayerPlan(
  reason: LayerPlanReason,
): reason is Exclude<
  LayerPlanReason,
  LayerPlanReasonRoot | LayerPlanReasonCombined
> {
  return reason.type !== "root" && reason.type !== "combined";
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

export type LayerPlanReason =
  | LayerPlanReasonRoot
  | LayerPlanReasonNullableField
  | LayerPlanReasonListItem
  | LayerPlanReasonSubscription
  | LayerPlanReasonMutationField
  | LayerPlanReasonDefer
  | LayerPlanReasonPolymorphic
  | LayerPlanReasonPolymorphicPartition
  | LayerPlanReasonCombined
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

  public distributorDependencies: null | {
    // Map of all the dependent stepIds for a given distributor step
    [distributorStepId: number]: number[];
  } = null;

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
  public parentSideEffectStep: Step | null;

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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  stepsByConstructor: Map<Function, Set<Step>>;

  // TODO: is it possible for this to go wrong by one of the stream items not
  // streaming and the other one streaming? Technically the arguments need to
  // match or it wouldn't be allowed to combine (the planning paths would
  // differ because they factor in the argument step ids) but what if we
  // decided to fulfil one without streaming and the other streaming only?
  /**
   * Populated during `finalize`, this will be empty except for phase
   * transition layer plans (defer/stream) wherein it will contain a list of
   * "unreachable" layer plan IDs relevant to the "combined" layer plans trying
   * to refer to parent layer plans which are outside of this incremental
   * boundary (e.g. if two lists both stream, we might combine those, but at
   * runtime only one will be populated so we can't wait for the other to
   * complete otherwise nothing will happen).
   */
  public outOfBoundsLayerPlanIds = new Set<number>();

  constructor(
    public readonly operationPlan: OperationPlan,
    public readonly reason: TReason, //parentStep: ExecutableStep | null,
  ) {
    // This layer plan is dependent on the latest side effect. Note that when
    // we set a `rootStep` later, if the root step is dependent on this step
    // (directly or indirectly) we will clear this property.

    // There has yet to be any side effects created in this layer.
    this.latestSideEffectStep = null;

    this.stepsByConstructor = new Map();
    if (reason.type === "root") {
      this.parentSideEffectStep = null;
      this.depth = 0;
      this.ancestry = [this];
      this.deferBoundaryDepth = 0;

      this.id = operationPlan.addLayerPlan(this);

      assert.strictEqual(
        this.id,
        0,
        "Root layer plan must have id=0, there must be only one",
      );
    } else if (reason.type === "combined") {
      this.parentSideEffectStep = null;
      const firstParentLayerPlan = reason.parentLayerPlans[0];
      const rootLp = firstParentLayerPlan.ancestry[0];
      if (rootLp.reason.type !== "root") {
        throw new Error(
          "GrafastInternalError<e9290db3-9a1b-45af-a50e-baa9e161d7cc>: expected the 0'th entry in ancestry to be the root layer plan",
        );
      }

      // TODO: is this calculated correctly?
      let deferBoundaryDepth = 0;

      this.ancestry = [];
      /** Unskipped because it comes from the raw layer plans, we skip over those that don't match */
      let prevUnskippedDeferBoundaryDepth = 0;
      for (let i = 0, l = firstParentLayerPlan.ancestry.length; i < l; i++) {
        const ancestor = firstParentLayerPlan.ancestry[i];
        let match = true;
        for (const lp of reason.parentLayerPlans) {
          if (lp.ancestry[i] !== ancestor) {
            // Shared ancestry fails here
            match = false;
          }
        }
        if (match) {
          this.ancestry.push(ancestor);
          if (ancestor.deferBoundaryDepth > prevUnskippedDeferBoundaryDepth) {
            if (ancestor.deferBoundaryDepth === ancestor.depth) {
              // They're the boundary
              deferBoundaryDepth = this.ancestry.length - 1;
            } else {
              // Treat the previous ancestor as the defer boundary
              deferBoundaryDepth = this.ancestry.length - 2;
            }
            prevUnskippedDeferBoundaryDepth = ancestor.deferBoundaryDepth;
          }
        }
      }
      this.ancestry.push(this);
      this.depth = this.ancestry.length - 1;
      this.deferBoundaryDepth = deferBoundaryDepth;

      this.id = operationPlan.addLayerPlan(this);

      // Deliberately shadow!
      for (const parentLayerPlan of reason.parentLayerPlans) {
        parentLayerPlan.children.push(this);
      }
    } else {
      const parentLayerPlan = reason.parentLayerPlan;

      if (reason.type === "polymorphicPartition") {
        if (parentLayerPlan.reason.type !== "polymorphic") {
          throw new Error(
            `GrafastInternalError<ef8fcb9a-5252-4593-915c-b3ebe4aa8eff>: a polymorphicPartition may only be a child of a polymorphic layer plan, but ${this} was created under ${parentLayerPlan}`,
          );
        }
      }

      this.parentSideEffectStep = parentLayerPlan.latestSideEffectStep ?? null;
      this.depth = parentLayerPlan.depth + 1;
      this.ancestry = [...parentLayerPlan.ancestry, this];
      if (isDeferredLayerPlan(this)) {
        this.deferBoundaryDepth = this.depth;
      } else {
        this.deferBoundaryDepth = parentLayerPlan.deferBoundaryDepth;
      }

      this.id = operationPlan.addLayerPlan(this);

      parentLayerPlan.children.push(this);
    }
  }

  toString() {
    let chain = "";
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let prev: LayerPlan = this;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let current: LayerPlan | null = this;
    while (
      (current = hasParentLayerPlan(current.reason)
        ? current.reason.parentLayerPlan
        : null)
    ) {
      chain = chain + `∈${current.id}`;
      prev = current;
    }
    if (prev.reason.type === "combined") {
      chain =
        chain + `Σ${prev.reason.parentLayerPlans.map((p) => p.id).join("|")}`;
    }
    const reasonExtra =
      this.reason.type === "polymorphicPartition"
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

  public finalize(): void {
    this.finalCombinations = this.combinations.map((c) => {
      const { targetStepId, sources } = c;
      const sourceStepsByLayerPlanId = Object.create(null) as Record<
        LayerPlan["id"],
        Step["id"][]
      >;
      for (const { layerPlanId, stepId } of sources) {
        sourceStepsByLayerPlanId[layerPlanId] ??= [];
        sourceStepsByLayerPlanId[layerPlanId].push(stepId);
      }
      return {
        targetStepId,
        sourceStepsByLayerPlanId,
      };
    });
  }

  public newBucket(parentBucket: Bucket): Bucket | null {
    if (this.reason.type === "combined") {
      throw new Error(`Use newCombinedBucket instead.`);
    }
    const { copyStepIds } = this;
    const store: Bucket["store"] = new Map();
    const polymorphicPathList: (string | null)[] =
      this.reason.type === "mutationField"
        ? (parentBucket.polymorphicPathList as string[])
        : [];
    const polymorphicType =
      this.reason.type === "polymorphic" ? ([] as string[]) : null;
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

    const skippedIndicies =
      this.distributorDependencies === null ? null : ([] as number[]);
    const skipIndex =
      skippedIndicies === null
        ? null
        : skippedIndicies.push.bind(skippedIndicies);

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
              const ev = parentBucket.store.get(stepId)!;
              if (ev.isBatch) {
                // Prepare store with an empty list for each copyPlanId
                store.set(stepId, batchExecutionValue([]));
              } else {
                store.set(stepId, ev);
              }
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
                for (const stepId of copyStepIds) {
                  const ev = store.get(stepId)!;
                  if (ev.isBatch) {
                    const orig = parentBucket.store.get(stepId)!;
                    ev._copyResult(newIndex, orig, originalIndex);
                  }
                }
              } else {
                skipIndex?.(originalIndex);
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
          const ev = batchExecutionValue([]);
          store.set(itemStepId, ev);

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
              ev._copyResult(newIndex, nullableStepStore, originalIndex);

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
            } else {
              skipIndex?.(originalIndex);
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
              let val = list[j];
              let flags = NO_FLAGS;
              if (val == null) {
                flags = flags | FLAG_NULL;
              } else if (typeof val === "object" && isFlaggedValue(val)) {
                flags = val.flags;
                val = val.value;
                if (val == null) {
                  flags = flags | FLAG_NULL;
                }
              }
              ev._setResult(newIndex, val, flags);

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
          } else {
            skipIndex?.(originalIndex);
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
        const parentStepId = this.reason.parentStep.id;
        const typenameEV = parentBucket.store.get(parentStepId);
        if (!typenameEV) {
          throw new Error(
            `GrafastInternalError<af1417c6-752b-466e-af7e-cfc35724c3bc>: Entry for '${parentBucket.layerPlan.operationPlan.dangerouslyGetStep(
              parentStepId,
            )}' not found in bucket for '${parentBucket.layerPlan}'`,
          );
        }

        const batchCopyStepIds = [];
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
            batchCopyStepIds.push(stepId);
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
          const flags = typenameEV._flagsAt(originalIndex);
          if ((flags & NO_TYPENAME_FLAGS) !== 0) {
            skipIndex?.(originalIndex);
            continue;
          }
          if (
            parentSideEffectValue !== null &&
            parentSideEffectValue._flagsAt(originalIndex) & FLAG_ERROR
          ) {
            skipIndex?.(originalIndex);
            continue;
          }
          const polymorphicPath =
            parentBucket.polymorphicPathList.at(originalIndex);
          const typeName = typenameEV.at(originalIndex);
          if (!this.reason.typeNames.includes(typeName)) {
            skipIndex?.(originalIndex);
            // Search: InvalidConcreteTypeName
            // TODO: should we throw an error?

            // Skip
            continue;
          }
          const newIndex = size++;
          map.set(originalIndex, newIndex);
          polymorphicPathList[newIndex] =
            (polymorphicPath ?? "") + ">" + typeName;
          polymorphicType![newIndex] = typeName;
          iterators[newIndex] = parentBucket.iterators[originalIndex];
          for (const planId of batchCopyStepIds) {
            const ev = store.get(planId)!;
            const orig = parentBucket.store.get(planId)!;
            ev._copyResult(newIndex, orig, originalIndex);
          }
        }

        break;
      }
      case "polymorphicPartition": {
        // Similar to polymorphic
        const batchCopyStepIds = [];
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
            batchCopyStepIds.push(stepId);
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
          if (
            parentSideEffectValue !== null &&
            parentSideEffectValue._flagsAt(originalIndex) & FLAG_ERROR
          ) {
            skipIndex?.(originalIndex);
            continue;
          }
          const typeName = parentBucket.polymorphicType!.at(originalIndex)!;
          if (!this.reason.typeNames.includes(typeName)) {
            skipIndex?.(originalIndex);
            continue;
          }
          const newIndex = size++;
          map.set(originalIndex, newIndex);
          polymorphicPathList[newIndex] =
            parentBucket.polymorphicPathList.at(originalIndex)!;
          iterators[newIndex] = parentBucket.iterators[originalIndex];
          for (const planId of batchCopyStepIds) {
            const ev = store.get(planId)!;
            const orig = parentBucket.store.get(planId)!;
            ev._copyResult(newIndex, orig, originalIndex);
          }
        }

        break;
      }
      // case "combined": See newCombinedBucket below
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
      if (this.distributorDependencies !== null) {
        if (isDev) {
          if (this.reason.type === "listItem") {
            throw new Error(
              `distributorDependencies should not be set on ${this}`,
            );
          }
          assert.strictEqual(
            skippedIndicies?.length,
            parentBucket.size - size,
            "Incorrectly populated skippedIndicies",
          );
        }
        if (skippedIndicies !== null && skippedIndicies.length > 0) {
          for (const [distributorStepId, consumerStepIds] of Object.entries(
            this.distributorDependencies,
          )) {
            const distribEV = parentBucket.store.get(
              Number(distributorStepId),
            )!;
            for (const originalIndex of skippedIndicies) {
              const v = distribEV.at(originalIndex);
              if (isDistributor(v)) {
                for (const consumerStepId of consumerStepIds) {
                  v.releaseIfUnused(consumerStepId);
                }
              }
            }
          }
        }
      }

      // Reference
      const childBucket = newBucket(parentBucket, {
        layerPlan: this,
        size,
        store,
        // PERF: not necessarily, if we don't copy the errors, we don't have the errors.
        flagUnion: parentBucket.flagUnion,
        polymorphicPathList,
        polymorphicType,
        iterators,
      });
      parentBucket.children[this.id] = {
        bucket: childBucket,
        map,
      };

      return childBucket;
    } else {
      if (this.distributorDependencies !== null) {
        const parentBucketSize = parentBucket.size;
        for (const [distributorStepId, consumerStepIds] of Object.entries(
          this.distributorDependencies!,
        )) {
          const distribEV = parentBucket.store.get(Number(distributorStepId))!;
          for (
            let originalIndex = 0;
            originalIndex < parentBucketSize;
            originalIndex++
          ) {
            const v = distribEV.at(originalIndex);
            if (isDistributor(v)) {
              for (const consumerStepId of consumerStepIds) {
                v.releaseIfUnused(consumerStepId);
              }
            }
          }
        }
      }

      return null;
    }
  }

  public newCombinedBucket(
    finalParentBucket: Pick<Bucket, "sharedState">,
  ): Bucket | null {
    const t = this.reason.type;
    if (t !== "combined") {
      throw new Error(
        `GrafastInternalError<59c54cd0-ee32-478a-9e0e-4123eec2f8f5>: newCombinedBucket must only be called on combined layer plans`,
      );
    }

    const { sharedState } = finalParentBucket;
    const { copyStepIds } = this;

    const store: Bucket["store"] = new Map();
    const polymorphicPathList: (string | null)[] = [];
    const iterators: Array<Set<AsyncIterator<any> | Iterator<any>>> = [];
    const mapByParentLayerPlanId: Record<
      number,
      Map<number, number>
    > = Object.create(null);
    let flagUnion = NO_FLAGS;
    let totalSize = 0;
    const batchStepIdsToCopy = new Set<number>();

    for (const plp of this.reason.parentLayerPlans) {
      mapByParentLayerPlanId[plp.id] = new Map();
      const parentBucket = sharedState._retainedBuckets.get(plp.id);
      if (!parentBucket) continue;
      flagUnion |= parentBucket.flagUnion;
      totalSize += parentBucket.size;
      const map = mapByParentLayerPlanId[plp.id]!;
      for (let i = 0, l = parentBucket.size; i < l; i++) {
        const sourcePolyPath = parentBucket.polymorphicPathList[i];
        map.set(i, polymorphicPathList.length);
        polymorphicPathList.push(sourcePolyPath);
      }
      for (const copyStepId of copyStepIds) {
        if (store.has(copyStepId)) continue;
        const ev = parentBucket.store.get(copyStepId);
        if (ev == null) {
          // No action
          // TODO: do we need a placeholder for not found evs? I don't think so -
          // it implies that the dependency bucket doesn't exist and thus nothing
          // will use it?
        } else if (ev.isBatch) {
          batchStepIdsToCopy.add(copyStepId);
        } else {
          store.set(copyStepId, ev);
        }
      }
    }

    if (totalSize === 0) return null;

    for (const stepId of batchStepIdsToCopy) {
      const newEv = batchExecutionValue(
        arrayOfLength(totalSize, null),
        arrayOfLength(totalSize, FLAG_NULL | FLAG_STOPPED),
      );
      store.set(stepId, newEv);
      let offset = 0;
      for (const plp of this.reason.parentLayerPlans) {
        const parentBucket = sharedState._retainedBuckets.get(plp.id);
        if (!parentBucket) continue;

        const sourceEv = parentBucket.store.get(stepId);
        if (sourceEv != null) {
          // Populate it with the values we care about
          for (let i = 0, l = parentBucket.size; i < l; i++) {
            newEv._copyResult(i + offset, sourceEv, i);
          }
        }

        offset += parentBucket.size;
      }
    }

    const $parentSideEffect = this.parentSideEffectStep;
    if ($parentSideEffect) {
      throw new Error(
        `Side effects were not expected at this position; this is likely an issue with your plans, but if not then please file an issue containing a minimal reproduction`,
      );
    }

    ////////////////////////////////////////////////////////////////////////////
    //
    // Code that would be in the switch statement if we were normal...
    //

    for (const { targetStepId, sourceStepsByLayerPlanId } of this
      .finalCombinations) {
      const ev = batchExecutionValue(
        arrayOfLength(totalSize, null),
        arrayOfLength(totalSize, FLAG_NULL | FLAG_STOPPED),
      );
      store.set(targetStepId, ev);
      let offset = 0;
      for (const plp of this.reason.parentLayerPlans) {
        const parentBucket = sharedState._retainedBuckets.get(plp.id);
        if (parentBucket == null) continue;

        for (
          let originalIndex = 0;
          originalIndex < parentBucket.size;
          originalIndex++
        ) {
          const newIndex = originalIndex + offset;

          if (sourceStepsByLayerPlanId[plp.id]) {
            for (const stepId of sourceStepsByLayerPlanId[plp.id]) {
              const sourceStore = parentBucket.store.get(stepId);
              if (!sourceStore) {
                const step = this.operationPlan.stepTracker.getStepById(stepId);
                throw new Error(
                  `GrafastInternalError<a48ca88c-e4b9-4a4f-9a38-846fa067f143>: missing source store for ${step} (${stepId}) in ${this}`,
                );
              }
              if ((sourceStore._flagsAt(originalIndex) & SKIP_FLAGS) == 0) {
                ev._copyResult(newIndex, sourceStore, originalIndex);
                break;
              }
            }
          }

          iterators[newIndex] = parentBucket.iterators[originalIndex];
        }
        offset += parentBucket.size;
      }
    }

    //
    // End: code that would be in the switch statement if we were normal.
    //
    ////////////////////////////////////////////////////////////////////////////

    // Reference
    const childBucket = newBucket(
      { metaByMetaKey: undefined /* use defaults */, sharedState },
      {
        layerPlan: this,
        size: totalSize,
        store,
        // PERF: not necessarily, if we don't copy the errors, we don't have the errors.
        flagUnion,
        polymorphicPathList,
        polymorphicType: null,
        iterators,
      },
    );
    for (const plp of this.reason.parentLayerPlans) {
      const parentBucket = sharedState._retainedBuckets.get(plp.id);
      if (parentBucket != null) {
        const map = mapByParentLayerPlanId[plp.id]!;
        parentBucket.children[this.id] = {
          bucket: childBucket,
          map,
        };
      }
    }

    return childBucket;
  }

  /** @internal */
  public combinations: Array<{
    sources: readonly {
      layerPlanId: LayerPlan["id"];
      stepId: Step["id"];
    }[];
    targetStepId: number;
  }> = [];
  /** @internal */
  public finalCombinations: Array<{
    sourceStepsByLayerPlanId: {
      [layerPlanId: LayerPlan["id"]]: ReadonlyArray<Step["id"]>;
    };
    targetStepId: number;
  }> = [];
  public addCombo(
    sources: ReadonlyArray<{ layerPlan: LayerPlan; step: Step }>,
    $target: __ValueStep<any>,
  ): void {
    if (this.reason.type !== "combined") {
      throw new Error(`Combinations may only be added to combined layer plans`);
    }
    this.combinations.push({
      sources: sources.map((s) => ({
        layerPlanId: s.layerPlan.id,
        stepId: s.step.id,
      })),
      targetStepId: $target.id,
    });
    const { layerPlansByDependentStep } = this.operationPlan.stepTracker;
    sources.forEach(({ step }) => {
      let set = layerPlansByDependentStep.get(step);
      if (!set) {
        set = new Set();
        layerPlansByDependentStep.set(step, set);
      }
      set.add(this as LayerPlan<LayerPlanReasonCombined>);
    });
  }

  /** @internal */
  public getPartition(
    typeNames: string[],
    polymorphicPaths: ReadonlySet<string>,
  ): LayerPlan<LayerPlanReasonPolymorphicPartition> {
    const existing = this.children.find(
      (c): c is LayerPlan<LayerPlanReasonPolymorphicPartition> =>
        c.reason.type === "polymorphicPartition" &&
        // Note: it's probably okay to use arraysMatch here even though order is
        // unimportant because probably the order of all subsets will be the
        // same, so we don't need to do an order-independent comparison (which
        // would be more expensiv)
        arraysMatch(c.reason.typeNames, typeNames) &&
        setsMatch(c.reason.polymorphicPaths, polymorphicPaths),
    );
    if (existing) {
      return existing;
    }
    return new LayerPlan(this.operationPlan, {
      type: "polymorphicPartition",
      parentLayerPlan: this as LayerPlan<LayerPlanReasonPolymorphic>,
      typeNames,
      polymorphicPaths,
    });
  }
}
