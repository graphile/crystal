import { applyHooks, sortedPlugins } from "graphile-config";

type BehaviorScope = string[];
interface BehaviorSpec {
  positive: boolean;
  scope: BehaviorScope;
}

const getEntityBehaviorHooks = (plugin: GraphileConfig.Plugin) => {
  const val = plugin.schema?.entityBehavior;
  if (val) {
    const entries = Object.entries(val);
    let changed = false;
    for (const entry of entries) {
      const rhs = entry[1];
      if (typeof rhs === "string") {
        const hook: Exclude<
          NonNullable<
            NonNullable<GraphileConfig.Plugin["schema"]>["entityBehavior"]
          >[keyof GraphileBuild.BehaviorEntities],
          string
        > = {
          provides: ["default"],
          before: ["inferred"],
          callback: () => rhs,
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
  }
  return val;
};

export class Behavior {
  private behaviorEntities: {
    [entityType in keyof GraphileBuild.BehaviorEntities]: {
      defaultBehavior: string;
      behaviorCallbacks: Array<
        (
          entity: GraphileBuild.BehaviorEntities[entityType],
          resolvedPreset: GraphileConfig.ResolvedPreset,
        ) => string
      >;
      cache: Map<GraphileBuild.BehaviorEntities[entityType], string>;
    };
  };

  private globalDefaultBehavior: string;
  constructor(private resolvedPreset: GraphileConfig.ResolvedPreset) {
    this.behaviorEntities = Object.create(null);
    const globalBehaviors: string[] = [];

    for (const plugin of sortedPlugins(resolvedPreset.plugins)) {
      if (plugin.schema?.globalBehavior) {
        globalBehaviors.push(plugin.schema.globalBehavior(resolvedPreset));
      }
    }

    applyHooks(
      resolvedPreset.plugins,
      getEntityBehaviorHooks,
      (hookName, hookFn, _plugin) => {
        const entityType = hookName as keyof GraphileBuild.BehaviorEntities;
        if (!this.behaviorEntities[entityType]) {
          this.registerEntity(entityType);
        }
        const t = this.behaviorEntities[entityType];
        t.behaviorCallbacks.push(hookFn);
      },
    );
    this.globalDefaultBehavior = joinBehaviors([
      ...globalBehaviors,
      this.resolvedPreset.schema?.defaultBehavior,
    ]);
    this.freeze();
  }

  /**
   * Forbid registration of more global behavior defaults, behavior entity types, etc.
   */
  public freeze() {
    Object.freeze(this);
    Object.freeze(this.behaviorEntities);
    for (const key of Object.keys(this.behaviorEntities)) {
      Object.freeze(
        this.behaviorEntities[key as keyof typeof this.behaviorEntities],
      );
    }
  }

  private registerEntity<
    TEntityType extends keyof GraphileBuild.BehaviorEntities,
  >(entityType: TEntityType) {
    this.behaviorEntities[entityType] = {
      defaultBehavior: "",
      behaviorCallbacks: [],
      cache: new Map(),
    };
  }

  private assertEntity<
    TEntityType extends keyof GraphileBuild.BehaviorEntities,
  >(entityType: TEntityType) {
    if (!this.behaviorEntities[entityType]) {
      throw new Error(
        `Behavior entity type '${entityType}' is not registered; known entity types: ${Object.keys(
          this.behaviorEntities,
        ).join(", ")}`,
      );
    }
  }

  /*
  private addEntityTypeDefaultBehavior<
    TEntityType extends keyof GraphileBuild.BehaviorEntities,
  >(entityType: TEntityType, behavior: string) {
    this.assertEntity(entityType);
    const scope = this.behaviorEntities[entityType];
    if (scope.defaultBehavior) {
      scope.defaultBehavior += " " + behavior;
    } else {
      scope.defaultBehavior = behavior;
    }
  }

  private addEntityBehavior<
    TEntityType extends keyof GraphileBuild.BehaviorEntities,
  >(
    entityType: TEntityType,
    getBehavior: (
      entity: GraphileBuild.BehaviorEntities[TEntityType],
      resolvedPreset: GraphileConfig.ResolvedPreset,
    ) => string,
  ) {
    this.assertEntity(entityType);
    this.behaviorEntities[entityType].behaviorCallbacks.push(getBehavior);
  }
  */

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
    const finalString = this.getBehaviorForEntity(entityType, entity);
    return this.stringMatches(finalString, filter);
  }

  // This is expensive to compute, so we cache it
  public getBehaviorForEntity<
    TEntityType extends keyof GraphileBuild.BehaviorEntities,
  >(
    entityType: TEntityType,
    entity: GraphileBuild.BehaviorEntities[TEntityType],
  ) {
    this.assertEntity(entityType);
    const cache = this.behaviorEntities[entityType].cache;
    const existing = cache.get(entity);
    if (existing !== undefined) {
      return existing;
    }
    const behaviorEntity = this.behaviorEntities[entityType];
    const finalString = joinBehaviors([
      this.globalDefaultBehavior,
      behaviorEntity.defaultBehavior,
      ...behaviorEntity.behaviorCallbacks.map((cb) =>
        cb(entity, this.resolvedPreset),
      ),
    ]);
    cache.set(entity, finalString);
    return finalString;
  }

  private stringMatches(
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

  /** @deprecated Please use entityMatches instead */
  public matches(
    localBehaviorSpecsString: string | string[] | null | undefined,
    filter: string,
    defaultBehavior = "",
  ): boolean | undefined {
    const specString = Array.isArray(localBehaviorSpecsString)
      ? localBehaviorSpecsString.join(" ")
      : localBehaviorSpecsString;
    const finalBehaviorSpecsString = `${defaultBehavior} ${
      this.globalDefaultBehavior
    } ${specString ?? ""}`;
    return this.stringMatches(finalBehaviorSpecsString, filter);
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
