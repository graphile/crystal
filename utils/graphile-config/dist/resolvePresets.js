"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isResolvedPreset = isResolvedPreset;
exports.resolvePresets = resolvePresets;
exports.resolvePreset = resolvePreset;
require("./interfaces.js");
const sort_js_1 = require("./sort.js");
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
let inspect;
try {
    inspect = require("util").inspect;
    if (typeof inspect !== "function") {
        throw new Error("Failed to load inspect");
    }
}
catch {
    inspect = (obj) => {
        return Array.isArray(obj) ||
            !obj ||
            Object.getPrototypeOf(obj) === null ||
            Object.getPrototypeOf(obj) === Object.prototype
            ? JSON.stringify(obj)
            : String(obj);
    };
}
function isResolvedPreset(preset) {
    return ((preset.extends == null &&
        preset.plugins &&
        preset.disablePlugins &&
        typeof preset.lib === "object" &&
        preset.lib !== null &&
        !preset.plugins.some((p) => preset.disablePlugins.includes(p.name))) ||
        false);
}
/** @deprecated Use `resolvePreset({ extends: presets })` instead */
function resolvePresets(presets) {
    if (presets.length === 1) {
        return resolvePreset(presets[0]);
    }
    else {
        return resolvePreset({ extends: presets });
    }
}
/**
 * Given a preset, recursively resolves all the `extends` and returns the
 * resulting ResolvedPreset (which does not have any `extends`).
 */
