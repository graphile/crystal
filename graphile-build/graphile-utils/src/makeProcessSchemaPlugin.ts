import type { GraphQLSchema } from "grafast/graphql";
import type {} from "graphile-config";

let counter = 0;

type ProcessSchemaFunction<TScope extends keyof GraphileBuild.PluginScopes> = (
  schema: GraphQLSchema,
  build: GraphileBuild.ScopedBuild<TScope>,
  context: GraphileBuild.ContextFinalize,
) => GraphQLSchema;
export function processSchema<
  TScope extends keyof GraphileBuild.PluginScopes = "default",
>(callback: ProcessSchemaFunction<TScope>): GraphileConfig.Plugin {
  return {
    name: `ProcessSchemaPlugin_${++counter}`,
    version: "0.0.0",
    schema: {
      hooks: {
        finalize: {
          callback(schema, build, context) {
            return callback(
              schema,
              build as GraphileBuild.ScopedBuild<TScope>,
              context,
            );
          },
        },
      },
    },
  };
}

/** @deprecated use processSchema */
export const makeProcessSchemaPlugin = processSchema;
