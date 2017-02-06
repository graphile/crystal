"use strict";
var tslib_1 = require("tslib");
var graphql_1 = require("graphql");
var utils_1 = require("../utils");
var createMutationPayloadGqlType_1 = require("./createMutationPayloadGqlType");
/**
 * Creates a mutation field that is Relay 1 compatible. Since virtually every
 * mutation in our system is of a similar form, having a utility function to
 * create mutations is helpful.
 *
 * Inspiration was taken from `mutationWithClientMutationId` in
 * [`graphql-relay`][1].
 *
 * [1]: https://www.npmjs.com/package/graphql-relay
 */
function createMutationGqlField(buildToken, config) {
    if (config.outputFields && config.payloadType)
        throw new Error('Mutation `outputFields` and `payloadType` may not be defiend at the same time.');
    return {
        description: config.description,
        // First up we need to define our input arguments. Our input arguments is
        // really just one required object argument. The reason we use one object
        // is so that clients can use a single GraphQL variable when performing the
        // mutation (it’s a Relay 1 that happens to be a good idea, as many are).
        args: {
            input: {
                description: 'The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.',
                type: new graphql_1.GraphQLNonNull(new graphql_1.GraphQLInputObjectType({
                    name: utils_1.formatName.type(config.name + "-input"),
                    description: "All input for the `" + utils_1.formatName.field(config.name) + "` mutation.",
                    fields: utils_1.buildObject([
                        // Relay 1 requires us to have a `clientMutationId`. This can be
                        // helpful for tracking the results of mutations.
                        ['clientMutationId', {
                                description: 'An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client.',
                                type: graphql_1.GraphQLString,
                            }],
                    ], 
                    // Add all of our input fields to the input object verbatim. No
                    // transforms.
                    (config.inputFields || []).filter(Boolean)),
                })),
            },
        },
        // Next we need to define our output (payload) type. Instead of directly
        // being a value, we instead return an object. This allows us to return
        // multiple things. If we were directly given a payload type, however, we
        // will just use that.
        type: config.payloadType
            ? config.payloadType
            : createMutationPayloadGqlType_1.default(buildToken, config),
        // Finally we define the resolver for this field which will actually
        // execute the mutation. Basically it will just include the
        // `clientMutationId` in the payload, and calls `config.execute`.
        resolve: function (_source, args, context, resolveInfo) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var clientMutationId, value;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            clientMutationId = args['input'].clientMutationId;
                            return [4 /*yield*/, config.execute(context, args['input'], resolveInfo)];
                        case 1:
                            value = _a.sent();
                            return [2 /*return*/, {
                                    clientMutationId: clientMutationId,
                                    value: value,
                                }];
                    }
                });
            });
        },
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createMutationGqlField;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlTXV0YXRpb25HcWxGaWVsZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ncmFwaHFsL3NjaGVtYS9jcmVhdGVNdXRhdGlvbkdxbEZpZWxkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBT2dCO0FBQ2hCLGtDQUFrRDtBQUVsRCwrRUFBeUU7QUF3QnpFOzs7Ozs7Ozs7R0FTRztBQUNILGdDQUNFLFVBQXNCLEVBQ3RCLE1BQThCO0lBRTlCLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLElBQUksTUFBTSxDQUFDLFdBQVcsQ0FBQztRQUM1QyxNQUFNLElBQUksS0FBSyxDQUFDLGdGQUFnRixDQUFDLENBQUE7SUFFbkcsTUFBTSxDQUFDO1FBQ0wsV0FBVyxFQUFFLE1BQU0sQ0FBQyxXQUFXO1FBRS9CLHlFQUF5RTtRQUN6RSx5RUFBeUU7UUFDekUsMkVBQTJFO1FBQzNFLHlFQUF5RTtRQUN6RSxJQUFJLEVBQUU7WUFDSixLQUFLLEVBQUU7Z0JBQ0wsV0FBVyxFQUFFLDBIQUEwSDtnQkFDdkksSUFBSSxFQUFFLElBQUksd0JBQWMsQ0FBQyxJQUFJLGdDQUFzQixDQUFDO29CQUNsRCxJQUFJLEVBQUUsa0JBQVUsQ0FBQyxJQUFJLENBQUksTUFBTSxDQUFDLElBQUksV0FBUSxDQUFDO29CQUM3QyxXQUFXLEVBQUUsd0JBQXVCLGtCQUFVLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWM7b0JBQy9FLE1BQU0sRUFBRSxtQkFBVyxDQUNqQjt3QkFDRSxnRUFBZ0U7d0JBQ2hFLGlEQUFpRDt3QkFDakQsQ0FBQyxrQkFBa0IsRUFBRTtnQ0FDbkIsV0FBVyxFQUFFLDZJQUE2STtnQ0FDMUosSUFBSSxFQUFFLHVCQUFhOzZCQUNwQixDQUFDO3FCQUNIO29CQUNELCtEQUErRDtvQkFDL0QsY0FBYztvQkFDZCxDQUFDLE1BQU0sQ0FBQyxXQUFXLElBQUksRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUMzQztpQkFDRixDQUFDLENBQUM7YUFDSjtTQUNGO1FBRUQsd0VBQXdFO1FBQ3hFLHVFQUF1RTtRQUN2RSx5RUFBeUU7UUFDekUsc0JBQXNCO1FBQ3RCLElBQUksRUFDRixNQUFNLENBQUMsV0FBVztjQUNkLE1BQU0sQ0FBQyxXQUFXO2NBQ2xCLHNDQUE0QixDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUM7UUFFdEQsb0VBQW9FO1FBQ3BFLDJEQUEyRDtRQUMzRCxpRUFBaUU7UUFDM0QsT0FBTyxFQUFiLFVBQWUsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsV0FBVzs7b0JBQ3hDLGdCQUFnQjs7OzsrQ0FBSyxJQUFJLENBQUMsT0FBTyxDQUFDOzRCQUM1QixxQkFBTSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsV0FBVyxDQUFDLEVBQUE7O29DQUF6RCxTQUF5RDs0QkFFdkUsc0JBQU87b0NBQ0wsZ0JBQWdCLGtCQUFBO29DQUNoQixLQUFLLE9BQUE7aUNBQ04sRUFBQTs7OztTQUNGO0tBQ0YsQ0FBQTtBQUNILENBQUM7O0FBM0RELHlDQTJEQyJ9