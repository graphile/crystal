/**
 * Creates a resolver for querying a single value.
 *
 * The last parameter, `getColumnValues` is a function which gets `source` and
 * `args` and returns values for each of the second argument’s columns.
 *
 * @param {Table} table - The table we will be selecting from.
 * @param {Column[]} columns - The columns which will be filtered against.
 * @param {Function} getColumnValues - A function to get values for columns.
 * @returns {Function} - A function to be fed into `resolve`.
 */
const resolveTableSingle = (table, columns, getColumnValues) => {
  // Create the query condition. If there are no columns, the condition will
  // just be `true`.
  const queryCondition =
    columns
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
      values: getColumnValues(source, args),
    })

    // Make sure we are only returning one row.
    return result.rows[0]
  }
}

export default resolveTableSingle
