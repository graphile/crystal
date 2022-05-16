type BehaviorScope = string[];
interface BehaviorSpec {
  positive: boolean;
  scope: BehaviorScope;
}

export class Behavior {
  defaultBehavior = "";

  /**
   * @param localBehaviorSpecsString - the behavior of the entity as determined by details on the entity itself and any applicable ancestors
   * @param filter - the behavior the plugin specifies
   * @param defaultBehavior - allows the plugin to specify a default behavior for this in the event that it's not defined elsewhere (lowest priority)
   */
  public matches(
    localBehaviorSpecsString: string | null | undefined,
    filter: string,
    defaultBehavior: string = "",
  ): boolean | undefined {
    const finalBehaviorSpecsString = `${defaultBehavior} ${
      this.defaultBehavior
    } ${localBehaviorSpecsString ?? ""}`;
    const specs = parseSpecs(finalBehaviorSpecsString);
    const filterScope = parseScope(filter);
    // Loop backwards through the specs
    for (let i = specs.length - 1; i >= 0; i--) {
      const { positive, scope } = specs[i];
      if (scopeMatches(scope, filterScope)) {
        return positive;
      }
    }
    return undefined;
  }
}

/**
 * Parses a scope like `root:connection:filter` into it's constituent parts.
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
    specs.push({ positive, scope });
  }
  return specs;
}

/**
 * Returns true if `filterScope` can be matched by `specifiedScope`.
 *
 * @param specifiedScope - the scope the user entered, e.g. from `+root:*:filter`
 * @param filterScope - the scope the plugin says we're in, e.g. from `root:connection:filter`
 *
 * @internal
 */
function scopeMatches(
  specifiedScope: BehaviorScope,
  filterScope: BehaviorScope,
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
    if (rule === "*") {
      continue;
    }
    const filter = filterScopeTrimmed[i];
    if (rule !== filter) {
      return false;
    }
  }
  return true;
}
