"use strict";
const graphql_1 = require('graphql');
const interface_1 = require('../../../interface');
const utils_1 = require('../../utils');
const getGqlType_1 = require('../getGqlType');
const transformGqlInputValue_1 = require('../transformGqlInputValue');
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = utils_1.memoize2((buildToken, type) => {
    // Creates the field entries for our paginator condition type.
    const gqlConditionFieldEntries = Array.from(type.fields).map(([fieldName, field]) => [utils_1.formatName.field(fieldName), {
            description: `Checks for equality with the object’s \`${utils_1.formatName.field(fieldName)}\` field.`,
            // Get the type for this field, but always make sure that it is
            // nullable. We don’t want to require conditions.
            type: getGqlType_1.default(buildToken, new interface_1.NullableType(field.type), true),
            // We include this internal name so that we can resolve the arguments
            // back into actual values.
            internalName: fieldName,
        }]);
    // Creates our GraphQL condition type.
    const gqlType = new graphql_1.GraphQLInputObjectType({
        name: utils_1.formatName.type(`${type.name}-condition`),
        description: `A condition to be used against \`${utils_1.formatName.type(type.name)}\` object types. All fields are tested for equality and combined with a logical ‘and.’`,
        fields: utils_1.buildObject(gqlConditionFieldEntries),
    });
    const fromGqlInput = (condition) => condition ? (interface_1.conditionHelpers.and(...gqlConditionFieldEntries.map(([fieldName, field]) => typeof condition[fieldName] !== 'undefined'
        ? interface_1.conditionHelpers.fieldEquals(field.internalName, transformGqlInputValue_1.default(field.type, condition[fieldName]))
        : true))) : true;
    return { gqlType, fromGqlInput };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0Q29uZGl0aW9uR3FsVHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9ncmFwaHFsL3NjaGVtYS9jb2xsZWN0aW9uL2dldENvbmRpdGlvbkdxbFR5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBCQUFnRSxTQUNoRSxDQUFDLENBRHdFO0FBQ3pFLDRCQUFzRSxvQkFDdEUsQ0FBQyxDQUR5RjtBQUMxRix3QkFBa0QsYUFDbEQsQ0FBQyxDQUQ4RDtBQUUvRCw2QkFBdUIsZUFDdkIsQ0FBQyxDQURxQztBQUN0Qyx5Q0FBbUMsMkJBRW5DLENBQUMsQ0FGNkQ7QUFFOUQ7a0JBQWUsZ0JBQVEsQ0FBQyxDQUFVLFVBQXNCLEVBQUUsSUFBZ0I7SUFJeEUsOERBQThEO0lBQzlELE1BQU0sd0JBQXdCLEdBQzVCLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBc0UsQ0FBQyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsS0FDbEgsQ0FBQyxrQkFBVSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUM1QixXQUFXLEVBQUUsMkNBQTJDLGtCQUFVLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFXO1lBQzlGLCtEQUErRDtZQUMvRCxpREFBaUQ7WUFDakQsSUFBSSxFQUFFLG9CQUFVLENBQUMsVUFBVSxFQUFFLElBQUksd0JBQVksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDO1lBQ2hFLHFFQUFxRTtZQUNyRSwyQkFBMkI7WUFDM0IsWUFBWSxFQUFFLFNBQVM7U0FDeEIsQ0FBQyxDQUNILENBQUE7SUFFSCxzQ0FBc0M7SUFDdEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxnQ0FBc0IsQ0FBVTtRQUNsRCxJQUFJLEVBQUUsa0JBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxZQUFZLENBQUM7UUFDL0MsV0FBVyxFQUFFLG9DQUFvQyxrQkFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHdGQUF3RjtRQUNuSyxNQUFNLEVBQUUsbUJBQVcsQ0FBaUMsd0JBQXdCLENBQUM7S0FDOUUsQ0FBQyxDQUFBO0lBRUYsTUFBTSxZQUFZLEdBQUcsQ0FBQyxTQUFvQyxLQUN4RCxTQUFTLEdBQUcsQ0FDViw0QkFBZ0IsQ0FBQyxHQUFHLENBQ2xCLEdBQUcsd0JBQXdCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLEtBQ2pELE9BQU8sU0FBVSxDQUFDLFNBQVMsQ0FBQyxLQUFLLFdBQVc7VUFHeEMsNEJBQWdCLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsZ0NBQXNCLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztVQUczRyxJQUFJLENBQ1QsQ0FDRixDQUNGLEdBQUcsSUFBSSxDQUFBO0lBRVYsTUFBTSxDQUFDLEVBQUMsT0FBTyxFQUFFLFlBQVksRUFBQyxDQUFBO0FBQ2hDLENBQUMsQ0FBQyxDQUFBIn0=