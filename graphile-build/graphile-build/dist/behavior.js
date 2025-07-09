"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Behavior = void 0;
exports.joinBehaviors = joinBehaviors;
exports.joinResolvedBehaviors = joinResolvedBehaviors;
exports.isValidBehaviorString = isValidBehaviorString;
const grafast_1 = require("grafast");
const graphile_config_1 = require("graphile-config");
const NULL_BEHAVIOR = Object.freeze({
    behaviorString: "",
    stack: Object.freeze([]),
});
const getEntityBehaviorHooks = (plugin, type) => {
    const val = plugin.schema?.entityBehavior;
    if (!val)
        return val;
    // These might not all be hooks, some might be strings. We need to convert the strings into hooks.
    const result = Object.create(null);
    for (const [entityType, rhs] of Object.entries(val)) {
        const isArrayOfStrings = Array.isArray(rhs) && rhs.every((t) => typeof t === "string");
        if (isArrayOfStrings || typeof rhs === "string") {
            if (type === "inferred") {
                const hook = {
                    provides: ["default"],
                    before: ["inferred"],
                    callback: isArrayOfStrings
                        ? (behavior) => [...rhs, behavior]
                        : (behavior) => [rhs, behavior],
                };
                result[entityType] = hook;
            }
            else {
                // noop
            }
        }
        else if (Array.isArray(rhs)) {
            if (type === "inferred") {
                throw new Error(`Behavior of '${entityType}' was specified as an array, but not every element of the array was a string (plugin: ${plugin.name})`);
            }
            else {
                // noop
            }
        }
        else if (typeof rhs === "function") {
            if (type === "inferred") {
                const hook = {
                    provides: ["inferred"],
                    after: ["default"],
                    callback: rhs,
                };
                result[entityType] = hook;
            }
            else {
                // noop
            }
        }
        else if (rhs.inferred || rhs.override) {
            const hook = rhs[type];
            if (hook) {
                result[entityType] = hook;
            }
        }
        else {
            console.warn(`Plugin ${plugin.name} is using a deprecated or unsupported form of 'plugin.schema.entityBehavior[${JSON.stringify(entityType)}]' definition - if this is an object it should have only the keys 'inferred' and/or 'override'. This changed in graphile-build@5.0.0-beta.25.`);
            const rhsAny = rhs;
            if (rhsAny.callback) {
                if (rhsAny.provides?.includes?.("override")) {
                    if (type === "override") {
                        result[entityType] = rhsAny;
                    }
                }
                else {
                    if (type === "inferred") {
                        result[entityType] = rhsAny;
                    }
                }
            }
        }
    }
    return result;
};
const getEntityBehaviorInferredHooks = (plugin) => {
    return getEntityBehaviorHooks(plugin, "inferred");
};
const getEntityBehaviorOverrideHooks = (plugin) => {
    return getEntityBehaviorHooks(plugin, "override");
};
class Behavior {
    constructor(resolvedPreset, build) {
        this.resolvedPreset = resolvedPreset;
        this.build = build;
        this.behaviorEntityTypes = [];
        this._defaultBehaviorByEntityTypeCache = new Map();
        this.behaviorRegistry = Object.create(null);
        this.behaviorEntities = Object.create(null);
        this.registerEntity("string");
        // This will be overwritten in freeze
        this.globalDefaultBehavior = NULL_BEHAVIOR;
    }
    /**
     * Forbid registration of more global behavior defaults, behavior entity types, etc.
     */
    freeze() {
        const { resolvedPreset, build } = this;
        const plugins = (0, graphile_config_1.sortedPlugins)(resolvedPreset.plugins);
        const allEntities = new Set();
        for (const plugin of plugins) {
            const r = plugin.schema?.behaviorRegistry;
            if (r?.add) {
                for (const [key, spec] of Object.entries(r.add)) {
                    const behaviorString = key;
                    if (!this.behaviorRegistry[behaviorString]) {
                        this.behaviorRegistry[behaviorString] = {
                            entities: {},
                        };
                    }
                    const { description } = spec;
                    for (const entityType of spec.entities) {
                        allEntities.add(entityType);
                        if (!this.behaviorRegistry[behaviorString].entities[entityType]) {
                            this.behaviorRegistry[behaviorString].entities[entityType] = {
                                registeredBy: [
                                    {
                                        description,
                                        pluginName: plugin.name,
                                    },
                                ],
                            };
                        }
                        else {
                            this.behaviorRegistry[behaviorString].entities[entityType].registeredBy.push({
                                description,
                                pluginName: plugin.name,
                            });
                        }
                    }
                }
            }
        }
        const pluginDefaultBehavior = this.resolveBehavior(null, NULL_BEHAVIOR, plugins.map((p) => [
            `${p.name}.schema.globalBehavior`,
            p.schema?.globalBehavior,
        ]), build);
        const defaultBehaviorFromPreset = this.resolvedPreset.schema?.defaultBehavior ?? "";
        this.globalDefaultBehavior = {
            behaviorString: `${pluginDefaultBehavior.behaviorString} ${defaultBehaviorFromPreset}`,
            stack: [
                ...pluginDefaultBehavior.stack,
                {
                    source: "preset.schema.defaultBehavior",
                    prefix: "",
                    suffix: defaultBehaviorFromPreset,
                },
            ],
        };
        (0, graphile_config_1.orderedApply)(plugins, getEntityBehaviorInferredHooks, (hookName, hookFn, plugin) => {
            const entityType = hookName;
            if (!this.behaviorEntities[entityType]) {
                this.registerEntity(entityType);
            }
            const t = this.behaviorEntities[entityType];
            t.inferredBehaviorCallbacks.push([
                `${plugin.name}.schema.entityBehavior.${entityType}.inferred`,
                hookFn,
            ]);
        });
        (0, graphile_config_1.orderedApply)(plugins, getEntityBehaviorOverrideHooks, (hookName, hookFn, plugin) => {
            const entityType = hookName;
            if (!this.behaviorEntities[entityType]) {
                this.registerEntity(entityType);
            }
            const t = this.behaviorEntities[entityType];
            t.overrideBehaviorCallbacks.push([
                `${plugin.name}.schema.entityBehavior.${entityType}.override`,
                hookFn,
            ]);
        });
        Object.freeze(this);
        Object.freeze(this.behaviorEntities);
        for (const key of Object.keys(this.behaviorEntities)) {
            Object.freeze(this.behaviorEntities[key]);
        }
        return this;
    }
    registerEntity(entityType) {
        if (entityType === "string") {
            this.stringMatches = stringMatches;
            this.stringBehavior = (str) => str;
            return;
        }
        this.behaviorEntityTypes.push(entityType);
        this.behaviorEntities[entityType] = {
            behaviorStrings: Object.create(null),
            inferredBehaviorCallbacks: [],
            overrideBehaviorCallbacks: [],
            listCache: new Map(),
            inferredCache: new Map(),
            overrideCache: new Map(),
            fullCache: new Map(),
        };
        this[`${entityType}Matches`] = (entity, filter) => this.entityMatches(entityType, entity, filter);
        this[`${entityType}Behavior`] = (entity) => this.getBehaviorForEntity(entityType, entity).behaviorString;
    }
    assertEntity(entityType) {
        if (entityType === "string") {
            throw new Error(`Runtime behaviors cannot be attached to strings, please use 'behavior.stringMatches' directly.`);
        }
        if (!this.behaviorEntities[entityType]) {
            throw new Error(`Behavior entity type '${entityType}' is not registered; known entity types: ${Object.keys(this.behaviorEntities).join(", ")}`);
        }
    }
    // TODO: would be great if this could return `{deprecationReason: string}` too...
    /**
     * @param localBehaviorSpecsString - the behavior of the entity as determined by details on the entity itself and any applicable ancestors
     * @param filter - the behavior the plugin specifies
     */
    entityMatches(entityType, entity, filter) {
        if (!this.behaviorRegistry[filter]) {
            // DIAGNOSTIC: enable for all filters
            /*
            console.warn(
              `Behavior '${filter}' is not registered; please be sure to register it within a plugin via \`plugin.schema.behaviorRegistry.add[${JSON.stringify(
                filter,
              )}] = { description: "...", entities: [${JSON.stringify(
                entityType,
              )}] }\`.`,
            );
            // Register it so we don't see this warning again
            */
            this.behaviorRegistry[filter] = {
                entities: {
                    [entityType]: {
                        registeredBy: [],
                    },
                },
            };
        }
        else if (!Object.entries(this.behaviorRegistry).some(([bhv, { entities }]) => entities[entityType] && stringMatches(bhv, filter))) {
            console.warn(`Behavior '${filter}' is not registered for entity type '${entityType}'; it's only expected to be used with '${Object.keys(this.behaviorRegistry[filter].entities).join("', '")}'; if this usage is valid, register it within a plugin with \`plugin.schema.behaviorRegistry.add[${JSON.stringify(filter)}] = { description: "...", entities: [${JSON.stringify(entityType)}] }\`.`);
            // Register it so we don't see this warning again
            this.behaviorRegistry[filter].entities[entityType] = {
                registeredBy: [],
            };
        }
        const finalString = this.getBehaviorForEntity(entityType, entity).behaviorString;
        return stringMatches(finalString, filter);
    }
    /**
     * Given the entity `rawEntity` of type `entityType`, this function will
     * return the final behavior string for this entity, respecting all the
     * global and entity-specific behaviors.
     *
     * This is expensive to compute, so we cache it.
     *
     * **IMPORTANT**: `rawEntity` should be a fixed value so that the cache can be
     * reused. If it is a dynamic value (e.g. it's a combination of multiple
     * entities) then you should represent it as a tuple and we'll automatically
     * cache that.
     */
    getBehaviorForEntity(entityType, rawEntity) {
        this.assertEntity(entityType);
        const behaviorEntity = this.behaviorEntities[entityType];
        const { fullCache: cache } = behaviorEntity;
        const entity = Array.isArray(rawEntity)
            ? getCachedEntity(behaviorEntity.listCache, rawEntity)
            : rawEntity;
        const existing = cache.get(entity);
        if (existing !== undefined) {
            return existing;
        }
        const inferredBehavior = this.getInferredBehaviorForEntity(entityType, rawEntity);
        const overrideBehavior = this.getOverrideBehaviorForEntity(entityType, rawEntity);
        const behavior = this.getPreferencesAppliedBehaviors(entityType, inferredBehavior, overrideBehavior);
        cache.set(entity, behavior);
        return behavior;
    }
    getInferredBehaviorForEntity(entityType, rawEntity) {
        this.assertEntity(entityType);
        const behaviorEntity = this.behaviorEntities[entityType];
        const { inferredCache: cache, inferredBehaviorCallbacks: callbacks } = behaviorEntity;
        const entity = Array.isArray(rawEntity)
            ? getCachedEntity(behaviorEntity.listCache, rawEntity)
            : rawEntity;
        const existing = cache.get(entity);
        if (existing !== undefined) {
            return existing;
        }
        const behavior = this.resolveBehavior(entityType, this.globalDefaultBehavior, callbacks, entity, this.build);
        cache.set(entity, behavior);
        return behavior;
    }
    getOverrideBehaviorForEntity(entityType, rawEntity) {
        this.assertEntity(entityType);
        const behaviorEntity = this.behaviorEntities[entityType];
        const { overrideCache: cache, overrideBehaviorCallbacks: callbacks } = behaviorEntity;
        const entity = Array.isArray(rawEntity)
            ? getCachedEntity(behaviorEntity.listCache, rawEntity)
            : rawEntity;
        const existing = cache.get(entity);
        if (existing !== undefined) {
            return existing;
        }
        const behavior = this.resolveBehavior(entityType, NULL_BEHAVIOR, callbacks, entity, this.build);
        cache.set(entity, behavior);
        return behavior;
    }
    getCombinedBehaviorForEntities(entityType, sources) {
        // First; ensure that `entityType` is the last key in sources
        const keys = Object.keys(sources);
        if (keys[keys.length - 1] !== entityType || !sources[entityType]) {
            throw new Error(`The order of keys in 'sources' is significant; you must ensure that '${entityType}' is the last key in 'sources' so that it has highest precedence`);
        }
        const inferredBehaviors = keys.map((key) => this.getInferredBehaviorForEntity(key, sources[key]));
        const overrideBehaviors = keys.map((key) => this.getOverrideBehaviorForEntity(key, sources[key]));
        const behavior = this.getPreferencesAppliedBehaviors(entityType, joinResolvedBehaviors(inferredBehaviors), joinResolvedBehaviors(overrideBehaviors));
        return behavior;
    }
    getPreferencesAppliedBehaviors(entityType, inferredBehavior, overrideBehavior) {
        const defaultBehavior = this.getDefaultBehaviorFor(entityType);
        const inferredBehaviorWithPreferencesApplied = multiplyBehavior(defaultBehavior, inferredBehavior.behaviorString, entityType);
        const behaviorString = joinBehaviors([
            inferredBehaviorWithPreferencesApplied,
            overrideBehavior.behaviorString,
        ]);
        const behavior = {
            stack: [
                ...inferredBehavior.stack,
                {
                    source: `__ApplyBehaviors_${entityType}__`,
                    prefix: "",
                    suffix: `-* ${inferredBehaviorWithPreferencesApplied}`,
                },
                ...overrideBehavior.stack,
            ],
            behaviorString,
            toString() {
                return behaviorString;
            },
        };
        return behavior;
    }
    /** @deprecated Please use entityMatches or stringMatches instead */
    matches(localBehaviorSpecsString, filter, defaultBehavior = "") {
        let err;
        try {
            throw new Error("Deprecated call happened here");
        }
        catch (e) {
            err = e;
        }
        const stackText = err.stack;
        if (!warned.has(stackText)) {
            warned.add(stackText);
            console.error(`[DEPRECATION WARNING] Something in your application is using build.behavior.matches; it should be using build.behavior.pgCodecMatches / etc instead. This API will be removed before the v5.0.0 release. ${stackText}`);
        }
        const specString = Array.isArray(localBehaviorSpecsString)
            ? localBehaviorSpecsString.join(" ")
            : localBehaviorSpecsString;
        const finalBehaviorSpecsString = `${defaultBehavior} ${this.globalDefaultBehavior} ${specString ?? ""}`;
        return stringMatches(finalBehaviorSpecsString, filter);
    }
    parseBehaviorString(behaviorString) {
        return parseSpecs(behaviorString);
    }
    parseScope(filter) {
        return parseScope(filter);
    }
    resolveBehavior(entityType, initialBehavior, 
    // Misnomer; also allows strings or nothings
    callbacks, ...args) {
        let behaviorString = initialBehavior.behaviorString;
        const stack = [...initialBehavior.stack];
        for (const [source, rawG] of callbacks) {
            const oldBehavior = behaviorString;
            const g = typeof rawG === "string" ? [rawG] : rawG;
            if (Array.isArray(g)) {
                if (g.length === 0)
                    continue;
                if (behaviorString === "") {
                    behaviorString = g.join(" ");
                }
                else {
                    behaviorString = g.join(" ") + " " + behaviorString;
                }
            }
            else if (typeof g === "function") {
                const newBehavior = g(oldBehavior, ...args);
                if (!newBehavior.includes(oldBehavior)) {
                    throw new Error(`${source} callback must return a list that contains the current (passed in) behavior in addition to any other behaviors you wish to set.`);
                }
                if (Array.isArray(newBehavior)) {
                    behaviorString = joinBehaviors(newBehavior);
                }
                else {
                    behaviorString = newBehavior;
                }
            }
            const i = behaviorString.indexOf(oldBehavior);
            const prefix = behaviorString.substring(0, i);
            const suffix = behaviorString.substring(i + oldBehavior.length);
            if (prefix !== "" || suffix !== "") {
                this.validateBehavior(entityType, source, prefix);
                this.validateBehavior(entityType, source, suffix);
                stack.push({ source, prefix, suffix });
            }
        }
        return {
            stack,
            behaviorString: behaviorString,
            toString() {
                return behaviorString;
            },
        };
    }
    validateBehavior(entityType, source, behaviorString) {
        try {
            this.parseBehaviorString(behaviorString);
            if (!entityType) {
                return;
            }
        }
        catch (e) {
            throw new Error(`Failed parsing behavior string ${JSON.stringify(behaviorString)} from '${source}': ${e.message}`);
        }
    }
    getDefaultBehaviorFor(entityType) {
        if (!this._defaultBehaviorByEntityTypeCache.has(entityType)) {
            const supportedBehaviors = new Set();
            for (const [behaviorString, spec] of Object.entries(this.behaviorRegistry)) {
                /*
                 * This is `true` because of inheritance (e.g. unique inherits from
                 * resource inherits from codec); it causes a headache if we factor it
                 * in.
                 */
                const applyBehaviorsFromAllEntities = true;
                if (spec.entities[entityType] || applyBehaviorsFromAllEntities) {
                    const parts = behaviorString.split(":");
                    const l = parts.length;
                    for (let i = 0; i < l; i++) {
                        const subparts = parts.slice(i, l);
                        // We need to add all of the parent behaviors, e.g. `foo:bar:baz`
                        // should also add `bar:baz` and `baz`
                        supportedBehaviors.add(subparts.join(":"));
                    }
                }
            }
            // TODO: scope this on an entity basis
            const defaultBehaviors = this.globalDefaultBehavior;
            const behaviorString = ([...supportedBehaviors].sort().join(" ") +
                " " +
                defaultBehaviors.behaviorString).trim();
            this._defaultBehaviorByEntityTypeCache.set(entityType, behaviorString);
            return behaviorString;
        }
        return this._defaultBehaviorByEntityTypeCache.get(entityType);
    }
}
exports.Behavior = Behavior;
/**
 * Parses a scope like `query:resource:connection:filter` into it's constituent parts.
 *
 * @internal
 */
