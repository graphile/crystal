export default (function MutationPayloadQueryPlugin(builder) {
  builder.hook(
    "GraphQLObjectType:fields",
    (fields, build, context) => {
      const { $$isQuery, extend, getTypeByName, inflection } = build;
      const {
        scope: { isMutationPayload },
        Self,
      } = context;
      if (!isMutationPayload) {
        return fields;
      }
      const Query = getTypeByName(inflection.builtin("Query"));
      return extend(
        fields,
        {
          query: {
            description:
              "Our root query field type. Allows us to run any query from our mutation payload.",
            type: Query,
            resolve() {
              return $$isQuery;
            },
          },
        },

        `Adding 'query' field to mutation payload ${Self.name}`,
      );
    },
    ["MutationPayloadQuery"],
  );
} as GraphileEngine.Plugin);
