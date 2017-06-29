const QueryBuilder = require("./QueryBuilder");
const sql = require("./sql");

module.exports = (from, fromAlias, resolveData, options, withBuilder) => {
  const { pgQuery, pgCursorPrefix = [] } = resolveData;

  const queryBuilder = new QueryBuilder();
  queryBuilder.from(from, fromAlias);

  queryBuilder.setCursorComparator((sqlCursor, isAfter) => {
    const orderByExpressionsAndDirections = queryBuilder.getOrderByExpressionsAndDirections();
    let sqlFilter = sql.fragment`false`;
    for (let i = orderByExpressionsAndDirections.length - 1; i >= 0; i--) {
      const [sqlExpression, ascending] = orderByExpressionsAndDirections[i];
      // If ascending and isAfter then >
      // If ascending and isBefore then <
      const comparison = ascending ^ !isAfter
        ? sql.fragment`>`
        : sql.fragment`<`;

      const sqlOldFilter = sqlFilter;
      sqlFilter = sql.fragment`
      (
        (
          ${sqlExpression} ${comparison} (${sqlCursor})[${sql.literal(
        i + 1 + pgCursorPrefix.length
      )}]
        )
      OR
        (
          (${sqlExpression} = (${sqlCursor})[${sql.literal(
        i + 1 + pgCursorPrefix.length
      )}]
        AND
          ${sqlOldFilter}
        )
      )
      `;
    }
    return sqlFilter;
  });

  for (const fn of pgQuery || []) {
    fn(queryBuilder, resolveData);
  }
  if (withBuilder) {
    withBuilder(queryBuilder);
  }
  if (options.asJsonAggregate) {
    queryBuilder.select(() => {
      return sql.fragment`json_build_array(${sql.join(
        [
          ...pgCursorPrefix,
          ...queryBuilder
            .getOrderByExpressionsAndDirections()
            .map(([expr]) => expr),
        ],
        ","
      )})`;
    }, "__cursor");
    queryBuilder.beforeLock("orderBy", () => {
      if (queryBuilder.data.orderBy.length === 0) {
        // Fall back to rowNumber ordering
        queryBuilder.orderBy(
          sql.fragment`(row_number() over (partition by 1))`
        );
      }
    });
  }
  const query = queryBuilder.build(options);
  return query;
};
