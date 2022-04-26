import type { Aether } from "../aether";
import { getCurrentAether, getDebug, setDebug } from "../global";
import type { BaseGraphQLContext } from "../interfaces";
import type { __ValuePlan } from "./__value";

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

export { access, AccessPlan } from "./access";
export {
  connection,
  ConnectionCapablePlan,
  ConnectionPlan,
  EdgeCapablePlan,
  EdgePlan,
  PageInfoCapablePlan,
} from "./connection";
export { constant, ConstantPlan } from "./constant";
export { each } from "./each";
export { filter } from "./filter";
export { first, FirstPlan } from "./first";
export { groupBy } from "./groupBy";
export { lambda, LambdaPlan } from "./lambda";
export { last, LastPlan } from "./last";
export { list, ListPlan } from "./list";
export { listen, ListenPlan } from "./listen";
export { __ListTransformPlan, listTransform } from "./listTransform";
export { makeMapper, map, MapPlan } from "./map";
export { node, NodePlan } from "./node";
export { object, ObjectPlan } from "./object";
export { partitionByIndex } from "./partitionByIndex";
export { reverse, reverseArray, ReversePlan } from "./reverse";

// Internal plans
export { __InputListPlan } from "./__inputList";
export { __InputObjectPlan } from "./__inputObject";
export { __InputStaticLeafPlan } from "./__inputStaticLeaf";
export { __ItemPlan } from "./__item";
export { __TrackedObjectPlan } from "./__trackedObject";
export { __ValuePlan } from "./__value";
