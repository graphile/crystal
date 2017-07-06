import { Paginator } from '../../../interface'
import { PgCatalogAttribute } from '../../introspection'
import { sql } from '../../utils'
import pgClientFromContext from '../pgClientFromContext'
import PgClassType from '../type/PgClassType'
import PgPaginator from './PgPaginator'

/**
 * The cursor type when we are ordering by attributes is just a fixed length
 * tuple of mixed values.
 *
 * @private
 */
type AttributesCursor = Array<mixed>

/**
 * The `PgPaginatorOrderingAttributes` paginator ordering implements an
 * ordering strategy that involves sorting on the attributes of a given
 * `PgObjectType`. We use the `<` and `>` operators in Postgres to implement
 * the before/after cursors and we also ordering using those operators.
 */
class PgPaginatorOrderingAttributes<TInput>
implements Paginator.Ordering<TInput, PgClassType.Value, AttributesCursor> {
  public pgPaginator: PgPaginator<TInput, PgClassType.Value>
  public descending: boolean
  public pgAttributes: Array<PgCatalogAttribute>

  constructor (config: {
    pgPaginator: PgPaginator<TInput, PgClassType.Value>,
    descending?: boolean,
    pgAttributes: Array<PgCatalogAttribute>,
  }) {
    this.pgPaginator = config.pgPaginator
    this.descending = config.descending != null ? config.descending : false
    this.pgAttributes = config.pgAttributes
  }

  /**
   * Reads a single page for this ordering.
   */
  public async readPage (
    context: mixed,
    input: TInput,
    config: Paginator.PageConfig<AttributesCursor>,
  ): Promise<Paginator.Page<PgClassType.Value, AttributesCursor>> {
    const client = pgClientFromContext(context)
    const { descending, pgAttributes } = this
    const { beforeCursor, afterCursor, first, last, _offset } = config

    // Do not allow `first` and `last` to be defined at the same time. THERE
    // MAY ONLY BE 1!!
    if (first != null && last != null)
      throw new Error('`first` and `last` may not be defined at the same time.')

    // Disallow the use of `offset` with `last`. We are currently still
    // evaluating how best to implement paginators and offsets, trying to
    // support `last` and `offset` adds complexity we don’t need.
    if (_offset != null && last != null)
      throw new Error('`offset` may not be used with `last`.')

    // Perform some validations on our cursors. If they do not pass these
    // conditions, we should not proceed.
    if (afterCursor != null && afterCursor.length !== pgAttributes.length)
      throw new Error('After cursor must be a value tuple of the correct length.')
    if (beforeCursor != null && beforeCursor.length !== pgAttributes.length)
      throw new Error('Before cursor must be a value tuple of the correct length.')

    const aliasIdentifier = Symbol()
    const cteIdentifier = Symbol()
    const fromSql = this.pgPaginator.getFromEntrySql(input)
    const conditionSql = this.pgPaginator.getConditionSql(input)

    const query = sql.compile(sql.query`
      -- The query is wrapped with a CTE on which the to_json function is
      -- applied. This ensures the to_json function is only called on the final
      -- results of the query.
      with ${sql.identifier(cteIdentifier)} as (
        -- The standard select/from clauses up top.
        select ${sql.identifier(aliasIdentifier)} as value
        from ${fromSql} as ${sql.identifier(aliasIdentifier)}

        -- Combine our cursors with the condition used for this page to
        -- implement a where condition which will filter what we want it to.
        --
        -- We throw away nulls because there is a lot of wierdness when they
        -- get included.
        where
          ${sql.join(pgAttributes.map(pgAttribute => sql.query`${sql.identifier(pgAttribute.name)} is not null`), ' and ')} and
          ${beforeCursor ? this._getCursorCondition(pgAttributes, beforeCursor, descending ? '>' : '<') : sql.raw('true')} and
          ${afterCursor ? this._getCursorCondition(pgAttributes, afterCursor, descending ? '<' : '>') : sql.raw('true')} and
          ${conditionSql}

        -- Order using the same attributes used to construct the cursors. If
        -- a last property was defined we need to reverse our ordering so the
        -- limit will work. We will fix the order in JavaScript.
        order by ${sql.join(pgAttributes.map(pgAttribute =>
          sql.query`${sql.identifier(pgAttribute.name)} using ${sql.raw((last != null ? !descending : descending) ? '>' : '<')}`,
        ), ', ')}

        -- Finally, apply the appropriate limit.
        limit ${first != null ? sql.value(first) : last != null ? sql.value(last) : sql.raw('all')}

        -- If we have an offset, add that as well.
        ${_offset != null ? sql.query`offset ${sql.value(_offset)}` : sql.query``}
      ) select to_json(${sql.identifier(cteIdentifier)}.value) as value from ${sql.identifier(cteIdentifier)};
    `)

    let { rows } = await client.query(query)

    // If `last` was defined we reversed the order in Sql so our limit would
    // work. We need to reverse again when we get here.
    // TODO: We could implement an `O(1)` reverse with iterators. Then we
    // won’t need to reverse in Sql. We could do that given we get `rows`
    // back as an array. We know the final length and we could start
    // returning from the end instead of the beginning.
    if (last != null)
      rows = rows.reverse()

    // Convert our rows into usable values.
    const values: Array<{ value: PgClassType.Value, cursor: AttributesCursor }> =
      rows.map(({ value }) => ({
        value: this.pgPaginator.itemType.transformPgValueIntoValue(value),
        cursor: pgAttributes.map(pgAttribute => value[pgAttribute.name]),
      }))

    return {
      values,

      // Gets whether or not we have more values to paginate through by
      // running a simple, efficient Sql query to test.
      hasNextPage: async (): Promise<boolean> => {
        const lastValue = values[values.length - 1]
        const lastCursor = lastValue ? lastValue.cursor : beforeCursor
        if (lastCursor == null) return false

        const { rowCount } = await client.query(sql.compile(sql.query`
          select null
          from ${fromSql}
          where ${this._getCursorCondition(pgAttributes, lastCursor, descending ? '<' : '>')} and ${conditionSql}
          limit 1
        `))

        return rowCount !== 0
      },

      // Gets whether or not we have more values to paginate through by
      // running a simple, efficient Sql query to test.
      hasPreviousPage: async (): Promise<boolean> => {
        const firstValue = values[0]
        const firstCursor = firstValue ? firstValue.cursor : afterCursor
        if (firstCursor == null) return false

        const { rowCount } = await client.query(sql.compile(sql.query`
          select null
          from ${fromSql}
          where ${this._getCursorCondition(pgAttributes, firstCursor, descending ? '>' : '<')} and ${conditionSql}
          limit 1
        `))

        return rowCount !== 0
      },
    }
  }

  /**
   * Gets the condition used to filter our result set using a cursor.
   *
   * @private
   */
  private _getCursorCondition (pgAttributes: Array<PgCatalogAttribute>, cursor: Array<mixed>, operator: string): sql.Sql {
    return sql.query`
      (${sql.join(pgAttributes.map(pgAttribute => sql.identifier(pgAttribute.name)), ', ')})
      ${sql.raw(operator)}
      (${sql.join(cursor.map(sql.value), ', ')})
    `
  }
}

export default PgPaginatorOrderingAttributes
