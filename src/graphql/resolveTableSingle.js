import { camelCase } from 'lodash'

const resolveTableSingleField = table => {
  // Cache the primary key columns. Order matters so by putting it here we get
  // the bonus that it is the one source of ordering truth.
  const primaryKeyColumns = table.getPrimaryKeyColumns()

  const queryCondition =
    primaryKeyColumns
    .map((column, i) => `"${column.name}" = $${i + 1}`)
    .join(' and ') || 'true'

  // Create our prepared query statement. By creating it here we get a
  // performance boost on repeat usage.
  const query = {
    name: `${table.schema.name}_${table.name}_single`,
    text: `select * from ${table.getIdentifier()} where ${queryCondition} limit 1`,
  }

  return async (source, args, { client }) => {
    // Send our prepared query to the client with some values.
    const result = await client.queryAsync({
      name: query.name,
      text: query.text,
      // For all of our primary keys we want to get its corresponding
      // argument (which was required to be included). Order is very
      // important.
      values: primaryKeyColumns.map(column => args[camelCase(column.name)]),
    })

    // Make sure we are only returning one row.
    return result.rows[0]
  }
}

export default resolveTableSingleField
