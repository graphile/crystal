import type { Aether } from "../aether";
import { getCurrentAether, globalState } from "../global";
import type { BaseGraphQLContext } from "../interfaces";
import type { __ValuePlan } from "./__value";

export function aether(): Aether {
  return getCurrentAether();
}

export function context(): __ValuePlan<BaseGraphQLContext> {
  return aether().contextPlan;
}

export function debugPlans<T>(callback: () => T): T {
  globalState.debug = true;
  const result = callback();
  globalState.debug = false;
  return result;
}

export { access, AccessPlan } from "./access";
export { each, EachPlan } from "./each";
export { first, FirstPlan } from "./first";
export { list, ListPlan } from "./list";
export { makeMapper, map, MapPlan } from "./map";
export { object, ObjectPlan } from "./object";

// Internal plans
export {
  __ListItemPlan,
  assertListCapablePlan,
  ListCapablePlan,
} from "./__listItem";
export { __TrackedObjectPlan } from "./__trackedObject";
export { __ValuePlan } from "./__value";
