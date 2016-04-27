import createSingleQueryField from './createSingleQueryField.js'
import createListQueryField from './createListQueryField.js'

/**
 * Creates the fields for a single table in the database. To see the type these
 * fields are used in and all the other fields exposed by a PostGraphQL query,
 * see `createQueryType`.
 *
 * @param {Table} table
 * @returns {GraphQLFieldConfig}
 */
const createQueryFields = table => {
  const fields = {}

  const singleField = createSingleQueryField(table)
  const listField = createListQueryField(table)

  // `createSingleQueryField` and others may return `null`, so we must check
  // for that.
  if (singleField) fields[table.getFieldName()] = singleField
  if (listField) fields[`${table.getFieldName()}Nodes`] = listField

  return fields
}

export default createQueryFields
