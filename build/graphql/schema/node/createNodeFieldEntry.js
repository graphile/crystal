"use strict";
var tslib_1 = require("tslib");
var graphql_1 = require("graphql");
var utils_1 = require("../../utils");
var getQueryGqlType_1 = require("../getQueryGqlType");
var getGqlOutputType_1 = require("../type/getGqlOutputType");
var getNodeInterfaceType_1 = require("./getNodeInterfaceType");
// TODO: doc
function createNodeFieldEntry(buildToken) {
    var inventory = buildToken.inventory, options = buildToken.options;
    return ['node', {
            description: "Fetches an object given its globally unique " + utils_1.scrib.type(graphql_1.GraphQLID) + ".",
            type: getNodeInterfaceType_1.default(buildToken),
            args: (_a = {},
                _a[options.nodeIdFieldName] = {
                    description: "The globally unique " + utils_1.scrib.type(graphql_1.GraphQLID) + ".",
                    type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID),
                },
                _a),
            resolve: function (_source, args, context) {
                return tslib_1.__awaiter(this, void 0, void 0, function () {
                    var deserializationResult, idString, collection, keyValue, primaryKey, value;
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                idString = args[options.nodeIdFieldName];
                                if (typeof idString !== 'string')
                                    throw new Error('ID argument must be a string.');
                                // If the id is simply `query`, we want to give back our root query type.
                                // For now this is needed for Relay 1 mutations, maybe deprecate this in
                                // the future?
                                if (idString === 'query')
                                    return [2 /*return*/, getQueryGqlType_1.$$isQuery];
                                // Try to deserialize the id we got from our argument. If we fail to
                                // deserialize the id, we should just return null and ignore the error.
                                try {
                                    deserializationResult = utils_1.idSerde.deserialize(inventory, idString);
                                }
                                catch (error) {
                                    return [2 /*return*/, null];
                                }
                                collection = deserializationResult.collection, keyValue = deserializationResult.keyValue;
                                primaryKey = collection.primaryKey;
                                if (!primaryKey || !primaryKey.read)
                                    throw new Error("Invalid id, no readable primary key on collection named '" + collection.name + "'.");
                                return [4 /*yield*/, primaryKey.read(context, keyValue)];
                            case 1:
                                value = _a.sent();
                                // If the value is null, end early.
                                if (value == null)
                                    return [2 /*return*/, value];
                                // Add the collection to the value so we can accurately determine the
                                // type. This way we will know exactly which collection this is for and
                                // can avoid ambiguous `isTypeOf` checks.
                                value[getNodeInterfaceType_1.$$nodeType] = getGqlOutputType_1.default(buildToken, collection.type).gqlType;
                                return [2 /*return*/, value];
                        }
                    });
                });
            },
        }];
    var _a;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createNodeFieldEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlTm9kZUZpZWxkRW50cnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZ3JhcGhxbC9zY2hlbWEvbm9kZS9jcmVhdGVOb2RlRmllbGRFbnRyeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUF1RTtBQUV2RSxxQ0FBNEM7QUFFNUMsc0RBQThDO0FBQzlDLDZEQUF1RDtBQUN2RCwrREFBeUU7QUFFekUsWUFBWTtBQUNaLDhCQUE4QyxVQUFzQjtJQUMxRCxJQUFBLGdDQUFTLEVBQUUsNEJBQU8sQ0FBZTtJQUN6QyxNQUFNLENBQUMsQ0FBQyxNQUFNLEVBQUU7WUFDZCxXQUFXLEVBQUUsaURBQStDLGFBQUssQ0FBQyxJQUFJLENBQUMsbUJBQVMsQ0FBQyxNQUFHO1lBQ3BGLElBQUksRUFBRSw4QkFBb0IsQ0FBQyxVQUFVLENBQUM7WUFDdEMsSUFBSTtnQkFDRixHQUFDLE9BQU8sQ0FBQyxlQUFlLElBQUc7b0JBQ3pCLFdBQVcsRUFBRSx5QkFBdUIsYUFBSyxDQUFDLElBQUksQ0FBQyxtQkFBUyxDQUFDLE1BQUc7b0JBQzVELElBQUksRUFBRSxJQUFJLHdCQUFjLENBQUMsbUJBQVMsQ0FBQztpQkFDcEM7bUJBQ0Y7WUFDSyxPQUFPLEVBQWIsVUFBNkIsT0FBYyxFQUFFLElBQThCLEVBQUUsT0FBYzs7d0JBQ3JGLHFCQUFxQixFQUNuQixRQUFRLEVBb0JOLFVBQVUsRUFBRSxRQUFRLEVBQ3RCLFVBQVU7Ozs7MkNBckJDLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDO2dDQUU5QyxFQUFFLENBQUMsQ0FBQyxPQUFPLFFBQVEsS0FBSyxRQUFRLENBQUM7b0NBQy9CLE1BQU0sSUFBSSxLQUFLLENBQUMsK0JBQStCLENBQUMsQ0FBQTtnQ0FFbEQseUVBQXlFO2dDQUN6RSx3RUFBd0U7Z0NBQ3hFLGNBQWM7Z0NBQ2QsRUFBRSxDQUFDLENBQUMsUUFBUSxLQUFLLE9BQU8sQ0FBQztvQ0FDdkIsTUFBTSxnQkFBQywyQkFBUyxFQUFBO2dDQUVsQixvRUFBb0U7Z0NBQ3BFLHVFQUF1RTtnQ0FDdkUsSUFBSSxDQUFDO29DQUNILHFCQUFxQixHQUFHLGVBQU8sQ0FBQyxXQUFXLENBQWUsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFBO2dDQUNoRixDQUFDO2dDQUNELEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0NBQ2IsTUFBTSxnQkFBQyxJQUFJLEVBQUE7Z0NBQ2IsQ0FBQzs2Q0FFZ0MscUJBQXFCLHdCQUFyQixxQkFBcUI7NkNBQ25DLFVBQVUsQ0FBQyxVQUFxRDtnQ0FFbkYsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO29DQUNsQyxNQUFNLElBQUksS0FBSyxDQUFDLDhEQUE0RCxVQUFVLENBQUMsSUFBSSxPQUFJLENBQUMsQ0FBQTtnQ0FFcEYscUJBQU0sVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLEVBQUE7O3dDQUF4QyxTQUF3QztnQ0FFdEQsbUNBQW1DO2dDQUNuQyxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDO29DQUNoQixNQUFNLGdCQUFDLEtBQUssRUFBQTtnQ0FFZCxxRUFBcUU7Z0NBQ3JFLHVFQUF1RTtnQ0FDdkUseUNBQXlDO2dDQUN6QyxLQUFLLENBQUMsaUNBQVUsQ0FBQyxHQUFHLDBCQUFnQixDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFBO2dDQUV6RSxzQkFBTyxLQUFLLEVBQUE7Ozs7YUFDYjtTQUNGLENBQUMsQ0FBQTs7QUFDSixDQUFDOztBQXJERCx1Q0FxREMifQ==