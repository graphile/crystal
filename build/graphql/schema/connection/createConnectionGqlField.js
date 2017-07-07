"use strict";
var tslib_1 = require("tslib");
var graphql_1 = require("graphql");
var utils_1 = require("../../utils");
var getGqlOutputType_1 = require("../type/getGqlOutputType");
// TODO: doc
function createConnectionGqlField(buildToken, paginator, config) {
    var gqlType = getGqlOutputType_1.default(buildToken, paginator.itemType).gqlType;
    return {
        description: config.description || "Reads and enables paginatation through a set of " + utils_1.scrib.type(gqlType) + ".",
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
                }]
        ].concat((config.inputArgEntries ? config.inputArgEntries : []))),
        // Note that this resolver is an arrow function. This is so that we can
        // keep the correct `this` reference.
        resolve: function (source, args, context) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var orderingName, beforeCursor, afterCursor, first, last, _offset, input, pageConfig, ordering, page;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            orderingName = args.orderBy, beforeCursor = args.before, afterCursor = args.after, first = args.first, last = args.last, _offset = args.offset;
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
                            input = config.getPaginatorInput(source, args);
                            pageConfig = {
                                beforeCursor: beforeCursor && beforeCursor.cursor,
                                afterCursor: afterCursor && afterCursor.cursor,
                                first: first,
                                last: last,
                                _offset: _offset,
                            };
                            ordering = paginator.orderings.get(orderingName);
                            return [4 /*yield*/, ordering.readPage(context, input, pageConfig)];
                        case 1:
                            page = _a.sent();
                            return [2 /*return*/, {
                                    paginator: paginator,
                                    orderingName: orderingName,
                                    input: input,
                                    page: page,
                                }];
                    }
                });
            });
        },
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createConnectionGqlField;
var getConnectionGqlType = utils_1.memoize2(_createConnectionGqlType);
/**
 * Creates a concrete GraphQL connection object type.
 */
function _createConnectionGqlType(buildToken, paginator) {
    var gqlType = getGqlOutputType_1.default(buildToken, paginator.itemType).gqlType;
    var gqlEdgeType = exports.getEdgeGqlType(buildToken, paginator);
    return new graphql_1.GraphQLObjectType({
        name: utils_1.formatName.type(paginator.name + "-connection"),
        description: "A connection to a list of " + utils_1.scrib.type(gqlType) + " values.",
        fields: function () { return ({
            pageInfo: {
                description: 'Information to aid in pagination.',
                type: new graphql_1.GraphQLNonNull(exports._pageInfoType),
                resolve: function (source) { return source; },
            },
            totalCount: {
                description: "The count of *all* " + utils_1.scrib.type(gqlType) + " you could get from the connection.",
                type: graphql_1.GraphQLInt,
                resolve: function (_a, _args, context) {
                    var input = _a.input;
                    return paginator.count(context, input);
                },
            },
            edges: {
                description: "A list of edges which contains the " + utils_1.scrib.type(gqlType) + " and cursor to aid in pagination.",
                type: new graphql_1.GraphQLList(gqlEdgeType),
                resolve: function (_a) {
                    var orderingName = _a.orderingName, page = _a.page;
                    return page.values.map(function (_a) {
                        var cursor = _a.cursor, value = _a.value;
                        return ({ paginator: paginator, orderingName: orderingName, cursor: cursor, value: value });
                    });
                },
            },
            nodes: {
                description: "A list of " + utils_1.scrib.type(gqlType) + " objects.",
                type: new graphql_1.GraphQLList(gqlType),
                resolve: function (_a) {
                    var page = _a.page;
                    return page.values.map(function (_a) {
                        var value = _a.value;
                        return value;
                    });
                },
            },
        }); },
    });
}
exports._createConnectionGqlType = _createConnectionGqlType;
exports.getEdgeGqlType = utils_1.memoize2(_createEdgeGqlType);
/**
 * Creates a concrete GraphQL edge object type.
 */
function _createEdgeGqlType(buildToken, paginator) {
    var gqlType = getGqlOutputType_1.default(buildToken, paginator.itemType).gqlType;
    return new graphql_1.GraphQLObjectType({
        name: utils_1.formatName.type(paginator.name + "-edge"),
        description: "A " + utils_1.scrib.type(gqlType) + " edge in the connection.",
        fields: function () { return ({
            cursor: {
                description: 'A cursor for use in pagination.',
                type: exports._cursorType,
                resolve: function (_a) {
                    var orderingName = _a.orderingName, cursor = _a.cursor;
                    return cursor && { orderingName: orderingName, cursor: cursor };
                },
            },
            node: {
                description: "The " + utils_1.scrib.type(gqlType) + " at the end of the edge.",
                type: gqlType,
                resolve: function (_a) {
                    var value = _a.value;
                    return value;
                },
            },
        }); },
    });
}
exports._createEdgeGqlType = _createEdgeGqlType;
/**
 * Creates an argument for the `orderBy` field. The argument will be a correct
 * ordering value for the paginator.
 */
