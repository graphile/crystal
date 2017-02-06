"use strict";
var graphql_1 = require("graphql");
var interface_1 = require("../../../interface");
var utils_1 = require("../../utils");
var createCollectionGqlType_1 = require("../collection/createCollectionGqlType");
var aliasGqlType_1 = require("./aliasGqlType");
/**
 * The non-memoized internal implementation of `getGqlOutputType`.
 *
 * @private
 */
var createGqlOutputType = function (buildToken, _type) {
    // Switches on the type that we want to build and output type for and will
    // return a `GraphQLOutputType`.
    return interface_1.switchType(_type, {
        // Adapter types should try again with their base type.
        adapter: function (type) { return getGqlOutputType(buildToken, type.baseType); },
        // For nullable types we will just get the internal nullable instance of
        // the GraphQL output type and return it. This means stripping the
        // `GraphQLNonNull` wrapper that is around (almost) every type returned by
        // `getGqlOutputType`.
        //
        // When coercing into the output format expected by GraphQL, if the value
        // is of the null variant, we just return `null`. Otherwise we coerce the
        // value using the non-null funciton.
        nullable: function (type) {
            var _a = getGqlOutputType(buildToken, type.nonNullType), nonNullGqlType = _a.gqlType, intoNonNullGqlOutput = _a.intoGqlOutput;
            return {
                gqlType: graphql_1.getNullableType(nonNullGqlType),
                intoGqlOutput: function (value) {
                    return type.isNonNull(value)
                        ? intoNonNullGqlOutput(value)
                        : null;
                },
            };
        },
        // For list types we will return a non-null list where the item type is the
        // output type for the interface list’s item type.
        //
        // To coerce into GraphQL output we convert the value into an array and
        // map the items into GraphQL outputs.
        list: function (type) {
            var _a = getGqlOutputType(buildToken, type.itemType), itemGqlType = _a.gqlType, intoItemGqlOutput = _a.intoGqlOutput;
            return {
                gqlType: new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(itemGqlType)),
                intoGqlOutput: function (value) {
                    return type.intoArray(value).map(function (item) { return intoItemGqlOutput(item); });
                },
            };
        },
        // For alias types we use our `aliasGqlType` helper with the GraphQL
        // output type from our base type.
        //
        // We use the same coercer as the base type.
        alias: function (type) {
            var _a = getGqlOutputType(buildToken, type.baseType), baseGqlType = _a.gqlType, intoGqlOutput = _a.intoGqlOutput;
            return {
                gqlType: aliasGqlType_1.default(baseGqlType, utils_1.formatName.type(type.name), type.description),
                intoGqlOutput: intoGqlOutput,
            };
        },
        // Enum types will be turned into a non-null GraphQL enum type for which
        // all the variants are variants of this enum. The values of which will be
        // the actual variant values from our enum.
        //
        // The coercion output is just an identity. GraphQL takes care of our
        // enums.
        enum: function (type) {
            return {
                gqlType: new graphql_1.GraphQLNonNull(new graphql_1.GraphQLEnumType({
                    name: utils_1.formatName.type(type.name),
                    description: type.description,
                    values: utils_1.buildObject(Array.from(type.variants).map(function (_a) {
                        var key = _a[0], value = _a[1];
                        return ({
                            key: utils_1.formatName.enumValue(key),
                            value: { value: value },
                        });
                    })),
                })),
                intoGqlOutput: function (value) { return value; },
            };
        },
        // Object types will be created as non-null output object types, the
        // fields of which are extracted using appropriate mechanisms.
        //
        // If this is the type for a collection, we will return the collection
        // type instead of creating a new object type.
        //
        // We don’t coerce object types to output because GraphQL already does a
        // good job of that for us in the resolvers. In our resolvers we will,
        // however, coerce the field values.
        object: function (type) {
            var inventory = buildToken.inventory;
            var collection = inventory.getCollectionForType(type);
            // If there is a collection which uses this type, we should use the
            // collection’s type and not create our own. We use an identity function
            // for `intoGqlOutput` because we output object types with the resolvers.
            if (collection) {
                return {
                    gqlType: new graphql_1.GraphQLNonNull(createCollectionGqlType_1.default(buildToken, collection)),
                    intoGqlOutput: function (value) { return value; },
                };
            }
            return {
                gqlType: new graphql_1.GraphQLNonNull(new graphql_1.GraphQLObjectType({
                    name: utils_1.formatName.type(type.name),
                    description: type.description,
                    fields: utils_1.buildObject(
                    // Add all of the fields from the interface object type.
                    Array.from(type.fields).map(function (_a) {
                        var fieldName = _a[0], field = _a[1];
                        var _b = getGqlOutputType(buildToken, field.type), gqlType = _b.gqlType, intoGqlOutput = _b.intoGqlOutput;
                        return {
                            key: utils_1.formatName.field(fieldName),
                            value: {
                                description: field.description,
                                type: gqlType,
                                externalFieldName: field.externalFieldName,
                                resolve: function (value) { return intoGqlOutput(field.getValue(value)); },
                            },
                        };
                    }), 
                    // Add extra fields that may exist in our hooks.
                    buildToken._hooks.objectTypeFieldEntries
                        ? buildToken._hooks.objectTypeFieldEntries(type, buildToken)
                        : []),
                })),
                intoGqlOutput: function (value) { return value; },
            };
        },
        // For scalar types we will create a new non-null GraphQL scalar type. For
        // some basic primitive types we have special cases to use the native
        // GraphQL types.
        //
        // We don’t coerce these types because `GraphQLScalarType#serialize` will
        // do that job for us.
        scalar: function (type) {
            // If the type is similar to a GraphQL type, then we want to use a
            // special case to return some predefined GraphQL types. Also make sure
            // to specify all these types are non-nulls.
            switch (type) {
                case interface_1.booleanType: return { gqlType: new graphql_1.GraphQLNonNull(graphql_1.GraphQLBoolean), intoGqlOutput: function (value) { return value; } };
                case interface_1.integerType: return { gqlType: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt), intoGqlOutput: function (value) { return value; } };
                case interface_1.floatType: return { gqlType: new graphql_1.GraphQLNonNull(graphql_1.GraphQLFloat), intoGqlOutput: function (value) { return value; } };
                case interface_1.stringType: return { gqlType: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString), intoGqlOutput: function (value) { return value; } };
                case interface_1.jsonType: return { gqlType: new graphql_1.GraphQLNonNull(createJsonGqlType(buildToken)), intoGqlOutput: function (value) { return value; } };
                default: { }
            }
            return {
                gqlType: new graphql_1.GraphQLNonNull(new graphql_1.GraphQLScalarType({
                    name: utils_1.formatName.type(type.name),
                    description: type.description,
                    serialize: function (value) { return type.intoOutput(value); },
                    parseValue: function (value) { return type.fromInput(value); },
                    parseLiteral: function (ast) { return type.fromInput(utils_1.parseGqlLiteralToValue(ast)); },
                })),
                intoGqlOutput: function (value) { return value; },
            };
        },
    });
};
// The actual memoized function. It may not have exactly correct types and we’d
// also like to add special cases.
var _getGqlOutputType = utils_1.memoize2(createGqlOutputType);
/**
 * Gets a GraphQL output type using a build token and an interface type. This
 * function will return the same output if called multiple times.
 *
 * Returns two things needed for building outputs in GraphQL. A GraphQL output
 * type, and a function which will coerce an internal type system value into a
 * GraphQL value.
 *
 * Some types will be the same as those returned by `getGqlInputType` depending
 * on your type.
 */
