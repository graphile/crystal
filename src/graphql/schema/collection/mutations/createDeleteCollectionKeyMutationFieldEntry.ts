import { GraphQLFieldConfig } from 'graphql'
import { CollectionKey, ObjectType } from '../../../../interface'
import { formatName } from '../../../utils'
import BuildToken from '../../BuildToken'
import createMutationGQLField from '../../createMutationGQLField'
import createCollectionKeyInputHelpers from '../createCollectionKeyInputHelpers'
import { getDeleteCollectionPayloadGQLType } from './createDeleteCollectionMutationFieldEntry'

/**
 * Creates a delete mutation which will delete a single value from a collection
 * using a given collection key.
 */
// TODO: test
export default function createDeleteCollectionKeyMutationFieldEntry <TKey>(
  buildToken: BuildToken,
  collectionKey: CollectionKey<TKey>,
): [string, GraphQLFieldConfig<mixed, mixed>] | undefined {
  // If we can’t delete from the collection key, quit early.
  if (!collectionKey.delete)
    return

  const { collection } = collectionKey
  const name = `delete-${collection.type.name}-by-${collectionKey.name}`
  const inputHelpers = createCollectionKeyInputHelpers(buildToken, collectionKey)

  return [formatName.field(name), createMutationGQLField<ObjectType.Value>(buildToken, {
    name,
    description: `Deletes a single \`${formatName.type(collection.type.name)}\` using a unique key.`,
    inputFields: inputHelpers.fieldEntries,
    payloadType: getDeleteCollectionPayloadGQLType(buildToken, collection),
    execute: (context, input) =>
      collectionKey.delete!(context, inputHelpers.getKey(input)),
  })]
}
