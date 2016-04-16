import { once } from 'lodash'

const resolveTableListField = table => {
  // Because we are trying to generate very dynamic queries we use the `sql`
  // module as it lets us guarantee saftey against SQL injection, and is easier
  // to modify than a string.
  const tableSql = table.sql()

  return (source, args, { client }) => {
    const { orderBy, first, last, after, before, offset, descending } = args

    // Throw an error if `orderBy` is not defined.
    if (!orderBy)
      throw new Error('`orderBy` not defined in properties. `orderBy` is required for creating cursors.')

    // If both `first` and `last` are defined, throw an error.
    if (first && last)
      throw new Error('Cannot define both a `first` and a `last` argument.')

    const getRowCursorValue = row => row[orderBy] || ''

    const getRows = once(async () => {
      // Start our query.
      let query = tableSql.select(tableSql.star())

      // Add the conditions for `after` and `before` which will narrow our
      // range.
      if (before) query = query.and(tableSql[orderBy].lt(before))
      if (after) query = query.and(tableSql[orderBy].gt(after))

      // Create the ordering statement and add it to the query.
      // If a `last` argument was defined we are querying from the bottom so we
      // need to flip our order.
      const queryDescending = last ? !descending : descending
      query = query.order(tableSql[orderBy][queryDescending ? 'descending' : 'ascending'])

      // Set the correct range.
      if (first) query = query.limit(first)
      if (last) query = query.limit(last)
      if (offset) query = query.offset(offset)

      // Run the query.
      let { rows } = await client.queryAsync(query.toQuery())

      // If a `last` argument was defined we flipped our query ordering (see
      // the above `ORDER BY` addition), so now we need to flip it back so the
      // user gets what they expected.
      if (last) rows = rows.reverse()

      return rows
    })

    const getStartCursor = once(() => getRows().then(rows => {
      const row = rows[0]
      return row ? getRowCursorValue(row) : null
    }))

    const getEndCursor = once(() => getRows().then(rows => {
      const row = rows[rows.length - 1]
      return row ? getRowCursorValue(row) : null
    }))

    // The properties are in getters so that they are lazy. If we don’t need a
    // thing, we don’t need to make associated requests until the getter is
    // called.
    //
    // Also, the `pageInfo` stuff is not nested in its own object because it
    // turns out that pattern just increases cyclomatic complexity for no good
    // reason.
    return {
      get hasNextPage () {
        return (
          // Get the `endCursor`. We will need it.
          getEndCursor()
          .then(endCursor => {
            if (!endCursor) return false
            return (
              // Try to find one row with a greater cursor. If one exists
              // we know there is a next page.
              client.queryAsync(
                tableSql
                .select('null')
                .where(tableSql[orderBy][descending ? 'lt' : 'gt'](endCursor))
                .limit(1)
                .toQuery()
              )
              .then(({ rowCount }) => rowCount !== 0)
            )
          })
        )
      },

      get hasPreviousPage () {
        return (
          // Get the `startCursor`. We will need it.
          getStartCursor()
          .then(startCursor => {
            if (!startCursor) return false
            return (
              // Try to find one row with a lesser cursor. If one exists
              // we know there is a previous page.
              client.queryAsync(
                tableSql
                .select('null')
                .where(tableSql[orderBy][descending ? 'gt' : 'lt'](startCursor))
                .limit(1)
                .toQuery()
              )
              .then(({ rowCount }) => rowCount !== 0)
            )
          })
        )
      },

      // Gets the first cursor in the resulting items.
      get startCursor () {
        return getStartCursor()
      },

      // Gets the last cursor in the resulting items.
      get endCursor () {
        return getEndCursor()
      },

      // Runs a SQL query to get the count for this query with the provided
      // condition. Also makes sure only the parsed count is returned. There is
      // a possibility that `count` will be so big JavaScript can’t parse it.
      get totalCount () {
        return (
          client.queryAsync(
            tableSql
            .select(tableSql.count('count'))
            .toQuery()
          )
          .then(({ rows: [{ count }] }) => parseInt(count, 10))
        )
      },

      get list () {
        return getRows()
      },

      get edges () {
        // Returns the rows with a generated `cursor` field for more details.
        return getRows().then(rows => rows.map(row => ({
          cursor: getRowCursorValue(row),
          node: row,
        })))
      },
    }
  }
}

export default resolveTableListField
