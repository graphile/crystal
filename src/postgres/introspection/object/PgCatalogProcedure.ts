/**
 * A procedure is a remote function in Postgres. There is much more information
 * involved with procedures, this is just the information we need to
 * create/call procedures.
 *
 * @see https://www.postgresql.org/docs/9.6/static/catalog-pg-proc.html
 */
interface PgCatalogProcedure {
  readonly kind: 'procedure'
  readonly name: string
  readonly description: string | undefined
  readonly namespaceId: string
  readonly isStrict: boolean
  readonly returnsSet: boolean
  readonly isStable: boolean
  readonly returnTypeId: string
  readonly argTypeIds: Array<string>
  readonly argNames: Array<string>
  readonly argDefaultsNum: number
}

export default PgCatalogProcedure
