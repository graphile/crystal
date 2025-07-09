"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgMutationCreatePlugin = void 0;
require("graphile-config");
const pg_1 = require("@dataplan/pg");
const grafast_1 = require("grafast");
const graphile_build_1 = require("graphile-build");
const utils_js_1 = require("../utils.js");
const version_js_1 = require("../version.js");
const isInsertable = (build, resource) => {
    if (resource.parameters)
        return false;
    if (!resource.codec.attributes)
        return false;
    if (resource.codec.polymorphism)
        return false;
    if (resource.codec.isAnonymous)
        return false;
    return build.behavior.pgResourceMatches(resource, "resource:insert") === true;
};
exports.PgMutationCreatePlugin = {
    name: "PgMutationCreatePlugin",
    description: "Adds 'create' mutation for supported table-like sources",
    version: version_js_1.version,
    after: ["smart-tags"],
    inflection: {
        add: {
            createField(options, resource) {
                return this.camelCase(`create-${this.tableType(resource.codec)}`);
            },
            createInputType(options, resource) {
                return this.upperCamelCase(`${this.createField(resource)}-input`);
            },
            createPayloadType(options, resource) {
                return this.upperCamelCase(`${this.createField(resource)}-payload`);
            },
            tableFieldName(options, resource) {
                return this.camelCase(`${this.tableType(resource.codec)}`);
            },
        },
    },
    schema: {
        behaviorRegistry: {
            add: {
                "insert:resource:select": {
                    description: "can select the row that was inserted (on the mutation payload)",
                    entities: ["pgResource"],
                },
                record: {
                    description: "record type used for insert",
                    entities: ["pgResource"],
                },
            },
        },
        entityBehavior: {
            pgResource: {
                inferred: {
                    provides: ["default"],
                    before: ["inferred", "override"],
                    callback(behavior, resource) {
                        const newBehavior = [
                            behavior,
                            "insert:resource:select",
                        ];
                        if (!resource.parameters &&
                            !!resource.codec.attributes &&
                            !resource.codec.polymorphism &&
                            !resource.codec.isAnonymous) {
                            newBehavior.unshift("insert");
                            newBehavior.unshift("record");
                        }
                        return newBehavior;
                    },
                },
            },
        },
        hooks: {
            init(_, build) {
                const { inflection, graphql: { GraphQLString, GraphQLNonNull, isInputType }, } = build;
                const insertableResources = Object.values(build.input.pgRegistry.pgResources).filter((resource) => isInsertable(build, resource));
                insertableResources.forEach((resource) => {
                    build.recoverable(null, () => {
                        const tableTypeName = inflection.tableType(resource.codec);
                        const inputTypeName = inflection.createInputType(resource);
                        const tableFieldName = inflection.tableFieldName(resource);
                        build.registerInputObjectType(inputTypeName, { isMutationInput: true }, () => ({
                            description: `All input for the create \`${tableTypeName}\` mutation.`,
                            fields: ({ fieldWithHooks }) => {
                                const TableInput = build.getGraphQLTypeByPgCodec(resource.codec, "input");
                                return {
                                    clientMutationId: {
                                        type: GraphQLString,
                                        apply: (0, graphile_build_1.EXPORTABLE)(() => function apply(qb, val) {
                                            qb.setMeta("clientMutationId", val);
                                        }, []),
                                    },
                                    ...(isInputType(TableInput)
                                        ? {
                                            [tableFieldName]: fieldWithHooks({
                                                fieldName: tableFieldName,
                                                fieldBehaviorScope: `insert:input:record`,
                                            }, () => ({
                                                description: build.wrapDescription(`The \`${tableTypeName}\` to be created by this mutation.`, "field"),
                                                type: new GraphQLNonNull(TableInput),
                                                apply: (0, graphile_build_1.EXPORTABLE)(() => function plan(qb, arg) {
                                                    if (arg != null) {
                                                        return qb.setBuilder();
                                                    }
                                                }, []),
                                            })),
                                        }
                                        : null),
                                };
                            },
                        }), `PgMutationCreatePlugin input for ${resource.name}`);
                        const payloadTypeName = inflection.createPayloadType(resource);
                        build.registerObjectType(payloadTypeName, {
                            isMutationPayload: true,
                            isPgCreatePayloadType: true,
                            pgTypeResource: resource,
                        }, () => ({
                            assertStep: grafast_1.assertExecutableStep,
                            description: `The output of our create \`${tableTypeName}\` mutation.`,
                            fields: ({ fieldWithHooks }) => {
                                const TableType = build.getGraphQLTypeByPgCodec(resource.codec, "output");
                                const fieldBehaviorScope = `insert:resource:select`;
                                return {
                                    clientMutationId: {
                                        type: GraphQLString,
                                        plan: (0, graphile_build_1.EXPORTABLE)(() => function plan($mutation) {
                                            const $insert = $mutation.getStepForKey("result");
                                            return $insert.getMeta("clientMutationId");
                                        }, []),
                                    },
                                    ...(TableType &&
                                        build.behavior.pgResourceMatches(resource, fieldBehaviorScope)
                                        ? {
                                            [tableFieldName]: fieldWithHooks({
                                                fieldName: tableFieldName,
                                                fieldBehaviorScope,
                                            }, {
                                                description: `The \`${tableTypeName}\` that was created by this mutation.`,
                                                type: TableType,
                                                plan: (0, graphile_build_1.EXPORTABLE)(() => function plan($object) {
                                                    return $object.get("result");
                                                }, []),
                                                deprecationReason: (0, utils_js_1.tagToString)(resource.extensions?.tags?.deprecated),
                                            }),
                                        }
                                        : null),
                                };
                            },
                        }), `PgMutationCreatePlugin payload for ${resource.name}`);
                    });
                });
                return _;
            },
            GraphQLObjectType_fields(fields, build, context) {
                const { inflection, graphql: { GraphQLNonNull }, } = build;
                const { scope: { isRootMutation }, fieldWithHooks, } = context;
                if (!isRootMutation) {
                    return fields;
                }
                const insertableSources = Object.values(build.input.pgRegistry.pgResources).filter((resource) => isInsertable(build, resource));
                return insertableSources.reduce((memo, resource) => {
                    return build.recoverable(memo, () => {
                        const createFieldName = inflection.createField(resource);
                        const payloadTypeName = inflection.createPayloadType(resource);
                        const payloadType = build.getOutputTypeByName(payloadTypeName);
                        const mutationInputType = build.getInputTypeByName(inflection.createInputType(resource));
                        return build.extend(memo, {
                            [createFieldName]: fieldWithHooks({
                                fieldName: createFieldName,
                                fieldBehaviorScope: "resource:insert",
                            }, {
                                args: {
                                    input: {
                                        type: new GraphQLNonNull(mutationInputType),
                                        applyPlan: (0, graphile_build_1.EXPORTABLE)(() => function plan(_, $object) {
                                            return $object;
                                        }, []),
                                    },
                                },
                                type: payloadType,
                                description: `Creates a single \`${inflection.tableType(resource.codec)}\`.`,
                                deprecationReason: (0, utils_js_1.tagToString)(resource.extensions?.tags?.deprecated),
                                plan: (0, graphile_build_1.EXPORTABLE)((object, pgInsertSingle, resource) => function plan(_, args) {
                                    const $insert = pgInsertSingle(resource, Object.create(null));
                                    args.apply($insert);
                                    const plan = object({
                                        result: $insert,
                                    });
                                    return plan;
                                }, [grafast_1.object, pg_1.pgInsertSingle, resource]),
                            }),
                        }, `Adding create mutation for ${resource.name}`);
                    });
                }, fields);
            },
        },
    },
};
//# sourceMappingURL=PgMutationCreatePlugin.js.map