"use strict";
var graphql_1 = require("graphql");
var utils_1 = require("../../../utils");
var createMutationGqlField_1 = require("../../createMutationGqlField");
var createCollectionKeyInputHelpers_1 = require("../createCollectionKeyInputHelpers");
var createUpdateCollectionMutationFieldEntry_1 = require("./createUpdateCollectionMutationFieldEntry");
var getGqlOutputType_1 = require("../../type/getGqlOutputType");
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
    var gqlType = getGqlOutputType_1.default(buildToken, collection.type).gqlType;
    return [utils_1.formatName.field(name), createMutationGqlField_1.default(buildToken, {
            name: name,
            description: "Updates a single `" + utils_1.formatName.type(collection.type.name) + "` using a unique key and a patch.",
            relatedGqlType: gqlType,
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
            execute: function (context, input, resolveInfo) {
                return collectionKey.update(context, inputHelpers.getKeyFromInput(input), patchFromGqlInput(input[patchFieldName]), resolveInfo, gqlType);
            },
        })];
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createUpdateCollectionKeyMutationFieldEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlVXBkYXRlQ29sbGVjdGlvbktleU11dGF0aW9uRmllbGRFbnRyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9ncmFwaHFsL3NjaGVtYS9jb2xsZWN0aW9uL211dGF0aW9ucy9jcmVhdGVVcGRhdGVDb2xsZWN0aW9uS2V5TXV0YXRpb25GaWVsZEVudHJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxtQ0FBNEQ7QUFFNUQsd0NBQTJDO0FBRTNDLHVFQUFpRTtBQUNqRSxzRkFBZ0Y7QUFDaEYsdUdBQXNIO0FBQ3RILGdFQUEwRDtBQUUxRDs7O0dBR0c7QUFDSCxhQUFhO0FBQ2IscURBQ0UsVUFBc0IsRUFDdEIsYUFBMEM7SUFFMUMsMERBQTBEO0lBQzFELEVBQUUsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQztRQUN4QixNQUFNLENBQUE7SUFFQSxJQUFBLHFDQUFVLENBQWtCO0lBQ3BDLElBQU0sSUFBSSxHQUFHLFlBQVUsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLFlBQU8sYUFBYSxDQUFDLElBQU0sQ0FBQTtJQUN0RSxJQUFNLFlBQVksR0FBRyx5Q0FBK0IsQ0FBQyxVQUFVLEVBQUUsYUFBYSxDQUFDLENBQUE7SUFDL0UsSUFBTSxjQUFjLEdBQUcsa0JBQVUsQ0FBQyxLQUFLLENBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLFdBQVEsQ0FBQyxDQUFBO0lBQ2xFLElBQUEsOEZBQTJHLEVBQXpHLHlCQUFxQixFQUFFLG1DQUErQixDQUFtRDtJQUN6RyxJQUFBLHlFQUFPLENBQWtEO0lBRWpFLE1BQU0sQ0FBQyxDQUFDLGtCQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLGdDQUFzQixDQUFTLFVBQVUsRUFBRTtZQUN6RSxJQUFJLE1BQUE7WUFDSixXQUFXLEVBQUUsdUJBQXNCLGtCQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHNDQUFvQztZQUM1RyxjQUFjLEVBQUUsT0FBTztZQUN2QixXQUFXLEVBR04sWUFBWSxDQUFDLFlBQVk7Z0JBQzVCLHFFQUFxRTtnQkFDckUseUVBQXlFO2dCQUN6RSx1RUFBdUU7Z0JBQ3ZFLFNBQVM7Z0JBQ1QsQ0FBQyxjQUFjLEVBQUU7d0JBQ2YsV0FBVyxFQUFFLDBEQUF5RCxrQkFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxvQ0FBa0M7d0JBQzdJLElBQUksRUFBRSxJQUFJLHdCQUFjLENBQUMsWUFBWSxDQUFDO3FCQUN2QyxDQUFDO2NBQ0g7WUFDRCxXQUFXLEVBQUUsNEVBQWlDLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQztZQUN0RSxPQUFPLEVBQUUsVUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLFdBQVc7Z0JBQ25DLE9BQUEsYUFBYSxDQUFDLE1BQU8sQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsRUFBRSxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFPLENBQUMsRUFBRSxXQUFXLEVBQUUsT0FBTyxDQUFDO1lBQXpJLENBQXlJO1NBQzVJLENBQUMsQ0FBQyxDQUFBO0FBQ0wsQ0FBQzs7QUFwQ0QsOERBb0NDIn0=