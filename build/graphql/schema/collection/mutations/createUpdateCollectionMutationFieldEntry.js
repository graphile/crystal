"use strict";
var graphql_1 = require("graphql");
var interface_1 = require("../../../../interface");
var utils_1 = require("../../../utils");
var getGqlInputType_1 = require("../../type/getGqlInputType");
var getGqlOutputType_1 = require("../../type/getGqlOutputType");
var createMutationGqlField_1 = require("../../createMutationGqlField");
var createMutationPayloadGqlType_1 = require("../../createMutationPayloadGqlType");
var createCollectionRelationTailGqlFieldEntries_1 = require("../createCollectionRelationTailGqlFieldEntries");
/**
 * Creates a update mutation that uses the primary key of a collection and an
 * object’s global GraphQL identifier to update a value in the collection.
 */
// TODO: test
function createUpdateCollectionMutationFieldEntry(buildToken, collection) {
    var primaryKey = collection.primaryKey;
    // If there is no primary key, or the primary key has no update method. End
    // early.
    if (!primaryKey || !primaryKey.update)
        return;
    var options = buildToken.options, inventory = buildToken.inventory;
    var name = "update-" + collection.type.name;
    var patchFieldName = utils_1.formatName.field(collection.type.name + "-patch");
    var _a = exports.getCollectionPatchType(buildToken, collection), patchGqlType = _a.gqlType, patchFromGqlInput = _a.fromGqlInput;
    return [utils_1.formatName.field(name), createMutationGqlField_1.default(buildToken, {
            name: name,
            description: "Updates a single `" + utils_1.formatName.type(collection.type.name) + "` using its globally unique id and a patch.",
            inputFields: [
                // The only input field we want is the globally unique id which
                // corresponds to the primary key of this collection.
                [options.nodeIdFieldName, {
                        description: "The globally unique `ID` which will identify a single `" + utils_1.formatName.type(collection.type.name) + "` to be updated.",
                        type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID),
                    }],
                // Also include the patch object type. This is its own object type so
                // that people can just have a single patch object and not need to rename
                // keys. This also means users can freely upload entire objects to this
                // field.
                [patchFieldName, {
                        description: "An object where the defined keys will be set on the `" + utils_1.formatName.type(collection.type.name) + "` identified by our globally unique `ID`.",
                        type: new graphql_1.GraphQLNonNull(patchGqlType),
                    }],
            ],
            payloadType: exports.getUpdateCollectionPayloadGqlType(buildToken, collection),
            // Execute by deserializing the id into its component parts and update a
            // value in the collection using that key.
            execute: function (context, input) {
                var result = utils_1.idSerde.deserialize(inventory, input[options.nodeIdFieldName]);
                if (result.collection !== collection)
                    throw new Error("The provided id is for collection '" + result.collection.name + "', not the expected collection '" + collection.name + "'.");
                return primaryKey.update(context, result.keyValue, patchFromGqlInput(input[patchFieldName]));
            },
        })];
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createUpdateCollectionMutationFieldEntry;
/**
 * Gets the patch type for a collection. The patch type allows us to define
 * fine-grained changes to our object and is very similar to the input object
 * type.
 */
exports.getCollectionPatchType = utils_1.memoize2(createCollectionPatchType);
/**
 * The internal un-memoized implementation of `getCollectionPatchType`.
 *
 * @private
 */
