import { chain, fromPairs, camelCase, upperFirst, identity } from 'lodash'
import getColumnType from '../getColumnType.js'
import createTableType from '../createTableType.js'

import {
  getNullableType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLString,
} from 'graphql'

const pascalCase = string => upperFirst(camelCase(string))

/**
 * Creates a field which will create a new row.
 *
 * @param {Table} table
 * @returns {GraphQLFieldConfig}
 */
const createInsertMutationField = table => ({
  type: createPayloadType(table),
  description: 'Inserts a new node.',

  args: {
    input: {
      type: new GraphQLNonNull(createInputType(table)),
      description: 'The input for insering the new node.',
    },
  },

  resolve: resolveInsert(table),
})

export default createInsertMutationField

const createInputType = table =>
  new GraphQLInputObjectType({
    name: pascalCase(`insert_${table.name}_input`),
    description: `Inserts a \`${pascalCase(table.name)}\` into the backend.`,
    fields: {
      ...fromPairs(
        table.columns.map(column => [camelCase(column.name), {
          type: (column.hasDefault ? getNullableType : identity)(getColumnType(column)),
          description: column.description,
        }]),
      ),
      clientMutationId: {
        type: GraphQLString,
        description:
          'An optional mutation ID for client’s to use in tracking mutations. ' +
          'This field has no meaning to the server and is simply returned as ' +
          'is.',
      },
    },
  })

const createPayloadType = table =>
  new GraphQLObjectType({
    name: pascalCase(`insert_${table.name}_payload`),
    description:
      `Returns the full newly inserted \`${pascalCase(table.name)}\` after the ` +
      'mutation.',

    fields: {
      [camelCase(table.name)]: {
        type: createTableType(table),
        description: `The newly inserted \`${pascalCase(table.name)}\`.`,
        resolve: source => source[table.name],
      },

      clientMutationId: {
        type: GraphQLString,
        description:
          'If the mutation was passed a `clientMutationId` this is the exact ' +
          'same value.',
        resolve: ({ clientMutationId }) => clientMutationId,
      },
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
      .insert(
        // With this chain our goal is to get an object to be sent to the
        // database and inserted.
        chain(table.columns)
        .map(column => {
          const value = input[camelCase(column.name)]
          if (!value) return null
          return [column.name, value]
        })
        .filter(pair => pair != null)
        .fromPairs()
        .value()
      )
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
