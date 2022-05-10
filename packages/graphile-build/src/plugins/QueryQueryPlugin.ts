import "graphile-config";

import { aether } from "dataplanner";
import { EXPORTABLE } from "graphile-export";

import { version } from "../index";

/**
 * Adds the Query.query field to the Query type for Relay 1 compatibility. This
 * is a vestigial field, you probably don't want it.
 */
export const QueryQueryPlugin: GraphileConfig.Plugin = {
  name: "QueryQueryPlugin",
  description:
    "Adds a 'query' field to the Query type giving access to the Query type again. You probably don't want this unless you need to support Relay Classic.",
  version: version,
  schema: {
    hooks: {
      GraphQLObjectType_fields: {
        callback: (fields, build, context) => {
          const {
            extend,
            graphql: { GraphQLNonNull },
          } = build;
          const {
            Self,
            scope: { isRootQuery },
          } = context;
          if (isRootQuery !== true) {
            return fields;
          }
          return extend(
            fields,
            {
              query: {
                description:
                  "Exposes the root query type nested one level down. This is helpful for Relay 1 which can only query top level fields if they are in a particular form.",
                type: new GraphQLNonNull(Self),
                plan: EXPORTABLE(
                  (aether) =>
                    function plan() {
                      return aether().rootValuePlan;
                    },
                  [aether],
                ),
              },
            },
            "Adding the Query.query field for Relay 1 compat",
          );
        },
      },
    },
  },
};
