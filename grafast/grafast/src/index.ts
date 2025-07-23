import "./thereCanBeOnlyOne.js";

import type LRU from "@graphile/lru";
import debugFactory from "debug";
import type { MiddlewareHandlers } from "graphile-config";
import type {
  DocumentNode,
  GraphQLError,
  OperationDefinitionNode,
} from "graphql";

import type { __InputDynamicScalarStep } from "./steps/__inputDynamicScalar.js";
import type { DataFromObjectSteps } from "./steps/object.js";

type PromiseOrValue<T> = T | Promise<T>;

import { exportAs, exportAsMany } from "./exportAs.js";
import { grafastPrint } from "./grafastPrint.js";
import {
  AbstractTypePlan,
  DeprecatedInputObjectPlan,
  DeprecatedObjectPlan,
  EnumPlan,
  EnumValueConfig,
  EnumValueInput,
  FieldPlan,
  GrafastSchemaConfig,
  InputFieldPlan,
  InputObjectFieldConfig,
  InputObjectPlan,
  InterfacePlan,
  makeGrafastSchema,
  ObjectFieldConfig,
  ObjectPlan,
  ScalarPlan,
  UnionPlan,
} from "./makeGrafastSchema.js";

// HACK: doing this here feels "naughty".
debugFactory.formatters.c = grafastPrint;

