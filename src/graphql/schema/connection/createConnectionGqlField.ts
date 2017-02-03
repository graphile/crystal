import {
  GraphQLScalarType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLFieldConfig,
  GraphQLArgumentConfig,
  GraphQLEnumType,
  GraphQLEnumValueConfig,
  GraphQLList,
  GraphQLBoolean,
  GraphQLInt,
  Kind,
} from 'graphql'
import { Paginator } from '../../../interface'
import { buildObject, formatName, memoize2, scrib } from '../../utils'
import getGqlOutputType from '../type/getGqlOutputType'
import BuildToken from '../BuildToken'

// TODO: doc
export default function createConnectionGqlField <TSource, TInput, TItemValue>(
  buildToken: BuildToken,
  paginator: Paginator<TInput, TItemValue>,
  config: {
    description?: string,
    inputArgEntries?: Array<[string, GraphQLArgumentConfig]>,
    getPaginatorInput: (source: TSource, args: { [key: string]: mixed }) => TInput,
  },
): GraphQLFieldConfig<TSource, Connection<TInput, TItemValue, mixed>> {
  const { gqlType } = getGqlOutputType(buildToken, paginator.itemType)

  // This is the type of all the connection arguments.
  type ConnectionArgs<TCursor> = {
    orderBy: string,
    before?: NamespacedCursor<TCursor>,
    after?: NamespacedCursor<TCursor>,
    first?: number,
    last?: number,
    offset?: number,
  }

  return {
    description: config.description || `Reads and enables paginatation through a set of ${scrib.type(gqlType)}.`,
    type: getConnectionGqlType(buildToken, paginator),
    relatedGqlType: gqlType,
    args: buildObject<GraphQLArgumentConfig>([
      // Only include an `orderBy` field if there are ways in which we can
      // order.
      paginator.orderings && paginator.orderings.size > 0 && ['orderBy', createOrderByGqlArg(buildToken, paginator)],
      ['before', {
        description: 'Read all values in the set before (above) this cursor.',
        type: _cursorType,
      }],
      ['after', {
        description: 'Read all values in the set after (below) this cursor.',
        type: _cursorType,
      }],
      ['first', {
        description: 'Only read the first `n` values of the set.',
        type: GraphQLInt,
      }],
      ['last', {
        description: 'Only read the last `n` values of the set.',
        type: GraphQLInt,
      }],
      ['offset', {
        description: 'Skip the first `n` values from our `after` cursor, an alternative to cursor based pagination. May not be used with `last`.',
        type: GraphQLInt,
      }],
      // Add all of the field entries that will eventually make up our
      // condition.
      ...(config.inputArgEntries ? config.inputArgEntries : []),
    ]),
    // Note that this resolver is an arrow function. This is so that we can
    // keep the correct `this` reference.
    async resolve <TCursor>(
      source: TSource,
      args: ConnectionArgs<TCursor>,
      context: mixed,
      resolveInfo: mixed,
    ): Promise<Connection<TInput, TItemValue, TCursor>> {
      const {
        orderBy: orderingName,
        before: beforeCursor,
        after: afterCursor,
        first,
        last,
        offset: _offset,
      } = args

      // Throw an error if the user is trying to use a cursor from another
      // ordering. Note that if no ordering is defined we expect the
      // `orderingName` to be `null`. This is because when we deserialize the
      // base64 encoded JSON any undefineds will become nulls.
      if (beforeCursor && beforeCursor.orderingName !== orderingName)
        throw new Error('`before` cursor can not be used for this `orderBy` value.')
      if (afterCursor && afterCursor.orderingName !== orderingName)
        throw new Error('`after` cursor can not be used for this `orderBy` value.')

      // Don’t allow the use of cursors with `offset`.
      if (beforeCursor != null && _offset != null || beforeCursor != null && _offset != null)
        throw new Error('Cannot use `before`/`after` cursors with `offset`!')

      // Get our input.
      const input = config.getPaginatorInput(source, args)

      // Construct the page config.
      const pageConfig: Paginator.PageConfig<TCursor> = {
        beforeCursor: beforeCursor && beforeCursor.cursor,
        afterCursor: afterCursor && afterCursor.cursor,
        first,
        last,
        _offset,
      }

      // Get our ordering.
      const ordering = paginator.orderings.get(orderingName) as Paginator.Ordering<TInput, TItemValue, TCursor>

      // Finally, actually get the page data.
      const page = await ordering.readPage(context, input, pageConfig, resolveInfo, gqlType)

      return {
        paginator,
        orderingName,
        input,
        page,
      }
    },
  }
}

