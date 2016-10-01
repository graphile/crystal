import {
  Type,
  NullableType,
  ListType,
  AliasType,
  EnumType,
  booleanType,
  integerType,
  floatType,
  stringType,
  ObjectType,
} from '../../interface'

/**
 * If a type has this symbol, then it will be used to transform a value instead
 * of the default transformation.
 */
export const $$transformPGValue = Symbol('transformPGValue')

/**
 * Transforms a Postgres value that we get back from the database into a value
 * we can use in our interface. If the type has an implementation for the
 * symbol `$$transformPGValue` then that implementation will be used.
 */
export default function transformPGValue (type: Type<mixed>, value: mixed): any {
  // If the type has defined a custom implementation for this function, use it.
  if (type[$$transformPGValue])
    return type[$$transformPGValue](value)

  // If the type is a nullable type, make sure to run `transformPGValue` only
  // if the value is not null.
  if (type instanceof NullableType)
    return value == null ? value : transformPGValue(type.nonNullType, value)

  // If the type is a list, let us run `transformPGValue` on all of the list
  // items.
  if (type instanceof ListType) {
    if (!Array.isArray(value))
      throw new Error('Posgres value of list type must be an array.')

    return value.map(item => transformPGValue(type.itemType, item))
  }

  // If this is an alias type, just run the transform function with its base
  // type.
  if (type instanceof AliasType)
    return transformPGValue(type.baseType, value)

  // If the is an enum type, or one of a select few primitive types, trust
  // Postgres did the right thing and return the value.
  if (
    type instanceof EnumType ||
    type === booleanType ||
    type === integerType ||
    type === floatType ||
    type === stringType
  )
    return value

  // If the type is an object type, convert the JavaScript object value into a
  // map. If the value is null or not an object, an error will be thrown.
  if (type instanceof ObjectType) {
    if (value == null)
      throw new Error('Postgres value of object type may not be nullish.')

    if (typeof value !== 'object')
      throw new Error(`Postgres value of object type must be an object, not '${typeof value}'.`)

    return new Map(Array.from(type.fields).map<[string, mixed]>(([fieldName, { type }]) => [fieldName, transformPGValue(type, value[fieldName])]))
  }

  // Throw an error if the type still hasn’t been handled.
  throw new Error(`Type '${type.toString()}' is not a valid type for converting Postgres values into interface values.`)
}
