import SchemaBuilder from "./SchemaBuilder";
import {
  StandardTypesPlugin,
  NodePlugin,
  QueryPlugin,
  MutationPlugin,
  ClientMutationIdDescriptionPlugin,
  MutationPayloadQueryPlugin,
} from "./plugins";

const getBuilder = async (plugins, options = {}) => {
  const builder = new SchemaBuilder(options);
  for (const plugin of plugins) {
    builder._setPluginName(plugin.displayName || plugin.name);
    await plugin(builder, options);
    builder._setPluginName(null);
  }
  return builder;
};

const buildSchema = async (plugins, options = {}) => {
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
