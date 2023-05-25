type BehaviorScope = string[];
interface BehaviorSpec {
  positive: boolean;
  scope: BehaviorScope;
}

export class Behavior {
  behaviorEntities: {
    [entityType in keyof GraphileBuild.BehaviorEntities]: {
      defaultBehavior: string;
      getEntityDefaultBehaviorCallbacks: Array<
        (entity: GraphileBuild.BehaviorEntities[entityType]) => string
      >;
      getEntityConfiguredBehavior: (
        entity: GraphileBuild.BehaviorEntities[entityType],
      ) => string;
    };
  };
  constructor(private globalBehaviorDefaults = "") {
    this.behaviorEntities = Object.create(null);
  }

  // Should only be called during 'build' phase.
  public addDefaultBehavior(behavior: string) {
    if (this.globalBehaviorDefaults) {
      this.globalBehaviorDefaults += " " + behavior;
    } else {
      this.globalBehaviorDefaults = behavior;
    }
  }

  public registerEntity<
    TEntityType extends keyof GraphileBuild.BehaviorEntities,
  >(
    entityType: TEntityType,
    getEntityConfiguredBehavior: (
      entity: GraphileBuild.BehaviorEntities[TEntityType],
    ) => string,
    defaultBehavior?: string,
  ) {
    this.behaviorEntities[entityType] = {
      defaultBehavior: defaultBehavior ?? "",
      getEntityDefaultBehaviorCallbacks: [],
      getEntityConfiguredBehavior,
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

  public addEntityTypeDefaultBehavior<
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

  public addEntityDefaultBehavior<
    TEntityType extends keyof GraphileBuild.BehaviorEntities,
  >(
    entityType: TEntityType,
    getEntityDefaultBehavior: (
      entity: GraphileBuild.BehaviorEntities[TEntityType],
    ) => string,
  ) {
    this.assertEntity(entityType);
    this.behaviorEntities[entityType].getEntityDefaultBehaviorCallbacks.push(
      getEntityDefaultBehavior,
    );
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
    this.assertEntity(entityType);
    const behaviorEntity = this.behaviorEntities[entityType];
    const finalString = this.join([
      this.globalBehaviorDefaults,
      behaviorEntity.defaultBehavior,
      ...behaviorEntity.getEntityDefaultBehaviorCallbacks.map((cb) =>
        cb(entity),
      ),
      behaviorEntity.getEntityConfiguredBehavior(entity),
    ]);
    return this.matches(finalString, filter);
  }

  public join(strings: string[]) {
    let str = "";
    for (const string of strings) {
      if (string !== "") {
        if (str === "") {
          str = string;
        } else {
          str += " " + string;
        }
      }
    }
    return str;
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
      this.globalBehaviorDefaults
    } ${specString ?? ""}`;
    const specs = parseSpecs(finalBehaviorSpecsString);
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
