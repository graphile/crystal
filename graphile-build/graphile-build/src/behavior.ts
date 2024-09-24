import { arraysMatch } from "grafast";
import { orderedApply, sortedPlugins } from "graphile-config";

import { version } from "./version.js";

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
    const lhs = entry[1] as GraphileBuild.BehaviorString;
    const isArrayOfStrings =
      Array.isArray(lhs) && lhs.every((t) => typeof t === "string");
    if (isArrayOfStrings || typeof lhs === "string") {
      const hook: Exclude<
        NonNullable<
          NonNullable<GraphileConfig.Plugin["schema"]>["entityBehavior"]
        >[keyof GraphileBuild.BehaviorEntities],
        string
      > = {
        provides: ["default"],
        before: ["inferred", "override"],
        callback: isArrayOfStrings
          ? (behavior) => [...lhs, behavior]
          : (behavior) => [lhs, behavior],
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
      behaviorStrings: Record<string, { description: string }>;
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

    const defaultBehaviorByEntityTypeCache = new Map<
      keyof GraphileBuild.BehaviorEntities,
      string
    >();
    const getDefaultBehaviorFor = (
      entityType: keyof GraphileBuild.BehaviorEntities,
    ) => {
      if (!defaultBehaviorByEntityTypeCache.has(entityType)) {
        const supportedBehaviors = (
          Object.keys(
            this.behaviorRegistry,
          ) as (keyof GraphileBuild.BehaviorStrings)[]
        ).filter((k) => this.behaviorRegistry[k].entities[entityType]);

        // TODO: scope this on an entity basis
        const defaultBehaviors = this.globalDefaultBehavior;

        const behaviorString = (
          supportedBehaviors.join(" ") +
          " " +
          defaultBehaviors.behaviorString
        ).trim();
        defaultBehaviorByEntityTypeCache.set(entityType, behaviorString);
        return behaviorString;
      }
      return defaultBehaviorByEntityTypeCache.get(entityType)!;
    };

    plugins.unshift({
      name: "_GraphileBuildBehaviorSystemApplyPreferencesPlugin",
      version,
      description:
        "This is a built-in plugin designed to apply preferences to the systems" +
        " inferred behaviors; it runs for each `entityBehavior` after 'default'" +
        " and 'inferred', but before 'override'.",

      schema: {
        entityBehavior: Object.fromEntries(
          [...allEntities].map((entityType) => {
            return [
              entityType,
              {
                after: ["default", "inferred"],
                before: ["override"],
                provides: ["preferences"],
                callback(behavior, entity) {
                  const defaultBehavior = getDefaultBehaviorFor(entityType);
                  return [
                    behavior,
                    multiplyBehavior(defaultBehavior, behavior),
                  ];
                },
              },
            ];
          }),
        ),
      },
    });

    const initialBehavior = resolvedPreset.schema?.defaultBehavior ?? "";
    this.globalDefaultBehavior = this.resolveBehavior(
      null,
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

    orderedApply(
      plugins,
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
    this.behaviorEntityTypes.push(entityType);
    this.behaviorEntities[entityType] = {
      behaviorStrings: Object.create(null),
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
    const behavior = this.resolveBehavior(
      entityType,
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
        this.validateBehavior(entityType, source, prefix);
        this.validateBehavior(entityType, source, suffix);
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
      if (!this.behaviorRegistry[behavior]) {
        console.trace(
          `Behavior '${behavior}' has not been registered! (Source: ${source})`,
        );
      }

      if (
        !Object.entries(this.behaviorRegistry).some(
          ([bhv, { entities }]) =>
            (entities[entityType] && bhv === behavior) ||
            bhv.endsWith(":" + behavior),
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
function multiplyBehavior(preferences: string, inferred: string) {
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
    return final;
  });

  const behaviorString = result
    .map((r) => `${r.positive ? "" : "-"}${r.scope.join(":")}`)
    .join(" ");
  return behaviorString;
}
