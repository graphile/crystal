import { fromPairs, upperFirst } from 'lodash'
import getColumnType from '../getColumnType.js'
import createTableType from '../createTableType.js'
import { inputClientMutationId, payloadClientMutationId } from './clientMutationId.js'

import {
  getNullableType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLInputObjectType,
} from 'graphql'

const getNonNullType = type => (type instanceof GraphQLNonNull ? type : new GraphQLNonNull(type))

/**
 * Creates a mutation which will update a single existing row.
 *
 * @param {Table} table
 * @returns {GraphQLFieldConfig}
 */
const createUpdateMutationField = table => ({
  type: createPayloadType(table),
  description: `Updates a single node of type ${table.getMarkdownTypeName()}.`,

  args: {
    input: {
      type: new GraphQLNonNull(createInputType(table)),
    },
  },

  resolve: resolveUpdate(table),
})

export default createUpdateMutationField

const createInputType = table =>
  new GraphQLInputObjectType({
    name: `Update${table.getTypeName()}Input`,
    description:
      `Locates the ${table.getMarkdownTypeName()} node to update and specifies some ` +
      'new field values. Primary key fields are required to be able to locate ' +
      'the node to update.',
    fields: {
      // We include primary key columns to select a single row to update.
      ...fromPairs(
        table.getPrimaryKeyColumns().map(column => [column.getFieldName(), {
          type: getNonNullType(getColumnType(column)),
          description: `Matches the ${column.getMarkdownFieldName()} field of the node.`,
        }])
      ),
      // We include all the other columns to actually allow users to update a value.
      ...fromPairs(
        table.columns.map(column => [`new${upperFirst(column.getFieldName())}`, {
          type: getNullableType(getColumnType(column)),
          description: `Updates the node’s ${column.getMarkdownFieldName()} field with this new value.`,
        }]),
      ),
      // And the client mutation id…
      clientMutationId: inputClientMutationId,
    },
  })

const createPayloadType = table =>
  new GraphQLObjectType({
    name: `Update${table.getTypeName()}Payload`,
    description: `Contains the ${table.getMarkdownTypeName()} node updated by the mutation.`,
    fields: {
      [table.getFieldName()]: {
        type: createTableType(table),
        description: `The updated ${table.getMarkdownTypeName()}.`,
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
        .map(column => [column.name, input[`new${upperFirst(column.getFieldName())}`]])
        .filter(([, value]) => value)
      ))
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
