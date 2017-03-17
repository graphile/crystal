import { Paginator } from '../../../interface'
import { sql } from '../../utils'
import pgClientFromContext from '../pgClientFromContext'
import PgPaginator from './PgPaginator'

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

  /**
   * Reads a single page using the offset ordering strategy.
   */
  public async readPage (
    context: mixed,
    input: TInput,
    config: Paginator.PageConfig<OffsetCursor>,
  ): Promise<Paginator.Page<TItemValue, OffsetCursor>> {
    const client = pgClientFromContext(context)
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

    // A private variable where we store the value returned by `getCount`.
    let _count: number | undefined

    // A local memoized implementation that gets the count of *all* values in
    // the set we are paginating.
    const getCount = async () => {
      if (_count == null)
        _count = await this.pgPaginator.count(context, input)

      return _count
    }

    let offset: number
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
    if (last == null || (last != null && beforeCursor != null && beforeCursor - (afterCursor != null ? afterCursor : 0) <= last)) {
      // Start selecting at the offset specified by `after`. If there is no
      // after, we start selecting at the beginning (0).
      //
      // Also add our offset if given one.
      offset = (afterCursor != null ? afterCursor : 0) + (_offset || 0)

      // Next create our limit (what we will be selecting to relative to our
      // `offset`).
      limit =
        beforeCursor != null ? Math.min((beforeCursor - 1) - offset, first != null ? first : Infinity) :
        first != null ? first :
        null
    }
    // Otherwise in this block, we will be paginating *backwards*.
    else {
      // Calculate the `offset` by doing some maths. We may need to get the
      // count from the database on this one.
      offset =
        beforeCursor != null
          ? beforeCursor - last - 1
          : Math.max(await getCount() - last, afterCursor != null ? afterCursor : -Infinity)

      // The limit should always simply be `last`. Except in one case, but
      // that case is handled above.
      limit = last
    }

    const aliasIdentifier = Symbol()
    const cteIdentifier = Symbol()
    const fromSql = this.pgPaginator.getFromEntrySql(input)
    const conditionSql = this.pgPaginator.getConditionSql(input)

    // Construct our Sql query that will actually do the selecting.
    const query = sql.compile(sql.query`
      -- The query is wrapped with a CTE on which the to_json function is
      -- applied. This ensures the to_json function is only called on the final
      -- results of the query.
      with ${sql.identifier(cteIdentifier)} as (
        select ${sql.identifier(aliasIdentifier)}.*
        from ${fromSql} as ${sql.identifier(aliasIdentifier)}
        where ${conditionSql}
        ${this.orderBy ? sql.query`order by ${this.orderBy}` : sql.query``}
        offset ${sql.value(offset)}
        limit ${limit != null ? sql.value(limit) : sql.query`all`}
      ) select to_json(${sql.identifier(cteIdentifier)}) as value from ${sql.identifier(cteIdentifier)};
    `)

    // Send our query to Postgres.
    const { rows } = await client.query(query)

    // Transform our rows into the values our page expects.
    const values: Array<{ value: TItemValue, cursor: number }> =
      rows.map(({ value }, i) => ({
        value: this.pgPaginator.itemType.transformPgValueIntoValue(value),
        cursor: offset + 1 + i,
      }))

    // TODO: We get the count in this function (see `getCount`) to paginate
    // correctly. We should create an optimization that allows us to share
    // what the count is instead of calling for the count again.
    return {
      values,
      // We have super simple implementations for `hasNextPage` and
      // `hasPreviousPage` thanks to the algebraic nature of ordering by
      // offset.
      hasNextPage: async () => offset + (limit != null ? limit : Infinity) < await getCount(),
      hasPreviousPage: () => Promise.resolve(offset > 0),
    }
  }
}

export default PgPaginatorOrderingOffset
