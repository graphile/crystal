import { Aether } from "../aether";
import { getCurrentAether, globalState } from "../global";

export function aether(): Aether {
  return getCurrentAether();
}

export function debugPlans<T>(callback: () => T): T {
  globalState.debug = true;
  const result = callback();
  globalState.debug = false;
  return result;
}

export { list, ListPlan } from "./list";
export { first, FirstPlan } from "./first";
export { object, ObjectPlan } from "./object";
export { map, MapPlan } from "./map";
export { access, AccessPlan } from "./access";

// Internal plans
export { __ListItemPlan } from "./__listItem";
export { __ValuePlan } from "./__value";
export { __TrackedObjectPlan } from "./__trackedObject";
