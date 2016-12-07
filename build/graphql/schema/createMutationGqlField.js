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
const utils_1 = require('../utils');
const createMutationPayloadGqlType_1 = require('./createMutationPayloadGqlType');
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
                    name: utils_1.formatName.type(`${config.name}-input`),
                    description: `All input for the \`${utils_1.formatName.field(config.name)}\` mutation.`,
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
        resolve(_source, args, context) {
            return __awaiter(this, void 0, void 0, function* () {
                const { clientMutationId } = args['input'];
                const value = yield config.execute(context, args['input']);
                return {
                    clientMutationId,
                    value,
                };
            });
        },
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createMutationGqlField;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlTXV0YXRpb25HcWxGaWVsZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ncmFwaHFsL3NjaGVtYS9jcmVhdGVNdXRhdGlvbkdxbEZpZWxkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLDBCQU9PLFNBQ1AsQ0FBQyxDQURlO0FBQ2hCLHdCQUF3QyxVQUN4QyxDQUFDLENBRGlEO0FBRWxELCtDQUF5QyxnQ0FPekMsQ0FBQyxDQVB3RTtBQXdCekU7Ozs7Ozs7OztHQVNHO0FBQ0gsZ0NBQ0UsVUFBc0IsRUFDdEIsTUFBOEI7SUFFOUIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVksSUFBSSxNQUFNLENBQUMsV0FBVyxDQUFDO1FBQzVDLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0ZBQWdGLENBQUMsQ0FBQTtJQUVuRyxNQUFNLENBQUM7UUFDTCxXQUFXLEVBQUUsTUFBTSxDQUFDLFdBQVc7UUFFL0IseUVBQXlFO1FBQ3pFLHlFQUF5RTtRQUN6RSwyRUFBMkU7UUFDM0UseUVBQXlFO1FBQ3pFLElBQUksRUFBRTtZQUNKLEtBQUssRUFBRTtnQkFDTCxXQUFXLEVBQUUsMEhBQTBIO2dCQUN2SSxJQUFJLEVBQUUsSUFBSSx3QkFBYyxDQUFDLElBQUksZ0NBQXNCLENBQUM7b0JBQ2xELElBQUksRUFBRSxrQkFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLFFBQVEsQ0FBQztvQkFDN0MsV0FBVyxFQUFFLHVCQUF1QixrQkFBVSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWM7b0JBQy9FLE1BQU0sRUFBRSxtQkFBVyxDQUNqQjt3QkFDRSxnRUFBZ0U7d0JBQ2hFLGlEQUFpRDt3QkFDakQsQ0FBQyxrQkFBa0IsRUFBRTtnQ0FDbkIsV0FBVyxFQUFFLDZJQUE2STtnQ0FDMUosSUFBSSxFQUFFLHVCQUFhOzZCQUNwQixDQUFDO3FCQUNIO29CQUNELCtEQUErRDtvQkFDL0QsY0FBYztvQkFDZCxDQUFDLE1BQU0sQ0FBQyxXQUFXLElBQUksRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUMzQztpQkFDRixDQUFDLENBQUM7YUFDSjtTQUNGO1FBRUQsd0VBQXdFO1FBQ3hFLHVFQUF1RTtRQUN2RSx5RUFBeUU7UUFDekUsc0JBQXNCO1FBQ3RCLElBQUksRUFDRixNQUFNLENBQUMsV0FBVztjQUNkLE1BQU0sQ0FBQyxXQUFXO2NBQ2xCLHNDQUE0QixDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUM7UUFFdEQsb0VBQW9FO1FBQ3BFLDJEQUEyRDtRQUMzRCxpRUFBaUU7UUFDM0QsT0FBTyxDQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTzs7Z0JBQ25DLE1BQU0sRUFBRSxnQkFBZ0IsRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtnQkFDMUMsTUFBTSxLQUFLLEdBQUcsTUFBTSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQTtnQkFFMUQsTUFBTSxDQUFDO29CQUNMLGdCQUFnQjtvQkFDaEIsS0FBSztpQkFDTixDQUFBO1lBQ0gsQ0FBQztTQUFBO0tBQ0YsQ0FBQTtBQUNILENBQUM7QUEzREQ7d0NBMkRDLENBQUEifQ==