"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeNewWithHooks = makeNewWithHooks;
const grafast_1 = require("grafast");
const graphql_1 = require("grafast/graphql");
const util_1 = require("util");
const utils_js_1 = require("../utils.js");
const isString = (str) => typeof str === "string";
const knownTypes = [
    graphql_1.GraphQLSchema,
    graphql_1.GraphQLObjectType,
    graphql_1.GraphQLInterfaceType,
    graphql_1.GraphQLUnionType,
    graphql_1.GraphQLInputObjectType,
    graphql_1.GraphQLEnumType,
    graphql_1.GraphQLScalarType,
];
const knownTypeNames = knownTypes.map((k) => k.name);
const identity = (0, utils_js_1.EXPORTABLE)(() => function identity(value) {
    return value;
}, []);
/**
 * Returns a 'newWithHooks' function suitable for creating GraphQL types with
 * the graphile-build plugin system applied.
 */
function makeNewWithHooks({ builder }) {
    const newWithHooks = function newWithHooks(build, Type, inSpec, inScope) {
        if (!inScope) {
            // eslint-disable-next-line no-console
            console.warn(`No scope was provided to new ${Type.name}${"name" in inSpec ? `[name=${inSpec.name}]` : ``}, it's highly recommended that you add a scope so other hooks can easily reference your object - please check usage of 'newWithHooks'. To mute this message, just pass an empty object.`);
        }
        if (!Type) {
            throw new Error("No type specified!");
        }
        if (knownTypes.indexOf(Type) === -1 &&
            knownTypeNames.indexOf(Type.name) >= 0) {
            throw new Error(`GraphQL conflict for '${Type.name}' detected! Multiple versions of graphql exist in your node_` +
                /* yarn doctor */ `modules?`);
        }
        const Result = (() => {
            switch (Type) {
                case graphql_1.GraphQLSchema: {
                    const rawSpec = inSpec;
                    const scope = (inScope ||
                        Object.create(null));
                    const context = {
                        type: "GraphQLSchema",
                        scope,
                    };
                    const finalSpec = builder.applyHooks("GraphQLSchema", rawSpec, build, context);
                    finalSpec.types = builder.applyHooks("GraphQLSchema_types", [...(finalSpec.types ?? [])], build, {
                        ...context,
                        config: finalSpec,
                    });
                    const Self = new graphql_1.GraphQLSchema(finalSpec);
                    return Self;
                }
                case graphql_1.GraphQLObjectType: {
                    const rawObjectSpec = inSpec;
                    const scope = (inScope ||
                        Object.create(null));
                    const objectContext = {
                        type: "GraphQLObjectType",
                        scope,
                    };
                    const { name: baseName, interfaces: baseInterfaces, fields: baseFields, ...restOfConfig } = builder.applyHooks("GraphQLObjectType", rawObjectSpec, build, objectContext, `|${rawObjectSpec.name}`);
                    const typeName = build.assertValidName(baseName, `Attempted to define an object type with invalid name $0.`);
                    const finalSpec = {
                        name: typeName,
                        ...restOfConfig,
                        interfaces: () => {
                            const interfacesContext = {
                                ...objectContext,
                                Self,
                            };
                            let rawInterfaces = baseInterfaces || [];
                            if (typeof rawInterfaces === "function") {
                                rawInterfaces = rawInterfaces(interfacesContext);
                            }
                            return builder.applyHooks("GraphQLObjectType_interfaces", rawInterfaces, build, interfacesContext, `|${typeName}`);
                        },
                        fields: () => {
                            const processedFields = [];
                            const fieldWithHooks = (fieldScope, fieldSpec) => {
                                if (!isString(fieldScope.fieldName)) {
                                    throw new Error("It looks like you forgot to pass the fieldName to `fieldWithHooks`, we're sorry this is currently necessary.");
                                }
                                const fieldName = build.assertValidName(fieldScope.fieldName, `Object type '$1' attempted to define a field with invalid name $0.`, [typeName]);
                                build.extend(fieldScope, scope, "Adding the object type scope to the field's scope");
                                if (!fieldScope) {
                                    throw new Error("All calls to `fieldWithHooks` must specify a `fieldScope` " +
                                        "argument that gives additional context about the field so " +
                                        "that further plugins may more easily understand the field. " +
                                        "Keys within this object should contain the phrase 'field' " +
                                        "since they will be merged into the parent objects scope and " +
                                        "are not allowed to clash. If you really have no additional " +
                                        "information to give, please just pass `{}`.");
                                }
                                const fieldContext = {
                                    ...fieldsContext,
                                    scope: fieldScope,
                                };
                                let resolvedFieldSpec = typeof fieldSpec === "function"
                                    ? fieldSpec(fieldContext)
                                    : fieldSpec;
                                resolvedFieldSpec = builder.applyHooks("GraphQLObjectType_fields_field", resolvedFieldSpec, build, fieldContext, `|${typeName}.fields.${fieldName}`);
                                resolvedFieldSpec.args = resolvedFieldSpec.args ?? {};
                                const argsContext = { ...fieldContext };
                                const finalFieldSpec = {
                                    ...resolvedFieldSpec,
                                    args: builder.applyHooks("GraphQLObjectType_fields_field_args", resolvedFieldSpec.args, build, argsContext, `|${typeName}.fields.${fieldName}.args`),
                                };
                                for (const [rawArgName, argSpec] of Object.entries(finalFieldSpec.args)) {
                                    const argName = build.assertValidName(rawArgName, `Object type '$1' attempted to define an argument for field '$2' with invalid name $0.`, [typeName, fieldName]);
                                    const argContext = {
                                        ...argsContext,
                                        scope: {
                                            ...argsContext.scope,
                                            argName,
                                        },
                                    };
                                    finalFieldSpec.args[argName] = builder.applyHooks("GraphQLObjectType_fields_field_args_arg", argSpec, build, argContext, `|${typeName}.fields.${fieldName}.args.${argName}`);
                                }
                                processedFields.push(finalFieldSpec);
                                return finalFieldSpec;
                            };
                            const fieldsContext = {
                                ...objectContext,
                                Self: Self,
                                fieldWithHooks,
                            };
                            const rawFields = typeof baseFields === "function"
                                ? baseFields(fieldsContext)
                                : baseFields || {};
                            const fieldsSpec = builder.applyHooks("GraphQLObjectType_fields", build.extend(Object.create(null), rawFields, `Default field included in newWithHooks call for '${typeName}'. ${inScope.__origin || ""}`), build, fieldsContext, `|${typeName}`);
                            // Finally, check through all the fields that they've all been
                            // processed; any that have not we should do so now.
                            for (const [fieldName, fieldSpec] of Object.entries(fieldsSpec)) {
                                if (!fieldName) {
                                    throw new Error(`Attempted to add empty/falsy fieldName to GraphQLObjectType ${typeName}; ${(0, util_1.inspect)(fieldSpec)}`);
                                }
                                if (processedFields.indexOf(fieldSpec) < 0) {
                                    // We've not processed this yet; process it now!
                                    fieldsSpec[fieldName] = fieldsContext.fieldWithHooks(
                                    // We don't have any additional information
                                    { fieldName }, fieldSpec);
                                }
                            }
                            return fieldsSpec;
                        },
                    };
                    const Self = new graphql_1.GraphQLObjectType((0, grafast_1.objectSpec)(finalSpec));
                    return Self;
                }
                case graphql_1.GraphQLInterfaceType: {
                    const rawInterfaceSpec = inSpec;
                    const scope = (inScope ||
                        Object.create(null));
                    const interfaceContext = {
                        type: "GraphQLInterfaceType",
                        scope,
                    };
                    const { name: baseName, fields: baseFields, interfaces: baseInterfaces, ...restOfConfig } = builder.applyHooks("GraphQLInterfaceType", rawInterfaceSpec, build, interfaceContext, `|${rawInterfaceSpec.name}`);
                    const typeName = build.assertValidName(baseName, `Attempted to define an interface type with invalid name $0.`);
                    const finalSpec = {
                        name: typeName,
                        ...restOfConfig,
                        fields: () => {
                            const processedFields = [];
                            const fieldsContext = {
                                ...interfaceContext,
                                Self,
                                fieldWithHooks: (fieldScope, fieldSpec) => {
                                    if (!isString(fieldScope.fieldName)) {
                                        throw new Error("It looks like you forgot to pass the fieldName to `fieldWithHooks`, we're sorry this is currently necessary.");
                                    }
                                    const fieldName = build.assertValidName(fieldScope.fieldName, `Interface type '$1' attempted to define a field with invalid name $0.`, [typeName]);
                                    build.extend(fieldScope, scope, "Adding interface scope to interface's field scope");
                                    if (!fieldScope) {
                                        throw new Error("All calls to `fieldWithHooks` must specify a `fieldScope` " +
                                            "argument that gives additional context about the field so " +
                                            "that further plugins may more easily understand the field. " +
                                            "Keys within this object should contain the phrase 'field' " +
                                            "since they will be merged into the parent objects scope and " +
                                            "are not allowed to clash. If you really have no additional " +
                                            "information to give, please just pass `{}`.");
                                    }
                                    const fieldContext = {
                                        ...fieldsContext,
                                        scope: fieldScope,
                                    };
                                    let newSpec = typeof fieldSpec === "function"
                                        ? fieldSpec(fieldContext)
                                        : fieldSpec;
                                    newSpec = builder.applyHooks("GraphQLInterfaceType_fields_field", newSpec, build, fieldContext, `|${typeName}.fields.${fieldName}`);
                                    newSpec.args = newSpec.args || {};
                                    const argsContext = {
                                        ...fieldContext,
                                    };
                                    newSpec = {
                                        ...newSpec,
                                        args: builder.applyHooks("GraphQLInterfaceType_fields_field_args", newSpec.args ?? Object.create(null), build, argsContext, `|${typeName}.fields.${fieldName}.args`),
                                    };
                                    const finalFieldSpec = newSpec;
                                    for (const [rawArgName, argSpec] of Object.entries(finalFieldSpec.args)) {
                                        const argName = build.assertValidName(rawArgName, `Interface type '$1' attempted to define an argument for field '$2' with invalid name $0.`, [typeName, fieldName]);
                                        const argContext = {
                                            ...argsContext,
                                            scope: {
                                                ...argsContext.scope,
                                                argName,
                                            },
                                        };
                                        const finalArgSpec = builder.applyHooks("GraphQLInterfaceType_fields_field_args_arg", argSpec, build, argContext, `|${typeName}.fields.${fieldName}.args.${argName}`);
                                        finalFieldSpec.args[argName] = finalArgSpec;
                                    }
                                    processedFields.push(finalFieldSpec);
                                    return finalFieldSpec;
                                },
                            };
                            const rawFields = (typeof baseFields === "function"
                                ? baseFields(fieldsContext)
                                : baseFields) || {};
                            const fieldsSpec = builder.applyHooks("GraphQLInterfaceType_fields", build.extend(Object.create(null), rawFields, `Default field included in newWithHooks call for '${typeName}'. ${inScope.__origin || ""}`), build, fieldsContext, `|${typeName}`);
                            // Finally, check through all the fields that they've all been processed; any that have not we should do so now.
                            for (const [fieldName, fieldSpec] of Object.entries(fieldsSpec)) {
                                if (!fieldName) {
                                    throw new Error(`Attempted to add empty/falsy fieldName to GraphQLInterfaceType ${typeName}; ${(0, util_1.inspect)(fieldSpec)}`);
                                }
                                if (processedFields.indexOf(fieldSpec) < 0) {
                                    // We've not processed this yet; process it now!
                                    fieldsSpec[fieldName] = fieldsContext.fieldWithHooks(
                                    // We don't have any additional information
                                    { fieldName }, fieldSpec);
                                }
                            }
                            return fieldsSpec;
                        },
                        interfaces: () => {
                            const interfacesContext = {
                                ...interfaceContext,
                                Self,
                            };
                            const rawInterfaces = (typeof baseInterfaces === "function"
                                ? baseInterfaces(interfacesContext)
                                : baseInterfaces) || [];
                            const interfacesSpec = builder.applyHooks("GraphQLInterfaceType_interfaces", rawInterfaces, build, interfacesContext, `|${typeName}`);
                            return interfacesSpec;
                        },
                    };
                    const Self = new graphql_1.GraphQLInterfaceType(finalSpec);
                    return Self;
                }
                case graphql_1.GraphQLUnionType: {
                    const rawUnionSpec = inSpec;
                    const scope = (inScope ||
                        Object.create(null));
                    const commonContext = {
                        type: "GraphQLUnionType",
                        scope,
                    };
                    const { name: baseName, types: baseTypes, ...restOfConfig } = builder.applyHooks("GraphQLUnionType", rawUnionSpec, build, commonContext, `|${rawUnionSpec.name}`);
                    const typeName = build.assertValidName(baseName, `Attempted to define an union type with invalid name $0.`);
                    const finalSpec = {
                        name: typeName,
                        ...restOfConfig,
                        types: () => {
                            const typesContext = {
                                ...commonContext,
                                Self,
                            };
                            const rawTypes = (typeof baseTypes === "function"
                                ? baseTypes(typesContext)
                                : baseTypes) || [];
                            return builder.applyHooks("GraphQLUnionType_types", rawTypes, build, typesContext, `|${typeName}`);
                        },
                    };
                    const Self = new graphql_1.GraphQLUnionType(finalSpec);
                    return Self;
                }
                case graphql_1.GraphQLInputObjectType: {
                    const rawInputObjectSpec = inSpec;
                    const scope = (inScope ||
                        Object.create(null));
                    const inputObjectContext = {
                        type: "GraphQLInputObjectType",
                        scope,
                    };
                    const { name: baseName, fields: baseFields, ...restOfConfig } = builder.applyHooks("GraphQLInputObjectType", rawInputObjectSpec, build, inputObjectContext, `|${rawInputObjectSpec.name}`);
                    const typeName = build.assertValidName(baseName, `Attempted to define an input object type with invalid name $0.`);
                    const finalSpec = {
                        name: typeName,
                        ...restOfConfig,
                        fields: () => {
                            const processedFields = [];
                            const fieldWithHooks = (fieldScope, spec) => {
                                if (!isString(fieldScope.fieldName)) {
                                    throw new Error("It looks like you forgot to pass the fieldName to `fieldWithHooks`, we're sorry this is currently necessary.");
                                }
                                const fieldName = build.assertValidName(fieldScope.fieldName, `Input object type '$1' attempted to define a field with invalid name $0.`, [typeName]);
                                const finalFieldScope = build.extend(fieldScope, scope, `Extending scope for field '${fieldName}' within context for GraphQLInputObjectType '${typeName}'`);
                                const fieldContext = {
                                    ...fieldsContext,
                                    scope: finalFieldScope,
                                };
                                let newSpec = typeof spec === "function" ? spec(fieldContext) : spec;
                                newSpec = builder.applyHooks("GraphQLInputObjectType_fields_field", newSpec, build, fieldContext, `|${typeName}.fields.${fieldName}`);
                                const finalSpec = newSpec;
                                processedFields.push(finalSpec);
                                return finalSpec;
                            };
                            const fieldsContext = {
                                ...inputObjectContext,
                                Self,
                                fieldWithHooks,
                            };
                            const rawFields = (typeof baseFields === "function"
                                ? baseFields(fieldsContext)
                                : baseFields) || {};
                            const fieldsList = build.extend(Object.create(null), rawFields, `Default field included in newWithHooks call for '${typeName}'. ${inScope.__origin || ""}`);
                            const fieldsSpec = builder.applyHooks("GraphQLInputObjectType_fields", fieldsList, build, fieldsContext, `|${typeName}`);
                            // Finally, check through all the fields that they've all been processed; any that have not we should do so now.
                            for (const [fieldName, fieldSpec] of Object.entries(fieldsSpec)) {
                                if (!fieldName) {
                                    throw new Error(`Attempted to add empty/falsy fieldName to GraphQLInputObjectType ${typeName}; ${(0, util_1.inspect)(fieldSpec)}`);
                                }
                                if (processedFields.indexOf(fieldSpec) < 0) {
                                    // We've not processed this yet; process it now!
                                    fieldsSpec[fieldName] = fieldsContext.fieldWithHooks(
                                    // We don't have any additional information
                                    { fieldName }, fieldSpec);
                                }
                                fieldsSpec[fieldName] = (0, grafast_1.inputObjectFieldSpec)(fieldsSpec[fieldName], `${typeName}.${fieldName}`);
                            }
                            return fieldsSpec;
                        },
                    };
                    const Self = new graphql_1.GraphQLInputObjectType(finalSpec);
                    return Self;
                }
                case graphql_1.GraphQLScalarType: {
                    const rawScalarSpec = inSpec;
                    const scope = (inScope ||
                        Object.create(null));
                    const scalarContext = {
                        type: "GraphQLScalarType",
                        scope,
                    };
                    const { name: baseName, parseValue: baseParseValue, parseLiteral: baseParseLiteral, ...restOfConfig } = builder.applyHooks("GraphQLScalarType", rawScalarSpec, build, scalarContext, `|${rawScalarSpec.name}`);
                    const typeName = build.assertValidName(baseName, `Attempted to define a scalar type with invalid name $0.`);
                    const finalSpec = {
                        name: typeName,
                        ...restOfConfig,
                        parseValue: (() => {
                            return baseParseValue ?? identity;
                        })(),
                        // parseLiteral in GraphQL defaults to a dynamic function; that's not
                        // exportable... So we must handle this ourselves.
                        parseLiteral: (() => {
                            if (baseParseLiteral) {
                                return baseParseLiteral;
                            }
                            const parseValue = baseParseValue ?? identity;
                            return (0, utils_js_1.EXPORTABLE)((parseValue, valueFromASTUntyped) => ((node, variables) => {
                                return parseValue(valueFromASTUntyped(node, variables));
                            }), [parseValue, graphql_1.valueFromASTUntyped]);
                        })(),
                    };
                    const Self = new graphql_1.GraphQLScalarType(finalSpec);
                    return Self;
                }
                case graphql_1.GraphQLEnumType: {
                    const rawEnumConfig = inSpec;
                    const scope = (inScope ||
                        Object.create(null));
                    const enumContext = {
                        type: "GraphQLEnumType",
                        scope,
                    };
                    const { name: baseName, values: baseValues, ...restOfConfig } = builder.applyHooks("GraphQLEnumType", rawEnumConfig, build, enumContext, `|${rawEnumConfig.name}`);
                    const typeName = build.assertValidName(baseName, `Attempted to define an enum type with invalid name $0.`);
                    const valuesContext = {
                        ...enumContext,
                        Self: { name: typeName },
                    };
                    const finalSpec = {
                        name: typeName,
                        ...restOfConfig,
                        values: (() => {
                            const values = builder.applyHooks("GraphQLEnumType_values", baseValues, build, valuesContext, `|${typeName}`);
                            return Object.entries(values).reduce((memo, [rawValueName, value]) => {
                                const valueName = build.assertValidName(rawValueName, `Enum type '$1' attempted to define a value with invalid name $0.`, [typeName]);
                                const finalValueScope = build.extend({ valueName }, scope, `Extending scope for value '${valueName}' within context for GraphQLEnumType '${typeName}'`);
                                const valueContext = {
                                    ...valuesContext,
                                    scope: finalValueScope,
                                };
                                const newValue = builder.applyHooks("GraphQLEnumType_values_value", value, build, valueContext, `|${typeName}|${valueName}`);
                                // TODO: remove this code
                                const ext = newValue.extensions?.grafast;
                                if (ext && ext.applyPlan) {
                                    throw new Error(`Enum value ${typeName}.${valueName} has applyPlan set; this property no longer does anything and should be removed.`);
                                }
                                memo[valueName] = newValue;
                                return memo;
                            }, Object.create(null));
                        })(),
                    };
                    const Self = new graphql_1.GraphQLEnumType(finalSpec);
                    return Self;
                }
                default: {
                    throw new Error(`Cannot handle ${Type}`);
                }
            }
        })();
        if ((0, graphql_1.isNamedType)(Result)) {
            build.scopeByType.set(Result, inScope);
        }
        return Result;
    };
    return { newWithHooks };
}
//# sourceMappingURL=index.js.map