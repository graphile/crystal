import "./interfaces.js";

import { sortWithBeforeAfterProvides } from "./sort.js";

const PROBABLY_A_PLUGIN_NOT_A_PRESET_KEYS = [
  "name", // If we want to give presets a name, we should use 'id', 'label', 'title' or similar.
  "experimental",
  "provides",
  "before",
  "after",
  // To avoid confusion with PostGraphile V4:
  "appendPlugins",
  "prependPlugins",
  "skipPlugins",
];
const PROBABLY_A_PRESET_NOT_A_PLUGIN_KEYS = [
  "plugins",
  "disablePlugins",
  "extends",
];

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
  return (
    (preset.plugins &&
      preset.extends?.length === 0 &&
      (!preset.disablePlugins ||
        !preset.plugins ||
        !preset.plugins.some((p) =>
          preset.disablePlugins!.includes(p.name),
        ))) ||
    false
  );
}

/**
 * Given a list of presets, resolves the presets and returns the resulting
 * ResolvedPreset (which does not have any `extends`).
 */
export function resolvePresets(presets: ReadonlyArray<GraphileConfig.Preset>) {
  const resolvedPreset = resolvePresetsInternal(presets, 0);

  const seenNames = resolvedPreset.plugins?.map((p) => p.name) ?? [];
  const disabledButNotSeen = resolvedPreset.disablePlugins?.filter(
    (n) => !seenNames.includes(n),
  );
  if (disabledButNotSeen?.length) {
    console.warn(
      `One or more of the plugin(s) entered in your preset's 'disablePlugins' list was never seen - perhaps you have misspelled them?\n${disabledButNotSeen
        .map((p) => `  - ${p}`)
        .join("\n")}\nThe list of know plugins is:\n  ${
        seenNames.join(", ") ?? "-"
      }`,
    );
  }

  return resolvedPreset;
}

function resolvePresetsInternal(
  presets: ReadonlyArray<GraphileConfig.Preset>,
  depth: number,
): GraphileConfig.ResolvedPreset {
  if (presets.length === 1) {
    // Maybe it's already resolved?
    const preset = presets[0];
    if (preset && isResolvedPreset(preset)) {
      return preset;
    }
  }
  const finalPreset = blankResolvedPreset();
  let presetIndex = 0;
  for (const preset of presets) {
    const resolvedPreset = resolvePresetInternal(preset, depth + 1);
    mergePreset(finalPreset, resolvedPreset, depth);
    presetIndex++;
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
  const keys = Object.keys(plugin);
  const forbiddenKeys = keys.filter(isForbiddenPluginKey);
  if (forbiddenKeys.length) {
    throw new Error(
      `Expected a GraphileConfig plugin, but found an object with forbidden keys ` +
        `(e.g. keys starting with a capital letter, or a 'default' key). This typically indicates an ` +
        `issue with ESM compatibility or import method, for example ` +
        `doing \`import MyPlugin from 'my-plugin'\` instead of ` +
        `\`import { MyPlugin } from 'my-plugin'\` or vice versa. ` +
        `Forbidden keys: '${forbiddenKeys.join(
          "', '",
        )}', full value: '${inspect(plugin)}'`,
    );
  }
  for (const forbiddenKey of PROBABLY_A_PRESET_NOT_A_PLUGIN_KEYS) {
    if (plugin[forbiddenKey]) {
      throw new Error(
        `Plugin '${plugin.name}' has '${forbiddenKey}' property which suggests it is a preset rather than a plugin. If it is indeed a preset you should add it to your preset via 'extends' rather than 'plugins'.`,
      );
    }
  }
}

function isForbiddenPresetKey(key: string): boolean {
  return /^[A-Z_]/.test(key) || key === "default";
}

function isForbiddenPluginKey(key: string): boolean {
  return /^[A-Z_]/.test(key) || key === "default";
}

/**
 * Turns a preset into a resolved preset (i.e. resolves all its `extends`).
 *
 * @internal
 */
function resolvePresetInternal(
  preset: GraphileConfig.Preset,
  depth: number,
): GraphileConfig.ResolvedPreset {
  if (!isGraphileConfigPreset(preset)) {
    throw new Error(
      `Expected a GraphileConfig preset (a plain JS object), but found '${inspect(
        preset,
      )}'`,
    );
  }

  const keys = Object.keys(preset);
  const forbiddenKeys = keys.filter(isForbiddenPresetKey);
  if (forbiddenKeys.length) {
    throw new Error(
      `Expected a GraphileConfig preset, but found an object with forbidden keys ` +
        `(e.g. keys starting with a capital letter, or a 'default' key). This typically indicates an ` +
        `issue with ESM compatibility or import method, for example ` +
        `doing \`import MyPreset from 'my-preset'\` instead of ` +
        `\`import { MyPreset } from 'my-preset'\` or vice versa. ` +
        `Forbidden keys: '${forbiddenKeys.join(
          "', '",
        )}', full value: '${inspect(preset)}'`,
    );
  }

  try {
    for (const forbiddenKey of PROBABLY_A_PLUGIN_NOT_A_PRESET_KEYS) {
      if ((preset as any)[forbiddenKey]) {
        throw new Error(
          `Preset has '${forbiddenKey}' property which suggests it is a plugin rather than a preset. If it is indeed a plugin you should add it to your preset via 'plugins' rather than 'extends'.`,
        );
      }
    }
  } catch (e) {
    throw new Error(
      `Error occurred when resolving preset: ${e}\nPreset: ${inspect(preset)}`,
    );
  }

  const { extends: presets = [], ...rest } = preset;
  const basePreset = resolvePresetsInternal(presets, depth + 1);

  try {
    mergePreset(basePreset, rest, depth);
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
  sourcePreset: GraphileConfig.ResolvedPreset,
  _depth: number,
): void {
  if (targetPreset.extends != null && targetPreset.extends.length !== 0) {
    throw new Error("First argument to mergePreset must be a resolved preset");
  }

  const sourcePluginNames = sourcePreset.plugins?.map((p) => p.name) ?? [];
  const addedAndDisabled = sourcePreset.disablePlugins
    ? sourcePluginNames.filter((addedPluginName) =>
        sourcePreset.disablePlugins!.includes(addedPluginName),
      )
    : [];
  if (addedAndDisabled.length > 0) {
    throw new Error(
      `A preset may not both add a plugin and disable that same plugin ('${addedAndDisabled.join(
        "', '",
      )}')`,
    );
  }

  const disablePlugins = [
    ...new Set([
      // Remove the previously disabled plugins where we've explicitly re-added the plugin
      ...(targetPreset.disablePlugins?.filter(
        (pluginName) => !sourcePluginNames.includes(pluginName),
      ) ?? []),
      // Explicitly add our new disablePlugins
      ...(sourcePreset.disablePlugins ?? []),
    ]),
  ];
  targetPreset.disablePlugins = disablePlugins;

  const plugins = new Set([
    ...(targetPreset.plugins || []),
    ...(sourcePreset.plugins || []),
  ]);

  // Copy the unique plugins that are not disabled
  targetPreset.plugins = [...plugins].filter(
    (p) => !disablePlugins.includes(p.name),
  );
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
