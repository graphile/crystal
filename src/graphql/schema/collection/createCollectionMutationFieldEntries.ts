import { GraphQLFieldConfig } from 'graphql'
import { Collection } from '../../../interface'
import BuildToken from '../BuildToken'
import createCreateCollectionMutationFieldEntry from './mutations/createCreateCollectionMutationFieldEntry'
import createUpdateCollectionMutationFieldEntry from './mutations/createUpdateCollectionMutationFieldEntry'
import createUpdateCollectionKeyMutationFieldEntry from './mutations/createUpdateCollectionKeyMutationFieldEntry'
import createDeleteCollectionMutationFieldEntry from './mutations/createDeleteCollectionMutationFieldEntry'
import createDeleteCollectionKeyMutationFieldEntry from './mutations/createDeleteCollectionKeyMutationFieldEntry'

/**
 * Creates all of the mutation fields available for a given collection. This
 * includes the basic stuff: create, update, and delete. In the future
 * mutations like upsert may be added.
 */
export default function createCollectionMutationFieldEntries <TValue>(
  buildToken: BuildToken,
  collection: Collection<TValue>,
): Array<[string, GraphQLFieldConfig<never, mixed>]> {
  // Create an array of entries that may be undefined. We will filter out the
  // undefined ones at the end.
  const optionalEntries: Array<[string, GraphQLFieldConfig<never, mixed>] | undefined> = [
    // Add the create collection mutation.
    createCreateCollectionMutationFieldEntry(buildToken, collection),
    // Add the update collection mutation. Uses the collection’s primary key.
    createUpdateCollectionMutationFieldEntry(buildToken, collection),
    // Add the update mutation for all of the collection keys.
    ...collection.keys.map(collectionKey => createUpdateCollectionKeyMutationFieldEntry(buildToken, collectionKey)),
    // Add the delete collection mutation. Uses the collection’s primary key.
    createDeleteCollectionMutationFieldEntry(buildToken, collection),
    // Add the delete mutation for all of the collection keys.
    ...collection.keys.map(collectionKey => createDeleteCollectionKeyMutationFieldEntry(buildToken, collectionKey)),
  ]

  return optionalEntries.filter(Boolean) as Array<[string, GraphQLFieldConfig<never, mixed>]>
}
