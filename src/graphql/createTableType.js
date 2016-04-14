import { memoize, fromPairs, camelCase, upperFirst } from 'lodash'
import { GraphQLObjectType } from 'graphql'
import getColumnType from './getColumnType.js'

/**
 * Creates the `GraphQLObjectType` for a table.
 *
 * This function is memoized because it will be called often for the same
 * table. Think that both the single and list fields need an instance of the
 * table type. Instead of passing the table type around as a parameter, it is
 * more functional to just memoize this function.
 *
 * @param {Client} client
 * @param {Table} table
 * @returns {GraphQLObjectType}
 */
const createTableType = memoize(table => {
  // If we have no fields, GraphQL will be sad. Make sure we have meaningful
  // fields by erroring if there are no columns.
  if (table.columns.length === 0) {
    throw new Error(
      `PostgreSQL schema '${table.schema.name}' contains table '${table.name}' ` +
      'which does not have any columns. To generate a GraphQL schema all ' +
      'tables must have at least one column.'
    )
  }

  return new GraphQLObjectType({
    // Creates a new type where the name is a PascalCase version of the table
    // name and the description is the associated comment in PostgreSQL.
    name: upperFirst(camelCase(table.name)),
    description: table.description,

    // Make sure all of our columns have a corresponding field.
    fields: fromPairs(
      table.columns
      .map(column => [camelCase(column.name), createColumnField(column)])
    ),
  })
})

export default createTableType

/**
 * Creates a field to be used with `GraphQLObjectType` from a column.
 *
 * @param {Column} column
 * @returns {GraphQLFieldConfig}
 */
const createColumnField = column => ({
  description: column.description,
  type: getColumnType(column),
  resolve: source => source[column.name],
})
