"use strict";
const graphql_1 = require('graphql');
const utils_1 = require('../utils');
const getQueryGqlType_1 = require('./getQueryGqlType');
/**
 * Creates the payload type for a GraphQL mutation. Uses the provided output
 * fields and adds a `clientMutationId` and `query` field.
 */
function createMutationPayloadGqlType(buildToken, config) {
    return new graphql_1.GraphQLObjectType({
        name: utils_1.formatName.type(`${config.name}-payload`),
        description: `The output of our \`${utils_1.formatName.field(config.name)}\` mutation.`,
        fields: utils_1.buildObject([
            // Add the `clientMutationId` output field. This will be the exact
            // same value as the input `clientMutationId`.
            ['clientMutationId', {
                    description: `The exact same \`clientMutationId\` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations.`,
                    type: graphql_1.GraphQLString,
                    resolve: ({ clientMutationId }) => clientMutationId,
                }],
        ], 
        // Add all of our output fields to the output object verbatim. Simple
        // as that. We do transform the fields to mask the implementation
        // detail of `MutationValue` being an object. Instead we just pass
        // `MutationValue#value` directly to the resolver.
        (config.outputFields || [])
            .filter(Boolean)
            .map(([fieldName, field]) => [fieldName, {
                type: field.type,
                args: field.args,
                resolve: field.resolve
                    ? ({ value }, ...rest) => 
                    // tslint:disable-next-line no-any
                    field.resolve(value, ...rest)
                    : null,
                description: field.description,
                deprecationReason: field.deprecationReason,
            }]), [
            // A reference to the root query type. Allows you to access even more
            // data in your mutations.
            ['query', {
                    description: 'Our root query field type. Allows us to run any query from our mutation payload.',
                    type: getQueryGqlType_1.default(buildToken),
                    resolve: () => getQueryGqlType_1.$$isQuery,
                }],
        ]),
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createMutationPayloadGqlType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlTXV0YXRpb25QYXlsb2FkR3FsVHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ncmFwaHFsL3NjaGVtYS9jcmVhdGVNdXRhdGlvblBheWxvYWRHcWxUeXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwwQkFBcUUsU0FDckUsQ0FBQyxDQUQ2RTtBQUM5RSx3QkFBd0MsVUFDeEMsQ0FBQyxDQURpRDtBQUdsRCxrQ0FBMkMsbUJBTTNDLENBQUMsQ0FONkQ7QUFFOUQ7OztHQUdHO0FBQ0gsc0NBQ0UsVUFBc0IsRUFDdEIsTUFHQztJQUVELE1BQU0sQ0FBQyxJQUFJLDJCQUFpQixDQUFtQjtRQUM3QyxJQUFJLEVBQUUsa0JBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxVQUFVLENBQUM7UUFDL0MsV0FBVyxFQUFFLHVCQUF1QixrQkFBVSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWM7UUFDL0UsTUFBTSxFQUFFLG1CQUFXLENBQ2pCO1lBQ0Usa0VBQWtFO1lBQ2xFLDhDQUE4QztZQUM5QyxDQUFDLGtCQUFrQixFQUFFO29CQUNuQixXQUFXLEVBQUUsZ0pBQWdKO29CQUM3SixJQUFJLEVBQUUsdUJBQWE7b0JBQ25CLE9BQU8sRUFBRSxDQUFDLEVBQUUsZ0JBQWdCLEVBQUUsS0FBSyxnQkFBZ0I7aUJBQ3BELENBQUM7U0FDSDtRQUNELHFFQUFxRTtRQUNyRSxpRUFBaUU7UUFDakUsa0VBQWtFO1FBQ2xFLGtEQUFrRDtRQUNsRCxDQUFDLE1BQU0sQ0FBQyxZQUFZLElBQUksRUFBRSxDQUFDO2FBQ3hCLE1BQU0sQ0FBQyxPQUFPLENBQUM7YUFDZixHQUFHLENBQ0YsQ0FBQyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQXlDLEtBQ3pELENBQUMsU0FBUyxFQUFFO2dCQUNWLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtnQkFDaEIsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO2dCQUNoQixPQUFPLEVBQ0wsS0FBSyxDQUFDLE9BQU87c0JBQ1QsQ0FBQyxFQUFFLEtBQUssRUFBb0IsRUFBRSxHQUFHLElBQWtCO29CQUNuRCxrQ0FBa0M7b0JBQ2pDLEtBQWEsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsSUFBSSxDQUFDO3NCQUN0QyxJQUFJO2dCQUNWLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztnQkFDOUIsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLGlCQUFpQjthQUNJLENBQUMsQ0FDcEQsRUFDSDtZQUNFLHFFQUFxRTtZQUNyRSwwQkFBMEI7WUFDMUIsQ0FBQyxPQUFPLEVBQUU7b0JBQ1IsV0FBVyxFQUFFLGtGQUFrRjtvQkFDL0YsSUFBSSxFQUFFLHlCQUFlLENBQUMsVUFBVSxDQUFDO29CQUNqQyxPQUFPLEVBQUUsTUFBTSwyQkFBUztpQkFDekIsQ0FBQztTQUNILENBQ0Y7S0FDRixDQUFDLENBQUE7QUFDSixDQUFDO0FBcEREOzhDQW9EQyxDQUFBIn0=