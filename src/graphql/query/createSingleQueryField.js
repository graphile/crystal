import { GraphQLNonNull } from 'graphql'
import { IDType } from '../Types.js'
import createTableType from '../createTableType.js'
import resolveTableSingle from '../resolveTableSingle.js'

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

    args: {
      id: {
        type: new GraphQLNonNull(IDType),
        description: `The \`ID\` of the ${table.getMarkdownTypeName()} node.`,
      },
    },

    resolve: resolveTableSingle(
      table,
      primaryKeyColumns,
      (source, { id: { tableName, values } }) => {
        if (tableName !== table.name) return null
        return values
      }
    ),
  }
}

export default createSingleQueryField
