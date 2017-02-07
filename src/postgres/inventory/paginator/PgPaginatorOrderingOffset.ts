import { Paginator } from '../../../interface'
import { sql } from '../../utils'
import pgClientFromContext from '../pgClientFromContext'
import PgPaginator from './PgPaginator'
import getSelectFragment from './getSelectFragment'

/**
 * The cursor in the offset strategy is just a simple integer.
 *
 * @private
 */
type OffsetCursor = number

/**
 * The `PgPaginatorOrderingOffset` implements an ordering strategy based solely
 * off of integer Sql offsets. This strategy is faster in some respects than
 * `PgPaginatorOrderingAttribute`, however it can easily be less correct.
 * Whenever an item is inserted into a set anywhere but at the end, all of the
 * offsets change making cursors previously queried now inconsistent with the
 * data.
 *
 * This ordering is available to be used with procedures and views (which will
 * often have a natural ordering), as well as indexes which define a custom
 * ordering. However, the cursors still won’t be super consistent.
 *
 * Also, note that there is no implementation for `getCursorForValue`. In the
 * future, we may add an implementation in the future but there it is hard
 * to get an offset from a lone value.
 */
class PgPaginatorOrderingOffset<TInput, TItemValue>
implements Paginator.Ordering<TInput, TItemValue, OffsetCursor> {
  public pgPaginator: PgPaginator<TInput, TItemValue>
  public orderBy: sql.Sql | undefined

  constructor (config: {
    pgPaginator: PgPaginator<TInput, TItemValue>,
    orderBy?: sql.Sql,
  }) {
    this.pgPaginator = config.pgPaginator
    this.orderBy = config.orderBy
  }

  public generateQuery (
    input: TInput,
    config: Paginator.PageConfig<AttributesCursor>,
    resolveInfo: mixed,
    gqlType: mixed,
    subquery?: boolean = true,
  ) {
    const { first, last, beforeCursor, afterCursor, _offset } = config

    // Do not allow `first` and `last` to be defined at the same time. THERE
    // MAY ONLY BE 1!!
    if (first != null && last != null)
      throw new Error('`first` and `last` may not be defined at the same time.')

    // Disallow the use of `offset` with `last`. We are currently still
    // evaluating how best to implement paginators and offsets, trying to
    // support `last` and `offset` adds complexity we don’t need.
    if (_offset != null && last != null)
      throw new Error('`offset` may not be used with `last`.')

    // Check that the types of our cursors is exactly what we would expect.
    if (afterCursor != null && !Number.isInteger(afterCursor))
      throw new Error('The after cursor must be an integer.')
    if (beforeCursor != null && !Number.isInteger(beforeCursor))
      throw new Error('The before cursor must be an integer.')

    let limit: number | null

    // If `last` is not defined (which means `first` might be defined), *or*
    // the `last` variable is unnesecary (this happens when
    // `beforeOffset - afterOffset <= last`). Execute the first method of
    // calculating `offset` and `limit`.
    //
    // If `beforeOffset - afterOffset <= last` is true then we can safely
    // ignore `last` as the range between `afterOffset` and `beforeOffset`
    // is *less* then the range defined in `last`.
    //
    // In this first block we can consider ourselves paginating *forwards*.
    const aliasIdentifier = Symbol()
    const matchingRowsIdentifier = Symbol()
    const resultsIdentifier = Symbol()
    let offsetSql
    if (last == null || (last != null && beforeCursor != null && beforeCursor - (afterCursor != null ? afterCursor : 0) <= last)) {
      // Start selecting at the offset specified by `after`. If there is no
      // after, we start selecting at the beginning (0).
      //
      // Also add our offset if given one.
      const offset = (afterCursor != null ? afterCursor : 0) + (_offset || 0)

      // Next create our limit (what we will be selecting to relative to our
      // `offset`).
      limit =
        beforeCursor != null ? Math.min((beforeCursor - 1) - offset, first != null ? first : Infinity) :
        first != null ? first :
        null
      offsetSql = sql.value(offset)
    }
    // Otherwise in this block, we will be paginating *backwards*.
    else {
      // Calculate the `offset` by doing some maths. We may need to get the
      // count from the database on this one.
      if (beforeCursor != null) {
        const offset = beforeCursor - last - 1
        offsetSql = sql.value(offset)
      } else {
        const countSql = sql.query`(select count(*) from ${sql.identifier(matchingRowsIdentifier)})`
        offsetSql =
          afterCursor != null
            ? sql.query`greatest(${countSql} - ${sql.value(last)}::integer, ${sql.value(afterCursor)}, 0)`
            : sql.query`greatest(${countSql} - ${sql.value(last)}::integer, 0)`
      }

      // The limit should always simply be `last`. Except in one case, but
      // that case is handled above.
      limit = last
    }

    const fromSql = this.pgPaginator.getFromEntrySql(input, subquery)
    const conditionSql = this.pgPaginator.getConditionSql(input)

    const hasNextPageSql =
      limit != null
        ? sql.query`${offsetSql}::integer + ${sql.value(limit)}::integer < (select count(*) from ${sql.identifier(matchingRowsIdentifier)})`
        : sql.value(false)

    const totalCountSql =
      sql.query`select count(*) from ${sql.identifier(matchingRowsIdentifier)}`

    const jsonIdentifier = Symbol()
    // Construct our Sql query that will actually do the selecting.
    const query = sql.query`
      with ${sql.identifier(matchingRowsIdentifier)} as (
        select *
        from ${fromSql} as ${sql.identifier(aliasIdentifier)}
        where ${conditionSql}
      ), ${sql.identifier(resultsIdentifier)} as (
        select json_build_object(
          'value', ${getSelectFragment(resolveInfo, matchingRowsIdentifier, gqlType)},
          'cursor', ${offsetSql}::integer + (row_number() over (
            ${this.orderBy ? sql.query`order by ${this.orderBy}` : sql.query`order by 0`}
          ))::integer
        ) as ${sql.identifier(jsonIdentifier)}
        from ${sql.identifier(matchingRowsIdentifier)}
        ${this.orderBy ? sql.query`order by ${this.orderBy}` : sql.query``}
        offset ${offsetSql}
        limit ${limit != null ? sql.value(limit) : sql.query`all`}
      )
      select coalesce((select json_agg(${sql.identifier(jsonIdentifier)}) from ${sql.identifier(resultsIdentifier)}), '[]'::json) as "rows",
      (${totalCountSql})::integer as "totalCount",
      (${limit === 0 ? sql.query`false` : hasNextPageSql})::boolean as "hasNextPage",
      (${limit === 0 ? sql.query`false` : sql.query`${offsetSql} > 0`}) as "hasPreviousPage"
    `

    return {query}
  }

  /**
   * Reads a single page using the offset ordering strategy.
   */
  public async readPage (
    context: mixed,
    input: TInput,
    config: Paginator.PageConfig<OffsetCursor>,
    resolveInfo: mixed,
    gqlType: mixed,
  ): Promise<Paginator.Page<TItemValue, OffsetCursor>> {
    const details = this.generateQuery(input, config, resolveInfo, gqlType, false);
    const {query} = details
    const compiledQuery = sql.compile(query)

    const client = pgClientFromContext(context)
    // Send our query to Postgres.
    const { rows: [value] } = await client.query(compiledQuery)
    return this.valueToPage(value, details)
  }

  public valueToPage (value, _details) {
    const {rows, hasNextPage, hasPreviousPage, totalCount} = value

    // Transform our rows into the values our page expects.
    const values: Array<{ value: TItemValue, cursor: number }> =
      rows.map(({ value, cursor}, i) => ({
        value: this.pgPaginator.itemType.transformPgValueIntoValue(value),
        cursor,
      }))

    return {
      values,
      hasNextPage: () => Promise.resolve(hasNextPage),
      hasPreviousPage: () => Promise.resolve(hasPreviousPage),
      totalCount: () => Promise.resolve(totalCount),
    }
  }
}

export default PgPaginatorOrderingOffset
