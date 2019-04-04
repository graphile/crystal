// @flow
import QueryBuilder from "./QueryBuilder";
import type QueryBuilderOptions from "./QueryBuilder";
import type { RawAlias } from "./QueryBuilder";
import * as sql from "pg-sql2";
import type { SQL } from "pg-sql2";
import type { DataForType } from "graphile-build";
import isSafeInteger from "lodash/isSafeInteger";
import assert from "assert";

// eslint-disable-next-line flowtype/no-weak-types
type GraphQLContext = any;

const identity = _ => _ !== null && _ !== undefined;

// $FlowFixMe
export default (queryBuilderOptions: QueryBuilderOptions = {}) => (
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
    useAsterisk?: boolean,
  },
  // TODO:v5: context is not optional
  withBuilder?: ((builder: QueryBuilder) => void) | null | void,
  context?: GraphQLContext = {},
  rootValue?: any // eslint-disable-line flowtype/no-weak-types
) => {
  const {
    pgQuery,
    pgAggregateQuery,
    pgCursorPrefix: reallyRawCursorPrefix,
    calculateHasNextPage,
    calculateHasPreviousPage,
    usesCursor: explicitlyUsesCursor,
  } = resolveData;

  const usesCursor: boolean =
    (explicitlyUsesCursor && explicitlyUsesCursor.length > 0) ||
    (calculateHasNextPage && calculateHasNextPage.length > 0) ||
    (calculateHasPreviousPage && calculateHasPreviousPage.length > 0) ||
    false;
  const rawCursorPrefix =
    reallyRawCursorPrefix && reallyRawCursorPrefix.filter(identity);

  // $FlowFixMe
  const queryBuilder = new QueryBuilder(
    // $FlowFixMe
    queryBuilderOptions,
    context,
    rootValue
  );
  queryBuilder.from(from, fromAlias ? fromAlias : undefined);

  if (withBuilder) {
    withBuilder(queryBuilder);
  }
  for (const fn of pgQuery || []) {
    fn(queryBuilder, resolveData);
  }

  function generateNextPrevPageSql(
    sqlQueryAlias,
    canHaveCursorInWhere,
    queryHasBefore,
    queryHasFirst,
    offset = 0,
    invert = false
  ) {
    /*
     * Strap in, 'coz this function gets hairy!
     *
     * The point of this function is to return SQL which will resolve to a
     * boolean true/false depending on whether or not there is a (invert ?
     * "previous" : "next") page.
     *
     * Connections have before, after, first, last and offset.
     * - Users are forbidden from setting both first and last.
     * - Users are forbidden from setting both offset and last.
     *
     * Further there are two main modes of paginating, one works by adding a
     * where clause (this is preferred, but is not always possible, and is
     * indicated by `canHaveCursorInWhere === true`) and the other works using
     * standard LIMIT/OFFSET SQL pagination (and is indicated by
     * `canHaveCursorInWhere === false`).
     *
     * The following diagram shows a full collection of records, #, starting at
     * START and ending at END. The key after, before, offset, first and last
     * variables are shown. One thing not show is that it's possible to have
     * fewer records between before and after than requested by first or last.
     * Another detail not clearly show is that if there is no `after` then
     * `START` is used, similarly if there is no `before` then `END` is used.
     *
     *   #################################################### < collection
     *   ^      ^<-offset->^<-first->^      ^<-last->^      ^
     *   |      |          |         |      |        |      |
     *   |      |          +---------+      +--------+      |
     *   |      |          |  DATA1           DATA2  |      |
     *   |      |          |                         |      |
     *   |      |          |                         |      |
     *   |      |          +-------------------------+      |
     *   |      |                     DATA3          |      |
     *   |    after                                before   |
     *   |                                                  |
     * START                                               END
     *
     * We want one of the three DATA blocks:
     *
     * - If `first` is set, then we want DATA1.
     * - If `last` is set then we want DATA2.
     * - If neither is set then we want DATA3.
     *
     * (Remember: you cannot set both `first` and `last` at the same time.)
     *
     * When invert === false:
     *
     *   Note that both DATA2 and DATA3 end at the same point, and we only care
     *   if there's data *after* the relevant DATA block, so really we only
     *   care if the query specified `first` (`queryHasFirst`) which makes
     *   things complex (ending at the end of DATA1), otherwise we can use
     *   `before` as the bound (end of DATA2/DATA3).
     *
     * When invert === true:
     *
     *   Similarly, DATA1 and DATA3 start at the same point, and we're going
     *   backwards so we only care if there's data *before* the DATA block, so
     *   really we just need to know if the query set `last` or not, but since
     *   this is inverted we call it `queryHasFirst`.
     *
     * When `invert` is false we're calculating `hasNextPage`, when true we're
     * calculating `hasPreviousPage`.
     *
     * Because of the near-symmetry of requesting hasPreviousPage vs
     * hasNextPage we always pretend we're determining `hasNextPage`, and we
     * just invert everything.
     */

    const sqlCommonUnbounded = sql.fragment`
      select 1
      from ${queryBuilder.getTableExpression()} as ${queryBuilder.getTableAlias()}
      `;
    /*
     * This variable is a fragment to go into an `EXISTS(...)` call (after some tweaks).
     *
     * The buildWhereClause takes three arguments:
     *
     * - includeLowerBound (we want this for hasNextPage but not hasPreviousPage)
     * - includeUpperBound (we want this for hasPreviousPage but not hasNextPage)
     * - options (specifically `{addNullCase}`) - we just pass this through.
     *
     * So in hasNextPage mode (invert === false), this common SQL ends up
     * representing the collection from `(after || START)` onwards with no
     * upper bound. In hasPreviousPage mode (invert === true), it represents
     * everything from `(before || END)` backwards, with no lower bound.
     */
    const sqlCommon = sql.fragment`
      ${sqlCommonUnbounded}
      where ${queryBuilder.buildWhereClause(!invert, invert, options)}
    `;

    /*
     * Since the offset makes the diagram asymmetric, if offset === 0
     * then the diagram is symmetric and things are simplified a little.
     */
    const isForwardOrSymmetric = !invert || offset === 0;

    if (!isForwardOrSymmetric) {
      assert(invert);
      assert(offset > 0);
      // We're looking for a previous page, and there's an offset, so lets just
      // assume there's a previous page where offset is smaller.
      return sql.literal(true);
    } else if (canHaveCursorInWhere) {
      assert(isForwardOrSymmetric);
      if (!queryHasBefore && !queryHasFirst) {
        assert(isForwardOrSymmetric);
        // There can be no next page since there's no upper bound
        return sql.literal(false);
      } else if (queryHasBefore && !queryHasFirst) {
        /*
         * We invert the upper buildWhereBoundClause to only represent the data
         * after `before`, then check if there's at least one record in that set.
         *
         * This only works if the `before` cursor can be represented in the
         * SQL WHERE clause, otherwise we're doing limit/offset pagination
         * which requires different logic. It also only works if there's no
         * `first` clause, otherwise there could be a next page before the
         * `before` clause.
         */
        return sql.fragment`exists(
          ${sqlCommonUnbounded}
          where ${queryBuilder.buildWhereClause(false, false, options)}
          and not (${queryBuilder.buildWhereBoundClause(invert)})
        )`;
      } else {
        assert(queryHasFirst);
        // queryHasBefore could be true or false.
        /*
         * There's a few ways that we could determine if there's a next page.
         *
         * If !queryHasBefore, we could COUNT(*) the number of rows in
         * `sqlCommon` and see if it's larger than `first`:
         * `(select count(*) > ${first} from (${sqlCommon}) __random_table_alias__)`
         *
         * If !queryHasBefore, we could build a subquery table of offsetData
         * from sqlCommon and see if it contains any rows:
         * `EXISTS(select 1 from (${sqlCommon} OFFSET ${first}) __random_table_alias__)`.
         *
         * We could see if there's at least one row in sqlCommon that's not
         * already in our chosen result set.
         *
         * We've chosen the latter approach here because it doesn't place a limit
         * on queryHasBefore.
         */
        // Drop the `first` limit, see if there are any records that aren't
        // already in the list we've fetched.
        return sql.fragment`exists(
          ${sqlCommon}
          and (${queryBuilder.getSelectCursor()})::text not in (select __cursor::text from ${sqlQueryAlias})
          ${
            offset === 0 ? sql.blank : sql.fragment`offset ${sql.value(offset)}`
          }
        )`;
      }
    } else {
      assert(!invert || offset === 0); // isForwardOrSymmetric
      assert(!canHaveCursorInWhere);
      // We're dealing with LIMIT/OFFSET pagination here, which means `natural`
      // cursors, so the `queryBuilder` factors the before/after, first/last
      // into the limit / offset.
      const { limit } = queryBuilder.getFinalLimitAndOffset();

      if (limit == null) {
        // If paginating backwards, then offset > 0 has already been dealt
        // with. Unbounded, so there's no next page.
        return sql.fragment`false`;
      } else if (invert) {
        assert(offset === 0);
        // Paginating backwards and there's no offset (which factors in before/after), so there's no previous page.
        return sql.fragment`false`;
      } else {
        assert(!invert);
        /*
         * We're paginating forwards; either there's a before, there's a first,
         * or both.
         *
         * We want to see if there's more than limit+offset records in sqlCommon.
         */
        return sql.fragment`exists(
          ${sqlCommon}
          offset ${sql.literal(limit + offset)}
        )`;
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
    if (usesCursor) {
      queryBuilder.selectCursor(() => {
        const orderBy = queryBuilder
          .getOrderByExpressionsAndDirections()
          .map(([expr]) => expr);
        if (queryBuilder.isOrderUnique() && orderBy.length > 0) {
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
  }
  if (options.withPagination || options.withPaginationAsFields) {
    queryBuilder.setCursorComparator((cursorValue, isAfter) => {
      const orderByExpressionsAndDirections = queryBuilder.getOrderByExpressionsAndDirections();
      if (
        orderByExpressionsAndDirections.length > 0 &&
        queryBuilder.isOrderUnique()
      ) {
        const sqlCursors = cursorValue[getPgCursorPrefix().length].map(val =>
          sql.value(val)
        );
        if (!Array.isArray(sqlCursors)) {
          queryBuilder.whereBound(sql.literal(false), isAfter);
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
        queryBuilder.whereBound(sqlFilter, isAfter);
      } else if (
        cursorValue[0] === "natural" &&
        isSafeInteger(cursorValue[1]) &&
        cursorValue[1] >= 0
      ) {
        if (isAfter) {
          queryBuilder.offset(() => cursorValue[1]);
        } else {
          queryBuilder.limit(() => {
            const offset = queryBuilder.getOffset();
            return Math.max(0, cursorValue[1] - offset - 1);
          });
        }
      } else {
        throw new Error("Cannot use cursors without orderBy");
      }
    });

    const query = queryBuilder.build(options);
    const haveFields = queryBuilder.getSelectFieldsCount() > 0;
    const sqlQueryAlias = sql.identifier(Symbol());
    const sqlSummaryAlias = sql.identifier(Symbol());
    //
    // Tables should ALWAYS push their PK onto the order stack, if this isn't
    // present then we're either dealing with a view or a table without a PK.
    // Either way, we don't have anything to guarantee uniqueness so we need to
    // fall back to limit/offset.
    //
    // TODO: support unique keys in PgAllRows etc
    // TODO: add a warning for cursor-based pagination when using the fallback
    // TODO: if it is a view maybe add a warning encouraging pgViewUniqueKey
    const canHaveCursorInWhere =
      queryBuilder.getOrderByExpressionsAndDirections().length > 0 &&
      queryBuilder.isOrderUnique();
    const queryHasBefore =
      queryBuilder.compiledData.whereBound.upper.length > 0;
    const queryHasAfter = queryBuilder.compiledData.whereBound.lower.length > 0;
    const queryHasZeroLimit = queryBuilder.getFinalLimit() === 0;
    const queryHasFirst = isSafeInteger(queryBuilder.compiledData.first);
    const queryHasLast = isSafeInteger(queryBuilder.compiledData.last);
    const hasNextPage = queryHasZeroLimit
      ? sql.literal(false)
      : generateNextPrevPageSql(
          sqlQueryAlias,
          canHaveCursorInWhere,
          queryHasBefore,
          queryHasFirst,
          queryBuilder.getFinalOffset() || 0
        );
    const hasPreviousPage = queryHasZeroLimit
      ? sql.literal(false)
      : generateNextPrevPageSql(
          sqlQueryAlias,
          canHaveCursorInWhere,
          queryHasAfter,
          queryHasLast,
          queryBuilder.getFinalOffset() || 0,
          true
        );

    const sqlWith = haveFields
      ? sql.fragment`with ${sqlQueryAlias} as (${query}), ${sqlSummaryAlias} as (select json_agg(to_json(${sqlQueryAlias})) as data from ${sqlQueryAlias})`
      : sql.fragment``;
    const sqlFrom = sql.fragment``;
    const fields: Array<[SQL, RawAlias]> = [];
    if (haveFields) {
      fields.push([
        sql.fragment`coalesce((select ${sqlSummaryAlias}.data from ${sqlSummaryAlias}), '[]'::json)`,
        "data",
      ]);
      if (calculateHasNextPage) {
        fields.push([hasNextPage, "hasNextPage"]);
      }
      if (calculateHasPreviousPage) {
        fields.push([hasPreviousPage, "hasPreviousPage"]);
      }
    }
    if (pgAggregateQuery && pgAggregateQuery.length) {
      const aggregateQueryBuilder = new QueryBuilder(
        // $FlowFixMe
        queryBuilderOptions,
        context,
        rootValue
      );
      aggregateQueryBuilder.from(
        queryBuilder.getTableExpression(),
        queryBuilder.getTableAlias()
      );

      for (const fn of pgAggregateQuery) {
        fn(aggregateQueryBuilder);
      }
      const aggregateJsonBuildObject = aggregateQueryBuilder.build({
        onlyJsonField: true,
      });
      const aggregatesSql = sql.fragment`
      (
        select ${aggregateJsonBuildObject}
        from ${queryBuilder.getTableExpression()} as ${queryBuilder.getTableAlias()}
        where ${queryBuilder.buildWhereClause(false, false, options)}
      )
      `;
      fields.push([aggregatesSql, "aggregates"]);
    }
    if (options.withPaginationAsFields) {
      return sql.fragment`${sqlWith} select ${sql.join(
        fields.map(
          ([expr, alias]) => sql.fragment`${expr} as ${sql.identifier(alias)}`
        ),
        ", "
      )} ${sqlFrom}`;
    } else {
      return sql.fragment`${sqlWith} select ${queryBuilder.jsonbBuildObject(
        fields
      )} ${sqlFrom}`;
    }
  } else {
    const query = queryBuilder.build(options);
    return query;
  }
};