import type {
  $$cacheByOperation,
  $$hooked,
  $$queryCache,
} from "./constants.js";
import {
  $$bypassGraphQL,
  $$eventEmitter,
  $$extensions,
  $$idempotent,
  $$verbatim,
  DEFAULT_ACCEPT_FLAGS,
} from "./constants.js";
import { defer, Deferred } from "./deferred.js";
// Handy for debugging
import { isDev, noop } from "./dev.js";
import { defaultPlanResolver } from "./engine/lib/defaultPlanResolver.js";
import { isUnaryStep } from "./engine/lib/withGlobalLayerPlan.js";
import { OperationPlan } from "./engine/OperationPlan.js";
import { $$inhibit, flagError, isSafeError, SafeError } from "./error.js";
import { execute } from "./execute.js";
import { context, debugPlans, operationPlan, rootValue } from "./global.js";
import { grafast, grafastSync } from "./grafastGraphql.js";
import { inspect } from "./inspect.js";
import type {
  AbstractTypePlanner,
  ArgumentApplyPlanResolver,
  BaseEventMap,
  BaseGraphQLArguments,
  BaseGraphQLRootValue,
  BaseGraphQLVariables,
  BatchExecutionValue,
  CacheByOperationEntry,
  DataFromStep,
  EnumValueApplyResolver,
  EstablishOperationPlanEvent,
  EventCallback,
  EventMapKey,
  ExecuteEvent,
  ExecuteStepEvent,
  ExecutionDetails,
  ExecutionDetailsStream,
  ExecutionEventEmitter,
  ExecutionEventMap,
  ExecutionExtra,
  ExecutionResults,
  ExecutionResultValue,
  ExecutionValue,
  FieldArg,
  FieldArgs,
  FieldInfo,
  FieldPlanResolver,
  GrafastArgumentConfig,
  GrafastExecutionArgs,
  GrafastFieldConfig,
  GrafastFieldConfigArgumentMap,
  GrafastInputFieldConfig,
  GrafastPlanJSON,
  GrafastResultsList,
  GrafastResultStreamList,
  GrafastSubscriber,
  GrafastTimeouts,
  GrafastValuesList,
  InputObjectFieldApplyResolver,
  InputObjectTypeBakedInfo,
  InputObjectTypeBakedResolver,
  JSONArray,
  JSONObject,
  JSONValue,
  Maybe,
  NodeIdCodec,
  NodeIdHandler,
  ParseAndValidateEvent,
  PlanTypeInfo,
  PrepareArgsEvent,
  PromiseOrDirect,
  ScalarInputPlanResolver,
  ScalarPlanResolver,
  StepOptimizeOptions,
  StepStreamOptions,
  TypedEventEmitter,
  UnaryExecutionValue,
  UnbatchedExecutionExtra,
  ValidateSchemaEvent,
} from "./interfaces.js";
import { getGrafastMiddleware } from "./middleware.js";
import type { Multistep, UnwrapMultistep } from "./multistep.js";
import { multistep } from "./multistep.js";
import { getNullableInputTypeAtPath } from "./operationPlan-input.js";
import {
  assertExecutableStep,
  assertListCapableStep,
  assertStep,
  isExecutableStep,
  isListCapableStep,
  isListLikeStep,
  isObjectLikeStep,
  isStep,
  ListCapableStep,
  ListLikeStep,
  ObjectLikeStep,
  Step,
  UnbatchedStep,
} from "./step.js";
import {
  __FlagStep,
  __InputListStep,
  __InputObjectStep,
  __InputObjectStepWithDollars,
  __InputStaticLeafStep,
  __ItemStep,
  __ListTransformStep,
  __TrackedValueStep,
  __TrackedValueStepWithDollars,
  __ValueStep,
  access,
  AccessStep,
  ActualKeyByDesiredKey,
  applyInput,
  ApplyInputStep,
  applyTransforms,
  ApplyTransformsStep,
  assertEdgeCapableStep,
  assertModifier,
  assertNotNull,
  assertPageInfoCapableStep,
  bakedInput,
  bakedInputRuntime,
  BakedInputStep,
  coalesce,
  CoalesceStep,
  condition,
  ConditionStep,
  connection,
  ConnectionCapableStep,
  ConnectionStep,
  constant,
  ConstantStep,
  createObjectAndApplyChildren,
  each,
  EdgeCapableStep,
  EdgeStep,
  error,
  ErrorStep,
  filter,
  FilterPlanMemo,
  first,
  FirstStep,
  get,
  graphqlResolver,
  GraphQLResolverStep,
  groupBy,
  GroupByPlanMemo,
  inhibitOnNull,
  isModifier,
  lambda,
  LambdaStep,
  last,
  LastStep,
  list,
  listen,
  ListenStep,
  ListStep,
  listTransform,
  ListTransformItemPlanCallback,
  ListTransformOptions,
  ListTransformReduce,
  LoadedRecordStep,
  loadMany,
  LoadManyCallback,
  loadManyCallback,
  loadOne,
  LoadOneCallback,
  loadOneCallback,
  LoadOptions,
  LoadStep,
  makeDecodeNodeId,
  makeDecodeNodeIdRuntime,
  Modifier,
  node,
  nodeIdFromNode,
  NodeStep,
  object,
  ObjectPlanMeta,
  ObjectStep,
  PageInfoCapableStep,
  partitionByIndex,
  proxy,
  ProxyStep,
  remapKeys,
  RemapKeysStep,
  reverse,
  reverseArray,
  ReverseStep,
  Setter,
  setter,
  SetterCapable,
  sideEffect,
  SideEffectStep,
  specFromNodeId,
  trap,
  TRAP_ERROR,
  TRAP_ERROR_OR_INHIBITED,
  TRAP_INHIBITED,
} from "./steps/index.js";
import { stringifyPayload } from "./stringifyPayload.js";
import { stripAnsi } from "./stripAnsi.js";
import { subscribe } from "./subscribe.js";
import {
  arrayOfLength,
  arraysMatch,
  getEnumValueConfig,
  getEnumValueConfigs,
  GrafastInputFieldConfigMap,
  GrafastInputObjectType,
  GrafastObjectType,
  inputObjectFieldSpec,
  InputObjectTypeSpec,
  isPromiseLike,
  mapsMatch,
  newGrafastFieldConfigBuilder,
  newInputObjectTypeBuilder,
  newObjectTypeBuilder,
  objectFieldSpec,
  objectSpec,
  ObjectTypeFields,
  ObjectTypeSpec,
  recordsMatch,
  setsMatch,
  stepADependsOnStepB,
  stepAMayDependOnStepB,
  stepAShouldTryAndInlineIntoStepB,
  stepsAreInSamePhase,
} from "./utils.js";

