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
import PgCatalog from '../../introspection/PgCatalog'
import PgCatalogType from '../../introspection/object/PgCatalogType'
import PgCollection from '../collection/PgCollection'
import PgClassObjectType from './PgClassObjectType'
import PgRangeObjectType from './PgRangeObjectType'
import pgUuidType from './individual/pgUuidType'
import pgDatetimeType from './individual/pgDatetimeType'
import pgDateType from './individual/pgDateType'
import pgTimeType from './individual/pgTimeType'
import pgIntervalType from './individual/pgIntervalType'

/**
 * A hardcoded list of PostgreSql type OIDs to interface types. Some types
 * warrant a special type, this is where we grant that. To get all of the types
 * in a database use the following query:
 *
 * ```sql
 * select oid, typname from pg_pgCatalog.pg_type;
 * ```
 *
 * Be careful though, we can rely on type ids that come with PostgreSql, but
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

const _getTypeFromPgType = memoize2(createTypeFromPgType)

/**
 * Converts a PostgreSql type into a type object that our interface expects.
 * This function is memoized, so for the same `pgCatalog` and `pgType` pair,
 * returned will be the *exact* same type. This way we can maintain refrential
 * equality.
 */
// TODO: The third `Inventory` argument is hacky and should be refactored.
function getTypeFromPgType (pgCatalog: PgCatalog, pgType: PgCatalogType, _inventory?: Inventory): Type<mixed> {
  // If this is a composite type, then it may be the type for a row. Search our
  // collections (if an `Inventory` was provided) to see if this type
  // truly is a row type. If we find a collection, just return the collection’s
  // type instead of deferring to our own selection mechanisms.
  //
  // Note that this check is not memoized.
  if (_inventory && pgType.type === 'c') {
    const collection = _inventory.getCollections().find(collection => collection instanceof PgCollection && collection.pgClass.typeId === pgType.id)
    if (collection)
      return new NullableType(collection.type)
  }

  return _getTypeFromPgType(pgCatalog, pgType)
}

export default getTypeFromPgType

function createTypeFromPgType (pgCatalog: PgCatalog, pgType: PgCatalogType): Type<mixed> {
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
      const objectType = new PgClassObjectType(pgCatalog, pgClass)
      return new NullableType(objectType)
    }
    // If this type is a domain type…
    case 'd': {
      const pgBaseType = pgCatalog.assertGetType(pgType.domainBaseTypeId)
      const baseType = getTypeFromPgType(pgCatalog, pgBaseType)

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
      return new PgRangeObjectType(pgCatalog, pgType)
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
        throw new Error('PostgreSql array type does not have an associated element type.')

      const itemType = pgCatalog.assertGetType(pgType.arrayItemTypeId)

      return new NullableType(new ListType(getTypeFromPgType(pgCatalog, itemType)))
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
