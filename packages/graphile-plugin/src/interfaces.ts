export interface Plugin {
  name: string;
  version: string;
  description?: string;
  provides?: string[];
  after?: string[];
  before?: string[];
}

export type PluginHook<T extends (...args: any[]) => any> =
  | T
  | {
      provides?: string[];
      before?: string[];
      after?: string[];
      callback: T;
    };

export interface Preset {
  extends?: ReadonlyArray<Preset>;
  plugins?: Plugin[];
  // IMPORTANT: if a key gets added here, make sure it's also added to the
  // isScopeKeyForPreset check.
}

export interface ResolvedPreset extends Preset {
  // As Preset, except extends is an empty array and plugins is definitely set.
  extends: ReadonlyArray<never>;
  plugins: Plugin[];
}
