import { fromPairs, once, camelCase, snakeCase, upperFirst, toUpper } from 'lodash'
import createTableType from './createTableType.js'

import {
  Kind,
  GraphQLScalarType,
  GraphQLObjectType,
  GraphQLEnumType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLBoolean,
} from 'graphql'

const pascalCase = string => upperFirst(camelCase(string))

/**
 * Gets the Relay connection specification compliant list field for a `Table`.
 *
 * @param {Table} table
 * @returns {GraphQLFieldConfig}
 */
const createTableListField = table => ({
  description:
    'Queries and returns a list of items with some metatadata for ' +
    `\`${pascalCase(table.name)}\`.`,

  args: {
    // The column specified by `orderBy` means more than just the order to
    // return items in. This column is also the column we will use for
    // cursors.
    // TODO: intelligent default.
    orderBy: {
      type: new GraphQLNonNull(createTableOrderingEnum(table)),
      description:
        'The order the resulting items should be returned in. This argument ' +
        'is required because it is also used to determine cursors.',
    },
    first: {
      type: GraphQLInt,
      description: 'The first **n** items to query. Can’t be used with `last`.',
    },
    last: {
      type: GraphQLInt,
      description: 'The last **n** items to retrieve from the query. Can’t be used with `first`.',
    },
    before: {
      type: CursorType,
      description: 'A cursor specifying the lower limit of items to query.',
    },
    after: {
      type: CursorType,
      description: 'A cursor specifying the upper limit of items to query.',
    },
    offset: {
      type: GraphQLInt,
      description: 'An integer offset representing how many items to skip before returning the values.',
    },
    descending: {
      type: GraphQLBoolean,
      defaultValue: false,
      description:
        'If `true` the items will be in descending order, if `false` the ' +
        'items will be in ascending order.',
    },
  },

  // Make sure the type of this field is our connection type. This connection
  // type will expect functions (that cache their values) and not traditional
  // values. This improves performance when we don’t have to do potentially
  // expensive queries on fields we don’t actually need.
  type: createTableConnectionType(table),

  // TODO: Make this more lazy
  resolve (source, args, { client }) {
    const { orderBy, first, last, after, before, offset, descending } = args

    // If both first and last are defined, throw an error.
    if (first && last)
      throw new Error('Cannot define both a `first` and a `last` argument.')

    const getRowCursorValue = row => row[orderBy] || ''

    const getRows = once(async () => {
      // This query is too dynamic to be prepared…
      let query = `select * from ${table.getIdentifier()}`
      const values = []

      const useValue = value => {
        values.push(value)
        return `$${values.length}`
      }

      // Add the conditions for `after` and `before` which will narrow our
      // range.
      const conditionBefore = before ? `"${orderBy}" < ${useValue(before)}` : 'true'
      const conditionAfter = after ? `"${orderBy}" > ${useValue(after)}` : 'true'
      query += ` where ${conditionBefore} and ${conditionAfter}`

      // Create the ordering statement and add it to the query.
      // If a `last` argument was defined we are querying from the bottom so we
      // need to flip our order.
      const queryDescending = last ? !descending : descending
      query += ` order by "${orderBy}" ${queryDescending ? 'desc' : 'asc'}`

      // Set the correct range.
      if (first) query += ` limit ${useValue(first)}`
      if (last) query += ` limit ${useValue(last)}`
      if (offset) query += ` offset ${useValue(offset)}`

      // Run the query.
      let { rows } = await client.queryAsync(query, values)

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
                'select null ' +
                `from ${table.getIdentifier()} ` +
                `where "${orderBy}" ${descending ? '<' : '>'} $1 ` +
                'limit 1',
                [endCursor]
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
                'select null ' +
                `from ${table.getIdentifier()} ` +
                `where "${orderBy}" ${descending ? '>' : '<'} $1 ` +
                'limit 1',
                [startCursor]
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
          client.queryAsync(`select count(*) as "count" from ${table.getIdentifier()}`)
          .then(({ rows: [{ count }] }) => parseInt(count, 10))
        )
      },

      get list () {
        return getRows()
      },

      get edges () {
        return getRows().then(rows => rows.map(row => ({
          cursor: getRowCursorValue(row),
          node: row,
        })))
      },
    }
  },
})

