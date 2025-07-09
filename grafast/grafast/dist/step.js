"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.isExecutableStep = exports.UnbatchedExecutableStep = exports.ExecutableStep = exports.UnbatchedStep = exports.Step = exports.assertFinalized = exports.$$noExec = void 0;
exports.isStep = isStep;
exports.assertStep = assertStep;
exports.isUnbatchedStep = isUnbatchedStep;
exports.isObjectLikeStep = isObjectLikeStep;
exports.isListLikeStep = isListLikeStep;
exports.isPolymorphicStep = isPolymorphicStep;
exports.isListCapableStep = isListCapableStep;
exports.assertListCapableStep = assertListCapableStep;
exports.assertExecutableStep = assertExecutableStep;
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const tamedevil_1 = tslib_1.__importDefault(require("tamedevil"));
const dev_js_1 = require("./dev.js");
const withGlobalLayerPlan_js_1 = require("./engine/lib/withGlobalLayerPlan.js");
const lock_js_1 = require("./engine/lock.js");
const error_js_1 = require("./error.js");
const global_js_1 = require("./global.js");
const inspect_js_1 = require("./inspect.js");
const interfaces_js_1 = require("./interfaces.js");
const utils_js_1 = require("./utils.js");
/**
 * This indicates that a step never executes (e.g. __ItemStep and __ValueStep)
 * and thus when executed skips direct to reallyCompletedStep.
 *
 * @internal
 */
exports.$$noExec = Symbol("noExec");
const ref_flagError = tamedevil_1.default.ref(error_js_1.flagError, "flagError");
function throwDestroyed() {
    let message;
    try {
        message = `${this} has been destroyed; calling methods on it is no longer possible`;
    }
    catch (e) {
        message = `Step ${this?.id} has been destroyed; calling methods on it is no longer possible`;
    }
    throw new Error(message);
}
function isDeepDepSkippable($dep) {
    return interfaces_js_1.$$deepDepSkip in $dep && typeof $dep[interfaces_js_1.$$deepDepSkip] === "function";
}
function reallyAssertFinalized(plan) {
    if (!plan.isFinalized) {
        throw new Error(`Step ${plan} is not finalized; did you forget to call \`super.finalize()\` from its \`finalize()\` method?`);
    }
}
// Optimise this away in production.
exports.assertFinalized = !dev_js_1.isDev ? dev_js_1.noop : reallyAssertFinalized;
/**
 * Executable plans are the plans associated with leaves on the GraphQL tree,
 * they must be able to execute to return values.
 */
