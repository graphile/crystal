import type {
  GraphQLArgumentConfig,
  GraphQLEnumType,
  GraphQLFieldConfig,
  GraphQLInputType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLOutputType,
  GraphQLScalarType,
} from "graphql";

import type { Deferred } from "./deferred";
import type { Plan } from "./plan";
import type { __TrackedObjectPlan, ListCapablePlan } from "./plans";
import type { UniqueId } from "./utils";

export const $$crystalContext = Symbol("context");
export const $$data = Symbol("data");
export const $$id = Symbol("id");
export const $$indexes = Symbol("indexes");
export const $$pathIdentity = Symbol("pathIdentity");
export const $$crystalObjectByPathIdentity = Symbol(
  "crystalObjectByPathIdentity",
);
export const $$indexesByPathIdentity = Symbol("indexesByPathIdentity");

export interface CrystalObject<TData> {
  [$$id]: UniqueId;
  [$$pathIdentity]: string;
  [$$indexes]: ReadonlyArray<number>;
  [$$crystalContext]: CrystalContext;
  [$$crystalObjectByPathIdentity]: {
    [pathIdentity: string]: CrystalObject<any> | undefined;
  };
  [$$indexesByPathIdentity]: {
    [pathIdentity: string]: ReadonlyArray<number> | undefined;
  };
  [$$data]: TData;
}

export interface Batch {
  pathIdentity: string;
  crystalContext: CrystalContext;
  plan: Plan;
  entries: Array<[CrystalObject<any>, Deferred<any>]>;
}

export interface CrystalContext {
  /**
   * This is the plan result cache. Plans can be executed more than once due to
   * parts of the tree being delayed (possibly due to @stream/@defer, possibly
   * just due to the resolvers for one "layer" not all completing at the same
   * time), so we cannot rely on writing the results all at once.
   *
   * The cache consists of multiple layers:
   *
   * - First is the plan ID; note that a plan is always created within the
   *   context of a specific field within a specific operation, so it has an
   *   inherent path identity.
   * - Next is the crystal object that represents the parent field instance (if
   *   the parent field was part of a list then each value within this list will
   *   have a different, unique, crystal object).
   * - Finally we have the plan result data. Note that this could be anything.
   *
   */
  resultByCrystalObjectByPlanId: Map<number, Map<CrystalObject<any>, any>>;

  metaByPlanId: {
    [planId: number]: object | undefined;
  };

  rootId: UniqueId;

  rootCrystalObject: CrystalObject<any>;
}

// These values are just to make reading the code a little clearer
export type CrystalValuesList<T> = ReadonlyArray<T>;
export type CrystalResultsList<T> = ReadonlyArray<T>;
export type PromiseOrDirect<T> = Promise<T> | T;

export type BaseGraphQLRootValue = any;
export interface BaseGraphQLContext {}
export interface BaseGraphQLVariables {
  [key: string]: unknown;
}
export interface BaseGraphQLArguments {
  [key: string]: any;
}
export type BaseGraphQLInputObject = BaseGraphQLArguments;

/**
 * Plan resolvers are like regular resolvers except they're called beforehand,
 * they return plans rather than values, and they only run once for lists
 * rather than for each item in the list.
 *
 * The idea is that the plan resolver returns a plan object which later will
 * process the data and feed that into the actual resolver functions
 * (preferably using the default resolver function?).
 *
 * They are stored onto `<field>.extensions.graphile.plan`
 *
 * @returns a plan for this field.
 *
 * @remarks
 * We're using `TrackedObject<...>` so we can later consider caching these
 * executions.
 */
export type PlanResolver<
  TContext extends BaseGraphQLContext,
  TArgs extends BaseGraphQLArguments,
  TParentPlan extends Plan<any> | null,
  TResultPlan extends Plan<any>,
> = (
  $parentPlan: TParentPlan,
  args: __TrackedObjectPlan<TArgs>,
  context: __TrackedObjectPlan<TContext>,
) => TResultPlan;

export type InputPlanResolver<
  TContext extends BaseGraphQLContext,
  TInput extends any,
  TParentPlan extends Plan<any> | null,
  TResultPlan extends Plan<any> | null,
> = (
  $parentPlan: TParentPlan,
  $input: __TrackedObjectPlan<TInput>,
  context: __TrackedObjectPlan<TContext>,
) => TResultPlan;

type PlanForType<TType extends GraphQLOutputType> = TType extends GraphQLList<
  infer U
>
  ? U extends GraphQLOutputType
    ? ListCapablePlan<PlanForType<U>>
    : never
  : TType extends GraphQLNonNull<infer V>
  ? V extends GraphQLOutputType
    ? PlanForType<V>
    : never
  : TType extends GraphQLScalarType | GraphQLEnumType
  ? Plan<boolean | number | string>
  : Plan<{ [key: string]: any }>;

/* Disabled due to TypeScript "Type instantiation is excessively deep and
 * possibly infinite".

type InputPlanForType<TType extends GraphQLInputType> =
  TType extends GraphQLList<infer U>
    ? U extends GraphQLInputType
      ? InputPlanForType<U>
      : never
    : TType extends GraphQLNonNull<infer V>
    ? V extends GraphQLInputType
      ? InputPlanForType<V>
      : never
    : TType extends GraphQLScalarType | GraphQLEnumType
    ? null
    : Plan<{ [key: string]: any }> | null;

type InputTypeFor<TType extends GraphQLInputType> = TType extends GraphQLList<
  infer U
>
  ? U extends GraphQLInputType
    ? InputTypeFor<U>
    : never
  : TType extends GraphQLNonNull<infer V>
  ? V extends GraphQLInputType
    ? InputTypeFor<V>
    : never
  : TType extends GraphQLInt | GraphQLFloat
  ? number
  : TType extends GraphQLString | GraphQLID
  ? string
  : any;
*/

/**
 * Basically GraphQLFieldConfig but with an easy to access `plan` method.
 */
export type GraphileCrystalFieldConfig<
  TType extends GraphQLOutputType,
  TContext extends BaseGraphQLContext,
  TParentPlan extends Plan<any> | null,
  TResultPlan extends Plan<any>, // PlanForType<TType>,
  TArgs extends BaseGraphQLArguments,
> = Omit<GraphQLFieldConfig<any, any>, "args" | "type"> & {
  type: TType;
  plan?: PlanResolver<TContext, TArgs, TParentPlan, TResultPlan>;
  args?: {
    [key: string]: GraphileCrystalArgumentConfig<
      GraphQLInputType,
      TContext,
      TResultPlan,
      any,
      any
    >;
  };
};

export type GraphileCrystalArgumentConfig<
  TInputType extends GraphQLInputType,
  TContext extends BaseGraphQLContext,
  TParentPlan extends Plan<any>,
  TResultPlan extends Plan<any> | null, // InputPlanForType<TInputType>
  TInput extends any, // InputTypeFor<TInputType>,
> = Omit<GraphQLArgumentConfig, "type"> & {
  type: TInputType;
  plan?: InputPlanResolver<TContext, TInput, TParentPlan, TResultPlan>;
};
