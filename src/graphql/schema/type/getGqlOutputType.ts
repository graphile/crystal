import {
  GraphQLOutputType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLEnumType,
  GraphQLObjectType,
  GraphQLFieldConfig,
  GraphQLScalarType,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  getNullableType as getNullableGqlType,
  ValueNode,
} from 'graphql'

import {
  switchType,
  Type,
  NullableType,
  ListType,
  AliasType,
  ObjectType,
  ScalarType,
  booleanType,
  integerType,
  floatType,
  stringType,
  jsonType,
} from '../../../interface'

import { formatName, memoize2, buildObject, parseGqlLiteralToValue } from '../../utils'
import BuildToken from '../BuildToken'
import createCollectionGqlType from '../collection/createCollectionGqlType'
import aliasGqlType from './aliasGqlType'

/**
 * The values to be returned by `getGqlInputType`. A GraphQL input type, and a
 * function which will turn a GraphQL input value into a proper interface value
 * (as is specified by `TValue`).
 *
 * @private
 */
type GetGqlOutputTypeReturn<TValue> = {
  gqlType: GraphQLOutputType,
  intoGqlOutput: (value: TValue) => mixed,
}

/**
 * The non-memoized internal implementation of `getGqlOutputType`.
 *
 * @private
 */
const createGqlOutputType = <TValue>(buildToken: BuildToken, _type: Type<TValue>): GetGqlOutputTypeReturn<TValue> =>
  // Switches on the type that we want to build and output type for and will
  // return a `GraphQLOutputType`.
  switchType<GetGqlOutputTypeReturn<TValue>>(_type, {
    // For nullable types we will just get the internal nullable instance of
    // the GraphQL output type and return it. This means stripping the
    // `GraphQLNonNull` wrapper that is around (almost) every type returned by
    // `getGqlOutputType`.
    //
    // When coercing into the output format expected by GraphQL, if the value
    // is of the null variant, we just return `null`. Otherwise we coerce the
    // value using the non-null funciton.
    nullable: <TNonNullValue>(type: NullableType<TNonNullValue>): GetGqlOutputTypeReturn<TNonNullValue | null> => {
      const { gqlType: nonNullGqlType, intoGqlOutput: intoNonNullGqlOutput } = getGqlOutputType(buildToken, type.nonNullType)
      return {
        gqlType: getNullableGqlType(nonNullGqlType),
        intoGqlOutput: value =>
          type.isNonNull(value)
            ? intoNonNullGqlOutput(value)
            : null,
      }
    },

    // For list types we will return a non-null list where the item type is the
    // output type for the interface list’s item type.
    //
    // To coerce into GraphQL output we convert the value into an array and
    // map the items into GraphQL outputs.
    list: <TItemType>(type: ListType<TValue, TItemType>): GetGqlOutputTypeReturn<TValue> => {
      const { gqlType: itemGqlType, intoGqlOutput: intoItemGqlOutput } = getGqlOutputType(buildToken, type.itemType)
      return {
        gqlType: new GraphQLNonNull(new GraphQLList(itemGqlType)),
        intoGqlOutput: value =>
          type.intoArray(value).map(item => intoItemGqlOutput(item)),
      }
    },

    // For alias types we use our `aliasGqlType` helper with the GraphQL
    // output type from our base type.
    //
    // We use the same coercer as the base type.
    alias: (type: AliasType<TValue>): GetGqlOutputTypeReturn<TValue> => {
      const { gqlType: baseGqlType, intoGqlOutput } = getGqlOutputType(buildToken, type.baseType)
      return {
        gqlType: aliasGqlType(baseGqlType, formatName.type(type.name), type.description),
        intoGqlOutput,
      }
    },

    // Enum types will be turned into a non-null GraphQL enum type for which
    // all the variants are variants of this enum. The values of which will be
    // the actual variant values from our enum.
    //
    // The coercion output is just an identity. GraphQL takes care of our
    // enums.
    enum: type => {
      return {
        gqlType: new GraphQLNonNull(new GraphQLEnumType({
          name: formatName.type(type.name),
          description: type.description,
          values: buildObject(Array.from(type.variants).map(([key, value]) => ({
            key: formatName.enumValue(key),
            value: { value },
          }))),
        })),
        intoGqlOutput: value => value,
      }
    },

    // Object types will be created as non-null output object types, the
    // fields of which are extracted using appropriate mechanisms.
    //
    // If this is the type for a collection, we will return the collection
    // type instead of creating a new object type.
    //
    // We don’t coerce object types to output because GraphQL already does a
    // good job of that for us in the resolvers. In our resolvers we will,
    // however, coerce the field values.
    object: (type: ObjectType<TValue>): GetGqlOutputTypeReturn<TValue> => {
      const { inventory } = buildToken
      const collection = inventory.getCollectionForType(type)

      // If there is a collection which uses this type, we should use the
      // collection’s type and not create our own. We use an identity function
      // for `intoGqlOutput` because we output object types with the resolvers.
      if (collection) {
        return {
          gqlType: new GraphQLNonNull(createCollectionGqlType(buildToken, collection)),
          intoGqlOutput: value => value,
        }
      }

      return {
        gqlType: new GraphQLNonNull(new GraphQLObjectType({
          name: formatName.type(type.name),
          description: type.description,
          fields: buildObject<GraphQLFieldConfig<TValue, {}>>(
            // Add all of the fields from the interface object type.
            Array.from(type.fields).map(
              <TFieldValue>([fieldName, field]: [string, ObjectType.Field<TValue, TFieldValue>]) => {
                const { gqlType, intoGqlOutput } = getGqlOutputType(buildToken, field.type)
                return {
                  key: formatName.field(fieldName),
                  value: {
                    description: field.description,
                    type: gqlType,
                    resolve: (value: TValue): mixed => intoGqlOutput(field.getValue(value)),
                  },
                }
              },
            ),
            // Add extra fields that may exist in our hooks.
            buildToken._hooks.objectTypeFieldEntries
              ? buildToken._hooks.objectTypeFieldEntries(type, buildToken)
              : [],
          ),
        })),
        intoGqlOutput: value => value,
      }
    },

    // For scalar types we will create a new non-null GraphQL scalar type. For
    // some basic primitive types we have special cases to use the native
    // GraphQL types.
    //
    // We don’t coerce these types because `GraphQLScalarType#serialize` will
    // do that job for us.
    scalar: (type: ScalarType<TValue>): GetGqlOutputTypeReturn<TValue> => {
      // If the type is similar to a GraphQL type, then we want to use a
      // special case to return some predefined GraphQL types. Also make sure
      // to specify all these types are non-nulls.
      switch (type as ScalarType<mixed>) {
        case booleanType: return { gqlType: new GraphQLNonNull(GraphQLBoolean), intoGqlOutput: value => value }
        case integerType: return { gqlType: new GraphQLNonNull(GraphQLInt), intoGqlOutput: value => value }
        case floatType: return { gqlType: new GraphQLNonNull(GraphQLFloat), intoGqlOutput: value => value }
        case stringType: return { gqlType: new GraphQLNonNull(GraphQLString), intoGqlOutput: value => value }
        case jsonType: return { gqlType: new GraphQLNonNull(createJsonGqlType(buildToken)), intoGqlOutput: value => value }
        default: { /* noop... */ }
      }

      return {
        gqlType: new GraphQLNonNull(new GraphQLScalarType({
          name: formatName.type(type.name),
          description: type.description,
          serialize: (value: TValue): mixed => type.intoOutput(value),
          parseValue: (value: mixed): TValue => type.fromInput(value),
          parseLiteral: (ast: ValueNode): TValue => type.fromInput(parseGqlLiteralToValue(ast)),
        })),
        intoGqlOutput: value => value,
      }
    },
  })

