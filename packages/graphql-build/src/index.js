const SchemaBuilder = require("./SchemaBuilder");
const localPlugins = require("./plugins");

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
  localPlugins.StandardTypesPlugin,
  localPlugins.NodePlugin,
  localPlugins.QueryPlugin,
  localPlugins.MutationPlugin,
  localPlugins.ClientMutationIdDescriptionPlugin,
  localPlugins.MutationPayloadQueryPlugin,
];

Object.assign(exports, localPlugins);
exports.getBuilder = getBuilder;
exports.buildSchema = buildSchema;
exports.defaultPlugins = defaultPlugins;
