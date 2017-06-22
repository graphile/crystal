const SchemaBuilder = require("./SchemaBuilder");

const getBuilder = async (plugins, options) => {
  const builder = new SchemaBuilder();
  for (const plugin of plugins) {
    await plugin(builder, options);
  }
  return builder;
};

const buildSchema = async (plugins, options) => {
  const builder = await getBuilder(plugins, options);
  const build = builder.createBuild();
  return build.buildRoot();
};

exports.buildSchema = buildSchema;
