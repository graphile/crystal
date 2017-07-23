// @flow
import type { Plugin } from "../SchemaBuilder";

const MutationPlugin: Plugin = async function MutationPlugin(builder) {
  builder.hook(
    "GraphQLSchema",
    (schema: {}, { newWithHooks, extend, graphql: { GraphQLObjectType } }) => {
      const Mutation = newWithHooks(
        GraphQLObjectType,
        {
          name: "Mutation",
          description:
            "The root mutation type which contains root level fields which mutate data.",
        },
        { isRootMutation: true },
        true
      );
      if (Mutation) {
        return extend(schema, {
          mutation: Mutation,
        });
      } else {
        return schema;
      }
    }
  );
};
export default MutationPlugin;
