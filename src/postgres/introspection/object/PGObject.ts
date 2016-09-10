import PGNamespaceObject from './PGNamespaceObject'
import PGClassObject from './PGClassObject'
import PGAttributeObject from './PGAttributeObject'
import PGTypeObject from './PGTypeObject'

/**
 * `PGObject` is a type that represents all of the different shapes of objects
 * that may be returned from our introspection query. To see where the data
 * comes from, look at the `introspection-query.sql` file. The types below are
 * just for statically checking the resulting rows of that query.
 */
type PGObject =
  PGNamespaceObject |
  PGClassObject |
  PGAttributeObject |
  PGTypeObject

export default PGObject
