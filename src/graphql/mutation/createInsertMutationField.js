import {
  getNullableType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLInputObjectType,
} from 'graphql'

import { fromPairs, identity, constant, camelCase } from 'lodash'
import { $$rowTable } from '../../symbols.js'
import SQLBuilder from '../../SQLBuilder.js'
import getColumnType from '../getColumnType.js'
import createTableType, { createForeignKeyField } from '../createTableType.js'
import { createTableEdgeType } from '../createConnectionType.js'
import { createTableOrderingEnum } from '../createConnectionArgs.js'
import getPayloadInterface from './getPayloadInterface.js'
import getPayloadFields from './getPayloadFields.js'
import { inputClientMutationId } from './clientMutationId.js'

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
    interfaces: [getPayloadInterface(table.schema)],

    fields: {
      [table.getFieldName()]: {
        type: createTableType(table),
        description: `The inserted ${table.getMarkdownTypeName()}.`,
        resolve: ({ output }) => output,
      },

      [`${table.getFieldName()}Edge`]: {
        type: createTableEdgeType(table),
        args: {
          orderBy: {
            type: createTableOrderingEnum(table),
            description:
              'The value by which the cursor is created so relay knows where to insert ' +
              'the edge in the connection.',
            defaultValue: (() => {
              const column = table.getPrimaryKeys()[0]
              if (column) return column.name
              return null
            })(),
          },
        },
        description: 'An edge to be inserted in a connection with help of the containing cursor.',
        resolve: ({ output }, { orderBy }) => ({
          cursor: orderBy && output[orderBy],
          node: output,
        }),
      },
      // Add foreign key field references.
      ...fromPairs(
        table.getForeignKeys().map(foreignKey => {
          const columnNames = foreignKey.nativeColumns.map(({ name }) => name)
          const name = `${foreignKey.foreignTable.name}_by_${columnNames.join('_and_')}`
          return [camelCase(name), createForeignKeyField(foreignKey)]
        })
      ),
      ...getPayloadFields(table.schema),
    },
  })

const resolveInsert = table => {
  // Note that using `DataLoader` here would not make very minor performance
  // improvements because mutations are executed in sequence, not parallel.
  //
  // A better solution for batch inserts is a custom batch insert field.
  const columns = table.getColumns()

  return async (source, args, { client }) => {
    // Get the input object value from the args.
    const { input } = args
    const { clientMutationId } = input

    const valueEntries = (
      columns
      .map(column => [column, input[column.getFieldName()]])
      .filter(([, value]) => value)
    )

    // Insert the thing making sure we return the newly inserted row.
    const { rows: [row] } = await client.queryAsync(
      new SQLBuilder()
      .add(`insert into ${table.getIdentifier()}`)
      .add(`(${valueEntries.map(([column]) => `"${column.name}"`).join(', ')})`)
      .add('values')
      .add(`(${valueEntries.map(constant('$')).join(', ')})`, valueEntries.map(([, value]) => value))
      .add('returning *')
    )

    const output = row ? (row[$$rowTable] = table, row) : null

    return {
      output,
      clientMutationId,
    }
  }
}
