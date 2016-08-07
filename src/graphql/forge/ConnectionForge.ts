import {
  GraphQLInputType,
  GraphQLScalarType,
  GraphQLInterfaceType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLFieldConfig,
  GraphQLArgumentConfig,
  GraphQLEnumType,
  GraphQLEnumValueConfig,
  GraphQLList,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLString,
  Kind,
  getNamedType,
} from 'graphql'

import { Paginator, Condition } from '../../catalog'
import buildObject from '../utils/buildObject'
import * as formatName from '../utils/formatName'
import NodeForge from './NodeForge'
import TypeForge from './TypeForge'

interface Connection<TValue, TCursor> {
  paginator: any
  ordering: Paginator.Ordering | undefined
  condition: Condition
  page: Paginator.Page<TValue, TCursor>
}

interface Edge<TValue, TCursor> {
  paginator: any
  ordering: Paginator.Ordering | undefined
  cursor: TCursor
  value: TValue
}

type ConnectionArgs = {
  orderBy?: Paginator.Ordering,
  before?: string,
  after?: string,
  first?: number,
  last?: number,
  condition?: any,
}

type ConditionConfig<TValue> = {
  type: GraphQLInputType<TValue>,
  getCondition: (value: TValue) => Condition,
}

type NamespacedCursor<TCursor> = {
  paginatorName: string,
  orderingName: string | undefined,
  cursor: TCursor,
}

class ConnectionForge {
  constructor (
    private _nodeForge: NodeForge,
    private _typeForge: TypeForge,
  ) {}

  /**
   * Creates a connection field by using a paginator.
   */
  public createField <TValue, TCursor>(
    paginator: Paginator<TValue, TCursor>,
    conditionConfig?: ConditionConfig<any>,
  ): GraphQLFieldConfig<any, Connection<TValue, TCursor>> {
    const paginatorName = paginator.getName()
    const type = paginator.getType()
    const gqlType = getNamedType(this._typeForge.getOutputType(type)) as GraphQLObjectType<TValue>

    if (gqlType.getInterfaces().indexOf(this._nodeForge.getInterface()) === -1)
      throw new Error('GraphQL object type must implement the Node interface.')

    const gqlConnectionType = this._createConnectionType(paginator, gqlType)
    const gqlOrderByEnum = this._createOrderByEnumType(paginator, gqlType)

    return {
      type: gqlConnectionType,
      // TODO: description
      args: buildObject<GraphQLArgumentConfig<any>>([
        ['orderBy', {
          type: gqlOrderByEnum,
          defaultValue: paginator.getDefaultOrdering(),
          // TODO: description
        }],
        ['before', {
          type: this._cursorType,
          // TODO: description
        }],
        ['after', {
          type: this._cursorType,
          // TODO: description
        }],
        ['first', {
          type: GraphQLInt,
          // TODO: description
        }],
        ['last', {
          type: GraphQLInt,
          // TODO: description
        }],
        conditionConfig && ['condition', {
          type: conditionConfig.type,
          // TODO: description
        }],
      ]),
      // Note that this resolver is an arrow function. This is so that we can
      // keep the correct `this` reference.
      resolve: async (source: any, args: ConnectionArgs, context: any): Promise<Connection<TValue, TCursor>> => {
        const {
          orderBy: ordering,
          before: serializedBeforeCursor,
          after: serializedAfterCursor,
          first,
          last,
          condition: argCondition,
        } = args

        const beforeCursor = serializedBeforeCursor && ConnectionForge._deserializeCursor(serializedBeforeCursor)
        const afterCursor = serializedAfterCursor && ConnectionForge._deserializeCursor(serializedAfterCursor)

        // Throw an error if the user is trying to use a cursor from another
        // paginator.
        if (!beforeCursor || beforeCursor.paginatorName !== paginatorName)
          throw new Error('`before` cursor can not be used with this connection.')
        if (!afterCursor || afterCursor.paginatorName !== paginatorName)
          throw new Error('`after` cursor can not be used with this connection.')

        // Throw an error if the user is trying to use a cursor from another
        // ordering. Note that if no ordering is defined we expect the
        // `orderingName` to be `null`. This is because when we deserialize the
        // base64 encoded JSON any undefineds will become nulls.
        if (!beforeCursor || beforeCursor.orderingName !== (ordering ? ordering.name : null))
          throw new Error('`before` cursor can not be used for this `orderBy` value.')
        if (!afterCursor || afterCursor.orderingName !== (ordering ? ordering.name : null))
          throw new Error('`after` cursor can not be used for this `orderBy` value.')

        // Get our condition from the condition input type. If we had no
        // condition or we had no condition config, the condition will just be
        // `true`. Everything passes! 🎉
        const condition: Condition = conditionConfig && argCondition
          ? conditionConfig.getCondition(argCondition)
          : true

        // Finally, actually get the page data.
        const page = await paginator.readPage(context, {
          beforeCursor: beforeCursor && beforeCursor.cursor,
          afterCursor: afterCursor && afterCursor.cursor,
          first,
          last,
          ordering,
          condition,
        })

        return {
          paginator,
          ordering,
          // We pass on the condition as it is used by the `Paginator#count`
          // method.
          condition,
          page,
        }
      },
    }
  }

