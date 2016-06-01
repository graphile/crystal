import { GraphQLObjectType } from 'graphql'
import createViewerField from '../createViewerField.js'
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
    name: 'Query',
    description: schema.description || 'The entry type for GraphQL queries.',
    fields: {
      ...createQueryFields(schema),
      viewer: createViewerField(schema),
    },
  })

export default createQueryType
