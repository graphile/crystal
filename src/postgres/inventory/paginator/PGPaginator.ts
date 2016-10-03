import { Type, Paginator } from '../../../interface'
import { sql } from '../../utils'
import pgClientFromContext from '../pgClientFromContext'

/**
 * An abstract base paginator class for Postgres. This class also exposes a
 * couple of methods that are helpful for our orderings.
 */
abstract class PGPaginator<TInput, TItemValue> implements Paginator<TInput, TItemValue> {
  public abstract name: string
  public abstract itemType: Type<TItemValue>
  public abstract orderings: Map<string, Paginator.Ordering<TInput, TItemValue, mixed>>
  public abstract defaultOrdering: Paginator.Ordering<TInput, TItemValue, mixed>

  /**
   * An abstract method to be implemented by inheritors that will get the SQL
   * for the `from` entry we will use in our `select` queries.
   */
  public abstract getFromEntrySQL (input: TInput): sql.SQL

  /**
   * An abstract method that indicates what the condition is for this paginator
   * given some input. For some paginators the input will contain a
   * `Condition`.
   */
  public abstract getConditionSQL (input: TInput): sql.SQL

  /**
   * Counts how many values are in our `from` entry total.
   */
  public async count (context: mixed, input: TInput): Promise<number> {
    const client = pgClientFromContext(context)
    const fromSQL = this.getFromEntrySQL(input)
    const conditionSQL = this.getConditionSQL(input)
    const aliasIdentifier = Symbol()
    const result = await client.query(sql.compile(sql.query`select count(${sql.identifier(aliasIdentifier)}) as count from ${fromSQL} as ${sql.identifier(aliasIdentifier)} where ${conditionSQL}`))
    return parseInt(result.rows[0]['count'], 10)
  }
}

export default PGPaginator
