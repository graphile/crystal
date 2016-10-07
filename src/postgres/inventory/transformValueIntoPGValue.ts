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
  jsonType,
  ObjectType,
} from '../../interface'
import { sql } from '../utils'
import PGObjectType from './type/PGObjectType'

export const $$transformValueIntoPGValue = Symbol()

/**
 * Transforms a value into a Postgres value (SQL) using some extra type
 * information.
 */
// TODO: test
export default function transformValueIntoPGValue (type: Type<mixed>, value: mixed): sql.SQL {
  // If the type has defined a custom transformer, use it.
  if (type[$$transformValueIntoPGValue])
    return type[$$transformValueIntoPGValue](value)

  // If this is a nullable type, just return the null literal if our value is
  // null, if our value is non-null use the non-null type to transform.
  if (type instanceof NullableType)
    return value == null ? sql.query`null` : transformValueIntoPGValue(type.nonNullType, value)

  // If this is a list type, create an array giving all of the items the
  // appropriate transforms.
  if (type instanceof ListType) {
    if (!Array.isArray(value))
      throw new Error('Value of a list type must be an array.')

    return sql.query`array[${sql.join(value.map(item => transformValueIntoPGValue(type.itemType, item)), ', ')}]`
  }

  // If this is an alias type, just transform the base type.
  if (type instanceof AliasType)
    return transformValueIntoPGValue(type.baseType, value)

  // For some simple values, just return the value directly as a placeholder
  // and let Postgres coercion do the rest.
  if (
    type instanceof EnumType ||
    type === booleanType ||
    type === stringType ||
    type === jsonType
  )
    return sql.query`${sql.value(value)}`

  // If this is an integer or a float, return the value but also mark the type
  // as a number by adding `+ 0`. This way Postgres will not accidently
  // interpret the value as a string. This is very important for procedures
  // as if Postgres thinks you are trying to call a function with text and not
  // a number. Errors will happen.
  // TODO: This only happens in the one test case where we have an array of
  // numbers as a procedure argument. Maybe we can only use this trick in that
  // case?
  if (
    type === integerType ||
    type === floatType
  )
    return sql.query`(${sql.value(value)} + 0)`

  // If this is a Postgres object type, let’s do some special tuple stuff.
  if (type instanceof PGObjectType) {
    // Check that we have a value of the correct type.
    if (!type.isTypeOf(value))
      throw new Error('Value is not of the correct type.')

    // We can depend on fields being in the correct tuple order for
    // `PGObjectType`, so we just build a tuple using our fields.
    return sql.query`(${sql.join(Array.from(type.fields).map(([fieldName, field]) =>
      transformValueIntoPGValue(field.type, value.get(fieldName))
    ), ', ')})`
  }

  // If this a normal object type, throw an error. Ain’t nobody got time for
  // dat!
  if (type instanceof ObjectType)
    throw new Error('All Postgres object types should be `PGObjectType`.')

  // If we don’t recognize the type, throw an error.
  throw new Error(`Type '${type.toString()}' is not a recognized type for transforming values into SQL.`)
}