function parseScope(scopeString) {
    return scopeString.split(":");
}
/**
 * Parses a behaviorSpecs string like `+list -connection -list:filter` into a
 * list of BehaviorSpecs.
 *
 * @internal
 */
function parseSpecs(behaviorSpecsString) {
    const fragments = behaviorSpecsString.split(/\s+/);
    const specs = [];
    for (const fragment of fragments) {
        if (fragment === "")
            continue;
        // `+` is implicit
        const [pm, rest] = /^[+-]/.test(fragment)
            ? [fragment.slice(0, 1), fragment.slice(1)]
            : ["+", fragment];
        const positive = pm === "+";
        const scope = parseScope(rest);
        if (scope[scope.length - 1] === "create") {
            throw new Error(`'create' behavior is forbidden; did you mean 'insert'?`);
        }
        specs.push({ positive, scope });
    }
    return specs;
}
/**
 * Returns true if `filterScope` can be matched by `specifiedScope`.
 *
 * If `filterScope` contains an `*` then we return true if any possible
 * `filterScope` can be matched by `specifiedScope` in a positive fashion.
 *
 * @param specifiedScope - the scope the user entered, e.g. from `+query:*:filter`
 * @param filterScope - the scope the plugin says we're in, e.g. from `query:resource:connection:filter`
 *
 * @internal
 */