export default createTableListField

/**
 * Creates an ordering enum which simply contains all of a `Table`s columns.
 *
 * @param {Table} table
 * @returns {GraphQLEnumType}
 */
// TODO: Some way to eliminate some columns from ordering enum?
const createTableOrderingEnum = table =>
  new GraphQLEnumType({
    name: pascalCase(`${table.name}_ordering`),
    description: `Properties with which \`${pascalCase(table.name)}\` can be ordered.`,

    values: fromPairs(
      table.columns
      .map(({ name }) => [toUpper(snakeCase(name)), { value: name }])
    ),
  })

const createTableConnectionType = table =>
  new GraphQLObjectType({
    name: pascalCase(`${table.name}_connection`),
    description: `A connection to a list of \`${pascalCase(table.name)}\` items`,

    // TODO: Implement a `ConnectionType` interface

    fields: {
      pageInfo: {
        type: new GraphQLNonNull(PageInfoType),
        description: `Information to aid in pagination of type \`${pascalCase(table.name)}\`.`,
        resolve: pageInfo => pageInfo,
      },
      totalCount: {
        type: GraphQLInt,
        description: 'All of the items available to be queried in this connection.',
        resolve: ({ totalCount }) => totalCount,
      },
      list: {
        type: new GraphQLList(createTableType(table)),
        description: `The queried list of \`${pascalCase(table.name)}\`.`,
        resolve: ({ list }) => list,
      },
      edges: {
        type: new GraphQLList(createTableEdgeType(table)),
        description: 'A single item and a cursor to aid in pagination.',
        resolve: ({ edges }) => edges,
      },
    },
  })

const createTableEdgeType = table =>
  new GraphQLObjectType({
    name: pascalCase(`${table.name}_edge`),
    description: `An edge in the \`${pascalCase(`${table.name}_connection`)}\`.`,

    fields: {
      cursor: {
        type: new GraphQLNonNull(CursorType),
        description: 'The cursor describing the position of the edge’s associated node.',
        resolve: ({ cursor }) => cursor || 'null',
      },
      node: {
        type: createTableType(table),
        description: 'The item at the end of the edge.',
        resolve: ({ node }) => node,
      },
    },
  })

const toBase64 = value => new Buffer(value.toString()).toString('base64')
const fromBase64 = value => new Buffer(value.toString(), 'base64').toString()

export const CursorType =
  new GraphQLScalarType({
    name: 'Cursor',
    description: 'An opaque base64 encoded string describing a location in a list of items.',
    serialize: toBase64,
    parseValue: fromBase64,
    parseLiteral: ast => (ast.kind === Kind.STRING ? fromBase64(ast.value) : null),
  })

export const PageInfoType =
  new GraphQLObjectType({
    name: 'PageInfo',
    description: 'Information about pagination in a connection.',
    fields: {
      hasNextPage: {
        type: new GraphQLNonNull(GraphQLBoolean),
        description: 'Are there items after our result set to be queried?',
        resolve: ({ hasNextPage }) => hasNextPage,
      },
      hasPreviousPage: {
        type: new GraphQLNonNull(GraphQLBoolean),
        description: 'Are there items before our result set to be queried?',
        resolve: ({ hasPreviousPage }) => hasPreviousPage,
      },
      startCursor: {
        type: CursorType,
        description: 'The cursor for the first item in the list.',
        resolve: ({ startCursor }) => startCursor,
      },
      endCursor: {
        type: CursorType,
        description: 'The cursor for the last item in the list.',
        resolve: ({ endCursor }) => endCursor,
      },
    },
  })
