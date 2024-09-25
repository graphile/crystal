import { arraysMatch, isDev } from "grafast";
import { orderedApply, sortedPlugins } from "graphile-config";

import { version } from "./version.js";

type BehaviorScope = string[];
interface BehaviorSpec {
  positive: boolean;
  scope: BehaviorScope;
}

const NULL_BEHAVIOR: ResolvedBehavior = Object.freeze({
  behaviorString: "" as GraphileBuild.BehaviorString,
  stack: Object.freeze([]),
});

const getEntityBehaviorHooks = (
  plugin: GraphileConfig.Plugin,
  type: "inferred" | "override",
) => {
  const val = plugin.schema?.entityBehavior;
  if (!val) return val;
  // These might not all be hooks, some might be strings. We need to convert the strings into hooks.
  const result: {
    [entityType in keyof GraphileBuild.BehaviorEntities]: GraphileBuild.EntityBehaviorHook<entityType>;
  } = Object.create(null);
  for (const [entityType, rhs] of Object.entries(val)) {
    const isArrayOfStrings =
      Array.isArray(rhs) && rhs.every((t) => typeof t === "string");
    if (isArrayOfStrings || typeof rhs === "string") {
      if (type === "inferred") {
        const hook: GraphileBuild.EntityBehaviorHook<
          keyof GraphileBuild.BehaviorEntities
        > = {
          provides: ["default"],
          before: ["inferred"],
          callback: isArrayOfStrings
            ? (behavior) => [...rhs, behavior]
            : (behavior) => [rhs as GraphileBuild.BehaviorString, behavior],
        };
        result[entityType as keyof GraphileBuild.BehaviorEntities] = hook;
      } else {
        // noop
      }
    } else if (Array.isArray(rhs)) {
      if (type === "inferred") {
        throw new Error(
          `Behavior of '${entityType}' was specified as an array, but not every element of the array was a string (plugin: ${plugin.name})`,
        );
      } else {
        // noop
      }
    } else if (typeof rhs === "function") {
      if (type === "inferred") {
        const hook: GraphileBuild.EntityBehaviorHook<
          keyof GraphileBuild.BehaviorEntities
        > = {
          provides: ["inferred"],
          after: ["default"],
          callback: rhs,
        };
        result[entityType as keyof GraphileBuild.BehaviorEntities] = hook;
      } else {
        // noop
      }
    } else {
      const hook = rhs[type];
      if (hook) {
        result[entityType as keyof GraphileBuild.BehaviorEntities] = hook;
      }
    }
  }
  return result;
};
const getEntityBehaviorInferredHooks = (plugin: GraphileConfig.Plugin) => {
  return getEntityBehaviorHooks(plugin, "inferred");
};
const getEntityBehaviorOverrideHooks = (plugin: GraphileConfig.Plugin) => {
  return getEntityBehaviorHooks(plugin, "override");
};

export type BehaviorDynamicMethods = {
  [entityType in keyof GraphileBuild.BehaviorEntities as `${entityType}Matches`]: (
    entity: GraphileBuild.BehaviorEntities[entityType],
    filter: string,
  ) => boolean | undefined;
} & {
  [entityType in keyof GraphileBuild.BehaviorEntities as `${entityType}Behavior`]: (
    entity: GraphileBuild.BehaviorEntities[entityType],
  ) => string;
};

export class Behavior {
  private behaviorEntities: {
    [entityType in keyof GraphileBuild.BehaviorEntities]: {
      behaviorStrings: Record<string, { description: string }>;
      inferredBehaviorCallbacks: Array<
        [
          source: string,
          callback: (
            behavior: string,
            entity: GraphileBuild.BehaviorEntities[entityType],
            build: GraphileBuild.Build,
          ) => string | string[],
        ]
      >;
      overrideBehaviorCallbacks: Array<
        [
          source: string,
          callback: (
            behavior: string,
            entity: GraphileBuild.BehaviorEntities[entityType],
            build: GraphileBuild.Build,
          ) => string | string[],
        ]
      >;
      listCache: Map<number, any[][]>;
      inferredCache: Map<
        GraphileBuild.BehaviorEntities[entityType],
        ResolvedBehavior
      >;
      overrideCache: Map<
        GraphileBuild.BehaviorEntities[entityType],
        ResolvedBehavior
      >;
      fullCache: Map<
        GraphileBuild.BehaviorEntities[entityType],
        ResolvedBehavior
      >;
    };
  };

