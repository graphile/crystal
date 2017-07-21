export default function PgConnectionTotalCount(builder) {
  builder.hook(
    "GraphQLObjectType:fields",
    (
      fields,
      { extend, pgInflection: inflection, graphql: { GraphQLInt } },
      {
        scope: { isPgRowConnectionType, pgIntrospection: table },
        fieldWithHooks,
      }
    ) => {
      if (
        !isPgRowConnectionType ||
        !table ||
        table.kind !== "class" ||
        !table.namespace
      ) {
        return fields;
      }
      const tableTypeName = inflection.tableType(
        table.name,
        table.namespace.name
      );
      return extend(fields, {
        totalCount: fieldWithHooks("totalCount", ({ addDataGenerator }) => {
          addDataGenerator(() => {
            return {
              pgCalculateTotalCount: true,
            };
          });
          return {
            description: `The count of *all* \`${tableTypeName}\` you could get from the connection.`,
            type: GraphQLInt,
          };
        }),
      });
    }
  );
}
