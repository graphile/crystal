import { ary, assign, upperFirst, camelCase } from 'lodash'
import { GraphQLObjectType } from 'graphql'
import createInsertMutationField from './createInsertMutationField.js'
import createUpdateMutationField from './createUpdateMutationField.js'
import createDeleteMutationField from './createDeleteMutationField.js'

const createMutationType = schema =>
  new GraphQLObjectType({
    name: 'Mutation',
    description: 'The entry type for GraphQL mutations.',
    fields:
      schema.tables
      .map(table => createMutationFields(table))
      .reduce(ary(assign, 2), {}),
  })

export default createMutationType

const createMutationFields = table => ({
  [`insert${upperFirst(camelCase(table.name))}`]: createInsertMutationField(table),
  [`update${upperFirst(camelCase(table.name))}`]: createUpdateMutationField(table),
  [`delete${upperFirst(camelCase(table.name))}`]: createDeleteMutationField(table),
})
