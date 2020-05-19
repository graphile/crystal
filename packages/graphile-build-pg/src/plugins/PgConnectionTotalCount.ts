declare global {
  namespace GraphileEngine {
    interface ScopeGraphQLObjectTypeFieldsField {
      isPgConnectionTotalCountField?: boolean;
    }
  }
}

export default (function PgConnectionTotalCount(builder) {
  builder.hook(
    "GraphQLObjectType:fields",
    (fields, build, context) => {
      const {
        extend,
        inflection,
        graphql: { GraphQLInt, GraphQLNonNull, isNamedType },
        pgSql: sql,
      } = build;
      const {
        scope: { isPgRowConnectionType, pgIntrospection: table, nodeType },
        fieldWithHooks,
        Self,
      } = context;

      if (!isPgRowConnectionType) {
        return fields;
      }

      const nodeTypeName =
        nodeType && isNamedType(nodeType)
          ? nodeType.name
          : table && table.kind === "class"
          ? inflection.tableType(table)
          : null;
      if (!nodeTypeName) {
        return fields;
      }

      return extend(
        fields,
        {
          totalCount: fieldWithHooks(
            "totalCount",
            ({ addDataGenerator }) => {
              addDataGenerator(() => {
                return {
                  pgAggregateQuery: (aggregateQueryBuilder) => {
                    aggregateQueryBuilder.select(sql`count(1)`, "totalCount");
                  },
                };
              });
              return {
                description: `The count of *all* \`${nodeTypeName}\` you could get from the connection.`,
                type: new GraphQLNonNull(GraphQLInt),
                resolve(parent) {
                  return (
                    (parent.aggregates && parent.aggregates.totalCount) || 0
                  );
                },
              };
            },
            {
              isPgConnectionTotalCountField: true,
            },
          ),
        },

        `Adding totalCount to connection '${Self.name}'`,
      );
    },
    ["PgConnectionTotalCount"],
  );
} as GraphileEngine.Plugin);
