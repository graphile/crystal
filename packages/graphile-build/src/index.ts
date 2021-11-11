import "./global.js";

import type { GraphQLSchema } from "graphql";
import util from "util";

import {
  ClientMutationIdDescriptionPlugin,
  CursorTypePlugin,
  MutationPayloadQueryPlugin,
  MutationPlugin,
  QueryPlugin,
  QueryQueryPlugin,
  SubscriptionPlugin,
  SwallowErrorsPlugin,
} from "./plugins/index.js";
import SchemaBuilder from "./SchemaBuilder.js";
export {
  camelCase,
  constantCase,
  constantCaseAll,
  formatInsideUnderscores,
  pluralize,
  singularize,
  upperCamelCase,
  upperFirst,
} from "./utils.js";

export { SchemaBuilder };

export const getBuilder = async (
  plugins: Array<GraphileEngine.Plugin>,
  options: GraphileEngine.GraphileBuildOptions = {},
): Promise<SchemaBuilder> => {
  const builder = new SchemaBuilder(options);
  for (let i = 0, l = plugins.length; i < l; i++) {
    const plugin = plugins[i];
    if (typeof plugin !== "function") {
      throw new Error(
        `Expected a list of plugin functions, instead list contained a non-function at index ${i} (this could be an ESM/CommonJS compatibility issue - try adding or removing '.default' from the import): ${util.inspect(
          plugin,
        )}`,
      );
    }
    builder._setPluginName(plugin.displayName || plugin.name);
    await plugin(builder, options);
    builder._setPluginName(null);
  }
  return builder;
};

export const buildSchema = async (
  plugins: Array<GraphileEngine.Plugin>,
  options: GraphileEngine.GraphileBuildOptions = {},
): Promise<GraphQLSchema> => {
  const builder = await getBuilder(plugins, options);
  return builder.buildSchema();
};

export const defaultPlugins: Array<GraphileEngine.Plugin> = [
  QueryPlugin,
  MutationPlugin,
  SubscriptionPlugin,
  ClientMutationIdDescriptionPlugin,
  MutationPayloadQueryPlugin,
  CursorTypePlugin,
];

export {
  ClientMutationIdDescriptionPlugin,
  CursorTypePlugin,
  MutationPayloadQueryPlugin,
  MutationPlugin,
  QueryPlugin,
  QueryQueryPlugin,
  SubscriptionPlugin,
  SwallowErrorsPlugin,
};

export { exportSchema } from "./exportSchema.js";
