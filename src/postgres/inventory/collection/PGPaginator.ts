import { Type, Paginator, Condition } from '../../../interface'
import { sql } from '../../utils'
import { PGCatalogAttribute } from '../../introspection'
import isPGContext from '../isPGContext'
import conditionToSQL from './conditionToSQL'

abstract class PGPaginator<TValue> implements Paginator<TValue, PGPaginator.Ordering, Array<mixed>> {
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
   * Transforms the value from Postgres into an actual value.
   */
  public abstract transformPGValue (value: { [key: string]: mixed }): TValue

  /**
   * Counts how many values are in our `from` entry total.
   */
  public async count (context: mixed, condition?: Condition): Promise<number> {
    if (!isPGContext(context)) throw isPGContext.error()
    const { client } = context
    const conditionSQL = conditionToSQL(condition != null ? condition : true)
    const result = await client.query(sql.compile(sql.query`select count(x) as count from ${this.getFromEntrySQL()} as x where ${conditionSQL}`)())
    return parseInt(result.rows[0]['count'], 10)
  }

  /**
   * Reads a page of data from our Postgres database. There are different methods this is actually executed which depends on
   */
  public async readPage (
    context: mixed,
    config: Paginator.PageConfig<PGPaginator.Ordering, Array<mixed>>,
  ): Promise<Paginator.Page<TValue, Array<mixed>>> {
    if (!isPGContext(context)) throw isPGContext.error()
    const { client } = context
    const { ordering = this.defaultOrdering, beforeCursor, afterCursor, first, last, condition } = config

    // const fromEntrySQL = sql.query`${sql.identifier(this._pgNamespace.name, this._pgClass.name)}`
    const conditionSQL = conditionToSQL(condition || true)

    if (first != null && last != null)
      throw new Error('`first` and `last` may not be defined at the same time.')

    // TODO: Implement offset ordering.
    if (ordering.type === 'OFFSET') {
      throw new Error('Unimplemented')
    }
    // When we are provided exact information about the query we are ordering,
    // there are many things we can optimize.
    else if (ordering.type === 'ATTRIBUTES') {
      const { pgAttributes, descending } = ordering

      const query = sql.compile(
        sql.query`
          -- The standard select/from clauses up top.
          select to_json(x) as value
          from ${this.getFromEntrySQL()} as x

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
          value: this.transformPGValue(value),
          cursor: pgAttributes.map(pgAttribute => value[pgAttribute.name])
        }))

      return {
        values,

        // Gets whether or not we have more values to paginate through by
        // running a simple, efficient SQL query to test.
        async hasNextPage (): Promise<boolean> {
          const lastValue = values[values.length - 1]
          const lastCursor = lastValue ? lastValue.cursor : null
          if (!lastCursor) return false

          const { rowCount } = await client.query(sql.compile(sql.query`
            select null
            from ${this.getFromEntrySQL()}
            where ${this._getCursorCondition(pgAttributes, lastCursor, '>')} and ${conditionSQL}
            limit 1
          `)())

          return rowCount !== 0
        },

        // Gets whether or not we have more values to paginate through by
        // running a simple, efficient SQL query to test.
        async hasPreviousPage (): Promise<boolean> {
          const firstValue = values[0]
          const firstCursor = firstValue ? firstValue.cursor : null
          if (!firstCursor) return false

          const { rowCount } = await client.query(sql.compile(sql.query`
            select null
            from ${this.getFromEntrySQL()}
            where ${this._getCursorCondition(pgAttributes, firstCursor, '<')} and ${conditionSQL}
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
