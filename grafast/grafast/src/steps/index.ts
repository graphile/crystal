import { currentLayerPlan } from "../engine/lib/withGlobalLayerPlan.js";
import { getDebug, setDebug } from "../global.js";
import type { __TrackedValueStep, OperationPlan } from "../index.js";
import type { __ValueStep } from "./__value.js";

export function operationPlan(): OperationPlan {
  return currentLayerPlan().operationPlan;
}

export function context<
  TContext extends Grafast.Context = Grafast.Context,
>(): __ValueStep<TContext> {
  return operationPlan().contextStep as __ValueStep<any>;
}

export function rootValue(): __ValueStep<Record<string, any>> {
  return operationPlan().rootValueStep as __ValueStep<any>;
}

export function trackedContext<
  TContext extends Grafast.Context = Grafast.Context,
>(): __TrackedValueStep<TContext> {
  return operationPlan().trackedContextStep as __TrackedValueStep<any>;
}

export function trackedRootValue(): __TrackedValueStep<Record<string, any>> {
  return operationPlan().trackedRootValueStep as __TrackedValueStep<any>;
}

/**
 * Turns on debug mode, calls the callback, and then turns debug mode back off
 * again.
 */
export function debugPlans<T>(callback: () => T): T {
  const oldDebug = getDebug();
  setDebug(true);
  const result = callback();
  setDebug(oldDebug);
  return result;
}

export {
  __FlagStep,
  assertNotNull,
  inhibitOnNull,
  trap,
  TRAP_ERROR,
  TRAP_ERROR_OR_INHIBITED,
  TRAP_INHIBITED,
} from "./__flag.js";
export { access, AccessStep } from "./access.js";
export {
  assertEdgeCapableStep,
  assertPageInfoCapableStep,
  connection,
  ConnectionCapableStep,
  ConnectionStep,
  EdgeCapableStep,
  EdgeStep,
  PageInfoCapableStep,
} from "./connection.js";
export { constant, ConstantStep } from "./constant.js";
export { each } from "./each.js";
export { error, ErrorStep } from "./error.js";
export { filter, FilterPlanMemo } from "./filter.js";
export { first, FirstStep } from "./first.js";
export { groupBy, GroupByPlanMemo } from "./groupBy.js";
export { lambda, LambdaStep } from "./lambda.js";
export { last, LastStep } from "./last.js";
export { list, ListStep } from "./list.js";
export { listen, ListenStep } from "./listen.js";
export {
  __ListTransformStep,
  listTransform,
  ListTransformItemPlanCallback,
  ListTransformOptions,
  ListTransformReduce,
} from "./listTransform.js";
export { makeDecodeNodeId, node, NodeStep, specFromNodeId } from "./node.js";
export { object, ObjectPlanMeta, ObjectStep } from "./object.js";
export { partitionByIndex } from "./partitionByIndex.js";
export {
  ActualKeyByDesiredKey,
  remapKeys,
  RemapKeysStep,
} from "./remapKeys.js";
export { reverse, reverseArray, ReverseStep } from "./reverse.js";
export { setter, SetterCapableStep, SetterStep } from "./setter.js";
export { sideEffect, SideEffectStep } from "./sideEffect.js";

// Internal plans
export { __InputListStep } from "./__inputList.js";
export {
  __InputObjectStep,
  __InputObjectStepWithDollars,
} from "./__inputObject.js";
export { __InputStaticLeafStep } from "./__inputStaticLeaf.js";
export { __ItemStep } from "./__item.js";
export {
  __TrackedValueStep,
  __TrackedValueStepWithDollars,
} from "./__trackedValue.js";
export { __ValueStep } from "./__value.js";
export { applyTransforms, ApplyTransformsStep } from "./applyTransforms.js";
export { condition, ConditionStep } from "./condition.js";
export {
  GraphQLItemHandler,
  graphqlItemHandler,
  graphqlResolver,
  GraphQLResolverStep,
} from "./graphqlResolver.js";
export {
  LoadedRecordStep,
  loadMany,
  LoadManyCallback,
  loadManyCallback,
  loadOne,
  LoadOneCallback,
  loadOneCallback,
  LoadOptions,
  LoadStep,
} from "./load.js";
export {
  polymorphicBranch,
  PolymorphicBranchMatcher,
  PolymorphicBranchMatchers,
  PolymorphicBranchStep,
} from "./polymorphicBranch.js";
export { proxy, ProxyStep } from "./proxy.js";
