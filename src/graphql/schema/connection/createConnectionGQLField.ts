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
import { Paginator, Type, NullableType, ObjectType } from '../../../interface'
import { buildObject, formatName, memoize2, scrib } from '../../utils'
import getGQLType from '../getGQLType'
import BuildToken from '../BuildToken'
import transformGQLInputValue from '../transformGQLInputValue'

// TODO: doc
export default function createConnectionGQLField <TSource, TInput, TItemValue>(
  buildToken: BuildToken,
  paginator: Paginator<TInput, TItemValue>,
  config: {
    inputArgEntries?: Array<[string, GraphQLArgumentConfig<mixed>]>,
    getPaginatorInput: (source: TSource, args: { [key: string]: mixed }) => TInput,
  },
): GraphQLFieldConfig<TSource, Connection<TInput, TItemValue, mixed>> {
  const paginatorName = paginator.name
  const gqlType = getGQLType(buildToken, paginator.itemType, false)

  // This is the type of all the connection arguments.
  type ConnectionArgs<TCursor> = {
    orderBy: string,
    before?: NamespacedCursor<TCursor>,
    after?: NamespacedCursor<TCursor>,
    first?: number,
    last?: number,
    input: TInput,
  }

  return {
    description: `Reads and enables paginatation through a set of ${scrib.type(gqlType)}.`,
    type: getConnectionGQLType(buildToken, paginator),
    args: buildObject<GraphQLArgumentConfig<mixed>>([
      // Only include an `orderBy` field if there are ways in which we can
      // order.
      paginator.orderings && paginator.orderings.size > 0 && ['orderBy', createOrderByGQLArg(buildToken, paginator)],
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
    ): Promise<Connection<TInput, TItemValue, TCursor>> {
      const {
        orderBy: orderingName,
        before: beforeCursor,
        after: afterCursor,
        first,
        last,
      } = args

      // Throw an error if the user is trying to use a cursor from another
      // ordering. Note that if no ordering is defined we expect the
      // `orderingName` to be `null`. This is because when we deserialize the
      // base64 encoded JSON any undefineds will become nulls.
      if (beforeCursor && beforeCursor.orderingName !== orderingName)
        throw new Error('`before` cursor can not be used for this `orderBy` value.')
      if (afterCursor && afterCursor.orderingName !== orderingName)
        throw new Error('`after` cursor can not be used for this `orderBy` value.')

      // Get our input.
      const input = config.getPaginatorInput(source, args)

      // Construct the page config.
      const pageConfig: Paginator.PageConfig<TCursor> = {
        beforeCursor: beforeCursor && beforeCursor.cursor,
        afterCursor: afterCursor && afterCursor.cursor,
        first,
        last,
      }

      // Get our ordering.
      const ordering = paginator.orderings.get(orderingName) as Paginator.Ordering<TInput, TItemValue, TCursor>

      // Finally, actually get the page data.
      const page = await ordering.readPage(context, input, pageConfig)

      return {
        paginator,
        orderingName,
        input,
        page,
      }
    },
  }
}

const getConnectionGQLType = memoize2(_createConnectionGQLType)

/**
 * Creates a concrete GraphQL connection object type.
 */
export function _createConnectionGQLType <TInput, TItemValue>(
  buildToken: BuildToken,
  paginator: Paginator<TInput, TItemValue>,
): GraphQLObjectType<Connection<TInput, TItemValue, mixed>> {
  const gqlType = getGQLType(buildToken, paginator.itemType, false)
  const gqlEdgeType = getEdgeGQLType(buildToken, paginator)

  return new GraphQLObjectType<Connection<TInput, TItemValue, mixed>>({
    name: formatName.type(`${paginator.name}-connection`),
    description: `A connection to a list of ${scrib.type(gqlType)} values.`,
    fields: () => ({
      pageInfo: {
        description: 'Information to aid in pagination.',
        type: new GraphQLNonNull(_pageInfoType),
        resolve: source => source,
      },
      totalCount: {
        description: `The count of *all* ${scrib.type(gqlType)} you could get from the connection.`,
        type: GraphQLInt,
        resolve: ({ paginator, input }, args, context) =>
          paginator.count(context, input),
      },
      edges: {
        description: `A list of edges which contains the ${scrib.type(gqlType)} and cursor to aid in pagination.`,
        type: new GraphQLList(gqlEdgeType),
        resolve: <TCursor>({ paginator, orderingName, page }: Connection<TInput, TItemValue, TCursor>): Array<Edge<TInput, TItemValue, TCursor>> =>
          page.values.map(({ cursor, value }) => ({ paginator, orderingName, cursor, value })),
      },
      nodes: {
        description: `A list of ${scrib.type(gqlType)} objects.`,
        type: new GraphQLList(gqlType),
        resolve: ({ page }): Array<TItemValue> =>
          page.values.map(({ value }) => value),
      },
    }),
  })
}

export const getEdgeGQLType = memoize2(_createEdgeGQLType)

/**
 * Creates a concrete GraphQL edge object type.
 */
export function _createEdgeGQLType <TInput, TItemValue>(
  buildToken: BuildToken,
  paginator: Paginator<TInput, TItemValue>,
): GraphQLObjectType<Edge<TInput, TItemValue, mixed>> {
  const gqlType = getGQLType(buildToken, paginator.itemType, false)

  return new GraphQLObjectType<Edge<TInput, TItemValue, mixed>>({
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
export function createOrderByGQLArg <TInput, TItemValue>(
  buildToken: BuildToken,
  paginator: Paginator<TInput, TItemValue>,
): GraphQLArgumentConfig<string> {
  const gqlType = getGQLType(buildToken, paginator.itemType, false)
  const enumType = getOrderByGQLEnumType(buildToken, paginator)
  return {
    description: `The method to use when ordering ${scrib.type(gqlType)}.`,
    type: enumType,
    defaultValue: Array.from(paginator.orderings).find(([name, ordering]) => ordering === paginator.defaultOrdering)![0],
  }
}

const _getOrderByGQLEnumType = memoize2(_createOrderByGQLEnumType)

// We use a second `getOrderByEnumType` so we can maintain the function
// prototype which gets mangled in memoization.
function getOrderByGQLEnumType <TInput, TItemValue>(
  buildToken: BuildToken,
  paginator: Paginator<TInput, TItemValue>,
): GraphQLEnumType<string> {
  return _getOrderByGQLEnumType(buildToken, paginator)
}

/**
 * Creates a GraphQL type which can be used by the user to select an ordering
 * strategy.
 */
export function _createOrderByGQLEnumType <TInput, TItemValue>(
  buildToken: BuildToken,
  paginator: Paginator<TInput, TItemValue>,
): GraphQLEnumType<string> {
  const gqlType = getGQLType(buildToken, paginator.itemType, false)

  return new GraphQLEnumType({
    name: formatName.type(`${paginator.name}-order-by`),
    description: `Methods to use when ordering ${scrib.type(gqlType)}.`,
    values: buildObject(
      Array.from(paginator.orderings)
        .map<[string, GraphQLEnumValueConfig<string>]>(
          ordering => [formatName.enumValue(ordering[0]), { value: ordering[0] }]
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
    description: 'A location in a connection that can be used for resuming pagination.',
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
export const _pageInfoType: GraphQLObjectType<Connection<mixed, mixed, mixed>> =
  new GraphQLObjectType<Connection<mixed, mixed, mixed>>({
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
        resolve: ({ orderingName, page }): NamespacedCursor<mixed> => ({
          orderingName: orderingName,
          cursor: page.values[0].cursor,
        }),
      },
      endCursor: {
        description: 'When paginating forwards, the cursor to continue.',
        type: _cursorType,
        resolve: ({ orderingName, page }): NamespacedCursor<any> => ({
          orderingName: orderingName,
          cursor: page.values[page.values.length - 1].cursor,
        }),
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
