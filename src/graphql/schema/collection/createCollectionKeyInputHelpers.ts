import { GraphQLInputFieldConfig, GraphQLNonNull, getNullableType } from 'graphql'
import { CollectionKey, ObjectType } from '../../../interface'
import { formatName, scrib } from '../../utils'
import BuildToken from '../BuildToken'
import getGqlType from '../getGqlType'
import transformGqlInputValue from '../transformGqlInputValue'

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
export default function createCollectionKeyInputHelpers <T>(
  buildToken: BuildToken,
  collectionKey: CollectionKey<T>,
): {
  fieldEntries: Array<[string, GraphQLInputFieldConfig<mixed>]>
  getKey: (input: { [key: string]: mixed }) => T,
} {
  const { keyType } = collectionKey

  // If this is an object type, we want to flatten out the object’s fields into
  // field entries. This provides a nicer experience as it eliminates one level
  // of nesting.
  if (keyType instanceof ObjectType) {
    // Create the definition of our fields. We will use this definition
    // to correctly assemble the input later.
    const fieldEntries =
      Array.from(keyType.fields).map<[string, GraphQLInputFieldConfig<mixed> & { internalName: string }]>(([fieldName, field]) =>
        [formatName.arg(fieldName), {
          description: field.description,
          type: new GraphQLNonNull(getNullableType(getGqlType(buildToken, field.type, true))),
          // We add an `internalName` so that we can use that name to
          // reconstruct the correct object value.
          internalName: fieldName,
        }],
      )

    return {
      fieldEntries,
      getKey: input => {
        const key = new Map(fieldEntries.map<[string, mixed]>(([fieldName, field]) => [
          field.internalName,
          transformGqlInputValue(field.type, input[fieldName] as mixed),
        ]))

        if (!keyType.isTypeOf(key))
          throw new Error('The object key input is not of the correct type.')

        return key
      },
    }
  }
  // Otherwise, we just put the type into a single field entry. Pretty boring.
  else {
    const fieldName = formatName.arg(collectionKey.name)
    const fieldType = getGqlType(buildToken, keyType, true)

    return {
      fieldEntries: [
        [fieldName, {
          description: `The ${scrib.type(fieldType)} to use when reading a single value.`,
          type: new GraphQLNonNull(getNullableType(fieldType)),
        }],
      ],
      getKey: input => {
        const key = transformGqlInputValue(fieldType, input[fieldName])

        if (!keyType.isTypeOf(key))
          throw new Error('The key input is not of the correct type.')

        return key
      },
    }
  }
}
