"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGrafastSchema = makeGrafastSchema;
const tslib_1 = require("tslib");
const graphql_1 = require("graphql");
const graphql = tslib_1.__importStar(require("graphql"));
const utils_js_1 = require("./utils.js");
const { buildASTSchema, isEnumType, isInputObjectType, isInterfaceType, isObjectType, isScalarType, isUnionType, parse, } = graphql;
/**
 * Takes a GraphQL schema definition in Interface Definition Language (IDL/SDL)
 * syntax and configs for the types in it and returns a GraphQL schema.
 */
function makeGrafastSchema(details) {
    const { typeDefs, plans, enableDeferStream = false } = details;
    const astSchema = buildASTSchema(parse(typeDefs), {
        enableDeferStream,
    });
    const schemaConfig = astSchema.toConfig();
    const typeByName = new Map();
    function mapType(type) {
        if (graphql.isNonNullType(type)) {
            return new graphql.GraphQLNonNull(mapType(type.ofType));
        }
        else if (graphql.isListType(type)) {
            return new graphql.GraphQLList(mapType(type.ofType));
        }
        else {
            const replacementType = typeByName.get(type.name);
            if (!replacementType) {
                throw new Error(`Failed to find replaced type '${type.name}'`);
            }
            return replacementType;
        }
    }
    for (const [typeName, _spec] of Object.entries(plans)) {
        const astTypeIndex = schemaConfig.types.findIndex((t) => t.name === typeName);
        const astType = schemaConfig.types[astTypeIndex];
        if (!astType) {
            console.warn(`'plans' specified configuration for type '${typeName}', but that type was not present in the schema`);
            continue;
        }
    }
    const BUILT_IN_TYPE_NAMES = ["String", "Int", "Float", "Boolean", "ID"];
    // Now mod the types
    const rawTypes = schemaConfig.types;
    schemaConfig.types = rawTypes.map((astType) => {
        const typeName = astType.name;
        const replacementType = (() => {
            if (typeName.startsWith("__") || BUILT_IN_TYPE_NAMES.includes(typeName)) {
                return astType;
            }
            if (isObjectType(astType)) {
                const rawConfig = astType.toConfig();
                const objectPlans = plans[astType.name];
                const rawFields = rawConfig.fields;
                const rawInterfaces = rawConfig.interfaces;
                const config = {
                    ...rawConfig,
                    extensions: {
                        ...rawConfig.extensions,
                    },
                };
                if (objectPlans) {
                    for (const [fieldName, rawFieldSpec] of Object.entries(objectPlans)) {
                        if (fieldName === "__assertStep") {
                            (0, utils_js_1.exportNameHint)(rawFieldSpec, `${typeName}_assertStep`);
                            config.extensions.grafast = { assertStep: rawFieldSpec };
                            continue;
                        }
                        else if (fieldName.startsWith("__")) {
                            throw new Error(`Unsupported field name '${fieldName}'; perhaps you meant '__assertStep'?`);
                        }
                        const fieldSpec = rawFieldSpec;
                        const field = rawFields[fieldName];
                        if (!field) {
                            console.warn(`'plans' specified configuration for object type '${typeName}' field '${fieldName}', but that field was not present in the type`);
                            continue;
                        }
                        if ("args" in fieldSpec &&
                            typeof fieldSpec.args === "object" &&
                            fieldSpec.args != null) {
                            for (const [argName, _argSpec] of Object.entries(fieldSpec.args)) {
                                const arg = field.args?.[argName];
                                if (!arg) {
                                    console.warn(`'plans' specified configuration for object type '${typeName}' field '${fieldName}' arg '${argName}', but that arg was not present on the field`);
                                    continue;
                                }
                            }
                        }
                    }
                }
                config.interfaces = function () {
                    return rawInterfaces.map((t) => mapType(t));
                };
                config.fields = function () {
                    const fields = Object.create(null);
                    for (const [fieldName, rawFieldSpec] of Object.entries(rawFields)) {
                        if (fieldName.startsWith("__")) {
                            continue;
                        }
                        const fieldSpec = objectPlans && Object.hasOwn(objectPlans, fieldName)
                            ? objectPlans[fieldName]
                            : undefined;
                        const fieldConfig = {
                            ...rawFieldSpec,
                            type: mapType(rawFieldSpec.type),
                        };
                        fields[fieldName] = fieldConfig;
                        if (fieldConfig.args) {
                            for (const [_argName, arg] of Object.entries(fieldConfig.args)) {
                                arg.type = mapType(arg.type);
                            }
                        }
                        if (fieldSpec) {
                            if (typeof fieldSpec === "function") {
                                (0, utils_js_1.exportNameHint)(fieldSpec, `${typeName}_${fieldName}_plan`);
                                // it's a plan
                                fieldConfig.extensions.grafast = {
                                    plan: fieldSpec,
                                };
                            }
                            else {
                                // it's a spec
                                const grafastExtensions = Object.create(null);
                                fieldConfig.extensions.grafast = grafastExtensions;
                                if (typeof fieldSpec.resolve === "function") {
                                    (0, utils_js_1.exportNameHint)(fieldSpec.resolve, `${typeName}_${fieldName}_resolve`);
                                    fieldConfig.resolve = fieldSpec.resolve;
                                }
                                if (typeof fieldSpec.subscribe === "function") {
                                    (0, utils_js_1.exportNameHint)(fieldSpec.subscribe, `${typeName}_${fieldName}_subscribe`);
                                    fieldConfig.subscribe = fieldSpec.subscribe;
                                }
                                if (typeof fieldSpec.plan === "function") {
                                    (0, utils_js_1.exportNameHint)(fieldSpec.plan, `${typeName}_${fieldName}_plan`);
                                    grafastExtensions.plan = fieldSpec.plan;
                                }
                                if (typeof fieldSpec.subscribePlan === "function") {
                                    (0, utils_js_1.exportNameHint)(fieldSpec.subscribePlan, `${typeName}_${fieldName}_subscribePlan`);
                                    grafastExtensions.subscribePlan = fieldSpec.subscribePlan;
                                }
                                if (fieldConfig.args) {
                                    for (const [argName, arg] of Object.entries(fieldConfig.args)) {
                                        const argSpec = fieldSpec.args?.[argName];
                                        if (typeof argSpec === "function") {
                                            const applyPlan = argSpec;
                                            (0, utils_js_1.exportNameHint)(applyPlan, `${typeName}_${fieldName}_${argName}_applyPlan`);
                                            Object.assign(arg.extensions, {
                                                grafast: { applyPlan },
                                            });
                                        }
                                        else if (typeof argSpec === "object" &&
                                            argSpec !== null) {
                                            const { extensions, applyPlan, applySubscribePlan } = argSpec;
                                            if (extensions) {
                                                Object.assign(arg.extensions, extensions);
                                            }
                                            if (applyPlan || applySubscribePlan) {
                                                (0, utils_js_1.exportNameHint)(applyPlan, `${typeName}_${fieldName}_${argName}_applyPlan`);
                                                (0, utils_js_1.exportNameHint)(applySubscribePlan, `${typeName}_${fieldName}_${argName}_applySubscribePlan`);
                                                Object.assign(arg.extensions, {
                                                    grafast: {
                                                        applyPlan,
                                                        applySubscribePlan,
                                                    },
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    return fields;
                };
                return new graphql.GraphQLObjectType(config);
            }
            else if (isInputObjectType(astType)) {
                const rawConfig = astType.toConfig();
                const config = {
                    ...rawConfig,
                    extensions: {
                        ...rawConfig.extensions,
                        grafast: {
                            ...rawConfig.extensions?.grafast,
                        },
                    },
                };
                const inputObjectPlans = plans[astType.name];
                if (inputObjectPlans) {
                    for (const [fieldName, fieldSpec] of Object.entries(inputObjectPlans)) {
                        if (fieldName === "__baked") {
                            config.extensions.grafast.baked =
                                fieldSpec;
                            continue;
                        }
                        if (config.extensions?.grafast?.baked) {
                            (0, utils_js_1.exportNameHint)(config.extensions.grafast.baked, `${typeName}__baked`);
                        }
                        const field = rawConfig.fields[fieldName];
                        if (!field) {
                            console.warn(`'plans' specified configuration for input object type '${typeName}' field '${fieldName}', but that field was not present in the type`);
                            continue;
                        }
                    }
                }
                const rawFields = rawConfig.fields;
                config.fields = function () {
                    const fields = Object.create(null);
                    for (const [fieldName, rawFieldConfig] of Object.entries(rawFields)) {
                        const fieldSpec = inputObjectPlans && Object.hasOwn(inputObjectPlans, fieldName)
                            ? inputObjectPlans[fieldName]
                            : undefined;
                        const fieldConfig = {
                            ...rawFieldConfig,
                            type: mapType(rawFieldConfig.type),
                        };
                        fields[fieldName] = fieldConfig;
                        if (fieldSpec) {
                            const grafastExtensions = Object.create(null);
                            fieldConfig.extensions.grafast = grafastExtensions;
                            if (typeof fieldSpec === "function") {
                                (0, utils_js_1.exportNameHint)(fieldSpec, `${typeName}_${fieldName}_apply`);
                                grafastExtensions.apply = fieldSpec;
                            }
                            else {
                                const { apply, extensions } = fieldSpec;
                                if (extensions) {
                                    Object.assign(fieldConfig.extensions, extensions);
                                }
                                if (apply) {
                                    (0, utils_js_1.exportNameHint)(fieldSpec.apply, `${typeName}_${fieldName}_apply`);
                                    Object.assign(grafastExtensions, { apply });
                                }
                            }
                        }
                    }
                    return fields;
                };
                return new graphql.GraphQLInputObjectType(config);
            }
            else if (isInterfaceType(astType)) {
                const rawConfig = astType.toConfig();
                const config = {
                    ...rawConfig,
                };
                const rawFields = rawConfig.fields;
                config.fields = function () {
                    const fields = Object.create(null);
                    for (const [fieldName, rawFieldSpec] of Object.entries(rawFields)) {
                        const fieldConfig = {
                            ...rawFieldSpec,
                            type: mapType(rawFieldSpec.type),
                        };
                        fields[fieldName] = fieldConfig;
                        if (fieldConfig.args) {
                            for (const [_argName, arg] of Object.entries(fieldConfig.args)) {
                                arg.type = mapType(arg.type);
                            }
                        }
                    }
                    return fields;
                };
                const rawInterfaces = rawConfig.interfaces;
                config.interfaces = function () {
                    return rawInterfaces.map((t) => mapType(t));
                };
                const polyPlans = plans[astType.name];
                if (polyPlans?.__resolveType) {
                    (0, utils_js_1.exportNameHint)(polyPlans.__resolveType, `${typeName}_resolveType`);
                    config.resolveType = polyPlans.__resolveType;
                }
                return new graphql.GraphQLInterfaceType(config);
            }
            else if (isUnionType(astType)) {
                const rawConfig = astType.toConfig();
                const config = {
                    ...rawConfig,
                };
                const rawTypes = rawConfig.types;
                config.types = function () {
                    return rawTypes.map((t) => mapType(t));
                };
                const polyPlans = plans[astType.name];
                if (polyPlans?.__resolveType) {
                    (0, utils_js_1.exportNameHint)(polyPlans.__resolveType, `${typeName}_resolveType`);
                    config.resolveType = polyPlans.__resolveType;
                }
                return new graphql.GraphQLUnionType(config);
            }
            else if (isScalarType(astType)) {
                const rawConfig = astType.toConfig();
                const config = {
                    ...rawConfig,
                    extensions: {
                        ...rawConfig.extensions,
                    },
                };
                const scalarPlans = plans[astType.name];
                if (typeof scalarPlans?.serialize === "function") {
                    (0, utils_js_1.exportNameHint)(scalarPlans.serialize, `${typeName}_serialize`);
                    config.serialize = scalarPlans.serialize;
                }
                if (typeof scalarPlans?.parseValue === "function") {
                    (0, utils_js_1.exportNameHint)(scalarPlans.parseValue, `${typeName}_parseValue`);
                    config.parseValue = scalarPlans.parseValue;
                }
                if (typeof scalarPlans?.parseLiteral === "function") {
                    (0, utils_js_1.exportNameHint)(scalarPlans.parseLiteral, `${typeName}_parseLiteral`);
                    config.parseLiteral = scalarPlans.parseLiteral;
                }
                if (typeof scalarPlans?.plan === "function") {
                    (0, utils_js_1.exportNameHint)(scalarPlans.plan, `${typeName}_plan`);
                    config.extensions.grafast = { plan: scalarPlans.plan };
                }
                return new graphql.GraphQLScalarType(config);
            }
            else if (isEnumType(astType)) {
                const rawConfig = astType.toConfig();
                const config = {
                    ...rawConfig,
                };
                const enumPlans = plans[astType.name];
                const enumValues = config.values;
                if (enumPlans) {
                    for (const [enumValueName, enumValueSpec] of Object.entries(enumPlans)) {
                        const enumValue = enumValues[enumValueName];
                        if (!enumValue) {
                            console.warn(`'plans' specified configuration for enum type '${typeName}' value '${enumValueName}', but that value was not present in the type`);
                            continue;
                        }
                        if (typeof enumValueSpec === "function") {
                            (0, utils_js_1.exportNameHint)(enumValueSpec, `${typeName}_${enumValueName}_apply`);
                            // It's a plan
                            if (!enumValue.extensions) {
                                enumValue.extensions = Object.create(null);
                            }
                            enumValue.extensions.grafast = {
                                apply: enumValueSpec,
                            };
                        }
                        else if (typeof enumValueSpec === "object" &&
                            enumValueSpec != null) {
                            // It's a full spec
                            if (enumValueSpec.extensions) {
                                (0, utils_js_1.exportNameHint)(enumValueSpec.extensions, `${typeName}_${enumValueName}_extensions`);
                                Object.assign(enumValue.extensions, enumValueSpec.extensions);
                            }
                            if (enumValueSpec.apply) {
                                (0, utils_js_1.exportNameHint)(enumValueSpec.apply, `${typeName}_${enumValueName}_apply`);
                                enumValue.extensions.grafast = {
                                    apply: enumValueSpec.apply,
                                };
                            }
                            if ("value" in enumValueSpec) {
                                enumValue.value = enumValueSpec.value;
                            }
                        }
                        else {
                            // It must be the value
                            enumValue.value = enumValueSpec;
                        }
                    }
                }
                return new graphql.GraphQLEnumType(config);
            }
            else {
                const never = astType;
                throw new Error(`Unhandled type ${never}`);
            }
        })();
        typeByName.set(typeName, replacementType);
        return replacementType;
    });
    if (schemaConfig.query) {
        schemaConfig.query = mapType(schemaConfig.query);
    }
    if (schemaConfig.mutation) {
        schemaConfig.mutation = mapType(schemaConfig.mutation);
    }
    if (schemaConfig.subscription) {
        schemaConfig.subscription = mapType(schemaConfig.subscription);
    }
    if (schemaConfig.directives) {
        for (const directiveConfig of schemaConfig.directives) {
            for (const argConfig of directiveConfig.args) {
                argConfig.type = mapType(argConfig.type);
            }
        }
    }
    const schema = new graphql_1.GraphQLSchema(schemaConfig);
    return schema;
}
//# sourceMappingURL=makeGrafastSchema.js.map