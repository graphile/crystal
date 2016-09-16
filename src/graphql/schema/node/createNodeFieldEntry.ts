import { GraphQLFieldConfig, GraphQLNonNull, GraphQLID } from 'graphql'
import idSerde from '../../utils/idSerde'
import BuildToken from '../BuildToken'
import getNodeInterfaceType from './getNodeInterfaceType'

// TODO: doc
export default function createNodeFieldEntry (buildToken: BuildToken): [string, GraphQLFieldConfig<mixed, mixed>] {
  const { inventory, options } = buildToken
  return ['node', {
    // TODO: description
    type: getNodeInterfaceType(buildToken),
    args: {
      [options.nodeIdFieldName]: {
        // TODO: description,
        type: new GraphQLNonNull(GraphQLID),
      },
    },
    resolve (source, args) {
      const { name, key } = idSerde.deserialize(args[options.nodeIdFieldName])
      const collection = inventory.getCollection(name)

      if (!collection)
        throw new Error(`Invalid id, no collection exists named '${name}'.`)

      const primaryKey = collection.primaryKey

      if (!primaryKey)
        throw new Error(`Invalid id, no primary key on collection named '${name}'.`)

      return primaryKey.read(key)
    },
  }]
}

