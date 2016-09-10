import {
  GraphQLOutputType,
  GraphQLInputType,
  GraphQLScalarType,
  GraphQLInterfaceType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLFieldConfig,
  GraphQLArgumentConfig,
  GraphQLResolveInfo,
  GraphQLEnumType,
  GraphQLEnumValueConfig,
  GraphQLList,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLString,
  Kind,
} from 'graphql'

import { Paginator, Condition, Type } from '../../../interface'
import { buildObject, formatName, memoize2 } from '../../utils'
import getType from '../type/getType'
import BuildToken from '../BuildToken'

// TODO: doc
export default function createConnectionField <TValue, TCursor, TCondition>(
  buildToken: BuildToken,
  paginator: Paginator<TValue, TCursor>,
  config: {
    conditionType?: GraphQLInputType<TCondition>,
    getCondition?: (source: mixed, conditionValue: TCondition | undefined) => Condition,
  } = {},
): GraphQLFieldConfig<mixed, Connection<TValue, TCursor>> {
  const paginatorName = paginator.getName()

  // This is the type of all the connection arguments.
  type ConnectionArgs = {
    orderBy?: Paginator.Ordering,
    before?: NamespacedCursor<TCursor>,
    after?: NamespacedCursor<TCursor>,
    first?: number,
    last?: number,
    condition?: TCondition,
  }

  return {
    type: getConnectionType(buildToken, paginator),
    // TODO: description
    args: buildObject<GraphQLArgumentConfig<mixed>>([
      // Only include an `orderBy` field if there are ways in which we can
      // order.
      paginator.getOrderings().length > 0 && ['orderBy', {
        type: getOrderByEnumType(buildToken, paginator),
        defaultValue: paginator.getDefaultOrdering(),
        // TODO: description
      }],
      ['before', {
        type: _cursorType,
        // TODO: description
      }],
      ['after', {
        type: _cursorType,
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
      config.conditionType && ['condition', {
        type: config.conditionType,
        // TODO: description
      }],
    ]),
    // Note that this resolver is an arrow function. This is so that we can
    // keep the correct `this` reference.
    resolve: async (
      source: mixed,
      args: ConnectionArgs,
      context: mixed,
      info: GraphQLResolveInfo<mixed, mixed>,
    ): Promise<Connection<TValue, TCursor>> => {
      const {
        orderBy: ordering,
        before: beforeCursor,
        after: afterCursor,
        first,
        last,
        condition: argCondition,
      } = args

      // Throw an error if the user is trying to use a cursor from another
      // paginator.
      if (beforeCursor && beforeCursor.paginatorName !== paginatorName)
        throw new Error('`before` cursor can not be used with this connection.')
      if (afterCursor && afterCursor.paginatorName !== paginatorName)
        throw new Error('`after` cursor can not be used with this connection.')

      // Throw an error if the user is trying to use a cursor from another
      // ordering. Note that if no ordering is defined we expect the
      // `orderingName` to be `null`. This is because when we deserialize the
      // base64 encoded JSON any undefineds will become nulls.
      if (beforeCursor && beforeCursor.orderingName !== (ordering ? ordering.name : null))
        throw new Error('`before` cursor can not be used for this `orderBy` value.')
      if (afterCursor && afterCursor.orderingName !== (ordering ? ordering.name : null))
        throw new Error('`after` cursor can not be used for this `orderBy` value.')

      // Get our condition from the condition input type. If we had no
      // condition or we had no condition config, the condition will just be
      // `true`. Everything passes! 🎉
      const condition: Condition = config.getCondition
        ? config.getCondition(source, argCondition)
        : true

      // Construct the page config.
      const pageConfig: Paginator.PageConfig<TCursor> = {
        beforeCursor: beforeCursor && beforeCursor.cursor,
        afterCursor: afterCursor && afterCursor.cursor,
        first,
        last,
        ordering,
        condition,
      }

      // Finally, actually get the page data.
      const page = await paginator.readPage(context, pageConfig)

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

const getConnectionType = memoize2(_createConnectionType)

/**
 * Creates a concrete GraphQL connection object type.
 */
export function _createConnectionType <TValue, TCursor>(
  buildToken: BuildToken,
  paginator: Paginator<TValue, TCursor>,
): GraphQLObjectType<Connection<TValue, TCursor>> {
  const gqlType = getType(buildToken, paginator.getType(), false)
  const gqlEdgeType = getEdgeType(buildToken, paginator)

  return new GraphQLObjectType<Connection<TValue, TCursor>>({
    name: formatName.type(`${paginator.getName()}-connection`),
    // TODO: description
    fields: () => ({
      pageInfo: {
        type: new GraphQLNonNull(_pageInfoType),
        resolve: source => source,
        // TODO: description
      },
      totalCount: {
        type: GraphQLInt,
        resolve: ({ paginator, condition }, args, context) => paginator.count(context, condition),
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
    }),
  })
}

const getEdgeType = memoize2(_createEdgeType)

/**
 * Creates a concrete GraphQL edge object type.
 */
export function _createEdgeType <TValue, TCursor>(
  buildToken: BuildToken,
  paginator: Paginator<TValue, TCursor>,
): GraphQLObjectType<Edge<TValue, TCursor>> {
  const gqlType = getType(buildToken, paginator.getType(), false)

  return new GraphQLObjectType<Edge<TValue, TCursor>>({
    name: formatName.type(`${paginator.getName()}-edge`),
    // TODO: description
    fields: () => ({
      cursor: {
        type: new GraphQLNonNull(_cursorType),
        resolve: ({ paginator, ordering, cursor }): NamespacedCursor<TCursor> => ({
          paginatorName: paginator.getName(),
          orderingName: ordering ? ordering.name : null,
          cursor,
        }),
        // TODO: description
      },
      node: {
        type: gqlType,
        resolve: ({ value }) => value,
        // TODO: description
      },
    }),
  })
}

const getOrderByEnumType = memoize2(_createOrderByEnumType)

/**
 * Creates a GraphQL type which can be used by the user to select an ordering
 * strategy.
 */
export function _createOrderByEnumType <TValue, TCursor>(
  buildToken: BuildToken,
  paginator: Paginator<TValue, TCursor>,
): GraphQLEnumType<Paginator.Ordering> {
  return new GraphQLEnumType<Paginator.Ordering>({
    name: formatName.type(`${paginator.getName()}-order-by`),
    // TODO: description
    values: buildObject<GraphQLEnumValueConfig<Paginator.Ordering>>(
      paginator.getOrderings().map<[string, GraphQLEnumValueConfig<Paginator.Ordering>]>(ordering =>
        [formatName.enumValue(ordering.name), { value: ordering }]
      )
    ),
  })
}

/**
 * The cursor type is a scalar string type that represents a single edge in a
 * connection.
 *
 * @private
 */
export const _cursorType: GraphQLScalarType<NamespacedCursor<mixed>> =
  new GraphQLScalarType<NamespacedCursor<mixed>>({
    name: 'Cursor',
    // TODO: description
    serialize: value => serializeCursor(value),
    parseValue: value => typeof value === 'string' ? deserializeCursor(value) : null,
    parseLiteral: ast => ast.kind === Kind.STRING ? deserializeCursor(ast.value) : null
  })

/**
 * Takes a namespaced cursor and serializes it into a base64 encoded
 * string.
 *
 * @private
 */
function serializeCursor ({ paginatorName, orderingName, cursor }: NamespacedCursor<any>): string {
  return new Buffer(JSON.stringify([paginatorName, orderingName, cursor])).toString('base64')
}

/**
 * Deserializes a base64 encoded namespace cursor into the correct data type.
 *
 * @private
 */
function deserializeCursor (serializedCursor: string): NamespacedCursor<any> {
  const [paginatorName, orderingName, cursor] = JSON.parse(new Buffer(serializedCursor, 'base64').toString())
  return { paginatorName, orderingName, cursor }
}

/**
 * The page info type contains information about the current page of results
 * returned by the connection.
 *
 * @private
 */
export const _pageInfoType: GraphQLObjectType<Connection<mixed, mixed>> =
  new GraphQLObjectType<Connection<mixed, mixed>>({
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
        type: _cursorType,
        resolve: ({ paginator, ordering, page }): NamespacedCursor<any> => ({
          paginatorName: paginator.getName(),
          orderingName: ordering ? ordering.name : null,
          cursor: page.values[0].cursor,
        }),
        // TODO: description
      },
      endCursor: {
        type: _cursorType,
        resolve: ({ paginator, ordering, page }): NamespacedCursor<any> => ({
          paginatorName: paginator.getName(),
          orderingName: ordering ? ordering.name : null,
          cursor: page.values[page.values.length - 1].cursor,
        }),
        // TODO: description
      },
    },
  })

/**
 * This is the type for the value of all connection types. It contains the
 * paginator for identification, ordering for cursor serialization, condition
 * for fetching the correct count, and of course the actual page of data.
 *
 * @private
 */
interface Connection<TValue, TCursor> {
  paginator: Paginator<TValue, TCursor>
  ordering: Paginator.Ordering | undefined
  condition: Condition
  page: Paginator.Page<TValue, TCursor>
}

/**
 * This is the type for the value of all edge types. Similarly to the
 * connection value it has a paginator for identification, ordering for cursor
 * serialization, and of course a value and its associated cursor.
 *
 * @private
 */
interface Edge<TValue, TCursor> {
  paginator: Paginator<TValue, TCursor>
  ordering: Paginator.Ordering | undefined
  cursor: TCursor
  value: TValue
}

/**
 * A namespaced cursor is a cursor with identifying information. A cursor that
 * was returned by one paginator can not be used by another paginator and a
 * cursor created with one ordering can not be used with another ordering.
 * Therefore we need to serialize this information with our cursor to make the
 * appropriate checks and ensure the cursor is valid for our resolve context.
 *
 * @private
 */
type NamespacedCursor<TCursor> = {
  paginatorName: string,
  orderingName: string | null,
  cursor: TCursor,
}
