import type { Aether } from "../aether";
import { getCurrentAether, getDebug, setDebug } from "../global";
import type { BaseGraphQLContext } from "../interfaces";
import type { __ValuePlan } from "./__value";

export const aether = Object.assign(
  function aether(): Aether {
    return getCurrentAether();
  },
  {
    $$export: {
      moduleName: "graphile-crystal",
      exportName: "aether",
    },
  },
);

export const context = Object.assign(
  function context<
    TContext extends BaseGraphQLContext = BaseGraphQLContext,
  >(): __ValuePlan<TContext> {
    return aether().contextPlan;
  },
  {
    $$export: {
      moduleName: "graphile-crystal",
      exportName: "context",
    },
  },
);

export const debugPlans = Object.assign(
  function debugPlans<T>(callback: () => T): T {
    const oldDebug = getDebug();
    setDebug(true);
    const result = callback();
    setDebug(oldDebug);
    return result;
  },
  {
    $$export: {
      moduleName: "graphile-crystal",
      exportName: "debugPlans",
    },
  },
);

export { access, AccessPlan } from "./access";
export { constant, ConstantPlan } from "./constant";
export { each, EachPlan } from "./each";
export { first, FirstPlan } from "./first";
export { lambda, LambdaPlan } from "./lambda";
export { list, ListPlan } from "./list";
export { makeMapper, map, MapPlan } from "./map";
export { object, ObjectPlan } from "./object";
export { reverse, reverseArray, ReversePlan } from "./reverse";
export { subscribe, SubscribePlan } from "./subscribe";

// Internal plans
export { __ItemPlan } from "./__item";
export { __TrackedObjectPlan } from "./__trackedObject";
export { __ValuePlan } from "./__value";
