import "graphile-config";

import type { ExecutableStep } from "grafast";
import { lambda } from "grafast";
import type { GraphQLInterfaceType } from "grafast/graphql";

import { EXPORTABLE } from "../utils.js";
import { NODE_ID_CODECS, NODE_ID_HANDLER_BY_TYPE_NAME } from "./NodePlugin.js";

export const AddNodeInterfaceToSuitableTypesPlugin: GraphileConfig.Plugin = {
  name: "AddNodeInterfaceToSuitableTypesPlugin",
  version: "1.0.0",
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

        const Type = getTypeByName(inflection.builtin("Node")) as
          | GraphQLInterfaceType
          | undefined;
        if (!Type) {
          return interfaces;
        }

        return [...interfaces, Type];
      },

      GraphQLObjectType_fields(fields, build, context) {
        const {
          getTypeByName,
          inflection,
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

        const Type = getTypeByName(inflection.builtin("Node")) as
          | GraphQLInterfaceType
          | undefined;
        if (!Type) {
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
                      nodeIdCodecs[handler.codec.name].encode,
                    );
                  },
                [handler, lambda, nodeIdCodecs],
              ),
            },
          },
          "Adding id field to Query type from AddNodeInterfaceToQueryPlugin",
        );
      },
    },
  },
};
