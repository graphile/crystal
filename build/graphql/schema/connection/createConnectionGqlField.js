"use strict";
var tslib_1 = require("tslib");
var graphql_1 = require("graphql");
var utils_1 = require("../../utils");
var getGqlOutputType_1 = require("../type/getGqlOutputType");
var utils_2 = require("../../../postgres/utils");
// TODO: doc
function createConnectionGqlField(buildToken, paginator, config) {
    var gqlType = getGqlOutputType_1.default(buildToken, paginator.itemType).gqlType;
    var result = {
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
    };
    var getOrdering = function (sourceOrAliasIdentifier, args) {
        var orderingName = args.orderBy, beforeCursor = args.before, afterCursor = args.after, first = args.first, last = args.last, _offset = args.offset;
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
        var input = config.getPaginatorInput(sourceOrAliasIdentifier, args);
        // Construct the page config.
        var pageConfig = {
            beforeCursor: beforeCursor && beforeCursor.cursor,
            afterCursor: afterCursor && afterCursor.cursor,
            first: first,
            last: last,
            _offset: _offset,
        };
        // Get our ordering.
        var ordering = paginator.orderings.get(orderingName);
        return {
            orderingName: orderingName,
            ordering: ordering,
            input: input,
            pageConfig: pageConfig,
        };
    };
    if (config.subquery) {
        var sourceName_1 = function (_, fieldName, args, alias) { return fieldName + "###" + (alias || ''); };
        Object.assign(result, {
            sourceName: sourceName_1,
            externalFieldNameDependencies: config.relation && config.relation._headFieldNames,
            sqlExpression: function (aliasIdentifier, fieldName, args, resolveInfo) {
                var _a = getOrdering(aliasIdentifier, args), ordering = _a.ordering, orderingName = _a.orderingName, input = _a.input, pageConfig = _a.pageConfig;
                var alias = Symbol();
                var query = ordering.generateQuery(input, pageConfig, resolveInfo, gqlType).query;
                return (_b = ["(select json_build_object('rows', rows, 'hasNextPage', \"hasNextPage\", 'hasPreviousPage', \"hasPreviousPage\", 'totalCount', \"totalCount\") from (", ") as ", ")"], _b.raw = ["(select json_build_object('rows', rows, 'hasNextPage', \"hasNextPage\", 'hasPreviousPage', \"hasPreviousPage\", 'totalCount', \"totalCount\") from (", ") as ", ")"], utils_2.sql.query(_b, query, utils_2.sql.identifier(alias)));
                var _b;
            },
            resolve: function (source, args, context, resolveInfo) {
                return tslib_1.__awaiter(this, void 0, void 0, function () {
                    var fieldNodes, alias, attrName, value, _a, ordering, orderingName, input, pageConfig, details, page, _b, ordering, orderingName, input, pageConfig, page;
                    return tslib_1.__generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                fieldNodes = resolveInfo.fieldNodes || resolveInfo.fieldASTs;
                                alias = fieldNodes[0].alias && fieldNodes[0].alias.value;
                                attrName = sourceName_1(null, resolveInfo.fieldName, args, alias);
                                if (!source.has(attrName)) return [3 /*break*/, 1];
                                value = source.get(attrName);
                                _a = getOrdering(Symbol(), // <-- this doesn't matter during resolve
                                args), ordering = _a.ordering, orderingName = _a.orderingName, input = _a.input, pageConfig = _a.pageConfig;
                                details = ordering.generateQuery(input, pageConfig, resolveInfo, gqlType);
                                page = ordering.valueToPage(value, details);
                                return [2 /*return*/, {
                                        paginator: paginator,
                                        orderingName: orderingName,
                                        input: input,
                                        page: page,
                                    }];
                            case 1:
                                _b = getOrdering(source, args), ordering = _b.ordering, orderingName = _b.orderingName, input = _b.input, pageConfig = _b.pageConfig;
                                return [4 /*yield*/, ordering.readPage(context, input, pageConfig, resolveInfo, gqlType)];
                            case 2:
                                page = _c.sent();
                                return [2 /*return*/, {
                                        paginator: paginator,
                                        orderingName: orderingName,
                                        input: input,
                                        page: page,
                                    }];
                        }
                    });
                });
            }
        });
    }
    else {
        Object.assign(result, {
            resolve: function (source, args, context, resolveInfo) {
                return tslib_1.__awaiter(this, void 0, void 0, function () {
                    var _a, ordering, orderingName, input, pageConfig, page;
                    return tslib_1.__generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _a = getOrdering(source, args), ordering = _a.ordering, orderingName = _a.orderingName, input = _a.input, pageConfig = _a.pageConfig;
                                return [4 /*yield*/, ordering.readPage(context, input, pageConfig, resolveInfo, gqlType)];
                            case 1:
                                page = _b.sent();
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
        });
    }
    return result;
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
        // When performing optimisations, this is useful when parsing the resolveInfo AST tree:
        relatedGqlType: gqlType,
        fields: function () { return ({
            pageInfo: {
                description: 'Information to aid in pagination.',
                type: new graphql_1.GraphQLNonNull(exports._pageInfoType),
                resolve: function (source) { return source; },
            },
            totalCount: {
                description: "The count of *all* " + utils_1.scrib.type(gqlType) + " you could get from the connection.",
                type: graphql_1.GraphQLInt,
                resolve: function (source) { return source.page.totalCount(); },
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
        // When performing optimisations, this is useful when parsing the resolveInfo AST tree:
        relatedGqlType: gqlType,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlQ29ubmVjdGlvbkdxbEZpZWxkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2dyYXBocWwvc2NoZW1hL2Nvbm5lY3Rpb24vY3JlYXRlQ29ubmVjdGlvbkdxbEZpZWxkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBWWdCO0FBRWhCLHFDQUFzRTtBQUN0RSw2REFBdUQ7QUFFdkQsaURBQTZDO0FBRTdDLFlBQVk7QUFDWixrQ0FDRSxVQUFzQixFQUN0QixTQUF3QyxFQUN4QyxNQU1DO0lBRU8sSUFBQSw0RUFBTyxDQUFxRDtJQVlwRSxJQUFNLE1BQU0sR0FBRztRQUNiLFdBQVcsRUFBRSxNQUFNLENBQUMsV0FBVyxJQUFJLHFEQUFtRCxhQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFHO1FBQzVHLElBQUksRUFBRSxvQkFBb0IsQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDO1FBQ2pELElBQUksRUFBRSxtQkFBVztZQUNmLG9FQUFvRTtZQUNwRSxTQUFTO1lBQ1QsU0FBUyxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsbUJBQW1CLENBQUMsVUFBVSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQzlHLENBQUMsUUFBUSxFQUFFO29CQUNULFdBQVcsRUFBRSx3REFBd0Q7b0JBQ3JFLElBQUksRUFBRSxtQkFBVztpQkFDbEIsQ0FBQztZQUNGLENBQUMsT0FBTyxFQUFFO29CQUNSLFdBQVcsRUFBRSx1REFBdUQ7b0JBQ3BFLElBQUksRUFBRSxtQkFBVztpQkFDbEIsQ0FBQztZQUNGLENBQUMsT0FBTyxFQUFFO29CQUNSLFdBQVcsRUFBRSw0Q0FBNEM7b0JBQ3pELElBQUksRUFBRSxvQkFBVTtpQkFDakIsQ0FBQztZQUNGLENBQUMsTUFBTSxFQUFFO29CQUNQLFdBQVcsRUFBRSwyQ0FBMkM7b0JBQ3hELElBQUksRUFBRSxvQkFBVTtpQkFDakIsQ0FBQztZQUNGLENBQUMsUUFBUSxFQUFFO29CQUNULFdBQVcsRUFBRSw0SEFBNEg7b0JBQ3pJLElBQUksRUFBRSxvQkFBVTtpQkFDakIsQ0FBQztpQkFHQyxDQUFDLE1BQU0sQ0FBQyxlQUFlLEdBQUcsTUFBTSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUMsRUFDekQ7S0FDSCxDQUFDO0lBQ0YsSUFBTSxXQUFXLEdBQ2YsVUFBQyx1QkFBdUIsRUFBRSxJQUFJO1FBRTFCLElBQUEsMkJBQXFCLEVBQ3JCLDBCQUFvQixFQUNwQix3QkFBa0IsRUFDbEIsa0JBQUssRUFDTCxnQkFBSSxFQUNKLHFCQUFlLENBQ1Q7UUFFUixvRUFBb0U7UUFDcEUsOERBQThEO1FBQzlELHVFQUF1RTtRQUN2RSx3REFBd0Q7UUFDeEQsRUFBRSxDQUFDLENBQUMsWUFBWSxJQUFJLFlBQVksQ0FBQyxZQUFZLEtBQUssWUFBWSxDQUFDO1lBQzdELE1BQU0sSUFBSSxLQUFLLENBQUMsMkRBQTJELENBQUMsQ0FBQTtRQUM5RSxFQUFFLENBQUMsQ0FBQyxXQUFXLElBQUksV0FBVyxDQUFDLFlBQVksS0FBSyxZQUFZLENBQUM7WUFDM0QsTUFBTSxJQUFJLEtBQUssQ0FBQywwREFBMEQsQ0FBQyxDQUFBO1FBRTdFLGdEQUFnRDtRQUNoRCxFQUFFLENBQUMsQ0FBQyxZQUFZLElBQUksSUFBSSxJQUFJLE9BQU8sSUFBSSxJQUFJLElBQUksWUFBWSxJQUFJLElBQUksSUFBSSxPQUFPLElBQUksSUFBSSxDQUFDO1lBQ3JGLE1BQU0sSUFBSSxLQUFLLENBQUMsb0RBQW9ELENBQUMsQ0FBQTtRQUV2RSxpQkFBaUI7UUFDakIsSUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDLHVCQUF1QixFQUFFLElBQUksQ0FBQyxDQUFBO1FBRXJFLDZCQUE2QjtRQUM3QixJQUFNLFVBQVUsR0FBa0M7WUFDaEQsWUFBWSxFQUFFLFlBQVksSUFBSSxZQUFZLENBQUMsTUFBTTtZQUNqRCxXQUFXLEVBQUUsV0FBVyxJQUFJLFdBQVcsQ0FBQyxNQUFNO1lBQzlDLEtBQUssT0FBQTtZQUNMLElBQUksTUFBQTtZQUNKLE9BQU8sU0FBQTtTQUNSLENBQUE7UUFFRCxvQkFBb0I7UUFDcEIsSUFBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFvRCxDQUFBO1FBRXpHLE1BQU0sQ0FBQztZQUNMLFlBQVksY0FBQTtZQUNaLFFBQVEsVUFBQTtZQUNSLEtBQUssT0FBQTtZQUNMLFVBQVUsWUFBQTtTQUNYLENBQUE7SUFDSCxDQUFDLENBQUE7SUFDSCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUNwQixJQUFNLFlBQVUsR0FBRyxVQUFDLENBQUMsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLEtBQUssSUFBSyxPQUFHLFNBQVMsWUFBTSxLQUFLLElBQUksRUFBRSxDQUFFLEVBQS9CLENBQStCLENBQUE7UUFDakYsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUU7WUFDcEIsVUFBVSxjQUFBO1lBQ1YsNkJBQTZCLEVBQUUsTUFBTSxDQUFDLFFBQVEsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLGVBQWU7WUFDakYsYUFBYSxFQUFFLFVBQUMsZUFBZSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsV0FBVztnQkFDckQsSUFBQSx1Q0FBZ0YsRUFBL0Usc0JBQVEsRUFBRSw4QkFBWSxFQUFFLGdCQUFLLEVBQUUsMEJBQVUsQ0FBc0M7Z0JBQ3RGLElBQU0sS0FBSyxHQUFHLE1BQU0sRUFBRSxDQUFDO2dCQUNoQixJQUFBLDZFQUFLLENBQW1FO2dCQUMvRSxNQUFNLHlMQUFVLHNKQUFpSixFQUFLLE9BQVEsRUFBcUIsR0FBRyxHQUEvTCxXQUFHLENBQUMsS0FBSyxLQUFpSixLQUFLLEVBQVEsV0FBRyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRzs7WUFDeE0sQ0FBQztZQUNLLE9BQU8sRUFBYixVQUFlLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLFdBQVc7O3dCQUN6QyxVQUFVLEVBQ1YsS0FBSyxFQUNMLFFBQVEsRUFHTixLQUFLLE1BRUosUUFBUSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUkxQyxPQUFPLEVBQ1AsSUFBSSxNQVNILFFBQVEsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLFVBQVU7Ozs7NkNBckIvQixXQUFXLENBQUMsVUFBVSxJQUFJLFdBQVcsQ0FBQyxTQUFTO3dDQUNwRCxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSzsyQ0FDN0MsWUFBVSxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUM7cUNBQ2pFLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQXBCLHdCQUFvQjt3Q0FFUixNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztxQ0FFa0IsV0FBVyxDQUM3RCxNQUFNLEVBQUUsRUFBRSx5Q0FBeUM7Z0NBQ25ELElBQUksQ0FDTDswQ0FDZSxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLE9BQU8sQ0FBQzt1Q0FDbEUsUUFBUSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDO2dDQUNqRCxzQkFBTzt3Q0FDTCxTQUFTLFdBQUE7d0NBQ1QsWUFBWSxjQUFBO3dDQUNaLEtBQUssT0FBQTt3Q0FDTCxJQUFJLE1BQUE7cUNBQ0wsRUFBQTs7cUNBR21ELFdBQVcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDO2dDQUVoRSxxQkFBTSxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxPQUFPLENBQUMsRUFBQTs7dUNBQXpFLFNBQXlFO2dDQUV0RixzQkFBTzt3Q0FDTCxTQUFTLFdBQUE7d0NBQ1QsWUFBWSxjQUFBO3dDQUNaLEtBQUssT0FBQTt3Q0FDTCxJQUFJLE1BQUE7cUNBQ0wsRUFBQTs7OzthQUVKO1NBQ0YsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUU7WUFDZCxPQUFPLEVBQWIsVUFDRSxNQUFlLEVBQ2YsSUFBNkIsRUFDN0IsT0FBYyxFQUNkLFdBQWtCOzs0QkFFWCxRQUFRLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxVQUFVOzs7O3FDQUFJLFdBQVcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDO2dDQUVoRSxxQkFBTSxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxPQUFPLENBQUMsRUFBQTs7dUNBQXpFLFNBQXlFO2dDQUV0RixzQkFBTzt3Q0FDTCxTQUFTLFdBQUE7d0NBQ1QsWUFBWSxjQUFBO3dDQUNaLEtBQUssT0FBQTt3Q0FDTCxJQUFJLE1BQUE7cUNBQ0wsRUFBQTs7OzthQUNGO1NBQ0YsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUNELE1BQU0sQ0FBQyxNQUFNLENBQUE7QUFDZixDQUFDOztBQXpLRCwyQ0F5S0M7QUFFRCxJQUFNLG9CQUFvQixHQUFHLGdCQUFRLENBQUMsd0JBQXdCLENBQUMsQ0FBQTtBQUUvRDs7R0FFRztBQUNILGtDQUNFLFVBQXNCLEVBQ3RCLFNBQXdDO0lBRWhDLElBQUEsNEVBQU8sQ0FBcUQ7SUFDcEUsSUFBTSxXQUFXLEdBQUcsc0JBQWMsQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDLENBQUE7SUFFekQsTUFBTSxDQUFDLElBQUksMkJBQWlCLENBQUM7UUFDM0IsSUFBSSxFQUFFLGtCQUFVLENBQUMsSUFBSSxDQUFJLFNBQVMsQ0FBQyxJQUFJLGdCQUFhLENBQUM7UUFDckQsV0FBVyxFQUFFLCtCQUE2QixhQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFVO1FBQ3ZFLHVGQUF1RjtRQUN2RixjQUFjLEVBQUUsT0FBTztRQUN2QixNQUFNLEVBQUUsY0FBTSxPQUFBLENBQUM7WUFDYixRQUFRLEVBQUU7Z0JBQ1IsV0FBVyxFQUFFLG1DQUFtQztnQkFDaEQsSUFBSSxFQUFFLElBQUksd0JBQWMsQ0FBQyxxQkFBYSxDQUFDO2dCQUN2QyxPQUFPLEVBQUUsVUFBQSxNQUFNLElBQUksT0FBQSxNQUFNLEVBQU4sQ0FBTTthQUMxQjtZQUNELFVBQVUsRUFBRTtnQkFDVixXQUFXLEVBQUUsd0JBQXNCLGFBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLHdDQUFxQztnQkFDM0YsSUFBSSxFQUFFLG9CQUFVO2dCQUNoQixPQUFPLEVBQUUsVUFBQSxNQUFNLElBQUksT0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUF4QixDQUF3QjthQUM1QztZQUNELEtBQUssRUFBRTtnQkFDTCxXQUFXLEVBQUUsd0NBQXNDLGFBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLHNDQUFtQztnQkFDekcsSUFBSSxFQUFFLElBQUkscUJBQVcsQ0FBQyxXQUFXLENBQUM7Z0JBQ2xDLE9BQU8sRUFBRSxVQUFVLEVBQStEO3dCQUE3RCw4QkFBWSxFQUFFLGNBQUk7b0JBQ3JDLE9BQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBQyxFQUFpQjs0QkFBZixrQkFBTSxFQUFFLGdCQUFLO3dCQUFPLE9BQUEsQ0FBQyxFQUFFLFNBQVMsV0FBQSxFQUFFLFlBQVksY0FBQSxFQUFFLE1BQU0sUUFBQSxFQUFFLEtBQUssT0FBQSxFQUFFLENBQUM7b0JBQTVDLENBQTRDLENBQUM7Z0JBQXBGLENBQW9GO2FBQ3ZGO1lBQ0QsS0FBSyxFQUFFO2dCQUNMLFdBQVcsRUFBRSxlQUFhLGFBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQVc7Z0JBQ3hELElBQUksRUFBRSxJQUFJLHFCQUFXLENBQUMsT0FBTyxDQUFDO2dCQUM5QixPQUFPLEVBQUUsVUFBQyxFQUErQzt3QkFBN0MsY0FBSTtvQkFDZCxPQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQUMsRUFBUzs0QkFBUCxnQkFBSzt3QkFBTyxPQUFBLEtBQUs7b0JBQUwsQ0FBSyxDQUFDO2dCQUFyQyxDQUFxQzthQUN4QztTQUNGLENBQUMsRUF2QlksQ0F1Qlo7S0FDSCxDQUFDLENBQUE7QUFDSixDQUFDO0FBckNELDREQXFDQztBQUVZLFFBQUEsY0FBYyxHQUFHLGdCQUFRLENBQUMsa0JBQWtCLENBQUMsQ0FBQTtBQUUxRDs7R0FFRztBQUNILDRCQUNFLFVBQXNCLEVBQ3RCLFNBQXdDO0lBRWhDLElBQUEsNEVBQU8sQ0FBcUQ7SUFFcEUsTUFBTSxDQUFDLElBQUksMkJBQWlCLENBQUM7UUFDM0IsSUFBSSxFQUFFLGtCQUFVLENBQUMsSUFBSSxDQUFJLFNBQVMsQ0FBQyxJQUFJLFVBQU8sQ0FBQztRQUMvQyxXQUFXLEVBQUUsT0FBSyxhQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyw2QkFBMEI7UUFDL0QsdUZBQXVGO1FBQ3ZGLGNBQWMsRUFBRSxPQUFPO1FBQ3ZCLE1BQU0sRUFBRSxjQUFNLE9BQUEsQ0FBQztZQUNiLE1BQU0sRUFBRTtnQkFDTixXQUFXLEVBQUUsaUNBQWlDO2dCQUM5QyxJQUFJLEVBQUUsbUJBQVc7Z0JBQ2pCLE9BQU8sRUFBRSxVQUFVLEVBQTJEO3dCQUF6RCw4QkFBWSxFQUFFLGtCQUFNO29CQUN2QyxPQUFBLE1BQU0sSUFBSSxFQUFFLFlBQVksY0FBQSxFQUFFLE1BQU0sUUFBQSxFQUFFO2dCQUFsQyxDQUFrQzthQUNyQztZQUNELElBQUksRUFBRTtnQkFDSixXQUFXLEVBQUUsU0FBTyxhQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyw2QkFBMEI7Z0JBQ2pFLElBQUksRUFBRSxPQUFPO2dCQUNiLE9BQU8sRUFBRSxVQUFDLEVBQVM7d0JBQVAsZ0JBQUs7b0JBQU8sT0FBQSxLQUFLO2dCQUFMLENBQUs7YUFDOUI7U0FDRixDQUFDLEVBWlksQ0FZWjtLQUNILENBQUMsQ0FBQTtBQUNKLENBQUM7QUF6QkQsZ0RBeUJDO0FBRUQ7OztHQUdHO0FBQ0gsNkJBQ0UsVUFBc0IsRUFDdEIsU0FBd0M7SUFFaEMsSUFBQSw0RUFBTyxDQUFxRDtJQUNwRSxJQUFNLFFBQVEsR0FBRyxxQkFBcUIsQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDLENBQUE7SUFFN0QsTUFBTSxDQUFDO1FBQ0wsV0FBVyxFQUFFLHFDQUFtQyxhQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFHO1FBQ3RFLElBQUksRUFBRSxRQUFRO1FBQ2QsWUFBWSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLEVBQVk7Z0JBQVQsZ0JBQVE7WUFBTSxPQUFBLFFBQVEsS0FBSyxTQUFTLENBQUMsZUFBZTtRQUF0QyxDQUFzQyxDQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ2pILENBQUE7QUFDSCxDQUFDO0FBWkQsa0RBWUM7QUFFRCxJQUFNLHNCQUFzQixHQUFHLGdCQUFRLENBQUMseUJBQXlCLENBQUMsQ0FBQTtBQUVsRSx1RUFBdUU7QUFDdkUsK0NBQStDO0FBQy9DLCtCQUNFLFVBQXNCLEVBQ3RCLFNBQXdDO0lBRXhDLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDLENBQUE7QUFDdEQsQ0FBQztBQUVEOzs7R0FHRztBQUNILG1DQUNFLFVBQXNCLEVBQ3RCLFNBQXdDO0lBRWhDLElBQUEsNEVBQU8sQ0FBcUQ7SUFFcEUsTUFBTSxDQUFDLElBQUkseUJBQWUsQ0FBQztRQUN6QixJQUFJLEVBQUUsa0JBQVUsQ0FBQyxJQUFJLENBQUksU0FBUyxDQUFDLElBQUksY0FBVyxDQUFDO1FBQ25ELFdBQVcsRUFBRSxrQ0FBZ0MsYUFBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBRztRQUNuRSxNQUFNLEVBQUUsbUJBQVcsQ0FDakIsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDO2FBQzVCLEdBQUcsQ0FDRixVQUFBLFFBQVEsSUFBSSxPQUFBLENBQUMsa0JBQVUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBM0QsQ0FBMkQsQ0FDeEUsQ0FDSjtLQUNGLENBQUMsQ0FBQTtBQUNKLENBQUM7QUFoQkQsOERBZ0JDO0FBRUQ7Ozs7O0dBS0c7QUFDVSxRQUFBLFdBQVcsR0FDdEIsSUFBSSwyQkFBaUIsQ0FBQztJQUNwQixJQUFJLEVBQUUsUUFBUTtJQUNkLFdBQVcsRUFBRSxzRUFBc0U7SUFDbkYsU0FBUyxFQUFFLFVBQUEsS0FBSyxJQUFJLE9BQUEsZUFBZSxDQUFDLEtBQUssQ0FBQyxFQUF0QixDQUFzQjtJQUMxQyxVQUFVLEVBQUUsVUFBQSxLQUFLLElBQUksT0FBQSxPQUFPLEtBQUssS0FBSyxRQUFRLEdBQUcsaUJBQWlCLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxFQUEzRCxDQUEyRDtJQUNoRixZQUFZLEVBQUUsVUFBQSxHQUFHLElBQUksT0FBQSxHQUFHLENBQUMsSUFBSSxLQUFLLGNBQUksQ0FBQyxNQUFNLEdBQUcsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksRUFBOUQsQ0FBOEQ7Q0FDcEYsQ0FBQyxDQUFBO0FBRUo7Ozs7O0dBS0c7QUFDSCx5QkFBMEIsRUFBaUQ7UUFBL0MsOEJBQVksRUFBRSxrQkFBTTtJQUM5QyxNQUFNLENBQUMsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQzlFLENBQUM7QUFFRDs7OztHQUlHO0FBQ0gsMkJBQTRCLGdCQUF3QjtJQUM1QyxJQUFBLGtFQUFzRixFQUFyRixvQkFBWSxFQUFFLGNBQU0sQ0FBaUU7SUFDNUYsTUFBTSxDQUFDLEVBQUUsWUFBWSxjQUFBLEVBQUUsTUFBTSxRQUFBLEVBQUUsQ0FBQTtBQUNqQyxDQUFDO0FBRUQ7Ozs7O0dBS0c7QUFDVSxRQUFBLGFBQWEsR0FDeEIsSUFBSSwyQkFBaUIsQ0FBQztJQUNwQixJQUFJLEVBQUUsVUFBVTtJQUNoQixXQUFXLEVBQUUsK0NBQStDO0lBQzVELE1BQU0sRUFBRTtRQUNOLFdBQVcsRUFBRTtZQUNYLFdBQVcsRUFBRSxpREFBaUQ7WUFDOUQsSUFBSSxFQUFFLElBQUksd0JBQWMsQ0FBQyx3QkFBYyxDQUFDO1lBQ3hDLE9BQU8sRUFBRSxVQUFDLEVBQVE7b0JBQU4sY0FBSTtnQkFBTyxPQUFBLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFBbEIsQ0FBa0I7U0FDMUM7UUFDRCxlQUFlLEVBQUU7WUFDZixXQUFXLEVBQUUsa0RBQWtEO1lBQy9ELElBQUksRUFBRSxJQUFJLHdCQUFjLENBQUMsd0JBQWMsQ0FBQztZQUN4QyxPQUFPLEVBQUUsVUFBQyxFQUFRO29CQUFOLGNBQUk7Z0JBQU8sT0FBQSxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQXRCLENBQXNCO1NBQzlDO1FBQ0QsV0FBVyxFQUFFO1lBQ1gsV0FBVyxFQUFFLG9EQUFvRDtZQUNqRSxJQUFJLEVBQUUsbUJBQVc7WUFDakIsT0FBTyxFQUFFLFVBQUMsRUFBc0I7b0JBQXBCLDhCQUFZLEVBQUUsY0FBSTtnQkFDNUIsT0FBQSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztzQkFDVixFQUFFLFlBQVksY0FBQSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRTtzQkFDL0MsSUFBSTtZQUZSLENBRVE7U0FDWDtRQUNELFNBQVMsRUFBRTtZQUNULFdBQVcsRUFBRSxtREFBbUQ7WUFDaEUsSUFBSSxFQUFFLG1CQUFXO1lBQ2pCLE9BQU8sRUFBRSxVQUFDLEVBQXNCO29CQUFwQiw4QkFBWSxFQUFFLGNBQUk7Z0JBQzVCLE9BQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7c0JBQy9CLEVBQUUsWUFBWSxjQUFBLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFO3NCQUNwRSxJQUFJO1lBRlIsQ0FFUTtTQUNYO0tBQ0Y7Q0FDRixDQUFDLENBQUEifQ==