import type EventEmitter from "events";
import type {
  FieldNode,
  GraphQLArgument,
  GraphQLArgumentConfig,
  GraphQLField,
  GraphQLFieldConfig,
  GraphQLInputField,
  GraphQLInputFieldConfig,
  GraphQLInputObjectType,
  GraphQLInputType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLOutputType,
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLType,
  SelectionNode,
} from "graphql";

import type { Aether } from "./aether.js";
import type { Deferred } from "./deferred.js";
import type { CrystalError } from "./error.js";
import type { InputStep } from "./input.js";
import type { ExecutableStep, ListCapableStep, ModifierStep } from "./plan.js";
import type { PlanResults, PlanResultsBucket } from "./planResults.js";
import type { __InputDynamicScalarStep } from "./steps/__inputDynamicScalar.js";
import type {
  __InputListStep,
  __InputObjectStep,
  __InputStaticLeafStep,
  __TrackedObjectStep,
} from "./steps/index.js";
import type { GraphileInputObjectType, GraphileObjectType } from "./utils.js";

export interface DataPlannerFieldExtensions {
  plan?: FieldPlanResolver<any, any, any>;
  subscribePlan?: FieldPlanResolver<any, any, any>;
}

export interface DataPlannerArgumentExtensions {
  // fooPlan?: ArgumentPlanResolver<any, any, any, any, any>;
  inputPlan?: ArgumentInputPlanResolver;
  applyPlan?: ArgumentApplyPlanResolver;
}

export interface DataPlannerInputObjectTypeExtensions {
  inputPlan?: InputObjectTypeInputPlanResolver;
}

export interface DataPlannerInputFieldExtensions {
  // fooPlan?: InputObjectFieldPlanResolver<any, any, any, any>;
  inputPlan?: InputObjectFieldInputPlanResolver;
  applyPlan?: InputObjectFieldApplyPlanResolver;
}

export interface DataPlannerObjectTypeExtensions {
  Step?: { new (...args: any[]): ExecutableStep };
}

export interface DataPlannerEnumTypeExtensions {}

export interface DataPlannerEnumValueExtensions {
  /**
   * EXPERIMENTAL!
   *
   * @internal
   */
  applyPlan?: EnumValueApplyPlanResolver<any>;
}

export interface DataPlannerScalarTypeExtensions {
  plan?: ScalarPlanResolver;
  inputPlan?: ScalarInputPlanResolver;
  /**
   * Set true if `serialize(serialize(foo)) === serialize(foo)` for all foo
   */
  idempotent?: boolean;
}

// TODO: change 'graphile' to 'dataplanner'

/*
 * We register certain things (plans, etc) into the GraphQL "extensions"
 * property on the various GraphQL configs (type, field, argument, etc); this
 * uses declaration merging so that these can be accessed with types.
 */
declare module "graphql" {
  interface GraphQLFieldExtensions<_TSource, _TContext, _TArgs = any> {
    graphile?: DataPlannerFieldExtensions;
  }

  interface GraphQLArgumentExtensions {
    graphile?: DataPlannerArgumentExtensions;
  }

  interface GraphQLInputObjectTypeExtensions {
    graphile?: DataPlannerInputObjectTypeExtensions;
  }

  interface GraphQLInputFieldExtensions {
    graphile?: DataPlannerInputFieldExtensions;
  }

  interface GraphQLObjectTypeExtensions<_TSource = any, _TContext = any> {
    graphile?: DataPlannerObjectTypeExtensions;
  }

  interface GraphQLEnumTypeExtensions {
    graphile?: DataPlannerEnumTypeExtensions;
  }

  interface GraphQLEnumValueExtensions {
    graphile?: DataPlannerEnumValueExtensions;
  }

  interface GraphQLScalarTypeExtensions {
    graphile?: DataPlannerScalarTypeExtensions;
  }
}

export const $$crystalContext = Symbol("context");
export const $$planResults = Symbol("planResults");
export const $$id = Symbol("id");
/** Return the value verbatim, don't execute */
export const $$verbatim = Symbol("verbatim");
/**
 * If we're sure the data is the right shape and valid, we can set this key and
 * it can be returned directly
 */
