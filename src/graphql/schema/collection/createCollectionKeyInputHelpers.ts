import { GraphQLInputFieldConfig, GraphQLNonNull, getNullableType } from 'graphql'
import { CollectionKey, Type, ObjectType, switchType } from '../../../interface'
import { formatName, scrib } from '../../utils'
import getGqlInputType from '../type/getGqlInputType'
import BuildToken from '../BuildToken'

type CollectionKeyInputHelpers<TKey> = {
  fieldEntries: Array<[string, GraphQLInputFieldConfig]>,
  getKeyFromInput: (input: { [key: string]: mixed }) => TKey,
}

/**
 * There are different ways to create the input for a collection key given the
 * collection key’s type. This is a helper function which will return the tools
 * necessary to create inputs for collection keys that feel right.
 *
 * For object keys we flatten out all of the object’s fields into individual
 * GraphQL fields.
 *
 * For everything else we just have a single field.
 */
// TODO: test
export default function createCollectionKeyInputHelpers <TValue, TKey>(
  buildToken: BuildToken,
  collectionKey: CollectionKey<TValue, TKey>,
): CollectionKeyInputHelpers<TKey> {
  return switchType<CollectionKeyInputHelpers<TKey>>(collectionKey.keyType, {
    // If this is an object type, we want to flatten out the object’s fields into
    // field entries. This provides a nicer experience as it eliminates one level
    // of nesting.
    object: <TKey>(keyType: ObjectType<TKey>): CollectionKeyInputHelpers<TKey> => {
      // Create the definition of our fields. We will use this definition
      // to correctly assemble the input later.
      const fields =
        Array.from(keyType.fields).map(([fieldName, field]) => {
          const { gqlType, fromGqlInput } = getGqlInputType(buildToken, field.type)
          return {
            key: formatName.arg(fieldName),
            value: {
              description: field.description,
              type: new GraphQLNonNull(getNullableType(gqlType)),
              // We add an `internalName` so that we can use that name to
              // reconstruct the correct object value.
              internalName: fieldName,
              // We also add this function so we can use it later on.
              fromGqlInput,
            },
          }
        })

      return {
        fieldEntries: fields.map<[string, GraphQLInputFieldConfig]>(({ key, value }) => [key, value]),
        getKeyFromInput: (input: { [key: string]: mixed }): TKey =>
          keyType.fromFields(new Map(fields.map<[string, mixed]>(({ key, value: { internalName, fromGqlInput } }) =>
            [internalName, fromGqlInput(input[key])]))),
      }
    },

    // Otherwise, we just put the type into a single field entry with the
    // default case. Pretty boring.
    nullable: defaultCase,
    list: defaultCase,
    alias: defaultCase,
    enum: defaultCase,
    scalar: defaultCase,
  })

  function defaultCase <TKey>(keyType: Type<TKey>): CollectionKeyInputHelpers<TKey> {
    const fieldName = formatName.arg(collectionKey.name)
    const { gqlType, fromGqlInput } = getGqlInputType(buildToken, keyType)

    return {
      fieldEntries: [
        [fieldName, {
          description: `The ${scrib.type(gqlType)} to use when reading a single value.`,
          type: new GraphQLNonNull(getNullableType(gqlType)),
        }],
      ],
      getKeyFromInput: fromGqlInput,
    }
  }
}
