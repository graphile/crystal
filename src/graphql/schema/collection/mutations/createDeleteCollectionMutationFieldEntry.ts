import { GraphQLFieldConfig, GraphQLNonNull, GraphQLID } from 'graphql'
import { Collection, ObjectType } from '../../../../interface'
import { formatName, idSerde } from '../../../utils'
import BuildToken from '../../BuildToken'
import createMutationField from '../../createMutationField'
import getCollectionType from '../getCollectionType'

/**
 * Creates a delete mutation that uses the primary key of a collection and an
 * object’s global GraphQL identifier to delete a value in the collection.
 */
// TODO: test
export default function createDeleteCollectionMutationFieldEntry (
  buildToken: BuildToken,
  collection: Collection,
): [string, GraphQLFieldConfig<mixed, mixed>] | undefined {
  const { primaryKey } = collection

  // If there is no primary key, or the primary key has no delete method. End
  // early.
  if (!primaryKey || !primaryKey.delete)
    return

  const { options, inventory } = buildToken
  const name = `delete-${collection.type.name}`

  return [formatName.field(name), createMutationField<ObjectType.Value>(buildToken, {
    name,
    inputFields: [
      // The only input field we want is the globally unique id which
      // corresponds to the primary key of this collection.
      [options.nodeIdFieldName, {
        // TODO: description
        type: new GraphQLNonNull(GraphQLID),
      }],
    ],
    outputFields: [
      // Add the deleted value as an output field so the user can see the
      // object they just deleted.
      [formatName.field(collection.type.name), {
        type: getCollectionType(buildToken, collection),
        resolve: value => value,
      }],
    ],
    // Execute by deserializing the id into its component parts and delete a
    // value in the collection using that key.
    execute: (context, input) => {
      const { collectionKey, keyValue } = idSerde.deserialize(inventory, input[options.nodeIdFieldName] as string)

      if (collectionKey !== primaryKey)
        throw new Error(`The provided id is for collection '${collectionKey.collection.name}', not the expected collection '${collection.name}'.`)

      return primaryKey.delete!(context, keyValue)
    },
  })]
}
