import {
  GraphQLType,
  GraphQLInputType,
  GraphQLOutputType,
  GraphQLNullableType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLNamedType,
  GraphQLScalarType,
  GraphQLEnumType,
  GraphQLEnumValueConfig,
  GraphQLObjectType,
  GraphQLFieldConfig,
  GraphQLInputObjectType,
  GraphQLInputFieldConfig,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  getNullableType,
  isInputType,
  isOutputType,
  Kind,
  Value as ASTValue,
} from 'graphql'

import {
  Type,
  NullableType,
  ListType,
  NamedType,
  AliasType,
  EnumType,
  ObjectType,
  booleanType,
  integerType,
  floatType,
  stringType,
  jsonType,
  switchType,
} from '../../interface'

import { buildObject, formatName, memoize1 } from '../utils'
import getCollectionGqlType from './collection/getCollectionGqlType'
import { $$gqlInputObjectTypeValueKeyName } from './transformGqlInputValue'
import BuildToken from './BuildToken'

// TODO: doc
const cache = new WeakMap<BuildToken, {
  inputCache: WeakMap<Type<mixed>, GraphQLInputType<mixed>>,
  outputCache: WeakMap<Type<mixed>, GraphQLOutputType<mixed>>,
}>()

// TODO: doc
// Instead of using our utility memoization function, we implement our own
// memoization logic here because in some scenarios we want to return the same
// result regardless of whether the `input` is true or false.
function getGqlType (buildToken: BuildToken, type: Type<mixed>, input: true): GraphQLInputType<mixed>
function getGqlType (buildToken: BuildToken, type: Type<mixed>, input: false): GraphQLOutputType<mixed>
function getGqlType (buildToken: BuildToken, type: Type<mixed>, input: boolean): GraphQLType<mixed> {
  const { _typeOverrides } = buildToken

  // If this type has an override, let us try to use it. If we want an input
  // type, and there is an input type override, use it. If we want an output
  // type and there is an output type override, use it.
  if (_typeOverrides.has(type)) {
    const typeOverride = _typeOverrides.get(type)!
    if (input && typeOverride.input) return typeOverride.input
    if (!input && typeOverride.output) return typeOverride.output
  }

  if (!cache.get(buildToken))
    cache.set(buildToken, { inputCache: new WeakMap(), outputCache: new WeakMap() })

  const { inputCache, outputCache } = cache.get(buildToken)!

  if (input === true && !inputCache.has(type)) {
    const gqlType = createGqlType(buildToken, type, true)
    if (isInputType(gqlType)) inputCache.set(type, gqlType)
    if (isOutputType(gqlType)) outputCache.set(type, gqlType)
  }

  if (input === false && !outputCache.has(type)) {
    const gqlType = createGqlType(buildToken, type, false)
    if (isInputType(gqlType)) inputCache.set(type, gqlType)
    if (isOutputType(gqlType)) outputCache.set(type, gqlType)
  }

  return input ? inputCache.get(type)! : outputCache.get(type)!
}

export default getGqlType

/**
 * Parses a GraphQL AST literal into a JavaScript value.
 *
 * @private
 */
function parseAstLiteralIntoValue (ast: ASTValue): mixed {
  switch (ast.kind) {
    case Kind.STRING:
    case Kind.BOOLEAN:
      return ast.value
    case Kind.INT:
    case Kind.FLOAT:
      return parseFloat(ast.value)
    case Kind.OBJECT: {
      return ast.fields.reduce((object, field) => {
        object[field.name.value] = parseAstLiteralIntoValue(field.value)
        return object
      }, {})
    }
    case Kind.LIST:
      return ast.values.map(parseAstLiteralIntoValue)
    default:
      return null
  }
}

/**
 * The JSON type for our API. If the user set the `dynamicJSON` option to true,
 * arbitrary JSON input and output will be enabled.
 *
 * @private
 */
export const _getJsonGqlType = memoize1((buildToken: BuildToken): GraphQLScalarType<string> =>
  buildToken.options.dynamicJson
    ? (
      new GraphQLScalarType({
        name: 'Json',
        description: jsonType.description,
        serialize: value => typeof value === 'string' ? JSON.parse(value) : null,
        parseValue: value => JSON.stringify(value),
        parseLiteral: ast => JSON.stringify(parseAstLiteralIntoValue(ast)),
      })
    )
    : (
      new GraphQLScalarType({
        name: 'Json',
        description: jsonType.description,
        serialize: String,
        parseValue: String,
        parseLiteral: ast => (ast.kind === Kind.STRING ? ast.value : null),
      })
    ),
)

/**
 * Creates a type. This method mainly wraps `createNullableType`
 * and additionally inverts the nullability of types.
 *
 * @private
 */
function createGqlType (buildToken: BuildToken, type: Type<mixed>, input: boolean): GraphQLType<mixed> {
  switchType(type, {})
  // We want to ignore the nullability rules for `AliasType`. If the type we
  // are aliasing is nullable or non null then `AliasType` will automatically
  // pick that up.
  if (type instanceof AliasType) {
    return _createGqlTypeAlias(
      // TODO: Remove the `input as any` when the Typescript bug is fixed.
      // tslint:disable-next-line no-any
      getGqlType(buildToken, type.baseType, input as any),
      formatName.type(type.name),
      type.description,
    )
  }

  if (type instanceof NullableType)
    // TODO: Remove the `input as any` when the Typescript bug is fixed.
    // tslint:disable-next-line no-any
    return getNullableType(getGqlType(buildToken, type.nonNullType, input as any))

  return new GraphQLNonNull(createGqlNullableType(buildToken, type, input))
}

