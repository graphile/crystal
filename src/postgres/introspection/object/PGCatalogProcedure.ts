/**
 * A procedure is a remote function in Postgres. There is much more information
 * involved with procedures, this is just the information we need to
 * create/call procedures.
 *
 * @see https://www.postgresql.org/docs/9.6/static/catalog-pg-proc.html
 */
type PGCatalogProcedure = {
  kind: 'procedure',
  name: string,
  description: string | undefined,
  isStrict: boolean,
  returnsSet: boolean,
  isStable: boolean,
  returnTypeId: string,
  argTypeIds: Array<string>,
  argNames: Array<string>,
}

export default PGCatalogProcedure
