"use strict";
const createCreateCollectionMutationFieldEntry_1 = require('./mutations/createCreateCollectionMutationFieldEntry');
const createUpdateCollectionMutationFieldEntry_1 = require('./mutations/createUpdateCollectionMutationFieldEntry');
const createUpdateCollectionKeyMutationFieldEntry_1 = require('./mutations/createUpdateCollectionKeyMutationFieldEntry');
const createDeleteCollectionMutationFieldEntry_1 = require('./mutations/createDeleteCollectionMutationFieldEntry');
const createDeleteCollectionKeyMutationFieldEntry_1 = require('./mutations/createDeleteCollectionKeyMutationFieldEntry');
/**
 * Creates all of the mutation fields available for a given collection. This
 * includes the basic stuff: create, update, and delete. In the future
 * mutations like upsert may be added.
 */
function createCollectionMutationFieldEntries(buildToken, collection) {
    // Create an array of entries that may be undefined. We will filter out the
    // undefined ones at the end.
    const optionalEntries = [
        // Add the create collection mutation.
        createCreateCollectionMutationFieldEntry_1.default(buildToken, collection),
        // Add the update collection mutation. Uses the collection’s primary key.
        createUpdateCollectionMutationFieldEntry_1.default(buildToken, collection),
        // Add the update mutation for all of the collection keys.
        ...collection.keys.map(collectionKey => createUpdateCollectionKeyMutationFieldEntry_1.default(buildToken, collectionKey)),
        // Add the delete collection mutation. Uses the collection’s primary key.
        createDeleteCollectionMutationFieldEntry_1.default(buildToken, collection),
        // Add the delete mutation for all of the collection keys.
        ...collection.keys.map(collectionKey => createDeleteCollectionKeyMutationFieldEntry_1.default(buildToken, collectionKey)),
    ];
    return optionalEntries.filter(Boolean);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createCollectionMutationFieldEntries;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlQ29sbGVjdGlvbk11dGF0aW9uRmllbGRFbnRyaWVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2dyYXBocWwvc2NoZW1hL2NvbGxlY3Rpb24vY3JlYXRlQ29sbGVjdGlvbk11dGF0aW9uRmllbGRFbnRyaWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFHQSwyREFBcUQsc0RBQ3JELENBQUMsQ0FEMEc7QUFDM0csMkRBQXFELHNEQUNyRCxDQUFDLENBRDBHO0FBQzNHLDhEQUF3RCx5REFDeEQsQ0FBQyxDQURnSDtBQUNqSCwyREFBcUQsc0RBQ3JELENBQUMsQ0FEMEc7QUFDM0csOERBQXdELHlEQU94RCxDQUFDLENBUGdIO0FBRWpIOzs7O0dBSUc7QUFDSCw4Q0FDRSxVQUFzQixFQUN0QixVQUFzQjtJQUV0QiwyRUFBMkU7SUFDM0UsNkJBQTZCO0lBQzdCLE1BQU0sZUFBZSxHQUFrRTtRQUNyRixzQ0FBc0M7UUFDdEMsa0RBQXdDLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQztRQUNoRSx5RUFBeUU7UUFDekUsa0RBQXdDLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQztRQUNoRSwwREFBMEQ7UUFDMUQsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLElBQUkscURBQTJDLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQy9HLHlFQUF5RTtRQUN6RSxrREFBd0MsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDO1FBQ2hFLDBEQUEwRDtRQUMxRCxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsSUFBSSxxREFBMkMsQ0FBQyxVQUFVLEVBQUUsYUFBYSxDQUFDLENBQUM7S0FDaEgsQ0FBQTtJQUVELE1BQU0sQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBc0QsQ0FBQTtBQUM3RixDQUFDO0FBcEJEO3NEQW9CQyxDQUFBIn0=