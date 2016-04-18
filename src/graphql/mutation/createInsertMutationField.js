import { fromPairs, camelCase, upperFirst, identity } from 'lodash'
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

/**
 * Creates a mutation which will create a new row.
 *
 * @param {Table} table
 * @returns {GraphQLFieldConfig}
 */
const createInsertMutationField = table => ({
  type: createPayloadType(table),
  description: `Creates a new node of the \`${pascalCase(table.name)}\` type.`,

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
    name: pascalCase(`insert_${table.name}_input`),
    description: `The \`${pascalCase(table.name)}\` to insert.`,
    fields: {
      ...fromPairs(
        table.columns.map(column => [camelCase(column.name), {
          type: (column.hasDefault ? getNullableType : identity)(getColumnType(column)),
          description: column.description,
        }]),
      ),
      clientMutationId: inputClientMutationId,
    },
  })

const createPayloadType = table =>
  new GraphQLObjectType({
    name: pascalCase(`insert_${table.name}_payload`),
    description: `Contains the \`${pascalCase(table.name)}\` node inserted by the mutation.`,

    fields: {
      [camelCase(table.name)]: {
        type: createTableType(table),
        description: `The inserted \`${pascalCase(table.name)}\`.`,
        resolve: source => source[table.name],
      },
      clientMutationId: payloadClientMutationId,
    },
  })

const resolveInsert = table => {
  // Note that using `DataLoader` here would not make very minor performance
  // improvements because mutations are executed in sequence, not parallel.
  //
  // A better solution for batch inserts is a custom batch insert field.
  const tableSql = table.sql()

  return async (source, args, { client }) => {
    // Get the input object value from the args.
    const { input } = args
    const { clientMutationId } = input
    // Insert the thing making sure we return the newly inserted row.
    const result = await client.queryAsync(
      tableSql
      .insert(fromPairs(
        table.columns
        .map(column => [column.name, input[camelCase(column.name)]])
        .filter(([, value]) => value)
      ))
      .returning(tableSql.star())
      .toQuery()
    )

    // Return the first (and likely only) row.
    return {
      [table.name]: result.rows[0],
      clientMutationId,
    }
  }
}
