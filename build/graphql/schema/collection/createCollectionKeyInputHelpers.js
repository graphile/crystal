"use strict";
const graphql_1 = require('graphql');
const interface_1 = require('../../../interface');
const utils_1 = require('../../utils');
const getGqlType_1 = require('../getGqlType');
const transformGqlInputValue_1 = require('../transformGqlInputValue');
/**
 * There are different ways to create the input for a collection key given the
 * collection key’s type. This is a helper function which will return the tools
 * necessary to create inputs for collection keys that feel right.
 *
 * For object keys we flatten out all of the object’s fields into individual
 * GraphQL fields.
 *
 * For everything else we just have a single field.
 */
// TODO: test
function createCollectionKeyInputHelpers(buildToken, collectionKey) {
    const { keyType } = collectionKey;
    // If this is an object type, we want to flatten out the object’s fields into
    // field entries. This provides a nicer experience as it eliminates one level
    // of nesting.
    if (keyType instanceof interface_1.ObjectType) {
        // Create the definition of our fields. We will use this definition
        // to correctly assemble the input later.
        const fieldEntries = Array.from(keyType.fields).map(([fieldName, field]) => [utils_1.formatName.arg(fieldName), {
                description: field.description,
                type: new graphql_1.GraphQLNonNull(graphql_1.getNullableType(getGqlType_1.default(buildToken, field.type, true))),
                // We add an `internalName` so that we can use that name to
                // reconstruct the correct object value.
                internalName: fieldName,
            }]);
        return {
            fieldEntries,
            getKey: input => {
                const key = new Map(fieldEntries.map(([fieldName, field]) => [
                    field.internalName,
                    transformGqlInputValue_1.default(field.type, input[fieldName]),
                ]));
                if (!keyType.isTypeOf(key))
                    throw new Error('The object key input is not of the correct type.');
                return key;
            },
        };
    }
    else {
        const fieldName = utils_1.formatName.arg(collectionKey.name);
        const fieldType = getGqlType_1.default(buildToken, keyType, true);
        return {
            fieldEntries: [
                [fieldName, {
                        description: `The ${utils_1.scrib.type(fieldType)} to use when reading a single value.`,
                        type: new graphql_1.GraphQLNonNull(graphql_1.getNullableType(fieldType)),
                    }],
            ],
            getKey: input => {
                const key = transformGqlInputValue_1.default(fieldType, input[fieldName]);
                if (!keyType.isTypeOf(key))
                    throw new Error('The key input is not of the correct type.');
                return key;
            },
        };
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createCollectionKeyInputHelpers;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlQ29sbGVjdGlvbktleUlucHV0SGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9ncmFwaHFsL3NjaGVtYS9jb2xsZWN0aW9uL2NyZWF0ZUNvbGxlY3Rpb25LZXlJbnB1dEhlbHBlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBCQUF5RSxTQUN6RSxDQUFDLENBRGlGO0FBQ2xGLDRCQUEwQyxvQkFDMUMsQ0FBQyxDQUQ2RDtBQUM5RCx3QkFBa0MsYUFDbEMsQ0FBQyxDQUQ4QztBQUUvQyw2QkFBdUIsZUFDdkIsQ0FBQyxDQURxQztBQUN0Qyx5Q0FBbUMsMkJBYW5DLENBQUMsQ0FiNkQ7QUFFOUQ7Ozs7Ozs7OztHQVNHO0FBQ0gsYUFBYTtBQUNiLHlDQUNFLFVBQXNCLEVBQ3RCLGFBQStCO0lBSy9CLE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxhQUFhLENBQUE7SUFFakMsNkVBQTZFO0lBQzdFLDZFQUE2RTtJQUM3RSxjQUFjO0lBQ2QsRUFBRSxDQUFDLENBQUMsT0FBTyxZQUFZLHNCQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLG1FQUFtRTtRQUNuRSx5Q0FBeUM7UUFDekMsTUFBTSxZQUFZLEdBQ2hCLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBc0UsQ0FBQyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsS0FDckgsQ0FBQyxrQkFBVSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRTtnQkFDMUIsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO2dCQUM5QixJQUFJLEVBQUUsSUFBSSx3QkFBYyxDQUFDLHlCQUFlLENBQUMsb0JBQVUsQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNuRiwyREFBMkQ7Z0JBQzNELHdDQUF3QztnQkFDeEMsWUFBWSxFQUFFLFNBQVM7YUFDeEIsQ0FBQyxDQUNILENBQUE7UUFFSCxNQUFNLENBQUM7WUFDTCxZQUFZO1lBQ1osTUFBTSxFQUFFLEtBQUs7Z0JBQ1gsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBa0IsQ0FBQyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsS0FBSztvQkFDNUUsS0FBSyxDQUFDLFlBQVk7b0JBQ2xCLGdDQUFzQixDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBVSxDQUFDO2lCQUM5RCxDQUFDLENBQUMsQ0FBQTtnQkFFSCxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3pCLE1BQU0sSUFBSSxLQUFLLENBQUMsa0RBQWtELENBQUMsQ0FBQTtnQkFFckUsTUFBTSxDQUFDLEdBQUcsQ0FBQTtZQUNaLENBQUM7U0FDRixDQUFBO0lBQ0gsQ0FBQztJQUVELElBQUksQ0FBQyxDQUFDO1FBQ0osTUFBTSxTQUFTLEdBQUcsa0JBQVUsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ3BELE1BQU0sU0FBUyxHQUFHLG9CQUFVLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQTtRQUV2RCxNQUFNLENBQUM7WUFDTCxZQUFZLEVBQUU7Z0JBQ1osQ0FBQyxTQUFTLEVBQUU7d0JBQ1YsV0FBVyxFQUFFLE9BQU8sYUFBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsc0NBQXNDO3dCQUMvRSxJQUFJLEVBQUUsSUFBSSx3QkFBYyxDQUFDLHlCQUFlLENBQUMsU0FBUyxDQUFDLENBQUM7cUJBQ3JELENBQUM7YUFDSDtZQUNELE1BQU0sRUFBRSxLQUFLO2dCQUNYLE1BQU0sR0FBRyxHQUFHLGdDQUFzQixDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQTtnQkFFL0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUN6QixNQUFNLElBQUksS0FBSyxDQUFDLDJDQUEyQyxDQUFDLENBQUE7Z0JBRTlELE1BQU0sQ0FBQyxHQUFHLENBQUE7WUFDWixDQUFDO1NBQ0YsQ0FBQTtJQUNILENBQUM7QUFDSCxDQUFDO0FBL0REO2lEQStEQyxDQUFBIn0=