// @flow
import type { Plugin } from "graphile-build";

export default (function PgConnectionTotalCount(builder) {
  builder.hook(
    "GraphQLObjectType:fields",
    (fields, build, context) => {
      const {
        extend,
        inflection,
        graphql: { GraphQLInt, GraphQLNonNull },
        pgSql: sql,
      } = build;
      const {
        scope: { isPgRowConnectionType, pgIntrospection: table },
        fieldWithHooks,
        Self,
      } = context;

      if (
        !isPgRowConnectionType ||
        !table ||
        table.kind !== "class" ||
        !table.namespace
      ) {
        return fields;
      }
      const tableTypeName = inflection.tableType(table);

      return extend(
        fields,
        {
          totalCount: fieldWithHooks(
            "totalCount",
            ({ addDataGenerator }) => {
              addDataGenerator(() => {
                return {
                  pgAggregateQuery: aggregateQueryBuilder => {
                    aggregateQueryBuilder.select(
                      sql.fragment`count(*)`,
                      "totalCount"
                    );
                  },
                };
              });
              return {
                description: `The count of *all* \`${tableTypeName}\` you could get from the connection.`,
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
            }
          ),
        },
        `Adding totalCount to connection '${Self.name}'`
      );
    },
    ["PgConnectionTotalCount"]
  );
}: Plugin);