export const $$bypassGraphQL = Symbol("bypassGraphQL");
export const $$data = Symbol("data");
export const $$pathIdentity = Symbol("pathIdentity");
/**
 * For attaching additional metadata to the GraphQL execution result, for
 * example details of the plan or SQL queries or similar that were executed.
 */
export const $$extensions = Symbol("extensions");

/**
 * The "GraphQLObjectType" type name, useful when dealing with polymorphism.
 */
export const $$concreteType = Symbol("concreteType");

/**
 * Set this key on a type if that type's serialization is idempotent (that is
 * to say `serialize(serialize(thing)) === serialize(thing)`). This means we
 * don't have to "roll-back" serialization if we need to fallback to graphql-js
 * execution.
 */
export const $$idempotent = Symbol("idempotent");

/**
 * The event emitter used for outputting execution events.
 */
export const $$eventEmitter = Symbol("executionEventEmitter");

// TODO: remove <TData>
/**
 * When dealing with a polymorphic thing we need to be able to determine what
 * the concrete type of it is, we use the $$concreteType property for that.
 */
export interface PolymorphicData<TType extends string = string, _TData = any> {
  [$$concreteType]: TType;
}

export interface IndexByListItemPlanId {
  [listItemPlanId: string]: number;
}

/**
 * This is part of execution-v1 which is deprecated; we're moving to execution
 * v2 which uses buckets instead of crystal objects and has a significantly
 * reduced garbage collection cost.
 */
export interface CrystalObject {
  toString(): string;
  [$$data]: {
    [fieldAlias: string]: any;
  };
  [$$pathIdentity]: string;
  [$$concreteType]: string;
  [$$crystalContext]: CrystalContext;

  /**
   * This is the plan result cache accessible from this CrystalObject - it
   * should contain all the previously executed plans that plans below this
   * CrystalObject in the operation depend on. See `PlanResults` for more
   * information on the specifics of how the plan results are stored/accessed.
   *
   * When evaluating a particular CrystalObject you can be certain that all the
   * list indexes have already been factored into the cache, so you just need
   * to supply a plan's `commonAncestorPathIdentity` and `id` to read/write the
   * data.
   *
   * When a new level of CrystalObject is created it will inherit a _copy_ of
   * $$planResults from its parent - that way any shared `pathIdentity`
   * "buckets" will share changes between them (since the values are references
   * to the same objects), but any new pathIdentities will diverge - again, see
   * `PlanResults` for more information on this.
   *
   * Plans can be executed more than once due to parts of the tree being
   * delayed (possibly due to `@stream`/`@defer`, possibly just due to the
   * resolvers for one "layer" not all completing at the same time), so we
   * cannot rely on writing the results all at once.
   */
  [$$planResults]: PlanResults;
}

/** Execution-v1 batching; soon to be replaced. */
export interface Batch {
  pathIdentity: string;
  crystalContext: CrystalContext;
  sideEffectPlans: ReadonlyArray<ExecutableStep>;
  plan: ExecutableStep;
  itemPlan: ExecutableStep;
  entries: Array<[CrystalObject, Deferred<any>]>;
}

/**
 * Details about a specific batch being executed. Execution-v1; soon to be
 * replaced.
 */
export interface CrystalContext {
  aether: Aether;

  metaByPlanId: {
    [planId: string]: Record<string, unknown> | undefined;
  };

  inProgressPlanResolutions: {
    [planId: string]: Map<PlanResultsBucket, Deferred<any>>;
  };

  rootCrystalObject: CrystalObject;

  eventEmitter: ExecutionEventEmitter | undefined;
}

// These values are just to make reading the code a little clearer
export type CrystalValuesList<T> = ReadonlyArray<T>;
export type PromiseOrDirect<T> = PromiseLike<T> | T;
export type CrystalResultsList<T> = ReadonlyArray<PromiseOrDirect<T>>;
export type CrystalResultStreamList<T> = ReadonlyArray<
  AsyncIterable<PromiseOrDirect<T>> | CrystalError
>;

