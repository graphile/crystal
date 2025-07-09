import "./interfaces.js";
export { GraphileConfig };
export { orderedApply } from "./functionality.js";
export { applyHooks, AsyncHooks, HookObject, PluginHook, PluginHookObject, } from "./hooks.js";
export type { CallbackDescriptor, CallbackOrDescriptor, FunctionalityObject, } from "./interfaces.js";
export type { MiddlewareHandlers, MiddlewareNext } from "./middleware.js";
export { Middleware } from "./middleware.js";
export { isResolvedPreset, resolvePreset, resolvePresets, } from "./resolvePresets.js";
export declare function sortedPlugins(plugins: GraphileConfig.Plugin[] | undefined): GraphileConfig.Plugin[];
declare global {
    namespace GraphileConfig {
        interface Lib {
            versions: Record<string, string | undefined>;
        }
        /**
         * Expand this through declaration merging to get TypeScript
         * auto-completion of plugin names in the relevant places.
         */
        interface Plugins {
            [key: string & {}]: true;
        }
        /**
         * Expand this through declaration merging to get TypeScript
         * auto-completion of things that plugins can provide.
         */
        interface Provides {
            [key: string & {}]: true;
        }
        interface Plugin {
            name: keyof GraphileConfig.Plugins;
            version?: string;
            experimental?: boolean;
            description?: string;
            provides?: (keyof GraphileConfig.Plugins | keyof GraphileConfig.Provides)[];
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
            lib?: Partial<GraphileConfig.Lib>;
            appendPlugins?: never;
            prependPlugins?: never;
            skipPlugins?: never;
        }
        /**
         * The result of `resolvePreset(preset)` on a preset - compatible with
         * `Preset` but guaranteed to not extend from other presets (and a few
         * other assertions).
         */
        interface ResolvedPreset extends Preset {
            extends?: never;
            plugins: Plugin[];
            disablePlugins: ReadonlyArray<keyof GraphileConfig.Plugins>;
            lib: GraphileConfig.Lib;
        }
    }
}
//# sourceMappingURL=index.d.ts.map