const getConnectionGqlType = memoize2(_createConnectionGqlType)

/**
 * Creates a concrete GraphQL connection object type.
 */
export function _createConnectionGqlType <TInput, TItemValue>(
  buildToken: BuildToken,
  paginator: Paginator<TInput, TItemValue>,
): GraphQLObjectType {
  const { gqlType } = getGqlOutputType(buildToken, paginator.itemType)
  const gqlEdgeType = getEdgeGqlType(buildToken, paginator)

  return new GraphQLObjectType({
    name: formatName.type(`${paginator.name}-connection`),
    description: `A connection to a list of ${scrib.type(gqlType)} values.`,
    relatedGqlType: gqlType,
    fields: () => ({
      pageInfo: {
        description: 'Information to aid in pagination.',
        type: new GraphQLNonNull(_pageInfoType),
        resolve: source => source,
      },
      totalCount: {
        description: `The count of *all* ${scrib.type(gqlType)} you could get from the connection.`,
        type: GraphQLInt,
        resolve: ({ input }, _args, context) =>
          paginator.count(context, input),
      },
      edges: {
        description: `A list of edges which contains the ${scrib.type(gqlType)} and cursor to aid in pagination.`,
        relatedGqlType: gqlType,
        type: new GraphQLList(gqlEdgeType),
        resolve: <TCursor>({ orderingName, page }: Connection<TInput, TItemValue, TCursor>): Array<Edge<TInput, TItemValue, TCursor>> =>
          page.values.map(({ cursor, value }) => ({ paginator, orderingName, cursor, value })),
      },
      nodes: {
        description: `A list of ${scrib.type(gqlType)} objects.`,
        relatedGqlType: gqlType,
        type: new GraphQLList(gqlType),
        resolve: ({ page }: Connection<TInput, TItemValue, mixed>): Array<TItemValue> =>
          page.values.map(({ value }) => value),
      },
    }),
  })
}

export const getEdgeGqlType = memoize2(_createEdgeGqlType)

/**
 * Creates a concrete GraphQL edge object type.
 */
export function _createEdgeGqlType <TInput, TItemValue>(
  buildToken: BuildToken,
  paginator: Paginator<TInput, TItemValue>,
): GraphQLObjectType {
  const { gqlType } = getGqlOutputType(buildToken, paginator.itemType)

  return new GraphQLObjectType({
    name: formatName.type(`${paginator.name}-edge`),
    description: `A ${scrib.type(gqlType)} edge in the connection.`,
    fields: () => ({
      cursor: {
        description: 'A cursor for use in pagination.',
        type: _cursorType,
        resolve: <TCursor>({ orderingName, cursor }: Edge<TInput, TItemValue, TCursor>): NamespacedCursor<TCursor> | null =>
          cursor && { orderingName, cursor },
      },
      node: {
        description: `The ${scrib.type(gqlType)} at the end of the edge.`,
        type: gqlType,
        resolve: ({ value }) => value,
      },
    }),
  })
}

/**
 * Creates an argument for the `orderBy` field. The argument will be a correct
 * ordering value for the paginator.
 */
export function createOrderByGqlArg <TInput, TItemValue>(
  buildToken: BuildToken,
  paginator: Paginator<TInput, TItemValue>,
): GraphQLArgumentConfig {
  const { gqlType } = getGqlOutputType(buildToken, paginator.itemType)
  const enumType = getOrderByGqlEnumType(buildToken, paginator)

  return {
    description: `The method to use when ordering ${scrib.type(gqlType)}.`,
    type: enumType,
    defaultValue: Array.from(paginator.orderings).find(([, ordering]) => ordering === paginator.defaultOrdering)![0],
  }
}

const _getOrderByGqlEnumType = memoize2(_createOrderByGqlEnumType)

