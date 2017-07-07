"use strict";
var graphql_1 = require("graphql");
var interface_1 = require("../../../interface");
var utils_1 = require("../../utils");
var aliasGqlType_1 = require("./aliasGqlType");
var getGqlOutputType_1 = require("./getGqlOutputType");
/**
 * The non-memoized version of `getGqlInputType`.
 *
 * @private
 */
var createGqlInputType = function (buildToken, _type) {
    // Switch on our type argument. Depending on the kind of our type, different
    // cases will run.
    return interface_1.switchType(_type, {
        // Adapter types should try again with their base type.
        adapter: function (type) { return getGqlInputType(buildToken, type.baseType); },
        // If the kind of this type is a nullable type, we want to return the
        // nullable version of the internal non null type. When converting GraphQL
        // input, if the input value is null, we will return null. Otherwise we
        // will delegate to our non-null type’s `fromGqlInput`.
        nullable: function (type) {
            var _a = getGqlInputType(buildToken, type.nonNullType), nonNullGqlType = _a.gqlType, fromNonNullGqlInput = _a.fromGqlInput;
            return {
                gqlType: graphql_1.getNullableType(nonNullGqlType),
                fromGqlInput: function (gqlInput) {
                    return gqlInput == null
                        ? null
                        : fromNonNullGqlInput(gqlInput);
                },
            };
        },
        // For our list type, the GraphQL input type will be a non-null list of the
        // item type. When transforming our GraphQL input we will map all of the
        // items in the input array as specified by our item type’s `fromGqlInput`.
        list: function (type) {
            var _a = getGqlInputType(buildToken, type.itemType), itemGqlType = _a.gqlType, fromItemGqlInput = _a.fromGqlInput;
            return {
                gqlType: new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(itemGqlType)),
                fromGqlInput: function (gqlInput) {
                    return Array.isArray(gqlInput)
                        ? type.fromArray(gqlInput.map(function (gqlInputItem) { return fromItemGqlInput(gqlInputItem); }))
                        : (function () { throw new Error('Input value must be an array.'); })();
                },
            };
        },
        // Alias GraphQL types will be created using our `aliasGqlType` helper, and
        // will not be made non-null as the created base GraphQL type should have
        // the correct nullability rules. In order to coerce input values into the
        // correct value, the base type’s `fromGqlInput` is used without
        // modification.
        alias: function (type) {
            var _a = getGqlInputType(buildToken, type.baseType), baseGqlType = _a.gqlType, fromGqlInput = _a.fromGqlInput;
            // If the base GraphQL type is an output type then we should return
            // whatever type `getGqlOutputType` creates to avoid creating two types
            // with the same name.
            if (graphql_1.isOutputType(baseGqlType)) {
                var gqlType = getGqlOutputType_1.default(buildToken, type).gqlType;
                if (!graphql_1.isInputType(gqlType))
                    throw new Error('Expected an input GraphQL type');
                return {
                    gqlType: gqlType,
                    fromGqlInput: fromGqlInput,
                };
            }
            return {
                gqlType: aliasGqlType_1.default(baseGqlType, utils_1.formatName.type(type.name), type.description),
                fromGqlInput: fromGqlInput,
            };
        },
        // Enum types will be turned into a non-null GraphQL enum type, the
        // variants of which will return the actual enum value requiring no extra
        // value coercion in `fromGqlInput` other than a type check.
        //
        // We use the `getGqlOutputType` implementation for this as the input and
        // output types will be the same.
        enum: function (type) { return ({
            gqlType: getGqlInputTypeFromOutputType(buildToken, type),
            fromGqlInput: function (gqlInput) {
                return type.isTypeOf(gqlInput)
                    ? gqlInput
                    : (function () { throw new Error('Input value must be an enum variant.'); })();
            },
        }); },
        // Objects will be turned into a non-null GraphQL input object type as
        // expected. The coercion step is different though in some important ways.
        // As fields will be renamed to use `camelCase`. So the coercion must
        // rename such fields back to their expected name in addition to coercing
        // the field values.
        object: function (type) {
            // An array of our fields and all the information on those fields we will
            // need to create the GraphQL type, and coerce the input value. There is
            // some common logic so we create this array once and share it.
            var fieldFixtures = Array.from(type.fields).map(function (_a) {
                var fieldName = _a[0], field = _a[1];
                var _b = getGqlInputType(buildToken, field.type), gqlType = _b.gqlType, fromGqlInput = _b.fromGqlInput;
                return {
                    fieldName: fieldName,
                    field: field,
                    key: utils_1.formatName.field(fieldName),
                    gqlType: gqlType,
                    fromGqlInput: fromGqlInput,
                };
            });
            return {
                gqlType: new graphql_1.GraphQLNonNull(new graphql_1.GraphQLInputObjectType({
                    name: utils_1.formatName.type(type.name + "-input"),
                    description: type.description,
                    fields: utils_1.buildObject(fieldFixtures.map(function (_a) {
                        var key = _a.key, field = _a.field, gqlType = _a.gqlType;
                        return ({
                            key: key,
                            value: {
                                description: field.description,
                                type: field.hasDefault ? graphql_1.getNullableType(gqlType) : gqlType,
                            },
                        });
                    })),
                })),
                fromGqlInput: function (gqlInput) {
                    return gqlInput != null && typeof gqlInput === 'object'
                        ? type.fromFields(new Map(fieldFixtures.map(function (_a) {
                            var fieldName = _a.fieldName, key = _a.key, fromGqlInput = _a.fromGqlInput;
                            return [fieldName, fromGqlInput(gqlInput[key])];
                        })))
                        : (function () { throw new Error("Input value must be an object, not '" + typeof gqlInput + "'."); })();
                },
            };
        },
        // For scalar types we want to use the same input type as output type. This
        // will be our GraphQL type. Our `fromGqlInput` will then just be an
        // identity function because the scalar type defines `parseValue` and
        // `parseLiteral` already to coerce our value inside the GraphQL type.
        scalar: function (type) { return ({
            gqlType: getGqlInputTypeFromOutputType(buildToken, type),
            fromGqlInput: function (gqlInput) { return gqlInput; },
        }); },
    });
};
/**
 * This function will allow you to use `getGqlOutputType` to create the type,
 * but will check that it’s an input type and return it as an input type.
 *
 * We use this because some GraphQL types can be both input and output types
 * so we want to share logic. This is the way we do it.
 *
 * @private
 */
