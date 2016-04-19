import { ary, assign } from 'lodash'
import { GraphQLObjectType } from 'graphql'
import createNodeQueryField from './createNodeQueryField.js'
import createSingleQueryField from './createSingleQueryField.js'
import createListQueryField from './createListQueryField.js'

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

const createQueryFields = table => ({
  [table.getFieldName()]: createSingleQueryField(table),
  [`${table.getFieldName()}Nodes`]: createListQueryField(table),
})
