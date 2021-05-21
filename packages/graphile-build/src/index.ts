import "./global";

import util from "util";

import {
  AddQueriesToSubscriptionsPlugin,
  ClientMutationIdDescriptionPlugin,
  MutationPayloadQueryPlugin,
  MutationPlugin,
  NodePlugin,
  QueryPlugin,
  StandardTypesPlugin,
  SubscriptionPlugin,
  SwallowErrorsPlugin,
} from "./plugins";
import resolveNode from "./resolveNode";
import SchemaBuilder from "./SchemaBuilder";
export { GetDataFromParsedResolveInfoFragmentFunction } from "./makeNewBuild";
export {
  camelCase,
  constantCase,
  constantCaseAll,
  formatInsideUnderscores,
  pluralize,
  singularize,
  upperCamelCase,
  upperFirst,
} from "./utils";

export { SchemaBuilder };

export { LiveCoordinator, LiveMonitor, LiveProvider, LiveSource } from "./Live";

export const getBuilder = async (
  plugins: Array<GraphileEngine.Plugin>,
  options: GraphileEngine.GraphileBuildOptions = {},
): Promise<SchemaBuilder> => {
  const builder = new SchemaBuilder(options);
  for (let i = 0, l = plugins.length; i < l; i++) {
    const plugin = plugins[i];
    if (typeof plugin !== "function") {
      throw new Error(
        `Expected a list of plugin functions, instead list contained a non-function at index ${i}: ${util.inspect(
          plugin,
        )}`,
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
  plugins: Array<GraphileEngine.Plugin>,
  options: GraphileEngine.GraphileBuildOptions = {},
): Promise<import("graphql").GraphQLSchema> => {
  const builder: SchemaBuilder = await getBuilder(plugins, options);
  return builder.buildSchema();
};

export const defaultPlugins: Array<GraphileEngine.Plugin> = [
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
  AddQueriesToSubscriptionsPlugin,
  ClientMutationIdDescriptionPlugin,
  MutationPayloadQueryPlugin,
  MutationPlugin,
  NodePlugin,
  QueryPlugin,
  // resolveNode: EXPERIMENTAL, API might change!
  resolveNode,
  StandardTypesPlugin,
  SubscriptionPlugin,
  SwallowErrorsPlugin,
};
