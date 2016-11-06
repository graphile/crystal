"use strict";
const graphql_1 = require('graphql');
const interface_1 = require('../../../interface');
const utils_1 = require('../../utils');
const getGqlType_1 = require('../getGqlType');
const createConnectionGqlField_1 = require('../connection/createConnectionGqlField');
const transformGqlInputValue_1 = require('../transformGqlInputValue');
const getConditionGqlTypeAndConditionFieldEntries = utils_1.memoize2((buildToken, type) => {
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
    const gqlConditionType = new graphql_1.GraphQLInputObjectType({
        name: utils_1.formatName.type(`${type.name}-condition`),
        description: `A condition to be used against \`${utils_1.formatName.type(type.name)}\` object types. All fields are tested for equality and combined with a logical ‘and.’`,
        fields: utils_1.buildObject(gqlConditionFieldEntries),
    });
    return { gqlConditionType, gqlConditionFieldEntries };
});
function createConnectionFieldFromPaginator(buildToken, paginator, collection, relation) {
    const type = collection.type;
    const { gqlConditionType, gqlConditionFieldEntries } = getConditionGqlTypeAndConditionFieldEntries(buildToken, type);
    // Gets the condition input for our paginator by looking through the
    // arguments object and adding a field condition for all the values we
    // find.
    const getPaginatorInput = (source, args) => interface_1.conditionHelpers.and(
    // If this is a reverse relation, add the relation condition
    relation
        ? relation.getTailConditionFromHeadValue(source)
        : true, 
    // For all of our field condition entries, let us add an actual
    // condition to test equality with a given field.
    ...(args.condition
        ? gqlConditionFieldEntries.map(([fieldName, field]) => typeof args.condition[fieldName] !== 'undefined'
            ? interface_1.conditionHelpers.fieldEquals(field.internalName, transformGqlInputValue_1.default(field.type, args.condition[fieldName]))
            : true)
        : []));
    const fieldName = relation
        ? utils_1.formatName.field(`${collection.name}-by-${relation.name}`)
        : utils_1.formatName.field(`all-${collection.name}`);
    return [
        fieldName,
        createConnectionGqlField_1.default(buildToken, paginator, {
            // The one input arg we have for this connection is the `condition` arg.
            inputArgEntries: [
                ['condition', {
                        description: 'A condition to be used in determining which values should be returned by the collection.',
                        type: gqlConditionType,
                    }],
            ],
            getPaginatorInput,
        }),
    ];
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createConnectionFieldFromPaginator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlQ29ubmVjdGlvbkZpZWxkRnJvbVBhZ2luYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9ncmFwaHFsL3NjaGVtYS9jb2xsZWN0aW9uL2NyZWF0ZUNvbm5lY3Rpb25GaWVsZEZyb21QYWdpbmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBCQUFvRixTQUNwRixDQUFDLENBRDRGO0FBQzdGLDRCQUF1RyxvQkFDdkcsQ0FBQyxDQUQwSDtBQUMzSCx3QkFBa0QsYUFDbEQsQ0FBQyxDQUQ4RDtBQUUvRCw2QkFBdUIsZUFDdkIsQ0FBQyxDQURxQztBQUN0QywyQ0FBcUMsd0NBQ3JDLENBQUMsQ0FENEU7QUFDN0UseUNBQW1DLDJCQUVuQyxDQUFDLENBRjZEO0FBRTlELE1BQU0sMkNBQTJDLEdBQUcsZ0JBQVEsQ0FBQyxDQUFDLFVBQXNCLEVBQUUsSUFBZ0I7SUFDcEcsOERBQThEO0lBQzlELE1BQU0sd0JBQXdCLEdBQzVCLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBc0UsQ0FBQyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsS0FDbEgsQ0FBQyxrQkFBVSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUM1QixXQUFXLEVBQUUsMkNBQTJDLGtCQUFVLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFXO1lBQzlGLCtEQUErRDtZQUMvRCxpREFBaUQ7WUFDakQsSUFBSSxFQUFFLG9CQUFVLENBQUMsVUFBVSxFQUFFLElBQUksd0JBQVksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDO1lBQ2hFLHFFQUFxRTtZQUNyRSwyQkFBMkI7WUFDM0IsWUFBWSxFQUFFLFNBQVM7U0FDeEIsQ0FBQyxDQUNILENBQUE7SUFFSCxzQ0FBc0M7SUFDdEMsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLGdDQUFzQixDQUFDO1FBQ2xELElBQUksRUFBRSxrQkFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLFlBQVksQ0FBQztRQUMvQyxXQUFXLEVBQUUsb0NBQW9DLGtCQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsd0ZBQXdGO1FBQ25LLE1BQU0sRUFBRSxtQkFBVyxDQUFpQyx3QkFBd0IsQ0FBQztLQUM5RSxDQUFDLENBQUE7SUFFRixNQUFNLENBQUMsRUFBQyxnQkFBZ0IsRUFBRSx3QkFBd0IsRUFBQyxDQUFBO0FBQ3JELENBQUMsQ0FBQyxDQUFBO0FBSUYsNENBQ0UsVUFBc0IsRUFDdEIsU0FBMkMsRUFDM0MsVUFBc0IsRUFDdEIsUUFBc0M7SUFFdEMsTUFBTSxJQUFJLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQTtJQUU1QixNQUFNLEVBQUMsZ0JBQWdCLEVBQUUsd0JBQXdCLEVBQUMsR0FBRywyQ0FBMkMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUE7SUFFbEgsb0VBQW9FO0lBQ3BFLHNFQUFzRTtJQUN0RSxRQUFRO0lBQ1IsTUFBTSxpQkFBaUIsR0FBRyxDQUFDLE1BQXdCLEVBQUUsSUFBOEMsS0FDakcsNEJBQWdCLENBQUMsR0FBRztJQUNsQiw0REFBNEQ7SUFDNUQsUUFBUTtVQUNKLFFBQVEsQ0FBQyw2QkFBOEIsQ0FBQyxNQUFNLENBQUM7VUFDL0MsSUFBSTtJQUNSLCtEQUErRDtJQUMvRCxpREFBaUQ7SUFDakQsR0FBRyxDQUNELElBQUksQ0FBQyxTQUFTO1VBQ1Ysd0JBQXdCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLEtBQ2hELE9BQU8sSUFBSSxDQUFDLFNBQVUsQ0FBQyxTQUFTLENBQUMsS0FBSyxXQUFXO2NBRzdDLDRCQUFnQixDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFLGdDQUFzQixDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2NBR2hILElBQUksQ0FDVDtVQUNDLEVBQUUsQ0FDUCxDQUNGLENBQUE7SUFFSCxNQUFNLFNBQVMsR0FDYixRQUFRO1VBQ0osa0JBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxVQUFVLENBQUMsSUFBSSxPQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztVQUMxRCxrQkFBVSxDQUFDLEtBQUssQ0FBQyxPQUFPLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFBO0lBRWhELE1BQU0sQ0FBQztRQUNMLFNBQVM7UUFDVCxrQ0FBd0IsQ0FBQyxVQUFVLEVBQUUsU0FBUyxFQUFFO1lBQzlDLHdFQUF3RTtZQUN4RSxlQUFlLEVBQUU7Z0JBQ2YsQ0FBQyxXQUFXLEVBQUU7d0JBQ1osV0FBVyxFQUFFLDBGQUEwRjt3QkFDdkcsSUFBSSxFQUFFLGdCQUFnQjtxQkFDdkIsQ0FBQzthQUNIO1lBQ0QsaUJBQWlCO1NBQ2xCLENBQUM7S0FDSCxDQUFBO0FBQ0gsQ0FBQztBQXRERDtvREFzREMsQ0FBQSJ9