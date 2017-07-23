// @flow

import SchemaBuilder from "./SchemaBuilder";
import {
  StandardTypesPlugin,
  NodePlugin,
  QueryPlugin,
  MutationPlugin,
  ClientMutationIdDescriptionPlugin,
  MutationPayloadQueryPlugin,
} from "./plugins";

import type { Plugin, Options } from "./SchemaBuilder";

export type { Plugin };

const getBuilder = async (plugins: Array<Plugin>, options: Options = {}) => {
  const builder = new SchemaBuilder();
  for (const plugin of plugins) {
    builder._setPluginName(plugin.displayName || plugin.name);
    await plugin(builder, options);
    builder._setPluginName(null);
  }
  return builder;
};

const buildSchema = async (plugins: Array<Plugin>, options: {} = {}) => {
  const builder = await getBuilder(plugins, options);
  return builder.buildSchema();
};

const defaultPlugins = [
  StandardTypesPlugin,
  NodePlugin,
  QueryPlugin,
  MutationPlugin,
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
};

export { getBuilder, buildSchema, defaultPlugins };
