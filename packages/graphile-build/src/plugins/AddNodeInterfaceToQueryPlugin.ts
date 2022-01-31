import { constant, node, NodePlan } from "graphile-crystal";
import { EXPORTABLE } from "graphile-exporter";
import type { Plugin } from "graphile-plugin";
import type { GraphQLInterfaceType } from "graphql";

import { isValidObjectType } from "../utils.js";

export const AddNodeInterfaceToQueryPlugin: Plugin = {
  name: "AddNodeInterfaceToQueryPlugin",
  version: "1.0.0",
  description: `Adds the 'Node' interface to the 'Query' type`,

  schema: {
    hooks: {
      GraphQLObjectType_interfaces(interfaces, build, context) {
        const { getTypeByName, inflection } = build;
        const {
          scope: { isRootQuery },
        } = context;
        if (!isRootQuery) {
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
          graphql: { GraphQLNonNull, GraphQLID },
        } = build;
        const {
          scope: { isRootQuery },
        } = context;
        if (!isRootQuery) {
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
              description: build.wrapDescription(
                "The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`.",
                "field",
              ),
              type: new GraphQLNonNull(GraphQLID),
              plan: EXPORTABLE(
                (constant) =>
                  function plan() {
                    return constant("query");
                  },
                [constant],
              ),
            },
          },
          "Adding id field to Query type from AddNodeInterfaceToQueryPlugin",
        );
      },
    },
  },
};
