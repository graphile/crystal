"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplyTransformsStep = void 0;
exports.applyTransforms = applyTransforms;
const tslib_1 = require("tslib");
const assert = tslib_1.__importStar(require("../assert.js"));
const dev_js_1 = require("../dev.js");
const executeBucket_js_1 = require("../engine/executeBucket.js");
const LayerPlan_js_1 = require("../engine/LayerPlan.js");
const withGlobalLayerPlan_js_1 = require("../engine/lib/withGlobalLayerPlan.js");
const error_js_1 = require("../error.js");
const interfaces_js_1 = require("../interfaces.js");
const step_js_1 = require("../step.js");
const __item_js_1 = require("./__item.js");
const connection_js_1 = require("./connection.js");
/**
 * @internal
 */
class ApplyTransformsStep extends step_js_1.Step {
    static { this.$$export = {
        moduleName: "grafast",
        exportName: "ApplyTransformsStep",
    }; }
    constructor($step) {
        super();
        // OPTIMIZE: if all the steps in the inner bucket are synchronous then theoretically we can be synchronous too
        this.isSyncAndSafe = false;
        const listPlan = (0, connection_js_1.itemsOrStep)($step);
        this.addDependency(listPlan);
        // Plan this subroutine
        this.subroutineLayer = new LayerPlan_js_1.LayerPlan(this.operationPlan, this.layerPlan, {
            type: "subroutine",
            parentStep: this,
        });
        const itemPlan = (0, withGlobalLayerPlan_js_1.withGlobalLayerPlan)(this.subroutineLayer, listPlan.polymorphicPaths, () => {
            // This does NOT use `itemPlanFor` because __ListTransformPlans are special.
            const $__listItem = new __item_js_1.__ItemStep(listPlan);
            $__listItem.transformStepId = this.id;
            this.itemStepId = $__listItem.id;
            const $listItem = (0, step_js_1.isListCapableStep)(listPlan)
                ? listPlan.listItem($__listItem)
                : $__listItem;
            const $newListItem = applyTransforms($listItem);
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
    async execute({ indexMap, values: [values0], extra, }) {
        const bucket = extra._bucket;
        const childLayerPlan = this.subroutineLayer;
        const { copyStepIds, rootStep } = childLayerPlan;
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
        if (itemStep._isUnary) {
            store.set(itemStepId, (0, executeBucket_js_1.unaryExecutionValue)(values0.unaryValue()));
        }
        else {
            store.set(itemStepId, (0, executeBucket_js_1.batchExecutionValue)([]));
        }
        for (const stepId of copyStepIds) {
            const ev = bucket.store.get(stepId);
            if (!ev) {
                throw new Error(`GrafastInternalError<68675bbd-bc15-4c4a-902a-61c0de616325>: unary step '${stepId}' (${this.operationPlan.dangerouslyGetStep(stepId)}) listed in copyStepIds but not available in parent bucket for ${this}`);
            }
            if (ev.isBatch) {
                // Prepare store with an empty list for each copyBatchPlanId
                store.set(stepId, (0, executeBucket_js_1.batchExecutionValue)([]));
            }
            else {
                store.set(stepId, ev);
            }
        }
        // We'll typically be creating more listItem bucket entries than we
        // have parent buckets, so we must "multiply up" the store entries.
        indexMap((originalIndex) => {
            const list = values0.at(originalIndex);
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
                        // TODO: check for error?
                        ev._setResult(newIndex, list[j], 0);
                    }
                    for (const copyStepId of copyStepIds) {
                        const ev = store.get(copyStepId);
                        if (ev.isBatch) {
                            const orig = bucket.store.get(copyStepId);
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
            const list = values0.at(originalIndex);
            if (list == null) {
                return list;
            }
            const indexes = map.get(originalIndex);
            if (!Array.isArray(list) || !Array.isArray(indexes)) {
                // Not a list value; just pass it straight through
                return list;
            }
            const values = indexes.map((idx) => {
                const val = depResults.at(idx);
                if (depResults._flagsAt(idx) & interfaces_js_1.FLAG_ERROR) {
                    return (0, error_js_1.flagError)(val);
                }
                return val;
            });
            if (dev_js_1.isDev) {
                assert.strictEqual(list.length, values.length, "GrafastInternalError<43cb302e-673b-4881-8c4c-f2d00fe5a3d7>: The list and values length must match for a ApplyTransformsStep");
            }
            return values;
        });
    }
}
exports.ApplyTransformsStep = ApplyTransformsStep;
// TODO: document this better. (Had to do it for `each($items, $item =>
// object({...}))` JSON transform in pg-many-to-many
/**
 * If you want to use a step that might represent a list and you need all of
 * the `listItem` transforms to have already taken place (e.g. you're going to
 * send the result to an external service) rather than processing them through
 * the GraphQL response, then you may need to call `applyTransforms` on it.
 */
function applyTransforms($step) {
    if ((0, step_js_1.isListCapableStep)($step)) {
        return $step.operationPlan.cacheStep($step, "GrafastInternal:applyTransforms()", "", () => new ApplyTransformsStep($step));
    }
    else {
        // No eval necessary
        return $step;
    }
}
//# sourceMappingURL=applyTransforms.js.map