  /**
   * Creates a concrete GraphQL connection object type.
   */
  private _createConnectionType <TValue, TCursor>(
    paginator: Paginator<TValue, TCursor>,
    gqlType: GraphQLObjectType<TValue>,
  ): GraphQLObjectType<Connection<TValue, TCursor>> {
    const gqlEdgeType = this._createEdgeType(paginator, gqlType)

    return new GraphQLObjectType<Connection<TValue, TCursor>>({
      name: formatName.type(`${gqlType.name}-connection`),
      // TODO: description
      isTypeOf: value => value.paginator === paginator,
      interfaces: [this._connectionInterface],
      fields: {
        pageInfo: {
          type: new GraphQLNonNull(this._pageInfoType),
          resolve: ({ page }) => page,
          // TODO: description
        },
        totalCount: {
          type: GraphQLInt,
          resolve: ({ condition }, args, context) => paginator.count(context, condition),
          // TODO: description
        },
        edges: {
          type: new GraphQLList(gqlEdgeType),
          resolve: ({ paginator, ordering, page }): Array<Edge<TValue, TCursor>> =>
            page.values.map(({ cursor, value }) => ({ paginator, ordering, cursor, value })),
          // TODO: description
        },
        nodes: {
          type: new GraphQLList(gqlType),
          resolve: ({ page }): Array<TValue> =>
            page.values.map(({ value }) => value),
          // TODO: description
        },
      },
    })
  }

  /**
   * Creates a concrete GraphQL edge object type.
   */
  private _createEdgeType <TValue, TCursor>(
    paginator: Paginator<TValue, TCursor>,
    gqlType: GraphQLObjectType<TValue>,
  ): GraphQLObjectType<Edge<TValue, TCursor>> {
    const paginatorName = paginator.getName()

    return new GraphQLObjectType<Edge<TValue, TCursor>>({
      name: formatName.type(`${gqlType.name}-edge`),
      // TODO: description
      isTypeOf: value => value.paginator === paginator,
      interfaces: [this._edgeInterface],
      fields: {
        cursor: {
          type: new GraphQLNonNull(this._cursorType),
          resolve: ({ ordering, cursor }): NamespacedCursor<TCursor> => ({
            paginatorName,
            orderingName: ordering && ordering.name,
            cursor,
          }),
          // TODO: description
        },
        node: {
          type: gqlType,
          resolve: ({ value }) => value,
          // TODO: description
        },
      },
    })
  }

  /**
   * Creates a GraphQL type which can be used by the user to select an ordering
   * strategy.
   */
  private _createOrderByEnumType <TValue, TCursor>(
    paginator: Paginator<TValue, TCursor>,
    gqlType: GraphQLObjectType<TValue>,
  ): GraphQLEnumType<Paginator.Ordering> {
    return new GraphQLEnumType<Paginator.Ordering>({
      name: formatName.type(`${gqlType.name}-order-by`),
      // TODO: description
      values: buildObject<GraphQLEnumValueConfig<Paginator.Ordering>>(
        paginator.getOrderings().map<[string, GraphQLEnumValueConfig<Paginator.Ordering>]>(ordering =>
          [formatName.enumValue(ordering.name), { value: ordering }]
        )
      ),
    })
  }

  /**
   * Takes a namespaced cursor and serializes it into a base64 encoded
   * string.
   */
  private static _serializeCursor ({ paginatorName, orderingName, cursor }: NamespacedCursor<any>): string {
    return new Buffer(JSON.stringify([paginatorName, orderingName, cursor])).toString('base64')
  }

  /**
   * Deserializes a base64 encoded namespace cursor into the correct data type.
   */
  private static _deserializeCursor (serializedCursor: string): NamespacedCursor<any> {
    const [paginatorName, orderingName, cursor] = JSON.parse(new Buffer(serializedCursor, 'base64').toString())
    return { paginatorName, orderingName, cursor }
  }

  /**
   * The cursor type is a scalar string type that represents a single edge in a
   * connection.
   *
   * @private
   */
  private _cursorType: GraphQLScalarType<NamespacedCursor<any>> = (
    new GraphQLScalarType<NamespacedCursor<any>>({
      name: 'Cursor',
      // TODO: description
      serialize: value => ConnectionForge._serializeCursor(value),
      parseValue: value => ConnectionForge._deserializeCursor(value),
      parseLiteral: ast => ast.kind === Kind.STRING ? ConnectionForge._deserializeCursor(ast.value) : null
    })
  )

  /**
   * The page info type contains information about the current page of results
   * returned by the connection.
   *
   * @private
   */
  private _pageInfoType = (
    new GraphQLObjectType<Connection<any, any>>({
      name: 'PageInfo',
      // TODO: description
      fields: {
        hasNextPage: {
          type: new GraphQLNonNull(GraphQLBoolean),
          resolve: ({ page }) => page.hasNext,
          // TODO: description
        },
        hasPreviousPage: {
          type: new GraphQLNonNull(GraphQLBoolean),
          resolve: ({ page }) => page.hasPrevious,
          // TODO: description
        },
        startCursor: {
          type: this._cursorType,
          resolve: ({ paginator, ordering, page }): NamespacedCursor<any> => ({
            paginatorName: paginator.getName(),
            orderingName: ordering && ordering.name,
            cursor: page.values[0].cursor,
          }),
          // TODO: description
        },
        endCursor: {
          type: this._cursorType,
          resolve: ({ paginator, ordering, page }): NamespacedCursor<any> => ({
            paginatorName: paginator.getName(),
            orderingName: ordering && ordering.name,
            cursor: page.values[page.values.length - 1].cursor,
          }),
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
