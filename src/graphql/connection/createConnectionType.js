import { memoize, camelCase, upperFirst } from 'lodash'
import createTableType from '../createTableType.js'
import { PageInfoType, CursorType } from '../connection/types.js'

import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
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
