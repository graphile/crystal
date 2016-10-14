import {
  GraphQLInputType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLInputFieldConfig,
  GraphQLFieldConfig,
  getNullableType,
} from 'graphql'
import { Collection, ObjectType } from '../../../../interface'
import { formatName, buildObject, idSerde, memoize2 } from '../../../utils'
import BuildToken from '../../BuildToken'
import getGQLType from '../../getGQLType'
import createMutationGQLField, { MutationValue } from '../../createMutationGQLField'
import createMutationPayloadGQLType from '../../createMutationPayloadGQLType'
import transformGQLInputValue, { $$gqlInputObjectTypeValueKeyName } from '../../transformGQLInputValue'
import getCollectionGQLType from '../getCollectionGQLType'
import createCollectionRelationTailGQLFieldEntries from '../createCollectionRelationTailGQLFieldEntries'

/**
 * Creates a update mutation that uses the primary key of a collection and an
 * object’s global GraphQL identifier to update a value in the collection.
 */
// TODO: test
export default function createUpdateCollectionMutationFieldEntry (
  buildToken: BuildToken,
  collection: Collection,
): [string, GraphQLFieldConfig<mixed, mixed>] | undefined {
  const { primaryKey } = collection

  // If there is no primary key, or the primary key has no update method. End
  // early.
  if (!primaryKey || !primaryKey.update)
    return

  const { options, inventory } = buildToken
  const name = `update-${collection.type.name}`
  const patchFieldName = formatName.field(`${collection.type.name}-patch`)
  const patchType = getCollectionPatchType(buildToken, collection)

  return [formatName.field(name), createMutationGQLField<ObjectType.Value>(buildToken, {
    name,
    description: `Updates a single \`${formatName.type(collection.type.name)}\` using its globally unique id and a patch.`,
    inputFields: [
      // The only input field we want is the globally unique id which
      // corresponds to the primary key of this collection.
      [options.nodeIdFieldName, {
        description: `The globally unique \`ID\` which will identify a single \`${formatName.type(collection.type.name)}\` to be updated.`,
        type: new GraphQLNonNull(GraphQLID),
      }],
      // Also include the patch object type. This is its own object type so
      // that people can just have a single patch object and not need to rename
      // keys. This also means users can freely upload entire objects to this
      // field.
      [patchFieldName, {
        description: `An object where the defined keys will be set on the \`${formatName.type(collection.type.name)}\` identified by our globally unique \`ID\`.`,
        type: new GraphQLNonNull(patchType),
      }],
    ],
    payloadType: getUpdateCollectionPayloadGQLType(buildToken, collection),
    // Execute by deserializing the id into its component parts and update a
    // value in the collection using that key.
    execute: (context, input) => {
      const result = idSerde.deserialize(inventory, input[options.nodeIdFieldName] as string)

      if (result.collection !== collection)
        throw new Error(`The provided id is for collection '${result.collection.name}', not the expected collection '${collection.name}'.`)

      // Get the patch from our input.
      const patch = transformGQLInputValue(patchType, input[patchFieldName])

      if (!(patch instanceof Map))
        throw new Error('Patch is not of the correct type. Expected a `Map`.')

      return primaryKey.update!(context, result.keyValue, patch)
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
    description: `Represents an update to a \`${formatName.type(type.name)}\`. Fields that are set will be updated.`,
    fields: () => buildObject<GraphQLInputFieldConfig<mixed>>(
      Array.from(type.fields).map<[string, GraphQLInputFieldConfig<mixed>]>(([fieldName, field]) =>
        [formatName.field(fieldName), {
          description: field.description,
          type: getNullableType(getGQLType(buildToken, field.type, true)) as GraphQLInputType<mixed>,
          [$$gqlInputObjectTypeValueKeyName]: fieldName,
        }]
      )
    ),
  })
}

/**
 * The output object type for collection update mutations.
 */
export const getUpdateCollectionPayloadGQLType = memoize2(createUpdateCollectionPayloadGQLType)

/**
 * Creates the output fields returned by the collection update mutation.
 *
 * @private
 */
function createUpdateCollectionPayloadGQLType (
  buildToken: BuildToken,
  collection: Collection,
): GraphQLObjectType<MutationValue<ObjectType.Value>> {
  return createMutationPayloadGQLType<ObjectType.Value>(buildToken, {
    name: `update-${collection.type.name}`,
    outputFields: [
      // Add the updated value as an output field so the user can see the
      // object they just updated.
      [formatName.field(collection.type.name), {
        type: getCollectionGQLType(buildToken, collection),
        resolve: value => value,
      }],
      // Add related objects. This helps in Relay 1.
      ...createCollectionRelationTailGQLFieldEntries(buildToken, collection),
    ],
  })
}
