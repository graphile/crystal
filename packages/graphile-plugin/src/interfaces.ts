declare global {
  namespace GraphilePlugin {
    interface Plugin {
      name: string;
      version: string;
      description?: string;
      provides?: string[];
      after?: string[];
      before?: string[];
    }

    type PluginHookObject<T extends (...args: any[]) => any> = {
      provides?: string[];
      before?: string[];
      after?: string[];
      callback: T;
    };

    type PluginHook<T extends (...args: any[]) => any> =
      | T
      | PluginHookObject<T>;

    type PluginHookCallback<T extends PluginHook<(...args: any[]) => any>> =
      T extends PluginHook<infer U> ? U : never;

    interface Preset {
      extends?: ReadonlyArray<Preset>;
      plugins?: Plugin[];
      // IMPORTANT: if a key gets added here, make sure it's also added to the
      // isScopeKeyForPreset check.
    }

    interface ResolvedPreset extends Preset {
      // As Preset, except extends is an empty array and plugins is definitely set.
      extends: ReadonlyArray<never>;
      plugins: Plugin[];
    }
  }
}

export type Plugin = GraphilePlugin.Plugin;
export type PluginHook<T extends (...args: any[]) => any> =
  GraphilePlugin.PluginHook<T>;
export type PluginHookObject<T extends (...args: any[]) => any> =
  GraphilePlugin.PluginHookObject<T>;
export type Preset = GraphilePlugin.Preset;
export type ResolvedPreset = GraphilePlugin.ResolvedPreset;
