import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLInputObjectType,
} from 'graphql'

import { fromPairs, upperFirst } from 'lodash'
import { $$rowTable } from '../../symbols.js'
import SQLBuilder from '../../SQLBuilder.js'
import getType from '../getType.js'
import createTableType from '../createTableType.js'
import getPayloadInterface from './getPayloadInterface.js'
import getPayloadFields from './getPayloadFields.js'
import { inputClientMutationId } from './clientMutationId.js'

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
        table.getPrimaryKeys().map(column => [column.getFieldName(), {
          type: new GraphQLNonNull(getType(column.type)),
          description: `Matches the ${column.getMarkdownFieldName()} field of the node.`,
        }])
      ),
      // We include all the other columns to actually allow users to update a value.
      ...fromPairs(
        table.getColumns().map(column => [`new${upperFirst(column.getFieldName())}`, {
          type: getType(column.type),
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
    interfaces: [getPayloadInterface(table.schema)],
    fields: {
      [table.getFieldName()]: {
        type: createTableType(table),
        description: `The updated ${table.getMarkdownTypeName()}.`,
        resolve: source => source.output,
      },
      ...getPayloadFields(table.schema),
    },
  })

const resolveUpdate = table => {
  // We use our SQL builder here instead of a prepared statement/data loader
  // solution because this query can get super dynamic.
  const columns = table.getColumns()
  const primaryKeys = table.getPrimaryKeys()

  return async (source, args, { client }) => {
    const { input } = args
    const { clientMutationId } = input

    const setClauses = []
    const setValues = []
    const whereClauses = []
    const whereValues = []

    for (const column of columns) {
      const value = input[`new${upperFirst(column.getFieldName())}`]
      if (typeof value === 'undefined') continue
      setClauses.push(`"${column.name}" = $`)
      setValues.push(value)
    }

    for (const column of primaryKeys) {
      const value = input[column.getFieldName()]
      whereClauses.push(`${column.getIdentifier()} = $`)
      whereValues.push(value)
    }

    const { rows: [row] } = await client.queryAsync(
      new SQLBuilder()
      .add(`update ${table.getIdentifier()}`)
      .add('set')
      .add(setClauses.join(', '), setValues)
      .add('where')
      .add(whereClauses.join(' and '), whereValues)
      .add('returning *')
    )

    const output = row ? (row[$$rowTable] = table, row) : null

    return {
      output,
      clientMutationId,
    }
  }
}
