/**
 * A namespace is the internal name for a schema in PostgreSQL.
 *
 * @see https://www.postgresql.org/docs/9.5/static/catalog-pg-namespace.html
 */
interface PGCatalogNamespace {
  readonly kind: 'namespace'
  readonly id: string
  readonly name: string
  readonly description: string
}

export default PGCatalogNamespace
