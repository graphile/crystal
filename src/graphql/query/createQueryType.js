import { ary, assign, camelCase } from 'lodash'
import { GraphQLObjectType } from 'graphql'
import createSingleQueryField from './createSingleQueryField.js'
import createListQueryField from './createListQueryField.js'

const createQueryType = schema =>
  new GraphQLObjectType({
    name: 'RootQuery',
    description: schema.description || 'The entry type for GraphQL queries.',
    fields:
      schema.tables
      .map(table => createQueryFields(table))
      .reduce(ary(assign, 2), {}),
  })

export default createQueryType

const createQueryFields = table => ({
  [camelCase(table.name)]: createSingleQueryField(table),
  [camelCase(`${table.name}_list`)]: createListQueryField(table),
})
