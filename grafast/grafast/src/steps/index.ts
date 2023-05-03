import { currentLayerPlan } from "../engine/lib/withGlobalLayerPlan.js";
import { getDebug, setDebug } from "../global.js";
import type { OperationPlan } from "../index.js";
import type { __ValueStep } from "./__value.js";

export function operationPlan(): OperationPlan {
  return currentLayerPlan().operationPlan;
}

export function context<
  TContext extends Grafast.Context = Grafast.Context,
>(): __ValueStep<TContext> {
  return operationPlan().contextStep as __ValueStep<any>;
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

export { access, AccessStep } from "./access.js";
export {
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
export { node, NodeStep, specFromNodeId } from "./node.js";
export { object, ObjectPlanMeta, ObjectStep } from "./object.js";
export { partitionByIndex } from "./partitionByIndex.js";
export {
  ActualKeyByDesiredKey,
  remapKeys,
  RemapKeysStep,
} from "./remapKeys.js";
export { reverse, reverseArray, ReverseStep } from "./reverse.js";
export { setter, SetterCapableStep, SetterStep } from "./setter.js";

// Internal plans
export { __InputListStep } from "./__inputList.js";
export { __InputObjectStep } from "./__inputObject.js";
export { __InputStaticLeafStep } from "./__inputStaticLeaf.js";
export { __ItemStep } from "./__item.js";
export { __TrackedValueStep } from "./__trackedValue.js";
export { __ValueStep } from "./__value.js";
export { deepEval, DeepEvalStep } from "./deepEval.js";
export {
  GraphQLItemHandler,
  graphqlItemHandler,
  graphqlResolver,
  GraphQLResolverStep,
} from "./graphqlResolver.js";
export {
  LoadCallback,
  loadCallback,
  LoadedRecordStep,
  loadMany,
  loadOne,
  LoadOptions,
  LoadStep,
} from "./load.js";
export { proxy, ProxyStep } from "./proxy.js";
