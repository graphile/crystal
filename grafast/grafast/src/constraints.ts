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
      const actualLength = Array.isArray(value) ? value.length : null;
      return actualLength === constraint.expectedLength;
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
      const { keys: expectedKeys } = constraint;
      if (expectedKeys === null) {
        return value == null || typeof value !== "object";
      } else if (value == null || typeof value !== "object") {
        return false;
      } else {
        // keys are always in order of the gql type; see coerceInputValue and __InputObjectStep ctor
        const valueKeys = Object.keys(value) as Array<keyof typeof value>;

        const rawLength = valueKeys.length;
        const expectedLength = expectedKeys.length;

        // Optimization: early bail
        if (rawLength < expectedLength) {
          return false;
        }

        /**
         * This is `i` but adjusted so that `undefined` doesn't increment it.
         * Should match index in `expectedKeys`.
         */
        let definedRawKeyCount = 0;

        for (let i = 0; i < rawLength; i++) {
          const valueKey = valueKeys[i];
          if (value[valueKey] !== undefined) {
            if (valueKey !== expectedKeys[definedRawKeyCount]) {
              return false;
            }
            definedRawKeyCount++;
          }
        }

        // Make sure there aren't any additional expected keys
        if (definedRawKeyCount !== expectedLength) {
          return false;
        }

        return true;
      }
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
