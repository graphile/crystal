import * as assert from "assert";

import type { ExecutableStep, ModifierStep } from "../step";
import type { OperationPlan } from "./OperationPlan";

export interface LayerPlanReasonRoot {
  type: "root";
}
export interface LayerPlanReasonList {
  type: "list";
  /**
   * Can be used such that the same LayerPlan can be used for two lists for
   * the same parent plan. In this case an additional output plan would be
   * added to the LayerPlan.
   */
  parentPlanId: number;
}
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
export interface LayerPlanReasonSubscription {
  type: "subscription";
}
export interface LayerPlanReasonMutationField {
  type: "mutationField";
}
export interface LayerPlanReasonDefer {
  type: "defer";
  label?: string;
}
export interface LayerPlanReasonPolymorphic {
  type: "polymorphic";
}
export interface LayerPlanReasonSubroutine {
  type: "subroutine";
}

export type LayerPlanReason =
  | LayerPlanReasonRoot
  | LayerPlanReasonList
  | LayerPlanReasonStream
  | LayerPlanReasonSubscription
  | LayerPlanReasonMutationField
  | LayerPlanReasonDefer
  | LayerPlanReasonPolymorphic
  | LayerPlanReasonSubroutine;

/**
 * A layer plan represents (via "reason") either the root (root), when
 * something happens at a later time (mutationField, defer), when plurality
 * changes (list, stream, subscription, polymorphic), or when a subprocess
 * needs to be computed (subroutine).
 *
 * Layer plans belong to an operation plan.
 *
 * Every layer plan (except for the root layer plan) as exactly one parent
 * layer plan.
 *
 * Every layer plan is caused by a parent plan.
 */
export class LayerPlan<TReason extends LayerPlanReason> {
  id: number;

  /**
   * Every layer step has a "root step" that shapes the value the layer
   * returns. Note that this step may be dependent on other steps included in
   * the LayerPlan, or could be provided externally.
   *
   * The root step is different for different layer step reasons:
   *
   * - root: the `opPlan.rootValue`
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

  constructor(
    public readonly operationPlan: OperationPlan,
    public readonly parentLayerPlan: LayerPlan<any> | null,
    public readonly parentStep: ExecutableStep,
    public readonly reason: TReason,
  ) {
    this.id = operationPlan.addLayerPlan(this);
    if (!parentLayerPlan) {
      assert.strictEqual(
        this.id,
        0,
        "All but the first LayerPlan must have a parent",
      );
    }
    parentStep.childLayerPlans.push(this);
  }

  /** @internal Use plan.getStep(id) instead. */
  public getStep(id: string, requestingStep: ExecutableStep): ExecutableStep {
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
