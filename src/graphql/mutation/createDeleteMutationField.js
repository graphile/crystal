import { fromPairs, camelCase, upperFirst } from 'lodash'
import getColumnType from '../getColumnType.js'
import createTableType from '../createTableType.js'
import { inputClientMutationId, payloadClientMutationId } from './clientMutationId.js'

import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLInputObjectType,
} from 'graphql'

const pascalCase = string => upperFirst(camelCase(string))
const getNonNullType = type => (type instanceof GraphQLNonNull ? type : new GraphQLNonNull(type))

/**
 * Creates a mutation which will delete a single existing row.
 *
 * @param {Table} table
 * @returns {GraphQLFieldConfig}
 */
const createDeleteMutationField = table => ({
  type: createPayloadType(table),
  description: 'Deletes a single node',

  args: {
    input: {
      type: new GraphQLNonNull(createInputType(table)),
      description: 'The input specifying the node to delete.',
    },
  },

  resolve: resolveDelete(table),
})

export default createDeleteMutationField

const createInputType = table =>
  new GraphQLInputObjectType({
    name: pascalCase(`delete_${table.name}_input`),
    description: `Deletes a single \`${pascalCase(table.name)}\` from the backend.`,
    fields: {
      ...fromPairs(
        table.getPrimaryKeyColumns().map(column => [camelCase(column.name), {
          type: getNonNullType(getColumnType(column)),
          description: `Used to designate the single \`${pascalCase(table.name)}\` to update.`,
        }])
      ),
      clientMutationId: inputClientMutationId,
    },
  })

const createPayloadType = table =>
  new GraphQLObjectType({
    name: pascalCase(`delete_${table.name}_payload`),
    description: `Returns the deleted \`${pascalCase(table.name)}\`.`,
    fields: {
      [camelCase(table.name)]: {
        type: createTableType(table),
        description: `The deleted \`${pascalCase(table.name)}\`.`,
        resolve: source => source[table.name],
      },
      clientMutationId: payloadClientMutationId,
    },
  })

const resolveDelete = table => {
  const tableSql = table.sql()
  const primaryKeyColumns = table.getPrimaryKeyColumns()

  return async (source, args, { client }) => {
    const { input } = args
    const { clientMutationId } = input

    const result = await client.queryAsync(
      tableSql
      .delete()
      .where(fromPairs(
        primaryKeyColumns
        .map(column => [column.name, input[camelCase(column.name)]])
        .filter(([, value]) => value)
      ))
      .returning(tableSql.star())
      .toQuery()
    )

    return {
      [table.name]: result.rows[0],
      clientMutationId,
    }
  }
}
