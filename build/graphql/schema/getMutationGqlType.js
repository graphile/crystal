"use strict";
const graphql_1 = require('graphql');
const utils_1 = require('../utils');
const createCollectionMutationFieldEntries_1 = require('./collection/createCollectionMutationFieldEntries');
/**
 * Gets the mutation type which includes all available mutations for our
 * schema. If there are no mutations, instead of throwing an error we will just
 * return `undefined`.
 */
const getMutationGqlType = utils_1.memoize1(createMutationGqlType);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getMutationGqlType;
/**
 * Internal create implementation for `getMutationType`.
 *
 * @private
 */
function createMutationGqlType(buildToken) {
    const { inventory, options } = buildToken;
    // A list of all the mutations we are able to run.
    const mutationFieldEntries = [
        // Add the mutation field entires from our build token hooks.
        ...(buildToken._hooks.mutationFieldEntries
            ? buildToken._hooks.mutationFieldEntries(buildToken)
            : []),
        ...(options.disableDefaultMutations
            ? []
            :
                // for them.
                inventory
                    .getCollections()
                    .map(collection => createCollectionMutationFieldEntries_1.default(buildToken, collection))
                    .reduce((a, b) => a.concat(b), [])),
    ];
    // If there are no mutation fields, just return to avoid errors.
    if (mutationFieldEntries.length === 0)
        return;
    return new graphql_1.GraphQLObjectType({
        name: 'Mutation',
        description: 'The root mutation type which contains root level fields which mutate data.',
        fields: () => utils_1.buildObject(mutationFieldEntries),
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0TXV0YXRpb25HcWxUeXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dyYXBocWwvc2NoZW1hL2dldE11dGF0aW9uR3FsVHlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMEJBQXNELFNBQ3RELENBQUMsQ0FEOEQ7QUFDL0Qsd0JBQXNDLFVBQ3RDLENBQUMsQ0FEK0M7QUFFaEQsdURBQWlELG1EQU9qRCxDQUFDLENBUG1HO0FBRXBHOzs7O0dBSUc7QUFDSCxNQUFNLGtCQUFrQixHQUFHLGdCQUFRLENBQUMscUJBQXFCLENBQUMsQ0FBQTtBQUUxRDtrQkFBZSxrQkFBa0IsQ0FBQTtBQUVqQzs7OztHQUlHO0FBQ0gsK0JBQWdDLFVBQXNCO0lBQ3BELE1BQU0sRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLEdBQUcsVUFBVSxDQUFBO0lBRXpDLGtEQUFrRDtJQUNsRCxNQUFNLG9CQUFvQixHQUFzRDtRQUM5RSw2REFBNkQ7UUFDN0QsR0FBRyxDQUNELFVBQVUsQ0FBQyxNQUFNLENBQUMsb0JBQW9CO2NBQ2xDLFVBQVUsQ0FBQyxNQUFNLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDO2NBQ2xELEVBQUUsQ0FDUDtRQUNELEdBQUcsQ0FDRCxPQUFPLENBQUMsdUJBQXVCO2NBQzNCLEVBQUU7O2dCQUVGLFlBQVk7Z0JBQ1osU0FBUztxQkFDTixjQUFjLEVBQUU7cUJBQ2hCLEdBQUcsQ0FBQyxVQUFVLElBQUksOENBQW9DLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO3FCQUMvRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQ3pDO0tBQ0YsQ0FBQTtJQUVELGdFQUFnRTtJQUNoRSxFQUFFLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO1FBQ3BDLE1BQU0sQ0FBQTtJQUVSLE1BQU0sQ0FBQyxJQUFJLDJCQUFpQixDQUFDO1FBQzNCLElBQUksRUFBRSxVQUFVO1FBQ2hCLFdBQVcsRUFBRSw0RUFBNEU7UUFDekYsTUFBTSxFQUFFLE1BQU0sbUJBQVcsQ0FBbUMsb0JBQW9CLENBQUM7S0FDbEYsQ0FBQyxDQUFBO0FBQ0osQ0FBQyJ9