function getGqlInputTypeFromOutputType(buildToken, type) {
    var gqlOutputType = getGqlOutputType_1.default(buildToken, type).gqlType;
    if (graphql_1.isInputType(gqlOutputType))
        return gqlOutputType;
    // Should be unreachable if we use this function wisely.
    throw new Error("Expected GraphQL input type '" + gqlOutputType.toString() + "' to also be an output type.");
}
// The actual memoized function. It may not have exactly correct types and we’d
// also like to add special cases.
var _getGqlInputType = utils_1.memoize2(createGqlInputType);
/**
 * Takes a build token and an interface type and gets some values that are
 * necessary for creating and interpreting input from GraphQL. The two values
 * created by this function are a GraphQL input type and a function that will
 * convert the value resultant from that input type into a proper value to be
 * used by our interface.
 */
function getGqlInputType(buildToken, type) {
    // If we have an input type override for this type, throw an error because
    // that is not yet implemented!
    if (buildToken._typeOverrides) {
        var typeOverride = buildToken._typeOverrides.get(type);
        if (typeOverride && typeOverride.input)
            throw new Error("Unimplemented, cannot create an input type for '" + interface_1.getNamedType(type).name + "'.");
    }
    return _getGqlInputType(buildToken, type);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getGqlInputType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0R3FsSW5wdXRUeXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2dyYXBocWwvc2NoZW1hL3R5cGUvZ2V0R3FsSW5wdXRUeXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxtQ0FRZ0I7QUFFaEIsZ0RBVzJCO0FBRTNCLHFDQUErRDtBQUUvRCwrQ0FBeUM7QUFDekMsdURBQWlEO0FBY2pEOzs7O0dBSUc7QUFDSCxJQUFNLGtCQUFrQixHQUFHLFVBQVMsVUFBc0IsRUFBRSxLQUFtQjtJQUM3RSw0RUFBNEU7SUFDNUUsa0JBQWtCO0lBQ2xCLE9BQUEsc0JBQVUsQ0FBNEIsS0FBSyxFQUFFO1FBQzNDLHVEQUF1RDtRQUN2RCxPQUFPLEVBQUUsVUFBUyxJQUF5QixJQUFLLE9BQUEsZUFBZSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQTFDLENBQTBDO1FBRTFGLHFFQUFxRTtRQUNyRSwwRUFBMEU7UUFDMUUsdUVBQXVFO1FBQ3ZFLHVEQUF1RDtRQUN2RCxRQUFRLEVBQUUsVUFBZ0IsSUFBaUM7WUFDbkQsSUFBQSxrREFBOEcsRUFBNUcsMkJBQXVCLEVBQUUscUNBQWlDLENBQWtEO1lBQ3BILE1BQU0sQ0FBQztnQkFDTCxPQUFPLEVBQUUseUJBQWtCLENBQUMsY0FBYyxDQUFDO2dCQUMzQyxZQUFZLEVBQUUsVUFBQSxRQUFRO29CQUNwQixPQUFBLFFBQVEsSUFBSSxJQUFJOzBCQUNaLElBQUk7MEJBQ0osbUJBQW1CLENBQUMsUUFBUSxDQUFDO2dCQUZqQyxDQUVpQzthQUNwQyxDQUFBO1FBQ0gsQ0FBQztRQUVELDJFQUEyRTtRQUMzRSx3RUFBd0U7UUFDeEUsMkVBQTJFO1FBQzNFLElBQUksRUFBRSxVQUFhLElBQWtDO1lBQzdDLElBQUEsK0NBQXFHLEVBQW5HLHdCQUFvQixFQUFFLGtDQUE4QixDQUErQztZQUMzRyxNQUFNLENBQUM7Z0JBQ0wsT0FBTyxFQUFFLElBQUksd0JBQWMs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