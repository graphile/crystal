import {
  GraphQLType,
  GraphQLOutputType,
  GraphQLInputType,
  GraphQLNullableType,
  GraphQLNamedType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLEnumType,
  GraphQLEnumValueConfig,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLFieldConfig,
  GraphQLInputObjectType,
  GraphQLInputFieldConfig,
  isOutputType,
  isInputType,
  getNullableType,
  getNamedType,
} from 'graphql'

import {
  Type,
  ListType,
  NullableType,
  NamedType,
  AliasType,
  EnumType,
  booleanType,
  integerType,
  floatType,
  stringType,
  ObjectType,
} from '../../catalog'

import memoize from '../utils/memoize'
import buildObject from '../utils/buildObject'
import * as formatName from '../utils/formatName'

/**
 * Creates GraphQL types. Both of the input and output variety.
 */
class TypeForge {
  private _outputTypes = new WeakMap<Type<any>, GraphQLOutputType<any>>()
  private _inputTypes = new WeakMap<Type<any>, GraphQLInputType<any>>()

  /**
   * Gets a GraphQL output type from any catalog type. This method is memoized.
   */
  public getOutputType (type: Type<any>): GraphQLOutputType<any> {
    if (!this._outputTypes.has(type)) {
      const outputType = this._createType(false, type) as GraphQLOutputType<any>

      // If the created output type is also an input type, also set it to the
      // input types memoization map.
      if (isInputType(outputType))
        this._inputTypes.set(type, outputType)

      this._outputTypes.set(type, outputType)
    }

    return this._outputTypes.get(type)!
  }

  /**
   * Gets a GraphQL input type from any catalog type. This method is memoized.
   */
  public getInputType (type: Type<any>): GraphQLInputType<any> {
    if (!this._inputTypes.has(type)) {
      const inputType = this._createType(true, type) as GraphQLInputType<any>

      // If the created input type is also an output type, also set it to the
      // output types memoization map.
      if (isOutputType(inputType))
        this._outputTypes.set(type, inputType)

      this._inputTypes.set(type, inputType)
    }

    return this._inputTypes.get(type)!
  }

  /**
   * Gets a type using the memoized `TypeForge#getOutputType` and
   * `TypeForge#getInputType` methods. Technically this method isn’t memoized,
   * however the methods behaves as if it were memoized.
   *
   * Purely a convenience method that matches the internal `_createType` call
   * style.
   *
   * @private
   */
  private _getType (input: boolean, type: Type<any>): GraphQLType<any> {
    if (input) return this.getInputType(type)
    else return this.getOutputType(type)
  }

  /**
   * Creates a type. This method mainly wraps `TypeForge#_createNamedType`
   * and additionally inverts the nullability of types.
   *
   * @private
   */
  private _createType (input: boolean, type: Type<any>): GraphQLType<any> {
    // We want to ignore the nullability rules for `AliasType`. If the type we
    // are aliasing is nullable or non null then `AliasType` will automatically
    // pick that up.
    if (type instanceof AliasType) {
      return createGraphQLTypeAlias(
        this._getType(input, type.getBaseType()),
        formatName.type(type.getName()),
        type.getDescription(),
      )
    }

    if (type instanceof NullableType)
      return getNullableType(this._getType(input, type.getBaseType()))

    return new GraphQLNonNull(this._createNullableType(input, type))
  }

  /**
   * Creates a nullable type. This method handles all other supported unnamed
   * types and then calls `TypeForge#_createNamedType` to create any named
   * types.
   *
   * @private
   */
  private _createNullableType (input: boolean, type: Type<any>): GraphQLNullableType<any> {
    if (type instanceof ListType)
      return new GraphQLList(this._getType(input, type.getItemType()))

    if (!(type instanceof NamedType)) {
      throw new Error(
        `Cannot convert unnamed type of constructor '${type.constructor.name}' ` +
        'to a GraphQL type.'
      )
    }

    return this._createNamedType(input, type)
  }

  /**
   * Creates a named type.
   *
   * @private
   */
  private _createNamedType (input: boolean, type: NamedType<any>): GraphQLNamedType<any> {
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
      return input ? this._createInputObjectType(type) : this._createOutputObjectType(type)

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
  private _createOutputObjectType <T>(type: ObjectType<T>): GraphQLObjectType<T> {
    return new GraphQLObjectType<T>({
      name: formatName.type(type.getName()),
      description: type.getDescription(),
      fields: buildObject<GraphQLFieldConfig<T, any>>(
        type.getFields().map<[string, GraphQLFieldConfig<T, any>]>(field =>
          [formatName.field(field.getName()), {
            description: field.getDescription(),
            type: this.getOutputType(field.getType()),
            resolve: object => field.getFieldValueFromObject(object),
          }]
        )
      ),
    })
  }

  /**
   * Creates an input object type.
   *
   * @private
   */
  private _createInputObjectType <T>(type: ObjectType<T>): GraphQLInputObjectType<T> {
    return new GraphQLInputObjectType<T>({
      name: formatName.type(`${type.getName()}-input`),
      description: type.getDescription(),
      fields: buildObject<GraphQLInputFieldConfig<any>>(
        type.getFields().map<[string, GraphQLInputFieldConfig<any>]>(field =>
          [formatName.field(field.getName()), {
            description: field.getDescription(),
            type: this.getInputType(field.getType()),
          }]
        )
      ),
    })
  }
}

export default TypeForge

/**
 * “Clones” a GraphQL type and assigns a new name/description. Effectively
 * aliasing the type. If the type we are cloning is *not* a named type
 * (e.g. `GraphQLNonNull` and `GraphQLList`) we rename the named type “inside”
 * the unnamed type.
 *
 * @private
 */
function createGraphQLTypeAlias (
  gqlType: GraphQLType<any>,
  name: string,
  description: string | undefined,
): GraphQLType<any> {
  if (gqlType instanceof GraphQLNonNull)
    return new GraphQLNonNull(createGraphQLTypeAlias(gqlType.ofType, name, description))

  if (gqlType instanceof GraphQLList)
    return new GraphQLList(createGraphQLTypeAlias(gqlType.ofType, name, description))

  // Use prototypes to inherit all of the methods from the type we are
  // aliasing, then set the `name` and `description` properties to the aliased
  // properties.
  return Object.assign(Object.create(gqlType), { name, description })
}