export { isAsyncIterable } from "iterall";
export {
  __FlagStep,
  __InputListStep,
  __InputObjectStep,
  __InputObjectStepWithDollars,
  __InputStaticLeafStep,
  __ItemStep,
  __ListTransformStep,
  __TrackedValueStep,
  __TrackedValueStepWithDollars,
  __ValueStep,
  $$bypassGraphQL,
  $$eventEmitter,
  $$extensions,
  $$idempotent,
  $$inhibit,
  $$verbatim,
  AbstractTypePlan,
  AbstractTypePlanner,
  access,
  AccessStep,
  ActualKeyByDesiredKey,
  applyInput,
  ApplyInputStep,
  applyTransforms,
  ApplyTransformsStep,
  arrayOfLength,
  arraysMatch,
  assertEdgeCapableStep,
  assertExecutableStep,
  assertListCapableStep,
  assertModifier,
  assertNotNull,
  assertPageInfoCapableStep,
  assertStep,
  bakedInput,
  bakedInputRuntime,
  BakedInputStep,
  BaseEventMap,
  BaseGraphQLArguments,
  BaseGraphQLRootValue,
  BaseGraphQLVariables,
  BatchExecutionValue,
  coalesce,
  CoalesceStep,
  condition,
  ConditionStep,
  connection,
  ConnectionCapableStep,
  ConnectionStep,
  constant,
  ConstantStep,
  context,
  createObjectAndApplyChildren,
  DataFromObjectSteps,
  DataFromStep,
  debugPlans,
  DEFAULT_ACCEPT_FLAGS,
  defaultPlanResolver,
  defer,
  Deferred,
  DeprecatedInputObjectPlan,
  DeprecatedObjectPlan,
  each,
  EdgeCapableStep,
  EdgeStep,
  EnumPlan,
  EnumValueConfig,
  EnumValueInput,
  error,
  ErrorStep,
  EventCallback,
  EventMapKey,
  Step as ExecutableStep,
  execute,
  ExecutionDetails,
  ExecutionDetailsStream,
  ExecutionEventEmitter,
  ExecutionEventMap,
  ExecutionExtra,
  ExecutionResults,
  ExecutionResultValue,
  ExecutionValue,
  exportAs,
  exportAsMany,
  FieldArg,
  FieldArgs,
  FieldInfo,
  FieldPlan,
  FieldPlanResolver,
  filter,
  FilterPlanMemo,
  first,
  FirstStep,
  flagError,
  get,
  getEnumValueConfig,
  getEnumValueConfigs,
  getGrafastMiddleware,
  getNullableInputTypeAtPath,
  grafast,
  GrafastArgumentConfig,
  GrafastExecutionArgs,
  GrafastFieldConfig,
  GrafastFieldConfigArgumentMap,
  grafast as grafastGraphql,
  grafastSync as grafastGraphqlSync,
  GrafastInputFieldConfig,
  GrafastInputFieldConfigMap,
  GrafastInputObjectType,
  GrafastObjectType,
  GrafastPlanJSON,
  grafastPrint,
  GrafastResultsList,
  GrafastResultStreamList,
  GrafastSchemaConfig,
  GrafastSubscriber,
  grafastSync,
  GrafastValuesList,
  graphqlResolver,
  GraphQLResolverStep,
  groupBy,
  GroupByPlanMemo,
  inhibitOnNull,
  InputFieldPlan,
  InputObjectFieldApplyResolver,
  InputObjectFieldConfig,
  inputObjectFieldSpec,
  InputObjectPlan,
  InputObjectTypeBakedInfo,
  InputObjectTypeBakedResolver,
  InputObjectTypeSpec,
  inspect,
  AbstractTypePlan as InterfaceOrUnionPlans,
  InterfacePlan,
  isDev,
  isExecutableStep,
  isListCapableStep,
  isListLikeStep,
  isModifier,
  isObjectLikeStep,
  isPromiseLike,
  isSafeError,
  isStep,
  isUnaryStep,
  JSONArray,
  JSONObject,
  JSONValue,
  lambda,
  LambdaStep,
  last,
  LastStep,
  list,
  ListCapableStep,
  listen,
  ListenStep,
  ListLikeStep,
  ListStep,
  listTransform,
  ListTransformItemPlanCallback,
  ListTransformOptions,
  ListTransformReduce,
  LoadedRecordStep,
  loadMany,
  LoadManyCallback,
  loadManyCallback,
  loadOne,
  LoadOneCallback,
  loadOneCallback,
  LoadOptions,
  LoadStep,
  makeDecodeNodeId,
  makeDecodeNodeIdRuntime,
  makeGrafastSchema,
  mapsMatch,
  Maybe,
  Modifier,
  Multistep,
  multistep,
  newGrafastFieldConfigBuilder,
  newInputObjectTypeBuilder,
  newObjectTypeBuilder,
  node,
  NodeIdCodec,
  nodeIdFromNode,
  NodeIdHandler,
  NodeStep,
  noop,
  object,
  ObjectFieldConfig,
  objectFieldSpec,
  ObjectLikeStep,
  ObjectPlan,
  ObjectPlanMeta,
  objectSpec,
  ObjectStep,
  ObjectTypeFields,
  ObjectTypeSpec,
  OperationPlan,
  operationPlan,
  PageInfoCapableStep,
  partitionByIndex,
  PlanTypeInfo,
  PromiseOrDirect,
  proxy,
  ProxyStep,
  recordsMatch,
  remapKeys,
  RemapKeysStep,
  reverse,
  reverseArray,
  ReverseStep,
  rootValue,
  SafeError,
  ScalarPlan,
  ScalarPlanResolver,
  setsMatch,
  Setter,
  setter,
  SetterCapable,
  sideEffect,
  SideEffectStep,
  specFromNodeId,
  Step,
  stepADependsOnStepB,
  stepAMayDependOnStepB,
  stepAShouldTryAndInlineIntoStepB,
  StepOptimizeOptions,
  stepsAreInSamePhase,
  StepStreamOptions,
  stringifyPayload,
  stripAnsi,
  subscribe,
  trap,
  TRAP_ERROR,
  TRAP_ERROR_OR_INHIBITED,
  TRAP_INHIBITED,
  TypedEventEmitter,
  UnaryExecutionValue,
  UnbatchedStep as UnbatchedExecutableStep,
  UnbatchedExecutionExtra,
  UnbatchedStep,
  UnionPlan,
  UnwrapMultistep,
};

