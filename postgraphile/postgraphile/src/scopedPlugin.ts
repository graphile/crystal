/**
 * A plugin whose schema-phase build arguments use generated types for the
 * specified schema scope.
 *
 * The returned value is an ordinary `GraphileConfig.Plugin`, so it can be
 * used wherever plugins are accepted.
 */
export type ScopedPlugin<
  TScope extends keyof GraphileBuild.ScopedGeneratedTypes = "default",
> = Omit<GraphileConfig.Plugin, "inflection" | "gather" | "schema"> & {
  inflection?: GraphileConfig.PluginInflectionConfig<TScope>;
  gather?: GraphileConfig.PluginGatherConfig<
    keyof GraphileConfig.GatherHelpers,
    any,
    any,
    TScope
  >;
  schema?: GraphileConfig.PluginSchemaConfig<TScope>;
};

/**
 * Marks a plugin as targeting a generated schema scope.
 *
 * This is a type-only adaptation; scopes do not affect plugin runtime
 * behaviour. Configure the same `generatedTypesScope` when generating types.
 */
export function scopedPlugin<
  TScope extends keyof GraphileBuild.ScopedGeneratedTypes = "default",
>(plugin: ScopedPlugin<TScope>): GraphileConfig.Plugin {
  return plugin as GraphileConfig.Plugin;
}
