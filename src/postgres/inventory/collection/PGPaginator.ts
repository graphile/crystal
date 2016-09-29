import { Context, Type, Paginator, Condition } from '../../../interface'
import { sql } from '../../utils'
import { PGCatalogAttribute } from '../../introspection'
import { pgClientFromContext } from '../pgContext'
import transformPGValue from '../transformPGValue'
import conditionToSQL from './conditionToSQL'

type PGPaginatorCursor = Array<mixed> | number

// TODO: If we split up `Paginator`, we can move the cursor computation from
// `readPage` into a class method.
abstract class PGPaginator<TValue> implements Paginator<TValue, PGPaginator.Ordering, PGPaginatorCursor> {
  public abstract name: string
  public abstract type: Type<TValue>
  public abstract orderings: Array<PGPaginator.Ordering>
  public abstract defaultOrdering: PGPaginator.Ordering

  /**
   * An abstract method to be implemented by inheritors that will get the SQL
   * for the `from` entry we will use in our `select` queries.
   */
  public abstract getFromEntrySQL (): sql.SQL

  /**
   * Counts how many values are in our `from` entry total.
   */
  public async count (context: Context, condition?: Condition): Promise<number> {
    const client = pgClientFromContext(context)
    const conditionSQL = conditionToSQL(condition != null ? condition : true)
    const result = await client.query(sql.compile(sql.query`select count(alias_x) as count from ${this.getFromEntrySQL()} as alias_x where ${conditionSQL}`)())
    return parseInt(result.rows[0]['count'], 10)
  }