export type BaseGraphQLRootValue = any;
export interface BaseGraphQLContext {}
export interface BaseGraphQLVariables {
  [key: string]: unknown;
}
export interface BaseGraphQLArguments {
  [key: string]: any;
}
export type BaseGraphQLInputObject = BaseGraphQLArguments;

// TODO: rename
export interface FieldArgs {
  get(path?: string | string[]): ExecutableStep;
  getRaw(path?: string | string[]): InputStep;
  apply($target: ExecutableStep | ModifierStep, path?: string | string[]): void;
}

/**
 * Step resolvers are like regular resolvers except they're called beforehand,
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
export type FieldPlanResolver<
  _TArgs extends BaseGraphQLArguments,
  TParentStep extends ExecutableStep<any> | null,
  TResultStep extends ExecutableStep<any>,
> = (
  $parentPlan: TParentStep,
  args: FieldArgs,
  info: {
    field: GraphQLField<any, any, any>;
    schema: GraphQLSchema;
  },
) => TResultStep;

// TODO: review _TContext
/**
 * Fields on input objects can have plans; the plan resolver is passed a parent plan
 * (from an argument, or from a parent input object) or null if none, and an
 * input plan that represents the value the user will pass to this field. The
 * resolver must return either a ModifierStep or null.
 */
export type InputObjectFieldInputPlanResolver<
  TResultStep extends ExecutableStep<any> = ExecutableStep<any>,
> = (
  input: FieldArgs,
  info: {
    schema: GraphQLSchema;
    entity: GraphQLInputField;
  },
) => TResultStep;

export type InputObjectFieldApplyPlanResolver<
  TFieldStep extends ExecutableStep<any> | ModifierStep<any> =
    | ExecutableStep<any>
    | ModifierStep<any>,
  TResultStep extends ModifierStep<
    ExecutableStep<any> | ModifierStep<any>
  > | null | void = ModifierStep<
    ExecutableStep<any> | ModifierStep<any>
  > | null | void,
> = (
  $fieldPlan: TFieldStep,
  input: FieldArgs,
  info: {
    schema: GraphQLSchema;
    entity: GraphQLInputField;
  },
) => TResultStep;

export type InputObjectTypeInputPlanResolver = (
  input: FieldArgs,
  info: {
    schema: GraphQLSchema;
    type: GraphQLInputObjectType;
  },
) => ExecutableStep;

// TODO: review _TContext
/**
 * Arguments can have plans; the plan resolver is passed the parent plan (the
 * plan that represents the _parent_ field of the field the arg is defined on),
 * the field plan (the plan that represents the field the arg is defined on)
 * and an input plan that represents the value the user will pass to this
 * argument. The resolver must return either a ModifierStep or null.
 */
export type ArgumentInputPlanResolver<
  TParentStep extends ExecutableStep<any> = ExecutableStep<any>,
  TResultStep extends ExecutableStep<any> = ExecutableStep<any>,
> = (
  $parentPlan: TParentStep,
  input: FieldArgs,
  info: {
    schema: GraphQLSchema;
    entity: GraphQLArgument;
  },
) => TResultStep;

export type ArgumentApplyPlanResolver<
  TParentStep extends ExecutableStep<any> = ExecutableStep<any>,
  TFieldStep extends ExecutableStep<any> | ModifierStep<any> =
    | ExecutableStep<any>
    | ModifierStep<any>,
  TResultStep extends
    | ExecutableStep
    | ModifierStep<ExecutableStep | ModifierStep>
    | null
    | void =
    | ExecutableStep
    | ModifierStep<ExecutableStep | ModifierStep>
    | null
    | void,
> = (
  $parentPlan: TParentStep,
  $fieldPlan: TFieldStep,
  input: FieldArgs,
  info: {
    schema: GraphQLSchema;
    entity: GraphQLArgument;
  },
) => TResultStep;

/**
 * GraphQLScalarTypes can have plans, these are passed the field plan and must
 * return an executable plan.
 */
export type ScalarPlanResolver<
  TParentStep extends ExecutableStep<any> = ExecutableStep<any>,
  TResultStep extends ExecutableStep<any> = ExecutableStep<any>,
> = ($parentPlan: TParentStep, info: { schema: GraphQLSchema }) => TResultStep;

