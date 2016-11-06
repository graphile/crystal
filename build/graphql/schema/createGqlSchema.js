"use strict";
const graphql_1 = require('graphql');
const getQueryGqlType_1 = require('./getQueryGqlType');
const getMutationGqlType_1 = require('./getMutationGqlType');
/**
 * Creates a GraphQL schema using an instance of `Inventory`.
 */
function createGqlSchema(inventory, options = {}) {
    // We take our user-friendly arguments to `createGraphqlSchema` and convert them
    // into a build token. One nice side effect of always creating our own
    // build token object is that we have the guarantee that every build token
    // will always maintain its own memoization map.
    const buildToken = {
        inventory,
        options: {
            nodeIdFieldName: options.nodeIdFieldName || '__id',
            dynamicJson: options.dynamicJson || false,
            disableDefaultMutations: options.disableDefaultMutations || false,
        },
        _hooks: options._hooks || {},
        _typeOverrides: options._typeOverrides || new Map(),
    };
    return new graphql_1.GraphQLSchema({
        query: getQueryGqlType_1.default(buildToken),
        mutation: getMutationGqlType_1.default(buildToken),
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createGqlSchema;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlR3FsU2NoZW1hLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dyYXBocWwvc2NoZW1hL2NyZWF0ZUdxbFNjaGVtYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMEJBQThCLFNBQzlCLENBQUMsQ0FEc0M7QUFHdkMsa0NBQTRCLG1CQUM1QixDQUFDLENBRDhDO0FBQy9DLHFDQUErQixzQkFFL0IsQ0FBQyxDQUZvRDtBQXFCckQ7O0dBRUc7QUFDSCx5QkFBeUMsU0FBb0IsRUFBRSxPQUFPLEdBQWtCLEVBQUU7SUFDeEYsZ0ZBQWdGO0lBQ2hGLHNFQUFzRTtJQUN0RSwwRUFBMEU7SUFDMUUsZ0RBQWdEO0lBQ2hELE1BQU0sVUFBVSxHQUFlO1FBQzdCLFNBQVM7UUFDVCxPQUFPLEVBQUU7WUFDUCxlQUFlLEVBQUUsT0FBTyxDQUFDLGVBQWUsSUFBSSxNQUFNO1lBQ2xELFdBQVcsRUFBRSxPQUFPLENBQUMsV0FBVyxJQUFJLEtBQUs7WUFDekMsdUJBQXVCLEVBQUUsT0FBTyxDQUFDLHVCQUF1QixJQUFJLEtBQUs7U0FDbEU7UUFDRCxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU0sSUFBSSxFQUFFO1FBQzVCLGNBQWMsRUFBRSxPQUFPLENBQUMsY0FBYyxJQUFJLElBQUksR0FBRyxFQUFFO0tBQ3BELENBQUE7SUFFRCxNQUFNLENBQUMsSUFBSSx1QkFBYSxDQUFDO1FBQ3ZCLEtBQUssRUFBRSx5QkFBZSxDQUFDLFVBQVUsQ0FBQztRQUNsQyxRQUFRLEVBQUUsNEJBQWtCLENBQUMsVUFBVSxDQUFDO0tBQ3pDLENBQUMsQ0FBQTtBQUNKLENBQUM7QUFwQkQ7aUNBb0JDLENBQUEifQ==