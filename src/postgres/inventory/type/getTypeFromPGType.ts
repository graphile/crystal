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
  jsonType,
} from '../../../interface'
import { memoize2 } from '../../utils'
import PGCatalog from '../../introspection/PGCatalog'
import PGCatalogType from '../../introspection/object/PGCatalogType'
import PGCollection from '../collection/PGCollection'
import PGClassObjectType from './PGClassObjectType'
import PGRangeObjectType from './PGRangeObjectType'
import pgUuidType from './individual/pgUuidType'
import pgDatetimeType from './individual/pgDatetimeType'
import pgDateType from './individual/pgDateType'
import pgTimeType from './individual/pgTimeType'
import pgIntervalType from './individual/pgIntervalType'

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
const pgTypeIdToType = new Map<string, Type<mixed>>([
  ['20', integerType],      // int8, bigint
  ['21', integerType],      // int2, smallint
  ['23', integerType],      // int4, integer
  ['114', jsonType],        // json
  ['3802', jsonType],       // jsonb
  ['2950', pgUuidType],     // uuid
  ['1082', pgDateType],     // date
  ['1114', pgDatetimeType], // timestamp
  ['1184', pgDatetimeType], // timestamptz
  ['1083', pgTimeType],     // time
  ['1266', pgTimeType],     // timetz
  ['1186', pgIntervalType], // interval
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
    const collection = _inventory.getCollections().find(collection => collection instanceof PGCollection && collection.pgClass.typeId === pgType.id)
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
  switch (pgType.type) {
    // If this type is a composite type…
    case 'c': {
      const pgClass = pgCatalog.assertGetClass(pgType.classId)
      const objectType = new PGClassObjectType(pgCatalog, pgClass)
      return new NullableType(objectType)
    }
    // If this type is a domain type…
    case 'd': {
      const pgBaseType = pgCatalog.assertGetType(pgType.domainBaseTypeId)
      const baseType = getTypeFromPGType(pgCatalog, pgBaseType)

      const aliasType = new AliasType({
        name: pgType.name,
        description: pgType.description,
        baseType: baseType instanceof NullableType ? baseType.nonNullType : baseType,
      })

      return pgType.domainIsNotNull ? aliasType : new NullableType(aliasType)
    }
    // If this type is an enum type…
    case 'e': {
      return new NullableType(new EnumType({
        name: pgType.name,
        description: pgType.description,
        variants: new Set(pgType.enumVariants),
      }))
    }
    // If this type is a range type…
    // TODO: test
    case 'r':
      return new PGRangeObjectType(pgCatalog, pgType)
    default: {
      /* noop */
    }
  }

  // If the type isn’t of a certain kind, let’s use the category which is used
  // for coercion in the parser.
  switch (pgType.category) {
    // If our type is of the array category, return a list type.
    case 'A': {
      if (!pgType.arrayItemTypeId)
        throw new Error('PostgreSQL array type does not have an associated element type.')

      const itemType = pgCatalog.assertGetType(pgType.arrayItemTypeId)

      return new NullableType(new ListType(getTypeFromPGType(pgCatalog, itemType)))
    }
    case 'B':
      return new NullableType(booleanType)
    // If our type is of the number category, return a float type. We check
    // for integers with `pgTypeIdToType`.
    case 'N':
      return new NullableType(floatType)
    default: {
      /* noop */
    }
  }

  // If all else fails, we just return a nullable string :)
  return new NullableType(stringType)
}
