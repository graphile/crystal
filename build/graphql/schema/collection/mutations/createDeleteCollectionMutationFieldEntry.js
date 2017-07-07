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
    return [utils_1.formatName.field(name), createMutationGqlField_1.default(buildToken, {
            name: name,
            description: "Deletes a single `" + utils_1.formatName.type(collection.type.name) + "` using its globally unique id.",
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
            execute: function (context, input) {
                var result = utils_1.idSerde.deserialize(inventory, input[options.nodeIdFieldName]);
                if (result.collection !== collection)
                    throw new Error("The provided id is for collection '" + result.collection.name + "', not the expected collection '" + collection.name + "'.");
                return primaryKey.delete(context, result.keyValue);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlRGVsZXRlQ29sbGVjdGlvbk11dGF0aW9uRmllbGRFbnRyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9ncmFwaHFsL3NjaGVtYS9jb2xsZWN0aW9uL211dGF0aW9ucy9jcmVhdGVEZWxldGVDb2xsZWN0aW9uTXV0YXRpb25GaWVsZEVudHJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxtQ0FBMEY7QUFDMUYsbURBQWdFO0FBQ2hFLHdDQUE4RDtBQUU5RCx1RUFBaUU7QUFDakUsbUZBQTZFO0FBQzdFLGdFQUEwRDtBQUMxRCw4R0FBd0c7QUFFeEc7OztHQUdHO0FBQ0gsYUFBYTtBQUNiLGtEQUNFLFVBQXNCLEVBQ3RCLFVBQThCO0lBRXRCLElBQUEsa0NBQVUsQ0FBZTtJQUVqQywyRUFBMkU7SUFDM0UsU0FBUztJQUNULEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztRQUNwQyxNQUFNLENBQUE7SUFFQSxJQUFBLDRCQUFPLEVBQUUsZ0NBQVMsQ0FBZTtJQUN6QyxJQUFNLElBQUksR0FBRyxZQUFVLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBTSxDQUFBO0lBRTdDLE1BQU0sQ0FBQyxDQUFDLGtCQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLGdDQUFzQixDQUFTLFVBQVUsRUFBRTtZQUN6RSxJQUFJLE1BQUE7WUFDSixXQUFXLEVBQUUsdUJBQXNCLGtCQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLG9DQUFrQztZQUMxRyxXQUFXLEVBQUU7Z0JBQ1gsK0RBQStEO2dCQUMvRCxxREFBcUQ7Z0JBQ3JELENBQUMsT0FBTyxDQUFDLGVBQWUsRUFBRTt3QkFDeEIsV0FBVyxFQUFFLDREQUE2RCxrQkFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxxQkFBbUI7d0JBQ2xJLElBQUksRUFBRSxJQUFJLHdCQUFjLENBQUMsbUJBQVMsQ0FBQztxQkFDcEMsQ0FBQzthQUNIO1lBQ0QsV0FBVyxFQUFFLHlDQUFpQyxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUM7WUFDdEUsd0VBQXdFO1lBQ3hFLDBDQUEwQztZQUMxQyxPQUFPLEVBQUUsVUFBQyxPQUFPLEVBQUUsS0FBSztnQkFDdEIsSUFBTSxNQUFNLEdBQUcsZUFBTyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQVcsQ0FBQyxDQUFBO2dCQUV2RixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxLQUFLLFVBQVUsQ0FBQztvQkFDbkMsTUFBTSxJQUFJLEtBQUssQ0FBQyx3Q0FBc0MsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLHdDQUFtQyxVQUFVLENBQUMsSUFBSSxPQUFJLENBQUMsQ0FBQTtnQkFFckksTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFPLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUNyRCxDQUFDO1NBQ0YsQ0FBQyxDQUFDLENBQUE7QUFDTCxDQUFDOztBQXJDRCwyREFxQ0M7QUFFWSxRQUFBLGlDQUFpQyxHQUFHLGdCQUFRLENBQUMsb0NBQW9DLENBQUMsQ0FBQTtBQUUvRjs7R0FFRztBQUNILDhDQUNFLFVBQXNCLEVBQ3RCLFVBQThCO0lBRXRCLElBQUEsa0NBQVUsQ0FBZTtJQUMzQixJQUFBLDBGQUE0RixFQUExRixvQkFBTyxFQUFFLGdDQUFhLENBQW9FO0lBQ2xHLE1BQU0sQ0FBQyxzQ0FBNEIsQ0FBUyxVQUFVLEVBQUU7UUFDdEQsSUFBSSxFQUFFLFlBQVUsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFNO1FBQ3RDLFlBQVk7WUFDVixtRUFBbUU7WUFDbkUsNEJBQTRCO1lBQzVCLENBQUMsa0JBQVUsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtvQkFDdkMsSUFBSSxFQUFFLE9BQU87b0JBQ2IsT0FBTyxFQUFFLGFBQWE7aUJBQ3ZCLENBQUM7WUFDRixpRUFBaUU7WUFDakUsMkRBQTJEO1lBQzNELFVBQVUsR0FBRyxDQUFDLGtCQUFVLENBQUMsS0FBSyxDQUFDLGFBQVcsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLFFBQUssQ0FBQyxFQUFFO29CQUNwRSxJQUFJLEVBQUUsbUJBQVM7b0JBQ2YsT0FBTyxFQUFFLFVBQUEsS0FBSyxJQUFJLE9BQUEsZUFBTyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLEVBQXBDLENBQW9DO2lCQUN2RCxDQUFDLEdBQUcsSUFBSTtpQkFFTixxREFBMkMsQ0FBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLEVBQUUsa0JBQWtCLEVBQUUsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFLLEVBQUwsQ0FBSyxFQUFFLENBQUMsQ0FDL0c7S0FDRixDQUFDLENBQUE7QUFDSixDQUFDIn0=