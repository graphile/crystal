import { GraphQLFieldConfig } from 'graphql'
import { Collection, Relation, ObjectType } from '../../../../interface'
import { formatName } from '../../../utils'
import BuildToken from '../../BuildToken'
import getGQLType from '../../getGQLType'
import transformGQLInputValue from '../../transformGQLInputValue'
import createMutationGQLField from '../../createMutationGQLField'
import { getEdgeGQLType, createOrderByGQLArg } from '../../connection/createConnectionGQLField'
import getCollectionGQLType from '../getCollectionGQLType'
import createCollectionRelationTailGQLFieldEntries from '../createCollectionRelationTailGQLFieldEntries'

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
  const inputFieldType = getGQLType(buildToken, collection.type, true)

  return [formatName.field(name), createMutationGQLField<ObjectType.Value>(buildToken, {
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
        type: getCollectionGQLType(buildToken, collection),
        resolve: value => value,
      }],

      // An edge variant of the created value. Because we use cursor
      // based pagination, it is also helpful to get the cursor for the
      // value we just created (thus why this is in the form of an edge).
      // Also Relay 1 requires us to return the edge.
      collection.paginator && [formatName.field(`${collection.type.name}-edge`), {
        // TODO: description
        type: getEdgeGQLType(buildToken, collection.paginator),
        args: { orderBy: createOrderByGQLArg(buildToken, collection.paginator) },
        resolve: (value, args) => ({
          paginator: collection.paginator,
          ordering: args['orderBy'],
          cursor: null,
          value,
        }),
      }],

      // Add related objects. This helps in Relay 1.
      ...createCollectionRelationTailGQLFieldEntries(buildToken, collection),
    ],

    // When we execute we just create a value in the collection after
    // transforming the correct input field.
    // TODO: test
    execute: (context, input) =>
      collection.create!(context, transformGQLInputValue(inputFieldType, input[inputFieldName]) as any),
  })]
}
