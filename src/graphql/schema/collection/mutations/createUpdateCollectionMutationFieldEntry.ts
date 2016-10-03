import {
  GraphQLInputType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInputFieldConfig,
  GraphQLFieldConfig,
  getNullableType,
} from 'graphql'
import { Collection, ObjectType } from '../../../../interface'
import { formatName, buildObject, idSerde, memoize2 } from '../../../utils'
import BuildToken from '../../BuildToken'
import getGQLType from '../../getGQLType'
import createMutationGQLField from '../../createMutationGQLField'
import transformGQLInputValue, { $$gqlInputObjectTypeValueKeyName } from '../../transformGQLInputValue'
import getCollectionGQLType from '../getCollectionGQLType'

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
  if (!primaryKey || !primaryKey.update)
    return

  const { options, inventory } = buildToken
  const name = `update-${collection.type.name}`
  const patchFieldName = formatName.field(`${collection.type.name}-patch`)
  const patchType = getCollectionPatchType(buildToken, collection)

  return [formatName.field(name), createMutationGQLField<ObjectType.Value>(buildToken, {
    name,
    inputFields: [
      // The only input field we want is the globally unique id which
      // corresponds to the primary key of this collection.
      [options.nodeIdFieldName, {
        // TODO: description
        type: new GraphQLNonNull(GraphQLID),
      }],
      // Also include the patch object type. This is its own object type so
      // that people can just have a single patch object and not need to rename
      // keys. This also means users can freely upload entire objects to this
      // field.
      [patchFieldName, {
        // TODO: description
        type: new GraphQLNonNull(patchType),
      }],
    ],
    outputFields: createUpdateCollectionOutputFieldEntries(buildToken, collection),
    // Execute by deserializing the id into its component parts and delete a
    // value in the collection using that key.
    execute: (context, input) => {
      const result = idSerde.deserialize(inventory, input[options.nodeIdFieldName] as string)

      if (result.collection !== collection)
        throw new Error(`The provided id is for collection '${result.collection.name}', not the expected collection '${collection.name}'.`)

      // Get the patch from our input.
      const patch = transformGQLInputValue(patchType, input[patchFieldName])

      return primaryKey.update!(context, result.keyValue, patch as any)
    },
  })]
}

/**
 * Gets the patch type for a collection. The patch type allows us to define
 * fine-grained changes to our object and is very similar to the input object
 * type.
 */
export const getCollectionPatchType = memoize2(createCollectionPatchType)

/**
 * The internal un-memoized implementation of `getCollectionPatchType`.
 *
 * @private
 */
function createCollectionPatchType (buildToken: BuildToken, collection: Collection): GraphQLInputObjectType<mixed> {
  const { type } = collection
  return new GraphQLInputObjectType({
    name: formatName.type(`${type.name}-patch`),
    // TODO: description
    fields: () => buildObject<GraphQLInputFieldConfig<mixed>>(
      Array.from(type.fields).map<[string, GraphQLInputFieldConfig<mixed>]>(([fieldName, field]) =>
        [formatName.field(fieldName), {
          // TODO: description
          type: getNullableType(getGQLType(buildToken, field.type, true)) as GraphQLInputType<mixed>,
          [$$gqlInputObjectTypeValueKeyName]: fieldName,
        }]
      )
    ),
  })
}

/**
 * Creates the output fields returned by the collection update mutation.
 */
export function createUpdateCollectionOutputFieldEntries (
  buildToken: BuildToken,
  collection: Collection,
): Array<[string, GraphQLFieldConfig<ObjectType.Value, mixed>]> {
  return [
    // Add the updated value as an output field so the user can see the
    // object they just updated.
    [formatName.field(collection.type.name), {
      type: getCollectionGQLType(buildToken, collection),
      resolve: value => value,
    }],
  ]
}
