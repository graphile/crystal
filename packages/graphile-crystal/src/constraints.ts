// TODO: optimise constraint matching, e.g. by collapsing redundant constraints
// and then compiling (JIT-style) remaining constraints into a function using
// `new Function`.

export type Constraint =
  | { type: "value"; path: (string | number)[]; value: unknown }
  | {
      type: "equal";
      path: (string | number)[];
      expectedValue: unknown;
      pass: boolean;
    }
  | { type: "exists"; path: (string | number)[]; exists: boolean }
  | { type: "length"; path: (string | number)[]; expectedLength: number };

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
