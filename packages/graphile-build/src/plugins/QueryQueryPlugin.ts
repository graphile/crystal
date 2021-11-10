import { aether } from "graphile-crystal";

/**
 * Adds the Query.query field to the Query type for Relay 1 compatibility. This
 * is a vestigial field, you probably don't want it.
 */
export const QueryQueryPlugin: GraphileEngine.Plugin =
  async function QueryQueryPlugin(builder) {
    builder.hook("GraphQLObjectType:fields", (fields, build, context) => {
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
            plan() {
              return aether().rootValuePlan;
            },
          },
        },
        "Adding the Query.query field for Relay 1 compat",
      );
    });
  };