class Step {
    static { _a = interfaces_js_1.$$subroutine, _b = lock_js_1.$$unlock; }
    constructor() {
        this[_a] = null;
        /**
         * For input values, set `true` if it comes from variables/arguments since
         * they cannot be modified (even by mutations), set `false` otherwise.
         *
         * @internal
         */
        this._isImmutable = false;
        /** @internal */
        this[_b] = undefined;
        /**
         * (default = ALL_FLAGS & ~FLAG_NULL)
         */
        this.defaultForbiddenFlags = interfaces_js_1.DEFAULT_FORBIDDEN_FLAGS;
        /**
         * If the peerKey of two steps do not match, then they are definitely not
         * peers. Use this to reduce the load on deduplicate by more quickly
         * eradicating definitely-not-peers.
         *
         * Note: we may well change this to be a function in future, so it's advised
         * that you don't use this unless you're working inside the graphile/crystal
         * core codebase.
         *
         * @experimental
         */
        this.peerKey = null;
        this.isArgumentsFinalized = false;
        this.isFinalized = false;
        this.debug = (0, global_js_1.getDebug)();
        const layerPlan = (0, withGlobalLayerPlan_js_1.currentLayerPlan)();
        this.layerPlan = layerPlan;
        this.operationPlan = layerPlan.operationPlan;
        this._isUnary = true;
        this._isUnaryLocked = false;
        this.implicitSideEffectStep = null;
        this.hasSideEffects ??= false;
        let hasSideEffects = false;
        const stepTracker = this.layerPlan.operationPlan.stepTracker;
        Object.defineProperty(this, "hasSideEffects", {
            get() {
                return hasSideEffects;
            },
            set(value) {
                /**
                 * If steps were created after this step, an this step doesn't depend
                 * on them, then it's no longer safe to change hasSideEffects.
                 */
                let nonDependentSteps = null;
                const maxStepId = stepTracker.stepCount - 1;
                if (this.id === maxStepId) {
                    // All good - no more steps were created
                }
                else {
                    // If the step created them during initialization and is dependent on
                    // them, that's fine too.
                    for (let id = this.id + 1; id <= maxStepId; id++) {
                        const step = stepTracker.getStepById(id);
                        if ((0, utils_js_1.stepADependsOnStepB)(this, step))
                            continue;
                        if (nonDependentSteps === null) {
                            nonDependentSteps = [step];
                        }
                        else {
                            nonDependentSteps.push(step);
                        }
                    }
                }
                if (nonDependentSteps === null) {
                    hasSideEffects = value;
                    if (value === true) {
                        this.layerPlan.latestSideEffectStep = this;
                        this.operationPlan.resetCache();
                    }
                    else if (value !== true && hasSideEffects === true) {
                        throw new Error(`Cannot mark ${this} as having no side effects after having set it to have side effects.`);
                    }
                }
                else {
                    throw new Error(`Attempted to mark ${this} as having side effects, but other non-dependent steps (${nonDependentSteps
                        .map(String)
                        .join(", ")}) have already been created.`);
                }
            },
            enumerable: true,
            configurable: false,
        });
        this.dependencies = [];
        this.dependencyForbiddenFlags = [];
        this.dependencyOnReject = [];
        this.dependents = [];
        this.isOptimized = false;
        this.allowMultipleOptimizations = false;
        this._stepOptions = { stream: null, walkIterable: false };
        this.store = true;
        this.polymorphicPaths = (0, withGlobalLayerPlan_js_1.currentPolymorphicPaths)();
        // Important: MUST come after `this.layerPlan = ...`
        this.id = this.layerPlan._addStep(this);
    }
    /**
     * Generally you should only use this once the dependencies of a step are
     * established, if you use it beforehand and it returns `true` then adding a
     * non-unary dependency later will result in an error.
     */
    getAndFreezeIsUnary() {
        this._isUnaryLocked = true;
        return this._isUnary;
    }
    withMyLayerPlan(callback) {
        return (0, withGlobalLayerPlan_js_1.withGlobalLayerPlan)(this.layerPlan, this.polymorphicPaths, callback);
    }
    /** @experimental */
    withLayerPlan(callback) {
        return (0, withGlobalLayerPlan_js_1.withGlobalLayerPlan)(this.layerPlan, this.polymorphicPaths, callback);
    }
    getStep(id) {
        return this.layerPlan.getStep(id, this);
    }
    getDepOptions(depId) {
        const step = this.dependencies[depId];
        const forbiddenFlags = this.dependencyForbiddenFlags[depId];
        const onReject = this.dependencyOnReject[depId];
        const acceptFlags = interfaces_js_1.ALL_FLAGS & ~forbiddenFlags;
        return { step, acceptFlags, onReject };
    }
    getDep(_depId, _throwOnFlagged = false) {
        // This gets replaced when `__FlagStep` is loaded. Were we on ESM we could
        // just put the code here, but since we're not we have to avoid the
        // circular dependency.
        throw new Error(`Grafast failed to load correctly`);
    }
    maybeGetDep(depId, throwOnFlagged = false) {
        return depId == null
            ? null
            : throwOnFlagged
                ? this.getDep(depId, true)
                : this.getDep(depId);
    }
    getDepOrConstant(_depId, _fallback) {
        // This gets replaced when `constant` is loaded. Were we on ESM we could
        // just put the code here, but since we're not we have to avoid the
        // circular dependency.
        throw new Error(`Grafast failed to load correctly`);
    }
    /**
     * Like getDep, except it skips over __ItemStep and similar steps to get to
     * where the parent really is.
     *
     * @experimental
     */
    getDepDeep(depId) {
        let $dep = this.getDep(depId);
        // Walk up the tree, looking for the source of this record. We know that
        // __ItemStep and __ListTransformStep are safe to walk through, but other
        // classes may not be.
        while (isDeepDepSkippable($dep)) {
            $dep = $dep[interfaces_js_1.$$deepDepSkip]();
        }
        return $dep;
    }
    /**
     * Cache a generated step by a given identifier (cacheKey) such that we don't
     * need to regenerate it on future calls, significantly reducing the load on
     * deduplication later.
     *
     * @experimental
     */
    cacheStep(actionKey, cacheKey, cb) {
        return this.operationPlan.cacheStep(this, actionKey, cacheKey, cb);
    }
    toString() {
        let meta;
        try {
            // If we log out too early, the meta function might fail.
            meta = this.toStringMeta();
        }
        catch (e) {
            // Ignore
        }
        return chalk_1.default.bold.blue(`${this.constructor.name.replace(/Step$/, "")}${this.layerPlan.id === 0 ? "" : chalk_1.default.grey(`{${this.layerPlan.id}}`)}${this._isUnary ? "➊" : ""}${this._stepOptions.stream != null ? "@s" : ""}${meta != null && meta.length ? chalk_1.default.grey(`<${meta}>`) : ""}[${(0, inspect_js_1.inspect)(this.id, { colors: true })}]`);
    }
    /**
     * This metadata will be merged into toString when referencing this plan.
     */
    toStringMeta() {
        return null;
    }
    planJSONExtra() {
        return undefined;
    }
    canAddDependency(step) {
        return (0, utils_js_1.stepAMayDependOnStepB)(this, step);
    }
    addDependency(stepOrOptions) {
        const options = stepOrOptions instanceof Step
            ? { step: stepOrOptions, skipDeduplication: false }
            : stepOrOptions;
        if (options.step.layerPlan.id > this.layerPlan.id) {
            throw new Error(`Cannot add dependency ${options.step} to ${this} since the former is in a deeper layerPlan (creates a catch-22)`);
        }
        return this.operationPlan.stepTracker.addStepDependency(this, options);
    }
    /**
     * Adds "unary" dependencies; in `execute({count, values})` you'll receive a
     * `values[index]` (where `index` is the return value of this function) with
     * `isBatch = false` so you can use the `values[index].value` property
     * directly.
     */
    addUnaryDependency(stepOrOptions) {
        const options = stepOrOptions instanceof Step ? { step: stepOrOptions } : stepOrOptions;
        if (options.step.layerPlan.id > this.layerPlan.id) {
            throw new Error(`Cannot add dependency ${options.step} to ${this} since the former is in a deeper layerPlan (creates a catch-22)`);
        }
        return this.operationPlan.stepTracker.addStepUnaryDependency(this, options);
    }
    finalize() {
        if (typeof this.isSyncAndSafe !== "boolean") {
            // Take a guess
            if (!dev_js_1.isDev) {
                this.isSyncAndSafe = false;
            }
            else if (this.execute.constructor.name === "AsyncFunction") {
                this.isSyncAndSafe = false;
            }
            else {
                console.warn(`${this} uses a regular (non-async) function for 'execute'; if it never returns a promise and the list it returns never includes a promise then setting \`${this}.isSyncAndSafe = true\` will improve performance. If this is not true, set \`${this}.isSyncAndSafe = false\` to dismiss this message.`);
                this.isSyncAndSafe = false;
            }
        }
        if (this.isSyncAndSafe === true &&
            this.execute.constructor.name === "AsyncFunction") {
            throw new Error(`${this} claims to be synchronous, however the execute method is asynchronous`);
        }
        if (!this.isFinalized) {
            this.isFinalized = true;
        }
        else {
            throw new Error(`Step ${this} has already been finalized - do not call \`finalize()\` from user code!`);
        }
    }
    /**
     * This function will be called with 'execution details', an object containing:
     *
     * - `count`: the number of entries in the batch that's being executed
     * - `values`: a tuple representing the runtime values of the steps
     *   dependencies; each value in the tuple is an object, either a batch object
     *   containing a list of size `count` containing the values, or a unary
     *   object containing the single value common to all entries.
     * - `indexMap`: helper function to map over each index from `0` to `count-1`,
     *   returning the resulting array.
     * - `indexForEach`: as `indexMap`, but without the array result.
     * - `meta`: [experimental]
     *
     * `execute` must return a list with `count` entries, where each value in the
     * list relates to the result of executing this plan for the corresponding
     * entry in each of the entries in the `values` tuple.
     *
     * IMPORTANT: it is up to the execute function to cache/memoize results as
     * appropriate for performance, this can be done via the `meta` object.
     *
     * The `meta` object is an empty object stored to `grafastContext.metaByPlan`
     * that can be used to store anything this plan needs. We recommend that you
     * add attributes to meta for each purpose (e.g. use `meta.cache` for
     * memoizing results) so that you can expand your usage of meta in future.
     */
    /* abstract */
    execute(details) {
        // ESLint/TS: ignore not used.
        details;
        throw new Error(`${this} has not implemented an 'execute' method`);
    }
    destroy() {
        // Break ourself enough that if lifecycle methods are attempted an error
        // will be thrown. This should help weed out bugs where steps are processed
        // even after they have been removed/deduped.
        this.addDependency = throwDestroyed;
        this.deduplicate = throwDestroyed;
        this.deduplicatedWith = throwDestroyed;
        this.optimize = throwDestroyed;
        this.finalize = throwDestroyed;
        this.execute = throwDestroyed;
    }
}
exports.Step = Step;
exports.ExecutableStep = Step;
function _buildOptimizedExecuteV2Expression(depCount, isSyncAndSafe) {
    const identifiers = [];
    for (let i = 0; i < depCount; i++) {
        identifiers.push(tamedevil_1.default.identifier(`value${i}`));
    }
    const tryOrNot = (inFrag) => {
        if (isSyncAndSafe) {
            return inFrag;
        }
        else {
            return (0, tamedevil_1.default) `\
    try {
  ${tamedevil_1.default.indent(inFrag)}
    } catch (e) {
      results[i] = ${ref_flagError}(e);
    }\
`;
        }
    };
    return (0, tamedevil_1.default) `\
(function execute({
  count,
  values: [${tamedevil_1.default.join(identifiers, ", ")}],
  extra,
}) {
  const results = [];
  for (let i = 0; i < count; i++) {
${tryOrNot((0, tamedevil_1.default) `\
    results[i] = this.unbatchedExecute(extra, ${tamedevil_1.default.join(identifiers.map((identifier) => (0, tamedevil_1.default) `${identifier}.at(i)`), ", ")});\
`)}
  }
  return results;
})`;
}
const MAX_DEPENDENCIES_TO_CACHE = 10;
const unsafeCache = [];
const safeCache = [];
tamedevil_1.default.batch(() => {
    for (let i = 0; i <= MAX_DEPENDENCIES_TO_CACHE; i++) {
        const depCount = i;
        const unsafeExpression = _buildOptimizedExecuteV2Expression(depCount, false);
        tamedevil_1.default.runInBatch(unsafeExpression, (fn) => {
            unsafeCache[depCount] = fn;
        });
        const safeExpression = _buildOptimizedExecuteV2Expression(depCount, true);
        tamedevil_1.default.runInBatch(safeExpression, (fn) => {
            safeCache[depCount] = fn;
        });
    }
});
function buildOptimizedExecute(depCount, isSyncAndSafe, callback) {
    // Try and satisfy from cache
    const cache = isSyncAndSafe ? safeCache : unsafeCache;
    if (depCount <= MAX_DEPENDENCIES_TO_CACHE) {
        callback(cache[depCount]);
        return;
    }
    // Build it
    const expression = _buildOptimizedExecuteV2Expression(depCount, isSyncAndSafe);
    tamedevil_1.default.runInBatch(expression, (fn) => {
        callback(fn);
    });
}
class UnbatchedStep extends Step {
    static { this.$$export = {
        moduleName: "grafast",
        exportName: "UnbatchedStep",
    }; }
    finalize() {
        if (this.execute === UnbatchedStep.prototype.execute) {
            // If they've not replaced 'execute', use our optimized form
            buildOptimizedExecute(this.dependencies.length, this.isSyncAndSafe, (fn) => {
                this.execute = fn;
            });
        }
        super.finalize();
    }
    execute({ indexMap, values, extra, }) {
        console.warn(`${this} didn't call 'super.finalize()' in the finalize method.`);
        const depCount = this.dependencies.length;
        return indexMap((i) => {
            try {
                const tuple = [];
                for (let j = 0; j < depCount; j++) {
                    tuple[j] = values[j].at(i);
                }
                return this.unbatchedExecute(extra, ...tuple);
            }
            catch (e) {
                return (0, error_js_1.flagError)(e);
            }
        });
    }
}
exports.UnbatchedStep = UnbatchedStep;
exports.UnbatchedExecutableStep = UnbatchedStep;
function isStep(step) {
    return step instanceof Step;
}
function assertStep(step) {
    if (!isStep(step)) {
        throw new Error(`Expected a step, but received something else: ${(0, inspect_js_1.inspect)(step)}`);
    }
}
function isUnbatchedStep(step) {
    return isStep(step) && typeof step.unbatchedExecute === "function";
}
function isObjectLikeStep(plan) {
    return "get" in plan && typeof plan.get === "function";
}
function isListLikeStep(plan) {
    return "at" in plan && typeof plan.at === "function";
}
function isPolymorphicStep(s) {
    return ("planForType" in s &&
        typeof s.planForType === "function");
}
function isListCapableStep(plan) {
    return "listItem" in plan && typeof plan.listItem === "function";
}
function assertListCapableStep(plan, pathDescription) {
    if (!isListCapableStep(plan)) {
        throw new Error(`The plan returned from '${pathDescription}' should be a list capable plan, but ${plan} does not implement the 'listItem' method.`);
    }
}
/** @deprecated Use isStep instead */
exports.isExecutableStep = isStep;
/** @deprecated Use isStep instead */
function assertExecutableStep(step) {
    return assertStep(step);
}
//# sourceMappingURL=step.js.map