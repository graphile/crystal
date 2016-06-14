import { upperFirst } from 'lodash'
import createNodeQueryField from './createNodeQueryField.js'
import createNodesQueryField from './createNodesQueryField.js'
import createSingleQueryField from './createSingleQueryField.js'

/**
 * Creates the fields for a single table in the database. To see the type these
 * fields are used in and all the other fields exposed by a PostGraphQL query,
 * see `createQueryType`.
 *
 * @param {Table} table
 * @returns {GraphQLFieldConfig}
 */
const createTableQueryFields = table => {
  const fields = {}

  // `createSingleQueryField` may return `null`, so we must check for that.
  const nodeField = createNodeQueryField(table)
  if (nodeField) fields[table.getFieldName()] = nodeField

  for (const columns of table.getUniqueConstraints()) {
    const fieldName =
      `${table.getFieldName()}By${columns.map(column => upperFirst(column.getFieldName())).join('And')}`

    fields[fieldName] = createSingleQueryField(table, columns)
  }

  fields[`${table.getFieldName()}Nodes`] = createNodesQueryField(table)

  return fields
}

export default createTableQueryFields
