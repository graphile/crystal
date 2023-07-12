import "./interfaces.js";

import { sortWithBeforeAfterProvides } from "./sort.js";

const PRESET_FORBIDDEN_KEYS = [
  "name", // If we want to give presets a name, we should use 'id', 'label', 'title' or similar.
  "experimental",
  "provides",
  "before",
  "after",
];
const PLUGIN_FORBIDDEN_KEYS = ["plugins", "disablePlugins", "extends"];

let inspect: (obj: any, options?: { colors: boolean }) => string;

try {
  inspect = require("util").inspect;
  if (typeof inspect !== "function") {
    throw new Error("Failed to load inspect");
  }
} catch {
  inspect = (obj) => {
    return Array.isArray(obj) ||
      !obj ||
      Object.getPrototypeOf(obj) === null ||
      Object.getPrototypeOf(obj) === Object.prototype
      ? JSON.stringify(obj)
      : String(obj);
  };
}

export function isResolvedPreset(
  preset: GraphileConfig.Preset,
): preset is GraphileConfig.ResolvedPreset {
  return (preset.plugins && preset.extends?.length === 0) || false;
}

/**
 * Given a list of presets, resolves the presets and returns the resulting
 * ResolvedPreset (which does not have any `extends`).
 */
export function resolvePresets(
  presets: ReadonlyArray<GraphileConfig.Preset>,
): GraphileConfig.ResolvedPreset {
  if (presets.length === 1) {
    // Maybe it's already resolved?
    const preset = presets[0];
    if (preset && isResolvedPreset(preset)) {
      return preset;
    }
  }
  const finalPreset = blankResolvedPreset();
  for (const preset of presets) {
    const resolvedPreset = resolvePreset(preset);
    mergePreset(finalPreset, resolvedPreset);
  }

  if (finalPreset.plugins) {
    finalPreset.plugins = sortWithBeforeAfterProvides(
      finalPreset.plugins,
      "name",
    );
  }

  return finalPreset;
}

function isGraphileConfigPreset(foo: unknown): foo is GraphileConfig.Preset {
  if (typeof foo !== "object" || foo === null) return false;

  // Check regular prototype
  const prototype = Object.getPrototypeOf(foo);
  if (prototype === null || prototype === Object.prototype) {
    return true;
  }

  // Heavier check, to allow for Jest/VM complexity (where `Object` differs)
  if (String(foo) === "[object Object]") {
    return true;
  }

  return false;
}

function assertPlugin(plugin: any): asserts plugin is GraphileConfig.Plugin {
  if (typeof plugin !== "object" || plugin == null) {
    throw new Error(`Expected plugin, but found '${inspect(plugin)}'`);
  }
  const proto = Object.getPrototypeOf(plugin);
  if (proto !== Object.prototype && proto !== null) {
    throw new Error(
      `Expected plugin to be a plain object, but found '${inspect(plugin)}'`,
    );
  }
  if (typeof plugin.name !== "string") {
    throw new Error(
      `Expected plugin to have a string 'name'; found ${inspect(
        plugin.name,
      )} (${inspect(plugin)})`,
    );
  }
  if (plugin.version != null && typeof plugin.version !== "string") {
    throw new Error(
      `Expected plugin '${
        plugin.name
      }' to have a string 'version'; found ${inspect(plugin.version)}`,
    );
  }
  for (const forbiddenKey of PLUGIN_FORBIDDEN_KEYS) {
    if (plugin[forbiddenKey]) {
      throw new Error(
        `Plugin '${plugin.name}' has '${forbiddenKey}' property which suggests it is a preset rather than a plugin. If it is indeed a preset you should add it to your preset via 'extends' rather than 'plugins'.`,
      );
    }
  }
}

/**
 * Turns a preset into a resolved preset (i.e. resolves all its `extends`).
 *
 * @internal
 */
