"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.establishOperationPlan = establishOperationPlan;
const tslib_1 = require("tslib");
const lru_1 = tslib_1.__importDefault(require("@graphile/lru"));
const debug_1 = tslib_1.__importDefault(require("debug"));
const constraints_js_1 = require("./constraints.js");
const dev_js_1 = require("./dev.js");
const index_js_1 = require("./index.js");
const interfaces_js_1 = require("./interfaces.js");
const timeSource_js_1 = require("./timeSource.js");
const debug = (0, debug_1.default)("grafast:establishOperationPlan");
// How long is a timeout valid for? Here I've set it to 60 seconds.
const TIMEOUT_TIMEOUT = (typeof process !== "undefined" &&
    typeof process.env.GRAFAST_TIMEOUT_VALIDITY_MS === "string"
    ? parseInt(process.env.GRAFAST_TIMEOUT_VALIDITY_MS, 10)
    : null) || 60_000;
// OPTIMIZE: we should consider increasing the timeout once the process has been
// running a while (since the JIT should have kicked in) - we could even use
// `setTimeout` to trigger it after certain amount of time elapsed.
/**
 * This is a development-only validation to check fragments do, in fact, match
 * - even if the objects themselves differ.
 */
function reallyAssertFragmentsMatch(oldFragments, fragments) {
    if (oldFragments !== fragments) {
        debug("fragments aren't `===` for same operation");
        // Consistency check - we assume that if the operation is the same then
        // the fragments will be, but this may not be the case depending on if
        // GraphQL.js caches the operation node.
        const oldKeys = Object.keys(oldFragments).sort();
        const newKeys = Object.keys(fragments).sort();
        const oldKeyStr = oldKeys.join(",");
        const newKeyStr = newKeys.join(",");
        if (oldKeyStr.length !== newKeyStr.length) {
            throw new Error(`Inconsistency error: operation matches, but fragment keys differ: '${oldKeyStr}' != '${newKeyStr}'.`);
        }
        for (const key of newKeys) {
            if (oldFragments[key] !== fragments[key]) {
                throw new Error(`Inconsistency error: operation matches, fragment names match, but fragment '${key}' is not '===' to the previous value.`);
            }
        }
    }
}
// Optimise this away in production.
const assertFragmentsMatch = !dev_js_1.isDev ? dev_js_1.noop : reallyAssertFragmentsMatch;
/**
 * Implements the `IsOpPlanCompatible` algorithm.
 *
 * @remarks Due to the optimisation in `establishOperationPlan`, the schema, document
 * and operationName checks have already been performed.
 */
function isOperationPlanResultCompatible(operationPlan, variableValues, context, rootValue) {
    const { variableValuesConstraints, contextConstraints, rootValueConstraints, } = operationPlan;
    if (!(0, constraints_js_1.matchesConstraints)(variableValuesConstraints, variableValues)) {
        return false;
    }
    if (!(0, constraints_js_1.matchesConstraints)(contextConstraints, context)) {
        return false;
    }
    if (!(0, constraints_js_1.matchesConstraints)(rootValueConstraints, rootValue)) {
        return false;
    }
    return true;
}
/**
 * Implements the `EstablishOpPlan` algorithm.
 *
 * @remarks Though EstablishOpPlan accepts document and operationName, we
 * instead accept operation and fragments since they're easier to get a hold of
 * in GraphQL.js.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
function establishOperationPlan(schema, operation, fragments, variableValues, context, rootValue, planningTimeout = null) {
    let cacheByOperation = schema.extensions.grafast?.[interfaces_js_1.$$cacheByOperation];
    let cache = cacheByOperation?.get(operation);
    // These two variables to make it easy to trim the linked list later.
    let count = 0;
    let lastButOneItem = null;
    if (cache !== undefined) {
        // Dev-only validation
        assertFragmentsMatch(cache.fragments, fragments);
        let previousItem = null;
        let linkedItem = cache.possibleOperationPlans;
        while (linkedItem) {
            const value = linkedItem.value;
            if (isOperationPlanResultCompatible(value, variableValues, context, rootValue)) {
                const { error, operationPlan } = value;
                if (error != null) {
                    if (error instanceof index_js_1.SafeError) {
                        if (error.extensions?.[interfaces_js_1.$$timeout] != null) {
                            if (error.extensions[interfaces_js_1.$$ts] < timeSource_js_1.timeSource.now() - TIMEOUT_TIMEOUT) {
                                // Remove this out of date timeout
                                linkedItem = linkedItem.next;
                                if (previousItem !== null) {
                                    previousItem.next = linkedItem;
                                }
                                else {
                                    cache.possibleOperationPlans = linkedItem;
                                }
                                continue;
                            }
                            if (planningTimeout !== null &&
                                error.extensions[interfaces_js_1.$$timeout] >= planningTimeout) {
                                // It was a timeout error - do not retry
                                throw error;
                            }
                            else {
                                // That's Not My Timeout, let's try again.
                            }
                        }
                        else {
                            // Not a timeout error - this will always fail in the same way?
                            throw error;
                        }
                    }
                    else {
                        // Not a timeout error - this will always fail in the same way?
                        throw error;
                    }
                }
                else {
                    // Hoist to top of linked list
                    if (previousItem !== null) {
                        // Remove linkedItem from existing chain
                        previousItem.next = linkedItem.next;
                        // Add rest of chain after linkedItem
                        linkedItem.next = cache.possibleOperationPlans;
                        // linkedItem is now head of chain
                        cache.possibleOperationPlans = linkedItem;
                    }
                    // We found a suitable OperationPlan - use that!
                    return operationPlan;
                }
            }
            count++;
            lastButOneItem = previousItem;
            previousItem = linkedItem;
            linkedItem = linkedItem.next;
        }
    }
    // No suitable OperationPlan found, time to make one.
    let operationPlan;
    let error;
    const variableValuesConstraints = [];
    const contextConstraints = [];
    const rootValueConstraints = [];
    try {
        operationPlan = new index_js_1.OperationPlan(schema, operation, fragments, variableValuesConstraints, variableValues, contextConstraints, context, rootValueConstraints, rootValue, planningTimeout);
    }
    catch (e) {
        error = e;
    }
    // Store it to the cache
    if (!cacheByOperation) {
        if (!schema.extensions.grafast) {
            schema.extensions.grafast = Object.create(null);
        }
        cacheByOperation = new lru_1.default({
            maxLength: schema.extensions.grafast.operationsCacheMaxLength ?? 500,
        });
        schema.extensions.grafast[interfaces_js_1.$$cacheByOperation] = cacheByOperation;
    }
    const establishOperationPlanResult = {
        variableValuesConstraints,
        contextConstraints,
        rootValueConstraints,
        ...(operationPlan ? { operationPlan } : { error: error }),
    };
    if (!cache) {
        cache = {
            fragments,
            possibleOperationPlans: {
                value: establishOperationPlanResult,
                next: null,
            },
        };
        cacheByOperation.set(operation, cache);
    }
    else {
        const max = schema.extensions.grafast.operationOperationPlansCacheMaxLength ?? 50;
        if (count >= max) {
            // Remove the tail to ensure we never grow too big
            lastButOneItem.next = null;
            count--;
            // LOGGING: we should announce this so that people know there's something that needs fixing in their schema (too much eval?)
        }
        // Add new operationPlan to top of the linked list.
        cache.possibleOperationPlans = {
            value: establishOperationPlanResult,
            next: cache.possibleOperationPlans,
        };
    }
    if (error !== undefined) {
        throw error;
    }
    else {
        return operationPlan;
    }
}
//# sourceMappingURL=establishOperationPlan.js.map