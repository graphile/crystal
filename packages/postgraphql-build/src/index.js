const { defaultPlugins, getBuilder } = require("graphql-build");
const {
  defaultPlugins: pgDefaultPlugins,
  inflections,
} = require("graphql-build-pg");

const getPostGraphQLBuilder = async (pgConfig, schemas, options = {}) => {
  const { dynamicJson, classicIds, nodeIdFieldName } = options;
  return getBuilder(
    [
      ...(options.prependPlugins || []),
      ...defaultPlugins,
      ...pgDefaultPlugins,
      ...(options.appendPlugins || []),
    ],
    {
      pgConfig: pgConfig,
      pgSchemas: Array.isArray(schemas) ? schemas : [schemas],
      pgExtendedTypes: !!dynamicJson,
      pgInflection: classicIds
        ? inflections.postGraphQLClassicIdsInflection
        : inflections.postGraphQLInflection,
      nodeIdFieldName: nodeIdFieldName || (classicIds ? "id" : "nodeId"),
      pgJwtTypeIdentifier: options.jwtPgTypeIdentifier,
      pgJwtSecret: options.jwtSecret,
      pgDisableDefaultMutations: options.disableDefaultMutations,
    }
  );
};

exports.createPostGraphQLSchema = async (pgConfig, schemas, options) => {
  const builder = await getPostGraphQLBuilder(pgConfig, schemas, options);
  return builder.buildSchema();
};

/*
 * Unless an error occurs, `onNewSchema` is guaranteed to be called before this promise resolves
 */
exports.watchPostGraphQLSchema = async (
  pgConfig,
  schemas,
  options,
  onNewSchema
) => {
  if (typeof onNewSchema !== "function") {
    throw new Error(
      "You cannot call watchPostGraphQLSchema without a function to pass new schemas to"
    );
  }
  const builder = await getPostGraphQLBuilder(pgConfig, schemas, options);
  let released = false;
  await builder.watchSchema(onNewSchema);

  return async function release() {
    if (released) return;
    released = true;
    await builder.unwatchSchema();
  };
};
