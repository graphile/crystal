import { GraphQLObjectType, GraphQLFieldConfig, GraphQLNonNull, GraphQLID } from 'graphql'
import { buildObject, memoize1, loadInjections } from '../utils'
import createNodeFieldEntry from './node/createNodeFieldEntry'
import getNodeInterfaceType from './node/getNodeInterfaceType'
import createCollectionQueryFieldEntries from './collection/createCollectionQueryFieldEntries'
import BuildToken from './BuildToken'

export const $$isQuery = Symbol('isQuery')

// TODO: doc
const getGqlQueryType = memoize1(createGqlQueryType)

export default getGqlQueryType

// TODO: doc
function createGqlQueryType (buildToken: BuildToken): GraphQLObjectType {
  const { options, inventory } = buildToken
  let queryType: GraphQLObjectType

  queryType = new GraphQLObjectType({
    name: 'Query',
    description: 'The root query type which gives access points into the data universe.',
    interfaces: [getNodeInterfaceType(buildToken)],
    // A value in our system is the value of this query type if there is no parent type
    // (i.e. it is the root type), or the value is the symbol `$$isQuery`.
    isTypeOf: (value, _context, info) => info.parentType == null || value === $$isQuery,
    fields: () => buildObject<GraphQLFieldConfig<mixed, mixed>>(
      [
        createNodeFieldEntry(buildToken),
      ],
      // Add the query field entires from our build token hooks.
      buildToken._hooks.queryFieldEntries
        ? buildToken._hooks.queryFieldEntries(buildToken)
        : [],
      inventory
        .getCollections()
        .map(collection => createCollectionQueryFieldEntries(buildToken, collection))
        .reduce((a, b) => a.concat(b), []),
      loadInjections(options.schemaInjection, 'query'),
      [
        // The root query type is useful for Relay 1 as it limits what fields
        // can be queried at the top level.
        ['query', {
          description: 'Exposes the root query type nested one level down. This is helpful for Relay 1 which can only query top level fields if they are in a particular form.',
          type: new GraphQLNonNull(queryType),
          resolve: _source => $$isQuery,
        }],
        // The root query type needs to implement `Node` and have an id for
        // Relay 1 mutations. This may be deprecated in the future.
        [options.nodeIdFieldName, {
          description: 'The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`.',
          type: new GraphQLNonNull(GraphQLID),
          resolve: () => 'query',
        }],
      ],
    ),
  })

  return queryType
}
