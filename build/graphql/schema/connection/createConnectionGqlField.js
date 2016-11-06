"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const graphql_1 = require('graphql');
const utils_1 = require('../../utils');
const getGqlType_1 = require('../getGqlType');
// TODO: doc
function createConnectionGqlField(buildToken, paginator, config) {
    const gqlType = getGqlType_1.default(buildToken, paginator.itemType, false);
    return {
        description: config.description || `Reads and enables paginatation through a set of ${utils_1.scrib.type(gqlType)}.`,
        type: getConnectionGqlType(buildToken, paginator),
        args: utils_1.buildObject([
            // Only include an `orderBy` field if there are ways in which we can
            // order.
            paginator.orderings && paginator.orderings.size > 0 && ['orderBy', createOrderByGqlArg(buildToken, paginator)],
            ['before', {
                    description: 'Read all values in the set before (above) this cursor.',
                    type: exports._cursorType,
                }],
            ['after', {
                    description: 'Read all values in the set after (below) this cursor.',
                    type: exports._cursorType,
                }],
            ['first', {
                    description: 'Only read the first `n` values of the set.',
                    type: graphql_1.GraphQLInt,
                }],
            ['last', {
                    description: 'Only read the last `n` values of the set.',
                    type: graphql_1.GraphQLInt,
                }],
            ['offset', {
                    description: 'Skip the first `n` values from our `after` cursor, an alternative to cursor based pagination. May not be used with `last`.',
                    type: graphql_1.GraphQLInt,
                }],
            // Add all of the field entries that will eventually make up our
            // condition.
            ...(config.inputArgEntries ? config.inputArgEntries : []),
        ]),
        // Note that this resolver is an arrow function. This is so that we can
        // keep the correct `this` reference.
        resolve(source, args, context) {
            return __awaiter(this, void 0, void 0, function* () {
                const { orderBy: orderingName, before: beforeCursor, after: afterCursor, first, last, offset: _offset, } = args;
                // Throw an error if the user is trying to use a cursor from another
                // ordering. Note that if no ordering is defined we expect the
                // `orderingName` to be `null`. This is because when we deserialize the
                // base64 encoded JSON any undefineds will become nulls.
                if (beforeCursor && beforeCursor.orderingName !== orderingName)
                    throw new Error('`before` cursor can not be used for this `orderBy` value.');
                if (afterCursor && afterCursor.orderingName !== orderingName)
                    throw new Error('`after` cursor can not be used for this `orderBy` value.');
                // Don’t allow the use of cursors with `offset`.
                if (beforeCursor != null && _offset != null || beforeCursor != null && _offset != null)
                    throw new Error('Cannot use `before`/`after` cursors with `offset`!');
                // Get our input.
                const input = config.getPaginatorInput(source, args);
                // Construct the page config.
                const pageConfig = {
                    beforeCursor: beforeCursor && beforeCursor.cursor,
                    afterCursor: afterCursor && afterCursor.cursor,
                    first,
                    last,
                    _offset,
                };
                // Get our ordering.
                const ordering = paginator.orderings.get(orderingName);
                // Finally, actually get the page data.
                const page = yield ordering.readPage(context, input, pageConfig);
                return {
                    paginator,
                    orderingName,
                    input,
                    page,
                };
            });
        },
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createConnectionGqlField;
const getConnectionGqlType = utils_1.memoize2(_createConnectionGqlType);
/**
 * Creates a concrete GraphQL connection object type.
 */
function _createConnectionGqlType(buildToken, paginator) {
    const gqlType = getGqlType_1.default(buildToken, paginator.itemType, false);
    const gqlEdgeType = exports.getEdgeGqlType(buildToken, paginator);
    return new graphql_1.GraphQLObjectType({
        name: utils_1.formatName.type(`${paginator.name}-connection`),
        description: `A connection to a list of ${utils_1.scrib.type(gqlType)} values.`,
        fields: () => ({
            pageInfo: {
                description: 'Information to aid in pagination.',
                type: new graphql_1.GraphQLNonNull(exports._pageInfoType),
                resolve: source => source,
            },
            totalCount: {
                description: `The count of *all* ${utils_1.scrib.type(gqlType)} you could get from the connection.`,
                type: graphql_1.GraphQLInt,
                resolve: ({ input }, args, context) => paginator.count(context, input),
            },
            edges: {
                description: `A list of edges which contains the ${utils_1.scrib.type(gqlType)} and cursor to aid in pagination.`,
                type: new graphql_1.GraphQLList(gqlEdgeType),
                resolve: ({ orderingName, page }) => page.values.map(({ cursor, value }) => ({ paginator, orderingName, cursor, value })),
            },
            nodes: {
                description: `A list of ${utils_1.scrib.type(gqlType)} objects.`,
                type: new graphql_1.GraphQLList(gqlType),
                resolve: ({ page }) => page.values.map(({ value }) => value),
            },
        }),
    });
}
exports._createConnectionGqlType = _createConnectionGqlType;
exports.getEdgeGqlType = utils_1.memoize2(_createEdgeGqlType);
/**
 * Creates a concrete GraphQL edge object type.
 */
function _createEdgeGqlType(buildToken, paginator) {
    const gqlType = getGqlType_1.default(buildToken, paginator.itemType, false);
    return new graphql_1.GraphQLObjectType({
        name: utils_1.formatName.type(`${paginator.name}-edge`),
        description: `A ${utils_1.scrib.type(gqlType)} edge in the connection.`,
        fields: () => ({
            cursor: {
                description: 'A cursor for use in pagination.',
                type: exports._cursorType,
                resolve: ({ orderingName, cursor }) => cursor && { orderingName, cursor },
            },
            node: {
                description: `The ${utils_1.scrib.type(gqlType)} at the end of the edge.`,
                type: gqlType,
                resolve: ({ value }) => value,
            },
        }),
    });
}
exports._createEdgeGqlType = _createEdgeGqlType;
/**
 * Creates an argument for the `orderBy` field. The argument will be a correct
 * ordering value for the paginator.
 */
function createOrderByGqlArg(buildToken, paginator) {
    const gqlType = getGqlType_1.default(buildToken, paginator.itemType, false);
    const enumType = getOrderByGqlEnumType(buildToken, paginator);
    return {
        description: `The method to use when ordering ${utils_1.scrib.type(gqlType)}.`,
        type: enumType,
        defaultValue: Array.from(paginator.orderings).find(([, ordering]) => ordering === paginator.defaultOrdering)[0],
    };
}
exports.createOrderByGqlArg = createOrderByGqlArg;
const _getOrderByGqlEnumType = utils_1.memoize2(_createOrderByGqlEnumType);
// We use a second `getOrderByEnumType` so we can maintain the function
// prototype which gets mangled in memoization.
function getOrderByGqlEnumType(buildToken, paginator) {
    return _getOrderByGqlEnumType(buildToken, paginator);
}
/**
 * Creates a GraphQL type which can be used by the user to select an ordering
 * strategy.
 */
function _createOrderByGqlEnumType(buildToken, paginator) {
    const gqlType = getGqlType_1.default(buildToken, paginator.itemType, false);
    return new graphql_1.GraphQLEnumType({
        name: utils_1.formatName.type(`${paginator.name}-order-by`),
        description: `Methods to use when ordering ${utils_1.scrib.type(gqlType)}.`,
        values: utils_1.buildObject(Array.from(paginator.orderings)
            .map(ordering => [utils_1.formatName.enumValue(ordering[0]), { value: ordering[0] }])),
    });
}
exports._createOrderByGqlEnumType = _createOrderByGqlEnumType;
/**
 * The cursor type is a scalar string type that represents a single edge in a
 * connection.
 *
 * @private
 */
exports._cursorType = new graphql_1.GraphQLScalarType({
    name: 'Cursor',
    description: 'A location in a connection that can be used for resuming pagination.',
    serialize: value => serializeCursor(value),
    parseValue: value => typeof value === 'string' ? deserializeCursor(value) : null,
    parseLiteral: ast => ast.kind === graphql_1.Kind.STRING ? deserializeCursor(ast.value) : null,
});
/**
 * Takes a namespaced cursor and serializes it into a base64 encoded
 * string.
 *
 * @private
 */
function serializeCursor({ orderingName, cursor }) {
    return new Buffer(JSON.stringify([orderingName, cursor])).toString('base64');
}
/**
 * Deserializes a base64 encoded namespace cursor into the correct data type.
 *
 * @private
 */
function deserializeCursor(serializedCursor) {
    const [orderingName, cursor] = JSON.parse(new Buffer(serializedCursor, 'base64').toString());
    return { orderingName, cursor };
}
/**
 * The page info type contains information about the current page of results
 * returned by the connection.
 *
 * @private
 */
exports._pageInfoType = new graphql_1.GraphQLObjectType({
    name: 'PageInfo',
    description: 'Information about pagination in a connection.',
    fields: {
        hasNextPage: {
            description: 'When paginating forwards, are there more items?',
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLBoolean),
            resolve: ({ page }) => page.hasNextPage(),
        },
        hasPreviousPage: {
            description: 'When paginating backwards, are there more items?',
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLBoolean),
            resolve: ({ page }) => page.hasPreviousPage(),
        },
        startCursor: {
            description: 'When paginating backwards, the cursor to continue.',
            type: exports._cursorType,
            resolve: ({ orderingName, page }) => page.values[0]
                ? { orderingName, cursor: page.values[0].cursor }
                : null,
        },
        endCursor: {
            description: 'When paginating forwards, the cursor to continue.',
            type: exports._cursorType,
            resolve: ({ orderingName, page }) => page.values[page.values.length - 1]
                ? { orderingName, cursor: page.values[page.values.length - 1].cursor }
                : null,
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlQ29ubmVjdGlvbkdxbEZpZWxkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2dyYXBocWwvc2NoZW1hL2Nvbm5lY3Rpb24vY3JlYXRlQ29ubmVjdGlvbkdxbEZpZWxkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLDBCQVlPLFNBQ1AsQ0FBQyxDQURlO0FBRWhCLHdCQUF5RCxhQUN6RCxDQUFDLENBRHFFO0FBQ3RFLDZCQUF1QixlQUN2QixDQUFDLENBRHFDO0FBR3RDLFlBQVk7QUFDWixrQ0FDRSxVQUFzQixFQUN0QixTQUF3QyxFQUN4QyxNQUlDO0lBRUQsTUFBTSxPQUFPLEdBQUcsb0JBQVUsQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQTtJQVlqRSxNQUFNLENBQUM7UUFDTCxXQUFXLEVBQUUsTUFBTSxDQUFDLFdBQVcsSUFBSSxtREFBbUQsYUFBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRztRQUM1RyxJQUFJLEVBQUUsb0JBQW9CLENBQUMsVUFBVSxFQUFFLFNBQVMsQ0FBQztRQUNqRCxJQUFJLEVBQUUsbUJBQVcsQ0FBK0I7WUFDOUMsb0VBQW9FO1lBQ3BFLFNBQVM7WUFDVCxTQUFTLENBQUMsU0FBUyxJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxtQkFBbUIsQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDOUcsQ0FBQyxRQUFRLEVBQUU7b0JBQ1QsV0FBVyxFQUFFLHdEQUF3RDtvQkFDckUsSUFBSSxFQUFFLG1CQUFXO2lCQUNsQixDQUFDO1lBQ0YsQ0FBQyxPQUFPLEVBQUU7b0JBQ1IsV0FBVyxFQUFFLHVEQUF1RDtvQkFDcEUsSUFBSSxFQUFFLG1CQUFXO2lCQUNsQixDQUFDO1lBQ0YsQ0FBQyxPQUFPLEVBQUU7b0JBQ1IsV0FBVyxFQUFFLDRD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