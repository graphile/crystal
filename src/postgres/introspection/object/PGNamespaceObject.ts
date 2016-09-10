/**
 * A namespace is the internal name for a schema in PostgreSQL.
 *
 * @see https://www.postgresql.org/docs/9.5/static/catalog-pg-namespace.html
 */
type PGNamespaceObject = {
  kind: 'namespace',
  id: string,
  name: string,
  description: string,
}

export default PGNamespaceObject
