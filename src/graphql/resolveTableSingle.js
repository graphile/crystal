import { memoize, every } from 'lodash'
import DataLoader from 'dataloader'
import { $$rowTable } from '../symbols.js'

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
  if (columns.length === 0)
    throw new Error('To resolve a single row, some columns must be used.')

  const primaryKeyMatch =
    `(${columns.map(column =>
      `"${column.table.schema.name}"."${column.table.name}"."${column.name}"`
    ).join(' || \',\' || ')})`

  // We aren’t using the `sql` module here because the most efficient way to
  // run this query is with the `= any (…)` field. This feature is PostgreSQL
  // specific and can’t be done with `sql`.
  const query = {
    name: `${table.schema.name}_${table.name}_single`,
    text: `select * from "${table.schema.name}"."${table.name}" where ${primaryKeyMatch} = any ($1)`,
  }

  // Because we don’t want to run 30+ SQL queries to fetch single rows if we
  // are fetching relations for a list, we optimize with a `DataLoader`.
  //
  // Note that there is a performance penalty in that if we are selecting 100+
  // rows we will have to run an aggregate `find` method for each row that was
  // queried. However, this is still much better than running 100+ SQL queries.
  // In addition, if we are selecting a lot of repeats, we can memoize this
  // operation.
  //
  // This is a memoized function because we don’t have another way of
  // accessing `client` which is local to the resolution context.
  const getDataLoader = memoize(client => new DataLoader(async columnValueses => {
    // Query the client with our list of column values and prepared query.
    // Results can be returned in any order.

    // We expect to pass an array of strings with concatenated values.
    const values = [columnValueses.map(columnValues => (columnValues.join(',') || null))]
    const { rowCount, rows } = await client.queryAsync({ ...query, values })

    // Gets the row from the result set given a few column values.
    let getRow = columnValues => rows.find(row =>
      every(columns.map(({ name }, i) => String(row[name]) === String(columnValues[i])))
    )

    // If there are 25% less values in our result set then this means there are
    // some duplicates and memoizing `getRow` could cause some performance gains.
    //
    // Note that this memoization should be tinkered with in the future to
    // determine the best memoization tradeoffs.
    if (columnValueses.length * 0.75 >= rowCount)
      getRow = memoize(getRow, columnValues => columnValues.join(','))

    return columnValueses.map(getRow)
  }))

  // Make sure we use a `WeakMap` for the cache so old `Client`s are not held
  // in memory.
  getDataLoader.cache = new WeakMap()

  return async (source, args, { client }) => {
    const values = getColumnValues(source, args)
    if (!values) return null
    const row = await getDataLoader(client).load(values)
    if (!row) return row
    row[$$rowTable] = table
    return row
  }
}

export default resolveTableSingle
