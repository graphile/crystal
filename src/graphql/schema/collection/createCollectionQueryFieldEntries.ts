import { GraphQLFieldConfig, GraphQLNonNull, GraphQLID, GraphQLArgumentConfig } from 'graphql'
import { Collection, CollectionKey, ObjectType } from '../../../interface'
import { formatName, idSerde, buildObject } from '../../utils'
import BuildToken from '../BuildToken'
import getType from '../getType'
import createConnectionField from '../createConnectionField'
import getCollectionType from './getCollectionType'

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
    entries.push([
      formatName.field(`all-${collection.name}`),
      createConnectionField(buildToken, paginator),
    ])
  }

  // Add a field to select our collection by its primary key, if the
  // collection has a primary key. Note that we abstract away the shape of
  // the primary key in this instance. Instead using a GraphQL native format,
  // the id format.
  if (primaryKey) {
    const field = createCollectionPrimaryKeyField(buildToken, primaryKey)

    // If we got a field back, add it.
    if (field) entries.push([formatName.field(type.name), field])
  }

  // Add a field to select any value in the collection by any key. So all
  // unique keys of an object will be usable to select a single value.
  for (const collectionKey of collection.keys) {
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
  const { options } = buildToken
  const { collection } = collectionKey

  // If we can’t read from this collection key, stop.
  if (collectionKey.read == null) return

  return {
    // TODO: description
    type: getCollectionType(buildToken, collection),

    args: {
      [options.nodeIdFieldName]: {
        // TODO: description,
        type: new GraphQLNonNull(GraphQLID),
      },
    },

    async resolve (source, args, context): Promise<ObjectType.Value | null> {
      const { name, key } = idSerde.deserialize(args[options.nodeIdFieldName] as string)

      if (name !== collection.name)
        throw new Error(`The provided id is for collection '${name}', not the expected collection '${collection.name}'.`)

      if (!collectionKey.keyType.isTypeOf(key))
        throw new Error('The provided key is of the incorrect type.')

      return await collectionKey.read!(context, key)
    },
  }
}

/**
 * Creates a field using the value from any collection key.
 */
function createCollectionKeyField <TKey>(
  buildToken: BuildToken,
  collectionKey: CollectionKey<TKey>,
): GraphQLFieldConfig<mixed, mixed> | undefined {
  const { collection, keyType } = collectionKey
  const collectionType = getCollectionType(buildToken, collection)

  // If we can’t read from this collection key, stop.
  if (collectionKey.read == null) return

  // If the key type is an object type, we want to flatten the object fields
  // into distinct arguments.
  if (keyType instanceof ObjectType) {
    return {
      type: collectionType,
      args: buildObject<GraphQLArgumentConfig<mixed>>(
        Array.from(keyType.fields.entries()).map<[string, GraphQLArgumentConfig<mixed>]>(([fieldName, field]) =>
          [formatName.arg(fieldName), {
            description: field.description,
            internalName: fieldName,
            type: getType(buildToken, field.type, true),
          }]
        )
      ),
      async resolve (source, args, context): Promise<ObjectType.Value | null> {
        if (!keyType.isTypeOf(args))
          throw new Error('The provided arguments are not the correct type.')

        return await collectionKey.read!(context, args)
      },
    }
  }
  // Otherwise if this is not an object type, we’ll just expose one argument
  // with the key’s name.
  else {
    return {
      type: collectionType,
      args: {
        [formatName.arg(collectionKey.name)]: {
          // TODO: description
          internalName: 'input',
          type: getType(buildToken, keyType, true),
        },
      },
      async resolve (source, args, context): Promise<ObjectType.Value | null> {
        const key: mixed = args['input']

        if (!keyType.isTypeOf(key))
          throw new Error('The provided arguments are not the correct type.')

        return await collectionKey.read!(context, key)
      },
    }
  }
}
