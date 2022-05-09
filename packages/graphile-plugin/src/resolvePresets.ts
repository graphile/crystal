import "./interfaces.js";

import * as assert from "assert";

function isResolvedPreset(
  preset: GraphilePlugin.Preset,
): preset is GraphilePlugin.ResolvedPreset {
  return (preset.plugins && preset.extends?.length === 0) || false;
}

/**
 * Given a list of presets, resolves the presets and returns the resulting
 * ResolvedPreset (which does not have any `extends`).
 */
export function resolvePresets(
  presets: ReadonlyArray<GraphilePlugin.Preset>,
): GraphilePlugin.ResolvedPreset {
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
  return finalPreset;
}

/**
 * Turns a preset into a resolved preset (i.e. resolves all its `extends`).
 *
 * @internal
 */
function resolvePreset(
  preset: GraphilePlugin.Preset,
): GraphilePlugin.ResolvedPreset {
  const { extends: presets = [] } = preset;
  const basePreset = resolvePresets(presets);
  mergePreset(basePreset, preset);
  return basePreset;
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
  targetPreset: GraphilePlugin.ResolvedPreset,
  sourcePreset: GraphilePlugin.Preset,
): void {
  assert.ok(
    targetPreset.extends == null || targetPreset.extends.length === 0,
    "First argument to mergePreset must be a resolved preset",
  );
  targetPreset.plugins = [
    ...new Set([
      ...(targetPreset.plugins || []),
      ...(sourcePreset.plugins || []),
    ]),
  ];
  const targetScopes = Object.keys(targetPreset).filter(isScopeKeyForPreset);
  const sourceScopes = Object.keys(sourcePreset).filter(isScopeKeyForPreset);
  const scopes = [...new Set([...targetScopes, ...sourceScopes])];
  for (const scope of scopes) {
    const targetScope = targetPreset[scope];
    const sourceScope = sourcePreset[scope];
    if (targetScope && sourceScope) {
      targetPreset[scope] = Object.assign({}, targetScope, sourceScope);
    } else {
      targetPreset[scope] = targetScope || sourceScope;
    }
  }
}

function blankResolvedPreset(): GraphilePlugin.ResolvedPreset {
  return {
    extends: [],
    plugins: [],
  };
}

/**
 * Scope keys are all the keys except for the ones explicitly defined in the
 * Preset type (before declaration merging).
 */
function isScopeKeyForPreset(key: string) {
  return key !== "extends" && key !== "plugins";
}
