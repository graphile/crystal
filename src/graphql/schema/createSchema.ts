import { GraphQLSchema, GraphQLObjectType, GraphQLFieldConfig } from 'graphql'
import { Inventory } from '../../interface'
import buildObject from '../utils/buildObject'
import createNodeFieldEntry from './node/createNodeFieldEntry'
import createCollectionQueryFieldEntries from './collection/createCollectionQueryFieldEntries'
import Context from './Context'

type Options = {
  nodeIdFieldName?: string,
}

// TODO: doc
export default function createSchema (inventory: Inventory, options: Options = {}): GraphQLSchema {
  // We take our user-friendly arguments to `createSchema` and convert them
  // into a context token. One nice side effect of always creating our own
  // context object is that we have the guarantee that every context object
  // will always maintain its own memoization map.
  const context: Context = {
    inventory,
    options: {
      // The default node id field name is `__id` as it is the emerging
      // standard.
      nodeIdFieldName: options.nodeIdFieldName || '__id',
    },
  }

  return new GraphQLSchema({
    query: createQueryType(context),
  })
}

// TODO: doc
function createQueryType <T>(context: Context): GraphQLObjectType<T> {
  const { inventory } = context
  return new GraphQLObjectType({
    name: 'Query',
    // TODO: description
    fields: buildObject<GraphQLFieldConfig<T, mixed>>(
      [
        createNodeFieldEntry(context),
      ],
      inventory
        .getCollections()
        .map(collection => createCollectionQueryFieldEntries(context, collection))
        .reduce((a, b) => a.concat(b), []),
    ),
  })
}
