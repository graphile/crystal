import {
  GraphQLInputType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLEnumType,
  GraphQLInputObjectType,
  getNullableType as getNullableGqlType,
} from 'graphql'

import {
  switchType,
  Type,
  NullableType,
  ListType,
  AliasType,
  EnumType,
  ObjectType,
} from '../../../interface'

import { buildObject, formatName, memoize2 } from '../../utils'
import BuildToken from '../BuildToken'
import aliasGqlType from './aliasGqlType'

/**
 * The values to be returned by `getGqlInputType`. A GraphQL input type, and a
 * function which will turn a GraphQL input value into a proper interface value
 * (as is specified by `TValue`).
 *
 * @private
 */
type GetGqlInputReturn<TValue> = {
  gqlType: GraphQLInputType,
  fromGqlInput: (gqlInput: mixed) => TValue,
}

/**
 * The non-memoized version of `getGqlInputType`.
 *
 * @private
 */
const createGqlInputType = <TValue>(buildToken: BuildToken, _type: Type<TValue>): GetGqlInputReturn<TValue> =>
  // Switch on our type argument. Depending on the kind of our type, different
  // cases will run.
  switchType<GetGqlInputReturn<TValue>>(_type, {
    // If the kind of this type is a nullable type, we want to return the
    // nullable version of the internal non null type. When converting GraphQL
    // input, if the input value is null, we will return null. Otherwise we
    // will delegate to our non-null type’s `fromGqlInput`.
    nullable: <TNullValue, TNonNullValue>(type: NullableType<TNullValue, TNonNullValue>): GetGqlInputReturn<TNullValue | TNonNullValue> => {
      const { gqlType: nonNullGqlType, fromGqlInput: fromNonNullGqlInput } = getGqlInputType(buildToken, type.nonNullType)
      return {
        gqlType: getNullableGqlType(nonNullGqlType),
        fromGqlInput: gqlInput =>
          gqlInput == null
            ? type.nullValue
            : fromNonNullGqlInput(gqlInput),
      }
    },

    // For our list type, the GraphQL input type will be a non-null list of the
    // item type. When transforming our GraphQL input we will map all of the
    // items in the input array as specified by our item type’s `fromGqlInput`.
    list: <TItemValue>(type: ListType<TValue, TItemValue>): GetGqlInputReturn<TValue> => {
      const { gqlType: itemGqlType, fromGqlInput: fromItemGqlInput } = getGqlInputType(buildToken, type.itemType)
      return {
        gqlType: new GraphQLNonNull(new GraphQLList(itemGqlType)),
        fromGqlInput: gqlInput =>
          Array.isArray(gqlInput)
            ? type.fromArray(gqlInput.map(gqlInputItem => fromItemGqlInput(gqlInputItem)))
            : (() => { throw new Error('Input value must be an array.') })(),
      }
    },

    // Alias GraphQL types will be created using our `aliasGqlType` helper, and
    // will not be made non-null as the created base GraphQL type should have
    // the correct nullability rules. In order to coerce input values into the
    // correct value, the base type’s `fromGqlInput` is used without
    // modification.
    alias: (type: AliasType<TValue>): GetGqlInputReturn<TValue> => {
      const { gqlType: baseGqlType, fromGqlInput } = getGqlInputType(buildToken, type.baseType)
      return {
        gqlType: aliasGqlType(baseGqlType, formatName.type(type.name), type.description),
        fromGqlInput,
      }
    },

    // Enum types will be turned into a non-null GraphQL enum type, the
    // variants of which will return the actual enum value requiring no extra
    // value coercion in `fromGqlInput` other than a type check.
    enum: (type: EnumType<TValue>): GetGqlInputReturn<TValue> => ({
      gqlType: new GraphQLNonNull(new GraphQLEnumType({
        name: formatName.type(type.name),
        description: type.description,
        values: buildObject(Array.from(type.variants).map(([key, value]) => ({
          key: formatName.enumValue(key),
          value: { value },
        }))),
      })),
      fromGqlInput: gqlInput =>
        type.isTypeOf(gqlInput)
          ? gqlInput
          : (() => { throw new Error('Input value must be an enum variant.') })(),
    }),

    // Objects will be turned into a non-null GraphQL input object type as
    // expected. The coercion step is different though in some important ways.
    // As fields will be renamed to use `camelCase`. So the coercion must
    // rename such fields back to their expected name in addition to coercing
    // the field values.
    object: (type: ObjectType<TValue>): GetGqlInputReturn<TValue> => {
      // An array of our fields and all the information on those fields we will
      // need to create the GraphQL type, and coerce the input value. There is
      // some common logic so we create this array once and share it.
      const fieldFixtures = Array.from(type.fields).map(([fieldName, field]) => {
        const { gqlType, fromGqlInput } = getGqlInputType(buildToken, field.type)
        return {
          fieldName,
          field,
          key: formatName.field(fieldName),
          gqlType,
          fromGqlInput,
        }
      })
      return {
        gqlType: new GraphQLNonNull(new GraphQLInputObjectType({
          name: formatName.type(`${type.name}-input`),
          description: type.description,
          fields: buildObject(fieldFixtures.map(({ key, field, gqlType }) => ({
            key,
            value: {
              description: field.description,
              type: gqlType,
            },
          }))),
        })),
        fromGqlInput: gqlInput =>
          gqlInput != null && typeof gqlInput === 'object'
            ? type.fromFields(new Map(fieldFixtures.map(({ fieldName, key, fromGqlInput }) => [fieldName, fromGqlInput(gqlInput[key])] as [string, mixed])))
            : (() => { throw new Error(`Input value must be an object, not '${typeof gqlInput}'.`) })(),
      }
    },
  })

// Because we use dependant types in the signature, we have to wrap our
// memoized function to get the right signature.
const _getGqlInputType = memoize2(createGqlInputType)

/**
 * Takes a build token and an interface type and gets some values that are
 * necessary for creating and interpreting input from GraphQL. The two values
 * created by this function are a GraphQL input type and a function that will
 * convert the value resultant from that input type into a proper value to be
 * used by our interface.
 */
// TODO: test
export default function getGqlInputType <TValue>(buildToken: BuildToken, type: Type<TValue>): GetGqlInputReturn<TValue> {
  return _getGqlInputType(buildToken, type) as GetGqlInputReturn<TValue>
}
