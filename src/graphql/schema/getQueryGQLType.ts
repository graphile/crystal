import { GraphQLObjectType, GraphQLFieldConfig, GraphQLNonNull } from 'graphql'
import { Inventory } from '../../interface'
import { buildObject, memoize1 } from '../utils'
import createNodeFieldEntry from './node/createNodeFieldEntry'
import getCollectionGQLType from './collection/getCollectionGQLType'
import createCollectionQueryFieldEntries from './collection/createCollectionQueryFieldEntries'
import BuildToken from './BuildToken'

// TODO: doc
const getGQLQueryType = memoize1(createGQLQueryType)

export default getGQLQueryType

// TODO: doc
function createGQLQueryType (buildToken: BuildToken): GraphQLObjectType<mixed> {
  const { inventory } = buildToken
  let queryType: GraphQLObjectType<mixed>

  queryType = new GraphQLObjectType({
    name: 'Query',
    description: 'The root query type which gives access points into the data universe.',
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
      [
        ['relay', {
          description: 'Exposes the root query type nested one level down. This is helpful for Relay 1 which can only query top level fields if they are in a particular form.',
          type: new GraphQLNonNull(queryType),
          resolve: source => source || {},
        }],
      ],
    ),
  })

  return queryType
}
