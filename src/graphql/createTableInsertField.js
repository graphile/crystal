import { fromPairs, camelCase, upperFirst, identity } from 'lodash'
import { getNullableType, GraphQLNonNull, GraphQLInputObjectType } from 'graphql'
import createTableType from './createTableType.js'
import getColumnType from './getColumnType.js'

/**
 * Creates a field which will create a new row.
 *
 * @param {Table} table
 * @returns {GraphQLFieldConfig}
 */
const createTableInsertField = table => ({
  type: createTableType(table),
  description: `Creates a new node of type \`${upperFirst(camelCase(table.name))}\`.`,

  args: {
    [camelCase(table.name)]: {
      type: new GraphQLNonNull(createTableInputType(table)),
      description: 'The new node to be created.',
    },
  },

  resolve: resolveCreate(table),
})

export default createTableInsertField

/**
 * Similar to `createTableType` except it exclusively creates an input type.
 *
 * @param {Table} table
 * @returns {GraphQLInputObjectType}
 */
const createTableInputType = table =>
  new GraphQLInputObjectType({
    name: upperFirst(camelCase(`${table.name}_input`)),
    description: table.description,
    fields: fromPairs(
      table.columns
      .map(column => [camelCase(column.name), {
        type: (column.hasDefault ? getNullableType : identity)(getColumnType(column)),
        description: column.description,
      }]),
    ),
  })

const resolveCreate = table => {
  // Note that using `DataLoader` here would not make very minor performance
  // improvements because mutations are executed in sequence, not parallel.
  //
  // A better solution for batch inserts is a custom batch insert field.
  const tableSql = table.sql()

  return async (source, args, { client }) => {
    // Get the input object value from the args.
    const object = args[camelCase(table.name)]
    // Insert the thing making sure we return the newly inserted row.
    const result = await client.queryAsync(
      tableSql
      .insert(
        ...table.columns
        .map(({ name }) => {
          // Get the value for this column, if it does not exist, we will not try
          // inserting it. Rather letting the database choose how to handle the
          // null/default.
          const value = object[camelCase(name)]
          if (!value) return null
          return tableSql[name].value(value)
        })
        .filter(node => node != null)
      )
      .returning(tableSql.star())
      .toQuery()
    )
    // Return the first (and likely only) row.
    return result.rows[0]
  }
}
