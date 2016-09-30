import { GraphQLInputFieldConfig } from 'graphql'
import { CollectionKey, ObjectType } from '../../../interface'
import { buildObject, formatName } from '../../utils'
import BuildToken from '../BuildToken'
import getType from '../getType'
import transformInputValue from '../transformInputValue'

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
export default function createCollectionKeyInput <T>(
  buildToken: BuildToken,
  collectionKey: CollectionKey<T>,
): {
  fieldEntries: Array<[string, GraphQLInputFieldConfig<mixed>]>
  getValue: (input: { [key: string]: mixed }) => T
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
          type: getType(buildToken, field.type, true),
          // We add an `internalName` so that we can use that name to
          // reconstruct the correct object value.
          internalName: fieldName,
        }]
      )

    return {
      fieldEntries,
      getValue: input => {
        const key = new Map(fieldEntries.map<[string, mixed]>(([fieldName, field]) => [
          field.internalName,
          transformInputValue(field.type, input[fieldName] as mixed),
        ])) as any

        if (!keyType.isTypeOf(key))
          throw new Error('The object key input is not of the correct type.')

        return key
      },
    }
  }
  // Otherwise, we just put the type into a single field entry. Pretty boring.
  else {
    const fieldName = formatName.arg(collectionKey.name)
    const fieldType = getType(buildToken, keyType, true)

    return {
      fieldEntries: [
        [fieldName, {
          // TODO: description
          type: fieldType,
        }],
      ],
      getValue: input => {
        const key = transformInputValue(fieldType, input[fieldName]) as any

        if (!keyType.isTypeOf(key))
          throw new Error('The key input is not of the correct type.')

        return key
      },
    }
  }
}
