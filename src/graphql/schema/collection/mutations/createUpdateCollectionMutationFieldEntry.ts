import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLInputFieldConfig,
  GraphQLFieldConfig,
} from 'graphql'
import { Collection, NullableType } from '../../../../interface'
import { formatName, buildObject, idSerde, memoize2 } from '../../../utils'
import BuildToken from '../../BuildToken'
import getGqlInputType from '../../type/getGqlInputType'
import getGqlOutputType from '../../type/getGqlOutputType'
import createMutationGqlField from '../../createMutationGqlField'
import createMutationPayloadGqlType from '../../createMutationPayloadGqlType'
import createCollectionRelationTailGqlFieldEntries from '../createCollectionRelationTailGqlFieldEntries'

/**
 * Creates a update mutation that uses the primary key of a collection and an
 * object’s global GraphQL identifier to update a value in the collection.
 */
// TODO: test
export default function createUpdateCollectionMutationFieldEntry <TValue>(
  buildToken: BuildToken,
  collection: Collection<TValue>,
): [string, GraphQLFieldConfig<mixed, mixed>] | undefined {
  const { primaryKey } = collection

  // If there is no primary key, or the primary key has no update method. End
  // early.
  if (!primaryKey || !primaryKey.update)
    return

  const { options, inventory } = buildToken
  const name = `update-${collection.type.name}`
  const patchFieldName = formatName.field(`${collection.type.name}-patch`)
  const { gqlType: patchGqlType, fromGqlInput: patchFromGqlInput } = getCollectionPatchType(buildToken, collection)

  return [formatName.field(name), createMutationGqlField<TValue>(buildToken, {
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
        type: new GraphQLNonNull(patchGqlType),
      }],
    ],
    payloadType: getUpdateCollectionPayloadGqlType(buildToken, collection),
    // Execute by deserializing the id into its component parts and update a
    // value in the collection using that key.
    execute: (context, input) => {
      const result = idSerde.deserialize(inventory, input[options.nodeIdFieldName] as string)

      if (result.collection !== collection)
        throw new Error(`The provided id is for collection '${result.collection.name}', not the expected collection '${collection.name}'.`)

      return primaryKey.update!(context, result.keyValue, patchFromGqlInput(input[patchFieldName] as {}))
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
function createCollectionPatchType <TValue>(buildToken: BuildToken, collection: Collection<TValue>): {
  gqlType: GraphQLInputObjectType,
  fromGqlInput: (input: { [key: string]: mixed }) => Map<string, mixed>,
} {
  const { type } = collection

  const fields =
    Array.from(type.fields).map(([fieldName, field]) => {
      const { gqlType, fromGqlInput } = getGqlInputType(buildToken, new NullableType(field.type))
      return {
        key: formatName.field(fieldName),
        value: {
          description: field.description,
          type: gqlType,
          internalName: fieldName,
          fromGqlInput,
        }
      }
    })

  return {
    gqlType: new GraphQLInputObjectType({
      name: formatName.type(`${type.name}-patch`),
      description: `Represents an update to a \`${formatName.type(type.name)}\`. Fields that are set will be updated.`,
      fields: () => buildObject<GraphQLInputFieldConfig>(fields),
    }),
    fromGqlInput: (input: { [key: string]: mixed }): Map<string, mixed> => {
      const patch = new Map()
      fields.forEach(({ key: fieldName, value: { internalName, fromGqlInput } }) => {
        const fieldValue = input[fieldName]
        if (typeof fieldValue !== 'undefined') {
          patch.set(internalName, fromGqlInput(fieldValue))
        }
      })
      return patch
    },
  }
}

/**
 * The output object type for collection update mutations.
 */
export const getUpdateCollectionPayloadGqlType = memoize2(createUpdateCollectionPayloadGqlType)

/**
 * Creates the output fields returned by the collection update mutation.
 *
 * @private
 */
function createUpdateCollectionPayloadGqlType <TValue>(
  buildToken: BuildToken,
  collection: Collection<TValue>,
): GraphQLObjectType {
  const { gqlType, intoGqlOutput } = getGqlOutputType(buildToken, new NullableType(collection.type))
  return createMutationPayloadGqlType<TValue>(buildToken, {
    name: `update-${collection.type.name}`,
    outputFields: [
      // Add the updated value as an output field so the user can see the
      // object they just updated.
      [formatName.field(collection.type.name), {
        type: gqlType,
        resolve: intoGqlOutput,
      }],
      // Add related objects. This helps in Relay 1.
      ...createCollectionRelationTailGqlFieldEntries(buildToken, collection, { getCollectionValue: value => value }),
    ],
  })
}