/**
 * Creates a nullable type. This method handles all other supported unnamed
 * types and then calls `createNamedType` to create any named
 * types.
 *
 * @private
 */
function createGqlNullableType (buildToken: BuildToken, type: Type<mixed>, input: boolean): GraphQLNullableType<mixed> {
  if (type instanceof ListType)
    // TODO: Remove the `input as any` when the Typescript bug is fixed.
      // tslint:disable-next-line no-any
    return new GraphQLList(getGqlType(buildToken, type.itemType, input as any))

  if (!isNamedType(type)) {
    throw new Error(
      `Cannot convert unnamed type of constructor '${type.constructor.name}' ` +
      'to a GraphQL type.',
    )
  }

  return createGqlNamedType(buildToken, type, input)
}

/**
 * Creates a named type.
 *
 * @private
 */
function createGqlNamedType (buildToken: BuildToken, type: NamedType<mixed>, input: boolean): GraphQLNamedType<mixed> {
  if (type instanceof EnumType) {
    return new GraphQLEnumType({
      name: formatName.type(type.name),
      description: type.description,
      values: buildObject(
        Array.from(type.variants).map<[string, GraphQLEnumValueConfig<string>]>(variant =>
          [formatName.enumValue(variant), {
            value: variant,
          }],
        ),
      ),
    })
  }

  if (type instanceof ObjectType)
    return input ? createGqlInputObjectType(buildToken, type) : createGqlOutputObjectType(buildToken, type)

  // The primitive types are constants, so let’s just return their constant
  // GraphQL type.
  switch (type) {
    case booleanType: return GraphQLBoolean
    case integerType: return GraphQLInt
    case floatType: return GraphQLFloat
    case stringType: return GraphQLString
    case jsonType: return _getJsonGqlType(buildToken)
    default: { /* noop */ }
  }

  throw new Error(
    `Cannot convert named type of constructor '${type.constructor.name}' ` +
    'to a GraphQL type.',
  )
}

/**
 * Creates a basic output object type with none of the trimmings that a
 * collection object type may have.
 *
 * @private
 */
function createGqlOutputObjectType (buildToken: BuildToken, type: ObjectType): GraphQLObjectType<mixed> {
  const { inventory } = buildToken
  const collection = inventory.getCollections().find(c => c.type === type)

  // If there is a collection which uses this type, we should use the
  // collection’s type and not create our own.
  if (collection)
    return getCollectionGqlType(buildToken, collection)

  return new GraphQLObjectType<ObjectType.Value>({
    name: formatName.type(type.name),
    description: type.description,
    fields: () => buildObject<GraphQLFieldConfig<ObjectType.Value, mixed>>(
      Array.from(type.fields).map<[string, GraphQLFieldConfig<ObjectType.Value, mixed>]>(([fieldName, field]) =>
        [formatName.field(fieldName), {
          description: field.description,
          type: getGqlType(buildToken, field.type, false),
          resolve: object => object.get(fieldName),
        }],
      ),
      // Add extra fields that may exist in our hooks.
      buildToken._hooks && buildToken._hooks.objectTypeFieldEntries
        ? buildToken._hooks.objectTypeFieldEntries(type, buildToken)
        : [],
    ),
  })
}

/**
 * Creates an input object type.
 *
 * @private
 */
function createGqlInputObjectType <T>(buildToken: BuildToken, type: ObjectType): GraphQLInputObjectType<T> {
  return new GraphQLInputObjectType<T>({
    name: formatName.type(`${type.name}-input`),
    description: type.description,
    fields: () => buildObject<GraphQLInputFieldConfig<mixed>>(
      Array.from(type.fields).map<[string, GraphQLInputFieldConfig<mixed>]>(([fieldName, field]) => {
        let gqlType = getGqlType(buildToken, field.type, true)

        // If the field has a default and the type we got was non-null, let’s
        // get the nullable version.
        if (field.hasDefault && gqlType instanceof GraphQLNonNull)
          gqlType = gqlType.ofType

        return [formatName.field(fieldName), {
          description: field.description,
          type: gqlType,
          [$$gqlInputObjectTypeValueKeyName]: fieldName,
        }]
      }),
    ),
  })
}

/**
 * “Clones” a GraphQL type and assigns a new name/description. Effectively
 * aliasing the type. If the type we are cloning is *not* a named type
 * (e.g. `GraphQLNonNull` and `GraphQLList`) we rename the named type “inside”
 * the unnamed type.
 *
 * @private
 */
export function _createGqlTypeAlias (gqlType: GraphQLType<mixed>, name: string, description: string | undefined): GraphQLType<mixed> {
  if (gqlType instanceof GraphQLNonNull)
    return new GraphQLNonNull(_createGqlTypeAlias(gqlType.ofType, name, description))

  if (gqlType instanceof GraphQLList)
    return new GraphQLList(_createGqlTypeAlias(gqlType.ofType, name, description))

  // Use prototypes to inherit all of the methods from the type we are
  // aliasing, then set the `name` and `description` properties to the aliased
  // properties.
  return Object.assign(Object.create(gqlType), { name, description })
}