function scopeMatches(specifiedScope, filterScope, 
// We only need to know positive or negative in case the filter contains an `*`.
// This is because if you filter for '*:foo' against '+bar:foo -baz:foo' then
// we should skip the negative (`-baz:foo`) because we only need _one_ match,
// not *every* match.
positive) {
    if (specifiedScope.length > filterScope.length) {
        return false;
    }
    // `specifiedScope` is effectively prepended with `*:*:*:` as many times as
    // necessary to make it the same length as `filterScope`. In actuality we do
    // it more efficiently.
    const filterScopeTrimmed = specifiedScope.length === filterScope.length
        ? filterScope
        : filterScope.slice(filterScope.length - specifiedScope.length);
    // Loop through each entry, if it doesn't match then return false.
    for (let i = 0, l = filterScopeTrimmed.length; i < l; i++) {
        const rule = specifiedScope[i];
        const filter = filterScopeTrimmed[i];
        if (filter === "*" && rule !== "*" && !positive) {
            return false;
        }
        if (rule === "*" || filter === "*") {
            continue;
        }
        if (rule !== filter) {
            return false;
        }
    }
    return true;
}
function joinBehaviors(strings) {
    let str = "";
    for (const string of strings) {
        if (string != null && string !== "") {
            if (grafast_1.isDev && !isValidBehaviorString(string)) {
                throw new Error(`'${string}' is not a valid behavior string`);
            }
            if (str === "") {
                str = string;
            }
            else {
                str += " " + string;
            }
        }
    }
    return str;
}
function joinResolvedBehaviors(behaviors) {
    const stack = behaviors.flatMap((b) => b.stack);
    const behaviorString = joinBehaviors(behaviors.flatMap((b) => b.behaviorString));
    const b = {
        behaviorString,
        stack,
    };
    return b;
}
function getCachedEntity(listCache, entity) {
    const nList = listCache.get(entity.length);
    if (!nList) {
        const list = [entity];
        listCache.set(entity.length, list);
        return entity;
    }
    for (const entry of nList) {
        if ((0, grafast_1.arraysMatch)(entry, entity)) {
            return entry;
        }
    }
    nList.push(entity);
    return entity;
}
const warned = new Set();
function stringMatches(behaviorString, filter) {
    const specs = parseSpecs(behaviorString);
    const filterScope = parseScope(filter);
    if (filterScope[filterScope.length - 1] === "create") {
        throw new Error(`'create' filter scope is forbidden; did you mean 'insert'?`);
    }
    // Loop backwards through the specs
    for (let i = specs.length - 1; i >= 0; i--) {
        const { positive, scope } = specs[i];
        if (scopeMatches(scope, filterScope, positive)) {
            return positive;
        }
    }
    return undefined;
}
/**
 * We're strict with this because we want to be able to expand this in future.
 * For example I want to allow `@behavior all some` to operate the same as
 * `@behavior all\n@behavior some`. I also want to be able to add
 * `@behavior -all` to remove a previously enabled behavior.
 */
