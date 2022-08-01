import * as assert from "assert";

import type { ExecutableStep, ModifierStep } from "../step";
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
export interface LayerPlanReasonListItem {
  type: "listItem";
  /**
   * Can be used such that the same LayerPlan can be used for two lists for
   * the same parent plan. In this case an additional output plan would be
   * added to the LayerPlan.
   */
  parentPlanId: number;
}
/** Non-branching, deferred */
export interface LayerPlanReasonStream {
  type: "stream";
  initialCount: number;
  label?: string;
  /**
   * Can be used such that the same LayerPlan can be used for two streams for
   * the same parent plan. In this case an additional output plan would be
   * added to the LayerPlan.
   */
  parentPlanId: number;
}
/** Non-branching, deferred */
export interface LayerPlanReasonSubscription {
  type: "subscription";
}
/** Non-branching, deferred */
export interface LayerPlanReasonMutationField {
  type: "mutationField";
}
/** Non-branching, deferred */
export interface LayerPlanReasonDefer {
  type: "defer";
  typeNames: string[]; // Could be polymorphic
  label?: string;
}
/** Branching, non-deferred */
export interface LayerPlanReasonPolymorphic {
  type: "polymorphic";
  typeNames: string[];
}
/** Non-branching, non-deferred */
export interface LayerPlanReasonSubroutine {
  // NOTE: the plan that has a subroutine should call executeBucket from within
  // `execute`.
  type: "subroutine";
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
  return (
    t === "polymorphic" ||
    (t === "defer" &&
      (layerPlan as LayerPlan<LayerPlanReasonDefer>).reason.typeNames.length >
        1)
  );
}

export type LayerPlanReason =
  | LayerPlanReasonRoot
  | LayerPlanReasonListItem
  | LayerPlanReasonStream
  | LayerPlanReasonSubscription
  | LayerPlanReasonMutationField
  | LayerPlanReasonDefer
  | LayerPlanReasonPolymorphic
  | LayerPlanReasonSubroutine;

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
   * - list: the `__ItemStep`
   * - stream: also the `__ItemStep`
   * - subscription: also the `__ItemStep`
   * - mutationField: the result plan of the mutation field
   * - defer: the parent layer's rootStep (defer always results in an object, unless an error occurs)
   * - polymorphic: the plan for the particular type
   * - subroutine: the result (returned) plan of the subroutine
   *
   * @internal
   */
  public rootStepId: number | null = null;

  /**
   * Which plans the results for which are available in a parent bucket need to
   * be "copied across" to this bucket because plans in this bucket still
   * reference them?
   *
   * @internal
   */
  public copyPlanIds: number[] = [];

  /** @internal */
  public children: LayerPlan[] = [];

  /** @internal */
  steps: ExecutableStep[] = [];
  /** @internal */
  startSteps: ExecutableStep[] = [];

  constructor(
    public readonly operationPlan: OperationPlan,
    public parentLayerPlan: LayerPlan | null,
    public readonly reason: TReason, //parentStep: ExecutableStep | null,
  ) {
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
}
