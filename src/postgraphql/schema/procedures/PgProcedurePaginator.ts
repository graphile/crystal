import { Paginator } from '../../../interface'
import { sql } from '../../../postgres/utils'
import PgPaginator from '../../../postgres/inventory/paginator/PgPaginator'
import PgPaginatorOrderingOffset from '../../../postgres/inventory/paginator/PgPaginatorOrderingOffset'
import PgType from '../../../postgres/inventory/type/PgType'
import { PgProcedureFixtures } from './createPgProcedureFixtures'
import createPgProcedureSqlCall from './createPgProcedureSqlCall'

/**
 * The input to our procedure is simply a tuple of values that represent the
 * arguments that will be passed into the function.
 *
 * @private
 */
type ProcedureInput = Array<mixed>

/**
 * A procedure paginator is one in which a Postgres function is the source of
 * all values.
 */
class PgProcedurePaginator<TItemValue> extends PgPaginator<ProcedureInput, TItemValue> {
  constructor (
    private _fixtures: PgProcedureFixtures,
  ) {
    super()
  }

  public name: string = this._fixtures.pgProcedure.name
  public itemType: PgType<TItemValue> = this._fixtures.return.type as PgType<TItemValue>

  /**
   * The different ways we can order our procedure. Of course we can order the
   * procedure the natural way, but also we should be able to order by
   * attributes if returned a class.
   */
  // TODO: Add attribute orderings if a class gets returned.
  public orderings: Map<string, Paginator.Ordering<ProcedureInput, TItemValue, mixed>> = (
    new Map([
      ['natural', new PgPaginatorOrderingOffset({ pgPaginator: this })],
    ])
  )

  /**
   * The default ordering for procedures will always be the natural ordering.
   * This is because the procedure may define an order itself.
   */
  public defaultOrdering: Paginator.Ordering<ProcedureInput, TItemValue, mixed> = this.orderings.get('natural')!

  /**
   * The from entry for this paginator is a Postgres function call where the
   * procedure is the function being called.
   */
  public getFromEntrySql (input: ProcedureInput, firstArgumentIsTableName = false): sql.Sql {
    return createPgProcedureSqlCall(this._fixtures, input, firstArgumentIsTableName)
  }

  /**
   * The condition when we are using a procedure will always be true.
   */
  public getConditionSql (): sql.Sql {
    return sql.query`true`
  }
}

export default PgProcedurePaginator
