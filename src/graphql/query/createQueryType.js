import { ary, assign } from 'lodash'
import { GraphQLObjectType } from 'graphql'
import createNodeQueryField from './createNodeQueryField.js'
import createQueryFields from './createQueryFields.js'

/**
 * Creates the Query type for the entire schema. To see the fields created for
 * singular tables refer to `createQueryFields`.
 *
 * @param {Schema} schema
 * @returns {GraphQLObjectType}
 */
const createQueryType = schema =>
  new GraphQLObjectType({
    name: 'RootQuery',
    description: schema.description || 'The entry type for GraphQL queries.',
    fields: {
      node: createNodeQueryField(schema),
      ...(
        schema.tables
        .map(table => createQueryFields(table))
        .reduce(ary(assign, 2), {})
      ),
    },
  })

export default createQueryType
