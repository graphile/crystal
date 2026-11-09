import type { GraphQLSchema } from "grafast/graphql";
import { scopedPlugin } from "graphile-build";
import type {} from "graphile-config";

let counter = 0;

type ProcessSchemaFunction<
  TScope extends
    keyof GraphileBuild.PluginScopes = keyof GraphileBuild.PluginScopes,
> = (
  schema: GraphQLSchema,
  build: GraphileBuild.ScopedBuild<TScope>,
  context: GraphileBuild.ContextFinalize,
) => GraphQLSchema;

export function processSchema<
  TScope extends keyof GraphileBuild.PluginScopes = "default",
>(callback: ProcessSchemaFunction<TScope>): GraphileConfig.Plugin {
  return scopedPlugin<TScope>({
    name: `ProcessSchemaPlugin_${++counter}`,
    version: "0.0.0",
    schema: {
      hooks: {
        finalize: {
          callback,
        },
      },
    },
  });
}

/** @deprecated use processSchema */
export const makeProcessSchemaPlugin = processSchema;
