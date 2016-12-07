"use strict";
const graphql_1 = require('graphql');
const utils_1 = require('../../../utils');
const createMutationGqlField_1 = require('../../createMutationGqlField');
const transformGqlInputValue_1 = require('../../transformGqlInputValue');
const createCollectionKeyInputHelpers_1 = require('../createCollectionKeyInputHelpers');
const createUpdateCollectionMutationFieldEntry_1 = require('./createUpdateCollectionMutationFieldEntry');
/**
 * Creates a update mutation which will update a single value from a collection
 * using a given collection key.
 */
// TODO: test
function createUpdateCollectionKeyMutationFieldEntry(buildToken, collectionKey) {
    // If we can’t delete from the collection key, quit early.
    if (!collectionKey.update)
        return;
    const { collection } = collectionKey;
    const name = `update-${collection.type.name}-by-${collectionKey.name}`;
    const inputHelpers = createCollectionKeyInputHelpers_1.default(buildToken, collectionKey);
    const patchFieldName = utils_1.formatName.field(`${collection.type.name}-patch`);
    const patchGqlType = createUpdateCollectionMutationFieldEntry_1.getCollectionPatchType(buildToken, collection);
    return [utils_1.formatName.field(name), createMutationGqlField_1.default(buildToken, {
            name,
            description: `Updates a single \`${utils_1.formatName.type(collection.type.name)}\` using a unique key and a patch.`,
            inputFields: [
                // Include all of the fields we need to construct the key value we will
                // use to find the single value to update.
                ...inputHelpers.fieldEntries,
                // Also include the patch object type. This is its own object type so
                // that people can just have a single patch object and not need to rename
                // keys. This also means users can freely upload entire objects to this
                // field.
                [patchFieldName, {
                        description: `An object where the defined keys will be set on the \`${utils_1.formatName.type(collection.type.name)}\` identified by our unique key.`,
                        type: new graphql_1.GraphQLNonNull(patchGqlType),
                    }],
            ],
            payloadType: createUpdateCollectionMutationFieldEntry_1.getUpdateCollectionPayloadGqlType(buildToken, collection),
            execute: (context, input) => {
                // Get the patch from our input.
                const patch = transformGqlInputValue_1.default(patchGqlType, input[patchFieldName]);
                if (!(patch instanceof Map))
                    throw new Error('Patch is not of the correct type. Expected a `Map`.');
                return collectionKey.update(context, inputHelpers.getKey(input), patch);
            },
        })];
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createUpdateCollectionKeyMutationFieldEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlVXBkYXRlQ29sbGVjdGlvbktleU11dGF0aW9uRmllbGRFbnRyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9ncmFwaHFsL3NjaGVtYS9jb2xsZWN0aW9uL211dGF0aW9ucy9jcmVhdGVVcGRhdGVDb2xsZWN0aW9uS2V5TXV0YXRpb25GaWVsZEVudHJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwwQkFBbUQsU0FDbkQsQ0FBQyxDQUQyRDtBQUU1RCx3QkFBMkIsZ0JBQzNCLENBQUMsQ0FEMEM7QUFFM0MseUNBQW1DLDhCQUNuQyxDQUFDLENBRGdFO0FBQ2pFLHlDQUFtQyw4QkFDbkMsQ0FBQyxDQURnRTtBQUNqRSxrREFBNEMsb0NBQzVDLENBQUMsQ0FEK0U7QUFDaEYsMkRBQTBFLDRDQU8xRSxDQUFDLENBUHFIO0FBRXRIOzs7R0FHRztBQUNILGFBQWE7QUFDYixxREFDRSxVQUFzQixFQUN0QixhQUFrQztJQUVsQywwREFBMEQ7SUFDMUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDO1FBQ3hCLE1BQU0sQ0FBQTtJQUVSLE1BQU0sRUFBRSxVQUFVLEVBQUUsR0FBRyxhQUFhLENBQUE7SUFDcEMsTUFBTSxJQUFJLEdBQUcsVUFBVSxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksT0FBTyxhQUFhLENBQUMsSUFBSSxFQUFFLENBQUE7SUFDdEUsTUFBTSxZQUFZLEdBQUcseUNBQStCLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxDQUFBO0lBQy9FLE1BQU0sY0FBYyxHQUFHLGtCQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLFFBQVEsQ0FBQyxDQUFBO0lBQ3hFLE1BQU0sWUFBWSxHQUFHLGlFQUFzQixDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQTtJQUVuRSxNQUFNLENBQUMsQ0FBQyxrQkFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxnQ0FBc0IsQ0FBbUIsVUFBVSxFQUFFO1lBQ25GLElBQUk7WUFDSixXQUFXLEVBQUUsc0JBQXNCLGtCQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLG9DQUFvQztZQUM1RyxXQUFXLEVBQUU7Z0JBQ1gsdUVBQXVFO2dCQUN2RSwwQ0FBMEM7Z0JBQzFDLEdBQUcsWUFBWSxDQUFDLFlBQVk7Z0JBQzVCLHFFQUFxRTtnQkFDckUseUVBQXlFO2dCQUN6RSx1RUFBdUU7Z0JBQ3ZFLFNBQVM7Z0JBQ1QsQ0FBQyxjQUFjLEVBQUU7d0JBQ2YsV0FBVyxFQUFFLHlEQUF5RCxrQkFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxrQ0FBa0M7d0JBQzdJLElBQUksRUFBRSxJQUFJLHdCQUFjLENBQUMsWUFBWSxDQUFDO3FCQUN2QyxDQUFDO2FBQ0g7WUFDRCxXQUFXLEVBQUUsNEVBQWlDLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQztZQUN0RSxPQUFPLEVBQUUsQ0FBQyxPQUFPLEVBQUUsS0FBSztnQkFDdEIsZ0NBQWdDO2dCQUNoQyxNQUFNLEtBQUssR0FBRyxnQ0FBc0IsQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUE7Z0JBRXpFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLFlBQVksR0FBRyxDQUFDLENBQUM7b0JBQzFCLE1BQU0sSUFBSSxLQUFLLENBQUMscURBQXFELENBQUMsQ0FBQTtnQkFFeEUsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFPLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUE7WUFDMUUsQ0FBQztTQUNGLENBQUMsQ0FBQyxDQUFBO0FBQ0wsQ0FBQztBQXpDRDs2REF5Q0MsQ0FBQSJ9