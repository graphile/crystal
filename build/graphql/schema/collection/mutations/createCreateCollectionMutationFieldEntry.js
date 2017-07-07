"use strict";
var interface_1 = require("../../../../interface");
var utils_1 = require("../../../utils");
var getGqlInputType_1 = require("../../type/getGqlInputType");
var getGqlOutputType_1 = require("../../type/getGqlOutputType");
var createMutationGqlField_1 = require("../../createMutationGqlField");
var createConnectionGqlField_1 = require("../../connection/createConnectionGqlField");
var createCollectionRelationTailGqlFieldEntries_1 = require("../createCollectionRelationTailGqlFieldEntries");
/**
 * Creates the mutation field entry for creating values in a collection.
 * Returns undefined if you can’t create values in a given collection.
 */
function createCreateCollectionMutationFieldEntry(buildToken, collection) {
    // Return undefined if you can’t create values.
    if (!collection.create)
        return;
    var name = "create-" + collection.type.name;
    var inputFieldName = utils_1.formatName.field(collection.type.name);
    var _a = getGqlInputType_1.default(buildToken, collection.type), inputGqlType = _a.gqlType, inputFromGqlInput = _a.fromGqlInput;
    var collectionGqlType = getGqlOutputType_1.default(buildToken, new interface_1.NullableType(collection.type)).gqlType;
    return [utils_1.formatName.field(name), createMutationGqlField_1.default(buildToken, {
            name: name,
            description: "Creates a single " + utils_1.scrib.type(collectionGqlType) + ".",
            inputFields: [
                // The only input we need when creating a new object is the type in input
                // object form. We nest the input object instead of flattening its fields
                // so that you only need object per value you create.
                [inputFieldName, {
                        description: "The " + utils_1.scrib.type(collectionGqlType) + " to be created by this mutation.",
                        type: inputGqlType,
                    }],
            ],
            outputFields: [
                // The actual object that just got created. The user can then use
                // this as a starting point to query relations that were created
                // with this object.
                [utils_1.formatName.field(collection.type.name), {
                        description: "The " + utils_1.scrib.type(collectionGqlType) + " that was created by this mutation.",
                        type: collectionGqlType,
                        resolve: function (value) { return value; },
                    }],
                // An edge variant of the created value. Because we use cursor
                // based pagination, it is also helpful to get the cursor for the
                // value we just created (thus why this is in the form of an edge).
                // Also Relay 1 requires us to return the edge.
                //
                // We may deprecate this in the future if Relay 2 doesn’t need it.
                collection.paginator && [utils_1.formatName.field(collection.type.name + "-edge"), {
                        description: "An edge for our " + utils_1.scrib.type(collectionGqlType) + ". May be used by Relay 1.",
                        type: createConnectionGqlField_1.getEdgeGqlType(buildToken, collection.paginator),
                        args: { orderBy: createConnectionGqlField_1.createOrderByGqlArg(buildToken, collection.paginator) },
                        resolve: function (value, args) { return ({
                            paginator: collection.paginator,
                            ordering: args['orderBy'],
                            cursor: null,
                            value: value,
                        }); },
                    }]
            ].concat(createCollectionRelationTailGqlFieldEntries_1.default(buildToken, collection, { getCollectionValue: function (value) { return value; } })),
            // When we execute we just create a value in the collection after
            // transforming the correct input field.
            // TODO: test
            execute: function (context, input) {
                return collection.create(context, inputFromGqlInput(input[inputFieldName]));
            },
        })];
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createCreateCollectionMutationFieldEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlQ3JlYXRlQ29sbGVjdGlvbk11dGF0aW9uRmllbGRFbnRyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9ncmFwaHFsL3NjaGVtYS9jb2xsZWN0aW9uL211dGF0aW9ucy9jcmVhdGVDcmVhdGVDb2xsZWN0aW9uTXV0YXRpb25GaWVsZEVudHJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxtREFBZ0U7QUFDaEUsd0NBQWtEO0FBRWxELDhEQUF3RDtBQUN4RCxnRUFBMEQ7QUFDMUQsdUVBQWlFO0FBQ2pFLHNGQUErRjtBQUMvRiw4R0FBd0c7QUFFeEc7OztHQUdHO0FBQ0gsa0RBQ0UsVUFBc0IsRUFDdEIsVUFBOEI7SUFFOUIsK0NBQStDO0lBQy9DLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztRQUNyQixNQUFNLENBQUE7SUFFUixJQUFNLElBQUksR0FBRyxZQUFVLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBTSxDQUFBO0lBQzdDLElBQU0sY0FBYyxHQUFHLGtCQUFVLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDdkQsSUFBQSwyREFBeUcsRUFBdkcseUJBQXFCLEVBQUUsbUNBQStCLENBQWlEO0lBQ3ZHLElBQUEsaUhBQTBCLENBQW9FO0lBRXRHLE1BQU0sQ0FBQyxDQUFDLGtCQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLGdDQUFzQixDQUFTLFVBQVUsRUFBRTtZQUN6RSxJQUFJLE1BQUE7WUFDSixXQUFXLEVBQUUsc0JBQW9CLGFBQUssQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBRztZQUVqRSxXQUFXLEVBQUU7Z0JBQ1gseUVBQXlFO2dCQUN6RSx5RUFBeUU7Z0JBQ3pFLHFEQUFxRDtnQkFDckQsQ0FBQyxjQUFjLEVBQUU7d0JBQ2YsV0FBVyxFQUFFLFNBQU8sYUFBSyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxxQ0FBa0M7d0JBQ25GLElBQUksRUFBRSxZQUFZO3FCQUNuQixDQUFDO2FBQ0g7WUFFRCxZQUFZO2dCQUNWLGlFQUFpRTtnQkFDakUsZ0VBQWdFO2dCQUNoRSxvQkFBb0I7Z0JBQ3BCLENBQUMsa0JBQVUsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTt3QkFDdkMsV0FBVyxFQUFFLFNBQU8sYUFBSyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyx3Q0FBcUM7d0JBQ3RGLElBQUksRUFBRSxpQkFBaUI7d0JBQ3ZCLE9BQU8sRUFBRSxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUssRUFBTCxDQUFLO3FCQUN4QixDQUFDO2dCQUVGLDhEQUE4RDtnQkFDOUQsaUVBQWlFO2dCQUNqRSxtRUFBbUU7Z0JBQ25FLCtDQUErQztnQkFDL0MsRUFBRTtnQkFDRixrRUFBa0U7Z0JBQ2xFLFVBQVUsQ0FBQyxTQUFTLElBQUksQ0FBQyxrQkFBVSxDQUFDLEtBQUssQ0FBSSxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksVUFBTyxDQUFDLEVBQUU7d0JBQ3pFLFdBQVcsRUFBRSxxQkFBbUIsYUFBSyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyw4QkFBMkI7d0JBQ3hGLElBQUksRUFBRSx5Q0FBYyxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsU0FBUyxDQUFDO3dCQUN0RCxJQUFJLEVBQUUsRUFBRSxPQUFPLEVBQUUsOENBQW1CLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxTQUFTLENBQUMsRUFBRTt3QkFDeEUsT0FBTyxFQUFFLFVBQUMsS0FBSyxFQUFFLElBQUksSUFBSyxPQUFBLENBQUM7NEJBQ3pCLFNBQVMsRUFBRSxVQUFVLENBQUMsU0FBUzs0QkFDL0IsUUFBUSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7NEJBQ3pCLE1BQU0sRUFBRSxJQUFJOzRCQUNaLEtBQUssT0FBQTt5QkFDTixDQUFDLEVBTHdCLENBS3hCO3FCQUNILENBQUM7cUJBR0MscURBQTJDLENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxFQUFFLGtCQUFrQixFQUFFLFVBQUEsS0FBSyxJQUFJLE9BQUEsS0FBSyxFQUFMLENBQUssRUFBRSxDQUFDLENBQy9HO1lBRUQsaUVBQWlFO1lBQ2pFLHdDQUF3QztZQUN4QyxhQUFhO1lBQ2IsT0FBTyxFQUFFLFVBQUMsT0FBTyxFQUFFLEtBQUs7Z0JBQ3RCLE9BQUEsVUFBVSxDQUFDLE1BQU8sQ0FBQyxPQUFPLEVBQUUsaUJBQWlCLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7WUFBckUsQ0FBcUU7U0FDeEUsQ0FBQyxDQUFDLENBQUE7QUFDTCxDQUFDOztBQWpFRCwyREFpRUMifQ==