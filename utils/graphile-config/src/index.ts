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
export type { MiddlewareNext } from "./middleware.js";
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

declare global {
  namespace GraphileConfig {
    /**
     * Expand this through declaration merging to get TypeScript
     * auto-completion of plugin names in the relevant places.
     */
    interface Plugins {
      // eslint-disable-next-line @typescript-eslint/ban-types
      [key: string & {}]: true;
    }

    /**
     * Expand this through declaration merging to get TypeScript
     * auto-completion of things that plugins can provide.
     */
    interface Provides {
      // eslint-disable-next-line @typescript-eslint/ban-types
      [key: string & {}]: true;
    }

    interface Plugin {
      name: keyof GraphileConfig.Plugins;
      version?: string;
      experimental?: boolean;
      description?: string;
      provides?: (
        | keyof GraphileConfig.Plugins
        | keyof GraphileConfig.Provides
      )[];
      after?: (keyof GraphileConfig.Plugins | keyof GraphileConfig.Provides)[];
      before?: (keyof GraphileConfig.Plugins | keyof GraphileConfig.Provides)[];
    }

    /**
     * A Graphile Config Preset that can be combined with other presets to
     * ultimately build a resolved preset: a combination of plugins and
     * configuration options to be used by the various Graphile tools.
     */
    interface Preset {
      extends?: ReadonlyArray<Preset>;
      plugins?: Plugin[];
      disablePlugins?: ReadonlyArray<keyof GraphileConfig.Plugins>;

      // These are to explicitly forbid options used in PostGraphile V4 for
      // legacy reasons.
      appendPlugins?: never;
      prependPlugins?: never;
      skipPlugins?: never;
      // **IMPORTANT**: if a key gets added here, make sure it's also added to the
      // isScopeKeyForPreset check.
    }

    interface ResolvedPreset extends Preset {
      // As Preset, except extends is an empty array and plugins is definitely set.
      extends?: ReadonlyArray<never>;
      plugins?: Plugin[];
      disablePlugins?: ReadonlyArray<keyof GraphileConfig.Plugins>;
    }
  }
}
