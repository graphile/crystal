"use strict";
const graphql_1 = require('graphql');
const utils_1 = require('../../../utils');
const getGqlType_1 = require('../../getGqlType');
const createMutationGqlField_1 = require('../../createMutationGqlField');
const createMutationPayloadGqlType_1 = require('../../createMutationPayloadGqlType');
const transformGqlInputValue_1 = require('../../transformGqlInputValue');
const getCollectionGqlType_1 = require('../getCollectionGqlType');
const createCollectionRelationTailGqlFieldEntries_1 = require('../createCollectionRelationTailGqlFieldEntries');
/**
 * Creates a update mutation that uses the primary key of a collection and an
 * object’s global GraphQL identifier to update a value in the collection.
 */
// TODO: test
function createUpdateCollectionMutationFieldEntry(buildToken, collection) {
    const { primaryKey } = collection;
    // If there is no primary key, or the primary key has no update method. End
    // early.
    if (!primaryKey || !primaryKey.update)
        return;
    const { options, inventory } = buildToken;
    const name = `update-${collection.type.name}`;
    const patchFieldName = utils_1.formatName.field(`${collection.type.name}-patch`);
    const patchType = exports.getCollectionPatchType(buildToken, collection);
    return [utils_1.formatName.field(name), createMutationGqlField_1.default(buildToken, {
            name,
            description: `Updates a single \`${utils_1.formatName.type(collection.type.name)}\` using its globally unique id and a patch.`,
            inputFields: [
                // The only input field we want is the globally unique id which
                // corresponds to the primary key of this collection.
                [options.nodeIdFieldName, {
                        description: `The globally unique \`ID\` which will identify a single \`${utils_1.formatName.type(collection.type.name)}\` to be updated.`,
                        type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID),
                    }],
                // Also include the patch object type. This is its own object type so
                // that people can just have a single patch object and not need to rename
                // keys. This also means users can freely upload entire objects to this
                // field.
                [patchFieldName, {
                        description: `An object where the defined keys will be set on the \`${utils_1.formatName.type(collection.type.name)}\` identified by our globally unique \`ID\`.`,
                        type: new graphql_1.GraphQLNonNull(patchType),
                    }],
            ],
            payloadType: exports.getUpdateCollectionPayloadGqlType(buildToken, collection),
            // Execute by deserializing the id into its component parts and update a
            // value in the collection using that key.
            execute: (context, input) => {
                const result = utils_1.idSerde.deserialize(inventory, input[options.nodeIdFieldName]);
                if (result.collection !== collection)
                    throw new Error(`The provided id is for collection '${result.collection.name}', not the expected collection '${collection.name}'.`);
                // Get the patch from our input.
                const patch = transformGqlInputValue_1.default(patchType, input[patchFieldName]);
                if (!(patch instanceof Map))
                    throw new Error('Patch is not of the correct type. Expected a `Map`.');
                return primaryKey.update(context, result.keyValue, patch);
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
    const { type } = collection;
    return new graphql_1.GraphQLInputObjectType({
        name: utils_1.formatName.type(`${type.name}-patch`),
        description: `Represents an update to a \`${utils_1.formatName.type(type.name)}\`. Fields that are set will be updated.`,
        fields: () => utils_1.buildObject(Array.from(type.fields).map(([fieldName, field]) => [utils_1.formatName.field(fieldName), {
                description: field.description,
                type: graphql_1.getNullableType(getGqlType_1.default(buildToken, field.type, true)),
                [transformGqlInputValue_1.$$gqlInputObjectTypeValueKeyName]: fieldName,
            }])),
    });
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
    return createMutationPayloadGqlType_1.default(buildToken, {
        name: `update-${collection.type.name}`,
        outputFields: [
            // Add the updated value as an output field so the user can see the
            // object they just updated.
            [utils_1.formatName.field(collection.type.name), {
                    type: getCollectionGqlType_1.default(buildToken, collection),
                    resolve: value => value,
                }],
            // Add related objects. This helps in Relay 1.
            ...createCollectionRelationTailGqlFieldEntries_1.default(buildToken, collection),
        ],
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlVXBkYXRlQ29sbGVjdGlvbk11dGF0aW9uRmllbGRFbnRyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9ncmFwaHFsL3NjaGVtYS9jb2xsZWN0aW9uL211dGF0aW9ucy9jcmVhdGVVcGRhdGVDb2xsZWN0aW9uTXV0YXRpb25GaWVsZEVudHJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwwQkFTTyxTQUNQLENBQUMsQ0FEZTtBQUVoQix3QkFBMkQsZ0JBQzNELENBQUMsQ0FEMEU7QUFFM0UsNkJBQXVCLGtCQUN2QixDQUFDLENBRHdDO0FBQ3pDLHlDQUFzRCw4QkFDdEQsQ0FBQyxDQURtRjtBQUNwRiwrQ0FBeUMsb0NBQ3pDLENBQUMsQ0FENEU7QUFDN0UseUNBQXlFLDhCQUN6RSxDQUFDLENBRHNHO0FBQ3ZHLHVDQUFpQyx5QkFDakMsQ0FBQyxDQUR5RDtBQUMxRCw4REFBd0QsZ0RBT3hELENBQUMsQ0FQdUc7QUFFeEc7OztHQUdHO0FBQ0gsYUFBYTtBQUNiLGtEQUNFLFVBQXNCLEVBQ3RCLFVBQXNCO0lBRXRCLE1BQU0sRUFBRSxVQUFVLEVBQUUsR0FBRyxVQUFVLENBQUE7SUFFakMsMkVBQTJFO0lBQzNFLFNBQVM7SUFDVCxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7UUFDcEMsTUFBTSxDQUFBO0lBRVIsTUFBTSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsR0FBRyxVQUFVLENBQUE7SUFDekMsTUFBTSxJQUFJLEdBQUcsVUFBVSxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFBO0lBQzdDLE1BQU0sY0FBYyxHQUFHLGtCQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLFFBQVEsQ0FBQyxDQUFBO0lBQ3hFLE1BQU0sU0FBUyxHQUFHLDhCQUFzQixDQUFDLFVBQVUsRUFBRSxVQUFV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