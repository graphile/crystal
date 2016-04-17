import { fromPairs, camelCase, upperFirst, chain } from 'lodash'
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
const coerceNonNull = type => (type instanceof GraphQLNonNull ? type : new GraphQLNonNull(type))

const createUpdateMutationField = table => ({
  type: createPayloadType(table),
  description: 'Updates a node.',

  args: {
    input: {
      type: new GraphQLNonNull(createInputType(table)),
      description: 'The input for updating the node.',
    },
  },

  resolve: resolveUpdate(table),
})

export default createUpdateMutationField

const createInputType = table =>
  new GraphQLInputObjectType({
    name: pascalCase(`update_${table.name}_input`),
    description:
      `Updates a \`${pascalCase(table.name)}\` in the backend. Use \`new*\` ` +
      'fields to update the node described by the other properties.',
    fields: {
      // We include primary key columns to select a single row to update.
      ...fromPairs(
        table.getPrimaryKeyColumns().map(column => [camelCase(column.name), {
          type: coerceNonNull(getColumnType(column)),
          description: `Used to designate the single \`${pascalCase(table.name)}\` to update.`,
        }])
      ),
      // We include all the other columns to actually allow users to update a value.
      ...fromPairs(
        table.columns.map(column => [camelCase(`new_${column.name}`), {
          type: getNullableType(getColumnType(column)),
          description: `Updates the \`${camelCase(column.name)}\` field with the new value.`,
        }]),
      ),
      // And the client mutation id…
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
    name: pascalCase(`update_${table.name}_payload`),
    description: `Returns the newly updated \`${pascalCase(table.name)}\` after the mutation.`,
    fields: {
      [camelCase(table.name)]: {
        type: createTableType(table),
        description: `The newly updated \`${pascalCase(table.name)}\`.`,
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
      .update(
        // Start a chain on our input object so we can map/filter. We can’t do
        // that for normal objects :|
        //
        // With this chain our goal is to get all of the `new*` fields and
        // create an object of key/value pairs where the key is the *actual*
        // column name.
        chain(table.columns)
        .map(column => {
          const value = input[camelCase(`new_${column.name}`)]
          if (!value) return null
          return [column.name, value]
        })
        .filter(pair => pair != null)
        .fromPairs()
        .value()
      )
      .where(
        // Here we want to create an object using the primary key stuffs to
        // filter against.
        chain(primaryKeyColumns)
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

    return {
      [table.name]: result.rows[0],
      clientMutationId,
    }
  }
}
