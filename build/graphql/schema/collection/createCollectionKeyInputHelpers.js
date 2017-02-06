"use strict";
var graphql_1 = require("graphql");
var interface_1 = require("../../../interface");
var utils_1 = require("../../utils");
var getGqlInputType_1 = require("../type/getGqlInputType");
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
    return interface_1.switchType(collectionKey.keyType, {
        // If this is an object type, we want to flatten out the object’s fields into
        // field entries. This provides a nicer experience as it eliminates one level
        // of nesting.
        object: function (keyType) {
            // Create the definition of our fields. We will use this definition
            // to correctly assemble the input later.
            var fields = Array.from(keyType.fields).map(function (_a) {
                var fieldName = _a[0], field = _a[1];
                var _b = getGqlInputType_1.default(buildToken, field.type), gqlType = _b.gqlType, fromGqlInput = _b.fromGqlInput;
                return {
                    key: utils_1.formatName.arg(fieldName),
                    value: {
                        description: field.description,
                        type: new graphql_1.GraphQLNonNull(graphql_1.getNullableType(gqlType)),
                        // We add an `internalName` so that we can use that name to
                        // reconstruct the correct object value.
                        internalName: fieldName,
                        // We also add this function so we can use it later on.
                        fromGqlInput: fromGqlInput,
                    },
                };
            });
            return {
                fieldEntries: fields.map(function (_a) {
                    var key = _a.key, value = _a.value;
                    return [key, value];
                }),
                getKeyFromInput: function (input) {
                    return keyType.fromFields(new Map(fields.map(function (_a) {
                        var key = _a.key, _b = _a.value, internalName = _b.internalName, fromGqlInput = _b.fromGqlInput;
                        return [internalName, fromGqlInput(input[key])];
                    })));
                },
            };
        },
        // Otherwise, we just put the type into a single field entry with the
        // default case. Pretty boring.
        nullable: defaultCase,
        list: defaultCase,
        alias: defaultCase,
        enum: defaultCase,
        scalar: defaultCase,
    });
    function defaultCase(keyType) {
        var fieldName = utils_1.formatName.arg(collectionKey.name);
        var _a = getGqlInputType_1.default(buildToken, keyType), gqlType = _a.gqlType, fromGqlInput = _a.fromGqlInput;
        return {
            fieldEntries: [
                [fieldName, {
                        description: "The " + utils_1.scrib.type(gqlType) + " to use when reading a single value.",
                        type: new graphql_1.GraphQLNonNull(graphql_1.getNullableType(gqlType)),
                    }],
            ],
            getKeyFromInput: fromGqlInput,
        };
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createCollectionKeyInputHelpers;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlQ29sbGVjdGlvbktleUlucHV0SGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9ncmFwaHFsL3NjaGVtYS9jb2xsZWN0aW9uL2NyZWF0ZUNvbGxlY3Rpb25LZXlJbnB1dEhlbHBlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLG1DQUFrRjtBQUNsRixnREFBZ0Y7QUFDaEYscUNBQStDO0FBQy9DLDJEQUFxRDtBQVFyRDs7Ozs7Ozs7O0dBU0c7QUFDSCxhQUFhO0FBQ2IseUNBQ0UsVUFBc0IsRUFDdEIsYUFBMEM7SUFFMUMsTUFBTSxDQUFDLHNCQUFVLENBQWtDLGFBQWEsQ0FBQyxPQUFPLEVBQUU7UUFDeEUsNkVBQTZFO1FBQzdFLDZFQUE2RTtRQUM3RSxjQUFjO1FBQ2QsTUFBTSxFQUFFLFVBQU8sT0FBeUI7WUFDdEMsbUVBQW1FO1lBQ25FLHlDQUF5QztZQUN6QyxJQUFNLE1BQU0sR0FDVixLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQyxFQUFrQjtvQkFBakIsaUJBQVMsRUFBRSxhQUFLO2dCQUN6QyxJQUFBLHNEQUFtRSxFQUFqRSxvQkFBTyxFQUFFLDhCQUFZLENBQTRDO2dCQUN6RSxNQUFNLENBQUM7b0JBQ0wsR0FBRyxFQUFFLGtCQUFVLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQztvQkFDOUIsS0FBSyxFQUFFO3dCQUNMLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVzt3QkFDOUIsSUFBSSxFQUFFLElBQUksd0JBQWMsQ0FBQyx5QkFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO3dCQUNsRCwyREFBMkQ7d0JBQzNELHdDQUF3Qzt3QkFDeEMsWUFBWSxFQUFFLFNBQVM7d0JBQ3ZCLHVEQUF1RDt3QkFDdkQsWUFBWSxjQUFBO3FCQUNiO2lCQUNGLENBQUE7WUFDSCxDQUFDLENBQUMsQ0FBQTtZQUVKLE1BQU0sQ0FBQztnQkFDTCxZQUFZLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBb0MsVUFBQyxFQUFjO3dCQUFaLFlBQUcsRUFBRSxnQkFBSztvQkFBTyxPQUFBLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQztnQkFBWixDQUFZLENBQUM7Z0JBQzdGLGVBQWUsRUFBRSxVQUFDLEtBQStCO29CQUMvQyxPQUFBLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBa0IsVUFBQyxFQUE4Qzs0QkFBNUMsWUFBRyxFQUFFLGFBQXFDLEVBQTVCLDhCQUFZLEVBQUUsOEJBQVk7d0JBQ2hHLE9BQUEsQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUF4QyxDQUF3QyxDQUFDLENBQUMsQ0FBQztnQkFEN0MsQ0FDNkM7YUFDaEQsQ0FBQTtRQUNILENBQUM7UUFFRCxxRUFBcUU7UUFDckUsK0JBQStCO1FBQy9CLFFBQVEsRUFBRSxXQUFXO1FBQ3JCLElBQUksRUFBRSxXQUFXO1FBQ2pCLEtBQUssRUFBRSxXQUFXO1FBQ2xCLElBQUksRUFBRSxXQUFXO1FBQ2pCLE1BQU0sRUFBRSxXQUFXO0tBQ3BCLENBQUMsQ0FBQTtJQUVGLHFCQUE0QixPQUFtQjtRQUM3QyxJQUFNLFNBQVMsR0FBRyxrQkFBVSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDOUMsSUFBQSxtREFBZ0UsRUFBOUQsb0JBQU8sRUFBRSw4QkFBWSxDQUF5QztRQUV0RSxNQUFNLENBQUM7WUFDTCxZQUFZLEVBQUU7Z0JBQ1osQ0FBQyxTQUFTLEVBQUU7d0JBQ1YsV0FBVyxFQUFFLFNBQU8sYUFBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMseUNBQXNDO3dCQUM3RSxJQUFJLEVBQUUsSUFBSSx3QkFBYyxDQUFDLHlCQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7cUJBQ25ELENBQUM7YUFDSDtZQUNELGVBQWUsRUFBRSxZQUFZO1NBQzlCLENBQUE7SUFDSCxDQUFDO0FBQ0gsQ0FBQzs7QUEzREQsa0RBMkRDIn0=