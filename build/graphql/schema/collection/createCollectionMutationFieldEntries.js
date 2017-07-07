"use strict";
var createCreateCollectionMutationFieldEntry_1 = require("./mutations/createCreateCollectionMutationFieldEntry");
var createUpdateCollectionMutationFieldEntry_1 = require("./mutations/createUpdateCollectionMutationFieldEntry");
var createUpdateCollectionKeyMutationFieldEntry_1 = require("./mutations/createUpdateCollectionKeyMutationFieldEntry");
var createDeleteCollectionMutationFieldEntry_1 = require("./mutations/createDeleteCollectionMutationFieldEntry");
var createDeleteCollectionKeyMutationFieldEntry_1 = require("./mutations/createDeleteCollectionKeyMutationFieldEntry");
/**
 * Creates all of the mutation fields available for a given collection. This
 * includes the basic stuff: create, update, and delete. In the future
 * mutations like upsert may be added.
 */
function createCollectionMutationFieldEntries(buildToken, collection) {
    // Create an array of entries that may be undefined. We will filter out the
    // undefined ones at the end.
    var optionalEntries = [
        // Add the create collection mutation.
        createCreateCollectionMutationFieldEntry_1.default(buildToken, collection),
        // Add the update collection mutation. Uses the collection’s primary key.
        createUpdateCollectionMutationFieldEntry_1.default(buildToken, collection)
    ].concat(collection.keys.map(function (collectionKey) { return createUpdateCollectionKeyMutationFieldEntry_1.default(buildToken, collectionKey); }), [
        // Add the delete collection mutation. Uses the collection’s primary key.
        createDeleteCollectionMutationFieldEntry_1.default(buildToken, collection)
    ], collection.keys.map(function (collectionKey) { return createDeleteCollectionKeyMutationFieldEntry_1.default(buildToken, collectionKey); }));
    return optionalEntries.filter(Boolean);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createCollectionMutationFieldEntries;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlQ29sbGVjdGlvbk11dGF0aW9uRmllbGRFbnRyaWVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2dyYXBocWwvc2NoZW1hL2NvbGxlY3Rpb24vY3JlYXRlQ29sbGVjdGlvbk11dGF0aW9uRmllbGRFbnRyaWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFHQSxpSEFBMkc7QUFDM0csaUhBQTJHO0FBQzNHLHVIQUFpSDtBQUNqSCxpSEFBMkc7QUFDM0csdUhBQWlIO0FBRWpIOzs7O0dBSUc7QUFDSCw4Q0FDRSxVQUFzQixFQUN0QixVQUE4QjtJQUU5QiwyRUFBMkU7SUFDM0UsNkJBQTZCO0lBQzdCLElBQU0sZUFBZTtRQUNuQixzQ0FBc0M7UUFDdEMsa0RBQXdDLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQztRQUNoRSx5RUFBeUU7UUFDekUsa0RBQXdDLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQzthQUU3RCxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFBLGFBQWEsSUFBSSxPQUFBLHFEQUEyQyxDQUFDLFVBQVUsRUFBRSxhQUFhLENBQUMsRUFBdEUsQ0FBc0UsQ0FBQztRQUMvRyx5RUFBeUU7UUFDekUsa0RBQXdDLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQztPQUU3RCxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFBLGFBQWEsSUFBSSxPQUFBLHFEQUEyQyxDQUFDLFVBQVUsRUFBRSxhQUFhLENBQUMsRUFBdEUsQ0FBc0UsQ0FBQyxDQUNoSCxDQUFBO0lBRUQsTUFBTSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFzRCxDQUFBO0FBQzdGLENBQUM7O0FBcEJELHVEQW9CQyJ9