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

import { Context, Paginator, Condition, Type } from '../../../interface'
import { buildObject, formatName, memoize2 } from '../../utils'
import getType from '../getType'
import BuildToken from '../BuildToken'

// TODO: doc
export default function createConnectionField <TValue, TOrdering extends Paginator.Ordering, TCursor, TCondition>(
  buildToken: BuildToken,
  paginator: Paginator<TValue, TOrdering, TCursor>,
  config: {
    conditionType?: GraphQLInputType<TCondition>,
    getCondition?: (source: mixed, conditionValue: TCondition | undefined) => Condition,
  } = {},
): GraphQLFieldConfig<mixed, Connection<TValue, TOrdering, TCursor>> {
  const paginatorName = paginator.name

  // This is the type of all the connection arguments.
  type ConnectionArgs = {
    orderBy: TOrdering,
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
      paginator.orderings && paginator.orderings.length > 0 && ['orderBy', createOrderByArg(buildToken, paginator)],
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
    async resolve (
      source: mixed,
      args: ConnectionArgs,
      context: mixed,
      info: GraphQLResolveInfo<mixed, mixed>,
    ): Promise<Connection<TValue, TOrdering, TCursor>> {
      if (!(context instanceof Context))
        throw new Error('GraphQL context must be an instance of `Context`.')

      const {
        orderBy: ordering = paginator.defaultOrdering,
        before: beforeCursor,
        after: afterCursor,
        first,
        last,
        condition: argCondition,
      } = args

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
      const pageConfig: Paginator.PageConfig<TOrdering, TCursor> = {
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
export function _createConnectionType <TValue, TOrdering extends Paginator.Ordering, TCursor>(
  buildToken: BuildToken,
  paginator: Paginator<TValue, TOrdering, TCursor>,
): GraphQLObjectType<Connection<TValue, TOrdering, TCursor>> {
  const gqlType = getType(buildToken, paginator.type, false)
  const gqlEdgeType = getEdgeType(buildToken, paginator)

  return new GraphQLObjectType<Connection<TValue, TOrdering, TCursor>>({
    name: formatName.type(`${paginator.name}-connection`),
    // TODO: description
    fields: () => ({
      pageInfo: {
        type: new GraphQLNonNull(_pageInfoType),
        resolve: source => source,
        // TODO: description
      },
      totalCount: {
        type: GraphQLInt,
        resolve: ({ paginator, condition }, args, context) => {
          if (!(context instanceof Context))
            throw new Error('GraphQL context must be an instance of `Context`.')

          return paginator.count(context, condition)
        },
        // TODO: description
      },
      edges: {
        type: new GraphQLList(gqlEdgeType),
        resolve: ({ paginator, ordering, page }): Array<Edge<TValue, TOrdering, TCursor>> =>
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

export const getEdgeType = memoize2(_createEdgeType)

/**
 * Creates a concrete GraphQL edge object type.
 */
export function _createEdgeType <TValue, TOrdering extends Paginator.Ordering, TCursor>(
  buildToken: BuildToken,
  paginator: Paginator<TValue, TOrdering, TCursor>,
): GraphQLObjectType<Edge<TValue, TOrdering, TCursor>> {
  const gqlType = getType(buildToken, paginator.type, false)

  return new GraphQLObjectType<Edge<TValue, TOrdering, TCursor>>({
    name: formatName.type(`${paginator.name}-edge`),
    // TODO: description
    fields: () => ({
      cursor: {
        type: new GraphQLNonNull(_cursorType),
        resolve: ({ ordering, cursor }): NamespacedCursor<TCursor> => ({
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

/**
 * Creates an argument for the `orderBy` field. The argument will be a correct
 * ordering value for the paginator.
 */
export function createOrderByArg <TValue, TOrdering extends Paginator.Ordering, TCursor>(
  buildToken: BuildToken,
  paginator: Paginator<TValue, TOrdering, TCursor>,
) {
  return {
    // TODO: description
    type: getOrderByEnumType(buildToken, paginator),
    defaultValue: paginator.defaultOrdering,
  }
}

const getOrderByEnumType = memoize2(_createOrderByEnumType)

/**
 * Creates a GraphQL type which can be used by the user to select an ordering
 * strategy.
 */
export function _createOrderByEnumType <TValue, TOrdering extends Paginator.Ordering, TCursor>(
  buildToken: BuildToken,
  paginator: Paginator<TValue, TOrdering, TCursor>,
): GraphQLEnumType<Paginator.Ordering> {
  return new GraphQLEnumType<Paginator.Ordering>({
    name: formatName.type(`${paginator.name}-order-by`),
    // TODO: description
    values: buildObject<GraphQLEnumValueConfig<Paginator.Ordering>>(
      paginator.orderings.map<[string, GraphQLEnumValueConfig<Paginator.Ordering>]>(ordering =>
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
function serializeCursor ({ orderingName, cursor }: NamespacedCursor<any>): string {
  return new Buffer(JSON.stringify([orderingName, cursor])).toString('base64')
}

/**
 * Deserializes a base64 encoded namespace cursor into the correct data type.
 *
 * @private
 */
function deserializeCursor (serializedCursor: string): NamespacedCursor<any> {
  const [orderingName, cursor] = JSON.parse(new Buffer(serializedCursor, 'base64').toString())
  return { orderingName, cursor }
}

/**
 * The page info type contains information about the current page of results
 * returned by the connection.
 *
 * @private
 */
export const _pageInfoType: GraphQLObjectType<Connection<mixed, Paginator.Ordering, mixed>> =
  new GraphQLObjectType<Connection<mixed, Paginator.Ordering, mixed>>({
    name: 'PageInfo',
    // TODO: description
    fields: {
      hasNextPage: {
        type: new GraphQLNonNull(GraphQLBoolean),
        resolve: ({ page }) => page.hasNextPage(),
        // TODO: description
      },
      hasPreviousPage: {
        type: new GraphQLNonNull(GraphQLBoolean),
        resolve: ({ page }) => page.hasPreviousPage(),
        // TODO: description
      },
      startCursor: {
        type: _cursorType,
        resolve: ({ ordering, page }): NamespacedCursor<any> => ({
          orderingName: ordering ? ordering.name : null,
          cursor: page.values[0].cursor,
        }),
        // TODO: description
      },
      endCursor: {
        type: _cursorType,
        resolve: ({ ordering, page }): NamespacedCursor<any> => ({
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
interface Connection<TValue, TOrdering extends Paginator.Ordering, TCursor> {
  paginator: Paginator<TValue, TOrdering, TCursor>
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
interface Edge<TValue, TOrdering extends Paginator.Ordering, TCursor> {
  paginator: Paginator<TValue, TOrdering, TCursor>
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
  // TODO: Evaluate if we really want to enforce paginator name checks.
  // paginatorName: string,
  orderingName: string | null,
  cursor: TCursor,
}
