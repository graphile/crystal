import {
  GraphQLOutputType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLEnumType,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  getNullableType as getNullableGqlType,
} from 'graphql'

import { Value as AstValue } from 'graphql/language/ast'

import {
  switchType,
  Type,
  ObjectType,
  ScalarType,
  booleanType,
  integerType,
  floatType,
  stringType,
} from '../../../interface'

import { formatName, memoize2, buildObject, parseGqlLiteralToValue } from '../../utils'
import BuildToken from '../BuildToken'
import createCollectionGqlType from '../collection/createCollectionGqlType'
import aliasGqlType from './aliasGqlType'

/**
 * The non-memoized internal implementation of `getGqlOutputType`.
 *
 * @private
 */
const createGqlOutputType = (buildToken: BuildToken, _type: Type<mixed>): GraphQLOutputType =>
  // Switches on the type that we want to build and output type for and will
  // return a `GraphQLOutputType`.
  switchType<GraphQLOutputType>(_type, {
    // For nullable types we will just get the internal nullable instance of
    // the GraphQL output type and return it. This means stripping the
    // `GraphQLNonNull` wrapper that is around (almost) every type returned by `getGqlOutputType`.
    nullable: type =>
      getNullableGqlType(getGqlOutputType(buildToken, type.nonNullType)),

    // For list types we will return a non-null list where the item type is the
    // output type for the interface list’s item type.
    list: type =>
      new GraphQLNonNull(new GraphQLList(getGqlOutputType(buildToken, type.itemType))),

    // For alias types we use our `aliasGqlType` helper with the GraphQL
    // output type from our base type.
    alias: type =>
      aliasGqlType(getGqlOutputType(buildToken, type.baseType), formatName.type(type.name), type.description),

    // Enum types will be turned into a non-null GraphQL enum type for which
    // all the variants are variants of this enum. The values of which will be
    // the actual variant values from our enum.
    enum: type =>
      new GraphQLNonNull(new GraphQLEnumType({
        name: formatName.type(type.name),
        description: type.description,
        values: buildObject(Array.from(type.variants).map(([key, value]) => ({
          key: formatName.enumValue(key),
          value: { value },
        }))),
      })),

    // Object types will be created as non-null output object types, the
    // fields of which are extracted using appropriate mechanisms.
    //
    // If this is the type for a collection, we will return the collection
    // type instead of creating a new object type.
    object: <TValue>(type: ObjectType<TValue>): GraphQLOutputType => {
      const { inventory } = buildToken
      const collection = inventory.getCollectionForType(type)

      // If there is a collection which uses this type, we should use the
      // collection’s type and not create our own.
      if (collection)
        return new GraphQLNonNull(createCollectionGqlType(buildToken, collection))

      return new GraphQLNonNull(new GraphQLObjectType({
        name: formatName.type(type.name),
        description: type.description,
        fields: buildObject(Array.from(type.fields).map(
          <TFieldValue>([fieldName, field]: [string, ObjectType.Field<TValue, TFieldValue>]) => ({
            key: formatName.field(fieldName),
            value: {
              description: field.description,
              type: getGqlOutputType(buildToken, type),
              resolve: (value: TValue): TFieldValue => field.getValue(value),
            },
          })
        )),
      }))
    },

    // For scalar types we will create a new non-null GraphQL scalar type. For
    // some basic primitive types we have special cases to use the native
    // GraphQL types.
    scalar: <TValue>(type: ScalarType<TValue>): GraphQLOutputType => {
      // If the type is similar to a GraphQL type, then we want to use a
      // special case to return some predefined GraphQL types. Also make sure
      // to specify all these types are non-nulls.
      switch (type as ScalarType<mixed>) {
        case booleanType: return new GraphQLNonNull(GraphQLBoolean)
        case integerType: return new GraphQLNonNull(GraphQLInt)
        case floatType: return new GraphQLNonNull(GraphQLFloat)
        case stringType: return new GraphQLNonNull(GraphQLString)
        default: { /* noop... */ }
      }

      return new GraphQLNonNull(new GraphQLScalarType({
        name: formatName.type(type.name),
        description: type.description,
        serialize: (value: TValue): mixed => type.intoOutput(value),
        parseValue: (value: mixed): TValue => type.fromInput(value),
        parseLiteral: (ast: AstValue): TValue => type.fromInput(parseGqlLiteralToValue(ast)),
      }))
    },
  })

// The actual memoized function. It may not have exactly correct types and we’d
// also like to add special cases.
const _getGqlOutputType = memoize2(createGqlOutputType)

/**
 * Gets a GraphQL output type using a build token and an interface type. This
 * function will return the same output type if called multiple times.
 *
 * Some return values will be the same as `getGqlInputType` depending on your
 * type.
 */
export default function getGqlOutputType (buildToken: BuildToken, type: Type<mixed>): GraphQLOutputType {
  // If we have an output type override for this type, let us return that
  // before we call our actual type function.
  if (buildToken._typeOverrides) {
    const typeOverride = buildToken._typeOverrides.get(type)
    if (typeOverride && typeOverride.output)
      return typeOverride.output
  }

  return _getGqlOutputType(buildToken, type)
}
