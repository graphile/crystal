import "graphile-config";

import type { ExecutableStep } from "grafast";
import { lambda } from "grafast";
import type { GraphQLInterfaceType } from "grafast/graphql";

import { EXPORTABLE } from "../utils.js";
import { version } from "../version.js";
import { NODE_ID_CODECS, NODE_ID_HANDLER_BY_TYPE_NAME } from "./NodePlugin.js";

declare global {
  namespace GraphileConfig {
    interface Plugins {
      AddNodeInterfaceToSuitableTypesPlugin: true;
    }
  }
}

export const AddNodeInterfaceToSuitableTypesPlugin: GraphileConfig.Plugin = {
  name: "AddNodeInterfaceToSuitableTypesPlugin",
  version,
  description: `Adds the 'Node' interface to all types that have registered a Node ID handler`,

  schema: {
    hooks: {
      GraphQLObjectType_interfaces(interfaces, build, context) {
        const {
          getTypeByName,
          inflection,
          [NODE_ID_HANDLER_BY_TYPE_NAME]: nodeIdHandlerByTypeName,
        } = build;
        if (!nodeIdHandlerByTypeName) {
          return interfaces;
        }
        const { Self } = context;
        const handler = nodeIdHandlerByTypeName[Self.name];
        if (handler == null) {
          return interfaces;
        }

        const NodeInterfaceType = getTypeByName(inflection.builtin("Node")) as
          | GraphQLInterfaceType
          | undefined;
        if (!NodeInterfaceType) {
          return interfaces;
        }

        return [...interfaces, NodeInterfaceType];
      },

      GraphQLObjectType_fields(fields, build, context) {
        const {
          getTypeByName,
          inflection,

          // To get this in your own plugin, use
          // `const nodeIdHandlerByTypeName = build.getNodeIdHandlerByTypeName();` instead
          [NODE_ID_HANDLER_BY_TYPE_NAME]: nodeIdHandlerByTypeName,

          [NODE_ID_CODECS]: nodeIdCodecs,
          graphql: { GraphQLNonNull, GraphQLID },
        } = build;
        if (!nodeIdHandlerByTypeName) {
          return fields;
        }
        const {
          Self,
          scope: { isRootQuery },
        } = context;
        const handler = nodeIdHandlerByTypeName[Self.name];
        if (handler == null) {
          return fields;
        }

        const NodeInterfaceType = getTypeByName(inflection.builtin("Node")) as
          | GraphQLInterfaceType
          | undefined;
        if (!NodeInterfaceType) {
          return fields;
        }

        return build.extend(
          fields,
          {
            [build.inflection.nodeIdFieldName()]: {
              description: isRootQuery
                ? build.wrapDescription(
                    "The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`.",
                    "field",
                  )
                : build.wrapDescription(
                    "A globally unique identifier. Can be used in various places throughout the system to identify this single value.",
                    "field",
                  ),
              type: new GraphQLNonNull(GraphQLID),
              plan: EXPORTABLE(
                (handler, lambda, nodeIdCodecs) =>
                  ($parent: ExecutableStep) => {
                    const specifier = handler.plan($parent);
                    return lambda(
                      specifier,
                      nodeIdCodecs![handler.codec.name].encode,
                    );
                  },
                [handler, lambda, nodeIdCodecs],
              ),
            },
          },
          `Adding id field to ${Self.name} type from AddNodeInterfaceToQueryPlugin`,
        );
      },

      GraphQLInterfaceType_interfaces(interfaces, build, context) {
        const { getTypeByName, inflection } = build;
        const {
          scope: { supportsNodeInterface },
        } = context;
        if (!supportsNodeInterface) {
          return interfaces;
        }

        const NodeInterfaceType = getTypeByName(inflection.builtin("Node")) as
          | GraphQLInterfaceType
          | undefined;
        if (!NodeInterfaceType) {
          return interfaces;
        }

        return [...interfaces, NodeInterfaceType];
      },

      GraphQLInterfaceType_fields(fields, build, context) {
        const {
          getTypeByName,
          inflection,
          graphql: { GraphQLNonNull, GraphQLID },
        } = build;
        const {
          Self,
          scope: { supportsNodeInterface },
        } = context;
        if (!supportsNodeInterface) {
          return fields;
        }

        const NodeInterfaceType = getTypeByName(inflection.builtin("Node")) as
          | GraphQLInterfaceType
          | undefined;
        if (!NodeInterfaceType) {
          return fields;
        }

        return build.extend(
          fields,
          {
            [build.inflection.nodeIdFieldName()]: {
              description: build.wrapDescription(
                "A globally unique identifier. Can be used in various places throughout the system to identify this single value.",
                "field",
              ),
              type: new GraphQLNonNull(GraphQLID),
            },
          },
          `Adding id field to ${Self.name} interface type from AddNodeInterfaceToQueryPlugin`,
        );
      },
    },
  },
};
