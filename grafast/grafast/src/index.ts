import "./thereCanBeOnlyOne.js";

import type LRU from "@graphile/lru";
import debugFactory from "debug";
import type { PluginHook } from "graphile-config";
import type {
  DocumentNode,
  ExecutionArgs as GraphQLExecutionArgs,
  GraphQLError,
  OperationDefinitionNode,
} from "graphql";

import type { __InputDynamicScalarStep } from "./steps/__inputDynamicScalar.js";

type PromiseOrValue<T> = T | Promise<T>;

import { exportAs, exportAsMany } from "./exportAs.js";
import { grafastPrint } from "./grafastPrint.js";
import {
  EnumPlans,
  FieldPlans,
  GrafastPlans,
  InputObjectPlans,
  InterfaceOrUnionPlans,
  makeGrafastSchema,
  ObjectPlans,
  ScalarPlans,
} from "./makeGrafastSchema.js";

// HACK: doing this here feels "naughty".
debugFactory.formatters.c = grafastPrint;

import { defer, Deferred } from "./deferred.js";
// Handy for debugging
import { isDev, noop } from "./dev.js";
import { OperationPlan } from "./engine/OperationPlan.js";
import {
  GrafastError,
  isGrafastError,
  isSafeError,
  SafeError,
} from "./error.js";
import { execute } from "./execute.js";
import { grafast, grafastSync } from "./grafastGraphql.js";
import type {
  $$cacheByOperation,
  $$hooked,
  $$queryCache,
  CacheByOperationEntry,
  GrafastTimeouts,
  ScalarInputPlanResolver,
} from "./interfaces.js";
import {
  $$bypassGraphQL,
  $$eventEmitter,
  $$extensions,
  $$idempotent,
  $$verbatim,
  ArgumentApplyPlanResolver,
  ArgumentInputPlanResolver,
  BaseEventMap,
  BaseGraphQLArguments,
  BaseGraphQLRootValue,
  BaseGraphQLVariables,
  EnumValueApplyPlanResolver,
  EventCallback,
  EventMapKey,
  ExecutionEventEmitter,
  ExecutionEventMap,
  ExecutionExtra,
  FieldArgs,
  FieldInfo,
  FieldPlanResolver,
  GrafastArgumentConfig,
  GrafastFieldConfig,
  GrafastFieldConfigArgumentMap,
  GrafastInputFieldConfig,
  GrafastPlanJSON,
  GrafastResultsList,
  GrafastResultStreamList,
  GrafastSubscriber,
  GrafastValuesList,
  InputObjectFieldApplyPlanResolver,
  InputObjectFieldInputPlanResolver,
  InputObjectTypeInputPlanResolver,
  InputStep,
  JSONArray,
  JSONObject,
  JSONValue,
  Maybe,
  NodeIdCodec,
  NodeIdHandler,
  OutputPlanForType,
  PolymorphicData,
  PromiseOrDirect,
  ScalarPlanResolver,
  StepOptimizeOptions,
  StepStreamOptions,
  TypedEventEmitter,
} from "./interfaces.js";
import { polymorphicWrap } from "./polymorphic.js";
import {
  assertExecutableStep,
  assertListCapableStep,
  assertModifierStep,
  BaseStep,
  ExecutableStep,
  isExecutableStep,
  isListCapableStep,
  isListLikeStep,
  isModifierStep,
  isObjectLikeStep,
  isStreamableStep,
  ListCapableStep,
  ListLikeStep,
  ModifierStep,
  ObjectLikeStep,
  PolymorphicStep,
  StreamableStep,
  UnbatchedExecutableStep,
} from "./step.js";
import {
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
  applyTransforms,
  ApplyTransformsStep,
  assertEdgeCapableStep,
  assertPageInfoCapableStep,
  connection,
  ConnectionCapableStep,
  ConnectionStep,
  constant,
  ConstantStep,
  context,
  debugPlans,
  each,
  EdgeCapableStep,
  EdgeStep,
  error,
  ErrorStep,
  filter,
  FilterPlanMemo,
  first,
  FirstStep,
  GraphQLItemHandler,
  graphqlItemHandler,
  graphqlResolver,
  GraphQLResolverStep,
  groupBy,
  GroupByPlanMemo,
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
  node,
  NodeStep,
  object,
  ObjectPlanMeta,
  ObjectStep,
  operationPlan,
  PageInfoCapableStep,
  partitionByIndex,
  polymorphicBranch,
  PolymorphicBranchMatcher,
  PolymorphicBranchMatchers,
  PolymorphicBranchStep,
  proxy,
  ProxyStep,
  remapKeys,
  RemapKeysStep,
  reverse,
  reverseArray,
  ReverseStep,
  rootValue,
  setter,
  SetterCapableStep,
  SetterStep,
  specFromNodeId,
  trackedContext,
  trackedRootValue,
} from "./steps/index.js";
import { stringifyPayload } from "./stringifyPayload.js";
import { stripAnsi } from "./stripAnsi.js";
import { subscribe } from "./subscribe.js";
import {
  arrayOfLength,
  arraysMatch,
  getEnumValueConfig,
  GrafastInputFieldConfigMap,
  GrafastInputObjectType,
  GrafastObjectType,
  inputObjectFieldSpec,
  InputObjectTypeSpec,
  isPromiseLike,
  newGrafastFieldConfigBuilder,
  newInputObjectTypeBuilder,
  newObjectTypeBuilder,
  objectFieldSpec,
  objectSpec,
  ObjectTypeFields,
  ObjectTypeSpec,
  stepADependsOnStepB,
  stepAMayDependOnStepB,
  stepsAreInSamePhase,
} from "./utils.js";

