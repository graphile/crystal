import { GraphQLFieldConfig } from 'graphql'
import { Collection } from '../../../interface'
import BuildToken from '../BuildToken'
import createCollectionCreateMutationFieldEntry from './mutations/createCreateCollectionMutationFieldEntry'

/**
 * Creates all of the mutation fields available for a given collection. This
 * includes the basic stuff: create, update, and delete. In the future
 * mutations like upsert may be added.
 */
export default function createCollectionMutationFieldEntries (
  buildToken: BuildToken,
  collection: Collection,
): Array<[string, GraphQLFieldConfig<mixed, mixed>]> {
  // Create an array of entries that may be undefined. We will filter out the
  // undefined ones at the end.
  const optionalEntries: Array<[string, GraphQLFieldConfig<mixed, mixed>] | undefined> = [
    createCollectionCreateMutationFieldEntry(buildToken, collection)
  ]

  return optionalEntries.filter(Boolean) as Array<[string, GraphQLFieldConfig<mixed, mixed>]>
}
