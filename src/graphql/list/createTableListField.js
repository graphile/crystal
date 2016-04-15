import { fromPairs, camelCase, snakeCase, upperFirst, toUpper } from 'lodash'
import createTableType from '../createTableType.js'
import resolveTableList from './resolveTableList.js'

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
      type: createTableOrderingEnum(table),
      description:
        'The order the resulting items should be returned in. This argument ' +
        'is required because it is also used to determine cursors.',
      defaultValue: (() => {
        const column = table.getPrimaryKeyColumns()[0]
        if (column) return column.name
        return null
      })(),
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

  resolve: resolveTableList(table),
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
