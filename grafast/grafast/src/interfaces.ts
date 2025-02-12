import type EventEmitter from "eventemitter3";
import type { Middleware } from "graphile-config";
import type {
  ASTNode,
  ExecutionArgs,
  FragmentDefinitionNode,
  GraphQLArgs,
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
  OperationDefinitionNode,
  Source,
  ValueNode,
  VariableNode,
} from "graphql";
import type { ObjMap } from "graphql/jsutils/ObjMap.js";

import type { Bucket, RequestTools } from "./bucket.js";
import type { Constraint } from "./constraints.js";
import type { LayerPlanReasonListItemStream } from "./engine/LayerPlan.js";
import type { OperationPlan } from "./engine/OperationPlan.js";
import type { FlaggedValue, SafeError } from "./error.js";
import type { ExecutableStep, ListCapableStep } from "./step.js";
import type { __InputDynamicScalarStep } from "./steps/__inputDynamicScalar.js";
import type { ApplyableExecutableStep } from "./steps/applyInput.js";
import type {
  __InputListStep,
  __InputObjectStep,
  __InputObjectStepWithDollars,
  __InputStaticLeafStep,
  __TrackedValueStep,
  __TrackedValueStepWithDollars,
  ConstantStep,
} from "./steps/index.js";
import type { GrafastInputObjectType, GrafastObjectType } from "./utils.js";

export interface GrafastTimeouts {
  /**
   * How many milliseconds should we allow for planning. Remember: planning is
   * synchronous, so whilst it is happening the event loop is blocked.
   */
  planning?: number;

  /**
   * How many milliseconds should we allow for execution. We will only check
   * this immediately before triggering the execution of an asynchronous step,
   * and if it is exceeded it will only prevent the execution of asynchronous
   * steps, not synchronous ones.
   *
   * IMPORTANT: since we only check this _before_ an asynchronous step
   * executes, there's nothing to stop an asynchronous step from continuing to
   * execute long after the timeout has expired - therefore it's the
   * responsibility of each step to abort itself if it goes over the allocated
   * time budget (which is detailed in `ExecutionExtra.stopTime`).
   */
  execution?: number;

  // We do not currently have an "output" timeout limit; though output is
  // synchronous it's typically so fast that no timeout is required.
}

export const $$queryCache = Symbol("queryCache");

/**
 * We store the cache directly onto the GraphQLSchema so that it gets garbage
 * collected along with the schema when it's not needed any more. To do so, we
 * attach it using this symbol.
 */
export const $$cacheByOperation = Symbol("cacheByOperation");
export type Fragments = {
  [key: string]: FragmentDefinitionNode;
};
export interface IEstablishOperationPlanResult {
  variableValuesConstraints: Constraint[];
  contextConstraints: Constraint[];
  rootValueConstraints: Constraint[];
}
export interface EstablishOperationPlanResultSuccess
  extends IEstablishOperationPlanResult {
  error?: never;
  operationPlan: OperationPlan;
}
export interface EstablishOperationPlanResultError
  extends IEstablishOperationPlanResult {
  error:
    | Error
    | SafeError<
        | { [$$timeout]: number; [$$ts]: number }
        | { [$$timeout]?: undefined; [$$ts]?: undefined }
        | undefined
      >;
  operationPlan?: never;
}
export type EstablishOperationPlanResult =
  | EstablishOperationPlanResultSuccess
  | EstablishOperationPlanResultError;

/**
 * This represents the list of possible operationPlans for a specific document.
 *
 * @remarks
 *
 * It also includes the fragments for validation, but generally we trust that
 * if the OperationDefinitionNode is the same then the request is equivalent.
 */
export interface CacheByOperationEntry {
  /**
   * Implemented as a linked list so the hot operationPlans can be kept at the top of the
   * list, and if the list grows beyond a maximum size we can drop the last
   * element.
   */
  possibleOperationPlans: LinkedList<EstablishOperationPlanResult> | null;
  fragments: Fragments;
}

