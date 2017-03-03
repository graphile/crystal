import { Paginator } from '../../../interface'
import { PostGraphQLContext } from '../../../postgraphql/withPostGraphQLContext'
import { sql } from '../../utils'
import PgType from '../type/PgType'

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
   * An abstract method to be implemented by inheritors that will get the Sql
   * for the `from` entry we will use in our `select` queries.
   */
  public abstract getFromEntrySql (input: TInput): sql.Sql

  /**
   * An abstract method that indicates what the condition is for this paginator
   * given some input. For some paginators the input will contain a
   * `Condition`.
   */
  public abstract getConditionSql (input: TInput): sql.Sql

  /**
   * Counts how many values are in our `from` entry total.
   */
  public async count (context: PostGraphQLContext, input: TInput): Promise<number> {
    const fromSql = this.getFromEntrySql(input)
    const conditionSql = this.getConditionSql(input)
    const aliasIdentifier = Symbol()
    const result = await context.pgClient.query(sql.compile(sql.query`select count(${sql.identifier(aliasIdentifier)}) as count from ${fromSql} as ${sql.identifier(aliasIdentifier)} where ${conditionSql}`))
    return parseInt(result.rows[0]['count'], 10)
  }
}

export default PgPaginator