exportAsMany("grafast", {
  exportAs,
  exportAsMany,
  grafastPrint,
  makeGrafastSchema,
  OperationPlan,
  defer,
  execute,
  getNullableInputTypeAtPath,
  getGrafastMiddleware,
  grafast,
  grafastSync,
  subscribe,
  __InputListStep,
  stringifyPayload,
  __InputObjectStep,
  __InputStaticLeafStep,
  assertExecutableStep,
  assertStep,
  assertListCapableStep,
  assertModifier,
  isStep,
  isListCapableStep,
  isModifier,
  isObjectLikeStep,
  isListLikeStep,
  __ItemStep,
  __ListTransformStep,
  __TrackedValueStep,
  __ValueStep,
  inspect,
  access,
  get,
  AccessStep,
  applyInput,
  ApplyInputStep,
  bakedInput,
  bakedInputRuntime,
  BakedInputStep,
  operationPlan,
  connection,
  assertEdgeCapableStep,
  assertPageInfoCapableStep,
  ConnectionStep,
  EdgeStep,
  condition,
  ConditionStep,
  constant,
  ConstantStep,
  context,
  rootValue,
  inhibitOnNull,
  assertNotNull,
  trap,
  __FlagStep,
  TRAP_ERROR,
  TRAP_ERROR_OR_INHIBITED,
  TRAP_INHIBITED,
  debugPlans,
  each,
  error,
  ErrorStep,
  groupBy,
  filter,
  partitionByIndex,
  listTransform,
  coalesce,
  CoalesceStep,
  first,
  node,
  specFromNodeId,
  nodeIdFromNode,
  makeDecodeNodeId,
  makeDecodeNodeIdRuntime,
  proxy,
  applyTransforms,
  ApplyTransformsStep,
  ProxyStep,
  graphqlResolver,
  GraphQLResolverStep,
  NodeStep,
  FirstStep,
  last,
  LastStep,
  lambda,
  LambdaStep,
  sideEffect,
  SideEffectStep,
  list,
  ListStep,
  remapKeys,
  RemapKeysStep,
  object,
  ObjectStep,
  reverse,
  reverseArray,
  ReverseStep,
  setter,
  createObjectAndApplyChildren,
  Setter,
  listen,
  ListenStep,
  stripAnsi,
  arraysMatch,
  mapsMatch,
  recordsMatch,
  setsMatch,
  inputObjectFieldSpec,
  newGrafastFieldConfigBuilder,
  newInputObjectTypeBuilder,
  newObjectTypeBuilder,
  objectFieldSpec,
  objectSpec,
  arrayOfLength,
  stepADependsOnStepB,
  stepAMayDependOnStepB,
  stepsAreInSamePhase,
  stepAShouldTryAndInlineIntoStepB,
  isPromiseLike,
  isDev,
  noop,
  getEnumValueConfig,
  getEnumValueConfigs,
  loadOne,
  loadMany,
  loadOneCallback,
  loadManyCallback,
  LoadedRecordStep,
  LoadStep,
  isSafeError,
  $$inhibit,
  flagError,
  SafeError,
  isUnaryStep,
  defaultPlanResolver,
  multistep,
});