/**
 * GraphQLScalarTypes can have plans, these are passed the field plan and must
 * return an executable plan.
 */
export type ScalarInputPlanResolver<
  TResultStep extends ExecutableStep<any> = ExecutableStep<any>,
> = (
  $inputValue: InputStep,
  /*
    | __InputListStep
    | __InputStaticLeafStep
    | __InputDynamicScalarStep,
  */
  info: { schema: GraphQLSchema; type: GraphQLScalarType },
) => TResultStep;

/**
 * EXPERIMENTAL!
 *
 * NOTE: this is an `any` because we want to allow users to specify
 * subclasses of ExecutableStep but TypeScript only wants to allow
 * superclasses.
 *
 * @internal
 */
export type EnumValueApplyPlanResolver<
  TParentStep extends ExecutableStep | ModifierStep =
    | ExecutableStep
    | ModifierStep,
> = ($parent: TParentStep) => ModifierStep | void;

// TypeScript gets upset if we go too deep, so we try and cover the most common
// use cases and fall back to `any`
type OutputPlanForNamedType<TType extends GraphQLType> =
  TType extends GraphileObjectType<any, infer TStep, any>
    ? TStep
    : ExecutableStep<any>;

// TODO: this is completely wrong now; ListCapableStep is no longer required to be supported for lists.
export type OutputPlanForType<TType extends GraphQLOutputType> =
  TType extends GraphQLNonNull<GraphQLList<GraphQLNonNull<infer U>>>
    ? ListCapableStep<any, OutputPlanForNamedType<U>>
    : TType extends GraphQLNonNull<GraphQLList<infer U>>
    ? ListCapableStep<any, OutputPlanForNamedType<U>>
    : TType extends GraphQLList<GraphQLNonNull<infer U>>
    ? ListCapableStep<any, OutputPlanForNamedType<U>>
    : TType extends GraphQLList<infer U>
    ? ListCapableStep<any, OutputPlanForNamedType<U>>
    : TType extends GraphQLNonNull<infer U>
    ? OutputPlanForNamedType<U>
    : OutputPlanForNamedType<TType>;

// TypeScript gets upset if we go too deep, so we try and cover the most common
// use cases and fall back to `any`
type InputPlanForNamedType<TType extends GraphQLType> =
  TType extends GraphileInputObjectType<any, infer U, any>
    ? U
    : ModifierStep<any>;
type InputPlanForType<TType extends GraphQLInputType> =
  TType extends GraphQLNonNull<GraphQLList<GraphQLNonNull<infer U>>>
    ? InputPlanForNamedType<U>
    : TType extends GraphQLNonNull<GraphQLList<infer U>>
    ? InputPlanForNamedType<U>
    : TType extends GraphQLList<GraphQLNonNull<infer U>>
    ? InputPlanForNamedType<U>
    : TType extends GraphQLList<infer U>
    ? InputPlanForNamedType<U>
    : TType extends GraphQLNonNull<infer U>
    ? InputPlanForNamedType<U>
    : InputPlanForNamedType<TType>;

// TypeScript gets upset if we go too deep, so we try and cover the most common
// use cases and fall back to `any`
type InputTypeForNamedType<TType extends GraphQLType> =
  TType extends GraphQLScalarType<infer U> ? U : any;
type InputTypeFor<TType extends GraphQLInputType> =
  TType extends GraphQLNonNull<GraphQLList<GraphQLNonNull<infer U>>>
    ? InputTypeForNamedType<U>
    : TType extends GraphQLNonNull<GraphQLList<infer U>>
    ? InputTypeForNamedType<U>
    : TType extends GraphQLList<GraphQLNonNull<infer U>>
    ? InputTypeForNamedType<U>
    : TType extends GraphQLList<infer U>
    ? InputTypeForNamedType<U>
    : TType extends GraphQLNonNull<infer U>
    ? InputTypeForNamedType<U>
    : InputTypeForNamedType<TType>;

