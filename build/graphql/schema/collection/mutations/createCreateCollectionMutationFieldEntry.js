"use strict";
const utils_1 = require('../../../utils');
const getGqlType_1 = require('../../getGqlType');
const transformGqlInputValue_1 = require('../../transformGqlInputValue');
const createMutationGqlField_1 = require('../../createMutationGqlField');
const createConnectionGqlField_1 = require('../../connection/createConnectionGqlField');
const getCollectionGqlType_1 = require('../getCollectionGqlType');
const createCollectionRelationTailGqlFieldEntries_1 = require('../createCollectionRelationTailGqlFieldEntries');
/**
 * Creates the mutation field entry for creating values in a collection.
 * Returns undefined if you can’t create values in a given collection.
 */
function createCreateCollectionMutationFieldEntry(buildToken, collection) {
    // Return undefined if you can’t create values.
    if (!collection.create)
        return;
    const name = `create-${collection.type.name}`;
    const inputFieldName = utils_1.formatName.field(collection.type.name);
    const inputFieldType = getGqlType_1.default(buildToken, collection.type, true);
    const collectionGqlType = getCollectionGqlType_1.default(buildToken, collection);
    return [utils_1.formatName.field(name), createMutationGqlField_1.default(buildToken, {
            name,
            description: `Creates a single ${utils_1.scrib.type(collectionGqlType)}.`,
            inputFields: [
                // The only input we need when creating a new object is the type in input
                // object form. We nest the input object instead of flattening its fields
                // so that you only need object per value you create.
                [inputFieldName, {
                        description: `The ${utils_1.scrib.type(collectionGqlType)} to be created by this mutation.`,
                        type: inputFieldType,
                    }],
            ],
            outputFields: [
                // The actual object that just got created. The user can then use
                // this as a starting point to query relations that were created
                // with this object.
                [utils_1.formatName.field(collection.type.name), {
                        description: `The ${utils_1.scrib.type(collectionGqlType)} that was created by this mutation.`,
                        type: collectionGqlType,
                        resolve: value => value,
                    }],
                // An edge variant of the created value. Because we use cursor
                // based pagination, it is also helpful to get the cursor for the
                // value we just created (thus why this is in the form of an edge).
                // Also Relay 1 requires us to return the edge.
                //
                // We may deprecate this in the future if Relay 2 doesn’t need it.
                collection.paginator && [utils_1.formatName.field(`${collection.type.name}-edge`), {
                        description: `An edge for our ${utils_1.scrib.type(collectionGqlType)}. May be used by Relay 1.`,
                        type: createConnectionGqlField_1.getEdgeGqlType(buildToken, collection.paginator),
                        args: { orderBy: createConnectionGqlField_1.createOrderByGqlArg(buildToken, collection.paginator) },
                        resolve: (value, args) => ({
                            paginator: collection.paginator,
                            ordering: args['orderBy'],
                            cursor: null,
                            value,
                        }),
                    }],
                // Add related objects. This helps in Relay 1.
                ...createCollectionRelationTailGqlFieldEntries_1.default(buildToken, collection),
            ],
            // When we execute we just create a value in the collection after
            // transforming the correct input field.
            // TODO: test
            execute: (context, input) => {
                const value = transformGqlInputValue_1.default(inputFieldType, input[inputFieldName]);
                // TODO: This can’t be the best solution? `isTypeOf` fails though for
                // default fields that don’t exist.
                if (!(value instanceof Map))
                    throw new Error('Value must be a `Map`.');
                return collection.create(context, value);
            },
        })];
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createCreateCollectionMutationFieldEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlQ3JlYXRlQ29sbGVjdGlvbk11dGF0aW9uRmllbGRFbnRyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9ncmFwaHFsL3NjaGVtYS9jb2xsZWN0aW9uL211dGF0aW9ucy9jcmVhdGVDcmVhdGVDb2xsZWN0aW9uTXV0YXRpb25GaWVsZEVudHJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFQSx3QkFBa0MsZ0JBQ2xDLENBQUMsQ0FEaUQ7QUFFbEQsNkJBQXVCLGtCQUN2QixDQUFDLENBRHdDO0FBQ3pDLHlDQUFtQyw4QkFDbkMsQ0FBQyxDQURnRTtBQUNqRSx5Q0FBbUMsOEJBQ25DLENBQUMsQ0FEZ0U7QUFDakUsMkNBQW9ELDJDQUNwRCxDQUFDLENBRDhGO0FBQy9GLHVDQUFpQyx5QkFDakMsQ0FBQyxDQUR5RDtBQUMxRCw4REFBd0QsZ0RBTXhELENBQUMsQ0FOdUc7QUFFeEc7OztHQUdHO0FBQ0gsa0RBQ0UsVUFBc0IsRUFDdEIsVUFBc0I7SUFFdEIsK0NBQStDO0lBQy9DLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztRQUNyQixNQUFNLENBQUE7SUFFUixNQUFNLElBQUksR0FBRyxVQUFVLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUE7SUFDN0MsTUFBTSxjQUFjLEdBQUcsa0JBQVUsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUM3RCxNQUFNLGNBQWMsR0FBRyxvQkFBVSxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFBO0lBQ3BFLE1BQU0saUJBQWlCLEdBQUcsOEJBQW9CLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFBO0lBRXRFLE1BQU0sQ0FBQyxDQUFDLGtCQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLGdDQUFzQixDQUFtQixVQUFV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