export { hookArgs } from "./args.js";
export { version } from "./version.js";

/** @deprecated Renamed to 'applyTransforms' */
export const deepEval = applyTransforms;
/** @deprecated Renamed to 'ApplyTransformsStep' */
export const DeepEvalStep = ApplyTransformsStep;

declare global {
  namespace Grafast {
    type ExecutionArgs = Pick<
      GrafastExecutionArgs,
      | "schema"
      | "document"
      | "rootValue"
      | "variableValues"
      | "operationName"
      | "resolvedPreset"
      | "middleware"
      | "requestContext"
      | "outputDataAsString"
    > & { [$$hooked]?: boolean; contextValue: Grafast.Context };

    /**
     * Details about the incoming GraphQL request - e.g. if it was sent over an
     * HTTP request, the request itself so headers can be interrogated.
     *
     * It's anticipated this will be expanded via declaration merging, e.g. if
     * your server is Koa v2 then `RequestContext.koav2` might be added.
     */
    interface RequestContext {}

    /**
     * The GraphQL context our schemas expect, generally generated from details in Grafast.RequestContext
     */
    interface Context {}

    interface FieldExtensions {
      plan?: FieldPlanResolver<any, any, any>;
      subscribePlan?: FieldPlanResolver<any, any, any>;
    }

    interface ArgumentExtensions {
      // fooPlan?: ArgumentPlanResolver<any, any, any, any, any>;
      applyPlan?: ArgumentApplyPlanResolver;
      applySubscribePlan?: ArgumentApplyPlanResolver;

      // Legacy fields, no longer supported
      inputPlan?: never;
      autoApplyAfterParentPlan?: never;
      autoApplyAfterParentSubscribePlan?: never;
    }

    interface InputObjectTypeExtensions {
      baked?: InputObjectTypeBakedResolver;
      /**
       * EXPERIMENTAL!
       *
       * Scope to pass to `.apply()` methods called by `applyInput()` step.
       *
       * IMPORTANT: the scope is only evaluated for the top-level named type
       * that `applyInput()` is applied against, so any type that nests this
       * (e.g. other input objects) needs to ensure they have an `applyScope()`
       * that's compatible; similarly this `applyPlan()` needs to supply values
       * that are compatible with all the descendant input objects, enums and
       * scalars. For this reason we recommend that you return an object with a
       * scoped key that you care about so it's easily merged.
       *
       * @experimental
       */
      applyScope?: () => Step;
    }

    interface InputFieldExtensions {
      apply?: InputObjectFieldApplyResolver<any>;

      // Legacy fields, no longer supported
      inputPlan?: never;
      applyPlan?: never;
      autoApplyAfterParentInputPlan?: never;
      autoApplyAfterParentApplyPlan?: never;
    }

    interface ObjectTypeExtensions {
      assertStep?:
        | ((step: Step) => asserts step is Step)
        | { new (...args: any[]): Step }
        | null;

      /**
       * Plantime. Given `$stepOrSpecifier`, a step that _hopefully_ represents
       * relevant data for this object type, return a step that can be used for
       * planning this object type. Used in the default implementation of
       * `AbstractTypePlanner.planForType` if that method is not provided.
       */
      planType?($stepOrSpecifier: Step): Step;
    }

    interface InterfaceTypeExtensions {
      /**
       * Takes a step representing this polymorphic position, and returns a
       * "specifier" step that will be input to planType. If not specified, the
       * step's own `.toSpecifier()` will be used, if present, otherwise the
       * step's own `.toRecord()`, and failing that the step itself.
       */
      toSpecifier?($step: Step): Step;

      /**
       * Plantime. `$stepOrSpecifier` is either a step returned from a field or
       * list position with an abstract type, or a `__ValueStep` that
       * represents the combined values of such steps (to prevent unbounded
       * plan branching). `planType` must then construct a step that
       * represents the `__typename` related to this given specifier (or `null`
       * if no match can be found) and a `planForType` method which, when
       * called, should return the step for the given type.
       */
      planType?(
        $stepOrSpecifier: Step,
        info: PlanTypeInfo,
      ): AbstractTypePlanner;
    }

    interface UnionTypeExtensions {
      /**
       * Takes a step representing this polymorphic position, and returns a
       * "specifier" step that will be input to planType. If not specified, the
       * step's own `.toSpecifier()` will be used, if present, otherwise the
       * step's own `.toRecord()`, and failing that the step itself.
       */
      toSpecifier?($step: Step): Step;

      /**
       * Plantime. `$stepOrSpecifier` is either a step returned from a field or
       * list position with an abstract type, or a `__ValueStep` that
       * represents the combined values of such steps (to prevent unbounded
       * plan branching). `planType` must then construct a step that
       * represents the `__typename` related to this given specifier (or `null`
       * if no match can be found) and a `planForType` method which, when
       * called, should return the step for the given type.
       */
      planType?(
        $stepOrSpecifier: Step,
        info: PlanTypeInfo,
      ): AbstractTypePlanner;
    }

    interface EnumTypeExtensions {
      /**
       * EXPERIMENTAL!
       *
       * Scope to pass to `.apply()` methods called by `applyInput()` step.
       *
       * IMPORTANT: the scope is only evaluated for the top-level named type
       * that `applyInput()` is applied against, so any type that nests this
       * (e.g. input objects) needs to ensure they have an `applyScope()`
       * that's compatible. For this reason we recommend that you return an
       * object with a scoped key that you care about so it's easily merged.
       *
       * @experimental
       */
      applyScope?: () => Step;
    }

    interface EnumValueExtensions {
      /**
       * EXPERIMENTAL!
       *
       * @experimental
       */
      apply?: EnumValueApplyResolver<any>;

      // Legacy fields, no longer supported
      applyPlan?: never;
    }

    interface ScalarTypeExtensions {
      plan?: ScalarPlanResolver;
      inputPlan?: ScalarInputPlanResolver;
      /**
       * EXPERIMENTAL!
       *
       * Scope to pass to `.apply()` methods called by `applyInput()` step.
       *
       * IMPORTANT: the scope is only evaluated for the top-level named type
       * that `applyInput()` is applied against, so any type that nests this
       * (e.g. input objects) needs to ensure they have an `applyScope()`
       * that's compatible. For this reason we recommend that you return an
       * object with a scoped key that you care about so it's easily merged.
       *
       * @experimental
       */
      applyScope?: () => Step;
      /**
       * Set true if `serialize(serialize(foo)) === serialize(foo)` for all foo
       */
      idempotent?: boolean;
    }

    interface SchemaExtensions {
      /**
       * Maximum number of queries to store in this schema's query cache.
       */
      queryCacheMaxLength?: number;

      /**
       * The underlying query cache
       */
      [$$queryCache]?: LRU<string, DocumentNode | ReadonlyArray<GraphQLError>>;

      /**
       * Maximum number of operations to store an operation plan lookup cache for
       */
      operationsCacheMaxLength?: number;

      /**
       * Maximum number of operation plans to store in a single operation's cache
       */
      operationOperationPlansCacheMaxLength?: number;

      /**
       * The starting point for finding/storing the relevant OperationPlan for a request.
       */
      [$$cacheByOperation]?: LRU<
        OperationDefinitionNode,
        CacheByOperationEntry
      >;
    }
  }
  namespace GraphileConfig {
    interface GrafastOptions {
      /**
       * An object to merge into the GraphQL context. Alternatively, pass an
       * (optionally asynchronous) function that returns an object to merge into
       * the GraphQL context.
       */
      context?:
        | Partial<Grafast.Context>
        | ((
            ctx: Partial<Grafast.RequestContext>,
            args: Grafast.ExecutionArgs,
          ) => PromiseOrValue<Partial<Grafast.Context>>);

      /**
       * A list of 'explain' types that should be included in `extensions.explain`.
       *
       * - `plan` will cause the plan JSON to be included
       * - other values are dependent on the plugins in play
       *
       * If set to `true` then all possible explain types will be exposed.
       */
      explain?: boolean | string[];

      timeouts?: GrafastTimeouts;

      /**
       * How many planning layers deep do we allow? Should be handled by validation.
       *
       * A planning layer can happen due to:
       *
       * - A nested selection set
       * - Planning a field return type
       * - A list position
       * - A polymorphic type
       * - A deferred/streamed response
       *
       * These reasons may each cause 1, 2 or 3 planning layers to be added, so this
       * limit should be set quite high - e.g. 6x the selection set depth.
       */
      maxPlanningDepth?: number;
    }
    interface Preset {
      /**
       * Options that control how `grafast` should execute your GraphQL
       * operations.
       */
      grafast?: GraphileConfig.GrafastOptions;
    }
    interface GrafastMiddleware {
      /** Synchronous! */
      validateSchema(event: ValidateSchemaEvent): readonly GraphQLError[];
      /** Synchronous! */
      parseAndValidate(
        event: ParseAndValidateEvent,
      ): DocumentNode | readonly GraphQLError[];
      prepareArgs(
        event: PrepareArgsEvent,
      ): PromiseOrDirect<Grafast.ExecutionArgs>;
      execute(event: ExecuteEvent): ReturnType<typeof execute>;
      subscribe(event: ExecuteEvent): ReturnType<typeof subscribe>;
      /** Synchronous! */
      establishOperationPlan(event: EstablishOperationPlanEvent): OperationPlan;
      executeStep(
        event: ExecuteStepEvent,
      ): PromiseOrDirect<GrafastResultsList<any>>;
    }
    interface Plugin {
      grafast?: {
        middleware?: MiddlewareHandlers<GrafastMiddleware>;
      };
    }
  }
}

