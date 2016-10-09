import { Type, Paginator } from '../../../interface'
import { sql } from '../../../postgres/utils'
import PGPaginator from '../../../postgres/inventory/paginator/PGPaginator'
import PGPaginatorOrderingOffset from '../../../postgres/inventory/paginator/PGPaginatorOrderingOffset'
import { PGProcedureFixtures } from './createPGProcedureFixtures'
import createPGProcedureSQLCall from './createPGProcedureSQLCall'

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
class PGProcedurePaginator<TItemValue> extends PGPaginator<ProcedureInput, TItemValue> {
  constructor (
    _fixtures: PGProcedureFixtures,
  ) {
    super()
    this._fixtures = _fixtures
  }

  private _fixtures: PGProcedureFixtures
  public name: string = this._fixtures.pgProcedure.name
  public itemType: Type<TItemValue> = this._fixtures.return.type as Type<TItemValue>

  /**
   * The different ways we can order our procedure. Of course we can order the
   * procedure the natural way, but also we should be able to order by
   * attributes if returned a class.
   */
  // TODO: Add attribute orderings if a class gets returned.
  public orderings: Map<string, Paginator.Ordering<ProcedureInput, TItemValue, mixed>> = (
    new Map([
      ['natural', new PGPaginatorOrderingOffset({ pgPaginator: this })],
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
  public getFromEntrySQL (input: ProcedureInput): sql.SQL {
    return createPGProcedureSQLCall(this._fixtures, input)
  }

  /**
   * The condition when we are using a procedure will always be true.
   */
  public getConditionSQL (): sql.SQL {
    return sql.query`true`
  }
}

export default PGProcedurePaginator
