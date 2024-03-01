export interface GrafastPlanJSON {
  version: "v1" | "v2";
}

export interface GrafastPlanStepJSONv1 {
  id: string | number;
  stepClass: string;
  metaString: string | null;
  isUnary: boolean;
  bucketId: string | number;
  dependencyIds: ReadonlyArray<string | number>;
  polymorphicPaths: readonly string[] | undefined;
  isSyncAndSafe: boolean | undefined;
  supportsUnbatched: boolean | undefined;
  hasSideEffects: boolean | undefined;
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
    initialCount: number;
    label?: string;
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
/** Branching, non-deferred */
export interface GrafastPlanBucketReasonPolymorphicJSONv1 {
  type: "polymorphic";
  typeNames: readonly string[];
  parentStepId: string | number;
  polymorphicPaths: ReadonlyArray<string>;
}
/** Non-branching, non-deferred */
export interface GrafastPlanBucketReasonSubroutineJSONv1 {
  type: "subroutine";
  parentStepId: string | number;
}

export interface GrafastPlanBucketJSONv1 {
  id: number;
  reason: GrafastPlanBucketReasonJSONv1;
  copyStepIds: ReadonlyArray<string | number>;
  steps: ReadonlyArray<GrafastPlanStepJSONv1>;
  rootStepId: string | number | null;
  phases: ReadonlyArray<GrafastPlanBucketPhaseJSONv1>;
  children: ReadonlyArray<GrafastPlanBucketJSONv1>;
}

export interface GrafastPlanJSONv1 extends GrafastPlanJSON {
  version: "v1";
  rootBucket: GrafastPlanBucketJSONv1;
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