export interface LinkedList<T> {
  value: T;
  next: LinkedList<T> | null;
}

export const $$hooked = Symbol("hookArgsApplied");

export const $$grafastContext = Symbol("context");
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

/**
 * Used to indicate that an array has more results available via a stream.
 */
export const $$streamMore = Symbol("streamMore");

export const $$proxy = Symbol("proxy");

/**
 * If an error has this property set then it's safe to send through to the user
 * without being masked.
 */
export const $$safeError = Symbol("safeError");

/** The layerPlan used as a subroutine for this step */
export const $$subroutine = Symbol("subroutine");

/** For tracking the timeout a TimeoutError happened from */
export const $$timeout = Symbol("timeout");

/** For tracking _when_ the timeout happened (because once the JIT has warmed it might not need so long) */
export const $$ts = Symbol("timestamp");

/**
 * When dealing with a polymorphic thing we need to be able to determine what
 * the concrete type of it is, we use the $$concreteType property for that.
 */
export interface PolymorphicData<TType extends string = string, TData = any> {
  [$$concreteType]: TType;
  [$$data]?: TData;
}

export interface IndexByListItemStepId {
  [listItemStepId: number]: number;
}

// These values are just to make reading the code a little clearer
export type GrafastValuesList<TData> = ReadonlyArray<TData>;
export type PromiseOrDirect<T> = PromiseLike<T> | T;
export type ExecutionResultValue<T> =
  | T
  | FlaggedValue<Error>
  | FlaggedValue<null>;
export type GrafastResultsList<TData> = ReadonlyArray<
  PromiseOrDirect<ExecutionResultValue<TData>>
>;
export type GrafastResultStreamList<TStreamItem> = ReadonlyArray<
  | PromiseOrDirect<
      AsyncIterable<PromiseOrDirect<ExecutionResultValue<TStreamItem>>>
    >
  | PromiseLike<never>
>;
export type AwaitedExecutionResults<TData> = ReadonlyArray<
  PromiseOrDirect<
    | ExecutionResultValue<TData>
    | AsyncIterable<
        PromiseOrDirect<
          ExecutionResultValue<
            TData extends ReadonlyArray<infer UStreamItem> ? UStreamItem : never
          >
        >
      >
  >
>;
export type ExecutionResults<TData> =
  | PromiseOrDirect<AwaitedExecutionResults<TData>>
  | PromiseLike<never>;

/** @internal */
export type ForcedValues = {
  flags: {
    [index: number]: ExecutionEntryFlags | undefined;
  };
  results: {
    [index: number]: Error | null | undefined;
  };
};

/** @internal */
export type GrafastInternalResultsOrStream<T> = {
  flags: ReadonlyArray<ExecutionEntryFlags>;
  results: AwaitedExecutionResults<T>;
};

export type BaseGraphQLRootValue = any;
export interface BaseGraphQLVariables {
  [key: string]: unknown;
}
export interface BaseGraphQLArguments {
  [key: string]: any;
}
export type BaseGraphQLInputObject = BaseGraphQLArguments;

export type FieldArgs = {
  /** @deprecated Use bakedInput() step instead. */
  get?: never;
  /** Gets the value *without* calling any `inputPlan`s */
  getRaw(path?: string | ReadonlyArray<string | number>): AnyInputStep;
  /** This also works (without path) to apply each list entry against $target */
  apply(
    $target: ApplyableExecutableStep,
    path?: string | ReadonlyArray<string | number>,
  ): void;
} & AnyInputStepDollars;

