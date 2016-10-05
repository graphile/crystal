import { Type, ObjectType, Paginator } from '../../interface'
import { sql } from '../../postgres/utils'
import { PGCatalog, PGCatalogNamespace, PGCatalogClass, PGCatalogProcedure } from '../../postgres/introspection'
import PGPaginator from '../../postgres/inventory/paginator/PGPaginator'
import PGPaginatorOrderingOffset from '../../postgres/inventory/paginator/PGPaginatorOrderingOffset'

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
  /**
   * We store a reference to the namespace so we can construct function calls.
   *
   * @private
   */
  private readonly _pgNamespace: PGCatalogNamespace

  /**
   * The following is an array of all our arguments and some extra meta
   * information necessary to use when assembling the function call. We store
   * it as a class instance so that we don’t have to recompute this information
   * every time we get new input.
   *
   * In the future this array may be generalized to support different types of
   * arguments instead of just classes.
   *
   * @private
   */
  private readonly _pgArgClasses: Array<{ pgNamespace: PGCatalogNamespace, pgClass: PGCatalogClass } | null>

  constructor (
    pgCatalog: PGCatalog,
    public pgProcedure: PGCatalogProcedure,
    public itemType: Type<TItemValue>,
  ) {
    super()
    this._pgNamespace = pgCatalog.assertGetNamespace(pgProcedure.namespaceId)

    // The length of `_pgArgClasses` and the length of `pgProcedure.argTypeIds`
    // is the same so that we will have the same type signature.
    this._pgArgClasses = pgProcedure.argTypeIds.map(typeId => {
      const pgType = pgCatalog.assertGetType(typeId)

      // If this is not a composite type, return null.
      if (pgType.type !== 'c')
        return null

      // Get the class…
      const pgClass = pgCatalog.assertGetClass(pgType.classId)

      // Return the class and the class’s namespace…
      return {
        pgClass,
        pgNamespace: pgCatalog.assertGetNamespace(pgClass.namespaceId),
      }
    })
  }

  public name = this.pgProcedure.name

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
  public defaultOrdering = this.orderings.get('natural')!

  /**
   * The from entry for this paginator is a Postgres function call where the
   * procedure is the function being called.
   */
  public getFromEntrySQL (input: ProcedureInput): sql.SQL {
    // Throw an error if our tuple length is different.
    if (input.length !== this._pgArgClasses.length)
      throw new Error('Input tuple is of the incorrect length.')

    // Construct the procedure’s name.
    const procedureName = sql.identifier(this._pgNamespace.name, this.pgProcedure.name)

    // Assemble the argument list we will use.
    const argList = sql.join(this._pgArgClasses.map((argClass, i) => {
      // If no extra information was provided, the expression is just the
      // value.
      if (argClass == null)
        return sql.query`${sql.value(input[i])}`

      // If the argument is a composite type, we need to use
      // `json_populate_record` to turn it from a JSON object into a
      // Postgres record.
      return sql.query`json_populate_record(null::${sql.identifier(argClass.pgNamespace.name, argClass.pgClass.name)}, ${sql.value(input[i])})`
    }), ', ')

    // Finally, assemble the full call.
    return sql.query`${procedureName}(${argList})`
  }

  /**
   * The condition when we are using a procedure will always be true.
   */
  public getConditionSQL (): sql.SQL {
    return sql.query`true`
  }
}

export default PGProcedurePaginator
