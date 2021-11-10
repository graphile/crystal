import { aether } from "graphile-crystal";

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
              plan() {
                return aether().rootValuePlan;
              },
            },
          },

          `Adding 'query' field to mutation payload ${Self.name}`,
        );
      },
      ["MutationPayloadQuery"],
    );
  };
