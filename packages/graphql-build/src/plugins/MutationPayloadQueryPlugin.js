module.exports = function MutationPayloadQueryPlugin(builder) {
  builder.hook(
    "GraphQLObjectType:fields",
    (
      fields,
      { $$isQuery, extend, getTypeByName },
      { scope: { isMutationPayload } }
    ) => {
      if (!isMutationPayload) {
        return fields;
      }
      const Query = getTypeByName("Query");
      return extend(fields, {
        query: {
          type: Query,
          resolve() {
            return $$isQuery;
          },
        },
      });
    }
  );
};
