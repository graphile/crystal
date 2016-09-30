import { GraphQLFieldConfig } from 'graphql'
import { CollectionKey, ObjectType } from '../../../../interface'
import { formatName } from '../../../utils'
import BuildToken from '../../BuildToken'
import createMutationField from '../../createMutationField'
import getCollectionType from '../getCollectionType'
import createCollectionKeyInputHelpers from '../createCollectionKeyInputHelpers'

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

  return [formatName.field(name), createMutationField<ObjectType.Value>(buildToken, {
    name,
    // Add the input fields from our input helpers.
    inputFields: inputHelpers.fieldEntries,
    outputFields: [
      // Add the deleted value as an output field so the user can see the
      // object they just deleted.
      [formatName.field(collection.type.name), {
        type: getCollectionType(buildToken, collection),
        resolve: value => value,
      }],
    ],
    execute: (context, input) =>
      collectionKey.delete!(context, inputHelpers.getValue(input)),
  })]
}
