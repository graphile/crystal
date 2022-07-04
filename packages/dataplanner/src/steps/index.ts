import type { OpPlan } from "../opPlan.js";
import { getCurrentOpPlan, getDebug, setDebug } from "../global.js";
import type { BaseGraphQLContext } from "../interfaces.js";
import type { __ValueStep } from "./__value.js";

export function opPlan(): OpPlan {
  return getCurrentOpPlan();
}

export function context<
  TContext extends BaseGraphQLContext = BaseGraphQLContext,
>(): __ValueStep<TContext> {
  return opPlan().contextStep;
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
export { ActualKeyByDesiredKey, makeMapper, map, MapStep } from "./map.js";
export { node, NodeStep } from "./node.js";
export { object, ObjectStep, ObjectPlanMeta } from "./object.js";
export { partitionByIndex } from "./partitionByIndex.js";
export { reverse, reverseArray, ReverseStep } from "./reverse.js";
export { setter, SetterCapableStep, SetterStep } from "./setter.js";

// Internal plans
export { __InputListStep } from "./__inputList.js";
export { __InputObjectStep } from "./__inputObject.js";
export { __InputStaticLeafStep } from "./__inputStaticLeaf.js";
export { __ItemStep } from "./__item.js";
export { __TrackedObjectStep } from "./__trackedObject.js";
export { __ValueStep } from "./__value.js";
