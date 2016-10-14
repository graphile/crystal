/**
 * Anything in PostgreSQL that has “attributes” (aka columns). Tables are the
 * most prominent example of a PostgreSQL class, but a class could also be a
 * view, index, or composite type.
 *
 * @see https://www.postgresql.org/docs/9.5/static/catalog-pg-class.html
 */
interface PGCatalogClass {
  readonly kind: 'class'
  readonly id: string
  readonly name: string
  readonly description: string
  readonly namespaceId: string
  readonly typeId: string
  readonly isSelectable: boolean
  readonly isInsertable: boolean
  readonly isUpdatable: boolean
  readonly isDeletable: boolean
}

export default PGCatalogClass
