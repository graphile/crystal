"use strict";
const utils_1 = require('../../../utils');
const createMutationGqlField_1 = require('../../createMutationGqlField');
const createCollectionKeyInputHelpers_1 = require('../createCollectionKeyInputHelpers');
const createDeleteCollectionMutationFieldEntry_1 = require('./createDeleteCollectionMutationFieldEntry');
/**
 * Creates a delete mutation which will delete a single value from a collection
 * using a given collection key.
 */
// TODO: test
function createDeleteCollectionKeyMutationFieldEntry(buildToken, collectionKey) {
    // If we can’t delete from the collection key, quit early.
    if (!collectionKey.delete)
        return;
    const { collection } = collectionKey;
    const name = `delete-${collection.type.name}-by-${collectionKey.name}`;
    const inputHelpers = createCollectionKeyInputHelpers_1.default(buildToken, collectionKey);
    return [utils_1.formatName.field(name), createMutationGqlField_1.default(buildToken, {
            name,
            description: `Deletes a single \`${utils_1.formatName.type(collection.type.name)}\` using a unique key.`,
            inputFields: inputHelpers.fieldEntries,
            payloadType: createDeleteCollectionMutationFieldEntry_1.getDeleteCollectionPayloadGqlType(buildToken, collection),
            execute: (context, input) => collectionKey.delete(context, inputHelpers.getKey(input)),
        })];
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createDeleteCollectionKeyMutationFieldEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlRGVsZXRlQ29sbGVjdGlvbktleU11dGF0aW9uRmllbGRFbnRyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9ncmFwaHFsL3NjaGVtYS9jb2xsZWN0aW9uL211dGF0aW9ucy9jcmVhdGVEZWxldGVDb2xsZWN0aW9uS2V5TXV0YXRpb25GaWVsZEVudHJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFQSx3QkFBMkIsZ0JBQzNCLENBQUMsQ0FEMEM7QUFFM0MseUNBQW1DLDhCQUNuQyxDQUFDLENBRGdFO0FBQ2pFLGtEQUE0QyxvQ0FDNUMsQ0FBQyxDQUQrRTtBQUNoRiwyREFBa0QsNENBT2xELENBQUMsQ0FQNkY7QUFFOUY7OztHQUdHO0FBQ0gsYUFBYTtBQUNiLHFEQUNFLFVBQXNCLEVBQ3RCLGFBQWtDO0lBRWxDLDBEQUEwRDtJQUMxRCxFQUFFLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUM7UUFDeEIsTUFBTSxDQUFBO0lBRVIsTUFBTSxFQUFFLFVBQVUsRUFBRSxHQUFHLGFBQWEsQ0FBQTtJQUNwQyxNQUFNLElBQUksR0FBRyxVQUFVLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxPQUFPLGFBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtJQUN0RSxNQUFNLFlBQVksR0FBRyx5Q0FBK0IsQ0FBQyxVQUFVLEVBQUUsYUFBYSxDQUFDLENBQUE7SUFFL0UsTUFBTSxDQUFDLENBQUMsa0JBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsZ0NBQXNCLENBQW1CLFVBQVUsRUFBRTtZQUNuRixJQUFJO1lBQ0osV0FBVyxFQUFFLHNCQUFzQixrQkFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyx3QkFBd0I7WUFDaEcsV0FBVyxFQUFFLFlBQVksQ0FBQyxZQUFZO1lBQ3RDLFdBQVcsRUFBRSw0RUFBaUMsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDO1lBQ3RFLE9BQU8sRUFBRSxDQUFDLE9BQU8sRUFBRSxLQUFLLEtBQ3RCLGFBQWEsQ0FBQyxNQUFPLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDN0QsQ0FBQyxDQUFDLENBQUE7QUFDTCxDQUFDO0FBcEJEOzZEQW9CQyxDQUFBIn0=