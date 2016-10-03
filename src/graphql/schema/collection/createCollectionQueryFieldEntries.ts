import { GraphQLFieldConfig, GraphQLNonNull, GraphQLID, GraphQLArgumentConfig } from 'graphql'
import { Condition, conditionHelpers, Collection, CollectionKey, NullableType, ObjectType } from '../../../interface'
import { formatName, idSerde, buildObject, scrib } from '../../utils'
import BuildToken from '../BuildToken'
import getGQLType from '../getGQLType'
import transformGQLInputValue from '../transformGQLInputValue'
import createConnectionGQLField from '../connection/createConnectionGQLField'
import getCollectionGQLType from './getCollectionGQLType'
import createCollectionKeyInputHelpers from './createCollectionKeyInputHelpers'

/**
 * Creates any number of query field entries for a collection. These fields
 * will be on the root query type.
 */
export default function createCollectionQueryFieldEntries (
  buildToken: BuildToken,
  collection: Collection,
): Array<[string, GraphQLFieldConfig<mixed, mixed>]> {
  const { options } = buildToken
  const type = collection.type
  const entries: Array<[string, GraphQLFieldConfig<mixed, mixed>]> = []
  const primaryKey = collection.primaryKey
  const paginator = collection.paginator

  // If the collection has a paginator, let’s use it to create a connection
  // field for our collection.
  if (paginator) {
    // Create our field condition entries. If we are not configured to have such
    // entries, this variable will just be null.
    const inputArgEntries: Array<[string, GraphQLArgumentConfig<mixed> & { internalName: string }]> =
      Array.from(collection.type.fields).map<[string, GraphQLArgumentConfig<mixed> & { internalName: string }]>(([fieldName, field]) =>
        [formatName.arg(fieldName), {
          // Get the type for this field, but always make sure that it is
          // nullable. We don’t want to require conditions.
          type: getGQLType(buildToken, new NullableType(field.type), true),
          // We include this internal name so that we can resolve the arguments
          // back into actual values.
          internalName: fieldName,
        }]
      )

    // Gets the condition input for our paginator by looking through the
    // arguments object and adding a field condition for all the values we
    // find.
    const getPaginatorInput = (source: mixed, args: { [key: string]: mixed }): Condition =>
      conditionHelpers.and(
        // For all of our field condition entries, let us add an actual
        // condition to test equality with a given field.
        ...inputArgEntries.map(([fieldName, field]) =>
          args[fieldName] !== undefined
            // If the argument exists, create a condition and transform the
            // input value.
            ? conditionHelpers.fieldEquals(field.internalName, transformGQLInputValue(field.type, args[fieldName]))
            // If the argument does not exist, this condition should just be
            // true (which will get filtered out by `conditionHelpers.and`).
            : true
        )
      )

    entries.push([
      formatName.field(`all-${collection.name}`),
      createConnectionGQLField(buildToken, paginator, { inputArgEntries, getPaginatorInput }),
    ])
  }

  // Add a field to select our collection by its primary key, if the
  // collection has a primary key. Note that we abstract away the shape of
  // the primary key in this instance. Instead using a GraphQL native format,
  // the id format.
  if (primaryKey) {
    const field = createCollectionPrimaryKeyField(buildToken, primaryKey)

    // If we got a field back, add it.
    if (field)
      entries.push([formatName.field(type.name), field])
  }

  // Add a field to select any value in the collection by any key. So all
  // unique keys of an object will be usable to select a single value.
  for (const collectionKey of (collection.keys || [])) {
    const field = createCollectionKeyField(buildToken, collectionKey)

    // If we got a field back, add it.
    if (field) entries.push([formatName.field(`${type.name}-by-${collectionKey.name}`), field])
  }

  return entries
}

/**
 * Creates the field used to select an object by its primary key using a
 * GraphQL global id.
 */
function createCollectionPrimaryKeyField <TKey>(
  buildToken: BuildToken,
  collectionKey: CollectionKey<TKey>,
): GraphQLFieldConfig<mixed, mixed> | undefined {
  const { options, inventory } = buildToken
  const { collection } = collectionKey

  // If we can’t read from this collection key, stop.
  if (collectionKey.read == null)
    return

  const collectionType = getCollectionGQLType(buildToken, collection)

  return {
    description: `Reads a single ${scrib.type(collectionType)} using its globally unique ${scrib.type(GraphQLID)}.`,
    type: collectionType,

    args: {
      [options.nodeIdFieldName]: {
        description: `The globally unique ${scrib.type(GraphQLID)} to be used in selecting a single ${scrib.type(collectionType)}.`,
        type: new GraphQLNonNull(GraphQLID),
      },
    },

    async resolve (source, args, context): Promise<ObjectType.Value | null> {
      const result = idSerde.deserialize(inventory, args[options.nodeIdFieldName] as string)

      if (result.collection !== collection)
        throw new Error(`The provided id is for collection '${result.collection.name}', not the expected collection '${collection.name}'.`)

      return await collectionKey.read!(context, result.keyValue as any)
    },
  }
}

/**
 * Creates a field using the value from any collection key.
 */
// TODO: test
function createCollectionKeyField <TKey>(
  buildToken: BuildToken,
  collectionKey: CollectionKey<TKey>,
): GraphQLFieldConfig<mixed, mixed> | undefined {
  // If we can’t read from this collection key, stop.
  if (collectionKey.read == null)
    return

  const { collection, keyType } = collectionKey
  const collectionType = getCollectionGQLType(buildToken, collection)
  const inputHelpers = createCollectionKeyInputHelpers<TKey>(buildToken, collectionKey)

  return {
    type: collectionType,
    args: buildObject(inputHelpers.fieldEntries),
    async resolve (source, args, context): Promise<ObjectType.Value | null> {
      const key = inputHelpers.getKey(args)
      return await collectionKey.read!(context, key)
    },
  }
}
