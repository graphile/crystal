import { ary, assign, camelCase } from 'lodash'
import { GraphQLObjectType } from 'graphql'
import createInsertMutationField from './createInsertMutationField.js'

const createMutationType = schema =>
  new GraphQLObjectType({
    name: 'RootMutation',
    description: 'The entry type for GraphQL mutations.',
    fields:
      schema.tables
      .map(table => createMutationFields(table))
      .reduce(ary(assign, 2), {}),
  })

export default createMutationType

const createMutationFields = table => ({
  [camelCase(`insert_${table.name}`)]: createInsertMutationField(table),
})
