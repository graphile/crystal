"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessStep = exports.expressionSymbol = void 0;
exports.access = access;
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const tamedevil_1 = tslib_1.__importDefault(require("tamedevil"));
const inspect_js_1 = require("../inspect.js");
const step_js_1 = require("../step.js");
const utils_js_1 = require("../utils.js");
/** @internal */
exports.expressionSymbol = Symbol("expression");
const makeDestructureCache = Object.create(null);
const makingDestructureCache = Object.create(null);
/**
 * Returns a function that will extract the value at the given path from an
 * incoming object. If possible it will return a dynamically constructed
 * function which will enable V8 to optimise the function over time via the
 * JIT.
 */
function constructDestructureFunction(path, fallback, callback) {
    const n = path.length;
    /** 0 - slow mode; 1 - middle mode; 2 - turbo mode */
    let mode = n > 50 || n < 1 ? 0 : n > 5 ? 1 : 2;
    for (let i = 0; i < n; i++) {
        const pathItem = path[i];
        const t = typeof pathItem;
        if (t === "symbol") {
            // Cannot use in superfast mode (because cannot create signature)
            if (mode === 2)
                mode = 1;
        }
        else if (t === "string") {
            // Cannot use in superfast mode (because signature becomes ambiguous)
            if (mode === 2 && pathItem.includes("|"))
                mode = 1;
        }
        else if (t === "number") {
            if (!Number.isFinite(pathItem)) {
                mode = 0;
            }
        }
        else if (pathItem == null) {
            // Slow mode required
            mode = 0;
        }
        else {
            throw new Error(`Invalid path item: ${(0, inspect_js_1.inspect)(pathItem)} in path '${JSON.stringify(path)}'`);
        }
    }
    if (mode === 0) {
        // Slow mode
        callback(function slowlyExtractValueAtPath(_meta, value) {
            let current = value;
            for (let i = 0, l = path.length; i < l && current != null; i++) {
                const pathItem = path[i];
                current = current[pathItem];
            }
            return current ?? fallback;
        });
    }
    else {
        const signature = (fallback !== undefined ? "f" : "n") + n;
        const done = mode === 2
            ? (factory) => {
                const fn = factory(fallback, ...path);
                // ?.blah?.bog?.["!!!"]?.[0]
                const expressionDetail = [path, fallback];
                fn[exports.expressionSymbol] = expressionDetail;
                callback(fn);
            }
            : (factory) => callback(factory(fallback, ...path));
        const fn = makeDestructureCache[signature];
        if (fn !== undefined) {
            done(fn);
            return;
        }
        const making = makingDestructureCache[signature];
        if (making !== undefined) {
            making.push(done);
            return;
        }
        const doneHandlers = [done];
        makingDestructureCache[signature] = doneHandlers;
        // DO NOT REFERENCE 'path' BELOW HERE!
        const names = [];
        const access = [];
        for (let i = 0; i < n; i++) {
            const te_name = tamedevil_1.default.identifier(`p${i}`);
            names.push(te_name);
            access.push((0, tamedevil_1.default) `[${te_name}]`);
        }
        tamedevil_1.default.runInBatch((0, tamedevil_1.default) `function (fallback, ${tamedevil_1.default.join(names, ", ")}) {
return (_meta, value) => value?.${tamedevil_1.default.join(access, "?.")}${fallback === undefined ? tamedevil_1.default.blank : tamedevil_1.default.cache ` ?? fallback`};
}`, (factory) => {
            makeDestructureCache[signature] = factory;
            delete makingDestructureCache[signature];
            for (const doneHandler of doneHandlers) {
                doneHandler(factory);
            }
        });
    }
}
/**
 * Accesses a (potentially nested) property from the result of a plan.
 *
 * NOTE: this could lead to unexpected results (which could introduce security
 * issues) if it is not used carefully; only use it on JSON-like data,
 * preferably where the objects have null prototypes, and be sure to adhere to
 * the naming conventions detailed in assertSafeToAccessViaBraces.
 */