function createOrderByGqlArg(buildToken, paginator) {
    var gqlType = getGqlOutputType_1.default(buildToken, paginator.itemType).gqlType;
    var enumType = getOrderByGqlEnumType(buildToken, paginator);
    return {
        description: "The method to use when ordering " + utils_1.scrib.type(gqlType) + ".",
        type: enumType,
        defaultValue: Array.from(paginator.orderings).find(function (_a) {
            var ordering = _a[1];
            return ordering === paginator.defaultOrdering;
        })[0],
    };
}
exports.createOrderByGqlArg = createOrderByGqlArg;
var _getOrderByGqlEnumType = utils_1.memoize2(_createOrderByGqlEnumType);
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
    var gqlType = getGqlOutputType_1.default(buildToken, paginator.itemType).gqlType;
    return new graphql_1.GraphQLEnumType({
        name: utils_1.formatName.type(paginator.name + "-order-by"),
        description: "Methods to use when ordering " + utils_1.scrib.type(gqlType) + ".",
        values: utils_1.buildObject(Array.from(paginator.orderings)
            .map(function (ordering) { return [utils_1.formatName.enumValue(ordering[0]), { value: ordering[0] }]; })),
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
    serialize: function (value) { return serializeCursor(value); },
    parseValue: function (value) { return typeof value === 'string' ? deserializeCursor(value) : null; },
    parseLiteral: function (ast) { return ast.kind === graphql_1.Kind.STRING ? deserializeCursor(ast.value) : null; },
});
/**
 * Takes a namespaced cursor and serializes it into a base64 encoded
 * string.
 *
 * @private
 */
function serializeCursor(_a) {
    var orderingName = _a.orderingName, cursor = _a.cursor;
    return new Buffer(JSON.stringify([orderingName, cursor])).toString('base64');
}
/**
 * Deserializes a base64 encoded namespace cursor into the correct data type.
 *
 * @private
 */
function deserializeCursor(serializedCursor) {
    var _a = JSON.parse(new Buffer(serializedCursor, 'base64').toString()), orderingName = _a[0], cursor = _a[1];
    return { orderingName: orderingName, cursor: cursor };
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
            resolve: function (_a) {
                var page = _a.page;
                return page.hasNextPage();
            },
        },
        hasPreviousPage: {
            description: 'When paginating backwards, are there more items?',
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLBoolean),
            resolve: function (_a) {
                var page = _a.page;
                return page.hasPreviousPage();
            },
        },
        startCursor: {
            description: 'When paginating backwards, the cursor to continue.',
            type: exports._cursorType,
            resolve: function (_a) {
                var orderingName = _a.orderingName, page = _a.page;
                return page.values[0]
                    ? { orderingName: orderingName, cursor: page.values[0].cursor }
                    : null;
            },
        },
        endCursor: {
            description: 'When paginating forwards, the cursor to continue.',
            type: exports._cursorType,
            resolve: function (_a) {
                var orderingName = _a.orderingName, page = _a.page;
                return page.values[page.values.length - 1]
                    ? { orderingName: orderingName, cursor: page.values[page.values.length - 1].cursor }
                    : null;
            },
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlQ29ubmVjdGlvbkdxbEZpZWxkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2dyYXBocWwvc2NoZW1hL2Nvbm5lY3Rpb24vY3JlYXRlQ29ubmVjdGlvbkdxbEZpZWxkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBWWdCO0FBRWhCLHFDQUFzRTtBQUN0RSw2REFBdUQ7QUFHdkQsWUFBWTtBQUNaLGtDQUNFLFVBQXNCLEVBQ3RCLFNBQXdDLEVBQ3hDLE1BSUM7SUFFTyxJQUFBLDRFQUFPLENBQXFEO0lBWXBFLE1BQU0sQ0FBQztRQUNMLFdBQVcsRUFBRSxNQUFNLENBQUMsV0FBVyxJQUFJLHFEQUFtRCxhQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFHO1FBQzVHLElBQUksRUFBRSxvQkFBb0IsQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDO1FBQ2pELElBQUksRUFBRSxtQkFBVztZQUNmLG9FQUFvRTtZQUNwRSxTQUFTO1lBQ1QsU0FBUyxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsbUJBQW1CLENBQUMsVUFBVSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQzlHLENBQUMsUUFBUSxFQUFFO29CQUNULFdBQVcsRUFBRSx3REFBd0Q7b0JBQ3JFLElBQUksRUFBRSxtQkFBVztpQkFDbEIsQ0FBQztZQUNGLENBQUMsT0FBTyxFQUFFO29CQUNSLFdBQVcsRUFBRSx1REFBdUQ7b0JBQ3BFLElBQUksRUFBRSxtQkFBVztpQkFDbEIsQ0FBQztZQUNGLENBQUMsT0FBTyxFQUFFO29CQUNSLFdBQVcsRUFBRSw0Q0FBNEM7b0JBQ3pELElBQUksRUFBRSxvQkFBVTtpQkFDakIsQ0FBQztZQUNGLENBQUMsTUFBTSxFQUFFO29CQUNQLFdBQVcsRUFBRSwyQ0FBMkM7b0JBQ3hELElBQUksRUFBRSxvQkFBVTtpQkFDakIsQ0FB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