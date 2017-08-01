// @flow
import QueryBuilder from "./QueryBuilder";
import sql from "pg-sql2";
import type { SQL } from "pg-sql2";
import type { DataForType } from "graphile-build";
import isSafeInteger from "lodash/isSafeInteger";

export default (
  from: SQL,
  fromAlias: ?SQL,
  resolveData: DataForType,
  options: {
    withPagination?: boolean,
    withPaginationAsFields?: boolean,
    asJson?: boolean,
    asJsonAggregate?: boolean,
    addNullCase?: boolean,
    onlyJsonField?: boolean,
  },
  withBuilder?: (builder: QueryBuilder) => void
) => {
  const {
    pgQuery,
    pgCursorPrefix: reallyRawCursorPrefix,
    pgCalculateTotalCount,
    calculateHasNextPage,
    calculateHasPreviousPage,
  } = resolveData;
  const rawCursorPrefix =
    reallyRawCursorPrefix && reallyRawCursorPrefix.filter(_ => _);

  const queryBuilder = new QueryBuilder();
  queryBuilder.from(from, fromAlias ? fromAlias : undefined);

  for (const fn of pgQuery || []) {
    fn(queryBuilder, resolveData);
  }
  if (withBuilder) {
    withBuilder(queryBuilder);
  }

  function generateNextPrevPageSql(
    sqlQueryAlias,
    canHaveCursorInWhere,
    queryHasBefore,
    queryHasFirst,
    offset = 0,
    invert = false
  ) {
    // if invert is true queryHasBefore means queryHasAfter; queryHasFirst means queryHasLast; etc
    const sqlCommon = sql.fragment`
      select 1
      from ${queryBuilder.getTableExpression()} as ${queryBuilder.getTableAlias()}
      where ${queryBuilder.buildWhereClause(!invert, invert, options)}
    `;
    if (!queryHasBefore && !queryHasFirst && (!invert || offset === 0)) {
      // There can be no next page since there's no upper bound
      return sql.literal(false);
    } else if (queryHasBefore && (!invert || offset === 0)) {
      // Simply see if there are any records after the before cursor
      return sql.fragment`exists(
        ${sqlCommon}
        and not (${queryBuilder.buildWhereBoundClause(invert)})
      )`;
    } else if (canHaveCursorInWhere && (!invert || offset === 0)) {
      // Query must have "first"
      // Drop the limit, see if there are any records that aren't already in the list we've fetched
      return sql.fragment`exists(
        ${sqlCommon}
        and (${queryBuilder.getSelectCursor()})::text not in (select __cursor::text from ${sqlQueryAlias})
        ${offset === 0 ? sql.blank : sql.fragment`offset ${sql.value(offset)}`}
      )`;
    } else {
      if (!invert) {
        // Skip over the already known entries, are there any left?
        return sql.fragment`exists(
          ${sqlCommon}
          offset (select coalesce((select count(*) from ${sqlQueryAlias}), 0) + ${sql.value(
          offset
        )})
        )`;
      } else {
        // Things get somewhat more complex here... Let's just assume if offset > 0 there's a previous page.
        if (offset > 0) {
          return sql.literal(true);
        }
        // And here (offset === 0 && invert) so we'd have hit an earlier case; since we haven't there must be no previous page.
        return sql.literal(false);
      }
    }
  }
  const getPgCursorPrefix = () =>
    rawCursorPrefix && rawCursorPrefix.length > 0
      ? rawCursorPrefix
      : queryBuilder.data.cursorPrefix.map(val => sql.literal(val));
  if (
    options.withPagination ||
    options.withPaginationAsFields ||
    options.withCursor
  ) {
    // Sometimes we need a __cursor even if it's not a collection; e.g. to get the edge field on a mutation
    queryBuilder.selectCursor(() => {
      const orderBy = queryBuilder
        .getOrderByExpressionsAndDirections()
        .map(([expr]) => expr);
      if (orderBy.length > 0) {
        return sql.fragment`json_build_array(${sql.join(
          [
            ...getPgCursorPrefix(),
            sql.fragment`json_build_array(${sql.join(orderBy, ", ")})`,
          ],
          ", "
        )})`;
      } else {
        return sql.fragment`json_build_array(${sql.join(
          getPgCursorPrefix(),
          ", "
        )}, (row_number() over (partition by 1)))`;
      }
    });
  }
  if (options.withPagination || options.withPaginationAsFields) {
    queryBuilder.setCursorComparator((cursorValue, isAfter) => {
      const orderByExpressionsAndDirections = queryBuilder.getOrderByExpressionsAndDirections();
      if (orderByExpressionsAndDirections.length > 0) {
        const sqlCursors = cursorValue[getPgCursorPrefix().length].map(val =>
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
          const comparison =
            Number(ascending) ^ Number(!isAfter)
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
        throw new Error("Cannot use cursors without orderBy");
      }
    });

    const query = queryBuilder.build(options);
    const sqlQueryAlias = sql.identifier(Symbol());
    const sqlSummaryAlias = sql.identifier(Symbol());
    const canHaveCursorInWhere =
      queryBuilder.getOrderByExpressionsAndDirections().length > 0;
    const queryHasBefore = queryBuilder.data.whereBound.upper.length > 0;
    const queryHasAfter = queryBuilder.data.whereBound.lower.length > 0;
    const queryHasZeroLimit = queryBuilder.data.limit === 0;
    const queryHasFirst =
      isSafeInteger(queryBuilder.data.limit) && !queryBuilder.data.flip;
    const queryHasLast =
      isSafeInteger(queryBuilder.data.limit) && queryBuilder.data.flip;
    const hasNextPage = queryHasZeroLimit
      ? sql.literal(false)
      : generateNextPrevPageSql(
          sqlQueryAlias,
          canHaveCursorInWhere,
          queryHasBefore,
          queryHasFirst,
          queryBuilder.data.offset || 0
        );
    const hasPreviousPage = queryHasZeroLimit
      ? sql.literal(false)
      : generateNextPrevPageSql(
          sqlQueryAlias,
          canHaveCursorInWhere,
          queryHasAfter,
          queryHasLast,
          queryBuilder.data.offset || 0,
          true
        );

    const totalCount = sql.fragment`(
      select count(*)
      from ${queryBuilder.getTableExpression()} as ${queryBuilder.getTableAlias()}
      where ${queryBuilder.buildWhereClause(false, false, options)}
    )`;
    const sqlWith = sql.fragment`with ${sqlQueryAlias} as (${query}), ${sqlSummaryAlias} as (select json_agg(to_json(${sqlQueryAlias})) as data from ${sqlQueryAlias})`;
    const sqlFrom = sql.fragment``;
    const fields = [
      [
        sql.fragment`coalesce((select ${sqlSummaryAlias}.data from ${sqlSummaryAlias}), '[]'::json)`,
        "data",
      ],
      calculateHasNextPage && [hasNextPage, "hasNextPage"],
      calculateHasPreviousPage && [hasPreviousPage, "hasPreviousPage"],
      pgCalculateTotalCount && [totalCount, "totalCount"],
    ].filter(_ => _);
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
  } else {
    const query = queryBuilder.build(options);
    return query;
  }
};
