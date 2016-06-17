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
        .filter(procedure => !procedure.hasTableArg())
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

const createMutationFields = table => {
  const mutations = {}

  if (table.isInsertable)
    mutations[`insert${upperFirst(camelCase(table.name))}`] = createInsertMutationField(table)
  if (table.isUpdatable)
    mutations[`update${upperFirst(camelCase(table.name))}`] = createUpdateMutationField(table)
  if (table.isDeletable)
    mutations[`delete${upperFirst(camelCase(table.name))}`] = createDeleteMutationField(table)

  return mutations
}
