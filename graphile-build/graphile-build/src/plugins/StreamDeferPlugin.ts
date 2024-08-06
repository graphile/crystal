import "graphile-config";

/**
 * Enables stream/defer on the schema.
 *
 * Removing this plugin will result in a GraphQL schema that does not enable
 * stream/defer.
 */
export const StreamDeferPlugin: GraphileConfig.Plugin = {
  name: "StreamDeferPlugin",
  version: "1.0.0",
  description: `Enables stream and defer on the schema`,
  schema: {
    hooks: {
      GraphQLSchema: {
        callback: (schema) => {
          // @ts-ignore
          schema.enableDeferStream = true;
          return schema;
        },
      },
    },
  },
};
