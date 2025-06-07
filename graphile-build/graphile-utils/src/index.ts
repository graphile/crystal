import type { BaseGraphQLArguments, Step } from "grafast";

export { EXPORTABLE } from "./exportable.js";
export { gql } from "./gql.js";
export { makeAddInflectorsPlugin } from "./makeAddInflectorsPlugin.js";
export { makeAddPgTableConditionPlugin } from "./makeAddPgTableConditionPlugin.js";
export {
  makeAddPgTableOrderByPlugin,
  MakeAddPgTableOrderByPluginOrders,
  NullsSortMethod,
  orderByAscDesc,
  OrderByAscDescOptions,
} from "./makeAddPgTableOrderByPlugin.js";
export {
  changeNullability,
  ChangeNullabilityRules,
  ChangeNullabilityTypeRules,
  makeChangeNullabilityPlugin,
  NullabilitySpec,
  NullabilitySpecString,
} from "./makeChangeNullabilityPlugin.js";
export {
  EnumResolver,
  extendSchema,
  ExtensionDefinition,
  makeExtendSchemaPlugin,
  ObjectPlan,
  ObjectResolver,
  Plans,
  Resolvers,
} from "./makeExtendSchemaPlugin.js";
export {
  jsonPgSmartTags,
  makeJSONPgSmartTagsPlugin,
  makePgSmartTagsFromFilePlugin,
  makePgSmartTagsPlugin,
  pgSmartTags,
  pgSmartTagsFromFile,
  TagsFilePlugin,
} from "./makePgSmartTagsPlugin.js";
export {
  makeProcessSchemaPlugin,
  processSchema,
} from "./makeProcessSchemaPlugin.js";
export {
  makeWrapPlansPlugin,
  PlanWrapperFilter,
  PlanWrapperFilterRule,
  PlanWrapperFn,
  PlanWrapperRule,
  PlanWrapperRules,
  PlanWrapperRulesGenerator,
  wrapPlans,
} from "./makeWrapPlansPlugin.js";

/* eslint-disable @typescript-eslint/no-unused-vars */
declare module "grafast" {
  interface ObjectFieldConfig<
    TSource extends Step = Step,
    TArgs extends BaseGraphQLArguments = any,
    TResultStep extends Step = Step,
  > {
    scope?: Omit<GraphileBuild.ScopeObjectFieldsField, "fieldName">;
  }
}
/* eslint-enable @typescript-eslint/no-unused-vars */
