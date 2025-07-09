"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddNodeInterfaceToSuitableTypesPlugin = void 0;
require("graphile-config");
const grafast_1 = require("grafast");
const utils_js_1 = require("../utils.js");
const version_js_1 = require("../version.js");
const NodePlugin_js_1 = require("./NodePlugin.js");
exports.AddNodeInterfaceToSuitableTypesPlugin = {
    name: "AddNodeInterfaceToSuitableTypesPlugin",
    version: version_js_1.version,
    description: `Adds the 'Node' interface to all types that have registered a Node ID handler`,
    schema: {
        hooks: {
            GraphQLObjectType_interfaces(interfaces, build, context) {
                const { getTypeByName, inflection, [NodePlugin_js_1.NODE_ID_HANDLER_BY_TYPE_NAME]: nodeIdHandlerByTypeName, } = build;
                if (!nodeIdHandlerByTypeName) {
                    return interfaces;
                }
                const { Self } = context;
                const handler = nodeIdHandlerByTypeName[Self.name];
                if (handler == null) {
                    return interfaces;
                }
                const NodeInterfaceType = getTypeByName(inflection.builtin("Node"));
                if (!NodeInterfaceType) {
                    return interfaces;
                }
                return [...interfaces, NodeInterfaceType];
            },
            GraphQLObjectType_fields(fields, build, context) {
                const { getTypeByName, inflection, 
                // To get this in your own plugin, use
                // `const nodeIdHandlerByTypeName = build.getNodeIdHandlerByTypeName();` instead
                [NodePlugin_js_1.NODE_ID_HANDLER_BY_TYPE_NAME]: nodeIdHandlerByTypeName, [NodePlugin_js_1.NODE_ID_CODECS]: nodeIdCodecs, graphql: { GraphQLNonNull, GraphQLID }, } = build;
                if (!nodeIdHandlerByTypeName) {
                    return fields;
                }
                const { Self, scope: { isRootQuery }, } = context;
                const handler = nodeIdHandlerByTypeName[Self.name];
                if (handler == null) {
                    return fields;
                }
                const NodeInterfaceType = getTypeByName(inflection.builtin("Node"));
                if (!NodeInterfaceType) {
                    return fields;
                }
                return build.extend(fields, {
                    [build.inflection.nodeIdFieldName()]: {
                        description: isRootQuery
                            ? build.wrapDescription("The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`.", "field")
                            : build.wrapDescription("A globally unique identifier. Can be used in various places throughout the system to identify this single value.", "field"),
                        type: new GraphQLNonNull(GraphQLID),
                        plan: (0, utils_js_1.EXPORTABLE)((handler, lambda, nodeIdCodecs) => ($parent) => {
                            const specifier = handler.plan($parent);
                            return lambda(specifier, nodeIdCodecs[handler.codec.name].encode);
                        }, [handler, grafast_1.lambda, nodeIdCodecs]),
                    },
                }, `Adding id field to ${Self.name} type from AddNodeInterfaceToQueryPlugin`);
            },
            GraphQLInterfaceType_interfaces(interfaces, build, context) {
                const { getTypeByName, inflection } = build;
                const { scope: { supportsNodeInterface }, } = context;
                if (!supportsNodeInterface) {
                    return interfaces;
                }
                const NodeInterfaceType = getTypeByName(inflection.builtin("Node"));
                if (!NodeInterfaceType) {
                    return interfaces;
                }
                return [...interfaces, NodeInterfaceType];
            },
            GraphQLInterfaceType_fields(fields, build, context) {
                const { getTypeByName, inflection, graphql: { GraphQLNonNull, GraphQLID }, } = build;
                const { Self, scope: { supportsNodeInterface }, } = context;
                if (!supportsNodeInterface) {
                    return fields;
                }
                const NodeInterfaceType = getTypeByName(inflection.builtin("Node"));
                if (!NodeInterfaceType) {
                    return fields;
                }
                return build.extend(fields, {
                    [build.inflection.nodeIdFieldName()]: {
                        description: build.wrapDescription("A globally unique identifier. Can be used in various places throughout the system to identify this single value.", "field"),
                        type: new GraphQLNonNull(GraphQLID),
                    },
                }, `Adding id field to ${Self.name} interface type from AddNodeInterfaceToQueryPlugin`);
            },
        },
    },
};
//# sourceMappingURL=AddNodeInterfaceToSuitableTypesPlugin.js.map