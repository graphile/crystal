import { GraphQLFieldConfig, GraphQLNonNull, GraphQLID, GraphQLArgumentConfig } from 'graphql'
import { Collection, ObjectType } from '../../../interface'
import { formatName, idSerde, buildObject } from '../../utils'
import BuildToken from '../BuildToken'
import getType from '../getType'
import createConnectionField from '../createConnectionField'
import getCollectionType from './getCollectionType'

/**
 * Creates any number of query field entries for a collection. These fields
 * will be on the root query type.
 */
export default function createCollectionQueryFieldEntries <T>(
  buildToken: BuildToken,
  collection: Collection<T>,
): Array<[string, GraphQLFieldConfig<mixed, mixed>]> {
  const { options } = buildToken
  const type = collection.type
  const entries: Array<[string, GraphQLFieldConfig<any, any>]> = []
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
    entries.push([formatName.field(type.getName()), {
      // TODO: description
      type: getCollectionType(buildToken, collection),

      args: {
        [options.nodeIdFieldName]: {
          // TODO: description,
          type: new GraphQLNonNull(GraphQLID),
        },
      },

      resolve: (source, args) => {
        const { name, key } = idSerde.deserialize(args[options.nodeIdFieldName] as string)

        if (name !== collection.name)
          throw new Error(`The provided id is for collection '${name}', not the expected collection '${collection.name}'.`)

        return primaryKey.read(key)
      },
    }])
  }

  // Add a field to select any value in the collection by any key. So all
  // unique keys of an object will be usable to select a single value.
  for (const key of collection.keys) {
    const keyName = key.name
    const keyType = key.type
    const fieldName = formatName.field(`${type.getName()}-by-${keyName}`)
    const collectionType = getCollectionType(buildToken, collection)

    // If the key type is an object type, we want to flatten the object fields
    // into distinct arguments.
    if (keyType instanceof ObjectType) {
      const fields = keyType.getFields()
      const fieldArgNames = fields.map(field => formatName.arg(field.getName()))

      entries.push([fieldName, {
        type: collectionType,
        args: buildObject<GraphQLArgumentConfig<mixed>>(
          fields.map<[string, GraphQLArgumentConfig<mixed>]>((field, i) =>
            [fieldArgNames[i], {
              description: field.getDescription(),
              type: getType(buildToken, field.getType(), true),
            }]
          )
        ),
        resolve: (source, args) =>
          key.read(keyType.createFromFieldValues(new Map(fields.map((field, i): [string, mixed] => [field.getName(), args[fieldArgNames[i]]])))),
      }])
    }
    // Otherwise if this is not an object type, we’ll just expose one argument
    // with the key’s name.
    else {
      const argName = formatName.arg(keyName)

      entries.push([fieldName, {
        type: collectionType,
        args: {
          [argName]: {
            // TODO: description
            type: getType(buildToken, keyType, true),
          },
        },
        resolve: (source, args) =>
          key.read(args[argName]),
      }])
    }
  }

  return entries
}
