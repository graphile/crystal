import debugFactory from "debug";

import { crystalPrint, crystalPrintPathIdentity } from "./utils";

debugFactory.formatters.c = crystalPrint;
debugFactory.formatters.p = crystalPrintPathIdentity;

export { Aether } from "./aether";
export { defer, Deferred } from "./deferred";
export { crystalEnforce } from "./enforceCrystal";
export {
  CrystalResultsList,
  CrystalValuesList,
  PlanResolver,
  GraphileCrystalFieldConfig,
  BaseGraphQLContext,
  BaseGraphQLArguments,
  BaseGraphQLVariables,
  BaseGraphQLRootValue,
} from "./interfaces";
export { Plan } from "./plan";
export {
  __ListItemPlan,
  __TrackedObjectPlan,
  __ValuePlan,
  access,
  AccessPlan,
  aether,
  context,
  assertListCapablePlan,
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
export { $$crystalWrapped, crystalWrapResolve } from "./resolvers";
export { arraysMatch, objectSpec } from "./utils";
