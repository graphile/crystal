"use strict";
var graphql_1 = require("graphql");
var interface_1 = require("../../../../interface");
var utils_1 = require("../../../utils");
var createMutationGqlField_1 = require("../../createMutationGqlField");
var createMutationPayloadGqlType_1 = require("../../createMutationPayloadGqlType");
var getGqlOutputType_1 = require("../../type/getGqlOutputType");
var createCollectionRelationTailGqlFieldEntries_1 = require("../createCollectionRelationTailGqlFieldEntries");
/**
 * Creates a delete mutation that uses the primary key of a collection and an
 * object’s global GraphQL identifier to delete a value in the collection.
 */
// TODO: test
function createDeleteCollectionMutationFieldEntry(buildToken, collection) {
    var primaryKey = collection.primaryKey;
    // If there is no primary key, or the primary key has no delete method. End
    // early.
    if (!primaryKey || !primaryKey.delete)
        return;
    var options = buildToken.options, inventory = buildToken.inventory;
    var name = "delete-" + collection.type.name;
    var gqlType = getGqlOutputType_1.default(buildToken, collection.type).gqlType;
    return [utils_1.formatName.field(name), createMutationGqlField_1.default(buildToken, {
            name: name,
            description: "Deletes a single `" + utils_1.formatName.type(collection.type.name) + "` using its globally unique id.",
            relatedGqlType: gqlType,
            inputFields: [
                // The only input field we want is the globally unique id which
                // corresponds to the primary key of this collection.
                [options.nodeIdFieldName, {
                        description: "The globally unique `ID` which will identify a single `" + utils_1.formatName.type(collection.type.name) + "` to be deleted.",
                        type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID),
                    }],
            ],
            payloadType: exports.getDeleteCollectionPayloadGqlType(buildToken, collection),
            // Execute by deserializing the id into its component parts and delete a
            // value in the collection using that key.
            execute: function (context, input, resolveInfo) {
                var result = utils_1.idSerde.deserialize(inventory, input[options.nodeIdFieldName]);
                var gqlType = getGqlOutputType_1.default(buildToken, collection.type).gqlType;
                if (result.collection !== collection)
                    throw new Error("The provided id is for collection '" + result.collection.name + "', not the expected collection '" + collection.name + "'.");
                return primaryKey.delete(context, result.keyValue, resolveInfo, gqlType);
            },
        })];
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createDeleteCollectionMutationFieldEntry;
exports.getDeleteCollectionPayloadGqlType = utils_1.memoize2(createDeleteCollectionPayloadGqlType);
/**
 * Creates the output fields returned by the collection delete mutation.
 */
