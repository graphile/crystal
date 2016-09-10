import { GraphQLSchema, GraphQLObjectType, GraphQLFieldConfig } from 'graphql'
import { Inventory } from '../../interface'
import buildObject from '../utils/buildObject'
import createNodeFieldEntry from './node/createNodeFieldEntry'
import createCollectionQueryFieldEntries from './collection/createCollectionQueryFieldEntries'
import BuildToken from './BuildToken'

type Options = {
  nodeIdFieldName?: string,
}

// TODO: doc
export default function createSchema (inventory: Inventory, options: Options = {}): GraphQLSchema {
  // We take our user-friendly arguments to `createSchema` and convert them
  // into a context token. One nice side effect of always creating our own
  // context object is that we have the guarantee that every context object
  // will always maintain its own memoization map.
  const buildToken: BuildToken = {
    inventory,
    options: {
      // The default node id field name is `__id` as it is the emerging
      // standard.
      nodeIdFieldName: options.nodeIdFieldName || '__id',
    },
  }

  return new GraphQLSchema({
    query: createQueryType(buildToken),
  })
}

// TODO: doc
function createQueryType <T>(buildToken: BuildToken): GraphQLObjectType<T> {
  const { inventory } = buildToken
  return new GraphQLObjectType({
    name: 'Query',
    // TODO: description
    fields: buildObject<GraphQLFieldConfig<T, mixed>>(
      [
        createNodeFieldEntry(buildToken),
      ],
      inventory
        .getCollections()
        .map(collection => createCollectionQueryFieldEntries(buildToken, collection))
        .reduce((a, b) => a.concat(b), []),
    ),
  })
}
