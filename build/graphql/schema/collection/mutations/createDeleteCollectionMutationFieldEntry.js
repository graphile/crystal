"use strict";
const graphql_1 = require('graphql');
const utils_1 = require('../../../utils');
const createMutationGqlField_1 = require('../../createMutationGqlField');
const createMutationPayloadGqlType_1 = require('../../createMutationPayloadGqlType');
const getCollectionGqlType_1 = require('../getCollectionGqlType');
const createCollectionRelationTailGqlFieldEntries_1 = require('../createCollectionRelationTailGqlFieldEntries');
/**
 * Creates a delete mutation that uses the primary key of a collection and an
 * object’s global GraphQL identifier to delete a value in the collection.
 */
// TODO: test
function createDeleteCollectionMutationFieldEntry(buildToken, collection) {
    const { primaryKey } = collection;
    // If there is no primary key, or the primary key has no delete method. End
    // early.
    if (!primaryKey || !primaryKey.delete)
        return;
    const { options, inventory } = buildToken;
    const name = `delete-${collection.type.name}`;
    return [utils_1.formatName.field(name), createMutationGqlField_1.default(buildToken, {
            name,
            description: `Deletes a single \`${utils_1.formatName.type(collection.type.name)}\` using its globally unique id.`,
            inputFields: [
                // The only input field we want is the globally unique id which
                // corresponds to the primary key of this collection.
                [options.nodeIdFieldName, {
                        description: `The globally unique \`ID\` which will identify a single \`${utils_1.formatName.type(collection.type.name)}\` to be deleted.`,
                        type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID),
                    }],
            ],
            payloadType: exports.getDeleteCollectionPayloadGqlType(buildToken, collection),
            // Execute by deserializing the id into its component parts and delete a
            // value in the collection using that key.
            execute: (context, input) => {
                const result = utils_1.idSerde.deserialize(inventory, input[options.nodeIdFieldName]);
                if (result.collection !== collection)
                    throw new Error(`The provided id is for collection '${result.collection.name}', not the expected collection '${collection.name}'.`);
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
    const { primaryKey } = collection;
    return createMutationPayloadGqlType_1.default(buildToken, {
        name: `delete-${collection.type.name}`,
        outputFields: [
            // Add the deleted value as an output field so the user can see the
            // object they just deleted.
            [utils_1.formatName.field(collection.type.name), {
                    type: getCollectionGqlType_1.default(buildToken, collection),
                    resolve: value => value,
                }],
            // Add the deleted values globally unique id as well. This one is
            // especially useful for removing old nodes from the cache.
            primaryKey ? [utils_1.formatName.field(`deleted-${collection.type.name}-id`), {
                    type: graphql_1.GraphQLID,
                    resolve: value => utils_1.idSerde.serialize(collection, value),
                }] : null,
            // Add related objects. This helps in Relay 1.
            ...createCollectionRelationTailGqlFieldEntries_1.default(buildToken, collection),
        ],
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlRGVsZXRlQ29sbGVjdGlvbk11dGF0aW9uRmllbGRFbnRyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9ncmFwaHFsL3NjaGVtYS9jb2xsZWN0aW9uL211dGF0aW9ucy9jcmVhdGVEZWxldGVDb2xsZWN0aW9uTXV0YXRpb25GaWVsZEVudHJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwwQkFBaUYsU0FDakYsQ0FBQyxDQUR5RjtBQUUxRix3QkFBOEMsZ0JBQzlDLENBQUMsQ0FENkQ7QUFFOUQseUNBQXNELDhCQUN0RCxDQUFDLENBRG1GO0FBQ3BGLCtDQUF5QyxvQ0FDekMsQ0FBQyxDQUQ0RTtBQUM3RSx1Q0FBaUMseUJBQ2pDLENBQUMsQ0FEeUQ7QUFDMUQsOERBQXdELGdEQU94RCxDQUFDLENBUHVHO0FBRXhHOzs7R0FHRztBQUNILGFBQWE7QUFDYixrREFDRSxVQUFzQixFQUN0QixVQUFzQjtJQUV0QixNQUFNLEVBQUUsVUFBVSxFQUFFLEdBQUcsVUFBVSxDQUFBO0lBRWpDLDJFQUEyRTtJQUMzRSxTQUFTO0lBQ1QsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO1FBQ3BDLE1BQU0sQ0FBQTtJQUVSLE1BQU0sRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLEdBQUcsVUFBVSxDQUFBO0lBQ3pDLE1BQU0sSUFBSSxHQUFHLFVBQVUsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQTtJQUU3QyxNQUFNLENBQUMsQ0FBQyxrQkFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxnQ0FBc0IsQ0FBbUIsVUFBVSxFQUFFO1lBQ25GLElBQUk7WUFDSixXQUFXLEVBQUUsc0JBQXNCLGtCQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGtDQUFrQztZQUMxRyxXQUFXLEVBQUU7Z0JBQ1gsK0RBQStEO2dCQUMvRCxxREFBcUQ7Z0JBQ3JELENBQUMsT0FBTyxDQUFDLGVBQWUsRUFBRTt3QkFDeEIsV0FBVyxFQUFFLDZEQUE2RCxrQkFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUI7d0JBQ2xJLElBQUksRUFBRSxJQUFJLHdCQUFjLENBQUMsbUJBQVMsQ0FBQztxQkFDcEMsQ0FBQzthQUNIO1lBQ0QsV0FBVyxFQUFFLHlDQUFpQyxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUM7WUFDdEUsd0VBQXdFO1lBQ3hFLDBDQUEwQztZQUMxQyxPQUFPLEVBQUUsQ0FBQyxPQUFPLEVBQUUsS0FBSztnQkFDdEIsTUFBTSxNQUFNLEdBQUcsZUFBTyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQVcsQ0FBQyxDQUFBO2dCQUV2RixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxLQUFLLFVBQVUsQ0FBQztvQkFDbkMsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQ0FBc0MsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLG1DQUFtQyxVQUFVLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQTtnQkFFckksTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFPLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUNyRCxDQUFDO1NBQ0YsQ0FBQyxDQUFDLENBQUE7QUFDTCxDQUFDO0FBckNEOzBEQXFDQyxDQUFBO0FBRVkseUNBQWlDLEdBQUcsZ0JBQVEsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFBO0FBRS9GOztHQUVHO0FBQ0gsOENBQ0UsVUFBc0IsRUFDdEIsVUFBc0I7SUFFdEIsTUFBTSxFQUFFLFVBQVUsRUFBRSxHQUFHLFVBQVUsQ0FBQTtJQUVqQyxNQUFNLENBQUMsc0NBQTRCLENBQW1CLFVBQVUsRUFBRTtRQUNoRSxJQUFJLEVBQUUsVUFBVSxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTtRQUN0QyxZQUFZLEVBQUU7WUFDWixtRUFBbUU7WUFDbkUsNEJBQTRCO1lBQzVCLENBQUMsa0JBQVUsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtvQkFDdkMsSUFBSSxFQUFFLDhCQUFvQixDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUM7b0JBQ2xELE9BQU8sRUFBRSxLQUFLLElBQUksS0FBSztpQkFDeEIsQ0FBQztZQUNGLGlFQUFpRTtZQUNqRSwyREFBMkQ7WUFDM0QsVUFBVSxHQUFHLENBQUMsa0JBQVUsQ0FBQyxLQUFLLENBQUMsV0FBVyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUU7b0JBQ3BFLElBQUksRUFBRSxtQkFBUztvQkFDZixPQUFPLEVBQUUsS0FBSyxJQUFJLGVBQU8sQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQztpQkFDdkQsQ0FBQyxHQUFHLElBQUk7WUFDVCw4Q0FBOEM7WUFDOUMsR0FBRyxxREFBMkMsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDO1NBQ3ZFO0tBQ0YsQ0FBQyxDQUFBO0FBQ0osQ0FBQyJ9