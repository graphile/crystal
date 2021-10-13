import chalk from "chalk";
import debugFactory from "debug";

import { crystalPrint, crystalPrintPathIdentity } from "./crystalPrint";

debugFactory.formatters.c = crystalPrint;
debugFactory.formatters.p = (pathIdentity) =>
  chalk.bold.yellow(crystalPrintPathIdentity(pathIdentity));

export { crystalPrintPathIdentity };

export { Aether } from "./aether";
export { ROOT_PATH } from "./constants";
export { defer, Deferred } from "./deferred";
export { crystalEnforce } from "./enforceCrystal";
export {
  InputListPlan,
  InputObjectPlan,
  InputPlan,
  InputStaticLeafPlan,
} from "./input";
export {
  ArgumentPlanResolver,
  BaseGraphQLArguments,
  BaseGraphQLContext,
  BaseGraphQLRootValue,
  BaseGraphQLVariables,
  CrystalResultsList,
  CrystalResultStreamList,
  CrystalSubscriber,
  CrystalValuesList,
  ExecutablePlanResolver,
  GraphileCrystalFieldConfig,
  InputObjectFieldPlanResolver,
  PolymorphicData,
} from "./interfaces";
export {
  BasePlan,
  ExecutablePlan,
  isExecutablePlan,
  isModifierPlan,
  isObjectLikePlan,
  isStreamablePlan,
  ModifierPlan,
  ObjectLikePlan,
  PolymorphicPlan,
  StreamablePlan,
} from "./plan";
export {
  __ListItemPlan,
  __TrackedObjectPlan,
  __ValuePlan,
  access,
  AccessPlan,
  aether,
  assertListCapablePlan,
  constant,
  ConstantPlan,
  context,
  debugPlans,
  each,
  EachPlan,
  first,
  FirstPlan,
  lambda,
  LambdaPlan,
  list,
  ListCapablePlan,
  ListPlan,
  makeMapper,
  map,
  MapPlan,
  object,
  ObjectPlan,
  reverse,
  reverseArray,
  ReversePlan,
  subscribe,
  SubscribePlan,
} from "./plans";
export { polymorphicWrap, resolveType } from "./polymorphic";
export {
  $$crystalWrapped,
  crystalWrapResolve,
  makeCrystalSubscriber,
} from "./resolvers";
export {
  arraysMatch,
  inputObjectFieldSpec,
  inputObjectSpec,
  objectFieldSpec,
  objectSpec,
  planGroupsOverlap,
} from "./utils";

// Handy for debugging
export { getCurrentParentPathIdentity } from "./global";
