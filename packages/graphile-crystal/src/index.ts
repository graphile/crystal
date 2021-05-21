import debugFactory from "debug";
import { crystalPrint, crystalPrintPathIdentity } from "./utils";

debugFactory.formatters.c = crystalPrint;
debugFactory.formatters.p = crystalPrintPathIdentity;

export { crystalEnforce } from "./enforceCrystal";
export { crystalWrapResolve, $$crystalWrapped } from "./resolvers";
export { Plan } from "./plan";
export { CrystalValuesList, CrystalResultsList } from "./interfaces";
export { defer, Deferred } from "./deferred";
export { arraysMatch } from "./utils";
export { Aether } from "./aether";

export {
  // Helpers
  aether,
  debugPlans,
  // List
  list,
  ListPlan,
  // First
  first,
  FirstPlan,
  // Object
  object,
  ObjectPlan,
  // Map
  map,
  MapPlan,
  makeMapper,
  // Access
  access,
  AccessPlan,
  // Each
  each,
  EachPlan,
  // --- INTERNAL ---
  // __ListItem
  __ListItemPlan,
  ListCapablePlan,
  assertListCapablePlan,
  // __ValuePlan
  __ValuePlan,
  // __TrackedObjectPlan
  __TrackedObjectPlan,
} from "./plans";