/*
 * We register certain things (plans, etc) into the GraphQL "extensions"
 * property on the various GraphQL configs (type, field, argument, etc); this
 * uses declaration merging so that these can be accessed with types.
 */
declare module "graphql" {
  interface GraphQLFieldExtensions<_TSource, _TContext, _TArgs = any> {
    grafast?: Grafast.FieldExtensions;
  }

  interface GraphQLArgumentExtensions {
    grafast?: Grafast.ArgumentExtensions;
  }

  interface GraphQLInputObjectTypeExtensions {
    grafast?: Grafast.InputObjectTypeExtensions;
  }

  interface GraphQLInputFieldExtensions {
    grafast?: Grafast.InputFieldExtensions;
  }

  interface GraphQLObjectTypeExtensions<_TSource = any, _TContext = any> {
    grafast?: Grafast.ObjectTypeExtensions;
  }

  interface GraphQLInterfaceTypeExtensions {
    grafast?: Grafast.InterfaceTypeExtensions;
  }

  interface GraphQLUnionTypeExtensions {
    grafast?: Grafast.UnionTypeExtensions;
  }

  interface GraphQLEnumTypeExtensions {
    grafast?: Grafast.EnumTypeExtensions;
  }

  interface GraphQLEnumValueExtensions {
    grafast?: Grafast.EnumValueExtensions;
  }

  interface GraphQLScalarTypeExtensions {
    grafast?: Grafast.ScalarTypeExtensions;
  }

  interface GraphQLSchemaExtensions {
    grafast?: Grafast.SchemaExtensions;
  }
}