class AccessStep extends step_js_1.UnbatchedStep {
    static { this.$$export = {
        moduleName: "grafast",
        exportName: "AccessStep",
    }; }
    constructor(parentPlan, path, fallback) {
        super();
        this.fallback = fallback;
        this.isSyncAndSafe = true;
        this.allowMultipleOptimizations = true;
        this._isImmutable = parentPlan._isImmutable;
        this.path = path;
        this.hasSymbols = this.path.some((k) => typeof k === "symbol");
        this.peerKey =
            (this.fallback === "undefined" ? "U" : "D") +
                (this.hasSymbols ? "§" : ".") +
                (0, utils_js_1.digestKeys)(this.path);
        this.addDependency(parentPlan);
    }
    toStringMeta() {
        return `${chalk_1.default.bold.yellow(String(this.getDepOptions(0).step.id))}.${this.path.map((p) => String(p)).join(".")}`;
    }
    getParentStep() {
        return this.getDep(0);
    }
    /**
     * Get the named property of an object.
     */
    get(attrName) {
        if (typeof attrName !== "string") {
            throw new Error(`AccessStep::get can only be called with string values`);
        }
        return access(this.getDep(0), [...this.path, attrName]);
    }
    /**
     * Get the entry at the given index in an array.
     */
    at(index) {
        if (typeof index !== "number") {
            throw new Error(`AccessStep::get can only be called with string values`);
        }
        return access(this.getDep(0), [...this.path, index]);
    }
    // An access of an access can become a single access
    optimize() {
        const $dep = this.getDep(0);
        if ($dep instanceof AccessStep && $dep.fallback === undefined) {
            return access($dep.getDep(0), [...$dep.path, ...this.path], this.fallback);
        }
        return this;
    }
    finalize() {
        // Note that `OutputPlan.optimize` depends on this.
        constructDestructureFunction(this.path, this.fallback, (fn) => {
            this.unbatchedExecute = fn;
        });
        super.finalize();
    }
    unbatchedExecute(_extra, ..._values) {
        throw new Error(`${this}: should have had unbatchedExecute method replaced`);
    }
    deduplicate(peers) {
        if (peers.length === 0) {
            return peers;
        }
        else if (!this.hasSymbols && this.fallback === undefined) {
            // Rely entirely on peerKey
            return peers;
        }
        else if (!this.hasSymbols) {
            // Rely on peerKey for path, but check fallback
            const { fallback } = this;
            return peers.filter((p) => p.fallback === fallback);
        }
        else {
            // Check both fallback and path
            const { fallback, path } = this;
            return peers.filter((p) => p.fallback === fallback && (0, utils_js_1.arraysMatch)(p.path, path));
        }
    }
}
exports.AccessStep = AccessStep;
/**
 * Access the property at path `path` in the value returned from `parentPlan`,
 * falling back to `fallback` if it were null-ish.
 */
function access(parentPlan, rawPath, fallback) {
    const path = Array.isArray(rawPath)
        ? rawPath
        : rawPath != null
            ? [rawPath]
            : [];
    if (typeof fallback === "undefined" &&
        !path.some((k) => typeof k === "symbol")) {
        const pathKey = (0, utils_js_1.digestKeys)(path);
        if (parentPlan._isImmutable) {
            return parentPlan.operationPlan.withRootLayerPlan(() => parentPlan.operationPlan.cacheStep(parentPlan, "GrafastInternal:access()", pathKey, () => new AccessStep(parentPlan, path)));
        }
        else {
            return parentPlan.operationPlan.cacheStep(parentPlan, "GrafastInternal:access()", pathKey, () => new AccessStep(parentPlan, path));
        }
    }
    return new AccessStep(parentPlan, path, fallback);
}
//# sourceMappingURL=access.js.map