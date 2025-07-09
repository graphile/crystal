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
export type Constraint = ValueConstraint | EqualityConstraint | ExistsConstraint | LengthConstraint | IsEmptyConstraint | KeysConstraint;
/**
 * Implements the `MatchesConstraints` algorithm.
 */
export declare function matchesConstraints(constraints: Constraint[], object: unknown): boolean;
export {};
//# sourceMappingURL=constraints.d.ts.map