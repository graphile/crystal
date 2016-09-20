import { Type, NullableType } from '../../interface'
import { PGCatalog, PGCatalogAttribute } from '../introspection'
import getTypeFromPGType from './getTypeFromPGType'

/**
 * Gets a type from a Postgres attribute (or column). All this function
 * basically does is proxies `getTypeFromPGType` and makes sure non-null
 * attributes don’t have nullable types.
 */
export default function getTypeFromPGAttribute (pgCatalog: PGCatalog, pgAttribute: PGCatalogAttribute): Type<mixed> {
  const pgType = pgCatalog.assertGetType(pgAttribute.typeId)
  const type = getTypeFromPGType(pgCatalog, pgType)

  if (pgAttribute.isNotNull && type instanceof NullableType)
    return type.getNonNullType()

  return type
}
