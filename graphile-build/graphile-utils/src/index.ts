import type { BaseGraphQLArguments, Step } from "grafast";

export { EXPORTABLE } from "./exportable.ts";
export { gql } from "./gql.ts";
export { makeAddInflectorsPlugin } from "./makeAddInflectorsPlugin.ts";
export {
  addPgTableCondition,
  makeAddPgTableConditionPlugin,
} from "./makeAddPgTableConditionPlugin.ts";
export type {
  MakeAddPgTableOrderByPluginOrders,
  NullsSortMethod,
  OrderByAscDescOptions,
} from "./makeAddPgTableOrderByPlugin.ts";
export {
  addPgTableOrderBy,
  makeAddPgTableOrderByPlugin,
  orderByAscDesc,
} from "./makeAddPgTableOrderByPlugin.ts";
export type {
  ChangeNullabilityRules,
  ChangeNullabilityTypeRules,
  NullabilitySpec,
  NullabilitySpecString,
} from "./makeChangeNullabilityPlugin.ts";
export {
  changeNullability,
  makeChangeNullabilityPlugin,
} from "./makeChangeNullabilityPlugin.ts";
export type {
  EnumResolver,
  ExtensionDefinition,
  ObjectPlan,
  ObjectResolver,
  Plans,
  Resolvers,
} from "./makeExtendSchemaPlugin.ts";
export {
  extendSchema,
  makeExtendSchemaPlugin,
} from "./makeExtendSchemaPlugin.ts";
export {
  jsonPgSmartTags,
  makeJSONPgSmartTagsPlugin,
  makePgSmartTagsFromFilePlugin,
  makePgSmartTagsPlugin,
  pgSmartTags,
  pgSmartTagsFromFile,
  TagsFilePlugin,
} from "./makePgSmartTagsPlugin.ts";
export {
  makeProcessSchemaPlugin,
  processSchema,
} from "./makeProcessSchemaPlugin.ts";
export type {
  PlanWrapperFilter,
  PlanWrapperFilterRule,
  PlanWrapperFn,
  PlanWrapperRule,
  PlanWrapperRules,
  PlanWrapperRulesGenerator,
} from "./makeWrapPlansPlugin.ts";
export { makeWrapPlansPlugin, wrapPlans } from "./makeWrapPlansPlugin.ts";

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
