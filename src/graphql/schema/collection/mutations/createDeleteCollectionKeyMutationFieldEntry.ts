import { GraphQLFieldConfig } from 'graphql'
import { CollectionKey } from '../../../../interface'
import BuildToken from '../../BuildToken'
import createMutationGqlField from '../../createMutationGqlField'
import createCollectionKeyInputHelpers from '../createCollectionKeyInputHelpers'
import { getDeleteCollectionPayloadGqlType } from './createDeleteCollectionMutationFieldEntry'

/**
 * Creates a delete mutation which will delete a single value from a collection
 * using a given collection key.
 */
// TODO: test
export default function createDeleteCollectionKeyMutationFieldEntry <TValue, TKey>(
  buildToken: BuildToken,
  collectionKey: CollectionKey<TValue, TKey>,
): [string, GraphQLFieldConfig<mixed, mixed>] | undefined {
  // If we can’t delete from the collection key, quit early.
  if (!collectionKey.delete)
    return

  const { collection } = collectionKey
  const formatName = buildToken.options.formatName
  const name = formatName.deleteByKeyMethod(collection.type.name, collectionKey.name)
  const inputHelpers = createCollectionKeyInputHelpers(buildToken, collectionKey)

  return [name, createMutationGqlField<TValue>(buildToken, {
    name,
    description: `Deletes a single \`${formatName.type(collection.type.name)}\` using a unique key.`,
    inputFields: inputHelpers.fieldEntries,
    payloadType: getDeleteCollectionPayloadGqlType(buildToken, collection),
    execute: (context, input) =>
      collectionKey.delete!(context, inputHelpers.getKeyFromInput(input)),
  })]
}
