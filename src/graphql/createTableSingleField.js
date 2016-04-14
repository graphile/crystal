import { fromPairs } from 'lodash'
import { camelCase, pascalCase } from 'change-case'
import { GraphQLNonNull } from 'graphql'
import createTableType from './createTableType.js'
import getColumnType from './getColumnType.js'

/**
 * Creates an object field for selecting a single row of a table.
 *
 * @param {Table} table
 * @returns {GraphQLFieldConfig}
 */
const createTableSingleField = table => {
  // Cache the primary key columns. Order matters so by putting it here we get
  // the bonus that it is the one source of ordering truth.
  const primaryKeyColumns = table.getPrimaryKeyColumns()

  const queryCondition =
    primaryKeyColumns
    .map((column, i) => `"${column.name}" = $${i + 1}`)
    .join(' and ')

  // Create our prepared query statement. By creating it here we get a
  // performance boost on repeat usage.
  const query = {
    name: `${table.schema.name}_${table.name}_single`,
    text: `select * from ${table.getIdentifier()} where ${queryCondition} limit 1`,
  }

  return {
    description: `Queries a single \`${pascalCase(table.name)}\` with all of its primary keys.`,

    // Get arguments for this single row data fetcher. Uses only primary key
    // columns. All arguments are required as we want to be 100% certain we are
    // selecting one and only one row.
    args: fromPairs(
      primaryKeyColumns
      .map(column => [camelCase(column.name), createRequiredColumnArg(column)])
    ),

    // Make sure the field returns our table type.
    type: createTableType(table),

    resolve: (source, args, { client }) =>
      // Send our prepared query to the client with some values.
      client.queryAsync({
        name: query.name,
        text: query.text,
        // For all of our primary keys we want to get its corresponding
        // argument (which was required to be included). Order is very
        // important.
        values: primaryKeyColumns.map(column => args[camelCase(column.name)]),
      })
      // Make sure we are only returning one row.
      .then(({ rows: [row] }) => row),
  }
}

export default createTableSingleField

const coerceToNonNullType = type => (type instanceof GraphQLNonNull ? type : new GraphQLNonNull(type))

export const createRequiredColumnArg = column => ({
  description: column.description,
  type: coerceToNonNullType(getColumnType(column)),
})
