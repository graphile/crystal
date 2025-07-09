import type EventEmitter from "eventemitter3";
import type { Middleware } from "graphile-config";
import type { ASTNode, ExecutionArgs, FragmentDefinitionNode, GraphQLArgs, GraphQLArgument, GraphQLArgumentConfig, GraphQLField, GraphQLFieldConfig, GraphQLInputField, GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputType, GraphQLList, GraphQLNonNull, GraphQLOutputType, GraphQLScalarType, GraphQLSchema, GraphQLType, OperationDefinitionNode, Source, ValueNode, VariableNode } from "graphql";
import type { ObjMap } from "graphql/jsutils/ObjMap.js";
import type { Constraint } from "./constraints.js";
import type { LayerPlanReasonListItemStream } from "./engine/LayerPlan.js";
import type { OperationPlan } from "./engine/OperationPlan.js";
import type { FlaggedValue, SafeError } from "./error.js";
import type { ListCapableStep, Step } from "./step.js";
import type { __InputDefaultStep } from "./steps/__inputDefault.js";
import type { __InputDynamicScalarStep } from "./steps/__inputDynamicScalar.js";
import type { ApplyableExecutableStep } from "./steps/applyInput.js";
import type { __InputListStep, __InputObjectStepWithDollars, __InputStaticLeafStep, __TrackedValueStepWithDollars, ConstantStep, ObjectStep } from "./steps/index.js";
import type { GrafastObjectType } from "./utils.js";
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
}
export declare const $$queryCache: unique symbol;
/**
 * We store the cache directly onto the GraphQLSchema so that it gets garbage
 * collected along with the schema when it's not needed any more. To do so, we
 * attach it using this symbol.
 */
export declare const $$cacheByOperation: unique symbol;
export type Fragments = {
    [key: string]: FragmentDefinitionNode;
};
export interface IEstablishOperationPlanResult {
    variableValuesConstraints: Constraint[];
    contextConstraints: Constraint[];
    rootValueConstraints: Constraint[];
}
export interface EstablishOperationPlanResultSuccess extends IEstablishOperationPlanResult {
    error?: never;
    operationPlan: OperationPlan;
}
export interface EstablishOperationPlanResultError extends IEstablishOperationPlanResult {
    error: Error | SafeError<{
        [$$timeout]: number;
        [$$ts]: number;
    } | {
        [$$timeout]?: undefined;
        [$$ts]?: undefined;
    } | undefined>;
    operationPlan?: never;
}
export type EstablishOperationPlanResult = EstablishOperationPlanResultSuccess | EstablishOperationPlanResultError;
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
export declare const $$hooked: unique symbol;
export declare const $$grafastContext: unique symbol;
export declare const $$planResults: unique symbol;
export declare const $$id: unique symbol;
/** Return the value verbatim, don't execute */
export declare const $$verbatim: unique symbol;
/**
 * If we're sure the data is the right shape and valid, we can set this key and
 * it can be returned directly
 */
export declare const $$bypassGraphQL: unique symbol;
export declare const $$data: unique symbol;
/**
 * For attaching additional metadata to the GraphQL execution result, for
 * example details of the plan or SQL queries or similar that were executed.
 */
export declare const $$extensions: unique symbol;
/**
 * The "GraphQLObjectType" type name, useful when dealing with polymorphism.
 */
export declare const $$concreteType: unique symbol;
/**
 * Set this key on a type if that type's serialization is idempotent (that is
 * to say `serialize(serialize(thing)) === serialize(thing)`). This means we
 * don't have to "roll-back" serialization if we need to fallback to graphql-js
 * execution.
 */
export declare const $$idempotent: unique symbol;
/**
 * The event emitter used for outputting execution events.
 */
export declare const $$eventEmitter: unique symbol;
/**
 * Used to indicate that an array has more results available via a stream.
 */
