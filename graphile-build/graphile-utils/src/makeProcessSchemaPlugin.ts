import type {} from "graphile-config";

import type { GraphQLSchema } from "graphql";

let counter = 0;

type ProcessSchemaFunction = (schema: GraphQLSchema) => GraphQLSchema;
export function makeProcessSchemaPlugin(
  callback: ProcessSchemaFunction,
): GraphileConfig.Plugin {
  return {
    name: `ProcessSchemaPlugin_${++counter}`,
    version: "0.0.0",
    schema: {
      hooks: {
        finalize: {
          callback,
        },
      },
    },
  };
}
