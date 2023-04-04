import "graphile-config";

import type {
  ExecutableStep,
  FieldArgs,
  NodeIdCodec,
  NodeIdHandler,
} from "grafast";
import { lambda } from "grafast";
import { EXPORTABLE } from "graphile-export";

import { version } from "../version.js";

declare global {
  namespace GraphileBuild {
    interface Inflection {
      nodeById(this: Inflection, typeName: string): string;
    }
    interface ScopeObjectFieldsField {
      isPgNodeQuery?: boolean;
    }
  }
}

const specForHandler = (handler: NodeIdHandler, codec: NodeIdCodec) => {
  function spec(nodeId: string) {
    // We only want to return the specifier if it matches
    // this handler; otherwise return null.
    try {
      const specifier = codec.decode(nodeId);
      if (handler.match(specifier)) {
        return specifier;
      }
    } catch {
      // Ignore errors
    }
    return null;
  }
  spec.displayName = `specifier_${handler.typeName}_${handler.codecName}`;
  spec.isSyncAndSafe = true; // Optimization
  return spec;
};

export const NodeAccessorPlugin: GraphileConfig.Plugin = {
  name: "NodeAccessorPlugin",
  description:
    "Adds accessors for the various types registered with the Global Unique Object Identification ID (Node ID) system",
  version: version,

  inflection: {
    add: {
      nodeById(options, typeName) {
        return this.camelCase(typeName);
      },
    },
  },

  schema: {
    hooks: {
      GraphQLObjectType_fields(fields, build, context) {
        if (!build.getNodeTypeNames) {
          return fields;
        }
        const {
          graphql: { GraphQLNonNull, GraphQLID },
        } = build;
        const {
          scope: { isRootQuery },
        } = context;
        if (!isRootQuery) {
          return fields;
        }

        const typeNames = build.getNodeTypeNames();
        const nodeIdFieldName = build.inflection.nodeIdFieldName();

        return typeNames.reduce((memo, typeName) => {
          // Don't add a field for 'Query'
          if (typeName === build.inflection.builtin("Query")) {
            return memo;
          }
          const handler = build.getNodeIdHandler(typeName)!;
          const codec = build.getNodeIdCodec(handler.codecName);
          return build.extend(
            memo,
            {
              [build.inflection.nodeById(typeName)]: {
                args: {
                  [nodeIdFieldName]: {
                    description: `The globally unique \`ID\` to be used in selecting a single \`${typeName}\`.`,
                    type: new GraphQLNonNull(GraphQLID),
                  },
                },
                type: build.getOutputTypeByName(typeName),
                description: `Reads a single \`${typeName}\` using its globally unique \`ID\`.`,
                deprecationReason: handler.deprecationReason,
                plan: EXPORTABLE(
                  (codec, handler, lambda, nodeIdFieldName, specForHandler) =>
                    function plan(_$parent: ExecutableStep, args: FieldArgs) {
                      const $decoded = lambda(
                        args.get(nodeIdFieldName),
                        specForHandler(handler, codec),
                      );
                      return handler.get(handler.getSpec($decoded));
                    },
                  [codec, handler, lambda, nodeIdFieldName, specForHandler],
                ),
              },
            },
            `Adding ${typeName} by NodeId field`,
          );
        }, fields);
      },
    },
  },
};
