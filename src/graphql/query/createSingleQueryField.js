import { fromPairs, camelCase, upperFirst } from 'lodash'
import { GraphQLNonNull } from 'graphql'
import createTableType from '../createTableType.js'
import getColumnType from '../getColumnType.js'
import resolveTableSingle from '../resolveTableSingle.js'

const getNonNullType = type => (type instanceof GraphQLNonNull ? type : new GraphQLNonNull(type))

/**
 * Creates an object field for selecting a single row of a table.
 *
 * @param {Table} table
 * @returns {GraphQLFieldConfig}
 */
const createSingleQueryField = table => {
  const primaryKeyColumns = table.getPrimaryKeyColumns()

  if (primaryKeyColumns.length === 0) {
    throw new Error(
      `PostgreSQL schema '${table.schema.name}' contains table '${table.name}' ` +
      'which does not have any primary key. To generate a GraphQL schema ' +
      'all tables must have a primary key.'
    )
  }

  return {
    type: createTableType(table),
    description: `Queries a single \`${upperFirst(camelCase(table.name))}\` with all of its primary keys.`,

    // Get arguments for this single row data fetcher. Uses only primary key
    // columns. All arguments are required as we want to be 100% certain we are
    // selecting one and only one row.
    args: fromPairs(
      table.getPrimaryKeyColumns()
      .map(column => [camelCase(column.name), {
        description: column.description,
        type: getNonNullType(getColumnType(column)),
      }])
    ),

    resolve: resolveTableSingle(
      table,
      primaryKeyColumns,
      (source, args) => primaryKeyColumns.map(({ name }) => args[camelCase(name)])
    ),
  }
}

export default createSingleQueryField
