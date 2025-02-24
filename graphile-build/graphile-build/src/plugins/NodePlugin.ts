import "graphile-config";

import type {
  ExecutableStep,
  Maybe,
  NodeIdCodec,
  NodeIdHandler,
} from "grafast";
import { node } from "grafast";
import type { GraphQLObjectType } from "grafast/graphql";

import { EXPORTABLE } from "../utils.js";

declare global {
  namespace GraphileConfig {
    interface Plugins {
      NodePlugin: true;
    }
  }
  namespace GraphileBuild {
    interface Inflection {
      nodeIdFieldName(this: Inflection): string;
    }

    interface Build {
      [NODE_ID_CODECS]?: { [codecName: string]: NodeIdCodec };
      [NODE_ID_HANDLER_BY_TYPE_NAME]?: { [typeName: string]: NodeIdHandler };
      registerNodeIdCodec?(codec: NodeIdCodec): void;
      getNodeIdCodec?(codecName: string): NodeIdCodec;
      registerNodeIdHandler?(matcher: NodeIdHandler): void;
      getNodeIdHandler?(typeName: string): NodeIdHandler | undefined;
      getNodeTypeNames?(): string[];
      getNodeIdHandlerByTypeName?(): Readonly<Record<string, NodeIdHandler>>;
    }

    interface ScopeObjectFieldsField {
      isRootNodeField?: boolean;
    }
  }
}

/**
 * @internal
 */
export const NODE_ID_CODECS = Symbol("nodeIdCodecs");
/**
 * @internal
 */
export const NODE_ID_HANDLER_BY_TYPE_NAME = Symbol("nodeIdHandlerByTypeName");

function rawEncode(value: any): string | null {
  return typeof value === "string" ? value : null;
}
rawEncode.isSyncAndSafe = true; // Optimization
function rawDecode(value: string): any {
  return typeof value === "string" ? value : null;
}
rawDecode.isSyncAndSafe = true; // Optimization

export const NodePlugin: GraphileConfig.Plugin = {
  name: "NodePlugin",
  version: "1.0.0",
  description: `Adds the interfaces required to support the GraphQL Global Object Identification Specification`,

  inflection: {
    add: {
      nodeIdFieldName() {
        return "id";
      },
    },
  },

  schema: {
    hooks: {
      build(build) {
        const nodeIdCodecs: { [codecName: string]: NodeIdCodec } =
          Object.create(null);
        const nodeIdHandlerByTypeName: { [typeName: string]: NodeIdHandler } =
          Object.create(null);

        // Add the 'raw' encoder
        nodeIdCodecs.raw = {
          name: "raw",
          encode: rawEncode,
          decode: rawDecode,
        };

        return build.extend(
          build,
          {
            /** @internal */
            [NODE_ID_CODECS]: nodeIdCodecs,
            /** @internal */
            [NODE_ID_HANDLER_BY_TYPE_NAME]: nodeIdHandlerByTypeName,
            getNodeIdHandlerByTypeName() {
              return nodeIdHandlerByTypeName;
            },
            registerNodeIdCodec(codec) {
              const codecName = codec.name;
              if (nodeIdCodecs[codecName]) {
                throw new Error(
                  `Node ID codec '${codecName}' is already registered`,
                );
              }
              nodeIdCodecs[codecName] = codec;
            },
            getNodeIdCodec(codecName) {
              const codec = nodeIdCodecs[codecName];
              if (!codec) {
                throw new Error(`Could not find Node ID codec '${codecName}'`);
              }
              return codec;
            },
            registerNodeIdHandler(handler) {
              const { typeName } = handler;
              if (nodeIdHandlerByTypeName[typeName]) {
                throw new Error(
                  `Node ID handler for type '${typeName}' already registered`,
                );
              }
              const details = build.getTypeMetaByName(typeName);
              if (!details) {
                throw new Error(
                  `Attempted to register Node ID handler for type '${typeName}', but that type isn't registered (yet)`,
                );
              }
              if (details.Constructor !== build.graphql.GraphQLObjectType) {
                throw new Error(
                  `Attempted to register Node ID handler for type '${typeName}', but that isn't an object type! (constructor: ${details.Constructor.name})`,
                );
              }
              nodeIdHandlerByTypeName[typeName] = handler;
            },
            getNodeIdHandler(typeName) {
              return nodeIdHandlerByTypeName[typeName];
            },
            getNodeTypeNames() {
              return Object.keys(nodeIdHandlerByTypeName);
            },
          },
          "Adding helpers from NodePlugin",
        );
      },

      init(_, build) {
        const {
          graphql: { GraphQLNonNull, GraphQLID },
        } = build;
        const nodeTypeName = build.inflection.builtin("Node");
        const nodeIdFieldName = build.inflection.nodeIdFieldName();
        build.registerInterfaceType(
          nodeTypeName,
          {},
          () => ({
            description: build.wrapDescription(
              "An object with a globally unique `ID`.",
              "type",
            ),
            fields: {
              [nodeIdFieldName]: {
                description: build.wrapDescription(
                  "A globally unique identifier. Can be used in various places throughout the system to identify this single value.",
                  "field",
                ),
                type: new GraphQLNonNull(GraphQLID),
              },
            },
          }),
          "Node interface from NodePlugin",
        );
        return _;
      },

      // Add the 'node' field to the root Query type
      GraphQLObjectType_fields(fields, build, context) {
        const {
          scope: { isRootQuery },
          fieldWithHooks,
        } = context;
        if (!isRootQuery) {
          return fields;
        }
        const {
          getTypeByName,
          extend,
          graphql: { GraphQLNonNull, GraphQLID },
          inflection,
        } = build;
        const nodeIdHandlerByTypeName = build.getNodeIdHandlerByTypeName!();
        const nodeIdFieldName = build.inflection.nodeIdFieldName();
        const nodeType = getTypeByName(inflection.builtin("Node")) as
          | GraphQLObjectType
          | undefined;
        if (!nodeType) {
          return fields;
        }
        return extend(
          fields,
          {
            node: fieldWithHooks(
              {
                fieldName: "node",
                isRootNodeField: true,
              },
              () => ({
                description: build.wrapDescription(
                  "Fetches an object given its globally unique `ID`.",
                  "field",
                ),
                type: nodeType,
                args: {
                  [nodeIdFieldName]: {
                    description: build.wrapDescription(
                      "The globally unique `ID`.",
                      "arg",
                    ),
                    type: new GraphQLNonNull(GraphQLID),
                  },
                },
                plan: EXPORTABLE(
                  (node, nodeIdFieldName, nodeIdHandlerByTypeName) =>
                    function plan(_$root, args) {
                      return node(
                        nodeIdHandlerByTypeName!,
                        args.getRaw(nodeIdFieldName) as ExecutableStep<
                          Maybe<string>
                        >,
                      );
                    },
                  [node, nodeIdFieldName, nodeIdHandlerByTypeName],
                ),
              }),
            ),
          },
          `Adding Relay Global Object Identification support to the root Query via 'node' and '${nodeIdFieldName}' fields`,
        );
      },
    },
  },
};
