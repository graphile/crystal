"use strict";
var graphql_1 = require("graphql");
var utils_1 = require("../utils");
var createCollectionMutationFieldEntries_1 = require("./collection/createCollectionMutationFieldEntries");
/**
 * Gets the mutation type which includes all available mutations for our
 * schema. If there are no mutations, instead of throwing an error we will just
 * return `undefined`.
 */
var getMutationGqlType = utils_1.memoize1(createMutationGqlType);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getMutationGqlType;
/**
 * Internal create implementation for `getMutationType`.
 *
 * @private
 */
function createMutationGqlType(buildToken) {
    var inventory = buildToken.inventory, options = buildToken.options;
    // A list of all the mutations we are able to run.
    var mutationFieldEntries = (buildToken._hooks.mutationFieldEntries
        ? buildToken._hooks.mutationFieldEntries(buildToken)
        : []).concat((options.disableDefaultMutations
        ? []
        :
            // for them.
            inventory
                .getCollections()
                .map(function (collection) { return createCollectionMutationFieldEntries_1.default(buildToken, collection); })
                .reduce(function (a, b) { return a.concat(b); }, [])));
    // If there are no mutation fields, just return to avoid errors.
    if (mutationFieldEntries.length === 0)
        return;
    return new graphql_1.GraphQLObjectType({
        name: 'Mutation',
        description: 'The root mutation type which contains root level fields which mutate data.',
        fields: function () { return utils_1.buildObject(mutationFieldEntries); },
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0TXV0YXRpb25HcWxUeXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dyYXBocWwvc2NoZW1hL2dldE11dGF0aW9uR3FsVHlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsbUNBQStEO0FBQy9ELGtDQUFnRDtBQUVoRCwwR0FBb0c7QUFFcEc7Ozs7R0FJRztBQUNILElBQU0sa0JBQWtCLEdBQUcsZ0JBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBOztBQUUxRCxrQkFBZSxrQkFBa0IsQ0FBQTtBQUVqQzs7OztHQUlHO0FBQ0gsK0JBQWdDLFVBQXNCO0lBQzVDLElBQUEsZ0NBQVMsRUFBRSw0QkFBTyxDQUFlO0lBRXpDLGtEQUFrRDtJQUNsRCxJQUFNLG9CQUFvQixHQUVyQixDQUNELFVBQVUsQ0FBQyxNQUFNLENBQUMsb0JBQW9CO1VBQ2xDLFVBQVUsQ0FBQyxNQUFNLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDO1VBQ2xELEVBQUUsQ0FDUCxRQUNFLENBQ0QsT0FBTyxDQUFDLHVCQUF1QjtVQUMzQixFQUFFOztZQUVGLFlBQVk7WUFDWixTQUFTO2lCQUNOLGNBQWMsRUFBRTtpQkFDaEIsR0FBRyxDQUFDLFVBQUEsVUFBVSxJQUFJLE9BQUEsOENBQW9DLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxFQUE1RCxDQUE0RCxDQUFDO2lCQUMvRSxNQUFNLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBWCxDQUFXLEVBQUUsRUFBRSxDQUFDLENBQ3pDLENBQ0YsQ0FBQTtJQUVELGdFQUFnRTtJQUNoRSxFQUFFLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO1FBQ3BDLE1BQU0sQ0FBQTtJQUVSLE1BQU0sQ0FBQyxJQUFJLDJCQUFpQixDQUFDO1FBQzNCLElBQUksRUFBRSxVQUFVO1FBQ2hCLFdBQVcsRUFBRSw0RUFBNEU7UUFDekYsTUFBTSxFQUFFLGNBQU0sT0FBQSxtQkFBVyxDQUFtQyxvQkFBb0IsQ0FBQyxFQUFuRSxDQUFtRTtLQUNsRixDQUFDLENBQUE7QUFDSixDQUFDIn0=