function resolvePreset(
  preset: GraphileConfig.Preset,
): GraphileConfig.ResolvedPreset {
  if (!isGraphileConfigPreset(preset)) {
    throw new Error(
      `Expected a GraphileConfig preset (a plain JS object), but found '${inspect(
        preset,
      )}'`,
    );
  }

  try {
    for (const forbiddenKey of PRESET_FORBIDDEN_KEYS) {
      if ((preset as any)[forbiddenKey]) {
        throw new Error(
          `Preset has '${forbiddenKey}' property which suggests it is a plugin rather than a preset. If it is indeed a plugin you should add it to your preset via 'plugins' rather than 'extends'.`,
        );
      }
    }
    const { extends: presets = [] } = preset;
    const basePreset = resolvePresets(presets);
    mergePreset(basePreset, preset);

    const disabled = basePreset.disablePlugins;
    if (disabled) {
      const plugins = new Set(basePreset.plugins);
      const remaining = new Set(disabled);
      for (const plugin of plugins) {
        assertPlugin(plugin);
        if (remaining.has(plugin.name)) {
          remaining.delete(plugin.name);
          plugins.delete(plugin);
        }
      }
      /*

    TODO: we need an alert like this, but only at the very top level.
    The easiest way to check is to just see if `disablePlugins` has length.

    if (remaining.size > 0) {
      console.warn(
        `Attempted to 'disablePlugins', but the following plugin(s) weren't found: '${[
          ...remaining,
        ].join("', '")}' (known: ${[...plugins].map((p) => p.name)})`,
      );
    }
    */
      basePreset.plugins = [...plugins];
      basePreset.disablePlugins = [...remaining];
    }
    return basePreset;
  } catch (e) {
    throw new Error(
      `Error occurred when resolving preset: ${e}\nPreset: ${inspect(preset)}`,
    );
  }
}

/**
 * Merges `sourcePreset` into existing resolved preset `targetPreset`, ignoring
 * any `extends` on the `sourcePreset`.
 *
 * Note this function uses mutation for performance reasons.
 *
 * @internal
 */
function mergePreset(
  targetPreset: GraphileConfig.ResolvedPreset,
  sourcePreset: GraphileConfig.Preset,
): void {
  if (targetPreset.extends != null && targetPreset.extends.length !== 0) {
    throw new Error("First argument to mergePreset must be a resolved preset");
  }
  const plugins = new Set([
    ...(targetPreset.plugins || []),
    ...(sourcePreset.plugins || []),
  ]);
  targetPreset.plugins = [...plugins];
  if (sourcePreset.disablePlugins) {
    targetPreset.disablePlugins = [
      ...new Set([
        ...(targetPreset.disablePlugins ?? []),
        ...(sourcePreset.disablePlugins ?? []),
      ]),
    ];
  }
  const targetScopes = Object.keys(targetPreset).filter(isScopeKeyForPreset);
  const sourceScopes = Object.keys(sourcePreset).filter(isScopeKeyForPreset);
  const scopes = [...new Set([...targetScopes, ...sourceScopes])];
  for (const scope of scopes) {
    const targetScope =
      targetPreset[scope as keyof GraphileConfig.ResolvedPreset];
    const sourceScope = sourcePreset[scope as keyof GraphileConfig.Preset];
    if (targetScope && sourceScope) {
      if (Array.isArray(targetScope) !== Array.isArray(sourceScope)) {
        throw new Error(
          `${scope} contains an array entry in one preset and a non-array entry in another, this doesn't make sense`,
        );
      } else if (Array.isArray(sourceScope)) {
        targetPreset[scope as keyof GraphileConfig.ResolvedPreset] =
          sourceScope as any;
      } else {
        targetPreset[scope as keyof GraphileConfig.ResolvedPreset] =
          Object.assign(Object.create(null), targetScope, sourceScope);
      }
    } else {
      targetPreset[scope as keyof GraphileConfig.ResolvedPreset] =
        (targetScope || sourceScope) as any;
    }
  }
}

function blankResolvedPreset(): GraphileConfig.ResolvedPreset {
  return {
    extends: [],
    plugins: [],
    disablePlugins: [],
  };
}

/**
 * Scope keys are all the keys except for the ones explicitly defined in the
 * Preset type (before declaration merging).
 */
function isScopeKeyForPreset(key: string) {
  return key !== "extends" && key !== "plugins" && key !== "disablePlugins";
}
