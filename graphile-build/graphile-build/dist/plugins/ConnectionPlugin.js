"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionPlugin = void 0;
require("graphile-config");
const grafast_1 = require("grafast");
const utils_js_1 = require("../utils.js");
const version_js_1 = require("../version.js");
exports.ConnectionPlugin = {
    name: "ConnectionPlugin",
    description: "Plugin to make constructing cursor connections easier",
    version: version_js_1.version,
    schema: {
        hooks: {
            build(build) {
                const { nullableIf } = build;
                return build.extend(build, {
                    registerCursorConnection(options) {
                        const { typeName, scope = Object.create(null), nonNullNode = false, } = options;
                        if ((options.connectionTypeName || options.edgeTypeName) &&
                            !(options.connectionTypeName && options.edgeTypeName)) {
                            throw new Error(`You should either specify both connectionTypeName and edgeTypeName or neither (${JSON.stringify({
                                connectionTypeName: options.connectionTypeName,
                                edgeTypeName: options.edgeTypeName,
                            })}).`);
                        }
                        if (!build.getTypeMetaByName(typeName)) {
                            throw new Error(`There's no type registered called '${typeName}'; please register this type before attempting to create a connection for it - you might need to change your plugin's before/after`);
                        }
                        const connectionTypeName = options.connectionTypeName ??
                            build.inflection.connectionType(typeName);
                        if (build.getTypeMetaByName(connectionTypeName)) {
                            throw new Error(`A type named ${connectionTypeName} already exists`);
                        }
                        const edgeTypeName = options.edgeTypeName ?? build.inflection.edgeType(typeName);
                        if (build.getTypeMetaByName(edgeTypeName)) {
                            throw new Error(`A type named ${edgeTypeName} already exists.`);
                        }
                        build.registerObjectType(edgeTypeName, {
                            ...scope,
                            isConnectionEdgeType: true,
                        }, () => ({
                            assertStep: grafast_1.assertEdgeCapableStep,
                            description: build.wrapDescription(`A \`${typeName}\` edge in the connection.`, "type"),
                            fields: ({ fieldWithHooks }) => {
                                const Cursor = build.getOutputTypeByName(build.inflection.builtin("Cursor"));
                                const NodeType = build.getOutputTypeByName(typeName);
                                return {
                                    cursor: fieldWithHooks({
                                        fieldName: "cursor",
                                        isCursorField: true,
                                    }, () => ({
                                        description: build.wrapDescription("A cursor for use in pagination.", "field"),
                                        type: Cursor,
                                        plan: (0, utils_js_1.EXPORTABLE)(() => ($edge) => $edge.cursor(), []),
                                    })),
                                    node: fieldWithHooks({
                                        fieldName: "node",
                                    }, () => ({
                                        description: build.wrapDescription(`The \`${typeName}\` at the end of the edge.`, "field"),
                                        type: nullableIf(!nonNullNode, NodeType),
                                        plan: (0, utils_js_1.EXPORTABLE)(() => ($edge) => $edge.node(), []),
                                    })),
                                };
                            },
                        }), `ConnectionStep building edge type for ${typeName}`);
                        // Register connection
                        build.registerObjectType(connectionTypeName, {
                            ...scope,
                            isConnectionType: true,
                        }, () => {
                            return {
                                assertStep: grafast_1.ConnectionStep,
                                description: build.wrapDescription(`A connection to a list of \`${typeName}\` values.`, "type"),
                                fields: ({ fieldWithHooks }) => {
                                    const NodeType = build.getOutputTypeByName(typeName);
                                    const EdgeType = build.getOutputTypeByName(edgeTypeName);
                                    const PageInfo = build.getOutputTypeByName(build.inflection.builtin("PageInfo"));
                                    return {
                                        nodes: fieldWithHooks({
                                            fieldName: "nodes",
                                        }, () => ({
                                            description: build.wrapDescription(`A list of \`${typeName}\` objects.`, "field"),
                                            type: new build.graphql.GraphQLNonNull(new build.graphql.GraphQLList(nullableIf(!nonNullNode, NodeType))),
                                        })),
                                        edges: fieldWithHooks({
                                            fieldName: "edges",
                                        }, () => ({
                                            description: build.wrapDescription(`A list of edges which contains the \`${typeName}\` and cursor to aid in pagination.`, "field"),
                                            type: nullableIf(false, new build.graphql.GraphQLList(nullableIf(!nonNullNode, EdgeType))),
                                        })),
                                        pageInfo: fieldWithHooks({
                                            fieldName: "pageInfo",
                                        }, () => ({
                                            description: build.wrapDescription("Information to aid in pagination.", "field"),
                                            type: new build.graphql.GraphQLNonNull(PageInfo),
                                        })),
                                    };
                                },
                            };
                        }, `ConnectionPlugin connection type for ${typeName}`);
                    },
                }, "ConnectionPlugin");
            },
            init: {
                callback: (_, build) => {
                    const { registerObjectType, inflection, graphql: { GraphQLNonNull, GraphQLBoolean }, } = build;
                    registerObjectType(inflection.builtin("PageInfo"), { isPageInfo: true }, () => ({
                        assertStep: grafast_1.assertPageInfoCapableStep,
                        description: build.wrapDescription("Information about pagination in a connection.", "type"),
                        fields: ({ fieldWithHooks }) => ({
                            hasNextPage: fieldWithHooks({
                                isPageInfoHasNextPageField: true,
                                fieldName: "hasNextPage",
                            }, () => ({
                                description: build.wrapDescription("When paginating forwards, are there more items?", "field"),
                                type: new GraphQLNonNull(GraphQLBoolean),
                                plan: (0, utils_js_1.EXPORTABLE)(() => function plan($pageInfo) {
                                    return $pageInfo.hasNextPage();
                                }, []),
                            })),
                            hasPreviousPage: fieldWithHooks({
                                isPageInfoHasPreviousPageField: true,
                                fieldName: "hasPreviousPage",
                            }, () => ({
                                description: build.wrapDescription("When paginating backwards, are there more items?", "field"),
                                type: new GraphQLNonNull(GraphQLBoolean),
                                plan: (0, utils_js_1.EXPORTABLE)(() => function plan($pageInfo) {
                                    return $pageInfo.hasPreviousPage();
                                }, []),
                            })),
                        }),
                    }), "graphile-build built-in (Cursor type)");
                    return _;
                },
                provides: ["Cursor"],
            },
        },
    },
};
//# sourceMappingURL=ConnectionPlugin.js.map