export type InputStep<TInputType extends GraphQLInputType = GraphQLInputType> =
  GraphQLInputType extends TInputType
    ? AnyInputStep
    : TInputType extends GraphQLNonNull<infer U>
    ? Exclude<InputStep<U & GraphQLInputType>, ConstantStep<undefined>>
    : TInputType extends GraphQLList<GraphQLInputType>
    ?
        | __InputListStep<TInputType> // .at(), .eval(), .evalLength(), .evalIs(null)
        | __TrackedValueStep<any, TInputType> // .get(), .eval(), .evalIs(), .evalHas(), .at(), .evalLength(), .evalIsEmpty()
        | ConstantStep<undefined> // .eval(), .evalIs(), .evalIsEmpty()
    : TInputType extends GraphQLInputObjectType
    ?
        | __TrackedValueStepWithDollars<any, TInputType> // .get(), .eval(), .evalIs(), .evalHas(), .at(), .evalLength(), .evalIsEmpty()
        | __InputObjectStepWithDollars<TInputType> // .get(), .eval(), .evalHas(), .evalIs(null), .evalIsEmpty()
        | ConstantStep<undefined> // .eval(), .evalIs(), .evalIsEmpty()
    : // TYPES: handle the other types
      AnyInputStep;

export type AnyInputStep =
  | __TrackedValueStepWithDollars<any, GraphQLInputType> // .get(), .eval(), .evalIs(), .evalHas(), .at(), .evalLength(), .evalIsEmpty()
  | __InputListStep // .at(), .eval(), .evalLength(), .evalIs(null)
  | __InputStaticLeafStep // .eval(), .evalIs()
  | __InputDynamicScalarStep // .eval(), .evalIs()
  | __InputObjectStepWithDollars<GraphQLInputObjectType> // .get(), .eval(), .evalHas(), .evalIs(null), .evalIsEmpty()
  | ConstantStep<undefined>; // .eval(), .evalIs(), .evalIsEmpty()

export type AnyInputStepWithDollars = AnyInputStep & AnyInputStepDollars;

// TYPES: solve these lies
/**
 * Lies to make it easier to write TypeScript code like
 * `{ $input: { $user: { $username } } }` without having to pass loads of
 * generics.
 */
export type AnyInputStepDollars = {
  [key in string as `$${key}`]: AnyInputStepWithDollars;
};