export declare const $$streamMore: unique symbol;
export declare const $$proxy: unique symbol;
/**
 * If an error has this property set then it's safe to send through to the user
 * without being masked.
 */
export declare const $$safeError: unique symbol;
/** The layerPlan used as a subroutine for this step */
export declare const $$subroutine: unique symbol;
/** For tracking the timeout a TimeoutError happened from */
export declare const $$timeout: unique symbol;
/** For tracking _when_ the timeout happened (because once the JIT has warmed it might not need so long) */
export declare const $$ts: unique symbol;
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
export type GrafastValuesList<TData> = ReadonlyArray<TData>;
export type PromiseOrDirect<T> = PromiseLike<T> | T;
export type ExecutionResultValue<T> = T | FlaggedValue<Error> | FlaggedValue<null>;
export type GrafastResultsList<TData> = ReadonlyArray<PromiseOrDirect<ExecutionResultValue<TData>>>;
export type GrafastResultStreamList<TStreamItem> = ReadonlyArray<PromiseOrDirect<AsyncIterable<PromiseOrDirect<ExecutionResultValue<TStreamItem>>>> | PromiseLike<never>>;
export type AwaitedExecutionResults<TData> = ReadonlyArray<PromiseOrDirect<ExecutionResultValue<TData> | AsyncIterable<PromiseOrDirect<ExecutionResultValue<TData extends ReadonlyArray<infer UStreamItem> ? UStreamItem : never>>>>>;
export type ExecutionResults<TData> = PromiseOrDirect<AwaitedExecutionResults<TData>> | PromiseLike<never>;
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
    getRaw(path?: string | ReadonlyArray<string | number>): AnyInputStep | ObjectStep<{
        [argName: string]: AnyInputStep;
    }>;
    typeAt(path: string | ReadonlyArray<string | number>): GraphQLInputType;
    /** This also works (without path) to apply each list entry against $target */
    apply<TArg extends object>($target: ApplyableExecutableStep<TArg>, path?: string | ReadonlyArray<string | number>, getTargetFromParent?: (parent: TArg, inputValue: any) => object | undefined): void;
    apply<TArg extends object>($target: ApplyableExecutableStep<TArg>, getTargetFromParent: (parent: TArg, inputValue: any) => object | undefined, justTargetFromParent?: never): void;
} & AnyInputStepDollars;
export type FieldArg = {
    /** @deprecated Use bakedInput() step instead. */
    get?: never;
    getRaw(path?: string | ReadonlyArray<string | number>): AnyInputStep;
    typeAt(path: string | ReadonlyArray<string | number>): GraphQLInputType;
    /** This also works (without path) to apply each list entry against $target */
    apply<TArg extends object>($target: ApplyableExecutableStep<TArg>, path?: string | ReadonlyArray<string | number>, getTargetFromParent?: (parent: TArg, inputValue: any) => object | undefined): void;
    apply<TArg extends object>($target: ApplyableExecutableStep<TArg>, getTargetFromParent: (parent: TArg, inputValue: any) => object | undefined, justTargetFromParent?: never): void;
};
export type AnyInputStep = __TrackedValueStepWithDollars<any, GraphQLInputType> | __InputListStep | __InputStaticLeafStep | __InputDynamicScalarStep | __InputObjectStepWithDollars<GraphQLInputObjectType> | __InputDefaultStep | ConstantStep<any>;
export type AnyInputStepWithDollars = AnyInputStep & AnyInputStepDollars;
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
export type FieldPlanResolver<_TArgs extends BaseGraphQLArguments, TParentStep extends Step | null, TResultStep extends Step | null> = ($parentPlan: TParentStep, args: FieldArgs, info: FieldInfo) => TResultStep;
export type InputObjectFieldApplyResolver<TParent> = (target: TParent, input: any, // Don't use unknown here, otherwise users can't easily cast it
info: {
    schema: GraphQLSchema;
    fieldName: string;
    field: GraphQLInputField;
}) => any;
export type InputObjectTypeBakedInfo = {
    schema: GraphQLSchema;
    type: GraphQLInputObjectType;
    applyChildren(val: any): void;
};
export type InputObjectTypeBakedResolver = (input: Record<string, any>, info: InputObjectTypeBakedInfo) => any;
export type ArgumentApplyPlanResolver<TParentStep extends Step = Step, TFieldStep extends Step = Step> = ($parentPlan: TParentStep, $fieldPlan: TFieldStep, input: FieldArg, info: {
    schema: GraphQLSchema;
    arg: GraphQLArgument;
    argName: string;
}) => void;
/**
 * GraphQLScalarTypes can have plans, these are passed the field plan and must
 * return an executable plan.
 */
