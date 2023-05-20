import "graphile-config";

import { operationPlan } from "grafast";

import { EXPORTABLE } from "../utils.js";
import { version } from "../version.js";

/**
 * Adds a 'query' field to each mutation payload object type; this often turns
 * out to be quite helpful but if you don't want it in your schema then it's
 * safe to disable this plugin.
 */
export const MutationPayloadQueryPlugin: GraphileConfig.Plugin = {
  name: "MutationPayloadQueryPlugin",
  description:
    "Adds the 'query' field to mutation payloads; useful for follow-up queries after a mutation",
  version,
  schema: {
    hooks: {
      GraphQLObjectType_fields: {
        callback: (fields, build, context) => {
          const { extend, getTypeByName, inflection } = build;
          const {
            scope: { isMutationPayload },
            Self,
          } = context;

          if (isMutationPayload !== true) {
            return fields;
          }

          const Query = getTypeByName(inflection.builtin("Query"));
          return extend<typeof fields, typeof fields>(
            fields,
            {
              query: {
                description:
                  "Our root query field type. Allows us to run any query from our mutation payload.",
                type: Query,
                plan: EXPORTABLE(
                  (operationPlan) =>
                    function plan() {
                      return operationPlan().rootValueStep;
                    },
                  [operationPlan],
                ),
              },
            },
            `Adding 'query' field to mutation payload ${Self.name}`,
          );
        },
        provides: ["MutationPayloadQuery"],
      },
    },
  },
};
