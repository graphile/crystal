import type {
  GraphQLArgumentConfig,
  GraphQLEnumType,
  GraphQLFieldConfig,
  GraphQLInputFieldConfig,
  GraphQLInputType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLOutputType,
  GraphQLScalarType,
} from "graphql";

import type { Deferred } from "./deferred";
import type { InputPlan } from "./input";
import type { ExecutablePlan, ModifierPlan } from "./plan";
import type { __TrackedObjectPlan, ListCapablePlan } from "./plans";
import type { UniqueId } from "./utils";

declare module "graphql" {
  interface GraphQLFieldExtensions<
    TSource,
    TContext,
    TArgs = { [argName: string]: any },
  > {
    graphile?: {
      plan?: ExecutablePlanResolver<any, any, any, any>;
      subscribePlan?: ExecutablePlanResolver<any, any, any, any>;
    };
  }

  interface GraphQLArgumentExtensions {
    graphile?: {
      plan?: ArgumentPlanResolver<any, any, any, any, any>;
    };
  }

  interface GraphQLInputFieldExtensions {
    graphile?: {
      plan?: InputObjectFieldPlanResolver<any, any, any, any>;
    };
  }
}

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
  plan: ExecutablePlan;
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
    [planId: number]: Record<string, unknown> | undefined;
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

// TODO: rename ExecutablePlanResolver to FieldPlanResolver?
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
export type ExecutablePlanResolver<
  TContext extends BaseGraphQLContext,
  TArgs extends BaseGraphQLArguments,
  TParentPlan extends ExecutablePlan<any> | null,
  TResultPlan extends ExecutablePlan<any>,
> = (
  $parentPlan: TParentPlan,
  args: TrackedArguments<TArgs>,
  context: __TrackedObjectPlan<TContext>,
) => TResultPlan;

export type InputObjectFieldPlanResolver<
  TContext extends BaseGraphQLContext,
  TInput extends InputPlan,
  TParentPlan extends ModifierPlan<any> | null,
  TResultPlan extends ModifierPlan<
    ExecutablePlan<any> | ModifierPlan<any>
  > | null,
> = (
  $parentPlan: TParentPlan,
  $input: TInput,
  context: __TrackedObjectPlan<TContext>,
) => TResultPlan;

export type ArgumentPlanResolver<
  TContext extends BaseGraphQLContext,
  TInput extends InputPlan,
  TParentPlan extends ExecutablePlan<any> | null,
  TFieldPlan extends ExecutablePlan<any> | null,
  TResultPlan extends ModifierPlan<
    ExecutablePlan<any> | ModifierPlan<any>
  > | null,
> = (
  $parentPlan: TParentPlan,
  $fieldPlan: TFieldPlan,
  $input: TInput,
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
  ? ExecutablePlan<boolean | number | string>
  : ExecutablePlan<{ [key: string]: any }>;

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
    : ExecutablePlan<{ [key: string]: any }> | null;

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
  TParentPlan extends ExecutablePlan<any> | null,
  TFieldPlan extends ExecutablePlan<any>, // PlanForType<TType>,
  TArgs extends BaseGraphQLArguments,
> = Omit<GraphQLFieldConfig<any, any>, "args" | "type"> & {
  type: TType;
  plan?: ExecutablePlanResolver<TContext, TArgs, TParentPlan, TFieldPlan>;
  args?: {
    [key: string]: GraphileCrystalArgumentConfig<
      GraphQLInputType,
      TContext,
      TParentPlan,
      TFieldPlan,
      any,
      any
    >;
  };
};

export type GraphileCrystalArgumentConfig<
  TInputType extends GraphQLInputType,
  TContext extends BaseGraphQLContext,
  TParentPlan extends ExecutablePlan<any> | null,
  TFieldPlan extends ExecutablePlan<TParentPlan> | null,
  TArgumentPlan extends TFieldPlan extends ExecutablePlan<any>
    ? ModifierPlan<TFieldPlan> | null
    : null,
  TInput extends InputPlan, // InputTypeFor<TInputType>,
> = Omit<GraphQLArgumentConfig, "type"> & {
  type: TInputType;
  plan?: TParentPlan extends ExecutablePlan<any>
    ? ArgumentPlanResolver<
        TContext,
        TInput,
        TParentPlan,
        TFieldPlan,
        TArgumentPlan
      >
    : never;
};

export type GraphileCrystalInputFieldConfig<
  TInputType extends GraphQLInputType,
  TContext extends BaseGraphQLContext,
  TParentPlan extends ModifierPlan<any>,
  TResultPlan extends ModifierPlan<TParentPlan> | null, // InputPlanForType<TInputType>
  TInput extends InputPlan, // InputTypeFor<TInputType>,
> = Omit<GraphQLInputFieldConfig, "type"> & {
  type: TInputType;
  plan?: InputObjectFieldPlanResolver<
    TContext,
    TInput,
    TParentPlan,
    TResultPlan
  >;
};

export type TrackedArguments<
  TArgs extends BaseGraphQLArguments = BaseGraphQLArguments,
> = {
  [key in keyof TArgs]: InputPlan;
};