// The actual memoized function. It may not have exactly correct types and we’d
// also like to add special cases.
const _getGqlOutputType = memoize2(createGqlOutputType)

/**
 * Gets a GraphQL output type using a build token and an interface type. This
 * function will return the same output if called multiple times.
 *
 * Returns two things needed for building outputs in GraphQL. A GraphQL output
 * type, and a function which will coerce an internal type system value into a
 * GraphQL value.
 *
 * Some types will be the same as those returned by `getGqlInputType` depending
 * on your type.
 */
export default function getGqlOutputType <TValue>(buildToken: BuildToken, type: Type<TValue>): GetGqlOutputTypeReturn<TValue> {
  // If we have an output type override for this type, let us return that
  // before we call our actual type function. We will automatically define the
  // coercer as an identity function.
  if (buildToken._typeOverrides) {
    const typeOverride = buildToken._typeOverrides.get(type)
    if (typeOverride && typeOverride.output)
      return { gqlType: typeOverride.output, intoGqlOutput: value => value }
  }

  return _getGqlOutputType(buildToken, type)
}

/**
 * The JSON type for our API. If the user set the `dynamicJSON` option to true,
 * arbitrary JSON input and output will be enabled.
 *
 * @private
 */
function createJsonGqlType (buildToken: BuildToken): GraphQLScalarType {
  return (
    buildToken.options.dynamicJson ? (
      new GraphQLScalarType({
        name: 'Json',
        description: jsonType.description,
        serialize: value => value,
        parseValue: value => value,
        parseLiteral: ast => parseAstLiteralIntoValue(ast),
      })
    ) : (
      new GraphQLScalarType({
        name: 'Json',
        description: jsonType.description,
        serialize: value => JSON.stringify(value),
        parseValue: value => typeof value === 'string' ? JSON.parse(value) : null,
        parseLiteral: ast => (ast.kind === 'StringValue' ? JSON.parse(ast.value) : null),
      })
    )
  )
}

/**
 * Parses a GraphQL AST literal into a JavaScript value.
 *
 * @private
 */
function parseAstLiteralIntoValue (ast: ValueNode): mixed {
  switch (ast.kind) {
    case 'StringValue':
    case 'BooleanValue':
      return ast.value
    case 'IntValue':
    case 'FloatValue':
      return parseFloat(ast.value)
    case 'ObjectValue': {
      return ast.fields.reduce((object, field) => {
        object[field.name.value] = parseAstLiteralIntoValue(field.value)
        return object
      }, {})
    }
    case 'ListValue':
      return ast.values.map(parseAstLiteralIntoValue)
    default:
      return null
  }
}
