import type { Aether } from "../aether.js";
import { getCurrentAether, getDebug, setDebug } from "../global.js";
import type { BaseGraphQLContext } from "../interfaces.js";
import type { __ValuePlan } from "./__value.js";

export function aether(): Aether {
  return getCurrentAether();
}

export function context<
  TContext extends BaseGraphQLContext = BaseGraphQLContext,
>(): __ValuePlan<TContext> {
  return aether().contextPlan;
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

export { access, AccessPlan } from "./access.js";
export {
  connection,
  ConnectionCapablePlan,
  ConnectionPlan,
  EdgeCapablePlan,
  EdgePlan,
  PageInfoCapablePlan,
} from "./connection.js";
export { constant, ConstantPlan } from "./constant.js";
export { each } from "./each.js";
export { filter, FilterPlanMemo } from "./filter.js";
export { first, FirstPlan } from "./first.js";
export { groupBy, GroupByPlanMemo } from "./groupBy.js";
export { lambda, LambdaPlan } from "./lambda.js";
export { last, LastPlan } from "./last.js";
export { list, ListPlan } from "./list.js";
export { listen, ListenPlan } from "./listen.js";
export {
  __ListTransformPlan,
  listTransform,
  ListTransformItemPlanCallback,
  ListTransformOptions,
  ListTransformReduce,
} from "./listTransform.js";
export { ActualKeyByDesiredKey, makeMapper, map, MapPlan } from "./map.js";
export { node, NodePlan } from "./node.js";
export { object, ObjectPlan, ObjectPlanMeta } from "./object.js";
export { partitionByIndex } from "./partitionByIndex.js";
export { reverse, reverseArray, ReversePlan } from "./reverse.js";
export { setter, SetterCapablePlan, SetterPlan } from "./setter.js";

// Internal plans
export { __InputListPlan } from "./__inputList.js";
export { __InputObjectPlan } from "./__inputObject.js";
export { __InputStaticLeafPlan } from "./__inputStaticLeaf.js";
export { __ItemPlan } from "./__item.js";
export { __TrackedObjectPlan } from "./__trackedObject.js";
export { __ValuePlan } from "./__value.js";