function createCollectionPatchType(buildToken, collection) {
    var type = collection.type;
    var fields = Array.from(type.fields).map(function (_a) {
        var fieldName = _a[0], field = _a[1];
        var _b = getGqlInputType_1.default(buildToken, new interface_1.NullableType(field.type)), gqlType = _b.gqlType, fromGqlInput = _b.fromGqlInput;
        return {
            key: utils_1.formatName.field(fieldName),
            value: {
                description: field.description,
                type: gqlType,
                internalName: fieldName,
                fromGqlInput: fromGqlInput,
            },
        };
    });
    return {
        gqlType: new graphql_1.GraphQLInputObjectType({
            name: utils_1.formatName.type(type.name + "-patch"),
            description: "Represents an update to a `" + utils_1.formatName.type(type.name) + "`. Fields that are set will be updated.",
            fields: function () { return utils_1.buildObject(fields); },
        }),
        fromGqlInput: function (input) {
            var patch = new Map();
            fields.forEach(function (_a) {
                var fieldName = _a.key, _b = _a.value, internalName = _b.internalName, fromGqlInput = _b.fromGqlInput;
                var fieldValue = input[fieldName];
                if (typeof fieldValue !== 'undefined') {
                    patch.set(internalName, fromGqlInput(fieldValue));
                }
            });
            return patch;
        },
    };
}
/**
 * The output object type for collection update mutations.
 */
exports.getUpdateCollectionPayloadGqlType = utils_1.memoize2(createUpdateCollectionPayloadGqlType);
/**
 * Creates the output fields returned by the collection update mutation.
 *
 * @private
 */
function createUpdateCollectionPayloadGqlType(buildToken, collection) {
    var _a = getGqlOutputType_1.default(buildToken, new interface_1.NullableType(collection.type)), gqlType = _a.gqlType, intoGqlOutput = _a.intoGqlOutput;
    return createMutationPayloadGqlType_1.default(buildToken, {
        name: "update-" + collection.type.name,
        outputFields: [
            // Add the updated value as an output field so the user can see the
            // object they just updated.
            [utils_1.formatName.field(collection.type.name), {
                    type: gqlType,
                    resolve: intoGqlOutput,
                }]
        ].concat(createCollectionRelationTailGqlFieldEntries_1.default(buildToken, collection, { getCollectionValue: function (value) { return value; } })),
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlVXBkYXRlQ29sbGVjdGlvbk11dGF0aW9uRmllbGRFbnRyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9ncmFwaHFsL3NjaGVtYS9jb2xsZWN0aW9uL211dGF0aW9ucy9jcmVhdGVVcGRhdGVDb2xsZWN0aW9uTXV0YXRpb25GaWVsZEVudHJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxtQ0FPZ0I7QUFDaEIsbURBQWdFO0FBQ2hFLHdDQUEyRTtBQUUzRSw4REFBd0Q7QUFDeEQsZ0VBQTBEO0FBQzFELHVFQUFpRTtBQUNqRSxtRkFBNkU7QUFDN0UsOEdBQXdHO0FBRXhHOzs7R0FHRztBQUNILGFBQWE7QUFDYixrREFDRSxVQUFzQixFQUN0QixVQUE4QjtJQUV0QixJQUFBLGtDQUFVLENBQWU7SUFFakMsMkVBQTJFO0lBQzNFLFNBQVM7SUFDVCxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7UUFDcEMsTUFBTSxDQUFBO0lBRUEsSUFBQSw0QkFBTyxFQUFFLGdDQUFTLENBQWU7SUFDekMsSUFBTSxJQUFJLEdBQUcsWUFBVSxVQUFVLENBQUMsSUFBSSxDQUFDLElBQU0sQ0FBQTtJQUM3QyxJQUFNLGNBQWMsR0FBRyxrQkFBVSxDQUFDLEtBQUssQ0FBSSxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksV0FBUSxDQUFDLENBQUE7SUFDbEUsSUFBQSwyREFBMkcsRUFBekcseUJBQXFCLEVBQUUsbUNBQStCLENBQW1EO0lBRWpILE1BQU0sQ0FBQyxDQUFDLGtCQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLGdDQUFzQixDQUFTLFVBQVUsRUFBRTtZQUN6RSxJQUFJLE1BQUE7WUFDSixXQUFXLEVBQUUsdUJBQXNCLGtCQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGdEQUE4QztZQUN0SCxXQUFX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