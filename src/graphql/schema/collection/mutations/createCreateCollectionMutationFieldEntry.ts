import { GraphQLFieldConfig } from 'graphql'
import { Collection } from '../../../../interface'
import { formatName, scrib } from '../../../utils'
import BuildToken from '../../BuildToken'
import getGqlInputType from '../../type/getGqlInputType'
import getGqlOutputType from '../../type/getGqlOutputType'
import createMutationGqlField from '../../createMutationGqlField'
import { getEdgeGqlType, createOrderByGqlArg } from '../../connection/createConnectionGqlField'
import createCollectionRelationTailGqlFieldEntries from '../createCollectionRelationTailGqlFieldEntries'

/**
 * Creates the mutation field entry for creating values in a collection.
 * Returns undefined if you can’t create values in a given collection.
 */
export default function createCreateCollectionMutationFieldEntry <TValue>(
  buildToken: BuildToken,
  collection: Collection<TValue>,
): [string, GraphQLFieldConfig<mixed, mixed>] | undefined {
  // Return undefined if you can’t create values.
  if (!collection.create)
    return

  const name = `create-${collection.type.name}`
  const inputFieldName = formatName.field(collection.type.name)
  const { gqlType: inputGqlType, fromGqlInput: inputFromGqlInput } = getGqlInputType(buildToken, collection.type)
  const { gqlType: collectionGqlType } = getGqlOutputType(buildToken, collection.type)

  return [formatName.field(name), createMutationGqlField<TValue>(buildToken, {
    name,
    description: `Creates a single ${scrib.type(collectionGqlType)}.`,

    inputFields: [
      // The only input we need when creating a new object is the type in input
      // object form. We nest the input object instead of flattening its fields
      // so that you only need object per value you create.
      [inputFieldName, {
        description: `The ${scrib.type(collectionGqlType)} to be created by this mutation.`,
        type: inputGqlType,
      }],
    ],

    outputFields: [
      // The actual object that just got created. The user can then use
      // this as a starting point to query relations that were created
      // with this object.
      [formatName.field(collection.type.name), {
        description: `The ${scrib.type(collectionGqlType)} that was created by this mutation.`,
        type: collectionGqlType,
        resolve: value => value,
      }],

      // An edge variant of the created value. Because we use cursor
      // based pagination, it is also helpful to get the cursor for the
      // value we just created (thus why this is in the form of an edge).
      // Also Relay 1 requires us to return the edge.
      //
      // We may deprecate this in the future if Relay 2 doesn’t need it.
      collection.paginator && [formatName.field(`${collection.type.name}-edge`), {
        description: `An edge for our ${scrib.type(collectionGqlType)}. May be used by Relay 1.`,
        type: getEdgeGqlType(buildToken, collection.paginator),
        args: { orderBy: createOrderByGqlArg(buildToken, collection.paginator) },
        resolve: (value, args) => ({
          paginator: collection.paginator,
          ordering: args['orderBy'],
          cursor: null,
          value,
        }),
      }],

      // Add related objects. This helps in Relay 1.
      ...createCollectionRelationTailGqlFieldEntries(buildToken, collection, { getCollectionValue: value => value }),
    ],

    // When we execute we just create a value in the collection after
    // transforming the correct input field.
    // TODO: test
    execute: (context, input) =>
      collection.create!(context, inputFromGqlInput(input[inputFieldName])),
  })]
}
