import debugFactory from "debug";

import { crystalPrint, crystalPrintPathIdentity } from "./utils";

debugFactory.formatters.c = crystalPrint;
debugFactory.formatters.p = crystalPrintPathIdentity;

export { Aether } from "./aether";
export { defer, Deferred } from "./deferred";
export { crystalEnforce } from "./enforceCrystal";
export {
  BaseGraphQLArguments,
  BaseGraphQLContext,
  BaseGraphQLRootValue,
  BaseGraphQLVariables,
  CrystalResultsList,
  CrystalValuesList,
  GraphileCrystalFieldConfig,
  PlanResolver,
} from "./interfaces";
export { Plan } from "./plan";
export {
  __ListItemPlan,
  __TrackedObjectPlan,
  __ValuePlan,
  access,
  AccessPlan,
  aether,
  assertListCapablePlan,
  context,
  debugPlans,
  each,
  EachPlan,
  first,
  FirstPlan,
  list,
  ListCapablePlan,
  ListPlan,
  makeMapper,
  map,
  MapPlan,
  object,
  ObjectPlan,
} from "./plans";
export {
  $$crystalWrapped,
  crystalWrapResolve,
  crystalWrapSubscribe,
} from "./resolvers";
export { arraysMatch, objectFieldSpec, objectSpec } from "./utils";
