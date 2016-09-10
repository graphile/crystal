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
  Catalog,
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
} from '../../../catalog'

import { buildObject, formatName } from '../../utils'
import getCollectionType from '../collection/getCollectionType'
import Context from '../Context'

// TODO: doc
const cache = new WeakMap<Context, {
  inputCache: WeakMap<Type<mixed>, GraphQLInputType<mixed>>,
  outputCache: WeakMap<Type<mixed>, GraphQLOutputType<mixed>>,
}>()

// TODO: doc
// Instead of using our utility memoization function, we implement our own
// memoization logic here because in some scenarios we want to return the same
// result regardless of whether the `input` is true or false.
function getType (context: Context, type: Type<mixed>, input: true): GraphQLInputType<mixed>
function getType (context: Context, type: Type<mixed>, input: false): GraphQLOutputType<mixed>
function getType (context: Context, type: Type<mixed>, input: boolean): GraphQLType<mixed> {
  if (!cache.get(context))
    cache.set(context, { inputCache: new WeakMap(), outputCache: new WeakMap() })

  const { inputCache, outputCache } = cache.get(context)!

  if (input === true && !inputCache.has(type)) {
    const gqlType = createType(context, type, true)
    if (isInputType(gqlType)) inputCache.set(type, gqlType)
    if (isOutputType(gqlType)) outputCache.set(type, gqlType)
  }

  if (input === false && !outputCache.has(type)) {
    const gqlType = createType(context, type, false)
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
function createType (context: Context, type: Type<mixed>, input: boolean): GraphQLType<mixed> {
  // We want to ignore the nullability rules for `AliasType`. If the type we
  // are aliasing is nullable or non null then `AliasType` will automatically
  // pick that up.
  if (type instanceof AliasType) {
    return createGraphQLTypeAlias(
      // TODO: Remove the `input as any` when the Typescript bug is fixed.
      getType(context, type.getBaseType(), input as any),
      formatName.type(type.getName()),
      type.getDescription(),
    )
  }

  if (type instanceof NullableType)
    // TODO: Remove the `input as any` when the Typescript bug is fixed.
    return getNullableType(getType(context, type.getBaseType(), input as any))

  return new GraphQLNonNull(createNullableType(context, type, input))
}

/**
 * Creates a nullable type. This method handles all other supported unnamed
 * types and then calls `createNamedType` to create any named
 * types.
 *
 * @private
 */
function createNullableType (context: Context, type: Type<mixed>, input: boolean): GraphQLNullableType<mixed> {
  if (type instanceof ListType)
    // TODO: Remove the `input as any` when the Typescript bug is fixed.
    return new GraphQLList(getType(context, type.getItemType(), input as any))

  if (!(type instanceof NamedType)) {
    throw new Error(
      `Cannot convert unnamed type of constructor '${type.constructor.name}' ` +
      'to a GraphQL type.'
    )
  }

  return createNamedType(context, type, input)
}

/**
 * Creates a named type.
 *
 * @private
 */
function createNamedType (context: Context, type: NamedType<mixed>, input: boolean): GraphQLNamedType<mixed> {
  if (type instanceof EnumType) {
    return new GraphQLEnumType({
      name: formatName.type(type.getName()),
      description: type.getDescription(),
      values: buildObject(
        type.getVariants().map<[string, GraphQLEnumValueConfig<string>]>(variant =>
          [formatName.enumValue(variant), {
            value: variant,
          }]
        ),
      ),
    })
  }

  if (type instanceof ObjectType)
    return input ? createInputObjectType(context, type) : createOutputObjectType(context, type)

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
function createOutputObjectType <T>(context: Context, type: ObjectType<T>): GraphQLObjectType<T> {
  const { catalog } = context
  const collection = catalog.getCollections().find(collection => collection.getType() === type)

  // If there is a collection which uses this type, we should use the
  // collection’s type and not create our own.
  if (collection)
    return getCollectionType(context, collection)

  return new GraphQLObjectType<T>({
    name: formatName.type(type.getName()),
    description: type.getDescription(),
    fields: () => buildObject<GraphQLFieldConfig<T, mixed>>(
      type.getFields().map<[string, GraphQLFieldConfig<T, mixed>]>(field =>
        [formatName.field(field.getName()), {
          description: field.getDescription(),
          type: getType(context, field.getType(), false),
          resolve: object => field.getFieldValueFromObject(object),
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
function createInputObjectType <T>(context: Context, type: ObjectType<T>): GraphQLInputObjectType<T> {
  return new GraphQLInputObjectType<T>({
    name: formatName.type(`${type.getName()}-input`),
    description: type.getDescription(),
    fields: () => buildObject<GraphQLInputFieldConfig<mixed>>(
      type.getFields().map<[string, GraphQLInputFieldConfig<mixed>]>(field =>
        [formatName.field(field.getName()), {
          description: field.getDescription(),
          type: getType(context, field.getType(), true),
        }]
      )
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
