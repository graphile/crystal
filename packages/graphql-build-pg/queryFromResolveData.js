const QueryBuilder = require("./QueryBuilder");
const sql = require("./sql");
const isSafeInteger = require("lodash/isSafeInteger");

module.exports = (from, fromAlias, resolveData, options, withBuilder) => {
  const { pgQuery, pgCursorPrefix = [] } = resolveData;

  const queryBuilder = new QueryBuilder();
  queryBuilder.from(from, fromAlias);

  for (const fn of pgQuery || []) {
    fn(queryBuilder, resolveData);
  }
  if (withBuilder) {
    withBuilder(queryBuilder);
  }

  if (options.withPagination || options.withPaginationAsFields) {
    queryBuilder.setCursorComparator((cursorValue, isAfter) => {
      const orderByExpressionsAndDirections = queryBuilder.getOrderByExpressionsAndDirections();
      if (orderByExpressionsAndDirections.length > 0) {
        const sqlCursors = cursorValue[pgCursorPrefix.length].map(val =>
          sql.value(val)
        );
        if (!Array.isArray(sqlCursors)) {
          return sql.literal(false);
        }
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
              ${sqlExpression} ${comparison} ${sqlCursors[i] || sql.null}
            )
          OR
            (
              (
                ${sqlExpression} = ${sqlCursors[i] || sql.null}
              AND
                ${sqlOldFilter}
              )
            )
          )
          `;
        }
        return sqlFilter;
      } else {
        const rowNumber = cursorValue[pgCursorPrefix.length];
        if (!isSafeInteger(rowNumber)) {
          return sql.literal(false);
        }
        const comparison = isAfter ? sql.fragment`>` : sql.fragment`<`;
        return sql.fragment`(row_number() over (partition by 1)) ${comparison} ${sql.value(
          rowNumber
        )}`;
      }
    });

    queryBuilder.selectCursor(() => {
      const orderBy = queryBuilder
        .getOrderByExpressionsAndDirections()
        .map(([expr]) => expr);
      if (orderBy.length > 0) {
        return sql.fragment`json_build_array(${sql.join(
          [
            ...pgCursorPrefix,
            sql.fragment`json_build_array(${sql.join(
              queryBuilder
                .getOrderByExpressionsAndDirections()
                .map(([expr]) => expr),
              ", "
            )})`,
          ],
          ","
        )})`;
      } else {
        return sql.fragment`json_build_array(${sql.join(
          [
            ...(pgCursorPrefix.length ? pgCursorPrefix : "natural"),
            sql.fragment`(row_number() over (partition by 1))`,
          ],
          ", "
        )})`;
      }
    });
    queryBuilder.beforeLock("orderBy", () => {
      if (queryBuilder.data.orderBy.length === 0) {
        // Fall back to rowNumber ordering
        queryBuilder.orderBy(
          sql.fragment`(row_number() over (partition by 1))`
        );
      }
    });
    const query = queryBuilder.build(options);
    const sqlQueryAlias = sql.identifier(Symbol());
    const sqlSummaryAlias = sql.identifier(Symbol());
    //const hasNextPage = sql.fragment`exists(
    //      select 1 from ... where ... and not(${cursor} in (select __cursor from ${sqlQueryAlias}))
    //    )`;
    const hasNextPage = sql.literal(true);
    const hasPreviousPage = sql.literal(false);
    const sqlWith = sql.fragment`with ${sqlQueryAlias} as (${query}), ${sqlSummaryAlias} as (select json_agg(to_json(${sqlQueryAlias})) as data from ${sqlQueryAlias})`;
    const sqlFrom = sql.fragment``;
    const fields = [
      [
        sql.fragment`coalesce((select ${sqlSummaryAlias}.data from ${sqlSummaryAlias}), '[]'::json)`,
        "data",
      ],
      [hasNextPage, "hasNextPage"],
      [hasPreviousPage, "hasPreviousPage"],
    ];
    if (options.withPaginationAsFields) {
      return sql.fragment`${sqlWith} select ${sql.join(
        fields.map(
          ([expr, alias]) => sql.fragment`${expr} as ${sql.identifier(alias)}`
        ),
        ", "
      )} ${sqlFrom}`;
    } else {
      return sql.fragment`${sqlWith} select json_build_object(${sql.join(
        fields.map(
          ([expr, alias]) => sql.fragment`${sql.literal(alias)}, ${expr}`
        ),
        ", "
      )}) ${sqlFrom}`;
    }
    return queryWithPagination;
  } else {
    const query = queryBuilder.build(options);
    return query;
  }
};