// We use a second `getOrderByEnumType` so we can maintain the function
// prototype which gets mangled in memoization.
function getOrderByGqlEnumType <TInput, TItemValue>(
  buildToken: BuildToken,
  paginator: Paginator<TInput, TItemValue>,
): GraphQLEnumType {
  return _getOrderByGqlEnumType(buildToken, paginator)
}

/**
 * Creates a GraphQL type which can be used by the user to select an ordering
 * strategy.
 */
export function _createOrderByGqlEnumType <TInput, TItemValue>(
  buildToken: BuildToken,
  paginator: Paginator<TInput, TItemValue>,
): GraphQLEnumType {
  const { gqlType } = getGqlOutputType(buildToken, paginator.itemType)

  return new GraphQLEnumType({
    name: formatName.type(`${paginator.name}-order-by`),
    description: `Methods to use when ordering ${scrib.type(gqlType)}.`,
    values: buildObject(
      Array.from(paginator.orderings)
        .map<[string, GraphQLEnumValueConfig]>(
          ordering => [formatName.enumValue(ordering[0]), { value: ordering[0] }],
        ),
    ),
  })
}

/**
 * The cursor type is a scalar string type that represents a single edge in a
 * connection.
 *
 * @private
 */
export const _cursorType: GraphQLScalarType =
  new GraphQLScalarType({
    name: 'Cursor',
    description: 'A location in a connection that can be used for resuming pagination.',
    serialize: value => serializeCursor(value),
    parseValue: value => typeof value === 'string' ? deserializeCursor(value) : null,
    parseLiteral: ast => ast.kind === Kind.STRING ? deserializeCursor(ast.value) : null,
  })

/**
 * Takes a namespaced cursor and serializes it into a base64 encoded
 * string.
 *
 * @private
 */
function serializeCursor ({ orderingName, cursor }: NamespacedCursor<mixed>): string {
  return new Buffer(JSON.stringify([orderingName, cursor])).toString('base64')
}

/**
 * Deserializes a base64 encoded namespace cursor into the correct data type.
 *
 * @private
 */
function deserializeCursor (serializedCursor: string): NamespacedCursor<mixed> {
  const [orderingName, cursor] = JSON.parse(new Buffer(serializedCursor, 'base64').toString())
  return { orderingName, cursor }
}

/**
 * The page info type contains information about the current page of results
 * returned by the connection.
 *
 * @private
 */
export const _pageInfoType: GraphQLObjectType =
  new GraphQLObjectType({
    name: 'PageInfo',
    description: 'Information about pagination in a connection.',
    fields: {
      hasNextPage: {
        description: 'When paginating forwards, are there more items?',
        type: new GraphQLNonNull(GraphQLBoolean),
        resolve: ({ page }) => page.hasNextPage(),
      },
      hasPreviousPage: {
        description: 'When paginating backwards, are there more items?',
        type: new GraphQLNonNull(GraphQLBoolean),
        resolve: ({ page }) => page.hasPreviousPage(),
      },
      startCursor: {
        description: 'When paginating backwards, the cursor to continue.',
        type: _cursorType,
        resolve: ({ orderingName, page }): NamespacedCursor<mixed> | null =>
          page.values[0]
            ? { orderingName, cursor: page.values[0].cursor }
            : null,
      },
      endCursor: {
        description: 'When paginating forwards, the cursor to continue.',
        type: _cursorType,
        resolve: ({ orderingName, page }): NamespacedCursor<mixed> | null =>
          page.values[page.values.length - 1]
            ? { orderingName, cursor: page.values[page.values.length - 1].cursor }
            : null,
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
interface Connection<TInput, TItemValue, TCursor> {
  paginator: Paginator<TInput, TItemValue>
  orderingName: string
  input: TInput
  page: Paginator.Page<TItemValue, TCursor>
}

/**
 * This is the type for the value of all edge types. Similarly to the
 * connection value it has a paginator for identification, ordering for cursor
 * serialization, and of course a value and its associated cursor.
 *
 * @private
 */
interface Edge<TInput, TItemValue, TCursor> {
  paginator: Paginator<TInput, TItemValue>
  orderingName: string
  cursor: TCursor | null
  value: TItemValue
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