export type ScalarPlanResolver<TParentStep extends Step = Step, TResultStep extends Step = Step> = ($parentPlan: TParentStep, info: {
    schema: GraphQLSchema;
}) => TResultStep;
/**
 * GraphQLScalarTypes can have plans, these are passed the field plan and must
 * return an executable plan.
 */
export type ScalarInputPlanResolver<TResultStep extends Step = Step> = ($inputValue: AnyInputStep, info: {
    schema: GraphQLSchema;
    type: GraphQLScalarType;
}) => TResultStep;
/**
 * EXPERIMENTAL!
 *
 * NOTE: this is an `any` because we want to allow users to specify
 * subclasses of ExecutableStep but TypeScript only wants to allow
 * superclasses.
 *
 * @experimental
 */
export type EnumValueApplyResolver<TParent = any> = (parent: TParent) => void;
type OutputPlanForNamedType<TType extends GraphQLType> = TType extends GrafastObjectType<infer TStep, any> ? TStep : Step;
export type OutputPlanForType<TType extends GraphQLOutputType> = TType extends GraphQLNonNull<GraphQLList<GraphQLNonNull<infer U>>> ? ListCapableStep<any, OutputPlanForNamedType<U>> | Step<ReadonlyArray<any>> : TType extends GraphQLNonNull<GraphQLList<infer U>> ? ListCapableStep<any, OutputPlanForNamedType<U>> | Step<ReadonlyArray<any>> : TType extends GraphQLList<GraphQLNonNull<infer U>> ? ListCapableStep<any, OutputPlanForNamedType<U>> | Step<ReadonlyArray<any>> : TType extends GraphQLList<infer U> ? ListCapableStep<any, OutputPlanForNamedType<U>> | Step<ReadonlyArray<any>> : TType extends GraphQLNonNull<infer U> ? OutputPlanForNamedType<U> : OutputPlanForNamedType<TType>;
/**
 * Basically GraphQLFieldConfig but with an easy to access `plan` method.
 */
export type GrafastFieldConfig<TType extends GraphQLOutputType, TParentStep extends Step | null, TFieldStep extends Step, // TODO: should be OutputPlanForType<TType>, but that results in everything thinking it should be a ListStep
TArgs extends BaseGraphQLArguments> = Omit<GraphQLFieldConfig<any, any>, "args" | "type"> & {
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
export type GrafastArgumentConfig<TInputType extends GraphQLInputType = GraphQLInputType, _TContext extends Grafast.Context = Grafast.Context, _TParentStep extends Step | null = Step | null> = Omit<GraphQLArgumentConfig, "type"> & {
    type: TInputType;
    applyPlan?: ArgumentApplyPlanResolver<any, any>;
    applySubscribePlan?: ArgumentApplyPlanResolver<any, any>;
    inputPlan?: never;
    autoApplyAfterParentPlan?: never;
    autoApplyAfterParentSubscribePlan?: never;
};
/**
 * Basically GraphQLInputFieldConfig but allowing for the field to have a plan.
 */
export type GrafastInputFieldConfig<TParent = any, TInputType extends GraphQLInputType = GraphQLInputType> = Omit<GraphQLInputFieldConfig, "type"> & {
    type: TInputType;
    apply?: InputObjectFieldApplyResolver<TParent>;
    inputPlan?: never;
    applyPlan?: never;
    autoApplyAfterParentInputPlan?: never;
    autoApplyAfterParentApplyPlan?: never;
};
/**
 * The args passed to a field plan resolver, the values are plans.
 */
export type TrackedArguments<TArgs extends BaseGraphQLArguments = BaseGraphQLArguments> = {
    get<TKey extends keyof TArgs>(key: TKey): AnyInputStep;
};
/**
 * `@stream` directive meta.
 */
export interface StepStreamOptions extends LayerPlanReasonListItemStream {
}
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
    /**
     * If null, this step will not stream. If non-null, this step _might_ stream,
     * but it's not guaranteed - it may be dependent on user variables, e.g. the
     * `if` parameter.
     */
    stream: null | {};
    meta: Record<string, unknown> | undefined;
}
/**
 * A subscriber provides realtime data, a SubscribeStep can subscribe to a
 * given topic (string) and will receive an AsyncIterableIterator with messages
 * published to that topic (standard pub/sub semantics).
 */
