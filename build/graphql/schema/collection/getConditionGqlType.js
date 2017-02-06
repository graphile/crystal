"use strict";
var graphql_1 = require("graphql");
var interface_1 = require("../../../interface");
var utils_1 = require("../../utils");
var getGqlInputType_1 = require("../type/getGqlInputType");
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = utils_1.memoize2(createConditionGqlType);
function createConditionGqlType(buildToken, type) {
    // Creates the field entries for our paginator condition type.
    var gqlConditionFieldEntries = Array.from(type.fields).map(function (_a) {
        var fieldName = _a[0], field = _a[1];
        var _b = getGqlInputType_1.default(buildToken, new interface_1.NullableType(field.type)), gqlType = _b.gqlType, fromGqlInput = _b.fromGqlInput;
        return {
            key: utils_1.formatName.field(fieldName),
            value: {
                description: "Checks for equality with the object\u2019s `" + utils_1.formatName.field(fieldName) + "` field.",
                // Get the type for this field, but always make sure that it is
                // nullable. We don’t want to require conditions.
                type: gqlType,
                // We include this internal name so that we can resolve the
                // arguments back into actual values.
                internalName: fieldName,
                // We also include the input transformer function so we can use it
                // later.
                fromGqlInput: fromGqlInput,
            },
        };
    });
    // Creates our GraphQL condition type.
    var gqlType = new graphql_1.GraphQLInputObjectType({
        name: utils_1.formatName.type(type.name + "-condition"),
        description: "A condition to be used against `" + utils_1.formatName.type(type.name) + "` object types. All fields are tested for equality and combined with a logical \u2018and.\u2019",
        fields: utils_1.buildObject(gqlConditionFieldEntries),
    });
    var fromGqlInput = function (condition) {
        return condition ? (interface_1.conditionHelpers.and.apply(interface_1.conditionHelpers, gqlConditionFieldEntries.map(function (_a) {
            var fieldName = _a.key, _b = _a.value, internalName = _b.internalName, fieldFromGqlInput = _b.fromGqlInput;
            return typeof condition[fieldName] !== 'undefined'
                ? interface_1.conditionHelpers.fieldEquals(internalName, fieldFromGqlInput(condition[fieldName]))
                : true;
        }))) : true;
    };
    return { gqlType: gqlType, fromGqlInput: fromGqlInput };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0Q29uZGl0aW9uR3FsVHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9ncmFwaHFsL3NjaGVtYS9jb2xsZWN0aW9uL2dldENvbmRpdGlvbkdxbFR5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLG1DQUF5RTtBQUN6RSxnREFBMEY7QUFDMUYscUNBQStEO0FBQy9ELDJEQUFxRDs7QUFHckQsa0JBQWUsZ0JBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFBO0FBRS9DLGdDQUF5QyxVQUFzQixFQUFFLElBQXdCO0lBSXZGLDhEQUE4RDtJQUM5RCxJQUFNLHdCQUF3QixHQUM1QixLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQ3pCLFVBQWMsRUFBbUU7WUFBbEUsaUJBQVMsRUFBRSxhQUFLO1FBQ3ZCLElBQUEsb0ZBQXFGLEVBQW5GLG9CQUFPLEVBQUUsOEJBQVksQ0FBOEQ7UUFDM0YsTUFBTSxDQUFDO1lBQ0wsR0FBRyxFQUFFLGtCQUFVLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUNoQyxLQUFLLEVBQUU7Z0JBQ0wsV0FBVyxFQUFFLGlEQUEyQyxrQkFBVSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsYUFBVztnQkFDOUYsK0RBQStEO2dCQUMvRCxpREFBaUQ7Z0JBQ2pELElBQUksRUFBRSxPQUFPO2dCQUNiLDJEQUEyRDtnQkFDM0QscUNBQXFDO2dCQUNyQyxZQUFZLEVBQUUsU0FBUztnQkFDdkIsa0VBQWtFO2dCQUNsRSxTQUFTO2dCQUNULFlBQVksY0FBQTthQUNiO1NBQ0YsQ0FBQTtJQUNILENBQUMsQ0FBQyxDQUFBO0lBRU4sc0NBQXNDO0lBQ3RDLElBQU0sT0FBTyxHQUFHLElBQUksZ0NBQXNCLENBQUM7UUFDekMsSUFBSSxFQUFFLGtCQUFVLENBQUMsSUFBSSxDQUFJLElBQUksQ0FBQyxJQUFJLGVBQVksQ0FBQztRQUMvQyxXQUFXLEVBQUUscUNBQW9DLGtCQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsb0dBQXdGO1FBQ25LLE1BQU0sRUFBRSxtQkFBVyxDQUEwQix3QkFBd0IsQ0FBQztLQUN2RSxDQUFDLENBQUE7SUFFRixJQUFNLFlBQVksR0FBRyxVQUFDLFNBQW9DO1FBQ3hELE9BQUEsU0FBUyxHQUFHLENBQ1YsNEJBQWdCLENBQUMsR0FBRyxPQUFwQiw0QkFBZ0IsRUFDWCx3QkFBd0IsQ0FBQyxHQUFHLENBQUMsVUFBQyxFQUE0RTtnQkFBMUUsa0JBQWMsRUFBRSxhQUF3RCxFQUEvQyw4QkFBWSxFQUFFLG1DQUErQjtZQUN2RyxPQUFBLE9BQU8sU0FBVSxDQUFDLFNBQVMsQ0FBQyxLQUFLLFdBQVc7a0JBR3hDLDRCQUFnQixDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsaUJBQWlCLENBQUMsU0FBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7a0JBR3BGLElBQUk7UUFOUixDQU1RLENBQ1QsRUFFSixHQUFHLElBQUk7SUFaUixDQVlRLENBQUE7SUFFVixNQUFNLENBQUMsRUFBRSxPQUFPLFNBQUEsRUFBRSxZQUFZLGNBQUEsRUFBRSxDQUFBO0FBQ2xDLENBQUMifQ==