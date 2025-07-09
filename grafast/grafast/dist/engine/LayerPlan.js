"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayerPlan = void 0;
exports.isBranchingLayerPlan = isBranchingLayerPlan;
exports.isDeferredLayerPlan = isDeferredLayerPlan;
exports.isPolymorphicLayerPlan = isPolymorphicLayerPlan;
const tslib_1 = require("tslib");
const lru_1 = tslib_1.__importDefault(require("@graphile/lru"));
const tamedevil_1 = tslib_1.__importDefault(require("tamedevil"));
const assert = tslib_1.__importStar(require("../assert.js"));
const inspect_js_1 = require("../inspect.js");
const interfaces_js_1 = require("../interfaces.js");
const polymorphic_js_1 = require("../polymorphic.js");
const executeBucket_js_1 = require("./executeBucket.js");
function isBranchingLayerPlan(layerPlan) {
    return layerPlan.reason.type === "polymorphic";
}
function isDeferredLayerPlan(layerPlan) {
    const t = layerPlan.reason.type;
    return ((t === "listItem" && layerPlan.reason.stream != null) ||
        t === "subscription" ||
        t === "mutationField" ||
        t === "defer");
}
function isPolymorphicLayerPlan(layerPlan) {
    const t = layerPlan.reason.type;
    return t === "polymorphic";
}
/**
 * A LayerPlan represents (via "reason") either the root (root), when something
 * happens at a later time (mutationField, defer), when plurality changes
 * (list, stream, subscription, polymorphic), or when a subprocess needs to be
 * computed (subroutine).
 *
 * Layer plans belong to an operation plan.
 *
 * Every layer plan (except for the root layer plan) has exactly one parent
 * layer plan.
 *
 * Every layer plan is caused by a parent step.
 *
 * The LayerPlan of a step influences:
 *
 * 1. how steps are deduplicated
 * 2. the order in which the steps are executed
 * 3. where the result of executing the step is stored
 * 4. when the step execution cache is allowed to be GC'd
 *
 * NOTE: `__ListTransformStep`'s effectively have a temporary bucket inside
 * them (built on the `__Item`) that's thrown away once the transform is
 * complete.
 *
 */
