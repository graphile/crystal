/**
 * Anything in PostgreSQL that has “attributes” (aka columns). Tables are the
 * most prominent example of a PostgreSQL class, but a class could also be a
 * view, index, or composite type.
 *
 * @see https://www.postgresql.org/docs/9.5/static/catalog-pg-class.html
 */
type PGCatalogClass = {
  kind: 'class',
  id: string,
  name: string,
  description: string,
  namespaceId: string,
  typeId: string,
  isSelectable: boolean,
  isInsertable: boolean,
  isUpdatable: boolean,
  isDeletable: boolean,
}

export default PGCatalogClass
