import debugFactory from "debug";

import { crystalPrint, crystalPrintPathIdentity } from "./utils";

debugFactory.formatters.c = crystalPrint;
debugFactory.formatters.p = crystalPrintPathIdentity;

export { Aether } from "./aether";
export { defer, Deferred } from "./deferred";
export { crystalEnforce } from "./enforceCrystal";
export { CrystalResultsList,CrystalValuesList } from "./interfaces";
export { Plan } from "./plan";
export {
  // --- INTERNAL ---
  // __ListItem
  __ListItemPlan,
  // __TrackedObjectPlan
  __TrackedObjectPlan,
  // __ValuePlan
  __ValuePlan,
  // Access
  access,
  AccessPlan,
  // Helpers
  aether,
  assertListCapablePlan,
  debugPlans,
  // Each
  each,
  EachPlan,
  // First
  first,
  FirstPlan,
  // List
  list,
  ListCapablePlan,
  ListPlan,
  makeMapper,
  // Map
  map,
  MapPlan,
  // Object
  object,
  ObjectPlan,
} from "./plans";
export { $$crystalWrapped,crystalWrapResolve } from "./resolvers";
export { arraysMatch } from "./utils";
