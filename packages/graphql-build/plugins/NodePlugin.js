const { GraphQLNonNull, GraphQLString } = require("graphql");

module.exports = function NodePlugin(builder, { nodeIdFieldName = "nodeId" }) {
  builder.hook("build", build => {
    return build.extend(build, {
      nodeIdFieldName,
    });
  });

  builder.hook(
    "objectType:fields",
    (fields, { extend }, { scope: { isRootQuery } }) => {
      return extend(fields, {
        [nodeIdFieldName]: {
          type: new GraphQLNonNull(GraphQLString),
          resolve() {
            return "query";
          },
        },
      });
    }
  );
};
