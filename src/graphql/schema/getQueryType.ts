import { GraphQLObjectType, GraphQLFieldConfig, GraphQLNonNull } from 'graphql'
import { Inventory } from '../../interface'
import { buildObject, memoize1 } from '../utils'
import createNodeFieldEntry from './node/createNodeFieldEntry'
import getCollectionType from './collection/getCollectionType'
import createCollectionQueryFieldEntries from './collection/createCollectionQueryFieldEntries'
import BuildToken from './BuildToken'

// TODO: doc
const getQueryType = memoize1(createQueryType)

export default getQueryType

// TODO: doc
function createQueryType (buildToken: BuildToken): GraphQLObjectType<mixed> {
  const { inventory } = buildToken
  let queryType: GraphQLObjectType<mixed>

  queryType = new GraphQLObjectType({
    name: 'Query',
    description: 'The root query type which gives access points into the data universe.',
    fields: () => buildObject<GraphQLFieldConfig<mixed, mixed>>(
      [
        createNodeFieldEntry(buildToken),
      ],
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
