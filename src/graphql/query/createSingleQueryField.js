import { fromPairs } from 'lodash'
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
    description: `Queries a single ${table.getMarkdownTypeName()} using its primary keys.`,

    // Get arguments for this single row data fetcher. Uses only primary key
    // columns. All arguments are required as we want to be 100% certain we are
    // selecting one and only one row.
    args: fromPairs(
      table.getPrimaryKeyColumns()
      .map(column => [column.getFieldName(), {
        type: getNonNullType(getColumnType(column)),
        description: `Matches the ${column.getMarkdownFieldName()} field of the node.`,
      }])
    ),

    resolve: resolveTableSingle(
      table,
      primaryKeyColumns,
      (source, args) => primaryKeyColumns.map(column => args[column.getFieldName()])
    ),
  }
}

export default createSingleQueryField
