const SchemaBuilder = require("./SchemaBuilder");
const localPlugins = require("./plugins");

const getBuilder = async (plugins, options) => {
  const builder = new SchemaBuilder();
  for (const plugin of plugins) {
    builder._setPluginName(plugin.displayName || plugin.name);
    await plugin(builder, options);
    builder._setPluginName(null);
  }
  return builder;
};

const buildSchema = async (plugins, options = {}) => {
  const builder = await getBuilder(plugins, options);
  const build = builder.createBuild();
  return build.buildRoot();
};

const defaultPlugins = Object.values(localPlugins).filter(
  fn => typeof fn === "function"
);

Object.assign(exports, localPlugins);
exports.buildSchema = buildSchema;
exports.defaultPlugins = defaultPlugins;
