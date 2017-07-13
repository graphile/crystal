const { GraphQLObjectType } = require("graphql");

module.exports = async function MutationPlugin(builder) {
  builder.hook("GraphQLSchema", (schema, { buildObjectWithHooks, extend }) => {
    const Mutation = buildObjectWithHooks(
      GraphQLObjectType,
      {
        name: "Mutation",
        description:
          "The root mutation type which contains root level fields which mutate data.",
      },
      { isRootMutation: true },
      true
    );
    if (Mutation) {
      return extend(schema, {
        mutation: Mutation,
      });
    } else {
      return schema;
    }
  });
};
