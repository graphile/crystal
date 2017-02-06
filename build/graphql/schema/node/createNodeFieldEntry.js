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
            resolve: function (_source, args, context, resolveInfo) {
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
                                return [4 /*yield*/, primaryKey.read(context, keyValue, resolveInfo, getGqlOutputType_1.default(buildToken, collection.type).gqlType)];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlTm9kZUZpZWxkRW50cnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZ3JhcGhxbC9zY2hlbWEvbm9kZS9jcmVhdGVOb2RlRmllbGRFbnRyeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUF1RTtBQUV2RSxxQ0FBNEM7QUFFNUMsc0RBQThDO0FBQzlDLDZEQUF1RDtBQUN2RCwrREFBeUU7QUFFekUsWUFBWTtBQUNaLDhCQUE4QyxVQUFzQjtJQUMxRCxJQUFBLGdDQUFTLEVBQUUsNEJBQU8sQ0FBZTtJQUN6QyxNQUFNLENBQUMsQ0FBQyxNQUFNLEVBQUU7WUFDZCxXQUFXLEVBQUUsaURBQStDLGFBQUssQ0FBQyxJQUFJLENBQUMsbUJBQVMsQ0FBQyxNQUFHO1lBQ3BGLElBQUksRUFBRSw4QkFBb0IsQ0FBQyxVQUFVLENBQUM7WUFDdEMsSUFBSTtnQkFDRixHQUFDLE9BQU8sQ0FBQyxlQUFlLElBQUc7b0JBQ3pCLFdBQVcsRUFBRSx5QkFBdUIsYUFBSyxDQUFDLElBQUksQ0FBQyxtQkFBUyxDQUFDLE1BQUc7b0JBQzVELElBQUksRUFBRSxJQUFJLHdCQUFjLENBQUMsbUJBQVMsQ0FBQztpQkFDcEM7bUJBQ0Y7WUFDSyxPQUFPLEVBQWIsVUFBNkIsT0FBYyxFQUFFLElBQThCLEVBQUUsT0FBYyxFQUFFLFdBQWtCOzt3QkFDekcscUJBQXFCLEVBQ25CLFFBQVEsRUFvQk4sVUFBVSxFQUFFLFFBQVEsRUFDdEIsVUFBVTs7OzsyQ0FyQkMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUM7Z0NBRTlDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sUUFBUSxLQUFLLFFBQVEsQ0FBQztvQ0FDL0IsTUFBTSxJQUFJLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFBO2dDQUVsRCx5RUFBeUU7Z0NBQ3pFLHdFQUF3RTtnQ0FDeEUsY0FBYztnQ0FDZCxFQUFFLENBQUMsQ0FBQyxRQUFRLEtBQUssT0FBTyxDQUFDO29DQUN2QixNQUFNLGdCQUFDLDJCQUFTLEVBQUE7Z0NBRWxCLG9FQUFvRTtnQ0FDcEUsdUVBQXVFO2dDQUN2RSxJQUFJLENBQUM7b0NBQ0gscUJBQXFCLEdBQUcsZUFBTyxDQUFDLFdBQVcsQ0FBZSxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUE7Z0NBQ2hGLENBQUM7Z0NBQ0QsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQ0FDYixNQUFNLGdCQUFDLElBQUksRUFBQTtnQ0FDYixDQUFDOzZDQUVnQyxxQkFBcUIsd0JBQXJCLHFCQUFxQjs2Q0FDbkMsVUFBVSxDQUFDLFVBQXFEO2dDQUVuRixFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7b0NBQ2xDLE1BQU0sSUFBSSxLQUFLLENBQUMsOERBQTRELFVBQVUsQ0FBQyxJQUFJLE9BQUksQ0FBQyxDQUFBO2dDQUVwRixxQkFBTSxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLDBCQUFnQixDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUE7O3dDQUE1RyxTQUE0RztnQ0FFMUgsbUNBQW1DO2dDQUNuQyxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDO29DQUNoQixNQUFNLGdCQUFDLEtBQUssRUFBQTtnQ0FFZCxxRUFBcUU7Z0NBQ3JFLHVFQUF1RTtnQ0FDdkUseUNBQXlDO2dDQUN6QyxLQUFLLENBQUMsaUNBQVUsQ0FBQyxHQUFHLDBCQUFnQixDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFBO2dDQUV6RSxzQkFBTyxLQUFLLEVBQUE7Ozs7YUFDYjtTQUNGLENBQUMsQ0FBQTs7QUFDSixDQUFDOztBQXJERCx1Q0FxREMifQ==