class LayerPlan {
    constructor(operationPlan, parentLayerPlan, reason) {
        this.operationPlan = operationPlan;
        this.parentLayerPlan = parentLayerPlan;
        this.reason = reason;
        /**
         * Every layer plan has a "root step" that shapes the value the layer
         * returns. Note that this step may be dependent on other steps included in
         * the LayerPlan, or could be provided externally.
         *
         * The root step is different for different layer step reasons:
         *
         * - root: the `operationPlan.rootValue`
         * - listItem: the `__ItemStep`
         * - subscription: also the `__ItemStep`
         * - mutationField: the result plan of the mutation field
         * - defer: the parent layer's rootStep (defer always results in an object, unless an error occurs)
         * - polymorphic: the plan for the particular type
         * - subroutine: the result (returned) plan of the subroutine
         *
         * @internal
         */
        this.rootStep = null;
        /**
         * Which steps the results for which are available in a parent bucket need to
         * be "copied across" to this bucket because steps in this bucket still
         * reference them?
         *
         * @internal
         */
        this.copyStepIds = [];
        /** @internal */
        this.children = [];
        /** @internal */
        this.steps = [];
        /** @internal */
        this.pendingSteps = [];
        /**
         * This goes along with `parentStep` in the reason, except it applies to all
         * layer plan types and we figure it out automatically from the parent layer
         * plan. If this step has an error at a given index, then it should be
         * treated as if the parentStep had an error at that same index.
         *
         * @internal
         */
        this.parentSideEffectStep = null;
        /**
         * This tracks the latest seen side effect at the current point in planning
         * (such that created steps take this to be their implicitSideEffectStep).
         * This isn't used once planning is complete.
         *
         * @internal
         */
        this.latestSideEffectStep = null;
        /**
         * Describes the order in which the steps within this LayerPlan are executed.
         *
         * Special attention must be paid to steps that have side effects.
         *
         * @internal
         */
        this.phases = [];
        this._hasSetRootStep = false;
        // This layer plan is dependent on the latest side effect. Note that when
        // we set a `rootStep` later, if the root step is dependent on this step
        // (directly or indirectly) we will clear this property.
        this.parentSideEffectStep = parentLayerPlan?.latestSideEffectStep ?? null;
        // There has yet to be any side effects created in this layer.
        this.latestSideEffectStep = null;
        this.stepsByConstructor = new Map();
        if (parentLayerPlan !== null) {
            this.depth = parentLayerPlan.depth + 1;
            this.ancestry = [...parentLayerPlan.ancestry, this];
            if (isDeferredLayerPlan(this)) {
                this.deferBoundaryDepth = this.depth;
            }
            else {
                this.deferBoundaryDepth = parentLayerPlan.deferBoundaryDepth;
            }
        }
        else {
            this.depth = 0;
            this.ancestry = [this];
            this.deferBoundaryDepth = 0;
        }
        this.id = operationPlan.addLayerPlan(this);
        if (!parentLayerPlan) {
            assert.strictEqual(this.id, 0, "All but the first LayerPlan must have a parent");
        }
        else {
            assert.ok(reason.type != "root", "Non-root LayerPlan must have a parentStep");
            parentLayerPlan.children.push(this);
        }
    }
    toString() {
        let chain = "";
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let current = this;
        while ((current = current.parentLayerPlan)) {
            chain = chain + `∈${current.id}`;
        }
        const reasonExtra = this.reason.type === "polymorphic"
            ? `{${this.reason.typeNames.join(",")}}`
            : "";
        const deps = this.copyStepIds.length > 0 ? `/${this.copyStepIds}` : "";
        return `LayerPlan<${this.id}${chain}${this.parentSideEffectStep ? `^${this.parentSideEffectStep.id}` : ""}?${this.reason.type}${reasonExtra}!${this.rootStep?.id ?? "x"}${deps}>`;
    }
    print(depth = 0) {
        const output = [`${" ".repeat(depth * 2)}${this}`];
        for (const child of this.children) {
            output.push(child.print(depth + 1));
        }
        return output.join("\n");
    }
    setRootStep($root) {
        if (this._hasSetRootStep) {
            throw new Error(`Set root step on ${this} more than once`);
        }
        this._hasSetRootStep = true;
        this.operationPlan.stepTracker.setLayerPlanRootStep(this, $root);
        // NOTE: we may clear `this.parentSideEffectStep` based on the `$root` step
        // having an explicit dependency on `this.parentSideEffectStep`; but that
        // will be done as part of `OperationPlan::finalizeLayerPlans()` because
        // steps aren't assigned `implicitSideEffectStep`s until that point.
    }
    /** @internal Use plan.getStep(id) instead. */
    getStep(id, requestingStep) {
        return this.operationPlan.getStep(id, requestingStep);
    }
    /** @internal */
    _addStep(step) {
        return this.operationPlan._addStep(step);
    }
    finalize() {
        if (
        // this.reason.type === "nullableBoundary" ||
        this.reason.type === "listItem") {
            const u = this.copyStepIds.length;
            const signature = `${this.reason.type[0]}_${u}`;
            withNewBucketFactory(signature, u, this.reason.type, (fn) => {
                this.newBucket = fn(this.copyStepIds);
            });
        }
    }
    newBucket(parentBucket) {
        const { copyStepIds } = this;
        const store = new Map();
        const polymorphicPathList = this.reason.type === "mutationField"
            ? parentBucket.polymorphicPathList
            : [];
        const iterators = this.reason.type === "mutationField" ? parentBucket.iterators : [];
        const map = new Map();
        const $parentSideEffect = this.parentSideEffectStep;
        let parentSideEffectValue;
        if ($parentSideEffect) {
            parentSideEffectValue = parentBucket.store.get($parentSideEffect.id);
        }
        else {
            parentSideEffectValue = null;
        }
        let size = 0;
        switch (this.reason.type) {
            case "nullableBoundary": {
                if (this.rootStep == null) {
                    throw new Error("GrafastInternalError<f8136364-46c7-4886-b2ae-51319826f97d>: nullableStepStore layer plan has no rootStepId");
                }
                const itemStepId = this.rootStep.id;
                // PERF: if parent bucket has no nulls/errors in `itemStepId`
                // then we can just copy everything wholesale rather than building
                // new arrays and looping.
                const hasNoNullsOrErrors = false;
                if (this.rootStep._isUnary) {
                    const fieldValue = parentBucket.store.get(itemStepId);
                    const forbiddenFlags = fieldValue._entryFlags & interfaces_js_1.FORBIDDEN_BY_NULLABLE_BOUNDARY_FLAGS;
                    if (forbiddenFlags) {
                        size = 0;
                    }
                    else {
                        store.set(itemStepId, fieldValue);
                        for (const stepId of copyStepIds) {
                            store.set(stepId, parentBucket.store.get(stepId));
                        }
                        const parentBucketSize = parentBucket.size;
                        for (let originalIndex = 0; originalIndex < parentBucketSize; originalIndex++) {
                            if (parentSideEffectValue === null ||
                                !(parentSideEffectValue._flagsAt(originalIndex) & interfaces_js_1.FLAG_ERROR)) {
                                const newIndex = size++;
                                map.set(originalIndex, newIndex);
                                polymorphicPathList[newIndex] =
                                    parentBucket.polymorphicPathList[originalIndex];
                                iterators[newIndex] = parentBucket.iterators[originalIndex];
                            }
                        }
                    }
                }
                else if (hasNoNullsOrErrors) {
                    const nullableStepStore = parentBucket.store.get(itemStepId);
                    if (!nullableStepStore) {
                        throw new Error(`GrafastInternalError<017dc8bf-1db1-4983-a41e-e69c6652e4c7>: could not find entry '${itemStepId}' (${parentBucket.layerPlan.operationPlan.dangerouslyGetStep(itemStepId)}) in store for ${parentBucket.layerPlan}`);
                    }
                    store.set(itemStepId, nullableStepStore);
                    for (const stepId of copyStepIds) {
                        store.set(stepId, parentBucket.store.get(stepId));
                    }
                    for (let originalIndex = 0; originalIndex < parentBucket.size; originalIndex++) {
                        const newIndex = size++;
                        map.set(originalIndex, newIndex);
                        polymorphicPathList[newIndex] =
                            parentBucket.polymorphicPathList[originalIndex];
                        iterators[newIndex] = parentBucket.iterators[originalIndex];
                    }
                }
                else {
                    const itemStepIdList = [];
                    store.set(itemStepId, (0, executeBucket_js_1.batchExecutionValue)(itemStepIdList));
                    for (const stepId of copyStepIds) {
                        const ev = parentBucket.store.get(stepId);
                        if (ev.isBatch) {
                            // Prepare store with an empty list for each copyPlanId
                            store.set(stepId, (0, executeBucket_js_1.batchExecutionValue)([]));
                        }
                        else {
                            store.set(stepId, ev);
                        }
                    }
                    const nullableStepStore = parentBucket.store.get(itemStepId);
                    if (!nullableStepStore) {
                        throw new Error(`GrafastInternalError<017dc8bf-1db1-4983-a41e-e69c6652e4c7>: could not find entry '${itemStepId}' (${parentBucket.layerPlan.operationPlan.dangerouslyGetStep(itemStepId)}) in store for ${parentBucket.layerPlan}`);
                    }
                    // We'll typically be creating fewer nullableBoundary bucket entries
                    // than we have parent bucket entries (because we exclude nulls), so
                    // we must "multiply up" (down) the store entries.
                    for (let originalIndex = 0; originalIndex < parentBucket.size; originalIndex++) {
                        if ((parentSideEffectValue === null ||
                            !(parentSideEffectValue._flagsAt(originalIndex) & interfaces_js_1.FLAG_ERROR)) &&
                            !(nullableStepStore._flagsAt(originalIndex) & interfaces_js_1.FLAG_NULL)) {
                            const newIndex = size++;
                            map.set(originalIndex, newIndex);
                            const fieldValue = nullableStepStore.at(originalIndex);
                            itemStepIdList[newIndex] = fieldValue;
                            polymorphicPathList[newIndex] =
                                parentBucket.polymorphicPathList[originalIndex];
                            iterators[newIndex] = parentBucket.iterators[originalIndex];
                            for (const stepId of copyStepIds) {
                                const ev = store.get(stepId);
                                if (ev.isBatch) {
                                    const orig = parentBucket.store.get(stepId);
                                    ev._copyResult(newIndex, orig, originalIndex);
                                }
                            }
                        }
                    }
                }
                break;
            }
            case "listItem": {
                const listStepId = this.reason.parentStep.id;
                const listStepStore = parentBucket.store.get(listStepId);
                if (!listStepStore) {
                    throw new Error(`GrafastInternalError<314865b0-f7e8-4e81-b966-56e5a0de562e>: could not find entry '${listStepId}' (${parentBucket.layerPlan.operationPlan.dangerouslyGetStep(listStepId)}) in store for layerPlan ${parentBucket.layerPlan}`);
                }
                if (this.rootStep == null) {
                    throw new Error("GrafastInternalError<b3a2bff9-15c6-47e2-aa82-19c862324f1a>: listItem layer plan has no rootStepId");
                }
                const itemStepId = this.rootStep.id;
                // Item steps are **NOT** unary
                if (this.rootStep._isUnary) {
                    throw new Error("listItem layer plan can't have a unary root step!");
                }
                const ev = (0, executeBucket_js_1.batchExecutionValue)([]);
                store.set(itemStepId, ev);
                for (const stepId of copyStepIds) {
                    // Deliberate shadowing
                    const ev = parentBucket.store.get(stepId);
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
                for (let originalIndex = 0; originalIndex < parentBucket.size; originalIndex++) {
                    const list = listStepStore.at(originalIndex);
                    if ((parentSideEffectValue === null ||
                        !(parentSideEffectValue._flagsAt(originalIndex) & interfaces_js_1.FLAG_ERROR)) &&
                        Array.isArray(list)) {
                        const newIndexes = [];
                        map.set(originalIndex, newIndexes);
                        for (let j = 0, l = list.length; j < l; j++) {
                            const newIndex = size++;
                            newIndexes.push(newIndex);
                            ev.entries[newIndex] = list[j];
                            // TODO: are these the right flags?
                            ev._flags[newIndex] = list[j] == null ? interfaces_js_1.FLAG_NULL : interfaces_js_1.NO_FLAGS;
                            polymorphicPathList[newIndex] =
                                parentBucket.polymorphicPathList[originalIndex];
                            iterators[newIndex] = parentBucket.iterators[originalIndex];
                            for (const stepId of copyStepIds) {
                                const ev = store.get(stepId);
                                if (ev.isBatch) {
                                    const orig = parentBucket.store.get(stepId);
                                    ev._copyResult(newIndex, orig, originalIndex);
                                }
                            }
                        }
                    }
                }
                break;
            }
            case "mutationField": {
                // This is a 1-to-1 map, so we can mostly just copy from parent bucket
                size = parentBucket.size;
                for (let i = 0; i < parentBucket.size; i++) {
                    map.set(i, i);
                }
                for (const stepId of copyStepIds) {
                    store.set(stepId, parentBucket.store.get(stepId));
                }
                break;
            }
            case "polymorphic": {
                const polymorphicPlanId = this.reason.parentStep.id;
                const polymorphicPlanStore = parentBucket.store.get(polymorphicPlanId);
                if (!polymorphicPlanStore) {
                    throw new Error(`GrafastInternalError<af1417c6-752b-466e-af7e-cfc35724c3bc>: Entry for '${parentBucket.layerPlan.operationPlan.dangerouslyGetStep(polymorphicPlanId)}' not found in bucket for '${parentBucket.layerPlan}'`);
                }
                // We're only copying over the entries that match this type (note:
                // they may end up being null, but that's okay)
                const targetTypeNames = this.reason.typeNames;
                for (const stepId of copyStepIds) {
                    const ev = parentBucket.store.get(stepId);
                    if (!ev) {
                        throw new Error(`GrafastInternalError<548f0d84-4556-4189-8655-fb16aa3345a6>: new bucket for ${this} wants to copy ${this.operationPlan.dangerouslyGetStep(stepId)}, but bucket for ${parentBucket.layerPlan} doesn't contain that plan`);
                    }
                    if (ev.isBatch) {
                        store.set(stepId, (0, executeBucket_js_1.batchExecutionValue)([]));
                    }
                    else {
                        store.set(stepId, ev);
                    }
                }
                for (let originalIndex = 0; originalIndex < parentBucket.size; originalIndex++) {
                    const flags = polymorphicPlanStore._flagsAt(originalIndex);
                    if (flags & (interfaces_js_1.FLAG_ERROR | interfaces_js_1.FLAG_INHIBITED | interfaces_js_1.FLAG_NULL)) {
                        continue;
                    }
                    if (parentSideEffectValue !== null &&
                        parentSideEffectValue._flagsAt(originalIndex) & interfaces_js_1.FLAG_ERROR) {
                        continue;
                    }
                    const value = polymorphicPlanStore.at(originalIndex);
                    const typeName = (0, polymorphic_js_1.resolveType)(value);
                    if (!targetTypeNames.includes(typeName)) {
                        continue;
                    }
                    const newIndex = size++;
                    map.set(originalIndex, newIndex);
                    // PERF: might be faster if we look this up as a constant rather than using concatenation here
                    const newPolymorphicPath = (parentBucket.polymorphicPathList[originalIndex] ?? "") +
                        ">" +
                        typeName;
                    polymorphicPathList[newIndex] = newPolymorphicPath;
                    iterators[newIndex] = parentBucket.iterators[originalIndex];
                    for (const planId of copyStepIds) {
                        const ev = store.get(planId);
                        if (ev.isBatch) {
                            const orig = parentBucket.store.get(planId);
                            ev._copyResult(newIndex, orig, originalIndex);
                        }
                    }
                }
                break;
            }
            case "subscription":
            case "defer": {
                // TODO
                throw new Error("TODO");
            }
            case "subroutine": {
                throw new Error("Subroutines are experimental and must currently handle their own bucket creation");
            }
            case "root": {
                throw new Error(
                // *confused emoji*
                "GrafastInternalError<05fb7069-81b5-43f7-ae71-f62547d2c2b7>: root cannot be not the root (...)");
            }
            default: {
                const never = this.reason;
                throw new Error(`GrafastInternalError<8162e6c2-3d66-4d67-ba03-5310a4f9a6d4>: unhandled reason '${(0, inspect_js_1.inspect)(never)}'`);
            }
        }
        if (size > 0) {
            // Reference
            const childBucket = (0, executeBucket_js_1.newBucket)({
                layerPlan: this,
                size,
                store,
                // PERF: not necessarily, if we don't copy the errors, we don't have the errors.
                flagUnion: parentBucket.flagUnion,
                polymorphicPathList,
                iterators,
            }, parentBucket.metaByMetaKey);
            parentBucket.children[this.id] = {
                bucket: childBucket,
                map,
            };
            return childBucket;
        }
        else {
            return null;
        }
    }
}
exports.LayerPlan = LayerPlan;
const makeNewBucketCache = new lru_1.default({
    maxLength: 1000,
});
const makingNewBucketCallbacks = new Map();
const te_parentBucketDotPolymorphicPathList = (0, tamedevil_1.default) `parentBucket.polymorphicPathList`;
const te_parentBucketDotIterators = (0, tamedevil_1.default) `parentBucket.iterators`;
const te_emptyArray = (0, tamedevil_1.default) `[]`;
const ref_newBucket = tamedevil_1.default.ref(executeBucket_js_1.newBucket, "newBucket");
const ref_batchExecutionValue = tamedevil_1.default.ref(executeBucket_js_1.batchExecutionValue, "batchExecutionValue");
function makeNewBucketExpression(signature, reasonType, inner) {
    const expr = (0, tamedevil_1.default) `\
(function ${tamedevil_1.default.identifier(`newBucket_${signature}`)}(parentBucket) {
  const store = new Map();
  const polymorphicPathList = ${reasonType === "mutationField"
        ? te_parentBucketDotPolymorphicPathList
        : te_emptyArray};
  const iterators = ${reasonType === "mutationField" ? te_parentBucketDotIterators : te_emptyArray};
  const map = new Map();
  let size = 0;

${inner}

  if (size > 0) {
    // Reference
    const childBucket = ${ref_newBucket}({
      layerPlan: this,
      size,
      store,
      // PERF: not necessarily, if we don't copy the errors, we don't have the errors.
      flagUnion: parentBucket.flagUnion,
      polymorphicPathList,
      iterators,
    }, parentBucket.metaByMetaKey);
    // PERF: set ourselves in more places so that we never have to call 'getChildBucketAndIndex'.
    parentBucket.children[this.id] = { bucket: childBucket, map };

    return childBucket;
  } else {
    return null;
  }
})`;
    // te.debug(expr);
    return expr;
}
function newBucketFactoryInnerExpression(signature, copyCount, reasonType) {
    if (reasonType === "nullableBoundary") {
        if (Math.random() < 2) {
            throw new Error("This code no longer works since we added unary steps.");
        }
        // PERF: if parent bucket has no nulls/errors in itemStepId
        // then we can just copy everything wholesale rather than building
        // new arrays and looping.
        const blocks = [];
        const copyBlocks = [];
        for (let i = 0; i < copyCount; i++) {
            const te_source = tamedevil_1.default.identifier(`source${i}`);
            const te_target = tamedevil_1.default.identifier(`target${i}`);
            const te_i = tamedevil_1.default.lit(i);
            blocks.push((0, tamedevil_1.default) `\
  const ${te_source} = parentBucket.store.get(copyStepIds[${te_i}]);
  const ${te_target} = ${te_source}.isBatch ? ${ref_batchExecutionValue}([]) : ${te_source};
  store.set(copyStepIds[${te_i}], ${te_target});
`);
            copyBlocks.push((0, tamedevil_1.default) `\
      if(${te_target}.isBatch) {
        ${te_target}.entries[newIndex] = ${te_source}.at(originalIndex);
      }
`);
        }
        return makeNewBucketExpression(signature, reasonType, (0, tamedevil_1.default) `\
  const itemStepId = this.rootStep.id;
  const nullableStepStore = parentBucket.store.get(itemStepId);

  const itemStepIdList = [];
  store.set(itemStepId, ${ref_batchExecutionValue}(itemStepIdList));

  // Prepare store with an empty list for each copyPlanId
${tamedevil_1.default.join(blocks, "")}

  // We'll typically be creating fewer nullableBoundary bucket entries
  // than we have parent bucket entries (because we exclude nulls), so
  // we must "multiply up" (down) the store entries.
  for (
    let originalIndex = 0;
    originalIndex < parentBucket.size;
    originalIndex++
  ) {
    const fieldValue = nullableStepStore.at(originalIndex);
    if (fieldValue != null) {
      const newIndex = size++;
      map.set(originalIndex, newIndex);
      itemStepIdList[newIndex] = fieldValue;

      polymorphicPathList[newIndex] = parentBucket.polymorphicPathList[originalIndex];
      iterators[newIndex] = parentBucket.iterators[originalIndex];
${tamedevil_1.default.join(copyBlocks, "")}
    }
  }
`);
    }
    else if (reasonType === "listItem") {
        const blocks = [];
        const copyBlocks = [];
        for (let i = 0; i < copyCount; i++) {
            const te_source = tamedevil_1.default.identifier(`source${i}`);
            const te_target = tamedevil_1.default.identifier(`target${i}`);
            const te_i = tamedevil_1.default.lit(i);
            blocks.push((0, tamedevil_1.default) `\
  const ${te_source} = parentBucket.store.get(copyStepIds[${te_i}]);
  const ${te_target} = ${te_source}.isBatch ? ${ref_batchExecutionValue}([]) : ${te_source};
  store.set(copyStepIds[${te_i}], ${te_target});
  `);
            copyBlocks.push((0, tamedevil_1.default) `\
        if (${te_target}.isBatch) {
          ${te_target}.entries[newIndex] = ${te_source}.at(originalIndex);
        }
        `);
        }
        return makeNewBucketExpression(signature, reasonType, (0, tamedevil_1.default) `\
  const listStepId = this.reason.parentStep.id;
  const listStepStore = parentBucket.store.get(listStepId);

  const itemStepIdList = [];
  store.set(this.rootStep.id, ${ref_batchExecutionValue}(itemStepIdList));

  // Prepare store with an empty list for each copyPlanId
  ${tamedevil_1.default.join(blocks, "")}

  // We'll typically be creating more listItem bucket entries than we
  // have parent buckets, so we must "multiply up" the store entries.
  for (
    let originalIndex = 0;
    originalIndex < parentBucket.size;
    originalIndex++
  ) {
    const list = listStepStore.at(originalIndex);
    if (Array.isArray(list)) {
      const newIndexes = [];
      map.set(originalIndex, newIndexes);
      for (let j = 0, l = list.length; j < l; j++) {
        const newIndex = size++;
        newIndexes.push(newIndex);
        itemStepIdList[newIndex] = list[j];

        polymorphicPathList[newIndex] = parentBucket.polymorphicPathList[originalIndex];
        iterators[newIndex] = parentBucket.iterators[originalIndex];
        ${tamedevil_1.default.join(copyBlocks, "")}
      }
    }
  }

`);
    }
    else {
        const never = reasonType;
        return never;
    }
}
function withNewBucketFactory(signature, copyCount, reasonType, callback) {
    const fn = makeNewBucketCache.get(signature);
    if (fn !== undefined) {
        return callback(fn);
    }
    const building = makingNewBucketCallbacks.get(signature);
    if (building !== undefined) {
        building.push(callback);
        return;
    }
    const callbacks = [callback];
    makingNewBucketCallbacks.set(signature, callbacks);
    const executorExpression = newBucketFactoryInnerExpression(signature, copyCount, reasonType);
    const factoryExpression = (0, tamedevil_1.default) `\
function ${tamedevil_1.default.identifier(`layerPlanNewBucketFactory_${signature}`)}(copyStepIds) {
  return ${executorExpression};
}`;
    tamedevil_1.default.runInBatch(factoryExpression, (factory) => {
        makeNewBucketCache.set(signature, factory);
        makingNewBucketCallbacks.delete(signature);
        for (const callback of callbacks) {
            callback(factory);
        }
    });
}
//# sourceMappingURL=LayerPlan.js.map