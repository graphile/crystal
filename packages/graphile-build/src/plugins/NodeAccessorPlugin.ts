import type {
  ExecutablePlan,
  NodeIdCodec,
  NodeIdHandler,
  TrackedArguments,
} from "dataplanner";
import { lambda } from "dataplanner";
import { EXPORTABLE } from "graphile-export";
import type { Plugin } from "graphile-plugin";

import { version } from "../index";

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

const specForHandler =
  (handler: NodeIdHandler, codec: NodeIdCodec) => (nodeId: string) => {
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
  };

export const NodeAccessorPlugin: Plugin = {
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
                    type: new GraphQLNonNull(GraphQLID),
                  },
                },
                type: build.getOutputTypeByName(typeName),
                plan: EXPORTABLE(
                  (codec, handler, lambda, nodeIdFieldName, specForHandler) =>
                    function plan(
                      _$parent: ExecutablePlan<any>,
                      args: TrackedArguments,
                    ) {
                      const $spec = lambda(
                        args[nodeIdFieldName],
                        specForHandler(handler, codec),
                      );
                      return handler.get($spec);
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
