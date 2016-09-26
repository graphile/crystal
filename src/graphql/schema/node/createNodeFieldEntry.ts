import { GraphQLFieldConfig, GraphQLNonNull, GraphQLID } from 'graphql'
import { Context } from '../../../interface'
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
    resolve (source, args, context) {
      if (!(context instanceof Context))
        throw new Error('GraphQL context must be an instance of `Context`.')

      const { name, key } = idSerde.deserialize(args[options.nodeIdFieldName])
      const collection = inventory.getCollection(name)

      if (!collection)
        throw new Error(`Invalid id, no collection exists named '${name}'.`)

      const primaryKey = collection.primaryKey

      if (!primaryKey || !primaryKey.read)
        throw new Error(`Invalid id, no readable primary key on collection named '${name}'.`)

      return primaryKey.read(context, key)
    },
  }]
}

