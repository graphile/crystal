import { Paginator } from '../../../interface'
import { sql } from '../../utils'
import PgType from '../type/PgType'
import pgClientFromContext from '../pgClientFromContext'

/**
 * An abstract base paginator class for Postgres. This class also exposes a
 * couple of methods that are helpful for our orderings.
 */
abstract class PgPaginator<TInput, TItemValue> implements Paginator<TInput, TItemValue> {
  public abstract name: string
  public abstract itemType: PgType<TItemValue>
  public abstract orderings: Map<string, Paginator.Ordering<TInput, TItemValue, mixed>>
  public abstract defaultOrdering: Paginator.Ordering<TInput, TItemValue, mixed>

  /**
   * An abstract method to be implemented by inheritors that will get the Sql fragments
   * for the `from`, `groupBy` and (part of the) `where` clauses,
   * given some input.
   */
  public abstract getQuerySqlFragments (input: TInput): {
    conditionSql: sql.Sql,
    fromSql: sql.Sql,
    groupBySql: sql.Sql,
    initialTable: string,
  }

  /**
   * Counts how many values are in our `from` entry total.
   */
  public async count (context: mixed, input: TInput): Promise<number> {
    const client = pgClientFromContext(context)
    const { conditionSql, fromSql, groupBySql } = this.getQuerySqlFragments(input)
    const { rowCount } = await client.query(sql.compile(sql.query`
      select null from ${fromSql} where ${conditionSql} ${groupBySql}
    `))
    return rowCount
  }
}

export default PgPaginator
