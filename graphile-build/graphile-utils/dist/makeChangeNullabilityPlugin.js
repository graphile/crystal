"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeChangeNullabilityPlugin = makeChangeNullabilityPlugin;
const node_util_1 = require("node:util");
let counter = 0;
function doIt(inType, rawSpec, graphql, location, originalSpec = rawSpec) {
    const spec = rawSpec === true ? "" : rawSpec === false ? "!" : rawSpec;
    if (typeof spec !== "string") {
        throw new Error(`Invalid spec for '${location}': '${(0, node_util_1.inspect)(originalSpec)}'`);
    }
    const shouldBeNonNull = spec.endsWith("!");
    const isNonNull = graphql.isNonNullType(inType);
    const nullableType = isNonNull ? inType.ofType : inType;
    const specSansBang = shouldBeNonNull
        ? spec.substring(0, spec.length - 1)
        : spec;
    if (specSansBang.startsWith("[")) {
        if (!specSansBang.endsWith("]")) {
            throw new Error(`Invalid syntax in spec for '${location}': '${(0, node_util_1.inspect)(originalSpec)}'`);
        }
        const rest = specSansBang.substring(1, specSansBang.length - 1);
        if (!graphql.isListType(nullableType)) {
            throw new Error(`Spec for '${location}' anticipated a list where there wasn't one: '${(0, node_util_1.inspect)(originalSpec)}'`);
        }
        const listInnerType = nullableType.ofType;
        const innerType = doIt(listInnerType, rest, graphql, location, originalSpec);
        const newListType = innerType === listInnerType
            ? nullableType
            : new graphql.GraphQLList(innerType);
        if (newListType === nullableType && isNonNull === shouldBeNonNull) {
            return inType;
        }
        else if (shouldBeNonNull) {
            return new graphql.GraphQLNonNull(newListType);
        }
        else {
            return newListType;
        }
    }
    else {
        if (specSansBang.length > 0) {
            throw new Error(`Invalid syntax in spec for '${location}'; expected nothing left, but found '${specSansBang}': '${(0, node_util_1.inspect)(originalSpec)}'`);
        }
        if (shouldBeNonNull && isNonNull) {
            return inType;
        }
        else if (shouldBeNonNull) {
            return new graphql.GraphQLNonNull(nullableType);
        }
        else {
            return nullableType;
        }
    }
    return inType;
}
function makeChangeNullabilityPlugin(rules) {
    const expectedMatches = Object.entries(rules).flatMap(([typeName, typeRules]) => Object.keys(typeRules).map((fieldName) => `${typeName}.${fieldName}`));
    let pendingMatches = new Set();
    function objectOrInterfaceFieldCallback(field, build, context) {
        const { Self, scope: { fieldName }, } = context;
        const typeRules = rules[Self.name];
        if (!typeRules) {
            return field;
        }
        const rawRule = typeRules[fieldName];
        if (rawRule == null) {
            return field;
        }
        const rule = typeof rawRule !== "object" ? { type: rawRule } : rawRule;
        pendingMatches.delete(`${Self.name}.${fieldName}`);
        if (rule.type) {
            field.type = doIt(field.type, rule.type, build.graphql, `${Self.name}.${fieldName}`);
        }
        return field;
    }
    function objectOrInterfaceArgsArgCallback(arg, build, context) {
        const { Self, scope: { fieldName, argName }, } = context;
        const typeRules = rules[Self.name];
        if (!typeRules) {
            return arg;
        }
        const rawRule = typeRules[fieldName];
        if (rawRule == null) {
            return arg;
        }
        const rule = typeof rawRule !== "object" ? { type: rawRule } : rawRule;
        const spec = rule.args?.[argName];
        if (spec) {
            arg.type = doIt(arg.type, spec, build.graphql, `${Self.name}.${fieldName}(${argName}:)`);
        }
        return arg;
    }
    return {
        name: `ChangeNullabilityPlugin_${++counter}`,
        version: "0.0.0",
        schema: {
            hooks: {
                init(_) {
                    pendingMatches = new Set(expectedMatches);
                    return _;
                },
                GraphQLInputObjectType_fields_field(field, build, context) {
                    const { Self, scope: { fieldName }, } = context;
                    const typeRules = rules[Self.name];
                    if (!typeRules) {
                        return field;
                    }
                    const rawRule = typeRules[fieldName];
                    if (rawRule == null) {
                        return field;
                    }
                    const rule = typeof rawRule !== "object" ? { type: rawRule } : rawRule;
                    pendingMatches.delete(`${Self.name}.${fieldName}`);
                    if (rule.type) {
                        field.type = doIt(field.type, rule.type, build.graphql, `${Self.name}.${fieldName}`);
                    }
                    if (rule.args) {
                        throw new Error(`${Self.name} is an input type, field '${fieldName}' cannot have args`);
                    }
                    return field;
                },
                GraphQLInterfaceType_fields_field: objectOrInterfaceFieldCallback,
                GraphQLInterfaceType_fields_field_args_arg: objectOrInterfaceArgsArgCallback,
                GraphQLObjectType_fields_field: objectOrInterfaceFieldCallback,
                GraphQLObjectType_fields_field_args_arg: objectOrInterfaceArgsArgCallback,
                finalize(schema) {
                    if (pendingMatches.size > 0) {
                        throw new Error(`The following entries in your makeChangeNullabilityPlugin didn't match anything in your GraphQL schema; please check your spelling: ${[
                            ...pendingMatches,
                        ].join(", ")}`);
                    }
                    return schema;
                },
            },
        },
    };
}
//# sourceMappingURL=makeChangeNullabilityPlugin.js.map