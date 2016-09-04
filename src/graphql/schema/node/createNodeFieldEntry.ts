import { GraphQLFieldConfig, GraphQLNonNull, GraphQLID } from 'graphql'
import { Catalog } from '../../../catalog'
import idSerde from '../../utils/idSerde'
import Context from '../Context'
import getNodeInterfaceType from './getNodeInterfaceType'

// TODO: doc
export default function createNodeFieldEntry (context: Context): [string, GraphQLFieldConfig<mixed, mixed>] {
  const { catalog, options } = context
  return ['node', {
    // TODO: description
    type: getNodeInterfaceType(context),
    args: {
      [options.nodeIdFieldName]: {
        // TODO: description,
        type: new GraphQLNonNull(GraphQLID),
      },
    },
    resolve (source, args) {
      const { name, key } = idSerde.deserialize(args[options.nodeIdFieldName])
      const collection = catalog.getCollection(name)

      if (!collection)
        throw new Error(`Invalid id, no collection exists named '${name}'.`)

      const primaryKey = collection.getPrimaryKey()

      if (!primaryKey)
        throw new Error(`Invalid id, no primary key on collection named '${name}'.`)

      return primaryKey.read(key)
    },
  }]
}

