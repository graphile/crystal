// PERF: optimise constraint matching, e.g. by collapsing redundant constraints
// and then compiling (JIT-style) remaining constraints into a function using
// tamedevil

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
 * If `keys` is null: asserts that there is no value at the given
 * path.
 *
 * Otherwise: asserts that the value at the given path has the exact same keys.
 */
interface KeysConstraint {
  type: "keys";
  path: (string | number)[];
  /**
   * If this is null it implies that the object did not exist.
   */
  keys: ReadonlyArray<string> | null;
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

/**
 * Checks if the object at the given path matches the `isEmpty` property
 * (implying no keys). Objects are empty if and only if they exist and have no
 * keys.
 */
interface IsEmptyConstraint {
  type: "isEmpty";
  path: (string | number)[];
  isEmpty: boolean;
}

export type Constraint =
  | ValueConstraint
  | EqualityConstraint
  | ExistsConstraint
  | LengthConstraint
  | IsEmptyConstraint
  | KeysConstraint;

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
    case "isEmpty": {
      const isEmpty =
        typeof value === "object" &&
        value !== null &&
        Object.keys(value).length === 0;
      return isEmpty === constraint.isEmpty;
    }
    case "keys": {
      if (constraint.keys === null) {
        return value === null || typeof value !== "object";
      }

      if (!value || typeof value !== "object" || !constraint.keys) {
        return false;
      }

      const keys = [];
      const rawKeys = Object.keys(value);
      for (let i = 0; i < rawKeys.length; i++) {
        const key = rawKeys[i];
        if ((value as any)[key] !== undefined) {
          keys.push(key);
        }
      }

      for (let i = 0; i < constraint.keys?.length; i++) {
        // keys are always in order of the gql type; see coerceInputValue and __InputObjectStep ctor
        if (constraint.keys[i] !== keys[i]) {
          return false;
        }
      }

      return true;
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