function resolvePreset(preset) {
    // Maybe it's already resolved?
    if (preset && isResolvedPreset(preset)) {
        return preset;
    }
    const seenPluginNames = new Set();
    const resolvedPreset = resolvePresetsInternal([preset], seenPluginNames, 0);
    const disabledButNotSeen = resolvedPreset.disablePlugins?.filter((n) => !seenPluginNames.has(n));
    if (disabledButNotSeen?.length) {
        console.warn(`One or more of the plugin(s) entered in your preset's 'disablePlugins' list was never seen - perhaps you have misspelled them?\n${disabledButNotSeen
            .map((p) => `  - ${p}`)
            .join("\n")}\nThe list of know plugins is:\n  ${[...seenPluginNames].join(", ") ?? "-"}`);
    }
    return resolvedPreset;
}
function resolvePresetsInternal(presets, seenPluginNames, depth) {
    const finalPreset = blankResolvedPreset();
    for (const preset of presets) {
        if (isResolvedPreset(preset) && preset.disablePlugins) {
            for (const p of preset.disablePlugins) {
                seenPluginNames.add(p);
            }
        }
        const resolvedPreset = resolvePresetInternal(preset, seenPluginNames, depth + 1);
        mergePreset(finalPreset, resolvedPreset, seenPluginNames, depth);
    }
    if (finalPreset.plugins) {
        finalPreset.plugins = (0, sort_js_1.sortWithBeforeAfterProvides)(finalPreset.plugins, "name");
    }
    return finalPreset;
}
function isGraphileConfigPreset(foo) {
    if (typeof foo !== "object" || foo === null)
        return false;
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
function assertPlugin(plugin) {
    if (typeof plugin !== "object" || plugin == null) {
        throw new Error(`Expected plugin, but found '${inspect(plugin)}'`);
    }
    const proto = Object.getPrototypeOf(plugin);
    if (proto !== Object.prototype && proto !== null) {
        throw new Error(`Expected plugin to be a plain object, but found '${inspect(plugin)}'`);
    }
    if (typeof plugin.name !== "string") {
        throw new Error(`Expected plugin to have a string 'name'; found ${inspect(plugin.name)} (${inspect(plugin)})`);
    }
    if (plugin.version != null && typeof plugin.version !== "string") {
        throw new Error(`Expected plugin '${plugin.name}' to have a string 'version'; found ${inspect(plugin.version)}`);
    }
    const keys = Object.keys(plugin);
    const forbiddenKeys = keys.filter(isForbiddenPluginKey);
    if (forbiddenKeys.length) {
        throw new Error(`Expected a GraphileConfig plugin, but found an object with forbidden keys ` +
            `(e.g. keys starting with a capital letter, or a 'default' key). This typically indicates an ` +
            `issue with ESM compatibility or import method, for example ` +
            `doing \`import MyPlugin from 'my-plugin'\` instead of ` +
            `\`import { MyPlugin } from 'my-plugin'\` or vice versa. ` +
            `Forbidden keys: '${forbiddenKeys.join("', '")}', full value: '${inspect(plugin)}'`);
    }
    for (const forbiddenKey of PROBABLY_A_PRESET_NOT_A_PLUGIN_KEYS) {
        if (plugin[forbiddenKey]) {
            throw new Error(`Plugin '${plugin.name}' has '${forbiddenKey}' property which suggests it is a preset rather than a plugin. If it is indeed a preset you should add it to your preset via 'extends' rather than 'plugins'.`);
        }
    }
}
function isForbiddenPresetKey(key) {
    return /^[A-Z_]/.test(key) || key === "default";
}
function isForbiddenPluginKey(key) {
    return /^[A-Z_]/.test(key) || key === "default";
}
/**
 * Turns a preset into a resolved preset (i.e. resolves all its `extends`).
 *
 * @internal
 */
function resolvePresetInternal(preset, seenPluginNames, depth) {
    if (!isGraphileConfigPreset(preset)) {
        throw new Error(`Expected a GraphileConfig preset (a plain JS object), but found '${inspect(preset)}'`);
    }
    const keys = Object.keys(preset);
    const forbiddenKeys = keys.filter(isForbiddenPresetKey);
    if (forbiddenKeys.length) {
        throw new Error(`Expected a GraphileConfig preset, but found an object with forbidden keys ` +
            `(e.g. keys starting with a capital letter, or a 'default' key). This typically indicates an ` +
            `issue with ESM compatibility or import method, for example ` +
            `doing \`import MyPreset from 'my-preset'\` instead of ` +
            `\`import { MyPreset } from 'my-preset'\` or vice versa. ` +
            `Forbidden keys: '${forbiddenKeys.join("', '")}', full value: '${inspect(preset)}'`);
    }
    try {
        for (const forbiddenKey of PROBABLY_A_PLUGIN_NOT_A_PRESET_KEYS) {
            if (preset[forbiddenKey]) {
                throw new Error(`Preset has '${forbiddenKey}' property which suggests it is a plugin rather than a preset. If it is indeed a plugin you should add it to your preset via 'plugins' rather than 'extends'.`);
            }
        }
    }
    catch (e) {
        throw new Error(`Error occurred when resolving preset:\n  ${String(e).replace(/\n/g, "\n  ")}\nPreset: ${inspect(preset)}`);
    }
    const { extends: presets = [], ...rest } = preset;
    const basePreset = resolvePresetsInternal(presets, seenPluginNames, depth + 1);
    try {
        mergePreset(basePreset, rest, seenPluginNames, depth);
        return basePreset;
    }
    catch (e) {
        throw new Error(`Error occurred when resolving preset:\n  ${String(e).replace(/\n/g, "\n  ")}\nPreset: ${inspect(preset)}`);
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
function mergePreset(targetPreset, sourcePreset, seenPluginNames, _depth) {
    const sourcePluginNames = [];
    if (sourcePreset.plugins) {
        for (const plugin of sourcePreset.plugins) {
            assertPlugin(plugin);
            seenPluginNames.add(plugin.name);
            sourcePluginNames.push(plugin.name);
        }
    }
    if (targetPreset.extends != null) {
        throw new Error("First argument to mergePreset must be a resolved preset");
    }
    const addedAndDisabled = sourcePreset.disablePlugins
        ? sourcePluginNames.filter((addedPluginName) => sourcePreset.disablePlugins.includes(addedPluginName))
        : [];
    if (addedAndDisabled.length > 0) {
        throw new Error(`A preset may not both add a plugin and disable that same plugin ('${addedAndDisabled.join("', '")}')`);
    }
    const disablePlugins = [
        ...new Set([
            // Remove the previously disabled plugins where we've explicitly re-added the plugin
            ...(targetPreset.disablePlugins?.filter((pluginName) => !sourcePluginNames.includes(pluginName)) ?? []),
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
    targetPreset.plugins = [...plugins].filter((p) => !disablePlugins.includes(p.name));
    if (sourcePreset.lib) {
        for (const key of Object.keys(sourcePreset.lib)) {
            const sourceValue = sourcePreset.lib[key];
            if (!(key in targetPreset.lib)) {
                targetPreset.lib[key] = sourceValue;
            }
            else if (key === "versions") {
                if (sourceValue) {
                    for (const versionKey of Object.keys(sourceValue)) {
                        const { versions: targetVersions } = targetPreset.lib;
                        const sourceVersion = sourceValue[versionKey];
                        if (targetVersions[versionKey] === sourceVersion) {
                            // noop
                        }
                        else if (targetVersions[versionKey]) {
                            throw new Error(`Preset attempted to register version '${sourceVersion}' of '${versionKey}', but version '${targetVersions[versionKey]}' is already registered`);
                        }
                        else {
                            targetVersions[versionKey] = sourceVersion;
                        }
                    }
                }
            }
            else if (targetPreset.lib[key] === sourceValue) {
                // noop
            }
            else {
                throw new Error(`Two different presets defined lib '${key}' but they had different values:\n\n    ${inspect(targetPreset.lib[key]).replace(/\n/g, "\n    ")}\n\nvs\n\n    ${inspect(sourceValue).replace(/\n/g, "\n    ")}`);
            }
        }
    }
    const targetScopes = Object.keys(targetPreset).filter(isScopeKeyForPreset);
    const sourceScopes = Object.keys(sourcePreset).filter(isScopeKeyForPreset);
    const scopes = [...new Set([...targetScopes, ...sourceScopes])];
    for (const scope of scopes) {
        const targetScope = targetPreset[scope];
        const sourceScope = sourcePreset[scope];
        if (targetScope && sourceScope) {
            if (Array.isArray(targetScope) !== Array.isArray(sourceScope)) {
                throw new Error(`${scope} contains an array entry in one preset and a non-array entry in another, this doesn't make sense`);
            }
            else if (Array.isArray(sourceScope)) {
                targetPreset[scope] = sourceScope;
            }
            else {
                targetPreset[scope] = Object.assign(Object.create(null), targetScope, sourceScope);
            }
        }
        else {
            targetPreset[scope] =
                targetScope || sourceScope;
        }
    }
}
function blankResolvedPreset() {
    return {
        plugins: [],
        disablePlugins: [],
        lib: Object.create(null),
    };
}
/**
 * Scope keys are all the keys except for the ones explicitly defined in the
 * Preset type (before declaration merging).
 */
function isScopeKeyForPreset(key) {
    return (key !== "extends" &&
        key !== "plugins" &&
        key !== "disablePlugins" &&
        key !== "lib");
}
//# sourceMappingURL=resolvePresets.js.map