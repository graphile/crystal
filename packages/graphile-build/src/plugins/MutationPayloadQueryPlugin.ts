import { aether } from "graphile-crystal";
import { EXPORTABLE } from "graphile-exporter";

/**
 * Adds a 'query' field to each mutation payload object type; this often turns
 * out to be quite helpful but if you don't want it in your schema then it's
 * safe to disable this plugin.
 */
export const MutationPayloadQueryPlugin: GraphileEngine.Plugin =
  function MutationPayloadQueryPlugin(builder) {
    builder.hook(
      "GraphQLObjectType:fields",
      (fields, build, context) => {
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
                (aether) =>
                  function plan() {
                    return aether().rootValuePlan;
                  },
                [aether],
              ),
            },
          },
          `Adding 'query' field to mutation payload ${Self.name}`,
        );
      },
      ["MutationPayloadQuery"],
    );
  };
