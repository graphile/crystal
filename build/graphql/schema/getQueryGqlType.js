"use strict";
const graphql_1 = require('graphql');
const utils_1 = require('../utils');
const createNodeFieldEntry_1 = require('./node/createNodeFieldEntry');
const getNodeInterfaceType_1 = require('./node/getNodeInterfaceType');
const createCollectionQueryFieldEntries_1 = require('./collection/createCollectionQueryFieldEntries');
exports.$$isQuery = Symbol('isQuery');
// TODO: doc
const getGqlQueryType = utils_1.memoize1(createGqlQueryType);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getGqlQueryType;
// TODO: doc
function createGqlQueryType(buildToken) {
    const { options, inventory } = buildToken;
    let queryType;
    queryType = new graphql_1.GraphQLObjectType({
        name: 'Query',
        description: 'The root query type which gives access points into the data universe.',
        interfaces: [getNodeInterfaceType_1.default(buildToken)],
        // A value in our system is the value of this query type if there is no parent type
        // (i.e. it is the root type), or the value is the symbol `$$isQuery`.
        isTypeOf: (value, context, info) => info.parentType == null || value === exports.$$isQuery,
        fields: () => utils_1.buildObject([
            createNodeFieldEntry_1.default(buildToken),
        ], 
        // Add the query field entires from our build token hooks.
        buildToken._hooks.queryFieldEntries
            ? buildToken._hooks.queryFieldEntries(buildToken)
            : [], inventory
            .getCollections()
            .map(collection => createCollectionQueryFieldEntries_1.default(buildToken, collection))
            .reduce((a, b) => a.concat(b), []), [
            // The root query type is useful for Relay 1 as it limits what fields
            // can be queried at the top level.
            ['query', {
                    description: 'Exposes the root query type nested one level down. This is helpful for Relay 1 which can only query top level fields if they are in a particular form.',
                    type: new graphql_1.GraphQLNonNull(queryType),
                    resolve: source => exports.$$isQuery,
                }],
            // The root query type needs to implement `Node` and have an id for
            // Relay 1 mutations. This may be deprecated in the future.
            [options.nodeIdFieldName, {
                    description: 'The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`.',
                    type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID),
                    resolve: () => 'query',
                }],
        ]),
    });
    return queryType;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0UXVlcnlHcWxUeXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dyYXBocWwvc2NoZW1hL2dldFF1ZXJ5R3FsVHlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMEJBQWlGLFNBQ2pGLENBQUMsQ0FEeUY7QUFDMUYsd0JBQXNDLFVBQ3RDLENBQUMsQ0FEK0M7QUFDaEQsdUNBQWlDLDZCQUNqQyxDQUFDLENBRDZEO0FBQzlELHVDQUFpQyw2QkFDakMsQ0FBQyxDQUQ2RDtBQUM5RCxvREFBOEMsZ0RBQzlDLENBQUMsQ0FENkY7QUFHakYsaUJBQVMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUE7QUFFMUMsWUFBWTtBQUNaLE1BQU0sZUFBZSxHQUFHLGdCQUFRLENBQUMsa0JBQWtCLENBQUMsQ0FBQTtBQUVwRDtrQkFBZSxlQUFlLENBQUE7QUFFOUIsWUFBWTtBQUNaLDRCQUE2QixVQUFzQjtJQUNqRCxNQUFNLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxHQUFHLFVBQVUsQ0FBQTtJQUN6QyxJQUFJLFNBQW1DLENBQUE7SUFFdkMsU0FBUyxHQUFHLElBQUksMkJBQWlCLENBQVE7UUFDdkMsSUFBSSxFQUFFLE9BQU87UUFDYixXQUFXLEVBQUUsdUVBQXVFO1FBQ3BGLFVBQVUsRUFBRSxDQUFDLDhCQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzlDLG1GQUFtRjtRQUNuRixzRUFBc0U7UUFDdEUsUUFBUSxFQUFFLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUFJLEtBQUssSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLElBQUksS0FBSyxLQUFLLGlCQUFTO1FBQ2xGLE1BQU0sRUFBRSxNQUFNLG1CQUFXLENBQ3ZCO1lBQ0UsOEJBQW9CLENBQUMsVUFBVSxDQUFDO1NBQ2pDO1FBQ0QsMERBQTBEO1FBQzFELFVBQVUsQ0FBQyxNQUFNLENBQUMsaUJBQWlCO2NBQy9CLFVBQVUsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDO2NBQy9DLEVBQUUsRUFDTixTQUFTO2FBQ04sY0FBYyxFQUFFO2FBQ2hCLEdBQUcsQ0FBQyxVQUFVLElBQUksMkNBQWlDLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO2FBQzVFLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFDcEM7WUFDRSxxRUFBcUU7WUFDckUsbUNBQW1DO1lBQ25DLENBQUMsT0FBTyxFQUFFO29CQUNSLFdBQVcsRUFBRSx3SkFBd0o7b0JBQ3JLLElBQUksRUFBRSxJQUFJLHdCQUFjLENBQUMsU0FBUyxDQUFDO29CQUNuQyxPQUFPLEVBQUUsTUFBTSxJQUFJLGlCQUFTO2lCQUM3QixDQUFDO1lBQ0YsbUVBQW1FO1lBQ25FLDJEQUEyRDtZQUMzRCxDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUU7b0JBQ3hCLFdBQVcsRUFBRSwwR0FBMEc7b0JBQ3ZILElBQUksRUFBRSxJQUFJLHdCQUFjLENBQUMsbUJBQVMsQ0FBQztvQkFDbkMsT0FBTyxFQUFFLE1BQU0sT0FBTztpQkFDdkIsQ0FBQztTQUNILENBQ0Y7S0FDRixDQUFDLENBQUE7SUFFRixNQUFNLENBQUMsU0FBUyxDQUFBO0FBQ2xCLENBQUMifQ==