function isValidBehaviorString(behavior) {
    return (typeof behavior === "string" &&
        /^\s*([+-]?([a-zA-Z](_?[a-zA-Z0-9]+)|\*)(:([a-zA-Z](_?[a-zA-Z0-9]+)|\*))*)(\s+([+-]?([a-zA-Z](_?[a-zA-Z0-9]+)|\*)(:([a-zA-Z](_?[a-zA-Z0-9]+)|\*))*))*\s*$/.test(behavior));
}
const warnedBehaviors = [];
/*
 * 1. Take each behavior from inferred
 * 2. Find the matching behaviors from preferences
 * 3. Output for the behavior a list of behaviors formed by combining the
 *    matching behaviors. The result needs to remain at least as constrained as
 *    it already is.
 *
 * For example:
 * - Preferences: "-* +resource:list -resource:connection +query:resource:connection -query:resource:list"
 *   - AKA: turn everything off, use connections at the root, lists elsewhere
 * - Inferred: "+connection +list"
 * - Split to ["+connection", "+list"]
 * - For "+connection" (which is equivalent to `+*:*:*:connection`, remember):
 *   - "-*" becomes "-connection" (needs to remain at least as constrained as it already is)
 *   - "-resource:connection" matches and is kept
 *   - "+query:resource:connection" matches and is kept
 *   - all other behaviors ignored (don't match)
 * - For "+list":
 *   - "-*" becomes "-list"
 *   - "+resource:list" kept
 *   - "-query:resource:list" kept
 *   - all others don't match
 * - Result: concatenate these:
 *   - "-connection -resource:connection +query:resource:connection -list +resource:list -query:resource:list"
 */
