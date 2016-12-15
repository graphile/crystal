import { GraphQLObjectType, GraphQLFieldConfig, GraphQLNonNull, GraphQLID } from 'graphql'
import { Collection } from '../../../../interface'
import { formatName, idSerde, memoize2 } from '../../../utils'
import BuildToken from '../../BuildToken'
import createMutationGqlField from '../../createMutationGqlField'
import createMutationPayloadGqlType from '../../createMutationPayloadGqlType'
import getGqlOutputType from '../../type/getGqlOutputType'
import createCollectionRelationTailGqlFieldEntries from '../createCollectionRelationTailGqlFieldEntries'

/**
 * Creates a delete mutation that uses the primary key of a collection and an
 * object’s global GraphQL identifier to delete a value in the collection.
 */
// TODO: test
export default function createDeleteCollectionMutationFieldEntry <TValue>(
  buildToken: BuildToken,
  collection: Collection<TValue>,
): [string, GraphQLFieldConfig<mixed, mixed>] | undefined {
  const { primaryKey } = collection

  // If there is no primary key, or the primary key has no delete method. End
  // early.
  if (!primaryKey || !primaryKey.delete)
    return

  const { options, inventory } = buildToken
  const name = `delete-${collection.type.name}`

  return [formatName.field(name), createMutationGqlField<TValue>(buildToken, {
    name,
    description: `Deletes a single \`${formatName.type(collection.type.name)}\` using its globally unique id.`,
    inputFields: [
      // The only input field we want is the globally unique id which
      // corresponds to the primary key of this collection.
      [options.nodeIdFieldName, {
        description: `The globally unique \`ID\` which will identify a single \`${formatName.type(collection.type.name)}\` to be deleted.`,
        type: new GraphQLNonNull(GraphQLID),
      }],
    ],
    payloadType: getDeleteCollectionPayloadGqlType(buildToken, collection),
    // Execute by deserializing the id into its component parts and delete a
    // value in the collection using that key.
    execute: (context, input) => {
      const result = idSerde.deserialize(inventory, input[options.nodeIdFieldName] as string)

      if (result.collection !== collection)
        throw new Error(`The provided id is for collection '${result.collection.name}', not the expected collection '${collection.name}'.`)

      return primaryKey.delete!(context, result.keyValue)
    },
  })]
}

export const getDeleteCollectionPayloadGqlType = memoize2(createDeleteCollectionPayloadGqlType)

/**
 * Creates the output fields returned by the collection delete mutation.
 */
function createDeleteCollectionPayloadGqlType <TValue>(
  buildToken: BuildToken,
  collection: Collection<TValue>,
): GraphQLObjectType {
  const { primaryKey } = collection
  const { gqlType, intoGqlOutput } = getGqlOutputType(buildToken, collection.type)
  return createMutationPayloadGqlType<TValue>(buildToken, {
    name: `delete-${collection.type.name}`,
    outputFields: [
      // Add the deleted value as an output field so the user can see the
      // object they just deleted.
      [formatName.field(collection.type.name), {
        type: gqlType,
        resolve: intoGqlOutput,
      }],
      // Add the deleted values globally unique id as well. This one is
      // especially useful for removing old nodes from the cache.
      primaryKey ? [formatName.field(`deleted-${collection.type.name}-id`), {
        type: GraphQLID,
        resolve: value => idSerde.serialize(collection, value),
      }] : null,
      // Add related objects. This helps in Relay 1.
      ...createCollectionRelationTailGqlFieldEntries(buildToken, collection, { getCollectionValue: value => value }),
    ],
  })
}
