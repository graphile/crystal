import { GraphQLFieldConfig } from 'graphql'
import { Collection, ObjectType } from '../../../../interface'
import { formatName } from '../../../utils'
import BuildToken from '../../BuildToken'
import getType from '../../getType'
import transformGqlInputValue from '../../transformGqlInputValue'
import createMutationField from '../../createMutationField'
import { getEdgeType, createOrderByArg } from '../../connection/createConnectionField'
import getCollectionType from '../getCollectionType'

/**
 * Creates the mutation field entry for creating values in a collection.
 * Returns undefined if you can’t create values in a given collection.
 */
export default function createCreateCollectionMutationFieldEntry (
  buildToken: BuildToken,
  collection: Collection,
): [string, GraphQLFieldConfig<mixed, mixed>] | undefined {
  // Return undefined if you can’t create values.
  if (!collection.create)
    return

  const name = `create-${collection.type.name}`
  const inputFieldName = formatName.field(collection.type.name)
  const inputFieldType = getType(buildToken, collection.type, true)

  return [formatName.field(name), createMutationField<ObjectType.Value>(buildToken, {
    name,

    inputFields: [
      // The only input we need when creating a new object is the type in input
      // object form. We nest the input object instead of flattening its fields
      // so that you only need object per value you create.
      [inputFieldName, {
        // TODO: description
        type: inputFieldType,
      }],
    ],

    outputFields: [
      // The actual object that just got created. The user can then use
      // this as a starting point to query relations that were created
      // with this object.
      [formatName.field(collection.type.name), {
        // TODO: description
        type: getCollectionType(buildToken, collection),
        resolve: value => value,
      }],

      // An edge variant of the created value. Because we use cursor
      // based pagination, it is also helpful to get the cursor for the
      // value we just created (thus why this is in the form of an edge).
      // Also Relay 1 requires us to return the edge.
      collection.paginator && [formatName.field(`${collection.type.name}-edge`), {
        // TODO: description
        type: getEdgeType(buildToken, collection.paginator),
        args: { orderBy: createOrderByArg(buildToken, collection.paginator) },
        resolve: (value, args) => ({
          paginator: collection.paginator,
          ordering: args['orderBy'],
          // TODO: cursor
          value,
        }),
      }],
    ],

    // When we execute we just create a value in the collection after
    // transforming the correct input field.
    // TODO: test
    execute: (context, input) =>
      collection.create!(context, transformGqlInputValue(inputFieldType, input[inputFieldName]) as any),
  })]
}
