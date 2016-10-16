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
type GetArditeGqlInputReturn<TValue> = {
  gqlType: GraphQLInputType,
  fromGqlInput: (gqlInput: mixed) => TValue,
}

/**
 * The non-memoized version of `getGqlInputType`.
 *
 * @private
 */
const createArditeGqlInput = <TValue>(buildToken: BuildToken, _type: Type<TValue>): GetArditeGqlInputReturn<TValue> =>
  // Switch on our type argument. Depending on the kind of our type, different
  // cases will run.
  switchType<GetArditeGqlInputReturn<TValue>>(_type, {
    // If the kind of this type is a nullable type, we want to return the
    // nullable version of the internal non null type. When converting GraphQL
    // input, if the input value is null, we will return null. Otherwise we
    // will delegate to our non-null type’s `fromGqlInput`.
    nullable: <TNullValue, TNonNullValue>(type: NullableType<TNullValue, TNonNullValue>): GetArditeGqlInputReturn<TNullValue | TNonNullValue> => {
      const { gqlType: nonNullGqlType, fromGqlInput: fromNonNullGqlInput } = getArditeGqlInput(buildToken, type.nonNullType)
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
    list: <TItemValue>(type: ListType<TValue, TItemValue>): GetArditeGqlInputReturn<TValue> => {
      const { gqlType: itemGqlType, fromGqlInput: fromItemGqlInput } = getArditeGqlInput(buildToken, type.itemType)
      return {
        gqlType: new GraphQLNonNull(new GraphQLList(itemGqlType)),
        fromGqlInput: gqlInput =>
          Array.isArray(gqlInput)
            ? type.fromArray(gqlInput.map(gqlInputItem => fromItemGqlInput(gqlInputItem)))
            : (() => { throw new Error('Input value must be an array.') })(),
      }
    },

    // TODO: doc
    alias: (type: AliasType<TValue>): GetArditeGqlInputReturn<TValue> => {
      const { gqlType: baseGqlType, fromGqlInput } = getArditeGqlInput(buildToken, type.baseType)
      return {
        gqlType: aliasGqlType(baseGqlType, formatName.type(type.name), type.description),
        fromGqlInput,
      }
    },

    // TODO: doc
    enum: (type: EnumType<TValue>): GetArditeGqlInputReturn<TValue> => ({
      gqlType: new GraphQLNonNull(new GraphQLEnumType({
        name: formatName.type(type.name),
        description: type.description,
        values: buildObject(Array.from(type.variants).map(([key, value]) => ({ key, value: { value } }))),
      })),
      fromGqlInput: gqlInput =>
        type.isTypeOf(gqlInput)
          ? gqlInput
          : (() => { throw new Error('Input value must be an enum variant.') })(),
    }),

    // TODO: doc
    object: (type: ObjectType<TValue>): GetArditeGqlInputReturn<TValue> => {
      const fieldFixtures = Array.from(type.fields).map(([fieldName, field]) => {
        const { gqlType, fromGqlInput } = getArditeGqlInput(buildToken, field.type)
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
const _getArditeGqlInput = memoize2(createArditeGqlInput)

/**
 * Takes a build token and an interface type and gets some values that are
 * necessary for creating and interpreting input from GraphQL. The two values
 * created by this function are a GraphQL input type and a function that will
 * convert the value resultant from that input type into a proper value to be
 * used by our interface.
 */
export default function getArditeGqlInput <TValue>(buildToken: BuildToken, type: Type<TValue>): GetArditeGqlInputReturn<TValue> {
  return _getArditeGqlInput(buildToken, type) as GetArditeGqlInputReturn<TValue>
}
