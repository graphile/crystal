import { GraphQLFieldConfig, GraphQLNonNull, GraphQLID } from 'graphql'
import { Context, CollectionKey } from '../../../interface'
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

      let deserializationResult: { collectionKey: CollectionKey<T>, keyValue: T }

      // Try to deserialize the id we got from our argument. If we fail to
      // deserialize the id, we should just return null and ignore the error.
      try {
        deserializationResult = idSerde.deserialize<T>(inventory, args[options.nodeIdFieldName])
      }
      catch (error) {
        return null
      }

      const { collectionKey, keyValue } = deserializationResult

      if (!collectionKey || !collectionKey.read)
        throw new Error(`Invalid id, no readable primary key on collection named '${name}'.`)

      return collectionKey.read(context, keyValue)
    },
  }]
}

