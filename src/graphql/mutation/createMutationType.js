import { ary, assign, upperFirst } from 'lodash'
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
  [`insert${upperFirst(table.getFieldName())}`]: createInsertMutationField(table),
  [`update${upperFirst(table.getFieldName())}`]: createUpdateMutationField(table),
  [`delete${upperFirst(table.getFieldName())}`]: createDeleteMutationField(table),
})
