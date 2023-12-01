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

declare global {
  namespace GraphileConfig {
    interface Plugin {
      name: string;
      version: string;
      experimental?: boolean;
      description?: string;
      provides?: string[];
      after?: string[];
      before?: string[];
    }

    /**
     * A Graphile Config Preset that can be combined with other presets to
     * ultimately build a resolved preset: a combination of plugins and
     * configuration options to be used by the various Graphile tools.
     */
    interface Preset {
      extends?: ReadonlyArray<Preset>;
      plugins?: Plugin[];
      disablePlugins?: ReadonlyArray<string>;
      // **IMPORTANT**: if a key gets added here, make sure it's also added to the
      // isScopeKeyForPreset check.
    }

    interface ResolvedPreset extends Preset {
      // As Preset, except extends is an empty array and plugins is definitely set.
      extends?: ReadonlyArray<never>;
      plugins?: Plugin[];
      disablePlugins?: ReadonlyArray<string>;
    }
  }
}
