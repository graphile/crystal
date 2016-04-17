import { fromPairs, camelCase, upperFirst, identity } from 'lodash'
import createTableType from '../createTableType.js'
import getColumnType from '../getColumnType.js'

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
  description: `Creates a new node of type \`${pascalCase(table.name)}\`.`,

  args: {
    input: {
      type: new GraphQLNonNull(createInputType(table)),
      description: 'The new node to be created.',
    },
  },

  resolve: resolveCreate(table),
})

export default createInsertMutationField

const createInputType = table =>
  new GraphQLInputObjectType({
    name: pascalCase(`insert_${table.name}_input`),
    description: `Inserts a \`${pascalCase(table.name)}\` into the backend.`,
    fields: {
      ...fromPairs(
        table.columns
        .map(column => [camelCase(column.name), {
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
      ' mutation.',

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

const resolveCreate = table => {
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
        ...table.columns
        .map(({ name }) => {
          // Get the value for this column, if it does not exist, we will not try
          // inserting it. Rather letting the database choose how to handle the
          // null/default.
          const value = input[camelCase(name)]
          if (!value) return null
          return tableSql[name].value(value)
        })
        .filter(node => node != null)
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
