import Type from './Type'
import NamedType from './NamedType'
import switchType from './switchType'

/**
 * Gets the named type for a given type. The named type will have a name in
 * description, getting this type can be useful when generating documentation.
 *
 * Basically this only recursively unfolds nullable and list types while just
 * returning everyone else.
 */
const getNamedType: (type: Type<mixed>) => NamedType<mixed> = switchType<NamedType<mixed>>({
  nullable: type => getNamedType(type.nonNullType),
  list: type => getNamedType(type.itemType),
  alias: type => type,
  enum: type => type,
  object: type => type,
  scalar: type => type,
})

export default getNamedType
