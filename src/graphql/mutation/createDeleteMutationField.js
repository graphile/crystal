import { fromPairs } from 'lodash'
import getColumnType from '../getColumnType.js'
import createTableType from '../createTableType.js'
import { inputClientMutationId, payloadClientMutationId } from './clientMutationId.js'

import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLInputObjectType,
} from 'graphql'

const getNonNullType = type => (type instanceof GraphQLNonNull ? type : new GraphQLNonNull(type))

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
        table.getPrimaryKeyColumns().map(column => [column.getFieldName(), {
          type: getNonNullType(getColumnType(column)),
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
        .map(column => [column.name, input[column.getFieldName()]])
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
