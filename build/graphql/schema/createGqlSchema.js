"use strict";
var graphql_1 = require("graphql");
var getQueryGqlType_1 = require("./getQueryGqlType");
var getMutationGqlType_1 = require("./getMutationGqlType");
/**
 * Creates a GraphQL schema using an instance of `Inventory`.
 */
function createGqlSchema(inventory, options) {
    if (options === void 0) { options = {}; }
    // We take our user-friendly arguments to `createGraphqlSchema` and convert them
    // into a build token. One nice side effect of always creating our own
    // build token object is that we have the guarantee that every build token
    // will always maintain its own memoization map.
    var buildToken = {
        inventory: inventory,
        options: {
            nodeIdFieldName: options.nodeIdFieldName || 'nodeId',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlR3FsU2NoZW1hLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dyYXBocWwvc2NoZW1hL2NyZWF0ZUdxbFNjaGVtYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsbUNBQXVDO0FBR3ZDLHFEQUErQztBQUMvQywyREFBcUQ7QUFvQnJEOztHQUVHO0FBQ0gseUJBQXlDLFNBQW9CLEVBQUUsT0FBMkI7SUFBM0Isd0JBQUEsRUFBQSxZQUEyQjtJQUN4RixnRkFBZ0Y7SUFDaEYsc0VBQXNFO0lBQ3RFLDBFQUEwRTtJQUMxRSxnREFBZ0Q7SUFDaEQsSUFBTSxVQUFVLEdBQWU7UUFDN0IsU0FBUyxXQUFBO1FBQ1QsT0FBTyxFQUFFO1lBQ1AsZUFBZSxFQUFFLE9BQU8sQ0FBQyxlQUFlLElBQUksUUFBUTtZQUNwRCxXQUFXLEVBQUUsT0FBTyxDQUFDLFdBQVcsSUFBSSxLQUFLO1lBQ3pDLHVCQUF1QixFQUFFLE9BQU8sQ0FBQyx1QkFBdUIsSUFBSSxLQUFLO1NBQ2xFO1FBQ0QsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNLElBQUksRUFBRTtRQUM1QixjQUFjLEVBQUUsT0FBTyxDQUFDLGNBQWMsSUFBSSxJQUFJLEdBQUcsRUFBRTtLQUNwRCxDQUFBO0lBRUQsTUFBTSxDQUFDLElBQUksdUJBQWEsQ0FBQztRQUN2QixLQUFLLEVBQUUseUJBQWUsQ0FBQyxVQUFVLENBQUM7UUFDbEMsUUFBUSxFQUFFLDRCQUFrQixDQUFDLFVBQVUsQ0FBQztLQUN6QyxDQUFDLENBQUE7QUFDSixDQUFDOztBQXBCRCxrQ0FvQkMifQ==