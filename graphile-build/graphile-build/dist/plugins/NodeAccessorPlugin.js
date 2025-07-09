"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeAccessorPlugin = void 0;
require("graphile-config");
const grafast_1 = require("grafast");
const utils_js_1 = require("../utils.js");
const version_js_1 = require("../version.js");
exports.NodeAccessorPlugin = {
    name: "NodeAccessorPlugin",
    description: "Adds accessors for the various types registered with the Global Unique Object Identification ID (Node ID) system",
    version: version_js_1.version,
    inflection: {
        add: {
            nodeById(options, typeName) {
                return this.camelCase(typeName);
            },
        },
    },
    schema: {
        hooks: {
            build(build) {
                const nodeFetcherByTypeNameCache = new Map();
                return build.extend(build, {
                    specForHandler: (0, utils_js_1.EXPORTABLE)(() => function (handler) {
                        function spec(nodeId) {
                            // We only want to return the specifier if it matches
                            // this handler; otherwise return null.
                            if (nodeId == null)
                                return null;
                            try {
                                const specifier = handler.codec.decode(nodeId);
                                if (handler.match(specifier)) {
                                    return specifier;
                                }
                            }
                            catch {
                                // Ignore errors
                            }
                            return null;
                        }
                        spec.displayName = `specifier_${handler.typeName}_${handler.codec.name}`;
                        spec.isSyncAndSafe = true; // Optimization
                        return spec;
                    }, []),
                    nodeFetcherByTypeName(typeName) {
                        const existing = nodeFetcherByTypeNameCache.get(typeName);
                        if (existing)
                            return existing;
                        const finalBuild = build;
                        const { specForHandler } = finalBuild;
                        if (!specForHandler)
                            return null;
                        const handler = finalBuild.getNodeIdHandler?.(typeName);
                        if (!handler)
                            return null;
                        const fetcher = handler.deprecationReason
                            ? (0, utils_js_1.EXPORTABLE)((handler, lambda, specForHandler) => {
                                const fn = ($nodeId) => {
                                    const $decoded = lambda($nodeId, specForHandler(handler));
                                    return handler.get(handler.getSpec($decoded));
                                };
                                fn.deprecationReason = handler.deprecationReason;
                                return fn;
                            }, [handler, grafast_1.lambda, specForHandler])
                            : (0, utils_js_1.EXPORTABLE)((handler, lambda, specForHandler) => ($nodeId) => {
                                const $decoded = lambda($nodeId, specForHandler(handler));
                                return handler.get(handler.getSpec($decoded));
                            }, [handler, grafast_1.lambda, specForHandler]);
                        (0, utils_js_1.exportNameHint)(fetcher, `nodeFetcher_${typeName}`);
                        nodeFetcherByTypeNameCache.set(typeName, fetcher);
                        return fetcher;
                    },
                }, "Adding node accessor helpers");
            },
            GraphQLObjectType_fields(fields, build, context) {
                if (!build.getNodeTypeNames) {
                    return fields;
                }
                const { graphql: { GraphQLNonNull, GraphQLID }, } = build;
                const { scope: { isRootQuery }, } = context;
                if (!isRootQuery) {
                    return fields;
                }
                if (!build.nodeFetcherByTypeName) {
                    return fields;
                }
                const typeNames = build.getNodeTypeNames();
                const nodeIdFieldName = build.inflection.nodeIdFieldName();
                return typeNames.reduce((memo, typeName) => {
                    // Don't add a field for 'Query'
                    if (typeName === build.inflection.builtin("Query")) {
                        return memo;
                    }
                    const fetcher = build.nodeFetcherByTypeName(typeName);
                    if (!fetcher) {
                        return memo;
                    }
                    return build.extend(memo, {
                        [build.inflection.nodeById(typeName)]: {
                            args: {
                                [nodeIdFieldName]: {
                                    description: `The globally unique \`ID\` to be used in selecting a single \`${typeName}\`.`,
                                    type: new GraphQLNonNull(GraphQLID),
                                },
                            },
                            type: build.getOutputTypeByName(typeName),
                            description: `Reads a single \`${typeName}\` using its globally unique \`ID\`.`,
                            deprecationReason: fetcher.deprecationReason,
                            plan: (0, utils_js_1.EXPORTABLE)((fetcher, nodeIdFieldName) => function plan(_$parent, args) {
                                const $nodeId = args.getRaw(nodeIdFieldName);
                                return fetcher($nodeId);
                            }, [fetcher, nodeIdFieldName]),
                        },
                    }, `Adding ${typeName} by NodeId field`);
                }, fields);
            },
        },
    },
};
//# sourceMappingURL=NodeAccessorPlugin.js.map