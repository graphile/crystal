import type { ExecutionEntryFlags } from "./interfaces";

export interface GrafastPlanJSON {
  version: "v1" | "v2";
}

export interface GrafastPlanStepJSONv1 {
  id: string | number;
  stepClass: string;
  metaString: string | null;
  isUnary: boolean;
  bucketId: string | number;
  implicitSideEffectStepId: string | number | null;
  dependencyIds: ReadonlyArray<string | number>;
  dependencyForbiddenFlags: ReadonlyArray<ExecutionEntryFlags>;
  dependencyOnReject: ReadonlyArray<string | null | undefined>;
  polymorphicPaths: readonly string[] | undefined;
  isSyncAndSafe: boolean | undefined;
  supportsUnbatched: boolean | undefined;
  hasSideEffects: boolean | undefined;
  stream: { initialCountStepId?: number } | undefined;
  extra?: Record<string, JSONValue | undefined>;
}

export interface GrafastPlanBucketPhaseJSONv1 {
  normalStepIds?: ReadonlyArray<string | number>;
  unbatchedStepIds?: ReadonlyArray<string | number>;
}

export type GrafastPlanBucketReasonJSONv1 =
  | GrafastPlanBucketReasonRootJSONv1
  | GrafastPlanBucketReasonNullableFieldJSONv1
  | GrafastPlanBucketReasonListItemJSONv1
  | GrafastPlanBucketReasonSubscriptionJSONv1
  | GrafastPlanBucketReasonMutationFieldJSONv1
  | GrafastPlanBucketReasonDeferJSONv1
  | GrafastPlanBucketReasonPolymorphicJSONv1
  | GrafastPlanBucketReasonPolymorphicPartitionJSONv1
  | GrafastPlanBucketReasonCombinedJSONv1
  | GrafastPlanBucketReasonSubroutineJSONv1;

export interface GrafastPlanBucketReasonRootJSONv1 {
  type: "root";
}
/** Non-branching, non-deferred */
export interface GrafastPlanBucketReasonNullableFieldJSONv1 {
  type: "nullableBoundary";
  parentStepId: string | number;
}
/** Non-branching, non-deferred */
export interface GrafastPlanBucketReasonListItemJSONv1 {
  type: "listItem";
  parentStepId: string | number;

  /** If this listItem is to be streamed, the configuration for that streaming */
  stream?: {
    initialCountStepId?: number;
    ifStepId?: number;
    labelStepId?: number;
  };
}
/** Non-branching, deferred */
export interface GrafastPlanBucketReasonSubscriptionJSONv1 {
  type: "subscription";
}
/** Non-branching, deferred */
export interface GrafastPlanBucketReasonMutationFieldJSONv1 {
  type: "mutationField";
  mutationIndex: number;
}
/** Non-branching, deferred */
export interface GrafastPlanBucketReasonDeferJSONv1 {
  type: "defer";
  label?: string;
}
/** Non-branching, non-deferred */
export interface GrafastPlanBucketReasonPolymorphicJSONv1 {
  type: "polymorphic";
  typeNames: readonly string[];
  parentStepId: string | number;
  polymorphicPaths: ReadonlyArray<string>;
}
/** Branching, non-deferred */
export interface GrafastPlanBucketReasonPolymorphicPartitionJSONv1 {
  type: "polymorphicPartition";
  typeNames: readonly string[];
  polymorphicPaths: ReadonlyArray<string>;
}
/** Non-branching, non-deferred */
export interface GrafastPlanBucketReasonSubroutineJSONv1 {
  type: "subroutine";
  parentStepId: string | number;
}
/** Anti-branching, non-deferred */
export interface GrafastPlanBucketReasonCombinedJSONv1 {
  type: "combined";
  parentLayerPlanIds: ReadonlyArray<string | number>;
  combinations: ReadonlyArray<{
    sources: readonly {
      layerPlanId: string | number;
      stepId: string | number;
    }[];
    targetStepId: number;
  }>;
}

export interface GrafastPlanBucketJSONv1 {
  id: number;
  reason: GrafastPlanBucketReasonJSONv1;
  parentSideEffectStepId: string | number | null;
  copyStepIds: ReadonlyArray<string | number>;
  steps: ReadonlyArray<GrafastPlanStepJSONv1>;
  rootStepId: string | number | null;
  phases: ReadonlyArray<GrafastPlanBucketPhaseJSONv1>;
  childIds: ReadonlyArray<number>;
}

export interface GrafastPlanJSONv1 extends GrafastPlanJSON {
  version: "v1";
  buckets: ReadonlyArray<GrafastPlanBucketJSONv1>;
}

export type JSONValue =
  | boolean
  | number
  | string
  | null
  | JSONObject
  | JSONArray;
export interface JSONObject {
  [key: string]: JSONValue;
}
export interface JSONArray extends Array<JSONValue> {}
