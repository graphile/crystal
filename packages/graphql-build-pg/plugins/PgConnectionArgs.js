const base64Decode = str => Buffer.from(String(str), "base64").toString("utf8");
const { GraphQLInt } = require("graphql");

module.exports = function PgConnectionArgs(
  builder,
  { pgInflection: inflection }
) {
  builder.hook(
    "field:args",
    (
      args,
      { extend, getTypeByName, pgSql: sql },
      {
        scope: { isPgConnectionField, pgIntrospection: table },
        addArgDataGenerator,
      }
    ) => {
      if (!isPgConnectionField || !table || !table.kind === "class") {
        return args;
      }
      const Cursor = getTypeByName("Cursor");
      const TableType = getTypeByName(
        inflection.tableType(table.name, table.namespace.name)
      );
      const TableOrderByType = inflection.orderByType(TableType.name);

      addArgDataGenerator(function connectionDefaultArgs({
        first,
        orderBy,
        after,
      }) {
        return {
          pgQuery: queryBuilder => {
            if (first != null) {
              queryBuilder.limit(first);
            }
            if (orderBy != null) {
              queryBuilder.orderBy(...orderBy);
            }
            if (after != null) {
              const cursor = after;
              const cursorValues = JSON.parse(base64Decode(cursor));
              queryBuilder.where(() => {
                const orderByExpressionsAndDirections = queryBuilder.getOrderByExpressionsAndDirections();
                if (
                  cursorValues.length != orderByExpressionsAndDirections.length
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

      return extend(args, {
        first: {
          type: GraphQLInt,
        },
        after: {
          type: Cursor,
        },
        /*
        orderBy: {
          type: TableOrderByType,
        },
        */
      });
    }
  );
};
