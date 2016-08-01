import {
  GraphQLInterfaceType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLFieldConfig,
  GraphQLList,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLString,
} from 'graphql'

import * as formatName from '../utils/formatName'
import NodeForge from './NodeForge'

interface ConnectionManager {
  resolveFirst (first: number, before: string, after: string): Connection
  resolveLast (last: number, before: string, after: string): Connection
}

interface Connection {}

class ConnectionForge {
  constructor (
    private _nodeForge: NodeForge,
  ) {}

  public createField <T>(gqlType: GraphQLObjectType<T>): GraphQLFieldConfig<any, Connection> {
    if (gqlType.getInterfaces().indexOf(this._nodeForge.getInterface()) === -1)
      throw new Error('GraphQL object type must implement the Node interface.')

    const edgeType = new GraphQLObjectType({
      name: formatName.type(`${gqlType.name}-edge`),
      // TODO: description
      interfaces: [this._edgeInterface],
      fields: {},
    })

    const connectionType = new GraphQLObjectType<Connection>({
      name: formatName.type(`${gqlType.name}-connection`),
      // TODO: description
      interfaces: [this._connectionInterface],
      fields: {},
    })

    return {
      type: connectionType,
      // TODO: description
      args: {
        first: {
          type: GraphQLInt,
          // TODO: description
        },
        last: {
          type: GraphQLInt,
          // TODO: description
        },
        before: {
          type: this._cursorType,
          // TODO: description
        },
        after: {
          type: this._cursorType,
          // TODO: description
        },
        sort: {
          type: GraphQLString,
          // TODO: description
        },
        skip: {
          type: GraphQLInt,
          // TODO: description
        },
      },
    }
  }

  /**
   * The cursor type is a scalar string type that represents a single edge in a
   * connection.
   *
   * @private
   */
  private _cursorType = (
    Object.assign(Object.create(GraphQLString), {
      name: 'Cursor',
      // TODO: description
      description: undefined,
    })
  )

  /**
   * The page info type contains information about the current page of results
   * returned by the connection.
   *
   * @private
   */
  private _pageInfoType = (
    new GraphQLObjectType({
      name: 'PageInfo',
      // TODO: description
      fields: {
        hasNextPage: {
          type: new GraphQLNonNull(GraphQLBoolean),
          // TODO: description
        },
        hasPreviousPage: {
          type: new GraphQLNonNull(GraphQLBoolean),
          // TODO: description
        },
        startCursor: {
          type: this._cursorType,
          // TODO: description
        },
        endCursor: {
          type: this._cursorType,
          // TODO: description
        },
      },
    })
  )

  /**
   * The edge interface. Implemented by every type that’s a connection edge.
   *
   * An edge represents a node and a cursor. The cursor is used to paginate
   * the connection.
   *
   * @private
   */
  private _edgeInterface = (
    new GraphQLInterfaceType({
      name: 'Edge',
      // TODO: description
      fields: {
        cursor: {
          type: new GraphQLNonNull(this._cursorType),
          // TODO: description
        },
        node: {
          type: this._nodeForge.getInterface(),
          // TODO: description
        },
      },
    })
  )

  /**
   * The connection interface. This is the interface that every connection
   * in our schema implements. A connection represents a list of edges between
   * one type and another.
   *
   * While the connections implement the Relay specification, we consider
   * connections to be idiomatic GraphQL.
   *
   * @private
   */
  private _connectionInterface = (
    new GraphQLInterfaceType({
      name: 'Connection',
      // TODO: description
      fields: {
        pageInfo: {
          type: new GraphQLNonNull(this._pageInfoType),
          // TODO: description
        },
        totalCount: {
          type: GraphQLInt,
          // TODO: description
        },
        edges: {
          type: new GraphQLList(this._edgeInterface),
          // TODO: description
        },
        nodes: {
          type: new GraphQLList(this._nodeForge.getInterface()),
          // TODO: description
        },
      },
    })
  )
}

export default ConnectionForge
