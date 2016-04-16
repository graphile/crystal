const resolveForeignKey = ({ foreignColumns, foreignTable, nativeColumns }) => {
  const queryCondition =
    foreignColumns
    .map((column, i) => `"${column.name}" = $${i + 1}`)
    .join(' and ') || 'true'

  // Create our prepared query.
  const query = {
    name: `${foreignTable.schema.name}_${foreignTable.name}_foreign_key`,
    text: `select * from ${foreignTable.getIdentifier()} where ${queryCondition} limit 1`,
  }

  return async (source, args, { client }) => {
    // Send our prepared statement with values from the source object.
    const result = await client.queryAsync({
      name: query.name,
      text: query.text,
      values: nativeColumns.map(column => source[column.name]),
    })
    return result.rows[0]
  }
}

export default resolveForeignKey