export { isAsyncIterable } from "iterall";
export {
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
  $$verbatim,
  access,
  AccessStep,
  ActualKeyByDesiredKey,
  applyTransforms,
  ApplyTransformsStep,
  ArgumentApplyPlanResolver,
  ArgumentInputPlanResolver,
  arrayOfLength,
  arraysMatch,
  assertEdgeCapableStep,
  assertExecutableStep,
  assertListCapableStep,
  assertModifierStep,
  assertPageInfoCapableStep,
  BaseEventMap,
  BaseGraphQLArguments,
  BaseGraphQLRootValue,
  BaseGraphQLVariables,
  BaseStep,
  connection,
  ConnectionCapableStep,
  ConnectionStep,
  constant,
  ConstantStep,
  context,
  debugPlans,
  defer,
  Deferred,
  each,
  EdgeCapableStep,
  EdgeStep,
  EnumPlans,
  EnumValueApplyPlanResolver,
  error,
  ErrorStep,
  EventCallback,
  EventMapKey,
  ExecutableStep,
  execute,
  ExecutionEventEmitter,
  ExecutionEventMap,
  ExecutionExtra,
  exportAs,
  exportAsMany,
  FieldArgs,
  FieldInfo,
  FieldPlanResolver,
  FieldPlans,
  filter,
  FilterPlanMemo,
  first,
  FirstStep,
  getEnumValueConfig,
  grafast,
  GrafastArgumentConfig,
  GrafastError,
  GrafastFieldConfig,
  GrafastFieldConfigArgumentMap,
  grafast as grafastGraphql,
  grafastSync as grafastGraphqlSync,
  GrafastInputFieldConfig,
  GrafastInputFieldConfigMap,
  GrafastInputObjectType,
  GrafastObjectType,
  GrafastPlanJSON,
  GrafastPlans,
  grafastPrint,
  GrafastResultsList,
  GrafastResultStreamList,
  GrafastSubscriber,
  grafastSync,
  GrafastValuesList,
  GraphQLItemHandler,
  graphqlItemHandler,
  graphqlResolver,
  GraphQLResolverStep,
  groupBy,
  GroupByPlanMemo,
  InputObjectFieldApplyPlanResolver,
  InputObjectFieldInputPlanResolver,
  inputObjectFieldSpec,
  InputObjectPlans,
  InputObjectTypeInputPlanResolver,
  InputObjectTypeSpec,
  InputStep,
  InterfaceOrUnionPlans,
  isDev,
  isExecutableStep,
  isGrafastError,
  isListCapableStep,
  isListLikeStep,
  isModifierStep,
  isObjectLikeStep,
  isPromiseLike,
  isSafeError,
  isStreamableStep,
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
  makeGrafastSchema,
  Maybe,
  ModifierStep,
  newGrafastFieldConfigBuilder,
  newInputObjectTypeBuilder,
  newObjectTypeBuilder,
  node,
  NodeIdCodec,
  NodeIdHandler,
  NodeStep,
  noop,
  object,
  objectFieldSpec,
  ObjectLikeStep,
  ObjectPlanMeta,
  ObjectPlans,
  objectSpec,
  ObjectStep,
  ObjectTypeFields,
  ObjectTypeSpec,
  OperationPlan,
  operationPlan,
  OutputPlanForType,
  PageInfoCapableStep,
  partitionByIndex,
  polymorphicBranch,
  PolymorphicBranchMatcher,
  PolymorphicBranchMatchers,
  PolymorphicBranchStep,
  PolymorphicData,
  PolymorphicStep,
  polymorphicWrap,
  PromiseOrDirect,
  proxy,
  ProxyStep,
  remapKeys,
  RemapKeysStep,
  reverse,
  reverseArray,
  ReverseStep,
  rootValue,
  SafeError,
  ScalarPlanResolver,
  ScalarPlans,
  setter,
  SetterCapableStep,
  SetterStep,
  specFromNodeId,
  stepADependsOnStepB,
  stepAMayDependOnStepB,
  StepOptimizeOptions,
  stepsAreInSamePhase,
  StepStreamOptions,
  StreamableStep,
  stringifyPayload,
  stripAnsi,
  subscribe,
  trackedContext,
  trackedRootValue,
  TypedEventEmitter,
  UnbatchedExecutableStep,
};

