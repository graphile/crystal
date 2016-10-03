import { GraphQLFieldConfig, GraphQLNonNull, GraphQLID } from 'graphql'
import { Collection } from '../../../interface'
import { idSerde, scrib } from '../../utils'
import BuildToken from '../BuildToken'
import getNodeInterfaceType from './getNodeInterfaceType'

// TODO: doc
export default function createNodeFieldEntry (buildToken: BuildToken): [string, GraphQLFieldConfig<mixed, mixed>] {
  const { inventory, options } = buildToken
  return ['node', {
    description: `Fetches an object given its globally unique ${scrib.type(GraphQLID)}.`,
    type: getNodeInterfaceType(buildToken),
    args: {
      [options.nodeIdFieldName]: {
        description: `The globally unique ${scrib.type(GraphQLID)}.`,
        type: new GraphQLNonNull(GraphQLID),
      },
    },
    async resolve (source: mixed, args: any, context: mixed) {
      let deserializationResult: { collection: Collection, keyValue: mixed }

      // Try to deserialize the id we got from our argument. If we fail to
      // deserialize the id, we should just return null and ignore the error.
      try {
        deserializationResult = idSerde.deserialize(inventory, args[options.nodeIdFieldName])
      }
      catch (error) {
        return null
      }

      const { collection, keyValue } = deserializationResult
      const primaryKey = collection.primaryKey

      if (!primaryKey || !primaryKey.read)
        throw new Error(`Invalid id, no readable primary key on collection named '${name}'.`)

      return primaryKey.read(context, keyValue)
    },
  }]
}
