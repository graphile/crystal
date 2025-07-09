"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListStep = void 0;
exports.list = list;
const step_js_1 = require("../step.js");
const constant_js_1 = require("./constant.js");
const DEFAULT_CACHE_SIZE = 100;
class ListStep extends step_js_1.UnbatchedStep {
    static { this.$$export = {
        moduleName: "grafast",
        exportName: "ListStep",
    }; }
    constructor(list, cacheConfig) {
        super();
        this.isSyncAndSafe = true;
        this.allowMultipleOptimizations = true;
        this.optimizeMetaKey = "ListStep";
        this.valueCount = list.length;
        this.cacheSize =
            cacheConfig?.cacheSize ??
                (cacheConfig?.identifier ? DEFAULT_CACHE_SIZE : 0);
        this.metaKey =
            this.cacheSize <= 0
                ? undefined
                : cacheConfig?.identifier
                    ? `list|${list.length}|${cacheConfig.identifier}`
                    : this.id;
        for (let i = 0, l = list.length; i < l; i++) {
            this.addDependency({ step: list[i], skipDeduplication: true });
        }
    }
    toStringMeta() {
        return this.dependencies.map(($dep) => $dep.id).join(",");
    }
    execute({ indexMap, values }) {
        return indexMap((i) => values.map((value) => value.at(i)));
    }
    unbatchedExecute(_extra, ...values //UnwrapPlanTuple<TPlanTuple>,
    ) {
        return values;
    }
    deduplicatedUnbatchedExecute({ meta: inMeta }, ...values //UnwrapPlanTuple<TPlanTuple>,
    ) {
        const meta = inMeta;
        if (meta.nextIndex !== undefined) {
            outer: for (let i = 0, l = meta.results.length; i < l; i++) {
                const cachedValues = meta.results[i];
                for (let j = 0, c = this.valueCount; j < c; j++) {
                    if (values[j] !== cachedValues[j]) {
                        continue outer;
                    }
                }
                return cachedValues;
            }
        }
        else {
            meta.nextIndex = 0;
            meta.results = [];
        }
        meta.results[meta.nextIndex] = values;
        // Only cache this.cacheSize results, use a round-robin
        const maxIndex = this.cacheSize - 1;
        meta.nextIndex = meta.nextIndex === maxIndex ? 0 : meta.nextIndex + 1;
        return values;
    }
    deduplicate(peers) {
        return peers;
    }
    optimize(opts) {
        if (this.dependencies.every((dep) => dep instanceof constant_js_1.ConstantStep)) {
            const meta = opts.meta;
            // Used to validate the lists have the same length
            const cardinality = this.dependencies.length;
            if (!meta[cardinality]) {
                meta[cardinality] = [];
            }
            const existing = meta[cardinality].find((l) => l.every((v, i) => v === this.dependencies[i].data));
            const isSensitive = this.dependencies.some((d) => d.isSensitive);
            if (existing !== undefined) {
                return (0, constant_js_1.constant)(existing, isSensitive);
            }
            else {
                // Replace self with constant
                const arr = this.dependencies.map((dep) => dep.data);
                meta[cardinality].push(arr);
                return (0, constant_js_1.constant)(arr, isSensitive);
            }
        }
        return this;
    }
    finalize() {
        if (this.cacheSize > 0) {
            this.unbatchedExecute = this.deduplicatedUnbatchedExecute;
        }
        super.finalize();
    }
    /**
     * Get the original plan at the given index back again.
     */
    at(index) {
        return this.getDep(index);
    }
    first() {
        return this.getDep(0);
    }
    last() {
        return this.getDep(this.dependencies.length - 1);
    }
}
exports.ListStep = ListStep;
/**
 * Takes a list of plans and turns it into a single plan that represents the
 * list of their values.
 */
function list(list, cacheConfig) {
    return new ListStep(list, cacheConfig);
}
//# sourceMappingURL=list.js.map