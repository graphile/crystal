const { defaultPlugins, buildSchema } = require("graphql-build");
const {
  defaultPlugins: pgDefaultPlugins,
  inflections,
} = require("graphql-build-pg");

module.exports = function createPostGraphQLSchema(
  client,
  schemas,
  options = {}
) {
  const { dynamicJson, classicIds, nodeIdFieldName } = options;
  return buildSchema([...defaultPlugins, ...pgDefaultPlugins], {
    pgConfig: client,
    pgSchemas: schemas,
    pgExtendedTypes: !!dynamicJson,
    pgInflection: classicIds
      ? inflections.postGraphQLClassicIdsInflection
      : inflections.postGraphQLInflection,
    nodeIdFieldName: nodeIdFieldName || (classicIds ? "id" : "nodeId"),
  });
};
