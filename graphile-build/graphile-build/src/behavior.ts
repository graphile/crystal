import { arraysMatch } from "grafast";
import { applyHooks, sortedPlugins } from "graphile-config";

type BehaviorScope = string[];
interface BehaviorSpec {
  positive: boolean;
  scope: BehaviorScope;
}

const NULL_BEHAVIOR: ResolvedBehavior = Object.freeze({
  behaviorString: "",
  stack: Object.freeze([]),
});

const getEntityBehaviorHooks = (plugin: GraphileConfig.Plugin) => {
  const val = plugin.schema?.entityBehavior;
  if (!val) return val;
  // These might not all be hooks, some might be strings. We need to convert the strings into hooks.
  const entries = Object.entries(val);
  let changed = false;
  for (const entry of entries) {
    const lhs = entry[1];
    if (typeof lhs === "string") {
      const hook: Exclude<
        NonNullable<
          NonNullable<GraphileConfig.Plugin["schema"]>["entityBehavior"]
        >[keyof GraphileBuild.BehaviorEntities],
        string
      > = {
        provides: ["default"],
        before: ["inferred"],
        callback: (behavior) => [lhs, behavior],
      };
      entry[1] = hook;
      changed = true;
    }
  }
  if (changed) {
    return Object.fromEntries(entries) as any;
  } else {
    return val;
  }
};

export type BehaviorDynamicMethods = {
  [entityType in keyof GraphileBuild.BehaviorEntities as `${entityType}Matches`]: (
    entity: GraphileBuild.BehaviorEntities[entityType],
    filter: string,
  ) => boolean | undefined;
} & {
  [entityType in keyof GraphileBuild.BehaviorEntities as `${entityType}Behavior`]: (
    entity: GraphileBuild.BehaviorEntities[entityType],
    applyDefaultBehavior?: boolean,
  ) => string;
};

export class Behavior {
  private behaviorEntities: {
    [entityType in keyof GraphileBuild.BehaviorEntities]: {
      behaviorCallbacks: Array<
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
      cacheWithDefault: Map<
        GraphileBuild.BehaviorEntities[entityType],
        ResolvedBehavior
      >;
      cacheWithoutDefault: Map<
        GraphileBuild.BehaviorEntities[entityType],
        ResolvedBehavior
      >;
    };
  };

  private globalDefaultBehavior: ResolvedBehavior;
  constructor(
    private resolvedPreset: GraphileConfig.ResolvedPreset,
    private build: GraphileBuild.Build,
  ) {
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

    const initialBehavior = resolvedPreset.schema?.defaultBehavior ?? "";
    this.globalDefaultBehavior = resolveBehavior(
      initialBehavior
        ? {
            behaviorString: initialBehavior,
            stack: [
              {
                source: "preset.schema.defaultBehavior",
                prefix: initialBehavior,
                suffix: "",
              },
            ],
          }
        : { behaviorString: "", stack: [] },
      plugins.map((p) => [
        `${p.name}.schema.globalBehavior`,
        p.schema?.globalBehavior,
      ]),
      build,
    );

    applyHooks(
      resolvedPreset.plugins,
      getEntityBehaviorHooks,
      (hookName, hookFn, plugin) => {
        const entityType = hookName as keyof GraphileBuild.BehaviorEntities;
        if (!this.behaviorEntities[entityType]) {
          this.registerEntity(entityType);
        }
        const t = this.behaviorEntities[entityType];
        t.behaviorCallbacks.push([
          `${plugin.name}.schema.entityBehavior.${entityType}`,
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
    this.behaviorEntities[entityType] = {
      behaviorCallbacks: [],
      listCache: new Map(),
      cacheWithDefault: new Map(),
      cacheWithoutDefault: new Map(),
    };
    (this as this & BehaviorDynamicMethods)[`${entityType}Matches`] = (
      entity: GraphileBuild.BehaviorEntities[TEntityType],
      behavior: string,
    ): boolean | undefined => this.entityMatches(entityType, entity, behavior);
    (this as this & BehaviorDynamicMethods)[`${entityType}Behavior`] = (
      entity: GraphileBuild.BehaviorEntities[TEntityType],
      applyDefaultBehavior = true,
    ): string =>
      this.getBehaviorForEntity(entityType, entity, applyDefaultBehavior)
        .behaviorString;
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
    applyDefaultBehavior = true,
  ) {
    this.assertEntity(entityType);
    const { cacheWithDefault, cacheWithoutDefault, listCache } =
      this.behaviorEntities[entityType];
    const cache = applyDefaultBehavior ? cacheWithDefault : cacheWithoutDefault;
    const entity = Array.isArray(rawEntity)
      ? getCachedEntity(listCache, rawEntity)
      : rawEntity;
    const existing = cache.get(entity);
    if (existing !== undefined) {
      return existing;
    }
    const behaviorEntity = this.behaviorEntities[entityType];
    const behavior = resolveBehavior(
      applyDefaultBehavior ? this.globalDefaultBehavior : NULL_BEHAVIOR,
      behaviorEntity.behaviorCallbacks,
      entity,
      this.build,
    );
    cache.set(entity, behavior);
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
): string {
  let str = "";
  for (const string of strings) {
    if (string != null && string !== "") {
      if (str === "") {
        str = string;
      } else {
        str += " " + string;
      }
    }
  }
  return str;
}

interface StackItem {
  source: string;
  prefix: string;
  suffix: string;
}

interface ResolvedBehavior {
  stack: ReadonlyArray<StackItem>;
  behaviorString: string;
}

function resolveBehavior<TArgs extends [...any[]]>(
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
) {
  let behaviorString = initialBehavior.behaviorString;
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
      stack.push({ source, prefix, suffix });
    }
  }
  return {
    stack,
    behaviorString,
    toString() {
      return behaviorString;
    },
  };
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
