import {
  GraphQLInputType,
  GraphQLScalarType,
  GraphQLEnumType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLInputObjectType,
} from 'graphql'

/**
 * Sometimes we will have a different field name in GraphQL then the actual
 * internal object key name that we want. When that is the case, use this
 * symbol and `transformGQLInputValue` will rename the field.
 */
export const $$gqlInputObjectTypeValueKeyName = Symbol('gqlInputObjectTypeValueKeyName')

/**
 * When we receive input values, they may be in any shape and form. We must
 * make sure to transform the input values appropriately so that we can use
 * them with our interface.
 */
export default function transformGQLInputValue (type: GraphQLInputType<mixed>, value: mixed): mixed {
  // If this is the value for a scalar type or enum type, it is likely it has
  // already gone through the appropriate transforms. We should just return.
  if (type instanceof GraphQLScalarType || type instanceof GraphQLEnumType)
    return value

  // If this is the value for a non-null type, just do a quick sanity check
  // that the value is actually non-null and recursively call this function
  // again with the base type.
  if (type instanceof GraphQLNonNull) {
    // Confirm this type is non-null.
    if (value == null)
      throw new Error('Value of a GraphQL non-null type must not be null.')

    return transformGQLInputValue(type.ofType, value)
  }

  // If this is the value for a list type, we need to transform all of the list
  // items recursively.
  if (type instanceof GraphQLList) {
    // If the value is null, just return.
    if (value == null)
      return value

    // Confirm our list is actually a list.
    if (!Array.isArray(value))
      throw new Error('Value of a GraphQL list type must be an array.')

    return value.map(item => transformGQLInputValue(type.ofType, item))
  }

  // If this is the value for an input object type, we need to turn the value
  // into a map and rename keys where it is appropriate. If when creating an
  // input object type there are keys you want to rename, use the
  // `$$gqlInputObjectTypeValueKeyName` symbol in your fields.
  if (type instanceof GraphQLInputObjectType) {
    // If the value is null, just return.
    if (value == null)
      return value

    // Make sure we have an object.
    if (typeof value !== 'object')
      throw new Error(`Value of a GraphQL input object type must be an object, not '${typeof value}'.`)

    // Get an array of all our input object’s fields.
    const fields = Object.keys(type.getFields()).map(key => type.getFields()[key])

    // Map all of our fields to values.
    return new Map(
      fields
        .map<[string, mixed]>(field => [
          // Use the field’s name, or a custom name.
          field[$$gqlInputObjectTypeValueKeyName] || field.name,
          // Transform the value for this field recursively.
          transformGQLInputValue(field.type, value[field.name]),
        ])
        // Don’t include exactly undefined values in our map.
        .filter(([, fieldValue]) => typeof fieldValue !== 'undefined')
    )
  }

  // Throw an error here. Just in case.
  throw new Error(`Type '${type.toString()}' is not a valid GraphQL input type.`)
}