/*
type OutputPlanForType<TType extends GraphQLOutputType> =
  TType extends GraphQLList<
  infer U
>
  ? U extends GraphQLOutputType
    ? ListCapableStep<any, OutputPlanForType<U>>
    : never
  : TType extends GraphQLNonNull<infer V>
  ? V extends GraphQLOutputType
    ? OutputPlanForType<V>
    : never
  : TType extends GraphQLScalarType | GraphQLEnumType
  ? ExecutableStep<boolean | number | string>
  : ExecutableStep<{ [key: string]: any }>;

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
    : ExecutableStep<{ [key: string]: any }> | null;

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
  : TType extends GraphQLScalarType<infer U>
  ? U
  : any;
  */

/**
 * Basically GraphQLFieldConfig but with an easy to access `plan` method.
 */
export type GraphileFieldConfig<
  TType extends GraphQLOutputType,
  TContext extends BaseGraphQLContext,
  TParentStep extends ExecutableStep<any> | null,
  TFieldStep extends ExecutableStep<any>, // TODO: should be OutputPlanForType<TType>, but that results in everything thinking it should be a ListStep
  TArgs extends BaseGraphQLArguments,
> = Omit<GraphQLFieldConfig<any, any>, "args" | "type"> & {
  type: TType;
  plan?: FieldPlanResolver<TArgs, TParentStep, TFieldStep>;
  subscribePlan?: FieldPlanResolver<TArgs, TParentStep, TFieldStep>;
  args?: GraphileFieldConfigArgumentMap<
    TType,
    TContext,
    TParentStep,
    TFieldStep
  >;
};

/**
 * Basically GraphQLFieldConfigArgumentMap but allowing for args to have plans.
 */
export type GraphileFieldConfigArgumentMap<
  _TType extends GraphQLOutputType,
  TContext extends BaseGraphQLContext,
  TParentStep extends ExecutableStep<any> | null,
  TFieldStep extends ExecutableStep<any>, // TODO: should be OutputPlanForType<_TType>, but that results in everything thinking it should be a ListStep
> = {
  [argName: string]: GraphileArgumentConfig<
    any,
    TContext,
    TParentStep,
    TFieldStep,
    any,
    any
  >;
};

/**
 * Basically GraphQLArgumentConfig but allowing for a plan.
 */
export type GraphileArgumentConfig<
  TInputType extends GraphQLInputType,
  _TContext extends BaseGraphQLContext,
  _TParentStep extends ExecutableStep<any> | null,
  TFieldStep extends ExecutableStep<any>,
  _TArgumentStep extends TFieldStep extends ExecutableStep<any>
    ? ModifierStep<TFieldStep> | null
    : null,
  _TInput extends InputTypeFor<TInputType>,
> = Omit<GraphQLArgumentConfig, "type"> & {
  type: TInputType;
  inputPlan?: ArgumentInputPlanResolver<any>;
  applyPlan?: ArgumentApplyPlanResolver<any, any>;
};

/**
 * Basically GraphQLInputFieldConfig but allowing for the field to have a plan.
 */
export type GraphileInputFieldConfig<
  TInputType extends GraphQLInputType,
  _TContext extends BaseGraphQLContext,
  _TParentStep extends ModifierStep<any>,
  _TResultStep extends InputPlanForType<TInputType>,
  _TInput extends InputTypeFor<TInputType>,
> = Omit<GraphQLInputFieldConfig, "type"> & {
  type: TInputType;
  inputPlan?: InputObjectFieldInputPlanResolver;
  applyPlan?: InputObjectFieldApplyPlanResolver<any>;
};

/**
 * The args passed to a field plan resolver, the values are plans.
 */
export type TrackedArguments<
  TArgs extends BaseGraphQLArguments = BaseGraphQLArguments,
> = {
  get<TKey extends keyof TArgs>(key: TKey): InputStep;
};

/**
 * Represents the selections that happen within a particular group within a
 * particular point in the GraphQL document.
 */
export interface GroupedSelections {
  groupId: number;
  selections: ReadonlyArray<SelectionNode>;
}

/**
 * Represents an individual field and it's group.
 */
export interface FieldAndGroup {
  groupId: number;
  field: FieldNode;
}

/**
 * `@stream` directive meta.
 */
export interface PlanStreamOptions {
  initialCount: number;
}
/**
 * Additional details about the planning for a field; currently only relates to
 * the `@stream` directive.
 */
