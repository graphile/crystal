"use strict";
var graphql_1 = require("graphql");
var utils_1 = require("../../utils");
var getQueryGqlType_1 = require("../getQueryGqlType");
exports.$$nodeType = Symbol('nodeType');
var getNodeInterfaceType = utils_1.memoize1(createNodeInterfaceType);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getNodeInterfaceType;
function createNodeInterfaceType(buildToken) {
    var options = buildToken.options;
    return new graphql_1.GraphQLInterfaceType({
        name: 'Node',
        description: "An object with a globally unique " + utils_1.scrib.type(graphql_1.GraphQLID) + ".",
        resolveType: function (value) { return value === getQueryGqlType_1.$$isQuery ? getQueryGqlType_1.default(buildToken) : graphql_1.getNullableType(value[exports.$$nodeType]); },
        fields: (_a = {},
            _a[options.nodeIdFieldName] = {
                description: 'A globally unique identifier. Can be used in various places throughout the system to identify this single value.',
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID),
            },
            _a),
    });
    var _a;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0Tm9kZUludGVyZmFjZVR5cGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZ3JhcGhxbC9zY2hlbWEvbm9kZS9nZXROb2RlSW50ZXJmYWNlVHlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsbUNBQTBGO0FBQzFGLHFDQUE2QztBQUM3QyxzREFBK0Q7QUFHbEQsUUFBQSxVQUFVLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBRTVDLElBQU0sb0JBQW9CLEdBQUcsZ0JBQVEsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFBOztBQUU5RCxrQkFBZSxvQkFBb0IsQ0FBQTtBQUVuQyxpQ0FBa0MsVUFBc0I7SUFDOUMsSUFBQSw0QkFBTyxDQUFlO0lBQzlCLE1BQU0sQ0FBQyxJQUFJLDhCQUFvQixDQUFDO1FBQzlCLElBQUksRUFBRSxNQUFNO1FBQ1osV0FBVyxFQUFFLHNDQUFvQyxhQUFLLENBQUMsSUFBSSxDQUFDLG1CQUFTLENBQUMsTUFBRztRQUN6RSxXQUFXLEVBQUUsVUFBQyxLQUFTLElBQUssT0FBQSxLQUFLLEtBQUssMkJBQVMsR0FBRyx5QkFBZSxDQUFDLFVBQVUsQ0FBQyxHQUFHLHlCQUFlLENBQUMsS0FBSyxDQUFDLGtCQUFVLENBQUMsQ0FBQyxFQUF0RixDQUFzRjtRQUNsSCxNQUFNO1lBQ0osR0FBQyxPQUFPLENBQUMsZUFBZSxJQUFHO2dCQUN6QixXQUFXLEVBQUUsa0hBQWtIO2dCQUMvSCxJQUFJLEVBQUUsSUFBSSx3QkFBYyxDQUFDLG1CQUFTLENBQUM7YUFDcEM7ZUFDRjtLQUNGLENBQUMsQ0FBQTs7QUFDSixDQUFDIn0=