exportAsMany("grafast", {
  exportAs,
  exportAsMany,
  grafastPrint,
  makeGrafastSchema,
  OperationPlan,
  defer,
  execute,
  grafast,
  grafastSync,
  subscribe,
  __InputListStep,
  stringifyPayload,
  __InputObjectStep,
  __InputStaticLeafStep,
  assertExecutableStep,
  assertListCapableStep,
  assertModifierStep,
  isExecutableStep,
  isListCapableStep,
  isModifierStep,
  isObjectLikeStep,
  isListLikeStep,
  isStreamableStep,
  __ItemStep,
  __ListTransformStep,
  __TrackedValueStep,
  __ValueStep,
  access,
  AccessStep,
  operationPlan,
  connection,
  assertEdgeCapableStep,
  assertPageInfoCapableStep,
  ConnectionStep,
  constant,
  ConstantStep,
  context,
  rootValue,
  trackedContext,
  trackedRootValue,
  isGrafastError,
  debugPlans,
  each,
  error,
  ErrorStep,
  groupBy,
  filter,
  partitionByIndex,
  listTransform,
  first,
  node,
  specFromNodeId,
  polymorphicBranch,
  PolymorphicBranchStep,
  makeDecodeNodeId,
  proxy,
  applyTransforms,
  ApplyTransformsStep,
  ProxyStep,
  graphqlResolver,
  GraphQLResolverStep,
  GraphQLItemHandler,
  graphqlItemHandler,
  NodeStep,
  FirstStep,
  last,
  LastStep,
  lambda,
  LambdaStep,
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
  SetterStep,
  listen,
  ListenStep,
  polymorphicWrap,
  stripAnsi,
  arraysMatch,
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
  isPromiseLike,
  isDev,
  noop,
  getEnumValueConfig,
  loadOne,
  loadMany,
  loadOneCallback,
  loadManyCallback,
  LoadedRecordStep,
  LoadStep,
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
      GraphQLExecutionArgs,
      "schema" | "document" | "rootValue" | "variableValues" | "operationName"
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
      inputPlan?: ArgumentInputPlanResolver;
      applyPlan?: ArgumentApplyPlanResolver;
      autoApplyAfterParentPlan?: boolean;
      autoApplyAfterParentSubscribePlan?: boolean;
    }

    interface InputObjectTypeExtensions {
      inputPlan?: InputObjectTypeInputPlanResolver;
    }

    interface InputFieldExtensions {
      // fooPlan?: InputObjectFieldPlanResolver<any, any, any, any>;
      inputPlan?: InputObjectFieldInputPlanResolver;
      applyPlan?: InputObjectFieldApplyPlanResolver;
      autoApplyAfterParentInputPlan?: boolean;
      autoApplyAfterParentApplyPlan?: boolean;
    }

    interface ObjectTypeExtensions {
      assertStep?:
        | ((step: ExecutableStep) => asserts step is ExecutableStep)
        | { new (...args: any[]): ExecutableStep }
        | null;
    }

    interface EnumTypeExtensions {}

    interface EnumValueExtensions {
      /**
       * EXPERIMENTAL!
       *
       * @experimental
       */
      applyPlan?: EnumValueApplyPlanResolver<any>;
    }

    interface ScalarTypeExtensions {
      plan?: ScalarPlanResolver;
      inputPlan?: ScalarInputPlanResolver;
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
    }
    interface Preset {
      /**
       * Options that control how `grafast` should execute your GraphQL
       * operations.
       */
      grafast?: GraphileConfig.GrafastOptions;
    }
    interface GrafastHooks {
      args: PluginHook<
        (event: {
          args: Grafast.ExecutionArgs;
          ctx: Grafast.RequestContext;
          resolvedPreset: GraphileConfig.ResolvedPreset;
        }) => PromiseOrValue<void>
      >;
    }
    interface Plugin {
      grafast?: {
        hooks?: GrafastHooks;
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
