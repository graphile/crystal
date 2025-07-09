"use strict";
// PERF: optimise constraint matching, e.g. by collapsing redundant constraints
// and then compiling (JIT-style) remaining constraints into a function using
// tamedevil
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchesConstraints = matchesConstraints;
function valueAtPath(object, path) {
    let value = object;
    for (let i = 0, l = path.length; i < l; i++) {
        const key = path[i];
        const expectArray = typeof key === "number";
        const isArray = Array.isArray(value);
        if (expectArray !== isArray) {
            return undefined;
        }
        else {
            if (value == null) {
                return undefined;
            }
            value = value[key];
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
function matchesConstraint(constraint, object) {
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
            const isEmpty = typeof value === "object" &&
                value !== null &&
                Object.keys(value).length === 0;
            return isEmpty === constraint.isEmpty;
        }
        case "keys": {
            const { keys: expectedKeys } = constraint;
            if (expectedKeys === null) {
                return value == null || typeof value !== "object";
            }
            else if (value == null || typeof value !== "object") {
                return false;
            }
            else {
                // keys are always in order of the gql type; see coerceInputValue and __InputObjectStep ctor
                const valueKeys = Object.keys(value);
                const valueKeyCount = valueKeys.length;
                const expectedKeyCount = expectedKeys.length;
                // Optimization: early bail
                if (valueKeyCount < expectedKeyCount) {
                    return false;
                }
                /**
                 * This is `i` but adjusted so that `undefined` doesn't increment it.
                 * Should match index in `expectedKeys`.
                 */
                let definedRawKeyCount = 0;
                for (let i = 0; i < valueKeyCount; i++) {
                    const valueKey = valueKeys[i];
                    if (value[valueKey] !== undefined) {
                        if (valueKey !== expectedKeys[definedRawKeyCount]) {
                            return false;
                        }
                        definedRawKeyCount++;
                    }
                }
                // Make sure there aren't any additional expected keys
                if (definedRawKeyCount !== expectedKeyCount) {
                    return false;
                }
                return true;
            }
        }
        default: {
            const never = constraint;
            throw new Error(`Unsupported constraint type '${never.type}'`);
        }
    }
}
/**
 * Implements the `MatchesConstraints` algorithm.
 */
function matchesConstraints(constraints, object) {
    // In my testing, verbose loops are still about 20% faster than for...of
    for (let i = 0, l = constraints.length; i < l; i++) {
        const constraint = constraints[i];
        if (!matchesConstraint(constraint, object)) {
            return false;
        }
    }
    return true;
}
//# sourceMappingURL=constraints.js.map