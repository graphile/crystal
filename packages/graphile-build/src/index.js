// @flow

import util from "util";
import SchemaBuilder from "./SchemaBuilder";
import {
  StandardTypesPlugin,
  NodePlugin,
  QueryPlugin,
  MutationPlugin,
  SubscriptionPlugin,
  ClientMutationIdDescriptionPlugin,
  MutationPayloadQueryPlugin,
} from "./plugins";
import resolveNode from "./resolveNode";
import type { GraphQLSchema } from "graphql";

import type { Plugin, Options } from "./SchemaBuilder";

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

export type {
  Plugin,
  Options,
  Build,
  BuildExtensionQuery,
  Scope,
  Context,
  Hook,
  WatchUnwatch,
  SchemaListener,
} from "./SchemaBuilder";

export const getBuilder = async (
  plugins: Array<Plugin>,
  options: Options = {}
): Promise<SchemaBuilder> => {
  const builder = new SchemaBuilder();
  for (const plugin of plugins) {
    if (typeof plugin !== "function") {
      throw new Error(
        "Expected a list of plugin functions, instead list contained a non-function: " +
          util.inspect(plugin)
      );
    }
    builder._setPluginName(plugin.displayName || plugin.name);
    await plugin(builder, options);
    builder._setPluginName(null);
  }
  return builder;
};

export const buildSchema = async (
  plugins: Array<Plugin>,
  options: Options = {}
): Promise<GraphQLSchema> => {
  const builder: SchemaBuilder = await getBuilder(plugins, options);
  return builder.buildSchema();
};

export const defaultPlugins: Array<Plugin> = [
  StandardTypesPlugin,
  NodePlugin,
  QueryPlugin,
  MutationPlugin,
  SubscriptionPlugin,
  ClientMutationIdDescriptionPlugin,
  MutationPayloadQueryPlugin,
];

export {
  StandardTypesPlugin,
  NodePlugin,
  QueryPlugin,
  MutationPlugin,
  ClientMutationIdDescriptionPlugin,
  MutationPayloadQueryPlugin,
  // resolveNode: EXPERIMENTAL, API might change!
  resolveNode,
};