export type GrafastSubscriber<TTopics extends {
    [key: string]: any;
} = {
    [key: string]: any;
}> = {
    subscribe<TTopic extends keyof TTopics = keyof TTopics>(topic: TTopic): PromiseOrDirect<AsyncIterableIterator<TTopics[TTopic]>>;
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
export type NodeIdHandler<TIdentifiers extends readonly any[] = readonly any[], TCodec extends NodeIdCodec<any> = NodeIdCodec<any>, TNodeStep extends Step = Step, TSpec = any> = {
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
     * Returns the underlying identifiers extracted from the decoded NodeID
     * value.
     */
    getIdentifiers(value: TCodec extends NodeIdCodec<infer U> ? U : any): TIdentifiers;
    /**
     * Returns a plan that returns the value ready to be encoded. When the result
     * of this plan is fed into `match`, it should return `true`.
     */
    plan($thing: TNodeStep): Step<TCodec extends NodeIdCodec<infer U> ? U : any>;
    /**
     * Returns a specification based on the Node ID, this can be in any format
     * you like. It is intended to then be fed into `get` or handled in your own
     * code as you see fit. (When used directly, it's primarily useful for
     * referencing a node without actually fetching it - e.g. allowing you to
     * delete a node by its ID without first fetching it.)
     */
    getSpec(plan: Step<TCodec extends NodeIdCodec<infer U> ? U : any>): TSpec;
    /**
     * Combined with `getSpec`, this forms the recprocal of `plan`; i.e.
     * `get(getSpec( plan(node) ))` should return a plan that results in the
     * original node.
     */
    get(spec: TSpec): TNodeStep;
    deprecationReason?: string;
};
export type BaseEventMap = Record<string, any>;
export type EventMapKey<TEventMap extends BaseEventMap> = string & keyof TEventMap;
export type EventCallback<TPayload> = (params: TPayload) => void;
export interface TypedEventEmitter<TEventMap extends BaseEventMap> extends EventEmitter<any, any> {
    addListener<TEventName extends EventMapKey<TEventMap>>(eventName: TEventName, callback: EventCallback<TEventMap[TEventName]>): this;
    on<TEventName extends EventMapKey<TEventMap>>(eventName: TEventName, callback: EventCallback<TEventMap[TEventName]>): this;
    once<TEventName extends EventMapKey<TEventMap>>(eventName: TEventName, callback: EventCallback<TEventMap[TEventName]>): this;
    removeListener<TEventName extends EventMapKey<TEventMap>>(eventName: TEventName, callback: EventCallback<TEventMap[TEventName]>): this;
    off<TEventName extends EventMapKey<TEventMap>>(eventName: TEventName, callback: EventCallback<TEventMap[TEventName]>): this;
    emit<TEventName extends EventMapKey<TEventMap>>(eventName: TEventName, params: TEventMap[TEventName]): boolean;
}
export type ExecutionEventMap = {
    /**
     * Something that can be added to the
     * ExecutionResult.extensions.explain.operations list.
     */
    explainOperation: {
        operation: Record<string, any> & {
            type: string;
            title: string;
        };
    };
};
export type ExecutionEventEmitter = TypedEventEmitter<ExecutionEventMap>;
export interface ExecutionExtraBase {
    /** The `performance.now()` at which your step should stop executing */
    stopTime: number | null;
    /** If you have set a `metaKey` on your step, the relevant meta object which you can write into (e.g. for caching) */
    meta: Record<string, unknown> | undefined;
    eventEmitter: ExecutionEventEmitter | undefined;
}
export interface ExecutionExtra extends ExecutionExtraBase {
}
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
export type ExecutionEntryFlags = number & {
    readonly tsBrand?: unique symbol;
};
export declare const NO_FLAGS: ExecutionEntryFlags;
export declare const FLAG_ERROR: ExecutionEntryFlags;
export declare const FLAG_NULL: ExecutionEntryFlags;
export declare const FLAG_INHIBITED: ExecutionEntryFlags;
export declare const FLAG_POLY_SKIPPED: ExecutionEntryFlags;
export declare const FLAG_STOPPED: ExecutionEntryFlags;
export declare const ALL_FLAGS: ExecutionEntryFlags;
/** By default, accept null values as an input */
export declare const DEFAULT_ACCEPT_FLAGS: ExecutionEntryFlags;
export declare const TRAPPABLE_FLAGS: ExecutionEntryFlags;
export declare const DEFAULT_FORBIDDEN_FLAGS: ExecutionEntryFlags;
export declare const FORBIDDEN_BY_NULLABLE_BOUNDARY_FLAGS: ExecutionEntryFlags;
export type ExecutionValue<TData = any> = BatchExecutionValue<TData> | UnaryExecutionValue<TData>;
interface ExecutionValueBase<TData = any> {
    at(i: number): TData;
    isBatch: boolean;
    /** Returns this.value for a unary execution value; throws if non-unary */
    unaryValue(): TData;
}
export interface BatchExecutionValue<TData = any> extends ExecutionValueBase<TData> {
    isBatch: true;
    entries: ReadonlyArray<TData>;
    /** Always throws, since this should only be called on unary execution values */
    unaryValue(): never;
}
export interface UnaryExecutionValue<TData = any> extends ExecutionValueBase<TData> {
    isBatch: false;
    value: TData;
    /** Same as getting .value */
    unaryValue(): TData;
}
export type IndexMap = <T>(callback: (i: number) => T) => ReadonlyArray<T>;
export type IndexForEach = (callback: (i: number) => any) => void;
export interface ExecutionDetailsStream {
    initialCount: number;
}
export interface ExecutionDetails<TDeps extends readonly [...any[]] = readonly [...any[]]> {
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
export type UnwrapPlanTuple</* const */ TIn extends readonly Step[]> = {
    [Index in keyof TIn]: DataFromStep<TIn[Index]>;
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
export interface AddDependencyOptions<TStep extends Step = Step> {
    step: TStep;
    skipDeduplication?: boolean;
    /** @defaultValue `FLAG_NULL` */
    acceptFlags?: ExecutionEntryFlags;
    onReject?: Maybe<Error>;
    nonUnaryMessage?: ($dependent: Step, $dependency: Step) => string;
}
export interface DependencyOptions<TStep extends Step = Step> {
    step: TStep;
    acceptFlags: ExecutionEntryFlags;
    onReject: Maybe<Error>;
}
export type DataFromStep<TStep extends Step> = TStep extends Step<infer TData> ? TData : never;
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
    step: Step;
    executeDetails: ExecutionDetails;
}
//# sourceMappingURL=interfaces.d.ts.map