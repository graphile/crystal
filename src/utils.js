import { memoize } from 'lodash'
import sql from 'sql'

/**
 * Returns a table type from the `sql` module based off of this table. This
 * is so we can use the superior capabilities of the `sql` module to
 * construct SQL queries with our table type.
 *
 * @param {Table} table
 * @returns {SqlTable}
 */
export const getTableSql = memoize(table => sql.define({
  schema: table.schema.name,
  name: table.name,
  columns: table.columns.map(({ name }) => name),
}))