export interface FieldInfo {
  fieldName: string;
  field: GraphQLField<any, any, any>;
  schema: GraphQLSchema;
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
 * They are stored onto `<field>.extensions.grafast.plan`
 *
 * @returns a plan for this field.
 *
 * @remarks
 * We're using `TrackedObject<...>` so we can later consider caching these
 * executions.
 */
export type FieldPlanResolver<
  _TArgs extends BaseGraphQLArguments,
  TParentStep extends ExecutableStep | null,
  TResultStep extends ExecutableStep | null,
> = ($parentPlan: TParentStep, args: FieldArgs, info: FieldInfo) => TResultStep;

export type InputObjectFieldApplyResolver<TParent> = (
  target: TParent,
  input: unknown,
  info: {
    schema: GraphQLSchema;
    fieldName: string;
    field: GraphQLInputField;
  },
) => any;

export type InputObjectTypeBakedResolver = (
  input: Record<string, any>,
  info: {
    schema: GraphQLSchema;
    type: GraphQLInputObjectType;
  },
) => any;

export type ArgumentApplyPlanResolver<
  TParentStep extends ExecutableStep = ExecutableStep,
  TFieldStep extends ExecutableStep = ExecutableStep,
> = (
  $parentPlan: TParentStep,
  $fieldPlan: TFieldStep,
  input: FieldArgs,
  info: {
    schema: GraphQLSchema;
    arg: GraphQLArgument;
  },
) => void;

/**
 * GraphQLScalarTypes can have plans, these are passed the field plan and must
 * return an executable plan.
 */
export type ScalarPlanResolver<
  TParentStep extends ExecutableStep = ExecutableStep,
  TResultStep extends ExecutableStep = ExecutableStep,
> = ($parentPlan: TParentStep, info: { schema: GraphQLSchema }) => TResultStep;

// TODO: is this still implemented?
/**
 * GraphQLScalarTypes can have plans, these are passed the field plan and must
 * return an executable plan.
 */
export type ScalarInputPlanResolver<
  TResultStep extends ExecutableStep = ExecutableStep,
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
 * @experimental
 */
export type EnumValueApplyResolver<TParent extends any = any> = (
  parent: TParent,
) => void;

// TypeScript gets upset if we go too deep, so we try and cover the most common
// use cases and fall back to `any`
type OutputPlanForNamedType<TType extends GraphQLType> =
  TType extends GrafastObjectType<infer TStep, any> ? TStep : ExecutableStep;

export type OutputPlanForType<TType extends GraphQLOutputType> =
  TType extends GraphQLNonNull<GraphQLList<GraphQLNonNull<infer U>>>
    ?
        | ListCapableStep<any, OutputPlanForNamedType<U>>
        | ExecutableStep<ReadonlyArray<any>>
    : TType extends GraphQLNonNull<GraphQLList<infer U>>
    ?
        | ListCapableStep<any, OutputPlanForNamedType<U>>
        | ExecutableStep<ReadonlyArray<any>>
    : TType extends GraphQLList<GraphQLNonNull<infer U>>
    ?
        | ListCapableStep<any, OutputPlanForNamedType<U>>
        | ExecutableStep<ReadonlyArray<any>>
    : TType extends GraphQLList<infer U>
    ?
        | ListCapableStep<any, OutputPlanForNamedType<U>>
        | ExecutableStep<ReadonlyArray<any>>
    : TType extends GraphQLNonNull<infer U>
    ? OutputPlanForNamedType<U>
    : OutputPlanForNamedType<TType>;

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
export type GrafastFieldConfig<
  TType extends GraphQLOutputType,
  TParentStep extends ExecutableStep | null,
  TFieldStep extends ExecutableStep, // TODO: should be OutputPlanForType<TType>, but that results in everything thinking it should be a ListStep
  TArgs extends BaseGraphQLArguments,
> = Omit<GraphQLFieldConfig<any, any>, "args" | "type"> & {
  type: TType;
  plan?: FieldPlanResolver<TArgs, TParentStep, TFieldStep>;
  subscribePlan?: FieldPlanResolver<TArgs, TParentStep, TFieldStep>;
  args?: GrafastFieldConfigArgumentMap;
};

/**
 * Basically GraphQLFieldConfigArgumentMap but allowing for args to have plans.
 */
export type GrafastFieldConfigArgumentMap = {
  [argName: string]: GrafastArgumentConfig;
};

/**
 * Basically GraphQLArgumentConfig but allowing for a plan.
 */
export type GrafastArgumentConfig<
  TInputType extends GraphQLInputType = GraphQLInputType,
  _TContext extends Grafast.Context = Grafast.Context,
  _TParentStep extends ExecutableStep | null = ExecutableStep | null,
> = Omit<GraphQLArgumentConfig, "type"> & {
  type: TInputType;
  applyPlan?: ArgumentApplyPlanResolver<any, any>;
  applySubscribePlan?: ArgumentApplyPlanResolver<any, any>;
};

/**
 * Basically GraphQLInputFieldConfig but allowing for the field to have a plan.
 */
export type GrafastInputFieldConfig<
  TParent,
  TInputType extends GraphQLInputType,
> = Omit<GraphQLInputFieldConfig, "type"> & {
  type: TInputType;
  apply?: InputObjectFieldApplyResolver<TParent>;
};

/**
 * The args passed to a field plan resolver, the values are plans.
 */
export type TrackedArguments<
  TArgs extends BaseGraphQLArguments = BaseGraphQLArguments,
> = {
  get<TKey extends keyof TArgs>(key: TKey): AnyInputStep;
};

/**
 * `@stream` directive meta.
 */
export interface StepStreamOptions extends LayerPlanReasonListItemStream {}
/**
 * Additional details about the planning for a field; currently only relates to
 * the `@stream` directive.
 */
export interface StepOptions {
  /**
   * Details for the `@stream` directive.
   */
  stream: StepStreamOptions | null;
  /**
   * Should we walk an iterable if presented. This is important because we
   * don't want to walk things like Map/Set except if we're doing it as part of
   * a list step.
   */
  walkIterable: boolean;
}

/**
 * Options passed to the `optimize` method of a plan to give more context.
 */
export interface StepOptimizeOptions {
  meta: Record<string, unknown> | undefined;
}

/**
 * A subscriber provides realtime data, a SubscribeStep can subscribe to a
 * given topic (string) and will receive an AsyncIterableIterator with messages
 * published to that topic (standard pub/sub semantics).
 */
export type GrafastSubscriber<
  TTopics extends { [key: string]: any } = { [key: string]: any },
> = {
  subscribe<TTopic extends keyof TTopics = keyof TTopics>(
    topic: TTopic,
  ): PromiseOrDirect<AsyncIterableIterator<TTopics[TTopic]>>;
  release?(): PromiseOrDirect<void>;
};

/**
 * Specifically relates to the stringification of NodeIDs, e.g. `["User", 1]`
 * to/from `WyJVc2VyIiwgMV0=`
 */
export interface NodeIdCodec<T = any> {
  name: string;
  encode(value: T): string | null;
  decode(value: string): T;
}

/**
 * Determines if a NodeID relates to a given object type, and also relates to
 * encoding the NodeID for that type.
 */
export type NodeIdHandler<
  TCodec extends NodeIdCodec<any> = NodeIdCodec<any>,
  TNodeStep extends ExecutableStep = ExecutableStep,
  TSpec = any,
> = {
  /**
   * The name of the object type this handler is for.
   */
  typeName: string;

  /**
   * Which codec are we using to encode/decode the NodeID string?
   */
  codec: TCodec;

  /**
   * Returns true if the given decoded Node ID value represents this type.
   */
  match(specifier: TCodec extends NodeIdCodec<infer U> ? U : any): boolean;

  /**
   * Returns a plan that returns the value ready to be encoded. When the result
   * of this plan is fed into `match`, it should return `true`.
   */
  plan(
    $thing: TNodeStep,
  ): ExecutableStep<TCodec extends NodeIdCodec<infer U> ? U : any>;

  /**
   * Returns a specification based on the Node ID, this can be in any format
   * you like. It is intended to then be fed into `get` or handled in your own
   * code as you see fit. (When used directly, it's primarily useful for
   * referencing a node without actually fetching it - e.g. allowing you to
   * delete a node by its ID without first fetching it.)
   */
  getSpec(
    plan: ExecutableStep<TCodec extends NodeIdCodec<infer U> ? U : any>,
  ): TSpec;

  /**
   * Combined with `getSpec`, this forms the recprocal of `plan`; i.e.
   * `get(getSpec( plan(node) ))` should return a plan that results in the
   * original node.
   */
  get(spec: TSpec): TNodeStep;

  deprecationReason?: string;
};

export type BaseEventMap = Record<string, any>;
export type EventMapKey<TEventMap extends BaseEventMap> = string &
  keyof TEventMap;
export type EventCallback<TPayload> = (params: TPayload) => void;

export interface TypedEventEmitter<TEventMap extends BaseEventMap>
  extends EventEmitter<any, any> {
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

export interface ExecutionExtraBase {
  /** The `performance.now()` at which your step should stop executing */
  stopTime: number | null;
  /** If you have set a `metaKey` on your step, the relevant meta object which you can write into (e.g. for caching) */
  meta: Record<string, unknown> | undefined;
  eventEmitter: ExecutionEventEmitter | undefined;

  // These are only needed for subroutine plans, don't use them as we may
  // remove them later.
  /** @internal */
  _bucket: Bucket;
  /** @internal */
  _requestContext: RequestTools;
  /**
   * @internal
   *
   * @remarks We populate it here, but users should only access it from
   * UnbatchedExecutionExtra or directly from ExecutionDetails.
   */
  stream: ExecutionDetailsStream | null;
}
export interface ExecutionExtra extends ExecutionExtraBase {}
export interface UnbatchedExecutionExtra extends ExecutionExtraBase {
  stream: ExecutionDetailsStream | null;
}

/**
 * A bitwise number representing a number of flags:
 *
 * - 0: normal execution value
 * - 1: errored (trappable)
 * - 2: null (trappable)
 * - 4: inhibited (trappable)
 * - 8: disabled due to polymorphism (untrappable)
 * - 16: stopped (untrappable) - e.g. due to fatal (unrecoverable) error
 * - 32: ...
 */
export type ExecutionEntryFlags = number & { readonly tsBrand?: unique symbol };

function flag(f: number): ExecutionEntryFlags {
  return f as ExecutionEntryFlags;
}

export const NO_FLAGS = flag(0);
export const FLAG_ERROR = flag(1 << 0);
export const FLAG_NULL = flag(1 << 1);
export const FLAG_INHIBITED = flag(1 << 2);
export const FLAG_POLY_SKIPPED = flag(1 << 3);
export const FLAG_STOPPED = flag(1 << 4);
export const ALL_FLAGS = flag(
  FLAG_ERROR | FLAG_NULL | FLAG_INHIBITED | FLAG_POLY_SKIPPED | FLAG_STOPPED,
);

/** By default, accept null values as an input */
export const DEFAULT_ACCEPT_FLAGS = flag(FLAG_NULL);
export const TRAPPABLE_FLAGS = flag(FLAG_ERROR | FLAG_NULL | FLAG_INHIBITED);
export const DEFAULT_FORBIDDEN_FLAGS = flag(ALL_FLAGS & ~DEFAULT_ACCEPT_FLAGS);
export const FORBIDDEN_BY_NULLABLE_BOUNDARY_FLAGS = flag(
  FLAG_NULL | FLAG_POLY_SKIPPED,
);
// TODO: make `FORBIDDEN_BY_NULLABLE_BOUNDARY_FLAGS = flag(FLAG_ERROR | FLAG_NULL | FLAG_POLY_SKIPPED | FLAG_INHIBITED | FLAG_STOPPED);`
// Currently this isn't enabled because the bucket has to exist for the output
// plan to throw the error; really the root should be evaluated before
// descending into the output plan rather than as part of descending?

export type ExecutionValue<TData = any> =
  | BatchExecutionValue<TData>
  | UnaryExecutionValue<TData>;

interface ExecutionValueBase<TData = any> {
  at(i: number): TData;
  isBatch: boolean;
  /** Returns this.value for a unary execution value; throws if non-unary */
  unaryValue(): TData;
  /** @internal */
  _flagsAt(i: number): ExecutionEntryFlags;
  /** bitwise OR of all the entry states @internal */
  _getStateUnion(): ExecutionEntryFlags;
  /** @internal */
  _setResult(i: number, value: TData, flags: ExecutionEntryFlags): void;
  /** @internal */
  _copyResult(
    targetIndex: number,
    source: ExecutionValue,
    sourceIndex: number,
  ): void;
}
export interface BatchExecutionValue<TData = any>
  extends ExecutionValueBase<TData> {
  isBatch: true;
  entries: ReadonlyArray<TData>;
  /** Always throws, since this should only be called on unary execution values */
  unaryValue(): never;
  /** @internal */
  readonly _flags: Array<ExecutionEntryFlags>;
}
export interface UnaryExecutionValue<TData = any>
  extends ExecutionValueBase<TData> {
  isBatch: false;
  value: TData;
  /** Same as getting .value */
  unaryValue(): TData;
  /** @internal */
  _entryFlags: ExecutionEntryFlags;
}

export type IndexMap = <T>(callback: (i: number) => T) => ReadonlyArray<T>;
export type IndexForEach = (callback: (i: number) => any) => void;

export interface ExecutionDetailsStream {
  // TODO: subscribe: boolean;
  initialCount: number;
}

export interface ExecutionDetails<
  TDeps extends readonly [...any[]] = readonly [...any[]],
> {
  count: number;
  indexMap: IndexMap;
  indexForEach: IndexForEach;
  values: {
    [DepIdx in keyof TDeps]: ExecutionValue<TDeps[DepIdx]>;
  } & {
    length: TDeps["length"];
    map: ReadonlyArray<ExecutionValue<TDeps[number]>>["map"];
  };
  extra: ExecutionExtra;
  stream: ExecutionDetailsStream | null;
}

export interface LocationDetails {
  node: ASTNode | readonly ASTNode[];
  /** This should only be null for the root selection */
  parentTypeName: string | null;
  /** This should only be null for the root selection */
  fieldName: string | null;
}

export type UnwrapPlanTuple</* const */ TIn extends readonly ExecutableStep[]> =
  {
    [Index in keyof TIn]: TIn[Index] extends ExecutableStep<infer U>
      ? U
      : never;
  };

export type NotVariableValueNode = Exclude<ValueNode, VariableNode>;

export type StreamMaybeMoreableArray<T = any> = Array<T> & {
  [$$streamMore]?: AsyncIterator<any, any, any> | Iterator<any, any, any>;
};
export type StreamMoreableArray<T = any> = Array<T> & {
  [$$streamMore]: AsyncIterator<any, any, any> | Iterator<any, any, any>;
};

export interface GrafastArgs extends GraphQLArgs {
  resolvedPreset?: GraphileConfig.ResolvedPreset;
  requestContext?: Partial<Grafast.RequestContext>;
  middleware?: Middleware<GraphileConfig.GrafastMiddleware> | null;
}
export type Maybe<T> = T | null | undefined;

export * from "./planJSONInterfaces.js";

export interface AddDependencyOptions {
  step: ExecutableStep;
  skipDeduplication?: boolean;
  /** @defaultValue `FLAG_NULL` */
  acceptFlags?: ExecutionEntryFlags;
  onReject?: null | Error | undefined;
  nonUnaryMessage?: (
    $dependent: ExecutableStep,
    $dependency: ExecutableStep,
  ) => string;
}
/**
 * @internal
 */
export const $$deepDepSkip = Symbol("deepDepSkip_experimental");

export type DataFromStep<TStep extends ExecutableStep> =
  TStep extends ExecutableStep<infer TData> ? TData : never;

export interface GrafastExecutionArgs extends ExecutionArgs {
  resolvedPreset?: GraphileConfig.ResolvedPreset;
  middleware?: Middleware<GraphileConfig.GrafastMiddleware> | null;
  requestContext?: Partial<Grafast.RequestContext>;
  outputDataAsString?: boolean;
}

export interface ValidateSchemaEvent {
  resolvedPreset: GraphileConfig.ResolvedPreset;
  schema: GraphQLSchema;
}
export interface ParseAndValidateEvent {
  resolvedPreset: GraphileConfig.ResolvedPreset;
  schema: GraphQLSchema;
  source: string | Source;
}
export interface PrepareArgsEvent {
  args: Grafast.ExecutionArgs;
}
export interface ExecuteEvent {
  args: GrafastExecutionArgs;
}
export interface SubscribeEvent {
  args: GrafastExecutionArgs;
}
export interface EstablishOperationPlanEvent {
  schema: GraphQLSchema;
  operation: OperationDefinitionNode;
  fragments: ObjMap<FragmentDefinitionNode>;
  variableValues: Record<string, any>;
  context: any;
  rootValue: any;
  planningTimeout: number | undefined;
  args: GrafastExecutionArgs;
}
export interface ExecuteStepEvent {
  args: GrafastExecutionArgs;
  step: ExecutableStep;
  executeDetails: ExecutionDetails;
}
