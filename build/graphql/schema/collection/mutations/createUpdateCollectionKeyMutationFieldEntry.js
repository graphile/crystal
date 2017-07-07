"use strict";
var graphql_1 = require("graphql");
var utils_1 = require("../../../utils");
var createMutationGqlField_1 = require("../../createMutationGqlField");
var createCollectionKeyInputHelpers_1 = require("../createCollectionKeyInputHelpers");
var createUpdateCollectionMutationFieldEntry_1 = require("./createUpdateCollectionMutationFieldEntry");
/**
 * Creates a update mutation which will update a single value from a collection
 * using a given collection key.
 */
// TODO: test
function createUpdateCollectionKeyMutationFieldEntry(buildToken, collectionKey) {
    // If we can’t delete from the collection key, quit early.
    if (!collectionKey.update)
        return;
    var collection = collectionKey.collection;
    var name = "update-" + collection.type.name + "-by-" + collectionKey.name;
    var inputHelpers = createCollectionKeyInputHelpers_1.default(buildToken, collectionKey);
    var patchFieldName = utils_1.formatName.field(collection.type.name + "-patch");
    var _a = createUpdateCollectionMutationFieldEntry_1.getCollectionPatchType(buildToken, collection), patchGqlType = _a.gqlType, patchFromGqlInput = _a.fromGqlInput;
    return [utils_1.formatName.field(name), createMutationGqlField_1.default(buildToken, {
            name: name,
            description: "Updates a single `" + utils_1.formatName.type(collection.type.name) + "` using a unique key and a patch.",
            inputFields: inputHelpers.fieldEntries.concat([
                // Also include the patch object type. This is its own object type so
                // that people can just have a single patch object and not need to rename
                // keys. This also means users can freely upload entire objects to this
                // field.
                [patchFieldName, {
                        description: "An object where the defined keys will be set on the `" + utils_1.formatName.type(collection.type.name) + "` identified by our unique key.",
                        type: new graphql_1.GraphQLNonNull(patchGqlType),
                    }],
            ]),
            payloadType: createUpdateCollectionMutationFieldEntry_1.getUpdateCollectionPayloadGqlType(buildToken, collection),
            execute: function (context, input) {
                return collectionKey.update(context, inputHelpers.getKeyFromInput(input), patchFromGqlInput(input[patchFieldName]));
            },
        })];
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createUpdateCollectionKeyMutationFieldEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlVXBkYXRlQ29sbGVjdGlvbktleU11dGF0aW9uRmllbGRFbnRyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9ncmFwaHFsL3NjaGVtYS9jb2xsZWN0aW9uL211dGF0aW9ucy9jcmVhdGVVcGRhdGVDb2xsZWN0aW9uS2V5TXV0YXRpb25GaWVsZEVudHJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxtQ0FBNEQ7QUFFNUQsd0NBQTJDO0FBRTNDLHVFQUFpRTtBQUNqRSxzRkFBZ0Y7QUFDaEYsdUdBQXNIO0FBRXRIOzs7R0FHRztBQUNILGFBQWE7QUFDYixxREFDRSxVQUFzQixFQUN0QixhQUEwQztJQUUxQywwREFBMEQ7SUFDMUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDO1FBQ3hCLE1BQU0sQ0FBQTtJQUVBLElBQUEscUNBQVUsQ0FBa0I7SUFDcEMsSUFBTSxJQUFJLEdBQUcsWUFBVSxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksWUFBTyxhQUFhLENBQUMsSUFBTSxDQUFBO0lBQ3RFLElBQU0sWUFBWSxHQUFHLHlDQUErQixDQUFDLFVBQVUsRUFBRSxhQUFhLENBQUMsQ0FBQTtJQUMvRSxJQUFNLGNBQWMsR0FBRyxrQkFBVSxDQUFDLEtBQUssQ0FBSSxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksV0FBUSxDQUFDLENBQUE7SUFDbEUsSUFBQSw4RkFBMkcsRUFBekcseUJBQXFCLEVBQUUsbUNBQStCLENBQW1EO0lBRWpILE1BQU0sQ0FBQyxDQUFDLGtCQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLGdDQUFzQixDQUFTLFVBQVUsRUFBRTtZQUN6RSxJQUFJLE1BQUE7WUFDSixXQUFXLEVBQUUsdUJBQXNCLGtCQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHNDQUFvQztZQUM1RyxXQUFXLEVBR04sWUFBWSxDQUFDLFlBQVk7Z0JBQzVCLHFFQUFxRTtnQkFDckUseUVBQXlFO2dCQUN6RSx1RUFBdUU7Z0JBQ3ZFLFNBQVM7Z0JBQ1QsQ0FBQyxjQUFjLEVBQUU7d0JBQ2YsV0FBVyxFQUFFLDBEQUF5RCxrQkFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxvQ0FBa0M7d0JBQzdJLElBQUksRUFBRSxJQUFJLHdCQUFjLENBQUMsWUFBWSxDQUFDO3FCQUN2QyxDQUFDO2NBQ0g7WUFDRCxXQUFXLEVBQUUsNEVBQWlDLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQztZQUN0RSxPQUFPLEVBQUUsVUFBQyxPQUFPLEVBQUUsS0FBSztnQkFDdEIsT0FBQSxhQUFhLENBQUMsTUFBTyxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxFQUFFLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxjQUFjLENBQU8sQ0FBQyxDQUFDO1lBQW5ILENBQW1IO1NBQ3RILENBQUMsQ0FBQyxDQUFBO0FBQ0wsQ0FBQzs7QUFsQ0QsOERBa0NDIn0=