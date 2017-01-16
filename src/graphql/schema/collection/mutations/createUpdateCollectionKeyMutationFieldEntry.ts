import { GraphQLNonNull, GraphQLFieldConfig } from 'graphql'
import { CollectionKey } from '../../../../interface'
import { formatName } from '../../../utils'
import BuildToken from '../../BuildToken'
import createMutationGqlField from '../../createMutationGqlField'
import createCollectionKeyInputHelpers from '../createCollectionKeyInputHelpers'
import { getCollectionPatchType, getUpdateCollectionPayloadGqlType } from './createUpdateCollectionMutationFieldEntry'

/**
 * Creates a update mutation which will update a single value from a collection
 * using a given collection key.
 */
// TODO: test
export default function createUpdateCollectionKeyMutationFieldEntry <TValue, TKey>(
  buildToken: BuildToken,
  collectionKey: CollectionKey<TValue, TKey>,
): [string, GraphQLFieldConfig<mixed, mixed>] | undefined {
  // If we can’t delete from the collection key, quit early.
  if (!collectionKey.update)
    return

  const { collection } = collectionKey
  const name = `update-${collection.type.name}-by-${collectionKey.name}`
  const inputHelpers = createCollectionKeyInputHelpers(buildToken, collectionKey)
  const patchFieldName = formatName.field(`${collection.type.name}-patch`)
  const { gqlType: patchGqlType, fromGqlInput: patchFromGqlInput } = getCollectionPatchType(buildToken, collection)

  return [formatName.field(name), createMutationGqlField<TValue>(buildToken, {
    name,
    description: `Updates a single \`${formatName.type(collection.type.name)}\` using a unique key and a patch.`,
    inputFields: [
      // Include all of the fields we need to construct the key value we will
      // use to find the single value to update.
      ...inputHelpers.fieldEntries,
      // Also include the patch object type. This is its own object type so
      // that people can just have a single patch object and not need to rename
      // keys. This also means users can freely upload entire objects to this
      // field.
      [patchFieldName, {
        description: `An object where the defined keys will be set on the \`${formatName.type(collection.type.name)}\` identified by our unique key.`,
        type: new GraphQLNonNull(patchGqlType),
      }],
    ],
    payloadType: getUpdateCollectionPayloadGqlType(buildToken, collection),
    execute: (context, input) =>
      collectionKey.update!(context, inputHelpers.getKeyFromInput(input), patchFromGqlInput(input[patchFieldName] as {})),
  })]
}
