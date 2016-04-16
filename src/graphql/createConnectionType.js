import { memoize, camelCase, upperFirst } from 'lodash'
import createTableType from './createTableType.js'

import {
  Kind,
  GraphQLScalarType,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLBoolean,
} from 'graphql'

const pascalCase = string => upperFirst(camelCase(string))

const createTableConnectionType = memoize(table =>
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
)

export default createTableConnectionType

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

const PageInfoType =
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