function multiplyBehavior(preferences, inferred, entityType) {
    const pref = parseSpecs(preferences);
    const inf = parseSpecs(inferred);
    const result = inf.flatMap((infEntry) => {
        const final = [];
        nextPref: for (const prefEntry of pref) {
            // If it matches; new scope must be at least as constrainted as old scope
            const newScope = [];
            const l = Math.max(prefEntry.scope.length, infEntry.scope.length);
            // Does it match? Loop backwards through scope keys ensuring matches
            for (let i = 1; i <= l; i++) {
                const infScope = i <= infEntry.scope.length
                    ? infEntry.scope[infEntry.scope.length - i]
                    : "*";
                const prefScope = i <= prefEntry.scope.length
                    ? prefEntry.scope[prefEntry.scope.length - i]
                    : "*";
                const match = infScope === "*" || prefScope === "*" || infScope == prefScope;
                if (!match) {
                    // No match! Skip to next preference
                    continue nextPref;
                }
                // There was a match; ensure we're suitably constrained
                const scopeText = infScope == "*" ? prefScope : infScope;
                newScope.unshift(scopeText);
            }
            // If we get here, it must match; add our new behavior
            final.push({
                scope: newScope,
                positive: prefEntry.positive && infEntry.positive,
            });
        }
        if (final.length === 0) {
            const behavior = infEntry.scope.join(":");
            if (!warnedBehaviors.includes(behavior)) {
                warnedBehaviors.push(behavior);
                console.warn(`No matches for behavior '${behavior}' - please ensure that this behavior is registered for entity type '${entityType}'`);
            }
        }
        return final;
    });
    const behaviorString = result
        .map((r) => `${r.positive ? "" : "-"}${r.scope.join(":")}`)
        .join(" ");
    return behaviorString;
}
//# sourceMappingURL=behavior.js.map