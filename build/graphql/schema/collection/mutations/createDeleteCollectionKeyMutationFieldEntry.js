"use strict";
var utils_1 = require("../../../utils");
var createMutationGqlField_1 = require("../../createMutationGqlField");
var createCollectionKeyInputHelpers_1 = require("../createCollectionKeyInputHelpers");
var createDeleteCollectionMutationFieldEntry_1 = require("./createDeleteCollectionMutationFieldEntry");
/**
 * Creates a delete mutation which will delete a single value from a collection
 * using a given collection key.
 */
// TODO: test
function createDeleteCollectionKeyMutationFieldEntry(buildToken, collectionKey) {
    // If we can’t delete from the collection key, quit early.
    if (!collectionKey.delete)
        return;
    var collection = collectionKey.collection;
    var name = "delete-" + collection.type.name + "-by-" + collectionKey.name;
    var inputHelpers = createCollectionKeyInputHelpers_1.default(buildToken, collectionKey);
    return [utils_1.formatName.field(name), createMutationGqlField_1.default(buildToken, {
            name: name,
            description: "Deletes a single `" + utils_1.formatName.type(collection.type.name) + "` using a unique key.",
            inputFields: inputHelpers.fieldEntries,
            payloadType: createDeleteCollectionMutationFieldEntry_1.getDeleteCollectionPayloadGqlType(buildToken, collection),
            execute: function (context, input) {
                return collectionKey.delete(context, inputHelpers.getKeyFromInput(input));
            },
        })];
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createDeleteCollectionKeyMutationFieldEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlRGVsZXRlQ29sbGVjdGlvbktleU11dGF0aW9uRmllbGRFbnRyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9ncmFwaHFsL3NjaGVtYS9jb2xsZWN0aW9uL211dGF0aW9ucy9jcmVhdGVEZWxldGVDb2xsZWN0aW9uS2V5TXV0YXRpb25GaWVsZEVudHJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFQSx3Q0FBMkM7QUFFM0MsdUVBQWlFO0FBQ2pFLHNGQUFnRjtBQUNoRix1R0FBOEY7QUFFOUY7OztHQUdHO0FBQ0gsYUFBYTtBQUNiLHFEQUNFLFVBQXNCLEVBQ3RCLGFBQTBDO0lBRTFDLDBEQUEwRDtJQUMxRCxFQUFFLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUM7UUFDeEIsTUFBTSxDQUFBO0lBRUEsSUFBQSxxQ0FBVSxDQUFrQjtJQUNwQyxJQUFNLElBQUksR0FBRyxZQUFVLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxZQUFPLGFBQWEsQ0FBQyxJQUFNLENBQUE7SUFDdEUsSUFBTSxZQUFZLEdBQUcseUNBQStCLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxDQUFBO0lBRS9FLE1BQU0sQ0FBQyxDQUFDLGtCQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLGdDQUFzQixDQUFTLFVBQVUsRUFBRTtZQUN6RSxJQUFJLE1BQUE7WUFDSixXQUFXLEVBQUUsdUJBQXNCLGtCQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLDBCQUF3QjtZQUNoRyxXQUFXLEVBQUUsWUFBWSxDQUFDLFlBQVk7WUFDdEMsV0FBVyxFQUFFLDRFQUFpQyxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUM7WUFDdEUsT0FBTyxFQUFFLFVBQUMsT0FBTyxFQUFFLEtBQUs7Z0JBQ3RCLE9BQUEsYUFBYSxDQUFDLE1BQU8sQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUFuRSxDQUFtRTtTQUN0RSxDQUFDLENBQUMsQ0FBQTtBQUNMLENBQUM7O0FBcEJELDhEQW9CQyJ9