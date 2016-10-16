import PgCatalogNamespace from './PgCatalogNamespace'
import PgCatalogClass from './PgCatalogClass'
import PgCatalogAttribute from './PgCatalogAttribute'
import PgCatalogType from './PgCatalogType'
import PgCatalogConstraint from './PgCatalogConstraint'
import PgCatalogProcedure from './PgCatalogProcedure'

/**
 * `PgCatalogObject` is a type that represents all of the different shapes of objects
 * that may be returned from our introspection query. To see where the data
 * comes from, look at the `introspection-query.sql` file. The types below are
 * just for statically checking the resulting rows of that query.
 */
type PgCatalogObject =
  PgCatalogNamespace |
  PgCatalogClass |
  PgCatalogAttribute |
  PgCatalogType |
  PgCatalogConstraint |
  PgCatalogProcedure

export default PgCatalogObject
