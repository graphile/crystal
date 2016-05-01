import { fromPairs, assign } from 'lodash'
import getTableSql from '../../getTableSql.js'
import getType from '../getType.js'
import createTableType from '../createTableType.js'
import { inputClientMutationId, payloadClientMutationId } from './clientMutationId.js'

import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLInputObjectType,
} from 'graphql'

/**
 * Creates a mutation which will delete a single existing row.
 *
 * @param {Table} table
 * @returns {GraphQLFieldConfig}
 */
const createDeleteMutationField = table => ({
  type: createPayloadType(table),
  description: `Deletes a single node of type ${table.getMarkdownTypeName()}.`,

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
    name: `Delete${table.getTypeName()}Input`,
    description:
      `Locates the single ${table.getMarkdownTypeName()} node to delete using ` +
      'its required primary key fields.',
    fields: {
      ...fromPairs(
        table.primaryKeys.map(column => [column.getFieldName(), {
          type: new GraphQLNonNull(getType(column.type)),
          description: `Matches the ${column.getMarkdownFieldName()} field of the node.`,
        }])
      ),
      clientMutationId: inputClientMutationId,
    },
  })

const createPayloadType = table =>
  new GraphQLObjectType({
    name: `Delete${table.getTypeName()}Payload`,
    description: `Contains the ${table.getMarkdownTypeName()} node deleted by the mutation.`,
    fields: {
      [table.getFieldName()]: {
        type: createTableType(table),
        description: `The deleted ${table.getMarkdownTypeName()}.`,
        resolve: source => source[table.name],
      },
      clientMutationId: payloadClientMutationId,
    },
  })

const resolveDelete = table => {
  const tableSql = getTableSql(table)
  const primaryKeyColumns = table.primaryKeys

  return async (source, args, { client }) => {
    const { input } = args
    const { clientMutationId } = input

    const { rows: [row] } = await client.queryAsync(
      tableSql
      .delete()
      .where(fromPairs(
        primaryKeyColumns
        .map(column => [column.name, input[column.getFieldName()]])
        .filter(([, value]) => value)
      ))
      .returning(tableSql.star())
      .toQuery()
    )

    return {
      [table.name]: row ? assign(row, { table }) : null,
      clientMutationId,
    }
  }
}
