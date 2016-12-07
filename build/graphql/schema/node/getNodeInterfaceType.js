"use strict";
const graphql_1 = require('graphql');
const utils_1 = require('../../utils');
// TODO: doc why this is memoized
const getNodeInterfaceType = utils_1.memoize1(createNodeInterfaceType);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getNodeInterfaceType;
// TODO: doc
function createNodeInterfaceType(buildToken) {
    const { options } = buildToken;
    return new graphql_1.GraphQLInterfaceType({
        name: 'Node',
        description: `An object with a globally unique ${utils_1.scrib.type(graphql_1.GraphQLID)}.`,
        fields: {
            [options.nodeIdFieldName]: {
                description: 'A globally unique identifier. Can be used in various places throughout the system to identify this single value.',
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID),
            },
        },
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0Tm9kZUludGVyZmFjZVR5cGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZ3JhcGhxbC9zY2hlbWEvbm9kZS9nZXROb2RlSW50ZXJmYWNlVHlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMEJBQWdFLFNBQ2hFLENBQUMsQ0FEd0U7QUFDekUsd0JBQWdDLGFBQ2hDLENBQUMsQ0FENEM7QUFHN0MsaUNBQWlDO0FBQ2pDLE1BQU0sb0JBQW9CLEdBQUcsZ0JBQVEsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFBO0FBRTlEO2tCQUFlLG9CQUFvQixDQUFBO0FBRW5DLFlBQVk7QUFDWixpQ0FBa0MsVUFBc0I7SUFDdEQsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLFVBQVUsQ0FBQTtJQUM5QixNQUFNLENBQUMsSUFBSSw4QkFBb0IsQ0FBUTtRQUNyQyxJQUFJLEVBQUUsTUFBTTtRQUNaLFdBQVcsRUFBRSxvQ0FBb0MsYUFBSyxDQUFDLElBQUksQ0FBQyxtQkFBUyxDQUFDLEdBQUc7UUFDekUsTUFBTSxFQUFFO1lBQ04sQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLEVBQUU7Z0JBQ3pCLFdBQVcsRUFBRSxrSEFBa0g7Z0JBQy9ILElBQUksRUFBRSxJQUFJLHdCQUFjLENBQUMsbUJBQVMsQ0FBQzthQUNwQztTQUNGO0tBQ0YsQ0FBQyxDQUFBO0FBQ0osQ0FBQyJ9