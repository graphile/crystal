import util = require("util");
import SchemaBuilder from "./SchemaBuilder";
import {
  SwallowErrorsPlugin,
  StandardTypesPlugin,
  NodePlugin,
  QueryPlugin,
  MutationPlugin,
  SubscriptionPlugin,
  ClientMutationIdDescriptionPlugin,
  MutationPayloadQueryPlugin,
  AddQueriesToSubscriptionsPlugin,
} from "./plugins";
import resolveNode from "./resolveNode";

import { Plugin, GraphileBuildOptions } from "./SchemaBuilder";

export { GetDataFromParsedResolveInfoFragmentFunction } from "./makeNewBuild";

export {
  constantCaseAll,
  formatInsideUnderscores,
  upperFirst,
  camelCase,
  constantCase,
  upperCamelCase,
  pluralize,
  singularize,
} from "./utils";

export { SchemaBuilder };

export {
  DirectiveMap,
  GraphileResolverContext,
  Plugin,
  GraphileBuildOptions,
  GraphileObjectTypeConfig,
  GraphileInputObjectTypeConfig,
  GraphileUnionTypeConfig,
  FieldWithHooksFunction,
  InputFieldWithHooksFunction,
  Options,
  BuildBase,
  Build,
  Hook,
  WatchUnwatch,
  SchemaListener,
  InitObject,
  Inflection,
  LookAheadData,
  ResolvedLookAhead,
  Scope,
  Context,
  ScopeBuild,
  ContextBuild,
  ScopeInflection,
  ContextInflection,
  ScopeInit,
  ContextInit,
  ScopeGraphQLSchema,
  ContextGraphQLSchema,
  ScopeGraphQLScalarType,
  ContextGraphQLScalarType,
  ScopeGraphQLObjectType,
  ContextGraphQLObjectTypeBase,
  ContextGraphQLObjectType,
  ScopeGraphQLObjectTypeInterfaces,
  ContextGraphQLObjectTypeInterfaces,
  ScopeGraphQLObjectTypeFields,
  ContextGraphQLObjectTypeFields,
  ScopeGraphQLObjectTypeFieldsField,
  ScopeGraphQLObjectTypeFieldsFieldWithFieldName,
  ContextGraphQLObjectTypeFieldsField,
  ScopeGraphQLObjectTypeFieldsFieldArgs,
  ContextGraphQLObjectTypeFieldsFieldArgs,
  ScopeGraphQLInterfaceType,
  ContextGraphQLInterfaceType,
  ScopeGraphQLUnionType,
  ContextGraphQLUnionType,
  ScopeGraphQLUnionTypeTypes,
  ContextGraphQLUnionTypeTypes,
  ScopeGraphQLInputObjectType,
  ContextGraphQLInputObjectType,
  ScopeGraphQLInputObjectTypeFields,
  ContextGraphQLInputObjectTypeFields,
  ScopeGraphQLInputObjectTypeFieldsField,
  ScopeGraphQLInputObjectTypeFieldsFieldWithFieldName,
  ContextGraphQLInputObjectTypeFieldsField,
  ScopeGraphQLEnumType,
  ContextGraphQLEnumType,
  ScopeGraphQLEnumTypeValues,
  ContextGraphQLEnumTypeValues,
  ScopeGraphQLEnumTypeValuesValue,
  ContextGraphQLEnumTypeValuesValue,
  ScopeFinalize,
  ContextFinalize,
  SomeScope,
} from "./SchemaBuilder";

export { LiveSource, LiveProvider, LiveMonitor, LiveCoordinator } from "./Live";

export const getBuilder = async (
  plugins: Array<Plugin>,
  options: GraphileBuildOptions = {}
): Promise<SchemaBuilder> => {
  const builder = new SchemaBuilder(options);
  for (let i = 0, l = plugins.length; i < l; i++) {
    const plugin = plugins[i];
    if (typeof plugin !== "function") {
      throw new Error(
        `Expected a list of plugin functions, instead list contained a non-function at index ${i}: ${util.inspect(
          plugin
        )}`
      );
    }
    // $FlowFixMe: displayName
    builder._setPluginName(plugin.displayName || plugin.name);
    await plugin(builder, options);
    builder._setPluginName(null);
  }
  return builder;
};

export const buildSchema = async (
  plugins: Array<Plugin>,
  options: GraphileBuildOptions = {}
): Promise<import("graphql").GraphQLSchema> => {
  const builder: SchemaBuilder = await getBuilder(plugins, options);
  return builder.buildSchema();
};

export const defaultPlugins: Array<Plugin> = [
  SwallowErrorsPlugin,
  StandardTypesPlugin,
  NodePlugin,
  QueryPlugin,
  MutationPlugin,
  SubscriptionPlugin,
  ClientMutationIdDescriptionPlugin,
  MutationPayloadQueryPlugin,
  AddQueriesToSubscriptionsPlugin,
];

export {
  SwallowErrorsPlugin,
  StandardTypesPlugin,
  NodePlugin,
  QueryPlugin,
  MutationPlugin,
  SubscriptionPlugin,
  ClientMutationIdDescriptionPlugin,
  MutationPayloadQueryPlugin,
  AddQueriesToSubscriptionsPlugin,
  // resolveNode: EXPERIMENTAL, API might change!
  resolveNode,
};
