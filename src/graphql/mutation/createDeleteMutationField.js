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
  description: `Deletes a single node of type \`${pascalCase(table.name)}\`.`,

  args: {
    input: {
      type: new GraphQLNonNull(createInputType(table)),
    },
  },

  resolve: resolveDelete(table),
})

export default createDeleteMutationField

const createInputType = table =>
  new GraphQLInputObjectType({
    name: pascalCase(`delete_${table.name}_input`),
    description:
      `Locates the single \`${pascalCase(table.name)}\` node to delete using ` +
      'its required primary key fields.',
    fields: {
      ...fromPairs(
        table.getPrimaryKeyColumns().map(column => [camelCase(column.name), {
          type: getNonNullType(getColumnType(column)),
          description: `Matches the \`${camelCase(column.name)}\` field of the node.`,
        }])
      ),
      clientMutationId: inputClientMutationId,
    },
  })

const createPayloadType = table =>
  new GraphQLObjectType({
    name: pascalCase(`delete_${table.name}_payload`),
    description: `Contains the \`${pascalCase(table.name)}\` node deleted by the mutation.`,
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
