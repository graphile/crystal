/* IMPORTANT: it must be safe to include multiple copies of this file from mis-matched versions */

/** Constrainted identity function to ease constructing presets. */
export function preset<
  TLib extends Record<string, unknown>,
  TExtends extends ReadonlyArray<GraphileConfig.Preset<any, any>>,
>(
  p: GraphileConfig.Preset<TLib, TExtends>,
): GraphileConfig.Preset<
  TLib &
    (TExtends extends readonly GraphileConfig.Preset<infer U, any>[]
      ? any extends U
        ? {}
        : U
      : {}),
  TExtends
> {
  return p as any;
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
     * Construct this using the `preset()` helper to ensure the TypeScript
     * types are generated correctly.
     *
     * A Graphile Config preset that can be combined with other presets to
     * ultimately build a resolved preset: a combination of plugins and
     * configuration options to be used by the various Graphile tools.
     */
    interface Preset<
      TLib extends Record<string, unknown>,
      TExtends extends ReadonlyArray<Preset<any, any>>,
    > {
      extends?: TExtends;
      plugins?: Plugin[];
      disablePlugins?: ReadonlyArray<keyof GraphileConfig.Plugins>;
      lib?: TLib;

      // These are to explicitly forbid options used in PostGraphile V4 for
      // legacy reasons.
      appendPlugins?: never;
      prependPlugins?: never;
      skipPlugins?: never;
      // **IMPORTANT**: if a key gets added here, make sure it's also added to the
      // isScopeKeyForPreset check.
    }

    /**
     * The same as Preset, except `extends` is an empty array and `lib` is
     * definitely set. Procured via `resolvePreset(preset)`
     */
    interface ResolvedPreset<TLib extends Record<string, unknown>>
      extends Preset<TLib, ReadonlyArray<never>> {
      lib: TLib;
    }
  }
}
