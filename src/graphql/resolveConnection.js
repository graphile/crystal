import { constant, assign, once, camelCase, isEmpty } from 'lodash'
import { $$rowTable } from '../symbols.js'
import SQLBuilder from '../SQLBuilder.js'

let warnedExtraConditionDeprecation = false

const resolveConnection = (
  table,
  getConditions = constant({}),
  getFromClause = constant(table.getIdentifier()),
) => {
  const columns = table.getColumns()

  return (source, args, { client }) => {
    // DEPRECATED: ...conditions
    const { orderBy: orderByName, first, last, after, before, offset, descending, ...conditions } = args

    if (!warnedExtraConditionDeprecation && !isEmpty(conditions)) {
      console.error([ // eslint-disable-line no-console
        '',

        'Using columns for equality filtering in nodes fields has been ' +
        'deprecated. Queries like `postNodes(topic: HELP)` will not be ' +
        'supported in the next version of PostGraphQL.',

        'Instead use a procedure to specify exactly the query you want to run ' +
        'on your data. This method is more expressive, flexible, and extensible ' +
        'hence why this method is deprecated.',

        'In the future, this functionality may be re-added in a different form ' +
        'which allows more complex queries which include operators outside of ' +
        'a simple equality test.',

        'For more information on advanced queries, refer to our documentation here: ' +
        'https://github.com/calebmer/postgraphql/blob/master/docs/advanced-queries.md',

        '',
      ].join('\n'))

      warnedExtraConditionDeprecation = true
    }

    // Add extra conditions to the leftover `conditions` argument.
    assign(conditions, getConditions(source, args))

    // Throw an error if `orderBy` is not defined.
    if (!orderByName)
      throw new Error('`orderBy` not defined in properties. `orderBy` is required for creating cursors.')

    // If both `first` and `last` are defined, throw an error.
    if (first && last)
      throw new Error('Cannot define both a `first` and a `last` argument.')

    // Get the column we are ordering by.
    const orderBy = columns.find(({ name }) => orderByName === name)
    const fromClause = getFromClause(source, args)

    // Get the cursor value for a row using the `orderBy` column.
    const getRowCursorValue = row => row[orderBy.name] || ''

    // Transforms object keys (which are field names) into column names.
    const getWhereClause = once(() => {
      const sql = new SQLBuilder()

      // For all entries in the conditions object.
      for (const fieldName in conditions) {
        // Find the column for the field name and if there is no column, skip
        // this field.
        // DEPRECATED: remove `camelCase` because we removed ...conditions
        const column = columns.find(c => c.getFieldName() === camelCase(fieldName))
        if (!column) continue

        // Add to the SQL a condition with a trailing `and`.
        sql.add(`${column.getIdentifier()} = $1 and`, [conditions[fieldName]])
      }

      // Add true for both empty condition objects and the last trailing `and`.
      sql.add('true')

      return sql
    })

    const getRows = once(async () => {
      // Start our query.
      const sql = new SQLBuilder().add('select * from').add(fromClause).add('where')

      // Add the conditions for `after` and `before` which will narrow our
      // range.
      if (before) sql.add(`"${orderBy.name}" < $1 and`, [before])
      if (after) sql.add(`"${orderBy.name}" > $1 and`, [after])

      // Add the conditions…
      sql.add(getWhereClause())

      // Create the ordering statement and add it to the query.
      // If a `last` argument was defined we are querying from the bottom so we
      // need to flip our order.
      const actuallyDescending = last ? !descending : descending
      sql.add(`order by "${orderBy.name}" ${actuallyDescending ? 'desc' : 'asc'}`)

      // Set the correct range.
      if (first) sql.add('limit $1', [first])
      if (last) sql.add('limit $1', [last])
      if (offset) sql.add('offset $1', [offset])

      // Run the query.
      let { rows } = await client.queryAsync(sql)

      // If a `last` argument was defined we flipped our query ordering (see
      // the above `ORDER BY` addition), so now we need to flip it back so the
      // user gets what they expected.
      if (last) rows = rows.reverse()

      // Add the row table property for every row so it can be identified.
      rows.forEach(row => (row[$$rowTable] = table))

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
              client.queryAsync(
                // Try to find one row with a greater cursor. If one exists
                // we know there is a next page.
                new SQLBuilder()
                .add('select null from')
                .add(fromClause)
                .add(`where "${orderBy.name}" ${descending ? '<' : '>'} $1 and`, [endCursor])
                .add(getWhereClause())
                .add('limit 1')
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
              client.queryAsync(
                // Try to find one row with a lesser cursor. If one exists
                // we know there is a previous page.
                new SQLBuilder()
                .add('select null from')
                .add(fromClause)
                .add(`where "${orderBy.name}" ${descending ? '>' : '<'} $1 and`, [startCursor])
                .add(getWhereClause())
                .add('limit 1')
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
      // condition. Also makes sure only the parsed count is returned.
      get totalCount () {
        // There is a possibility that `count` will be so big JavaScript can’t
        // parse it :|
        return (
          client.queryAsync(
            new SQLBuilder()
            .add('select count(*) as count from')
            .add(fromClause)
            .add('where')
            .add(getWhereClause())
          )
          .then(({ rows: [{ count }] }) => parseInt(count, 10))
        )
      },

      get nodes () {
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

export default resolveConnection
