import type { GraphQLSchema } from "grafast/graphql";
import type {} from "graphile-config";

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
