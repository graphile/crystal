import Type from './Type'
import switchType from './switchType'

const getNonNullableType = switchType<Type<mixed>>({
  nullable: type => type.nonNullType,
  list: type => type,
  alias: type => type,
  enum: type => type,
  object: type => type,
  scalar: type => type,
})

export default getNonNullableType
