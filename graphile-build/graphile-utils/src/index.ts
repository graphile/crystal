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
  ChangeNullabilityRules,
  ChangeNullabilityTypeRules,
  makeChangeNullabilityPlugin,
  NullabilitySpec,
  NullabilitySpecString,
} from "./makeChangeNullabilityPlugin.js";
export {
  EnumResolver,
  ExtensionDefinition,
  makeExtendSchemaPlugin,
  ObjectPlan,
  ObjectResolver,
  Plans,
  Resolvers,
} from "./makeExtendSchemaPlugin.js";
export {
  makeJSONPgSmartTagsPlugin,
  makePgSmartTagsFromFilePlugin,
  makePgSmartTagsPlugin,
  TagsFilePlugin,
} from "./makePgSmartTagsPlugin.js";
export { makeProcessSchemaPlugin } from "./makeProcessSchemaPlugin.js";
export {
  makeWrapPlansPlugin,
  PlanWrapperFilter,
  PlanWrapperFilterRule,
  PlanWrapperFn,
  PlanWrapperRule,
  PlanWrapperRules,
  PlanWrapperRulesGenerator,
} from "./makeWrapPlansPlugin.js";

declare module "grafast" {
  interface ObjectFieldConfig<
    TSource extends Step = Step,
    TArgs extends BaseGraphQLArguments = any,
    TResultStep extends Step = Step,
  > {
    scope?: GraphileBuild.ScopeObjectFieldsField;
  }
}