  /**
   * Reads a page of data from our Postgres database. There are different
   * methods this is actually executed which depends on the ordering.
   */
  // TODO: Refactor this into two methods…
  // TODO: Perhaps refactor the paginator into two different classes. This
  // would allow type seperation between cursors and orderings.
  public async readPage (
    context: Context,
    config: Paginator.PageConfig<PGPaginator.Ordering, PGPaginatorCursor>,
  ): Promise<Paginator.Page<TValue, PGPaginatorCursor>> {
    const client = pgClientFromContext(context)
    const { ordering = this.defaultOrdering, beforeCursor, afterCursor, first, last, condition } = config

    const fromSQL = this.getFromEntrySQL()
    const conditionSQL = conditionToSQL(condition || true)

    // Do not allow `first` and `last` to be defined at the same time. THERE
    // MAY ONLY BE 1!!
    if (first != null && last != null)
      throw new Error('`first` and `last` may not be defined at the same time.')

    // ========================================================================
    // Offset Ordering
    // ========================================================================
    //
    // IMPORTANT NOTE: There are two implementations of cursor based pagination
    // in this paginator. One is this offset implementation, and the other is
    // an implementation which uses Postgres columns. Offset based cursor
    // pagination is definetly the easier of the two to implement, but it is
    // much flakier and it negates some of the benefits of cursor based
    // pagination. This does not mean you shouldn’t offset based pagination, it
    // is definetly useful for SQL systems. However, if you are using this as a
    // reference cursor implementation to implement cursor based pagination in
    // your own app prefer ordering with attributes.
    if (ordering.type === 'OFFSET') {
      // Check that the types of our cursors is exactly what we would expect.
      if (afterCursor != null && (typeof afterCursor !== 'number' || !Number.isInteger(afterCursor)))
        throw new Error('The after cursor must be an integer.')
      if (beforeCursor != null && (typeof beforeCursor !== 'number' || !Number.isInteger(beforeCursor)))
        throw new Error('The before cursor must be an integer.')

      // Rename our variables to make it clear they are offsets.
      const afterOffset: number | undefined = afterCursor
      const beforeOffset: number | undefined = beforeCursor

      // A private variable where we store the value returned by `getCount`.
      let _count: number | undefined

      // A local memoized implementation that gets the count of *all* values in
      // the set we are paginating.
      const getCount = async () => {
        if (_count == null)
          _count = await this.count(context, condition)

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
      if (last == null || (last != null && beforeOffset != null && beforeOffset - (afterOffset != null ? afterOffset : 0) <= last)) {
        // Start selecting at the offset specified by `after`. If there is no
        // after, we start selecting at the beginning (0).
        offset = afterOffset != null ? afterOffset : 0

        // Next create our limit (what we will be selecting to relative to our
        // `offset`).
        limit =
          beforeOffset != null ? Math.min((beforeOffset - 1) - offset, first != null ? first : Infinity) :
          first != null ? first :
          null
      }
      // Otherwise in this block, we will be paginating *backwards*.
      else {
        // Calculate the `offset` by doing some maths. We may need to get the
        // count from the database on this one.
        offset =
          beforeOffset != null
            ? beforeOffset - last - 1
            : Math.max(await getCount() - last, afterOffset != null ? afterOffset : -Infinity)

        // The limit should always simply be `last`. Except in one case, but
        // that case is handled above.
        limit = last
      }

      // Construct our SQL query that will actually do the selecting.
      const query = sql.compile(sql.query`
        select to_json(alias_x) as value
        from ${fromSQL} as alias_x
        where ${conditionSQL}
        offset ${sql.value(offset)}
        limit ${limit != null ? sql.value(limit) : sql.raw('all')}
      `)()

      // Send our query to Postgres.
      const { rows } = await client.query(query)

      // Transform our rows into the values our page expects.
      const values: Array<{ value: TValue, cursor: number }> =
        rows.map(({ value }, i) => ({
          value: transformPGValue(this.type, value),
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

    // ========================================================================
    // Attributes Ordering
    // ========================================================================
    else if (ordering.type === 'ATTRIBUTES') {
      const { pgAttributes, descending } = ordering

      // Perform some validations on our cursors. If they do not pass these
      // conditions, we should not proceed.
      if (afterCursor != null && (!Array.isArray(afterCursor) || afterCursor.length !== pgAttributes.length))
        throw new Error('After cursor must be a value tuple of the correct length.')
      if (beforeCursor != null && (!Array.isArray(beforeCursor) || beforeCursor.length !== pgAttributes.length))
        throw new Error('Before cursor must be a value tuple of the correct length.')

      const query = sql.compile(
        sql.query`
          -- The standard select/from clauses up top.
          select to_json(alias_x) as value
          from ${fromSQL} as alias_x

          -- Combine our cursors with the condition used for this page to
          -- implement a where condition which will filter what we want it to.
          --
          -- We throw away nulls because there is a lot of wierdness when they
          -- get included.
          where
            ${sql.join(pgAttributes.map(pgAttribute => sql.query`${sql.identifier(pgAttribute.name)} is not null`), ' and ')} and
            ${beforeCursor ? this._getCursorCondition(pgAttributes, beforeCursor, descending ? '>' : '<') : sql.raw('true')} and
            ${afterCursor ? this._getCursorCondition(pgAttributes, afterCursor, descending ? '<' : '>') : sql.raw('true')} and
            ${conditionSQL}

          -- Order using the same attributes used to construct the cursors. If
          -- a last property was defined we need to reverse our ordering so the
          -- limit will work. We will fix the order in JavaScript.
          order by ${sql.join(pgAttributes.map(pgAttribute =>
            sql.query`${sql.identifier(pgAttribute.name)} using ${sql.raw((last != null ? !descending : descending) ? '>' : '<')}`
          ), ', ')}

          -- Finally, apply the appropriate limit.
          limit ${first != null ? sql.value(first) : last != null ? sql.value(last) : sql.raw('all')}
        `
      )()

      let { rows } = await client.query(query)

      // If `last` was defined we reversed the order in SQL so our limit would
      // work. We need to reverse again when we get here.
      // TODO: We could implement an `O(1)` reverse with iterators. Then we
      // won’t need to reverse in SQL. We could do that given we get `rows`
      // back as an array. We know the final length and we could start
      // returning from the end instead of the beginning.
      if (last != null)
        rows = rows.reverse()

      // Convert our rows into usable values.
      const values: Array<{ value: TValue, cursor: Array<mixed> }> =
        rows.map(({ value }) => ({
          value: transformPGValue(this.type, value),
          cursor: pgAttributes.map(pgAttribute => value[pgAttribute.name]),
        }))

      return {
        values,

        // Gets whether or not we have more values to paginate through by
        // running a simple, efficient SQL query to test.
        hasNextPage: async (): Promise<boolean> => {
          const lastValue = values[values.length - 1]
          const lastCursor = lastValue ? lastValue.cursor : beforeCursor
          if (lastCursor == null) return false

          const { rowCount } = await client.query(sql.compile(sql.query`
            select null
            from ${fromSQL}
            where ${this._getCursorCondition(pgAttributes, lastCursor, descending ? '<' : '>')} and ${conditionSQL}
            limit 1
          `)())

          return rowCount !== 0
        },

        // Gets whether or not we have more values to paginate through by
        // running a simple, efficient SQL query to test.
        hasPreviousPage: async (): Promise<boolean> => {
          const firstValue = values[0]
          const firstCursor = firstValue ? firstValue.cursor : afterCursor
          if (firstCursor == null) return false

          const { rowCount } = await client.query(sql.compile(sql.query`
            select null
            from ${fromSQL}
            where ${this._getCursorCondition(pgAttributes, firstCursor, descending ? '>' : '<')} and ${conditionSQL}
            limit 1
          `)())

          return rowCount !== 0
        },
      }
    }

    // Throw an error if nothing else is available.
    throw new Error(`Ordering of type '${ordering['type']}' is not supported.`)
  }

  /**
   * Gets the condition used to filter our result set using a cursor.
   *
   * @private
   */
  private _getCursorCondition (pgAttributes: Array<PGCatalogAttribute>, cursor: Array<mixed>, operator: string): sql.SQL {
    return sql.query`
      (${sql.join(pgAttributes.map(pgAttribute => sql.identifier(pgAttribute.name)), ', ')})
      ${sql.raw(operator)}
      (${sql.join(cursor.map(sql.value), ', ')})
    `
  }
}

namespace PGPaginator {
  // TODO: doc
  // TODO: For offset ordering we can arbitrary orderings from indexes or the user.
  // TODO: Warn about the dangers of offset ordering.
  // TODO: Document that attribute orderings generate correct cursors.
  export type Ordering =
    OffsetOrdering |
    AttributesOrdering

  export type OffsetOrdering = {
    type: 'OFFSET',
    name: string,
  }

  export type AttributesOrdering = {
    type: 'ATTRIBUTES',
    name: string,
    descending: boolean,
    pgAttributes: Array<PGCatalogAttribute>,
  }
}

export default PGPaginator
