// Inputs:
// - rawCondition: the string provided in the GraphQL `condition` field
// - sql: a set of SQL utilities to be used for output generation
// - context:
//   - initialTable: the name of the table where the filter should start
//   - initialSchema: schema for the `initialTable`
// Output:
// - conditionSql: SQL to be added to the `where` clause
// - fromSql (optional): SQL to replace the default `from` clause
// - groupBySql (optional): SQL to replace the default `group by` clause
module.exports = (rawCondition, sql, context) => {
  const { initialTable, initialSchema } = context
  const condition = JSON.parse(rawCondition)  // may throw
  const where = []
  const from = [{ table: initialTable, schema: initialSchema }]
  if (!condition) return { conditionSql: sql.query`true` }
  Object.keys(condition).forEach(attr => {
    const wherePartial = []
    processCondition(sql, context, initialTable, attr, condition[attr], from, wherePartial)
    where.push(sql.join(wherePartial, ' and '))
  })
  const conditionSql = where && where.length ? sql.query`(${sql.join(where, ' and ')})` : sql.query`true`
  const out = { conditionSql }
  if (from.length > 1) {
    out.fromSql = sql.join(from.map(({ table, schema }) =>
      sql.query`${sql.identifier(schema, table)} as ${sql.identifier(Symbol.for(table))}`
    ), ', ')
    out.groupBySql = sql.query`group by ${sql.identifier(Symbol.for(initialTable), 'id')}`
  }
  return out
}

// Recursive
const processCondition = (sql, context, curTable, attr, val, from, where) => {
  const tokens = attr.split(':')

  // Process attribute in the current table, e.g. `first_name`
  if (tokens.length === 1) {
    where.push(sqlAttrComparison(sql, curTable, attr, val))
    return
  }

  // Process attribute in a related table, with the FK in the current table (N-->1)
  // e.g. `person:author_id` (from post)
  // ... or in the related table (1-->N)
  // e.g. `post:author_id:rev` (from post)
  const [relatedTable, fk] = tokens
  if (from.find(({ table }) => table === relatedTable) == null) {
    from.push({ table: relatedTable, schema: context.initialSchema })
  }
  if (tokens.length === 2) {
    where.push(sql.query`(
      ${sql.identifier(Symbol.for(relatedTable), 'id')} =
      ${sql.identifier(Symbol.for(curTable), fk)}
    )`)
  } else if (tokens.length === 3 && tokens[2] === 'rev') {
    where.push(sql.query`(
      ${sql.identifier(Symbol.for(relatedTable), fk)} =
      ${sql.identifier(Symbol.for(curTable), 'id')}
    )`)
  } else throw new Error(`Syntax error in FK description: ${attr}`)
  Object.keys(val).forEach(subAttr =>
    processCondition(sql, context, relatedTable, subAttr, val[subAttr], from, where)
  )
}

const sqlAttrComparison = (sql, table, attr, value) => {
  const tableSymbol = Symbol.for(table)
  if (value == null) return sql.query`(${sql.identifier(tableSymbol, attr)} IS NULL)`
  if (value === true || value === false) {
    return sql.query`(${sql.identifier(tableSymbol, attr)} = ${sql.value(value)})`
  }
  return sql.query`(
    ${sql.identifier(tableSymbol, attr)} ILIKE '%' || unaccent(${sql.value(value)}) || '%'
  )`
}
