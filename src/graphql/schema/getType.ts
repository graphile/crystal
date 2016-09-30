import {
  GraphQLType,
  GraphQLInputType,
  GraphQLOutputType,
  GraphQLNullableType,
  GraphQLNamedType,
  GraphQLNonNull,
  GraphQLList,
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
} from 'graphql'

import {
  Type,
  NullableType,
  ListType,
  NamedType,
  isNamedType,
  AliasType,
  EnumType,
  ObjectType,
  booleanType,
  integerType,
  floatType,
  stringType,
} from '../../interface'

import { buildObject, formatName } from '../utils'
import getCollectionType from './collection/getCollectionType'
import { $$inputValueKeyName } from './transformInputValue'
import BuildToken from './BuildToken'

// TODO: doc
const cache = new WeakMap<BuildToken, {
  inputCache: WeakMap<Type<mixed>, GraphQLInputType<mixed>>,
  outputCache: WeakMap<Type<mixed>, GraphQLOutputType<mixed>>,
}>()

// TODO: doc
// TODO: Maybe this should have a different name?
// Instead of using our utility memoization function, we implement our own
// memoization logic here because in some scenarios we want to return the same
// result regardless of whether the `input` is true or false.
function getType (buildToken: BuildToken, type: Type<mixed>, input: true): GraphQLInputType<mixed>
function getType (buildToken: BuildToken, type: Type<mixed>, input: false): GraphQLOutputType<mixed>
function getType (buildToken: BuildToken, type: Type<mixed>, input: boolean): GraphQLType<mixed> {
  if (!cache.get(buildToken))
    cache.set(buildToken, { inputCache: new WeakMap(), outputCache: new WeakMap() })

  const { inputCache, outputCache } = cache.get(buildToken)!

  if (input === true && !inputCache.has(type)) {
    const gqlType = createType(buildToken, type, true)
    if (isInputType(gqlType)) inputCache.set(type, gqlType)
    if (isOutputType(gqlType)) outputCache.set(type, gqlType)
  }

  if (input === false && !outputCache.has(type)) {
    const gqlType = createType(buildToken, type, false)
    if (isInputType(gqlType)) inputCache.set(type, gqlType)
    if (isOutputType(gqlType)) outputCache.set(type, gqlType)
  }

  return input ? inputCache.get(type)! : outputCache.get(type)!
}

export default getType

/**
 * Creates a type. This method mainly wraps `createNullableType`
 * and additionally inverts the nullability of types.
 *
 * @private
 */
function createType (buildToken: BuildToken, type: Type<mixed>, input: boolean): GraphQLType<mixed> {
  // We want to ignore the nullability rules for `AliasType`. If the type we
  // are aliasing is nullable or non null then `AliasType` will automatically
  // pick that up.
  if (type instanceof AliasType) {
    return createGraphQLTypeAlias(
      // TODO: Remove the `input as any` when the Typescript bug is fixed.
      getType(buildToken, type.baseType, input as any),
      formatName.type(type.name),
      type.description,
    )
  }

  if (type instanceof NullableType)
    // TODO: Remove the `input as any` when the Typescript bug is fixed.
    return getNullableType(getType(buildToken, type.nonNullType, input as any))

  return new GraphQLNonNull(createNullableType(buildToken, type, input))
}

/**
 * Creates a nullable type. This method handles all other supported unnamed
 * types and then calls `createNamedType` to create any named
 * types.
 *
 * @private
 */
function createNullableType (buildToken: BuildToken, type: Type<mixed>, input: boolean): GraphQLNullableType<mixed> {
  if (type instanceof ListType)
    // TODO: Remove the `input as any` when the Typescript bug is fixed.
    return new GraphQLList(getType(buildToken, type.itemType, input as any))

  if (!isNamedType(type)) {
    throw new Error(
      `Cannot convert unnamed type of constructor '${type.constructor.name}' ` +
      'to a GraphQL type.'
    )
  }

  return createNamedType(buildToken, type, input)
}

/**
 * Creates a named type.
 *
 * @private
 */
function createNamedType (buildToken: BuildToken, type: NamedType<mixed>, input: boolean): GraphQLNamedType<mixed> {
  if (type instanceof EnumType) {
    return new GraphQLEnumType({
      name: formatName.type(type.name),
      description: type.description,
      values: buildObject(
        Array.from(type.variants).map<[string, GraphQLEnumValueConfig<string>]>(variant =>
          [formatName.enumValue(variant), {
            value: variant,
          }]
        ),
      ),
    })
  }

  if (type instanceof ObjectType)
    return input ? createInputObjectType(buildToken, type) : createOutputObjectType(buildToken, type)

  // The primitive types are constants, so let’s just return their constant
  // GraphQL type.
  switch (type) {
    case booleanType: return GraphQLBoolean
    case integerType: return GraphQLInt
    case floatType: return GraphQLFloat
    case stringType: return GraphQLString
  }

  throw new Error(
    `Cannot convert named type of constructor '${type.constructor.name}' ` +
    'to a GraphQL type.'
  )
}

/**
 * Creates a basic output object type with none of the trimmings that a
 * collection object type may have.
 *
 * @private
 */
function createOutputObjectType (buildToken: BuildToken, type: ObjectType): GraphQLObjectType<mixed> {
  const { inventory } = buildToken
  const collection = inventory.getCollections().find(collection => collection.type === type)

  // If there is a collection which uses this type, we should use the
  // collection’s type and not create our own.
  if (collection)
    return getCollectionType(buildToken, collection)

  return new GraphQLObjectType<ObjectType.Value>({
    name: formatName.type(type.name),
    description: type.description,
    fields: () => buildObject<GraphQLFieldConfig<ObjectType.Value, mixed>>(
      Array.from(type.fields).map<[string, GraphQLFieldConfig<ObjectType.Value, mixed>]>(([fieldName, field]) =>
        [formatName.field(fieldName), {
          description: field.description,
          type: getType(buildToken, field.type, false),
          resolve: object => object.get(fieldName),
        }]
      ),
    ),
  })
}

/**
 * Creates an input object type.
 *
 * @private
 */
function createInputObjectType <T>(buildToken: BuildToken, type: ObjectType): GraphQLInputObjectType<T> {
  return new GraphQLInputObjectType<T>({
    name: formatName.type(`${type.name}-input`),
    description: type.description,
    fields: () => buildObject<GraphQLInputFieldConfig<mixed>>(
      Array.from(type.fields).map<[string, GraphQLInputFieldConfig<mixed>]>(([fieldName, field]) => {
        let type = getType(buildToken, field.type, true)

        // If the field has a default and the type we got was non-null, let’s
        // get the nullable version.
        if (field.hasDefault && type instanceof GraphQLNonNull)
          type = type.ofType

        return [formatName.field(fieldName), {
          description: field.description,
          type,
          [$$inputValueKeyName]: fieldName,
        }]
      })
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
function createGraphQLTypeAlias (gqlType: GraphQLType<any>, name: string, description: string | undefined): GraphQLType<any> {
  if (gqlType instanceof GraphQLNonNull)
    return new GraphQLNonNull(createGraphQLTypeAlias(gqlType.ofType, name, description))

  if (gqlType instanceof GraphQLList)
    return new GraphQLList(createGraphQLTypeAlias(gqlType.ofType, name, description))

  // Use prototypes to inherit all of the methods from the type we are
  // aliasing, then set the `name` and `description` properties to the aliased
  // properties.
  return Object.assign(Object.create(gqlType), { name, description })
}
