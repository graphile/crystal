"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__ListTransformStep = void 0;
exports.listTransform = listTransform;
const tslib_1 = require("tslib");
const assert = tslib_1.__importStar(require("../assert.js"));
const dev_js_1 = require("../dev.js");
const executeBucket_js_1 = require("../engine/executeBucket.js");
const LayerPlan_js_1 = require("../engine/LayerPlan.js");
const withGlobalLayerPlan_js_1 = require("../engine/lib/withGlobalLayerPlan.js");
const interfaces_js_1 = require("../interfaces.js");
const step_js_1 = require("../step.js");
const __item_js_1 = require("./__item.js");
const connection_js_1 = require("./connection.js");
/**
 * **Experimental.**
 *
 * A "special" plan that has custom handling in Grafast. Used for turning lists
 * into other things (or maybe more lists!).
 *
 * It's recommended that you don't use this directly, please use one of the
 * functions that uses this under the hood such as `filter()`.
 */
class __ListTransformStep extends step_js_1.Step {
    static { this.$$export = {
        moduleName: "grafast",
        exportName: "__ListTransformStep",
    }; }
    constructor(options) {
        super();
        // OPTIMIZE: if all the steps in the inner bucket are synchronous then theoretically we can be synchronous too
        this.isSyncAndSafe = false;
        const { listStep: rawListStep, itemPlanCallback, initialState, reduceCallback, finalizeCallback, listItem, meta, optimize, connectionClone, } = options;
        const listStep = (0, connection_js_1.itemsOrStep)(rawListStep);
        this.listStepDepId = this.addDependency(listStep);
        // PERF: This is just so we can populate getListStep() correctly... Ideally we could mark this as a "plan-time-only" dependency.
        this.rawListStepDepId =
            rawListStep === listStep
                ? this.listStepDepId
                : this.addDependency(rawListStep);
        this.itemPlanCallback = itemPlanCallback;
        this.initialState = initialState;
        this.reduceCallback = reduceCallback;
        this.finalizeCallback = finalizeCallback;
        this.listItem = listItem;
        this.meta = meta ?? null;
        if (optimize !== undefined) {
            this.optimize = optimize;
        }
        this.connectionClone = connectionClone;
        // Plan this subroutine
        this.subroutineLayer = new LayerPlan_js_1.LayerPlan(this.operationPlan, this.layerPlan, {
            type: "subroutine",
            parentStep: this,
        });
        const itemPlan = (0, withGlobalLayerPlan_js_1.withGlobalLayerPlan)(this.subroutineLayer, listStep.polymorphicPaths, () => {
            // This does NOT use `itemPlanFor` because __ListTransformPlans are special.
            const $__listItem = new __item_js_1.__ItemStep(listStep);
            $__listItem.transformStepId = this.id;
            this.itemStepId = $__listItem.id;
            const $listItem = (0, step_js_1.isListCapableStep)(listStep)
                ? listStep.listItem($__listItem)
                : $__listItem;
            const $newListItem = this.itemPlanCallback($listItem);
            if (this.isSyncAndSafe &&
                (!$__listItem.isSyncAndSafe ||
                    !$listItem.isSyncAndSafe ||
                    !$newListItem.isSyncAndSafe)) {
                this.isSyncAndSafe = false;
            }
            return $newListItem;
        });
        this.subroutineLayer.setRootStep(itemPlan);
        this.operationPlan.finishSubroutine(this, this.subroutineLayer);
    }
    toStringMeta() {
        return this.meta;
    }
    getListStep() {
        return this.getDepOptions(this.rawListStepDepId).step;
    }
    [interfaces_js_1.$$deepDepSkip]() {
        return this.getListStep();
    }
    dangerouslyGetListPlan() {
        return this.dependencies[this.rawListStepDepId];
    }
    deduplicate(peers) {
        return peers.filter((peer) => peer.itemPlanCallback === this.itemPlanCallback &&
            peer.initialState === this.initialState &&
            peer.reduceCallback === this.reduceCallback &&
            peer.finalizeCallback === this.finalizeCallback &&
            peer.listItem === this.listItem);
    }
    // ListTransform plans must _NOT_ optimize away. They must persist (unless
    // the options overrides this)
    optimize() {
        return this;
    }
    async execute({ indexForEach, indexMap, values, extra, }) {
        const bucket = extra._bucket;
        const childLayerPlan = this.subroutineLayer;
        const { copyStepIds, rootStep } = childLayerPlan;
        if (rootStep === null) {
            throw new Error(`rootStep of ${childLayerPlan} must not be null.`);
        }
        const store = new Map();
        const polymorphicPathList = [];
        const iterators = [];
        const map = new Map();
        let size = 0;
        // ENHANCE: do this better!
        const itemStep = this.operationPlan.dangerouslyGetStep(this.itemStepId);
        const itemStepId = itemStep.id;
        if (itemStepId == null) {
            throw new Error("GrafastInternalError<b3a2bff9-15c6-47e2-aa82-19c862324f1a>: listItem layer plan has no rootStepId");
        }
        const listStepValue = values[this.listStepDepId];
        if (itemStep._isUnary) {
            const list = listStepValue.unaryValue();
            store.set(itemStepId, (0, executeBucket_js_1.unaryExecutionValue)(Array.isArray(list) ? list[0] : list));
        }
        else {
            store.set(itemStepId, (0, executeBucket_js_1.batchExecutionValue)([]));
        }
        for (const stepId of copyStepIds) {
            const ev = bucket.store.get(stepId);
            if (!ev) {
                throw new Error(`GrafastInternalError<2be5c2c6-a7f8-4002-93a0-6ace5a89a962>: unary step '${stepId}' (${this.operationPlan.dangerouslyGetStep(stepId)}) listed in copyStepIds but not available in parent bucket for ${this}`);
            }
            if (ev.isBatch) {
                // Prepare store with an empty list for each copyPlanId
                store.set(stepId, (0, executeBucket_js_1.batchExecutionValue)([]));
            }
            else {
                store.set(stepId, ev);
            }
        }
        // We'll typically be creating more listItem bucket entries than we
        // have parent buckets, so we must "multiply up" the store entries.
        indexForEach((originalIndex) => {
            const list = listStepValue.at(originalIndex);
            if (Array.isArray(list)) {
                const newIndexes = [];
                map.set(originalIndex, newIndexes);
                for (let j = 0, l = list.length; j < l; j++) {
                    const newIndex = size++;
                    newIndexes.push(newIndex);
                    polymorphicPathList[newIndex] =
                        bucket.polymorphicPathList[originalIndex];
                    // Copying across the iterators because we do NOT call outputBucket,
                    // so we need to ensure any streams are cleaned up.
                    iterators[newIndex] = bucket.iterators[originalIndex];
                    const ev = store.get(itemStepId);
                    if (ev.isBatch) {
                        ev._setResult(newIndex, list[j], 0);
                    }
                    for (const planId of copyStepIds) {
                        const ev = store.get(planId);
                        if (ev.isBatch) {
                            const orig = bucket.store.get(planId);
                            ev._setResult(newIndex, orig.at(originalIndex), orig._flagsAt(originalIndex));
                        }
                    }
                }
            }
        });
        if (size > 0) {
            const childBucket = (0, executeBucket_js_1.newBucket)({
                layerPlan: childLayerPlan,
                size,
                store,
                flagUnion: bucket.flagUnion,
                polymorphicPathList,
                iterators,
            }, bucket.metaByMetaKey);
            await (0, executeBucket_js_1.executeBucket)(childBucket, extra._requestContext);
        }
        const depResults = store.get(rootStep.id);
        return indexMap((originalIndex) => {
            const list = listStepValue.at(originalIndex);
            if (list == null) {
                return list;
            }
            const indexes = map.get(originalIndex);
            if (!Array.isArray(list) || !Array.isArray(indexes)) {
                // ERRORS: should this be an error?
                console.warn(`Either list or values was not an array when processing ${this}`);
                return null;
            }
            const values = indexes.map((idx) => depResults.at(idx));
            if (dev_js_1.isDev) {
                assert.strictEqual(list.length, values.length, "GrafastInternalError<c85b6936-d406-4801-9c6b-625a567d32ff>: The list and values length must match for a __ListTransformStep");
            }
            const initialState = this.initialState();
            const reduceResult = list.reduce((memo, entireItemValue, listEntryIndex) => this.reduceCallback(memo, entireItemValue, values[listEntryIndex]), initialState);
            const finalResult = this.finalizeCallback
                ? this.finalizeCallback(reduceResult)
                : reduceResult;
            return finalResult;
        });
    }
}
exports.__ListTransformStep = __ListTransformStep;
/**
 * **Experimental.**
 *
 * A "special" plan that has custom handling in Grafast. Used for turning lists
 * into other things (or maybe more lists!).
 *
 * {@page ~grafast/steps/listTransform.md}
 */
function listTransform(options) {
    return new __ListTransformStep(options);
}
//# sourceMappingURL=listTransform.js.map