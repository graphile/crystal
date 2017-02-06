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
    var gqlType = getGqlOutputType_1.default(buildToken, collection.type).gqlType;
    return [utils_1.formatName.field(name), createMutationGqlField_1.default(buildToken, {
            name: name,
            description: "Updates a single `" + utils_1.formatName.type(collection.type.name) + "` using its globally unique id and a patch.",
            relatedGqlType: gqlType,
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
            execute: function (context, input, resolveInfo) {
                var result = utils_1.idSerde.deserialize(inventory, input[options.nodeIdFieldName]);
                var gqlType = getGqlOutputType_1.default(buildToken, collection.type).gqlType;
                if (result.collection !== collection)
                    throw new Error("The provided id is for collection '" + result.collection.name + "', not the expected collection '" + collection.name + "'.");
                return primaryKey.update(context, result.keyValue, patchFromGqlInput(input[patchFieldName]), resolveInfo, gqlType);
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
        relatedGqlType: gqlType,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlVXBkYXRlQ29sbGVjdGlvbk11dGF0aW9uRmllbGRFbnRyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9ncmFwaHFsL3NjaGVtYS9jb2xsZWN0aW9uL211dGF0aW9ucy9jcmVhdGVVcGRhdGVDb2xsZWN0aW9uTXV0YXRpb25GaWVsZEVudHJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxtQ0FPZ0I7QUFDaEIsbURBQWdFO0FBQ2hFLHdDQUEyRTtBQUUzRSw4REFBd0Q7QUFDeEQsZ0VBQTBEO0FBQzFELHVFQUFpRTtBQUNqRSxtRkFBNkU7QUFDN0UsOEdBQXdHO0FBRXhHOzs7R0FHRztBQUNILGFBQWE7QUFDYixrREFDRSxVQUFzQixFQUN0QixVQUE4QjtJQUV0QixJQUFBLGtDQUFVLENBQWU7SUFFakMsMkVBQTJFO0lBQzNFLFNBQVM7SUFDVCxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7UUFDcEMsTUFBTSxDQUFBO0lBRUEsSUFBQSw0QkFBTyxFQUFFLGdDQUFTLENBQWU7SUFDekMsSUFBTSxJQUFJLEdBQUcsWUFBVSxVQUFVLENBQUMsSUFBSSxDQUFDLElBQU0sQ0FBQTtJQUM3QyxJQUFNLGNBQWMsR0FBRyxrQkFBVSxDQUFDLEtBQUssQ0FBSSxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksV0FBUSxDQUFDLENBQUE7SUFDbEUsSUFBQSwyREFBMkcsRUFBekcseUJBQXFCLEVBQUUsbUNBQStCLENBQW1EO0lBQ3pHLElBQUEseUVBQU8sQ0FBa0Q7SUFFakUsTUFBTSxDQUFDLENBQUMsa0JBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsZ0NBQXNCLENBQVMsVUFBVSxFQUFFO1lBQ3pFLElBQUksTUFBQTtZQUNKLFdBQVcsRUFBRSx1QkFBc0Isa0JBQVUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJ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