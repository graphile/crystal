import { ary, assign, camelCase } from 'lodash'
import { GraphQLObjectType } from 'graphql'
import createInsertMutationField from './createInsertMutationField.js'
import createUpdateMutationField from './createUpdateMutationField.js'
import createDeleteMutationField from './createDeleteMutationField.js'

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
  [camelCase(`update_${table.name}`)]: createUpdateMutationField(table),
  [camelCase(`delete_${table.name}`)]: createDeleteMutationField(table),
})
