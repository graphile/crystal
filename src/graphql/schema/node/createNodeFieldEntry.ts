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
    resolve <T>(source: mixed, args: any, context: mixed) {
      if (!(context instanceof Context))
        throw new Error('GraphQL context must be an instance of `Context`.')

      const { collectionKey, keyValue } = idSerde.deserialize(inventory, args[options.nodeIdFieldName])

      if (!collectionKey || !collectionKey.read)
        throw new Error(`Invalid id, no readable primary key on collection named '${name}'.`)

      return collectionKey.read(context, keyValue)
    },
  }]
}

