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
      const TableConditionType = inflection.conditionType(TableType.name);

      addArgDataGenerator(function connectionDefaultArgs({
        first,
        last,
        orderBy,
        after,
        before,
      }) {
        return {
          pgQuery: queryBuilder => {
            if (first != null) {
              queryBuilder.limit(first);
            }
            if (first != null && last != null) {
              throw new Error("We don't support setting both first and last");
            }
            if (last != null) {
              queryBuilder.limit(last);
              queryBuilder.flip();
            }
            if (orderBy != null) {
              queryBuilder.orderBy(...orderBy);
            }
            if (after != null) {
              addCursorConstraint(after, true);
            }
            if (before != null) {
              addCursorConstraint(before, false);
            }
            function addCursorConstraint(cursor, isAfter) {
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
                  // If ascending and isAfter then >
                  // If ascending and isBefore then <
                  const comparison = ascending ^ !isAfter
                    ? sql.fragment`>`
                    : sql.fragment`<`;

                  const sqlOldFilter = sqlFilter;
                  sqlFilter = sql.fragment`
                  (
                    (
                      ${sqlExpression} ${comparison} ${sql.value(cursorValue)}
                    )
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
        last: {
          type: GraphQLInt,
        },
        before: {
          type: Cursor,
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
