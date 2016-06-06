import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLID,
  GraphQLInputObjectType,
} from 'graphql'

import { fromPairs } from 'lodash'
import { $$rowTable } from '../../symbols.js'
import SQLBuilder from '../../SQLBuilder.js'
import getType from '../getType.js'
import { toID } from '../types.js'
import createTableType from '../createTableType.js'
import getPayloadInterface from './getPayloadInterface.js'
import getPayloadFields from './getPayloadFields.js'
import { inputClientMutationId } from './clientMutationId.js'

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
        table.getPrimaryKeys().map(column => [column.getFieldName(), {
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
    interfaces: [getPayloadInterface(table.schema)],
    fields: {
      [table.getFieldName()]: {
        type: createTableType(table),
        description: `The deleted ${table.getMarkdownTypeName()}.`,
        resolve: source => source.output,
      },
      [`deleted${table.getTypeName()}Id`]: {
        type: GraphQLID,
        description: `The deleted ${table.getMarkdownTypeName()} id.`,
        resolve: resolveDeletedFieldId(table),
      },
      ...getPayloadFields(table.schema),
    },
  })

// Resolves the id from the primary keys of the deleted resource
const resolveDeletedFieldId = table => ({ output }) => {
  if (!output)
    return null

  const primaryKeys = table.getPrimaryKeys()
  const deletedIds = primaryKeys.map(pkey => output[pkey.name])
  return toID(table.name, deletedIds)
}

const resolveDelete = table => {
  const primaryKeys = table.getPrimaryKeys()

  return async (source, args, { client }) => {
    const { input } = args
    const { clientMutationId } = input

    const sql = new SQLBuilder().add(`delete from ${table.getIdentifier()} where`)

    for (const column of primaryKeys) {
      const value = input[column.getFieldName()]
      sql.add(`${column.getIdentifier()} = $ and`, [value])
    }

    sql.add('true returning *')

    const { rows: [row] } = await client.queryAsync(sql)
    const output = row ? (row[$$rowTable] = table, row) : null

    return {
      output,
      clientMutationId,
    }
  }
}
