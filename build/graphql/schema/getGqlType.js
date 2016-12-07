"use strict";
const graphql_1 = require('graphql');
const interface_1 = require('../../interface');
const utils_1 = require('../utils');
const getCollectionGqlType_1 = require('./collection/getCollectionGqlType');
const transformGqlInputValue_1 = require('./transformGqlInputValue');
// TODO: doc
const cache = new WeakMap();
function getGqlType(buildToken, type, input) {
    const { _typeOverrides } = buildToken;
    // If this type has an override, let us try to use it. If we want an input
    // type, and there is an input type override, use it. If we want an output
    // type and there is an output type override, use it.
    if (_typeOverrides.has(type)) {
        const typeOverride = _typeOverrides.get(type);
        if (input && typeOverride.input)
            return typeOverride.input;
        if (!input && typeOverride.output)
            return typeOverride.output;
    }
    if (!cache.get(buildToken))
        cache.set(buildToken, { inputCache: new WeakMap(), outputCache: new WeakMap() });
    const { inputCache, outputCache } = cache.get(buildToken);
    if (input === true && !inputCache.has(type)) {
        const gqlType = createGqlType(buildToken, type, true);
        if (graphql_1.isInputType(gqlType))
            inputCache.set(type, gqlType);
        if (graphql_1.isOutputType(gqlType))
            outputCache.set(type, gqlType);
    }
    if (input === false && !outputCache.has(type)) {
        const gqlType = createGqlType(buildToken, type, false);
        if (graphql_1.isInputType(gqlType))
            inputCache.set(type, gqlType);
        if (graphql_1.isOutputType(gqlType))
            outputCache.set(type, gqlType);
    }
    return input ? inputCache.get(type) : outputCache.get(type);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getGqlType;
/**
 * Parses a GraphQL AST literal into a JavaScript value.
 *
 * @private
 */
function parseAstLiteralIntoValue(ast) {
    switch (ast.kind) {
        case graphql_1.Kind.STRING:
        case graphql_1.Kind.BOOLEAN:
            return ast.value;
        case graphql_1.Kind.INT:
        case graphql_1.Kind.FLOAT:
            return parseFloat(ast.value);
        case graphql_1.Kind.OBJECT: {
            return ast.fields.reduce((object, field) => {
                object[field.name.value] = parseAstLiteralIntoValue(field.value);
                return object;
            }, {});
        }
        case graphql_1.Kind.LIST:
            return ast.values.map(parseAstLiteralIntoValue);
        default:
            return null;
    }
}
/**
 * The JSON type for our API. If the user set the `dynamicJSON` option to true,
 * arbitrary JSON input and output will be enabled.
 *
 * @private
 */
exports._getJsonGqlType = utils_1.memoize1((buildToken) => buildToken.options.dynamicJson
    ? (new graphql_1.GraphQLScalarType({
        name: 'Json',
        description: interface_1.jsonType.description,
        serialize: value => typeof value === 'string' ? JSON.parse(value) : null,
        parseValue: value => JSON.stringify(value),
        parseLiteral: ast => JSON.stringify(parseAstLiteralIntoValue(ast)),
    }))
    : (new graphql_1.GraphQLScalarType({
        name: 'Json',
        description: interface_1.jsonType.description,
        serialize: String,
        parseValue: String,
        parseLiteral: ast => (ast.kind === graphql_1.Kind.STRING ? ast.value : null),
    })));
/**
 * Creates a type. This method mainly wraps `createNullableType`
 * and additionally inverts the nullability of types.
 *
 * @private
 */
function createGqlType(buildToken, type, input) {
    // We want to ignore the nullability rules for `AliasType`. If the type we
    // are aliasing is nullable or non null then `AliasType` will automatically
    // pick that up.
    if (type instanceof interface_1.AliasType) {
        return _createGqlTypeAlias(
        // TODO: Remove the `input as any` when the Typescript bug is fixed.
        // tslint:disable-next-line no-any
        getGqlType(buildToken, type.baseType, input), utils_1.formatName.type(type.name), type.description);
    }
    if (type instanceof interface_1.NullableType)
        // TODO: Remove the `input as any` when the Typescript bug is fixed.
        // tslint:disable-next-line no-any
        return graphql_1.getNullableType(getGqlType(buildToken, type.nonNullType, input));
    return new graphql_1.GraphQLNonNull(createGqlNullableType(buildToken, type, input));
}
/**
 * Creates a nullable type. This method handles all other supported unnamed
 * types and then calls `createNamedType` to create any named
 * types.
 *
 * @private
 */
function createGqlNullableType(buildToken, type, input) {
    if (type instanceof interface_1.ListType)
        // TODO: Remove the `input as any` when the Typescript bug is fixed.
        // tslint:disable-next-line no-any
        return new graphql_1.GraphQLList(getGqlType(buildToken, type.itemType, input));
    if (!interface_1.isNamedType(type)) {
        throw new Error(`Cannot convert unnamed type of constructor '${type.constructor.name}' ` +
            'to a GraphQL type.');
    }
    return createGqlNamedType(buildToken, type, input);
}
/**
 * Creates a named type.
 *
 * @private
 */
function createGqlNamedType(buildToken, type, input) {
    if (type instanceof interface_1.EnumType) {
        return new graphql_1.GraphQLEnumType({
            name: utils_1.formatName.type(type.name),
            description: type.description,
            values: utils_1.buildObject(Array.from(type.variants).map(variant => [utils_1.formatName.enumValue(variant), {
                    value: variant,
                }])),
        });
    }
    if (type instanceof interface_1.ObjectType)
        return input ? createGqlInputObjectType(buildToken, type) : createGqlOutputObjectType(buildToken, type);
    // The primitive types are constants, so let’s just return their constant
    // GraphQL type.
    switch (type) {
        case interface_1.booleanType: return graphql_1.GraphQLBoolean;
        case interface_1.integerType: return graphql_1.GraphQLInt;
        case interface_1.floatType: return graphql_1.GraphQLFloat;
        case interface_1.stringType: return graphql_1.GraphQLString;
        case interface_1.jsonType: return exports._getJsonGqlType(buildToken);
        default: { }
    }
    throw new Error(`Cannot convert named type of constructor '${type.constructor.name}' ` +
        'to a GraphQL type.');
}
/**
 * Creates a basic output object type with none of the trimmings that a
 * collection object type may have.
 *
 * @private
 */
function createGqlOutputObjectType(buildToken, type) {
    const { inventory } = buildToken;
    const collection = inventory.getCollections().find(c => c.type === type);
    // If there is a collection which uses this type, we should use the
    // collection’s type and not create our own.
    if (collection)
        return getCollectionGqlType_1.default(buildToken, collection);
    return new graphql_1.GraphQLObjectType({
        name: utils_1.formatName.type(type.name),
        description: type.description,
        fields: () => utils_1.buildObject(Array.from(type.fields).map(([fieldName, field]) => [utils_1.formatName.field(fieldName), {
                description: field.description,
                type: getGqlType(buildToken, field.type, false),
                resolve: object => object.get(fieldName),
            }]), 
        // Add extra fields that may exist in our hooks.
        buildToken._hooks && buildToken._hooks.objectTypeFieldEntries
            ? buildToken._hooks.objectTypeFieldEntries(type, buildToken)
            : []),
    });
}
/**
 * Creates an input object type.
 *
 * @private
 */
function createGqlInputObjectType(buildToken, type) {
    return new graphql_1.GraphQLInputObjectType({
        name: utils_1.formatName.type(`${type.name}-input`),
        description: type.description,
        fields: () => utils_1.buildObject(Array.from(type.fields).map(([fieldName, field]) => {
            let gqlType = getGqlType(buildToken, field.type, true);
            // If the field has a default and the type we got was non-null, let’s
            // get the nullable version.
            if (field.hasDefault && gqlType instanceof graphql_1.GraphQLNonNull)
                gqlType = gqlType.ofType;
            return [utils_1.formatName.field(fieldName), {
                    description: field.description,
                    type: gqlType,
                    [transformGqlInputValue_1.$$gqlInputObjectTypeValueKeyName]: fieldName,
                }];
        })),
    });
}
/**
 * “Clones” a GraphQL type and assigns a new name/description. Effectively
 * aliasing the type. If the type we are cloning is *not* a named type
 * (e.g. `GraphQLNonNull` and `GraphQLList`) we rename the named type “inside”
 * the unnamed type.
 *
 * @private
 */
function _createGqlTypeAlias(gqlType, name, description) {
    if (gqlType instanceof graphql_1.GraphQLNonNull)
        return new graphql_1.GraphQLNonNull(_createGqlTypeAlias(gqlType.ofType, name, description));
    if (gqlType instanceof graphql_1.GraphQLList)
        return new graphql_1.GraphQLList(_createGqlTypeAlias(gqlType.ofType, name, description));
    // Use prototypes to inherit all of the methods from the type we are
    // aliasing, then set the `name` and `description` properties to the aliased
    // properties.
    return Object.assign(Object.create(gqlType), { name, description });
}
exports._createGqlTypeAlias = _createGqlTypeAlias;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0R3FsVHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ncmFwaHFsL3NjaGVtYS9nZXRHcWxUeXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwwQkF3Qk8sU0FFUCxDQUFDLENBRmU7QUFFaEIsNEJBY08saUJBRVAsQ0FBQyxDQUZ1QjtBQUV4Qix3QkFBa0QsVUFDbEQsQ0FBQyxDQUQyRDtBQUM1RCx1Q0FBaUMsbUNBQ2pDLENBQUMsQ0FEbUU7QUFDcEUseUNBQWlELDBCQUNqRCxDQUFDLENBRDBFO0FBRzNFLFlBQVk7QUFDWixNQUFNLEtBQUssR0FBRyxJQUFJLE9BQU8sRUFHckIsQ0FBQTtBQVFKLG9CQUFxQixVQUFzQixFQUFFLElBQWlCLEVBQUUsS0FBYztJQUM1RSxNQUFNLEVBQUUsY0FBYyxFQUFFLEdBQUcsVUFBVSxDQUFBO0lBRXJDLDBFQUEwRTtJQUMxRSwwRUFBMEU7SUFDMUUscURBQXFEO0lBQ3JELEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdCLE1BQU0sWUFBWSxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFFLENBQUE7UUFDOUMsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLFlBQVksQ0FBQyxLQUFLLENBQUM7WUFBQyxNQUFNLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQTtRQUMxRCxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxZQUFZLENBQUMsTUFBTSxDQUFDO1lBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUE7SUFDL0QsQ0FBQztJQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN6QixLQUFLLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxFQUFFLFVBQVUsRUFBRSxJQUFJLE9BQU8sRUFBRSxFQUFFLFdBQVcsRUFB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