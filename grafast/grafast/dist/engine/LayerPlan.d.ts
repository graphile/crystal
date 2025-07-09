import type { Bucket } from "../bucket.js";
import type { Step } from "../step";
import type { OperationPlan } from "./OperationPlan";
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
    type: "subroutine";
    parentStep: Step;
}
export declare function isBranchingLayerPlan(layerPlan: LayerPlan): boolean;
export declare function isDeferredLayerPlan(layerPlan: LayerPlan): boolean;
export declare function isPolymorphicLayerPlan(layerPlan: LayerPlan): boolean;
export type LayerPlanReason = LayerPlanReasonRoot | LayerPlanReasonNullableField | LayerPlanReasonListItem | LayerPlanReasonSubscription | LayerPlanReasonMutationField | LayerPlanReasonDefer | LayerPlanReasonPolymorphic | LayerPlanReasonSubroutine;
export type HasParent<A extends LayerPlanReason> = A extends any ? A extends {
    parentStep: Step;
} ? A : never : never;
export type LayerPlanReasonsWithParentStep = HasParent<LayerPlanReason>;
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
export declare class LayerPlan<TReason extends LayerPlanReason = LayerPlanReason> {
    readonly operationPlan: OperationPlan;
    parentLayerPlan: LayerPlan | null;
    readonly reason: TReason;
    id: number;
    /** How "deep" this layer plan is (how many ancestors it has). The root layer plan has a depth of 0. */
    depth: number;
    /** The depth at which a "defer boundary" occurs (OperationPlan.getPeers cannot pass a defer boundary), or 0. */
    deferBoundaryDepth: number;
    /**
     * An optimization for OperationPlan.getPeers; this tracks the steps in this
     * layer plan, grouped by their step class.
     */
    stepsByConstructor: Map<Function, Set<Step>>;
    constructor(operationPlan: OperationPlan, parentLayerPlan: LayerPlan | null, reason: TReason);
    toString(): string;
    print(depth?: number): string;
    _hasSetRootStep: boolean;
    setRootStep($root: Step): void;
    finalize(): void;
    newBucket(parentBucket: Bucket): Bucket | null;
}
//# sourceMappingURL=LayerPlan.d.ts.map