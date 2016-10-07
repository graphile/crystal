import {
  Inventory,
  Type,
  AliasType,
  NullableType,
  ListType,
  EnumType,
  booleanType,
  integerType,
  floatType,
  stringType,
} from '../../../interface'
import { memoize2 } from '../../utils'
import PGCatalog from '../../introspection/PGCatalog'
import PGCatalogType from '../../introspection/object/PGCatalogType'
import PGCollection from '../collection/PGCollection'
import PGClassObjectType from './PGClassObjectType'

/**
 * The type for a JSON blob. It’s just a string…
 *
 * @private
 */
const jsonType = new AliasType({
  name: 'json',
  description: 'An untyped serialized JSON string.',
  baseType: stringType,
})

/**
 * The type for a universal identifier as defined by [RFC 4122][1].
 *
 * [1]: https://tools.ietf.org/html/rfc4122
 *
 * @private
 */
const uuidType = new AliasType({
  name: 'uuid',
  description:
    'A universally unique identifier as defined by ' +
    '[RFC 4122](https://tools.ietf.org/html/rfc4122).',
  baseType: stringType,
})

/**
 * A hardcoded list of PostgreSQL type OIDs to interface types. Some types
 * warrant a special type, this is where we grant that. To get all of the types
 * in a database use the following query:
 *
 * ```sql
 * select oid, typname from pg_pgCatalog.pg_type;
 * ```
 *
 * Be careful though, we can rely on type ids that come with PostgreSQL, but
 * some ids are database specific.
 *
 * @private
 */
const pgTypeIdToType = new Map<string, Type<any>>([
  ['20', integerType], // int8, bigint
  ['21', integerType], // int2, smallint
  ['23', integerType], // int4, integer
  ['114', jsonType], // json
  ['3802', jsonType], // jsonb
  ['2950', uuidType], // uuid
])

const _getTypeFromPGType = memoize2(createTypeFromPGType)

/**
 * Converts a PostgreSQL type into a type object that our interface expects.
 * This function is memoized, so for the same `pgCatalog` and `pgType` pair,
 * returned will be the *exact* same type. This way we can maintain refrential
 * equality.
 */
// TODO: The third `Inventory` argument is hacky and should be refactored.
function getTypeFromPGType (pgCatalog: PGCatalog, pgType: PGCatalogType, _inventory?: Inventory): Type<mixed> {
  // If this is a composite type, then it may be the type for a row. Search our
  // collections (if an `Inventory` was provided) to see if this type
  // truly is a row type. If we find a collection, just return the collection’s
  // type instead of deferring to our own selection mechanisms.
  //
  // Note that this check is not memoized.
  if (_inventory && pgType.type === 'c') {
    const collection = _inventory.getCollections().find(collection => collection instanceof PGCollection && collection._pgClass.typeId === pgType.id)
    if (collection)
      return new NullableType(collection.type)
  }

  return _getTypeFromPGType(pgCatalog, pgType)
}

export default getTypeFromPGType

function createTypeFromPGType (pgCatalog: PGCatalog, pgType: PGCatalogType): Type<mixed> {
  if (!pgCatalog.hasType(pgType))
    throw new Error(`Postgres type of name '${pgType.name}' and id '${pgType.id}' does not exist.`)

  // If our type id was hardcoded to have a certain type, use it.
  if (pgTypeIdToType.has(pgType.id))
    return new NullableType(pgTypeIdToType.get(pgType.id)!)

  // If the type is one of these kinds, it is a special case and should be
  // treated as such.
  // TODO: Add better range type support.
  switch (pgType.type) {
    // If this type is a composite type…
    case 'c': {
      const pgClass = pgCatalog.assertGetClass(pgType.classId)
      const objectType = new PGClassObjectType(pgCatalog, pgClass)
      return new NullableType(objectType)
    }
    // If this type is a domain type…
    case 'd': {
      const pgBaseType = pgCatalog.assertGetType(pgType.baseTypeId)
      let baseType = getTypeFromPGType(pgCatalog, pgBaseType)

      // If the domain type has the `NOT NULL` contraint, we need to strip away the
      // `NullableType` wrapper that exists most of the time on PostgreSQL types.
      if (pgType.isNotNull && baseType instanceof NullableType)
        baseType = baseType.nonNullType

      const aliasType = new AliasType({
        name: pgType.name,
        description: pgType.description,
        baseType,
      })

      return aliasType
    }
    // If this type is an enum type…
    case 'e': {
      return new NullableType(new EnumType({
        name: pgType.name,
        description: pgType.description,
        variants: new Set(pgType.enumVariants),
      }))
    }
  }

  // If the type isn’t of a certain kind, let’s use the category which is used
  // for coercion in the parser.
  switch (pgType.category) {
    // If our type is of the array category, return a list type.
    case 'A': {
      if (!pgType.itemId)
        throw new Error('PostgreSQL array type does not have an associated element type.')

      const itemType = pgCatalog.assertGetType(pgType.itemId)

      return new NullableType(new ListType(getTypeFromPGType(pgCatalog, itemType)))
    }
    case 'B':
      return new NullableType(booleanType)
    // If our type is of the number category, return a float type. We check
    // for integers with `pgTypeIdToType`.
    case 'N':
      return new NullableType(floatType)
  }

  // If all else fails, we just return a nullable string :)
  return new NullableType(stringType)
}