export interface PlanOptions {
  /**
   * Details for the `@stream` directive.
   */
  stream: PlanStreamOptions | null;
}

/**
 * Options passed to the `optimize` method of a plan to give more context.
 */
export interface PlanOptimizeOptions {
  stream: PlanStreamOptions | null;
}

/**
 * A subscriber provides realtime data, a SubscribeStep can subscribe to a
 * given topic (string) and will receive an AsyncIterableIterator with messages
 * published to that topic (standard pub/sub semantics).
 */
export type CrystalSubscriber<
  TTopics extends { [key: string]: any } = { [key: string]: any },
> = {
  subscribe<TTopic extends keyof TTopics = keyof TTopics>(
    topic: TTopic,
  ): AsyncIterableIterator<TTopics[TTopic]>;
};

/**
 * Specifically relates to the stringification of NodeIDs, e.g. `["User", 1]`
 * to/from `WyJVc2VyIiwgMV0=`
 */
export interface NodeIdCodec<T = any> {
  encode(value: T): string | null;
  decode(value: string): T;
}

/**
 * Determines if a NodeID relates to a given object type, and also relates to
 * encoding the NodeID for that type.
 */
export type NodeIdHandler<
  TCodecs extends { [key: string]: NodeIdCodec<any> } = {
    [key: string]: NodeIdCodec<any>;
  },
  TCodecName extends keyof TCodecs = keyof TCodecs,
  TNodeStep extends ExecutableStep<any> = ExecutableStep<any>,
> = {
  /**
   * Which codec are we using to encode/decode the NodeID string?
   */
  codecName: TCodecName & string;

  /**
   * Returns true if the given decoded Node ID value represents this type.
   */
  match(
    specifier: TCodecs[TCodecName] extends NodeIdCodec<infer U> ? U : any,
  ): boolean;

  /**
   * Returns a plan that returns the value ready to be encoded. When the result
   * of this plan is fed into `match`, it should return `true`.
   */
  plan(
    $thing: TNodeStep,
  ): ExecutableStep<TCodecs[TCodecName] extends NodeIdCodec<infer U> ? U : any>;

  /**
   * The recprocal of `plan`, given the return value of plan, this should
   * return a plan that results in the original node.
   */
  get(
    plan: ExecutableStep<
      TCodecs[TCodecName] extends NodeIdCodec<infer U> ? U : any
    >,
  ): TNodeStep;
};

export type BaseEventMap = Record<string, any>;
export type EventMapKey<TEventMap extends BaseEventMap> = string &
  keyof TEventMap;
export type EventCallback<TPayload> = (params: TPayload) => void;

export interface TypedEventEmitter<TEventMap extends BaseEventMap>
  extends EventEmitter {
  addListener<TEventName extends EventMapKey<TEventMap>>(
    eventName: TEventName,
    callback: EventCallback<TEventMap[TEventName]>,
  ): this;
  on<TEventName extends EventMapKey<TEventMap>>(
    eventName: TEventName,
    callback: EventCallback<TEventMap[TEventName]>,
  ): this;
  once<TEventName extends EventMapKey<TEventMap>>(
    eventName: TEventName,
    callback: EventCallback<TEventMap[TEventName]>,
  ): this;

  removeListener<TEventName extends EventMapKey<TEventMap>>(
    eventName: TEventName,
    callback: EventCallback<TEventMap[TEventName]>,
  ): this;
  off<TEventName extends EventMapKey<TEventMap>>(
    eventName: TEventName,
    callback: EventCallback<TEventMap[TEventName]>,
  ): this;

  emit<TEventName extends EventMapKey<TEventMap>>(
    eventName: TEventName,
    params: TEventMap[TEventName],
  ): boolean;
}

export type ExecutionEventMap = {
  /**
   * Something that can be added to the
   * ExecutionResult.extensions.explain.operations list.
   */
  explainOperation: {
    operation: Record<string, any> & { type: string; title: string };
  };
};

export type ExecutionEventEmitter = TypedEventEmitter<ExecutionEventMap>;

// TODO: rename this?
export interface ExecutionExtra {
  meta: Record<string, unknown>;
  eventEmitter: ExecutionEventEmitter | undefined;
}
