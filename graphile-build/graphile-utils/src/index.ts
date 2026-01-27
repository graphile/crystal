import type { BaseGraphQLArguments, Step } from "grafast";

export { EXPORTABLE } from "./exportable.js";
export { gql } from "./gql.js";
export { makeAddInflectorsPlugin } from "./makeAddInflectorsPlugin.js";
export {
  addPgTableCondition,
  makeAddPgTableConditionPlugin,
} from "./makeAddPgTableConditionPlugin.js";
export type {
  MakeAddPgTableOrderByPluginOrders,
  NullsSortMethod,
  OrderByAscDescOptions,
} from "./makeAddPgTableOrderByPlugin.js";
export {
  addPgTableOrderBy,
  makeAddPgTableOrderByPlugin,
  orderByAscDesc,
} from "./makeAddPgTableOrderByPlugin.js";
export type {
  ChangeNullabilityRules,
  ChangeNullabilityTypeRules,
  NullabilitySpec,
  NullabilitySpecString,
} from "./makeChangeNullabilityPlugin.js";
export {
  changeNullability,
  makeChangeNullabilityPlugin,
} from "./makeChangeNullabilityPlugin.js";
export type {
  EnumResolver,
  ExtensionDefinition,
  ObjectPlan,
  ObjectResolver,
  Plans,
  Resolvers,
} from "./makeExtendSchemaPlugin.js";
export {
  extendSchema,
  makeExtendSchemaPlugin,
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
export type {
  PlanWrapperFilter,
  PlanWrapperFilterRule,
  PlanWrapperFn,
  PlanWrapperRule,
  PlanWrapperRules,
  PlanWrapperRulesGenerator,
} from "./makeWrapPlansPlugin.js";
export { makeWrapPlansPlugin, wrapPlans } from "./makeWrapPlansPlugin.js";

/* eslint-disable @typescript-eslint/no-unused-vars */
declare module "grafast" {
  interface ScalarPlan<TInternal = any, TExternal = any> {
    scope?: GraphileBuild.ScopeScalar;
  }
  interface EnumPlan {
    scope?: GraphileBuild.ScopeEnum;
  }
  interface EnumValueConfig {
    scope?: Omit<GraphileBuild.ScopeEnumValuesValue, "valueName">;
  }
  interface ObjectPlan<TSource extends Step = Step> {
    scope?: GraphileBuild.ScopeObject;
  }
  interface ObjectFieldConfig<
    TSource extends Step = Step,
    TArgs extends BaseGraphQLArguments = any,
    TResultStep extends Step = Step,
  > {
    scope?: Omit<GraphileBuild.ScopeObjectFieldsField, "fieldName">;
  }
  interface UnionPlan<TSpecifier = any, TSource extends Step = Step> {
    scope?: GraphileBuild.ScopeUnion;
  }
  interface InterfacePlan<TSpecifier = any, TSource extends Step = Step> {
    scope?: GraphileBuild.ScopeInterface;
    fields?: {
      [fieldName: string]: {
        scope?: GraphileBuild.ScopeInterfaceFieldsField;
      };
    };
  }
  interface InputObjectPlan {
    scope?: GraphileBuild.ScopeInputObject;
  }
  interface InputObjectFieldConfig<TParent = any, TData = any> {
    scope?: Omit<GraphileBuild.ScopeInputObjectFieldsField, "fieldName">;
  }
}
/* eslint-enable @typescript-eslint/no-unused-vars */