function getGqlOutputType(buildToken, type) {
    // If we have an output type override for this type, let us return that
    // before we call our actual type function. We will automatically define the
    // coercer as an identity function.
    if (buildToken._typeOverrides) {
        var typeOverride = buildToken._typeOverrides.get(type);
        if (typeOverride && typeOverride.output)
            return { gqlType: typeOverride.output, intoGqlOutput: function (value) { return value; } };
    }
    return _getGqlOutputType(buildToken, type);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getGqlOutputType;
/**
 * The JSON type for our API. If the user set the `dynamicJSON` option to true,
 * arbitrary JSON input and output will be enabled.
 *
 * @private
 */
function createJsonGqlType(buildToken) {
    return (buildToken.options.dynamicJson ? (new graphql_1.GraphQLScalarType({
        name: 'Json',
        description: interface_1.jsonType.description,
        serialize: function (value) { return value; },
        parseValue: function (value) { return value; },
        parseLiteral: function (ast) { return parseAstLiteralIntoValue(ast); },
    })) : (new graphql_1.GraphQLScalarType({
        name: 'Json',
        description: interface_1.jsonType.description,
        serialize: function (value) { return JSON.stringify(value); },
        parseValue: function (value) { return typeof value === 'string' ? JSON.parse(value) : null; },
        parseLiteral: function (ast) { return (ast.kind === 'StringValue' ? JSON.parse(ast.value) : null); },
    })));
}
/**
 * Parses a GraphQL AST literal into a JavaScript value.
 *
 * @private
 */
function parseAstLiteralIntoValue(ast) {
    switch (ast.kind) {
        case 'StringValue':
        case 'BooleanValue':
            return ast.value;
        case 'IntValue':
        case 'FloatValue':
            return parseFloat(ast.value);
        case 'ObjectValue': {
            return ast.fields.reduce(function (object, field) {
                object[field.name.value] = parseAstLiteralIntoValue(field.value);
                return object;
            }, {});
        }
        case 'ListValue':
            return ast.values.map(parseAstLiteralIntoValue);
        default:
            return null;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0R3FsT3V0cHV0VHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9ncmFwaHFsL3NjaGVtYS90eXBlL2dldEdxbE91dHB1dFR5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLG1DQWNnQjtBQUVoQixnREFjMkI7QUFFM0IscUNBQXVGO0FBRXZGLGlGQUEyRTtBQUMzRSwrQ0FBeUM7QUFjekM7Ozs7R0FJRztBQUNILElBQU0sbUJBQW1CLEdBQUcsVUFBUyxVQUFzQixFQUFFLEtBQW1CO0lBQzlFLDBFQUEwRTtJQUMxRSxnQ0FBZ0M7SUFDaEMsT0FBQSxzQkFBVSxDQUFpQyxLQUFLLEVBQUU7UUFDaEQsdURBQXVEO1FBQ3ZELE9BQU8sRUFBRSxVQUFTLElBQXlCLElBQUssT0FBQSxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUEzQyxDQUEyQztRQUUzRix3RUFBd0U7UUFDeEUsa0VBQWtFO1FBQ2xFLDBFQUEwRTtRQUMxRSxzQkFBc0I7UUFDdEIsRUFBRTtRQUNGLHlFQUF5RTtRQUN6RSx5RUFBeUU7UUFDekUscUNBQXFDO1FBQ3JDLFFBQVEsRUFBRSxVQUFnQixJQUFpQztZQUNuRCxJQUFBLG1EQUFpSCxFQUEvRywyQkFBdUIsRUFBRSx1Q0FBbUMsQ0FBbUQ7WUFDdkgsTUFBTSxDQUFDO2dCQUNMLE9BQU8sRUFBRSx5QkFBa0IsQ0FBQyxjQUFjLENBQUM7Z0JBQzNDLGFBQWEsRUFBRSxVQUFBLEtBQUs7b0JBQ2xCLE9BQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7MEJBQ2pCLG9CQUFvQixDQUFDLEtBQUssQ0FBQzswQkFDM0IsSUFBSTtnQkFGUixDQUVRO2FBQ1gsQ0FBQTtRQUNILENBQUM7UUFFRCwyRUFBMkU7UUFDM0Usa0RBQWtEO1FBQ2xELEVBQUU7UUFDRix1RUFBdUU7UUFDdkUsc0NBQXNDO1FBQ3RDLElBQUksRUFBRSxVQUFZLElBQWlDO1lB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