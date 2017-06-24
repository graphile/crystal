const { GraphQLNonNull, GraphQLString, GraphQLObjectType } = require("graphql");

module.exports = async function QueryPlugin(builder, { nodeIdFieldName }) {
  builder.hook("schema", (spec, { buildObjectWithHooks, extend }) => {
    const queryType = buildObjectWithHooks(
      GraphQLObjectType,
      {
        name: "Query",
        fields: ({ Self }) => ({
          [nodeIdFieldName]: {
            type: new GraphQLNonNull(GraphQLString),
            resolve() {
              return "query";
            },
          },
          query: {
            type: Self,
          },
        }),
      },
      { isRootQuery: true }
    );
    return extend(spec, {
      query: queryType,
    });
  });
};
