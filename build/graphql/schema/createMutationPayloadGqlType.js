"use strict";
var graphql_1 = require("graphql");
var utils_1 = require("../utils");
var getQueryGqlType_1 = require("./getQueryGqlType");
/**
 * Creates the payload type for a GraphQL mutation. Uses the provided output
 * fields and adds a `clientMutationId` and `query` field.
 */
function createMutationPayloadGqlType(buildToken, config) {
    return new graphql_1.GraphQLObjectType({
        name: utils_1.formatName.type(config.name + "-payload"),
        description: "The output of our `" + utils_1.formatName.field(config.name) + "` mutation.",
        relatedGqlType: config.relatedGqlType,
        fields: utils_1.buildObject([
            // Add the `clientMutationId` output field. This will be the exact
            // same value as the input `clientMutationId`.
            ['clientMutationId', {
                    description: "The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations.",
                    type: graphql_1.GraphQLString,
                    resolve: function (_a) {
                        var clientMutationId = _a.clientMutationId;
                        return clientMutationId;
                    },
                }],
        ], 
        // Add all of our output fields to the output object verbatim. Simple
        // as that. We do transform the fields to mask the implementation
        // detail of `MutationValue` being an object. Instead we just pass
        // `MutationValue#value` directly to the resolver.
        (config.outputFields || [])
            .filter(Boolean)
            .map(function (_a) {
            var fieldName = _a[0], field = _a[1];
            return [fieldName, {
                    type: field.type,
                    args: field.args,
                    resolve: field.resolve
                        ? function (_a) {
                            var value = _a.value;
                            var rest = [];
                            for (var _i = 1; _i < arguments.length; _i++) {
                                rest[_i - 1] = arguments[_i];
                            }
                            // tslint:disable-next-line no-any
                            return (_b = field).resolve.apply(_b, [value].concat(rest));
                            var _b;
                        }
                        : null,
                    description: field.description,
                    deprecationReason: field.deprecationReason,
                }];
        }), [
            // A reference to the root query type. Allows you to access even more
            // data in your mutations.
            ['query', {
                    description: 'Our root query field type. Allows us to run any query from our mutation payload.',
                    type: getQueryGqlType_1.default(buildToken),
                    resolve: function () { return getQueryGqlType_1.$$isQuery; },
                }],
        ]),
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createMutationPayloadGqlType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlTXV0YXRpb25QYXlsb2FkR3FsVHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ncmFwaHFsL3NjaGVtYS9jcmVhdGVNdXRhdGlvblBheWxvYWRHcWxUeXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxtQ0FBOEU7QUFDOUUsa0NBQWtEO0FBR2xELHFEQUE4RDtBQUU5RDs7O0dBR0c7QUFDSCxzQ0FDRSxVQUFzQixFQUN0QixNQUdDO0lBRUQsTUFBTSxDQUFDLElBQUksMkJBQWlCLENBQUM7UUFDM0IsSUFBSSxFQUFFLGtCQUFVLENBQUMsSUFBSSxDQUFJLE1BQU0sQ0FBQyxJQUFJLGFBQVUsQ0FBQztRQUMvQyxXQUFXLEVBQUUsd0JBQXVCLGtCQUFVLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWM7UUFDL0UsY0FBYyxFQUFFLE1BQU0sQ0FBQyxjQUFjO1FBQ3JDLE1BQU0sRUFBRSxtQkFBVyxDQUNqQjtZQUNFLGtFQUFrRTtZQUNsRSw4Q0FBOEM7WUFDOUMsQ0FBQyxrQkFBa0IsRUFBRTtvQkFDbkIsV0FBVyxFQUFFLDhJQUFnSjtvQkFDN0osSUFBSSxFQUFFLHVCQUFhO29CQUNuQixPQUFPLEVBQUUsVUFBQyxFQUFvQjs0QkFBbEIsc0NBQWdCO3dCQUFPLE9BQUEsZ0JBQWdCO29CQUFoQixDQUFnQjtpQkFDcEQsQ0FBQztTQUNIO1FBQ0QscUVBQXFFO1FBQ3JFLGlFQUFpRTtRQUNqRSxrRUFBa0U7UUFDbEUsa0RBQWtEO1FBQ2xELENBQUMsTUFBTSxDQUFDLFlBQVksSUFBSSxFQUFFLENBQUM7YUFDeEIsTUFBTSxDQUFDLE9BQU8sQ0FBQzthQUNmLEdBQUcsQ0FDRixVQUFDLEVBQStEO2dCQUE5RCxpQkFBUyxFQUFFLGFBQUs7WUFDaEIsT0FBQSxDQUFDLFNBQVMsRUFBRTtvQkFDVixJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7b0JBQ2hCLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtvQkFDaEIsT0FBTyxFQUNMLEtBQUssQ0FBQyxPQUFPOzBCQUNULFVBQUMsRUFBZ0M7Z0NBQTlCLGdCQUFLOzRCQUEyQixjQUFxQjtpQ0FBckIsVUFBcUIsRUFBckIscUJBQXFCLEVBQXJCLElBQXFCO2dDQUFyQiw2QkFBcUI7OzRCQUN4RCxrQ0FBa0M7NEJBQ2xDLE9BQUEsQ0FBQSxLQUFDLEtBQWEsQ0FBQSxDQUFDLE9BQU8sWUFBQyxLQUFLLFNBQUssSUFBSTs7d0JBQXJDLENBQXNDOzBCQUN0QyxJQUFJO29CQUNWLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztvQkFDOUIsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLGlCQUFpQjtpQkFDUyxDQUFDO1FBWHRELENBV3NELENBQ3pELEVBQ0g7WUFDRSxxRUFBcUU7WUFDckUsMEJBQTBCO1lBQzFCLENBQUMsT0FBTyxFQUFFO29CQUNSLFdBQVcsRUFBRSxrRkFBa0Y7b0JBQy9GLElBQUksRUFBRSx5QkFBZSxDQUFDLFVBQVUsQ0FBQztvQkFDakMsT0FBTyxFQUFFLGNBQU0sT0FBQSwyQkFBUyxFQUFULENBQVM7aUJBQ3pCLENBQUM7U0FDSCxDQUNGO0tBQ0YsQ0FBQyxDQUFBO0FBQ0osQ0FBQzs7QUFyREQsK0NBcURDIn0=