  private behaviorRegistry: {
    [behavior in keyof GraphileBuild.BehaviorStrings]: {
      entities: {
        [entity in keyof GraphileBuild.BehaviorEntities]?: {
          description: string;
          pluginName: string;
        };
      };
    };
  };

  public behaviorEntityTypes: (keyof GraphileBuild.BehaviorEntities)[] = [];

  private globalDefaultBehavior: ResolvedBehavior;

  constructor(
    private resolvedPreset: GraphileConfig.ResolvedPreset,
    private build: GraphileBuild.Build,
  ) {
    this.behaviorRegistry = Object.create(null);
    this.behaviorEntities = Object.create(null);
    this.registerEntity("string");
    // This will be overwritten in freeze
    this.globalDefaultBehavior = NULL_BEHAVIOR;
  }

  /**
   * Forbid registration of more global behavior defaults, behavior entity types, etc.
   */
  public freeze(): Behavior & BehaviorDynamicMethods {
    const { resolvedPreset, build } = this;
    const plugins = sortedPlugins(resolvedPreset.plugins);

    const allEntities = new Set<keyof GraphileBuild.BehaviorEntities>();

    for (const plugin of plugins) {
      const r = plugin.schema?.behaviorRegistry;
      if (r?.add) {
        for (const [key, spec] of Object.entries(r.add)) {
          const behaviorString = key as keyof GraphileBuild.BehaviorStrings;
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
                description,
                pluginName: plugin.name,
              };
            } else {
              console.warn(
                `Behavior string '${behaviorString}' for entity type '${entityType}' has been registered by more than one plugin! First registered by ${
                  this.behaviorRegistry[behaviorString].entities[entityType]!
                    .pluginName
                }; and then later again by ${plugin.name}`,
              );
            }
          }
        }
      }
    }

    const defaultBehaviorFromPreset =
      this.resolvedPreset.schema?.defaultBehavior ?? "";
    const resolvedDefaultBehavior: ResolvedBehavior = {
      behaviorString: defaultBehaviorFromPreset as GraphileBuild.BehaviorString,
      stack: [
        {
          source: "preset.schema.defaultBehavior",
          prefix: defaultBehaviorFromPreset,
          suffix: "",
        },
      ],
    };
    this.globalDefaultBehavior = this.resolveBehavior(
      null,
      resolvedDefaultBehavior,
      plugins.map((p) => [
        `${p.name}.schema.globalBehavior`,
        p.schema?.globalBehavior,
      ]),
      build,
    );

    orderedApply(
      plugins,
      getEntityBehaviorInferredHooks,
      (hookName, hookFn, plugin) => {
        const entityType = hookName as keyof GraphileBuild.BehaviorEntities;
        if (!this.behaviorEntities[entityType]) {
          this.registerEntity(entityType);
        }
        const t = this.behaviorEntities[entityType];
        t.inferredBehaviorCallbacks.push([
          `${plugin.name}.schema.entityBehavior.${entityType}.inferred`,
          hookFn,
        ]);
      },
    );

    orderedApply(
      plugins,
      getEntityBehaviorOverrideHooks,
      (hookName, hookFn, plugin) => {
        const entityType = hookName as keyof GraphileBuild.BehaviorEntities;
        if (!this.behaviorEntities[entityType]) {
          this.registerEntity(entityType);
        }
        const t = this.behaviorEntities[entityType];
        t.overrideBehaviorCallbacks.push([
          `${plugin.name}.schema.entityBehavior.${entityType}.override`,
          hookFn,
        ]);
      },
    );

    Object.freeze(this);
    Object.freeze(this.behaviorEntities);
    for (const key of Object.keys(this.behaviorEntities)) {
      Object.freeze(
        this.behaviorEntities[key as keyof typeof this.behaviorEntities],
      );
    }
    return this as this & BehaviorDynamicMethods;
  }

  private registerEntity<
    TEntityType extends keyof GraphileBuild.BehaviorEntities,
  >(entityType: TEntityType) {
    if (entityType === ("string" as any)) {
      (this as this & BehaviorDynamicMethods).stringMatches = stringMatches;
      (this as this & BehaviorDynamicMethods).stringBehavior = (str) => str;
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
    (this as this & BehaviorDynamicMethods)[`${entityType}Matches`] = (
      entity: GraphileBuild.BehaviorEntities[TEntityType],
      behavior: string,
    ): boolean | undefined => this.entityMatches(entityType, entity, behavior);
    (this as this & BehaviorDynamicMethods)[`${entityType}Behavior`] = (
      entity: GraphileBuild.BehaviorEntities[TEntityType],
    ): string => this.getBehaviorForEntity(entityType, entity).behaviorString;
  }

  private assertEntity<
    TEntityType extends keyof GraphileBuild.BehaviorEntities,
  >(entityType: TEntityType) {
    if (entityType === "string") {
      throw new Error(
        `Runtime behaviors cannot be attached to strings, please use 'behavior.stringMatches' directly.`,
      );
    }
    if (!this.behaviorEntities[entityType]) {
      throw new Error(
        `Behavior entity type '${entityType}' is not registered; known entity types: ${Object.keys(
          this.behaviorEntities,
        ).join(", ")}`,
      );
    }
  }

  // TODO: would be great if this could return `{deprecationReason: string}` too...
  /**
   * @param localBehaviorSpecsString - the behavior of the entity as determined by details on the entity itself and any applicable ancestors
   * @param filter - the behavior the plugin specifies
   */
  public entityMatches<
    TEntityType extends keyof GraphileBuild.BehaviorEntities,
  >(
    entityType: TEntityType,
    entity: GraphileBuild.BehaviorEntities[TEntityType],
    filter: string,
  ): boolean | undefined {
    const finalString = this.getBehaviorForEntity(
      entityType,
      entity,
    ).behaviorString;
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
  public getBehaviorForEntity<
    TEntityType extends keyof GraphileBuild.BehaviorEntities,
  >(
    entityType: TEntityType,
    rawEntity: GraphileBuild.BehaviorEntities[TEntityType],
  ): ResolvedBehavior {
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
    const inferredBehavior = this.getInferredBehaviorForEntity(
      entityType,
      rawEntity,
    );
    const overrideBehavior = this.getOverrideBehaviorForEntity(
      entityType,
      rawEntity,
    );
    const behavior = this.getPreferencesAppliedBehaviors(
      entityType,
      inferredBehavior,
      overrideBehavior,
    );
    cache.set(entity, behavior);
    return behavior;
  }

  public getInferredBehaviorForEntity<
    TEntityType extends keyof GraphileBuild.BehaviorEntities,
  >(
    entityType: TEntityType,
    rawEntity: GraphileBuild.BehaviorEntities[TEntityType],
  ): ResolvedBehavior {
    this.assertEntity(entityType);
    const behaviorEntity = this.behaviorEntities[entityType];
    const { inferredCache: cache, inferredBehaviorCallbacks: callbacks } =
      behaviorEntity;

    const entity = Array.isArray(rawEntity)
      ? getCachedEntity(behaviorEntity.listCache, rawEntity)
      : rawEntity;
    const existing = cache.get(entity);
    if (existing !== undefined) {
      return existing;
    }
    const behavior = this.resolveBehavior(
      entityType,
      NULL_BEHAVIOR,
      callbacks,
      entity,
      this.build,
    );
    cache.set(entity, behavior);
    return behavior;
  }

  public getOverrideBehaviorForEntity<
    TEntityType extends keyof GraphileBuild.BehaviorEntities,
  >(
    entityType: TEntityType,
    rawEntity: GraphileBuild.BehaviorEntities[TEntityType],
  ): ResolvedBehavior {
    this.assertEntity(entityType);
    const behaviorEntity = this.behaviorEntities[entityType];
    const { overrideCache: cache, overrideBehaviorCallbacks: callbacks } =
      behaviorEntity;

    const entity = Array.isArray(rawEntity)
      ? getCachedEntity(behaviorEntity.listCache, rawEntity)
      : rawEntity;
    const existing = cache.get(entity);
    if (existing !== undefined) {
      return existing;
    }
    const behavior = this.resolveBehavior(
      entityType,
      NULL_BEHAVIOR,
      callbacks,
      entity,
      this.build,
    );
    cache.set(entity, behavior);
    return behavior;
  }

  public getCombinedBehaviorForEntities<
    TEntityType extends keyof GraphileBuild.BehaviorEntities,
  >(
    entityType: TEntityType,
    sources: {
      [entityType in keyof GraphileBuild.BehaviorEntities]?: GraphileBuild.BehaviorEntities[entityType];
    },
  ): ResolvedBehavior {
    // First; ensure that `entityType` is the last key in sources
    const keys = Object.keys(sources);
    if (keys[keys.length - 1] !== entityType || !sources[entityType]) {
      throw new Error(
        `The order of keys in 'sources' is significant; you must ensure that '${entityType}' is the last key in 'sources' so that it has highest precedence`,
      );
    }
    const inferredBehaviors = keys.map((key) =>
      this.getInferredBehaviorForEntity(
        key as keyof GraphileBuild.BehaviorEntities,
        sources[
          key as keyof GraphileBuild.BehaviorEntities
        ] as GraphileBuild.BehaviorEntities[keyof GraphileBuild.BehaviorEntities],
      ),
    );
    const overrideBehaviors = keys.map((key) =>
      this.getOverrideBehaviorForEntity(
        key as keyof GraphileBuild.BehaviorEntities,
        sources[
          key as keyof GraphileBuild.BehaviorEntities
        ] as GraphileBuild.BehaviorEntities[keyof GraphileBuild.BehaviorEntities],
      ),
    );
    const behavior = this.getPreferencesAppliedBehaviors(
      entityType,
      joinResolvedBehaviors(inferredBehaviors),
      joinResolvedBehaviors(overrideBehaviors),
    );
    return behavior;
  }

  getPreferencesAppliedBehaviors<
    TEntityType extends keyof GraphileBuild.BehaviorEntities,
  >(
    entityType: TEntityType,
    inferredBehavior: ResolvedBehavior,
    overrideBehavior: ResolvedBehavior,
  ) {
    const defaultBehavior = this.getDefaultBehaviorFor(entityType);
    const inferredBehaviorWithPreferencesApplied = multiplyBehavior(
      defaultBehavior,
      inferredBehavior.behaviorString,
      entityType,
    );
    const behaviorString = joinBehaviors([
      inferredBehaviorWithPreferencesApplied,
      overrideBehavior.behaviorString,
    ]);
    const behavior: ResolvedBehavior = {
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
  public matches(
    localBehaviorSpecsString: string | string[] | null | undefined,
    filter: string,
    defaultBehavior = "",
  ): boolean | undefined {
    let err: Error;
    try {
      throw new Error("Deprecated call happened here");
    } catch (e) {
      err = e;
    }
    const stackText = err.stack!;
    if (!warned.has(stackText)) {
      warned.add(stackText);
      console.error(
        `[DEPRECATION WARNING] Something in your application is using build.behavior.matches; it should be using build.behavior.pgCodecMatches / etc instead. This API will be removed before the v5.0.0 release. ${stackText}`,
      );
    }
    const specString = Array.isArray(localBehaviorSpecsString)
      ? localBehaviorSpecsString.join(" ")
      : localBehaviorSpecsString;
    const finalBehaviorSpecsString = `${defaultBehavior} ${
      this.globalDefaultBehavior
    } ${specString ?? ""}`;
    return stringMatches(finalBehaviorSpecsString, filter);
  }

  parseBehaviorString(behaviorString: string) {
    return parseSpecs(behaviorString);
  }

  parseScope(filter: string) {
    return parseScope(filter);
  }

  private resolveBehavior<TArgs extends [...any[]]>(
    entityType: keyof GraphileBuild.BehaviorEntities | null,
    initialBehavior: ResolvedBehavior,
    // Misnomer; also allows strings or nothings
    callbacks: ReadonlyArray<
      [
        source: string,
        callback:
          | string
          | null
          | undefined
          | ((behavior: string, ...args: TArgs) => string | string[]),
      ]
    >,
    ...args: TArgs
  ): ResolvedBehavior {
    let behaviorString: string = initialBehavior.behaviorString;
    const stack: Array<StackItem> = [...initialBehavior.stack];

    for (const [source, g] of callbacks) {
      const oldBehavior = behaviorString;
      if (typeof g === "string") {
        if (g === "") {
          continue;
        } else if (behaviorString === "") {
          behaviorString = g;
        } else {
          behaviorString = g + " " + behaviorString;
        }
      } else if (typeof g === "function") {
        const newBehavior = g(oldBehavior, ...args);
        if (!newBehavior.includes(oldBehavior)) {
          throw new Error(
            `${source} callback must return a list that contains the current (passed in) behavior in addition to any other behaviors you wish to set.`,
          );
        }
        if (Array.isArray(newBehavior)) {
          behaviorString = joinBehaviors(newBehavior);
        } else {
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
      behaviorString: behaviorString as GraphileBuild.BehaviorString,
      toString() {
        return behaviorString;
      },
    };
  }

  private validateBehavior(
    entityType: keyof GraphileBuild.BehaviorEntities | null,
    source: string,
    behaviorString: string,
  ): void /*asserts behaviorString is GraphileBuild.BehaviorString*/ {
    const result = this.parseBehaviorString(behaviorString);
    if (!entityType) {
      return;
    }
    for (const { scope } of result) {
      const behavior = scope.join(":") as keyof GraphileBuild.BehaviorStrings;
      if (
        !Object.keys(this.behaviorRegistry).some((bhv) =>
          stringMatches(bhv, behavior),
        )
      ) {
        console.trace(
          `Behavior '${behavior}' has not been registered! (Source: ${source})`,
        );
      }

      if (
        !Object.entries(this.behaviorRegistry).some(([bhv, { entities }]) =>
          /*entities[entityType] &&*/ stringMatches(bhv, behavior),
        )
      ) {
        console.trace(
          `Behavior '${behavior}' is not registered for entity type '${entityType}'; it's only expected to be used with '${Object.keys(
            this.behaviorRegistry[behavior].entities,
          ).join("', '")}'. (Source: ${source})`,
        );
      }
    }
  }

  _defaultBehaviorByEntityTypeCache = new Map<
    keyof GraphileBuild.BehaviorEntities,
    string
  >();
  getDefaultBehaviorFor(entityType: keyof GraphileBuild.BehaviorEntities) {
    if (!this._defaultBehaviorByEntityTypeCache.has(entityType)) {
      const supportedBehaviors = new Set<string>();

      for (const [behaviorString, spec] of Object.entries(
        this.behaviorRegistry,
      )) {
        if (
          spec.entities[entityType] ||
          true /* This ` || true` is because of inheritance (e.g. unique inherits from resource inherits from codec); it causes a headache if we factor it in */
        ) {
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

      const behaviorString = (
        [...supportedBehaviors].sort().join(" ") +
        " " +
        defaultBehaviors.behaviorString
      ).trim();
      this._defaultBehaviorByEntityTypeCache.set(entityType, behaviorString);
      return behaviorString;
    }
    return this._defaultBehaviorByEntityTypeCache.get(entityType)!;
  }
}

/**
 * Parses a scope like `query:resource:connection:filter` into it's constituent parts.
 *
 * @internal
 */
function parseScope(scopeString: string): BehaviorScope {
  return scopeString.split(":");
}

/**
 * Parses a behaviorSpecs string like `+list -connection -list:filter` into a
 * list of BehaviorSpecs.
 *
 * @internal
 */
function parseSpecs(behaviorSpecsString: string): BehaviorSpec[] {
  const fragments = behaviorSpecsString.split(/\s+/);
  const specs: BehaviorSpec[] = [];
  for (const fragment of fragments) {
    if (fragment === "") continue;
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
function scopeMatches(
  specifiedScope: BehaviorScope,
  filterScope: BehaviorScope,
  // We only need to know positive or negative in case the filter contains an `*`.
  // This is because if you filter for '*:foo' against '+bar:foo -baz:foo' then
  // we should skip the negative (`-baz:foo`) because we only need _one_ match,
  // not *every* match.
  positive: boolean,
): boolean {
  if (specifiedScope.length > filterScope.length) {
    return false;
  }

  // `specifiedScope` is effectively prepended with `*:*:*:` as many times as
  // necessary to make it the same length as `filterScope`. In actuality we do
  // it more efficiently.
  const filterScopeTrimmed =
    specifiedScope.length === filterScope.length
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

export function joinBehaviors(
  strings: ReadonlyArray<string | null | undefined>,
): GraphileBuild.BehaviorString {
  let str = "";
  for (const string of strings) {
    if (string != null && string !== "") {
      if (isDev && !isValidBehaviorString(string)) {
        throw new Error(`'${string}' is not a valid behavior string`);
      }
      if (str === "") {
        str = string;
      } else {
        str += " " + string;
      }
    }
  }
  return str as GraphileBuild.BehaviorString;
}

export function joinResolvedBehaviors(
  behaviors: ReadonlyArray<ResolvedBehavior>,
): ResolvedBehavior {
  const stack: StackItem[] = behaviors.flatMap((b) => b.stack);
  const behaviorString = joinBehaviors(
    behaviors.flatMap((b) => b.behaviorString),
  );
  const b: ResolvedBehavior = {
    behaviorString,
    stack,
  };
  return b;
}

interface StackItem {
  source: string;
  prefix: string;
  suffix: string;
}

interface ResolvedBehavior {
  stack: ReadonlyArray<StackItem>;
  behaviorString: GraphileBuild.BehaviorString;
  toString(): string;
}

function getCachedEntity<T extends any[]>(
  listCache: Map<number, any[][]>,
  entity: T,
): T {
  const nList = listCache.get(entity.length);
  if (!nList) {
    const list = [entity];
    listCache.set(entity.length, list);
    return entity;
  }
  for (const entry of nList) {
    if (arraysMatch(entry, entity)) {
      return entry as T;
    }
  }
  nList.push(entity);
  return entity;
}

const warned = new Set<string>();

function stringMatches(
  behaviorString: string,
  filter: string,
): boolean | undefined {
  const specs = parseSpecs(behaviorString);
  const filterScope = parseScope(filter);
  if (filterScope[filterScope.length - 1] === "create") {
    throw new Error(
      `'create' filter scope is forbidden; did you mean 'insert'?`,
    );
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
export function isValidBehaviorString(
  behavior: unknown,
): behavior is GraphileBuild.BehaviorString {
  return (
    typeof behavior === "string" &&
    /^[+-]?([a-zA-Z](?:[_:]?[a-zA-Z0-9])+|\*)(?:\s+[+-]?(?:[a-zA-Z]([_:]?[a-zA-Z0-9])+|\*))*$/.test(
      behavior,
    )
  );
}

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
function multiplyBehavior(
  preferences: string,
  inferred: string,
  entityType: string,
) {
  const pref = parseSpecs(preferences);
  const inf = parseSpecs(inferred);
  const result = inf.flatMap((infEntry) => {
    const final: BehaviorSpec[] = [];
    nextPref: for (const prefEntry of pref) {
      // If it matches; new scope must be at least as constrainted as old scope
      const newScope: BehaviorScope = [];
      const l = Math.max(prefEntry.scope.length, infEntry.scope.length);
      // Does it match? Loop backwards through scope keys ensuring matches
      for (let i = 1; i <= l; i++) {
        const infScope =
          i <= infEntry.scope.length
            ? infEntry.scope[infEntry.scope.length - i]
            : "*";
        const prefScope =
          i <= prefEntry.scope.length
            ? prefEntry.scope[prefEntry.scope.length - i]
            : "*";
        const match =
          infScope === "*" || prefScope === "*" || infScope == prefScope;

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
      console.warn(
        `No matches for behavior '${infEntry.scope.join(
          ":",
        )}' - please ensure that this behavior is registered for entity type '${entityType}'`,
      );
    }
    return final;
  });

  const behaviorString = result
    .map((r) => `${r.positive ? "" : "-"}${r.scope.join(":")}`)
    .join(" ");
  return behaviorString as GraphileBuild.BehaviorString;
}
