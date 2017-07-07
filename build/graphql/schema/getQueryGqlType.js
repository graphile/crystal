"use strict";
var graphql_1 = require("graphql");
var utils_1 = require("../utils");
var createNodeFieldEntry_1 = require("./node/createNodeFieldEntry");
var getNodeInterfaceType_1 = require("./node/getNodeInterfaceType");
var createCollectionQueryFieldEntries_1 = require("./collection/createCollectionQueryFieldEntries");
exports.$$isQuery = Symbol('isQuery');
// TODO: doc
var getGqlQueryType = utils_1.memoize1(createGqlQueryType);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getGqlQueryType;
// TODO: doc
function createGqlQueryType(buildToken) {
    var options = buildToken.options, inventory = buildToken.inventory;
    var queryType;
    queryType = new graphql_1.GraphQLObjectType({
        name: 'Query',
        description: 'The root query type which gives access points into the data universe.',
        interfaces: [getNodeInterfaceType_1.default(buildToken)],
        // A value in our system is the value of this query type if there is no parent type
        // (i.e. it is the root type), or the value is the symbol `$$isQuery`.
        isTypeOf: function (value, _context, info) { return info.parentType == null || value === exports.$$isQuery; },
        fields: function () { return utils_1.buildObject([
            createNodeFieldEntry_1.default(buildToken),
        ], 
        // Add the query field entires from our build token hooks.
        buildToken._hooks.queryFieldEntries
            ? buildToken._hooks.queryFieldEntries(buildToken)
            : [], inventory
            .getCollections()
            .map(function (collection) { return createCollectionQueryFieldEntries_1.default(buildToken, collection); })
            .reduce(function (a, b) { return a.concat(b); }, []), [
            // The root query type is useful for Relay 1 as it limits what fields
            // can be queried at the top level.
            ['query', {
                    description: 'Exposes the root query type nested one level down. This is helpful for Relay 1 which can only query top level fields if they are in a particular form.',
                    type: new graphql_1.GraphQLNonNull(queryType),
                    resolve: function (_source) { return exports.$$isQuery; },
                }],
            // The root query type needs to implement `Node` and have an id for
            // Relay 1 mutations. This may be deprecated in the future.
            [options.nodeIdFieldName, {
                    description: 'The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`.',
                    type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID),
                    resolve: function () { return 'query'; },
                }],
        ]); },
    });
    return queryType;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0UXVlcnlHcWxUeXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dyYXBocWwvc2NoZW1hL2dldFF1ZXJ5R3FsVHlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsbUNBQTBGO0FBQzFGLGtDQUFnRDtBQUNoRCxvRUFBOEQ7QUFDOUQsb0VBQThEO0FBQzlELG9HQUE4RjtBQUdqRixRQUFBLFNBQVMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUE7QUFFMUMsWUFBWTtBQUNaLElBQU0sZUFBZSxHQUFHLGdCQUFRLENBQUMsa0JBQWtCLENBQUMsQ0FBQTs7QUFFcEQsa0JBQWUsZUFBZSxDQUFBO0FBRTlCLFlBQVk7QUFDWiw0QkFBNkIsVUFBc0I7SUFDekMsSUFBQSw0QkFBTyxFQUFFLGdDQUFTLENBQWU7SUFDekMsSUFBSSxTQUE0QixDQUFBO0lBRWhDLFNBQVMsR0FBRyxJQUFJLDJCQUFpQixDQUFDO1FBQ2hDLElBQUksRUFBRSxPQUFPO1FBQ2IsV0FBVyxFQUFFLHVFQUF1RTtRQUNwRixVQUFVLEVBQUUsQ0FBQyw4QkFBb0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM5QyxtRkFBbUY7UUFDbkYsc0VBQXNFO1FBQ3RFLFFBQVEsRUFBRSxVQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsSUFBSSxJQUFLLE9BQUEsSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLElBQUksS0FBSyxLQUFLLGlCQUFTLEVBQTlDLENBQThDO1FBQ25GLE1BQU0sRUFBRSxjQUFNLE9BQUEsbUJBQVcsQ0FDdkI7WUFDRSw4QkFBb0IsQ0FBQyxVQUFVLENBQUM7U0FDakM7UUFDRCwwREFBMEQ7UUFDMUQsVUFBVSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUI7Y0FDL0IsVUFBVSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUM7Y0FDL0MsRUFBRSxFQUNOLFNBQVM7YUFDTixjQUFjLEVBQUU7YUFDaEIsR0FBRyxDQUFDLFVBQUEsVUFBVSxJQUFJLE9BQUEsMkNBQWlDLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxFQUF6RCxDQUF5RCxDQUFDO2FBQzVFLE1BQU0sQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDLElBQUssT0FBQSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFYLENBQVcsRUFBRSxFQUFFLENBQUMsRUFDcEM7WUFDRSxxRUFBcUU7WUFDckUsbUNBQW1DO1lBQ25DLENBQUMsT0FBTyxFQUFFO29CQUNSLFdBQVcsRUFBRSx3SkFBd0o7b0JBQ3JLLElBQUksRUFBRSxJQUFJLHdCQUFjLENBQUMsU0FBUyxDQUFDO29CQUNuQyxPQUFPLEVBQUUsVUFBQSxPQUFPLElBQUksT0FBQSxpQkFBUyxFQUFULENBQVM7aUJBQzlCLENBQUM7WUFDRixtRUFBbUU7WUFDbkUsMkRBQTJEO1lBQzNELENBQUMsT0FBTyxDQUFDLGVBQWUsRUFBRTtvQkFDeEIsV0FBVyxFQUFFLDBHQUEwRztvQkFDdkgsSUFBSSxFQUFFLElBQUksd0JBQWMsQ0FBQyxtQkFBUyxDQUFDO29CQUNuQyxPQUFPLEVBQUUsY0FBTSxPQUFBLE9BQU8sRUFBUCxDQUFPO2lCQUN2QixDQUFDO1NBQ0gsQ0FDRixFQTVCYSxDQTRCYjtLQUNGLENBQUMsQ0FBQTtJQUVGLE1BQU0sQ0FBQyxTQUFTLENBQUE7QUFDbEIsQ0FBQyJ9