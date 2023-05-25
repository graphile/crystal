import "./interfaces.js";
import { sortWithBeforeAfterProvides } from "./sort.js";

export { GraphileConfig };

export { applyHooks, AsyncHooks, HookObject } from "./hooks.js";
export type { PluginHook, PluginHookObject } from "./interfaces.js";
export { isResolvedPreset, resolvePresets } from "./resolvePresets.js";

export function sortedPlugins(
  plugins: GraphileConfig.Plugin[] | undefined,
): GraphileConfig.Plugin[] {
  if (plugins) {
    return sortWithBeforeAfterProvides(plugins, "name");
  } else {
    return [];
  }
}
