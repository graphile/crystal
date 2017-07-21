export default function MutationPayloadQueryPlugin(builder) {
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
          description:
            "Our root query field type. Allows us to run any query from our mutation payload.",
          type: Query,
          resolve() {
            return $$isQuery;
          },
        },
      });
    }
  );
}
