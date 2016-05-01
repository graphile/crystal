import { fromPairs, ary, assign, upperFirst, camelCase } from 'lodash'
import { GraphQLObjectType } from 'graphql'
import createInsertMutationField from './createInsertMutationField.js'
import createUpdateMutationField from './createUpdateMutationField.js'
import createDeleteMutationField from './createDeleteMutationField.js'
import createProcedureMutationField from './createProcedureMutationField.js'

const createMutationType = schema =>
  new GraphQLObjectType({
    name: 'Mutation',
    description: 'The entry type for GraphQL mutations.',
    fields: {
      // Add fields for procedures.
      ...fromPairs(
        schema
        .getProcedures()
        .filter(({ isMutation }) => isMutation)
        .map(procedure => [procedure.getFieldName(), createProcedureMutationField(procedure)])
      ),
      // Add standard fields for tables.
      ...(
        schema
        .getTables()
        .map(table => createMutationFields(table))
        .reduce(ary(assign, 2), {})
      ),
    },
  })

export default createMutationType

const createMutationFields = table => ({
  [`insert${upperFirst(camelCase(table.name))}`]: createInsertMutationField(table),
  [`update${upperFirst(camelCase(table.name))}`]: createUpdateMutationField(table),
  [`delete${upperFirst(camelCase(table.name))}`]: createDeleteMutationField(table),
})
