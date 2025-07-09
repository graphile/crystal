"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadStep = exports.LoadedRecordStep = void 0;
exports.loadOneCallback = loadOneCallback;
exports.loadManyCallback = loadManyCallback;
exports.loadMany = loadMany;
exports.loadOne = loadOne;
const index_js_1 = require("../index.js");
const multistep_js_1 = require("../multistep.js");
const step_js_1 = require("../step.js");
const utils_js_1 = require("../utils.js");
const access_js_1 = require("./access.js");
/**
 * A TypeScript Identity Function to help you strongly type your
 * LoadOneCallback.
 */
function loadOneCallback(callback) {
    return callback;
}
/**
 * A TypeScript Identity Function to help you strongly type your
 * LoadManyCallback.
 */
function loadManyCallback(callback) {
    return callback;
}
const idByLoad = new WeakMap();
let loadCounter = 0;
/**
 * You shouldn't create instances of this yourself - use `loadOne` or `loadMany` instead.
 */
class LoadedRecordStep extends step_js_1.Step {
    static { this.$$export = {
        moduleName: "grafast",
        exportName: "LoadedRecordStep",
    }; }
    constructor($data, isSingle, sourceDescription, 
    // Only safe to reference this during planning phase
    ioEquivalence) {
        super();
        this.isSingle = isSingle;
        this.sourceDescription = sourceDescription;
        this.ioEquivalence = ioEquivalence;
        this.isSyncAndSafe = true;
        this.attributes = new Set();
        this.params = Object.create(null);
        this.addDependency($data);
    }
    toStringMeta() {
        return this.sourceDescription ?? null;
    }
    get(attr) {
        return this.cacheStep("get", attr, () => this._getInner(attr));
    }
    _getInner(attr) {
        // Allow auto-collapsing of the waterfall by knowing keys are equivalent
        if (this.operationPlan.phase === "plan" &&
            this.ioEquivalence[attr]) {
            return this.ioEquivalence[attr];
        }
        this.attributes.add(attr);
        return (0, access_js_1.access)(this, attr);
    }
    setParam(paramKey, value) {
        if (!this.isSingle) {
            throw new Error("setParam should not be called on list items - call it on the collection (`loadMany()` step)");
        }
        this.params[paramKey] = value;
    }
    optimize() {
        const $source = this.getDepDeep(0);
        if ($source instanceof LoadStep) {
            // Tell our parent we only need certain attributes
            $source.addAttributes(this.attributes);
            for (const [key, value] of Object.entries(this.params)) {
                $source.setParam(key, value);
            }
        }
        else {
            // This should never happen
            console.warn(`LoadedRecordStep could not find the parent LoadStep; instead found ${$source}`);
        }
        // Record has no run-time behaviour (it's just a plan-time helper), so we
        // can replace ourself with our dependency:
        return this.getDep(0);
    }
    // This'll never be called, due to `optimize` above.
    execute({ count, values: [values0], }) {
        return values0.isBatch
            ? values0.entries
            : (0, utils_js_1.arrayOfLength)(count, values0.value);
    }
}
exports.LoadedRecordStep = LoadedRecordStep;
class LoadStep extends step_js_1.Step {
    /* implements ListCapableStep<TItem, LoadedRecordStep<TItem, TParams>> */
    static { this.$$export = { moduleName: "grafast", exportName: "LoadStep" }; }
    constructor(spec, unarySpec, ioEquivalence, load) {
        super();
        this.ioEquivalence = ioEquivalence;
        this.load = load;
        this.isSyncAndSafe = false;
        this.loadOptions = null;
        this.loadOptionsKey = "";
        this.attributes = new Set();
        this.params = Object.create(null);
        this.unaryDepId = null;
        const $spec = (0, multistep_js_1.multistep)(spec, "load");
        this.addDependency($spec);
        const $unarySpec = unarySpec == null ? null : (0, multistep_js_1.multistep)(unarySpec, "loadUnary");
        if ($unarySpec) {
            this.unaryDepId = this.addUnaryDependency($unarySpec);
        }
    }
    toStringMeta() {
        return this.load.displayName || this.load.name;
    }
    makeAccessMap() {
        const map = Object.create(null);
        const $spec = this.getDep(0);
        if (this.ioEquivalence == null) {
            return map;
        }
        else if (typeof this.ioEquivalence === "string") {
            map[this.ioEquivalence] = $spec;
            return map;
        }
        else if ((0, utils_js_1.isTuple)(this.ioEquivalence)) {
            for (let i = 0, l = this.ioEquivalence.length; i < l; i++) {
                const key = this.ioEquivalence[i];
                map[key] = (0, step_js_1.isListLikeStep)($spec) ? $spec.at(i) : (0, access_js_1.access)($spec, [i]);
            }
            return map;
        }
        else if (typeof this.ioEquivalence === "object") {
            for (const key of Object.keys(this.ioEquivalence)) {
                const attr = this.ioEquivalence[key];
                if (attr != null) {
                    map[attr] = (0, step_js_1.isObjectLikeStep)($spec)
                        ? $spec.get(key)
                        : (0, access_js_1.access)($spec, [key]);
                }
            }
            return map;
        }
        else {
            throw new Error(`ioEquivalence passed to loadOne() or loadMany() call not understood`);
        }
    }
    listItem($item) {
        return new LoadedRecordStep($item, false, this.toStringMeta(), this.makeAccessMap());
    }
    single() {
        return new LoadedRecordStep(this, true, this.toStringMeta(), this.makeAccessMap());
    }
    setParam(paramKey, value) {
        this.params[paramKey] = value;
    }
    addAttributes(attributes) {
        for (const attribute of attributes) {
            this.attributes.add(attribute);
        }
    }
    finalize() {
        // Find all steps of this type that use the same callback and have
        // equivalent params and then match their list of attributes together.
        const stringifiedParams = (0, utils_js_1.canonicalJSONStringify)(this.params);
        const kin = this.operationPlan
            .getStepsByStepClass(LoadStep)
            .filter((step) => {
            if (step.id === this.id)
                return false;
            if (step.load !== this.load)
                return false;
            if ((0, utils_js_1.canonicalJSONStringify)(step.params) !== stringifiedParams)
                return false;
            return true;
        });
        for (const otherStep of kin) {
            for (const attr of otherStep.attributes) {
                this.attributes.add(attr);
            }
        }
        // Build the loadOptions
        this.loadOptions = {
            attributes: [...this.attributes].sort(),
            params: this.params,
        };
        // If the canonicalJSONStringify is the same, then we deem that the options are the same
        this.loadOptionsKey = (0, utils_js_1.canonicalJSONStringify)(this.loadOptions);
        let loadId = idByLoad.get(this.load);
        if (!loadId) {
            loadId = String(++loadCounter);
            idByLoad.set(this.load, loadId);
        }
        this.metaKey = `LoadStep|${loadId}|${this.loadOptionsKey}`;
        super.finalize();
    }
    execute({ count, values: [values0, values1], extra, }) {
        const meta = extra.meta;
        let cache = meta.cache;
        if (!cache) {
            cache = new Map();
            meta.cache = cache;
        }
        const batch = new Map();
        const unary = values1?.isBatch === false ? values1.value : undefined;
        const results = [];
        for (let i = 0; i < count; i++) {
            const spec = values0.at(i);
            if (cache.has(spec)) {
                results.push(cache.get(spec));
            }
            else {
                // We'll fill this in in a minute
                const index = results.push(null) - 1;
                const existingIdx = batch.get(spec);
                if (existingIdx !== undefined) {
                    existingIdx.push(index);
                }
                else {
                    batch.set(spec, [index]);
                }
            }
        }
        const pendingCount = batch.size;
        if (pendingCount > 0) {
            const deferred = (0, index_js_1.defer)();
            const batchSpecs = [...batch.keys()];
            const loadBatch = { deferred, batchSpecs };
            if (!meta.loadBatchesByLoad) {
                meta.loadBatchesByLoad = new Map();
            }
            let loadBatches = meta.loadBatchesByLoad.get(this.load);
            if (loadBatches) {
                // Add to existing batch load
                loadBatches.push(loadBatch);
            }
            else {
                // Create new batch load
                loadBatches = [loadBatch];
                meta.loadBatchesByLoad.set(this.load, loadBatches);
                // Guaranteed by the metaKey to be equivalent for all entries sharing the same `meta`. Note equivalent is not identical; key order may change.
                const loadOptions = this.loadOptions;
                process.nextTick(() => {
                    // Don't allow adding anything else to the batch
                    meta.loadBatchesByLoad.delete(this.load);
                    executeBatches(loadBatches, this.load, {
                        ...loadOptions,
                        unary: unary,
                    });
                });
            }
            return (async () => {
                const loadResults = await deferred;
                for (let pendingIndex = 0; pendingIndex < pendingCount; pendingIndex++) {
                    const spec = batchSpecs[pendingIndex];
                    const targetIndexes = batch.get(spec);
                    const loadResult = loadResults[pendingIndex];
                    cache.set(spec, loadResult);
                    for (const targetIndex of targetIndexes) {
                        results[targetIndex] = loadResult;
                    }
                }
                return results;
            })();
        }
        return results;
    }
}
exports.LoadStep = LoadStep;
async function executeBatches(loadBatches, load, loadOptions) {
    try {
        const numberOfBatches = loadBatches.length;
        if (numberOfBatches === 1) {
            const [loadBatch] = loadBatches;
            loadBatch.deferred.resolve(load(loadBatch.batchSpecs, loadOptions));
            return;
        }
        else {
            // Do some tick-batching!
            const indexStarts = [];
            const allBatchSpecs = [];
            for (let i = 0; i < numberOfBatches; i++) {
                const loadBatch = loadBatches[i];
                indexStarts[i] = allBatchSpecs.length;
                for (const batchSpec of loadBatch.batchSpecs) {
                    allBatchSpecs.push(batchSpec);
                }
            }
            const results = await load(allBatchSpecs, loadOptions);
            for (let i = 0; i < numberOfBatches; i++) {
                const loadBatch = loadBatches[i];
                const start = indexStarts[i];
                const stop = indexStarts[i + 1] ?? allBatchSpecs.length;
                const entries = results.slice(start, stop);
                loadBatch.deferred.resolve(entries);
            }
        }
    }
    catch (e) {
        for (const loadBatch of loadBatches) {
            loadBatch.deferred.reject(e);
        }
    }
}
function load(spec, unarySpec, ioEquivalence, loadCallback) {
    return new LoadStep(spec, unarySpec, ioEquivalence, loadCallback);
}
function loadMany(spec, loadCallbackOrIoEquivalenceOrUnarySpec, loadCallbackOrIoEquivalence, loadCallbackOnly) {
    if (loadCallbackOnly) {
        return load(spec, loadCallbackOrIoEquivalenceOrUnarySpec, loadCallbackOrIoEquivalence, loadCallbackOnly);
    }
    // At most 3 arguments
    else if ((0, multistep_js_1.isMultistep)(loadCallbackOrIoEquivalenceOrUnarySpec)) {
        return load(spec, loadCallbackOrIoEquivalenceOrUnarySpec, null, loadCallbackOrIoEquivalence);
    }
    // Unary step is definitely null; 3 arguments
    else if (loadCallbackOrIoEquivalence) {
        return load(spec, null, loadCallbackOrIoEquivalenceOrUnarySpec, loadCallbackOrIoEquivalence);
    }
    // 2 arguments
    else {
        return load(spec, null, null, loadCallbackOrIoEquivalenceOrUnarySpec);
    }
}
function loadOne(spec, loadCallbackOrIoEquivalenceOrUnarySpec, loadCallbackOrIoEquivalence, loadCallbackOnly) {
    if (loadCallbackOnly) {
        return load(spec, loadCallbackOrIoEquivalenceOrUnarySpec, loadCallbackOrIoEquivalence, loadCallbackOnly).single();
    }
    // At most 3 arguments
    else if ((0, multistep_js_1.isMultistep)(loadCallbackOrIoEquivalenceOrUnarySpec)) {
        return load(spec, loadCallbackOrIoEquivalenceOrUnarySpec, null, loadCallbackOrIoEquivalence).single();
    }
    // Unary step is definitely null; 3 arguments
    else if (loadCallbackOrIoEquivalence) {
        return load(spec, null, loadCallbackOrIoEquivalenceOrUnarySpec, loadCallbackOrIoEquivalence).single();
    }
    else {
        return load(spec, null, null, loadCallbackOrIoEquivalenceOrUnarySpec).single();
    }
}
//# sourceMappingURL=load.js.map