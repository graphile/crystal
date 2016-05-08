import { fromPairs, identity } from 'lodash'
import { $$rowTable } from '../../symbols.js'
import getTableSql from '../../getTableSql.js'
import getColumnType from '../getColumnType.js'
import createTableType from '../createTableType.js'
import { inputClientMutationId, payloadClientMutationId } from './clientMutationId.js'

import {
  getNullableType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLInputObjectType,
} from 'graphql'

/**
 * Creates a mutation which will create a new row.
 *
 * @param {Table} table
 * @returns {GraphQLFieldConfig}
 */
const createInsertMutationField = table => ({
  type: createPayloadType(table),
  description: `Creates a new node of the ${table.getMarkdownTypeName()} type.`,

  args: {
    input: {
      type: new GraphQLNonNull(createInputType(table)),
    },
  },

  resolve: resolveInsert(table),
})

export default createInsertMutationField

const createInputType = table =>
  new GraphQLInputObjectType({
    name: `Insert${table.getTypeName()}Input`,
    description: `The ${table.getMarkdownTypeName()} to insert.`,
    fields: {
      ...fromPairs(
        table.getColumns().map(column => [column.getFieldName(), {
          type: (column.hasDefault ? getNullableType : identity)(getColumnType(column)),
          description: column.description,
        }]),
      ),
      clientMutationId: inputClientMutationId,
    },
  })

const createPayloadType = table =>
  new GraphQLObjectType({
    name: `Insert${table.getTypeName()}Payload`,
    description: `Contains the ${table.getMarkdownTypeName()} node inserted by the mutation.`,

    fields: {
      [table.getFieldName()]: {
        type: createTableType(table),
        description: `The inserted ${table.getMarkdownTypeName()}.`,
        resolve: source => source.output,
      },
      clientMutationId: payloadClientMutationId,
    },
  })

const resolveInsert = table => {
  // Note that using `DataLoader` here would not make very minor performance
  // improvements because mutations are executed in sequence, not parallel.
  //
  // A better solution for batch inserts is a custom batch insert field.
  const columns = table.getColumns()
  const tableSql = getTableSql(table)

  return async (source, args, { client }) => {
    // Get the input object value from the args.
    const { input } = args
    const { clientMutationId } = input
    // Insert the thing making sure we return the newly inserted row.
    const { rows: [row] } = await client.queryAsync(
      tableSql
      .insert(fromPairs(
        columns
        .map(column => [column.name, input[column.getFieldName()]])
        .filter(([, value]) => value)
      ))
      .returning(tableSql.star())
      .toQuery()
    )

    // Return the first (and likely only) row.
    return {
      output: row ? (row[$$rowTable] = table, row) : null,
      clientMutationId,
    }
  }
}
