import { GraphQLNonNull, GraphQLFieldConfig } from 'graphql'
import { CollectionKey, ObjectType } from '../../../../interface'
import { formatName, idSerde } from '../../../utils'
import BuildToken from '../../BuildToken'
import createMutationField from '../../createMutationField'
import transformInputValue from '../../transformInputValue'
import getCollectionType from '../getCollectionType'
import createCollectionKeyInputHelpers from '../createCollectionKeyInputHelpers'
import { getCollectionPatchType, createUpdateCollectionOutputFieldEntries } from './createUpdateCollectionMutationFieldEntry'

/**
 * Creates a delete mutation which will delete a single value from a collection
 * using a given collection key.
 */
// TODO: test
export default function createUpdateCollectionKeyMutationFieldEntry <TKey>(
  buildToken: BuildToken,
  collectionKey: CollectionKey<TKey>,
): [string, GraphQLFieldConfig<mixed, mixed>] | undefined {
  // If we can’t delete from the collection key, quit early.
  if (!collectionKey.update)
    return

  const { collection } = collectionKey
  const name = `update-${collection.type.name}-by-${collectionKey.name}`
  const inputHelpers = createCollectionKeyInputHelpers(buildToken, collectionKey)
  const patchFieldName = formatName.field(`${collection.type.name}-patch`)
  const patchType = getCollectionPatchType(buildToken, collection)

  return [formatName.field(name), createMutationField<ObjectType.Value>(buildToken, {
    name,
    inputFields: [
      // Include all of the fields we need to construct the key value we will
      //use to find the single value to update.
      ...inputHelpers.fieldEntries,
      // Also include the patch object type. This is its own object type so
      // that people can just have a single patch object and not need to rename
      // keys. This also means users can freely upload entire objects to this
      // field.
      [patchFieldName, {
        // TODO: description
        type: new GraphQLNonNull(patchType),
      }],
    ],
    outputFields: createUpdateCollectionOutputFieldEntries(buildToken, collection),
    execute: (context, input) => {
      // Get the patch from our input.
      const patch = transformInputValue(patchType, input[patchFieldName])
      return collectionKey.update!(context, inputHelpers.getKey(input), patch as any)
    },
  })]
}