function createDeleteCollectionPayloadGqlType(buildToken, collection) {
    var primaryKey = collection.primaryKey;
    var _a = getGqlOutputType_1.default(buildToken, new interface_1.NullableType(collection.type)), gqlType = _a.gqlType, intoGqlOutput = _a.intoGqlOutput;
    return createMutationPayloadGqlType_1.default(buildToken, {
        name: "delete-" + collection.type.name,
        relatedGqlType: gqlType,
        outputFields: [
            // Add the deleted value as an output field so the user can see the
            // object they just deleted.
            [utils_1.formatName.field(collection.type.name), {
                    type: gqlType,
                    resolve: intoGqlOutput,
                }],
            // Add the deleted values globally unique id as well. This one is
            // especially useful for removing old nodes from the cache.
            primaryKey ? [utils_1.formatName.field("deleted-" + collection.type.name + "-id"), {
                    type: graphql_1.GraphQLID,
                    resolve: function (value) { return utils_1.idSerde.serialize(collection, value); },
                }] : null
        ].concat(createCollectionRelationTailGqlFieldEntries_1.default(buildToken, collection, { getCollectionValue: function (value) { return value; } })),
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlRGVsZXRlQ29sbGVjdGlvbk11dGF0aW9uRmllbGRFbnRyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9ncmFwaHFsL3NjaGVtYS9jb2xsZWN0aW9uL211dGF0aW9ucy9jcmVhdGVEZWxldGVDb2xsZWN0aW9uTXV0YXRpb25GaWVsZEVudHJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxtQ0FBMEY7QUFDMUYsbURBQWdFO0FBQ2hFLHdDQUE4RDtBQUU5RCx1RUFBaUU7QUFDakUsbUZBQTZFO0FBQzdFLGdFQUEwRDtBQUMxRCw4R0FBd0c7QUFHeEc7OztHQUdHO0FBQ0gsYUFBYTtBQUNiLGtEQUNFLFVBQXNCLEVBQ3RCLFVBQThCO0lBRXRCLElBQUEsa0NBQVUsQ0FBZTtJQUVqQywyRUFBMkU7SUFDM0UsU0FBUztJQUNULEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztRQUNwQyxNQUFNLENBQUE7SUFFQSxJQUFBLDRCQUFPLEVBQUUsZ0NBQVMsQ0FBZTtJQUN6QyxJQUFNLElBQUksR0FBRyxZQUFVLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBTSxDQUFBO0lBRXJDLElBQUEseUVBQU8sQ0FBa0Q7SUFFakUsTUFBTSxDQUFDLENBQUMsa0JBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsZ0NBQXNCLENBQVMsVUFBVSxFQUFFO1lBQ3pFLElBQUksTUFBQTtZQUNKLFdBQVcsRUFBRSx1QkFBc0Isa0JBQVUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsb0NBQWtDO1lBQzFHLGNBQWMsRUFBRSxPQUFPO1lBQ3ZCLFdBQVcsRUFBRTtnQkFDWCwrREFBK0Q7Z0JBQy9ELHFEQUFxRDtnQkFDckQsQ0FBQyxPQUFPLENBQUMsZUFBZSxFQUFFO3dCQUN4QixXQUFXLEVBQUUsNERBQTZELGtCQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHFCQUFtQjt3QkFDbEksSUFBSSxFQUFFLElBQUksd0JBQWMsQ0FBQyxtQkFBUyxDQUFDO3FCQUNwQyxDQUFDO2FBQ0g7WUFDRCxXQUFXLEVBQUUseUNBQWlDLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQztZQUN0RSx3RUFBd0U7WUFDeEUsMENBQTBDO1lBQzFDLE9BQU8sRUFBRSxVQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsV0FBVztnQkFDbkMsSUFBTSxNQUFNLEdBQUcsZUFBTyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQVcsQ0FBQyxDQUFBO2dCQUUvRSxJQUFBLHlFQUFPLENBQWtEO2dCQUVqRSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxLQUFLLFVBQVUsQ0FBQztvQkFDbkMsTUFBTSxJQUFJLEtBQUssQ0FBQyx3Q0FBc0MsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLHdDQUFtQyxVQUFVLENBQUMsSUFBSSxPQUFJLENBQUMsQ0FBQTtnQkFFckksTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFPLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUUsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFBO1lBQzNFLENBQUM7U0FDRixDQUFDLENBQUMsQ0FBQTtBQUNMLENBQUM7O0FBMUNELDJEQTBDQztBQUVZLFFBQUEsaUNBQWlDLEdBQUcsZ0JBQVEsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFBO0FBRS9GOztHQUVHO0FBQ0gsOENBQ0UsVUFBc0IsRUFDdEIsVUFBOEI7SUFFdEIsSUFBQSxrQ0FBVSxDQUFlO0lBQzNCLElBQUEsMEZBQTRGLEVBQTFGLG9CQUFPLEVBQUUsZ0NBQWEsQ0FBb0U7SUFDbEcsTUFBTSxDQUFDLHNDQUE0QixDQUFTLFVBQVUsRUFBRTtRQUN0RCxJQUFJLEVBQUUsWUFBVSxVQUFVLENBQUMsSUFBSSxDQUFDLElBQU07UUFDdEMsY0FBYyxFQUFFLE9BQU87UUFDdkIsWUFBWTtZQUNWLG1FQUFtRTtZQUNuRSw0QkFBNEI7WUFDNUIsQ0FBQyxrQkFBVSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUN2QyxJQUFJLEVBQUUsT0FBTztvQkFDYixPQUFPLEVBQUUsYUFBYTtpQkFDdkIsQ0FBQztZQUNGLGlFQUFpRTtZQUNqRSwyREFBMkQ7WUFDM0QsVUFBVSxHQUFHLENBQUMsa0JBQVUsQ0FBQyxLQUFLLENBQUMsYUFBVyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksUUFBSyxDQUFDLEVBQUU7b0JBQ3BFLElBQUksRUFBRSxtQkFBUztvQkFDZixPQUFPLEVBQUUsVUFBQSxLQUFLLElBQUksT0FBQSxlQUFPLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsRUFBcEMsQ0FBb0M7aUJBQ3ZELENBQUMsR0FBRyxJQUFJO2lCQUVOLHFEQUEyQyxDQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUUsRUFBRSxrQkFBa0IsRUFBRSxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUssRUFBTCxDQUFLLEVBQUUsQ0FBQyxDQUMvRztLQUNGLENBQUMsQ0FBQTtBQUNKLENBQUMifQ==