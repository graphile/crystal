import "./interfaces.js";
export declare function isResolvedPreset(preset: GraphileConfig.Preset): preset is GraphileConfig.ResolvedPreset;
/** @deprecated Use `resolvePreset({ extends: presets })` instead */
export declare function resolvePresets(presets: ReadonlyArray<GraphileConfig.Preset>): GraphileConfig.ResolvedPreset;
/**
 * Given a preset, recursively resolves all the `extends` and returns the
 * resulting ResolvedPreset (which does not have any `extends`).
 */
export declare function resolvePreset(preset: GraphileConfig.Preset): GraphileConfig.ResolvedPreset;
//# sourceMappingURL=resolvePresets.d.ts.map