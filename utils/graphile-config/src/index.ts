import "./interfaces.js";

import { sortWithBeforeAfterProvides } from "./sort.js";

export { GraphileConfig };

export { orderedApply } from "./functionality.js";
export {
  applyHooks,
  AsyncHooks,
  HookObject,
  PluginHook,
  PluginHookObject,
} from "./hooks.js";
export type {
  CallbackDescriptor,
  CallbackOrDescriptor,
  FunctionalityObject,
} from "./interfaces.js";
export type { MiddlewareHandlers, MiddlewareNext } from "./middleware.js";
export { Middleware } from "./middleware.js";
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

// This is where the global types originate too
export { preset } from "./helpers.js";
