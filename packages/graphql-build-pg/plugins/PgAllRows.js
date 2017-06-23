const base64Decode = str => Buffer.from(String(str), "base64").toString("utf8");
const { GraphQLInt, GraphQLEnumType } = require("graphql");
const queryFromResolveData = require("../queryFromResolveData");

module.exports = async function PgAllRows(
  builder,
  { pgInflection: inflection }
) {
  builder.hook(
    "objectType:fields",
    (
      fields,
      {
        buildObjectWithHooks,
        extend,
        getTypeByName,
        pgSql: sql,
        pgIntrospectionResultsByKind: introspectionResultsByKind,
      },
      { buildFieldWithHooks, scope: { isRootQuery } }
    ) => {
      if (!isRootQuery) {
        return fields;
      }
      const Cursor = getTypeByName("Cursor");
      return extend(
        fields,
        introspectionResultsByKind.class.reduce((memo, table) => {
          const TableType = getTypeByName(
            inflection.tableType(table.name, table.namespace.name)
          );
          const ConnectionType = getTypeByName(
            inflection.connection(TableType.name)
          );
          if (!TableType) {
            throw new Error(
              `Could not find GraphQL type for table '${table.name}'`
            );
          }
          if (!ConnectionType) {
            throw new Error(
              `Could not find GraphQL connection type for table '${table.name}'`
            );
          }
          const schema = table.namespace;
          const sqlFullTableName = sql.identifier(schema.name, table.name);
          if (TableType && ConnectionType) {
            const clauses = {};
            const fieldName = inflection.allRows(table.name, schema.name);
            memo[fieldName] = buildFieldWithHooks(
              fieldName,
              ({
                addArgDataGenerator,
                getDataFromParsedResolveInfoFragment,
                parseResolveInfo,
              }) => {
                addArgDataGenerator(function connectionDefaultArgs({
                  first,
                  sortBy,
                  after,
                }) {
                  return {
                    pgQuery: queryBuilder => {
                      if (first != null) {
                        queryBuilder.limit(first);
                      }
                      if (sortBy != null) {
                        queryBuilder.orderBy(...sortBy);
                      }
                      if (after != null) {
                        const cursor = after;
                        const cursorValues = JSON.parse(base64Decode(cursor));
                        queryBuilder.where(() => {
                          const orderByExpressionsAndDirections = queryBuilder.getOrderByExpressionsAndDirections();
                          if (
                            cursorValues.length !=
                            orderByExpressionsAndDirections.length
                          ) {
                            throw new Error("Invalid cursor");
                          }
                          let sqlFilter = sql.fragment`false`;
                          for (
                            let i = orderByExpressionsAndDirections.length - 1;
                            i >= 0;
                            i--
                          ) {
                            const [
                              sqlExpression,
                              ascending,
                            ] = orderByExpressionsAndDirections[i];
                            const cursorValue = cursorValues[i];
                            const comparison = ascending
                              ? sql.fragment`>`
                              : sql.fragment`<`;

                            const sqlOldFilter = sqlFilter;
                            sqlFilter = sql.fragment`
                              (
                                (${sqlExpression} ${comparison} ${sql.value(
                              cursorValue
                            )})
                              OR
                                (
                                  (${sqlExpression} = ${sql.value(cursorValue)})
                                AND
                                  ${sqlOldFilter}
                                )
                              )
                              `;
                          }
                          return sqlFilter;
                        });
                      }
                    },
                  };
                });
                return {
                  type: ConnectionType,
                  args: {
                    first: {
                      type: GraphQLInt,
                    },
                    after: {
                      type: Cursor,
                    },
                    // XXX: move me to my own plugin
                    sortBy: {
                      type: buildObjectWithHooks(
                        GraphQLEnumType,
                        {
                          name: inflection.sort(TableType.name),
                          values: {
                            NATURAL: {
                              name: "NATURAL",
                              value: null,
                            },
                            // XXX: add the (indexed?) columns
                          },
                        },
                        {
                          pgIntrospection: table,
                          isPgRowSortEnum: true,
                        }
                      ),
                    },
                  },
                  async resolve(parent, args, { pgClient }, resolveInfo) {
                    const parsedResolveInfoFragment = parseResolveInfo(
                      resolveInfo
                    );
                    const resolveData = getDataFromParsedResolveInfoFragment(
                      parsedResolveInfoFragment
                    );
                    const query = queryFromResolveData(
                      sqlFullTableName,
                      Symbol(),
                      resolveData
                    );
                    const { text, values } = sql.compile(query);
                    console.log(text);
                    const { rows } = await pgClient.query(text, values);
                    return rows;
                  },
                };
              },
              {
                pg: {
                  isConnection: true,
                },
              }
            );
          }
          return memo;
        }, {})
      );
    }
  );
};
