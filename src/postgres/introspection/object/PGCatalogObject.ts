import PGCatalogNamespace from './PGCatalogNamespace'
import PGCatalogClass from './PGCatalogClass'
import PGCatalogAttribute from './PGCatalogAttribute'
import PGCatalogType from './PGCatalogType'

/**
 * `PGCatalogObject` is a type that represents all of the different shapes of objects
 * that may be returned from our introspection query. To see where the data
 * comes from, look at the `introspection-query.sql` file. The types below are
 * just for statically checking the resulting rows of that query.
 */
type PGCatalogObject =
  PGCatalogNamespace |
  PGCatalogClass |
  PGCatalogAttribute |
  PGCatalogType

export default PGCatalogObject
