import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
} from 'graphql'

import { memoize } from 'lodash'
import createTableType from './createTableType.js'
import { PageInfoType, CursorType } from './types.js'

const createTableConnectionType = memoize(table =>
  new GraphQLObjectType({
    name: `${table.getTypeName()}Connection`,
    description: `A connection to a list of ${table.getMarkdownTypeName()} items`,

    // TODO: Implement a `ConnectionType` interface

    fields: {
      pageInfo: {
        type: new GraphQLNonNull(PageInfoType),
        description: `Information to aid in pagination of type ${table.getMarkdownTypeName()}.`,
        resolve: pageInfo => pageInfo,
      },
      totalCount: {
        type: GraphQLInt,
        description: 'All of the items available to be queried in this connection.',
        resolve: ({ totalCount }) => totalCount,
      },
      nodes: {
        type: new GraphQLList(createTableType(table)),
        description: `The queried list of ${table.getMarkdownTypeName()}.`,
        resolve: ({ nodes }) => nodes,
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
    name: `${table.getTypeName()}Edge`,
    description: `An edge in the \`${table.getTypeName()}Connection\`.`,

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
