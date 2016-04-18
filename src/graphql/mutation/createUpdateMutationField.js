import { fromPairs, camelCase, upperFirst } from 'lodash'
import getColumnType from '../getColumnType.js'
import createTableType from '../createTableType.js'
import { inputClientMutationId, payloadClientMutationId } from './clientMutationId.js'

import {
  getNullableType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLInputObjectType,
} from 'graphql'

const pascalCase = string => upperFirst(camelCase(string))
const getNonNullType = type => (type instanceof GraphQLNonNull ? type : new GraphQLNonNull(type))

/**
 * Creates a mutation which will update a single existing row.
 *
 * @param {Table} table
 * @returns {GraphQLFieldConfig}
 */
const createUpdateMutationField = table => ({
  type: createPayloadType(table),
  description: 'Updates a single node.',

  args: {
    input: {
      type: new GraphQLNonNull(createInputType(table)),
      description: 'The input specifying the node to update and .',
    },
  },

  resolve: resolveUpdate(table),
})

export default createUpdateMutationField

const createInputType = table =>
  new GraphQLInputObjectType({
    name: pascalCase(`update_${table.name}_input`),
    description:
      `Updates a \`${pascalCase(table.name)}\` in the backend. Use \`new*\` ` +
      'fields to update the node described by the other properties.',
    fields: {
      // We include primary key columns to select a single row to update.
      ...fromPairs(
        table.getPrimaryKeyColumns().map(column => [camelCase(column.name), {
          type: getNonNullType(getColumnType(column)),
          description: `Used to designate the single \`${pascalCase(table.name)}\` to update.`,
        }])
      ),
      // We include all the other columns to actually allow users to update a value.
      ...fromPairs(
        table.columns.map(column => [camelCase(`new_${column.name}`), {
          type: getNullableType(getColumnType(column)),
          description: `Updates the \`${camelCase(column.name)}\` field with the new value.`,
        }]),
      ),
      // And the client mutation id…
      clientMutationId: inputClientMutationId,
    },
  })

const createPayloadType = table =>
  new GraphQLObjectType({
    name: pascalCase(`update_${table.name}_payload`),
    description: `Returns the updated \`${pascalCase(table.name)}\`.`,
    fields: {
      [camelCase(table.name)]: {
        type: createTableType(table),
        description: `The updated \`${pascalCase(table.name)}\`.`,
        resolve: source => source[table.name],
      },
      clientMutationId: payloadClientMutationId,
    },
  })

const resolveUpdate = table => {
  // We use our SQL builder here instead of a prepared statement/data loader
  // solution because this query can get super dynamic.
  const tableSql = table.sql()
  const primaryKeyColumns = table.getPrimaryKeyColumns()

  return async (source, args, { client }) => {
    const { input } = args
    const { clientMutationId } = input

    const result = await client.queryAsync(
      tableSql
      .update(fromPairs(
        table.columns
        .map(column => [column.name, input[camelCase(`new_${column.name}`)]])
        .filter(([, value]) => value)
      ))
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
