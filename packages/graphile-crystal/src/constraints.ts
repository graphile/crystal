// TODO: optimise constraint matching, e.g. by collapsing redundant constraints
// and then compiling (JIT-style) remaining constraints into a function using
// `new Function`.

/**
 * Asserts that a value strictly matches.
 */
interface ValueConstraint {
  type: "value";
  path: (string | number)[];
  value: unknown;
}

/**
 * Asserts that `(value === expectedValue)` is always equal to `pass`.
 */
interface EqualityConstraint {
  type: "equal";
  path: (string | number)[];
  expectedValue: unknown;
  pass: boolean;
}

/**
 * Asserts that the property at the given path exists.
 *
 * Let `tail` be the last entry in `path`, and `rest` be the rest of `path`.
 * The value at path `rest` must be an object, and that object must have an
 * attribute `tail` which is not `undefined`.
 */
interface ExistsConstraint {
  type: "exists";
  path: (string | number)[];
  exists: boolean;
}

/**
 * If `expectedLength` is null: asserts that there is no value at the given
 * path.
 *
 * Otherwise: asserts that the value at the given path is an array containing
 * `expectedLength` entries.
 */
interface LengthConstraint {
  type: "length";
  path: (string | number)[];
  /**
   * If this is null it implies that the array did not exist.
   */
  expectedLength: number | null;
}

export type Constraint =
  | ValueConstraint
  | EqualityConstraint
  | ExistsConstraint
  | LengthConstraint;

function valueAtPath(
  object: unknown,
  path: (string | number)[],
): unknown | undefined {
  let value = object;
  for (let i = 0, l = path.length; i < l; i++) {
    const key = path[i];
    const expectArray = typeof key === "number";
    const isArray = Array.isArray(value);
    if (expectArray !== isArray) {
      return undefined;
    } else {
      if (value == null) {
        return undefined;
      }
      value = (value as any)[key];
      if (typeof value === "undefined") {
        return undefined;
      }
    }
  }
  return value;
}

/**
 * Implements the `MatchesConstraint` algorithm.
 */
function matchesConstraint(constraint: Constraint, object: unknown): boolean {
  const value = valueAtPath(object, constraint.path);
  switch (constraint.type) {
    case "length": {
      return Array.isArray(value) && value.length === constraint.expectedLength;
    }
    case "exists": {
      return (value !== undefined) === constraint.exists;
    }
    case "equal": {
      return (value === constraint.expectedValue) === constraint.pass;
    }
    case "value": {
      return value === constraint.value;
    }
    default: {
      const never: never = constraint;
      throw new Error(
        `Unsupported constraint type '${(never as Constraint).type}'`,
      );
    }
  }
}

/**
 * Implements the `MatchesConstraints` algorithm.
 */
export function matchesConstraints(
  constraints: Constraint[],
  object: unknown,
): boolean {
  // In my testing, verbose loops are still about 20% faster than for...of
  for (let i = 0, l = constraints.length; i < l; i++) {
    const constraint = constraints[i];
    if (!matchesConstraint(constraint, object)) {
      return false;
    }
  }
  return true;
}
