"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StepTracker = void 0;
const dev_js_1 = require("../dev.js");
const inspect_js_1 = require("../inspect.js");
const interfaces_js_1 = require("../interfaces.js");
const step_js_1 = require("../step.js");
const utils_js_1 = require("../utils.js");
const lock_js_1 = require("./lock.js");
/**
 * This class keeps track of all of our steps, and the dependencies between
 * steps and other steps, layer plans and steps, and output plans and steps.
 *
 * When a step is replaced by another step, all the dependencies are updated
 * such that the replaced step simply evaporates.
 *
 * @internal
 */
class StepTracker {
    constructor(operationPlan) {
        this.operationPlan = operationPlan;
        /** @internal */
        this.stepCount = 0;
        /** @internal */
        this.lockedStepCount = 0;
        /** @internal */
        this.activeSteps = new Set();
        /** @internal */
        this.stepById = [];
        /** @internal */
        this.aliasesById = [];
        /** @internal */
        this.stepsWithNoDependenciesByConstructor = new Map();
        /** @internal */
        this.internalDependencies = new Set();
        /** @internal */
        this.outputPlansByRootStep = new Map();
        /** @internal */
        this.layerPlansByRootStep = new Map();
        /** @internal */
        this.layerPlansByParentStep = new Map();
        /** @internal */
        this.layerPlans = [];
        /**
         * All the OutputPlans that were created to allow a more efficient
         * walkOutputPlans implementation.
         *
         * @internal
         */
        this.allOutputPlans = [];
        this.nextStepIdToDeduplicate = 0;
    }
    newStepsSince(oldStepCount) {
        return this.stepById.slice(oldStepCount);
    }
    forbid(key) {
        this[key] = () => {
            throw new Error(`StepTracker.${key}(...) is forbidden after 'finalize' phase`);
        };
    }
    /** Called when OperationPlan enters finalize phase. */
    finalizeSteps() {
        this.forbid("addStep");
        this.forbid("addLayerPlan");
        this.forbid("addOutputPlan");
        this.forbid("deleteLayerPlan");
        this.forbid("addStepDependency");
        this.forbid("setLayerPlanRootStep");
        this.forbid("replaceStep");
    }
    /** Called when OperationPlan is about to finalize the output plans. */
    finalizeOutputPlans() {
        this.forbid("setOutputPlanRootStep");
    }
    addStep($step) {
        const stepId = this.stepCount++;
        this.activeSteps.add($step);
        const ctor = $step.constructor;
        let stepsWithNoDependencies = this.stepsWithNoDependenciesByConstructor.get(ctor);
        if (!stepsWithNoDependencies) {
            stepsWithNoDependencies ??= new Set();
            this.stepsWithNoDependenciesByConstructor.set(ctor, stepsWithNoDependencies);
        }
        stepsWithNoDependencies.add($step);
        this.stepById[stepId] = $step;
        this.aliasesById[stepId] = undefined;
        this.addStepToItsLayerPlan($step);
        return stepId;
    }
    /**
     * @internal
     */
    addLayerPlan(layerPlan) {
        const id = this.layerPlans.push(layerPlan) - 1;
        switch (layerPlan.reason.type) {
            case "root":
            case "subscription":
            case "mutationField":
            case "defer": {
                break;
            }
            case "nullableBoundary":
            case "listItem":
            case "polymorphic": {
                const store = this.layerPlansByParentStep.get(layerPlan.reason.parentStep);
                if (store !== undefined) {
                    store.add(layerPlan);
                }
                else {
                    const layerPlans = new Set();
                    layerPlans.add(layerPlan);
                    this.layerPlansByParentStep.set(layerPlan.reason.parentStep, layerPlans);
                }
                break;
            }
            case "subroutine": {
                const parent = layerPlan.reason.parentStep;
                if (parent[interfaces_js_1.$$subroutine] !== null) {
                    throw new Error(`Steps may currently only have one subroutine. If you have need for a step with multiple subroutines, please get in touch.`);
                }
                parent[interfaces_js_1.$$subroutine] =
                    layerPlan;
                break;
            }
            default: {
                const never = layerPlan.reason;
                throw new Error(`Unexpected layerPlan reason ${never.type}`);
            }
        }
        return id;
    }
    /**
     * @internal
     */
    addOutputPlan(outputPlan) {
        if (dev_js_1.isDev && !this.activeSteps.has(outputPlan.rootStep)) {
            throw new Error(`GrafastInternalError<84485250-c4f3-4175-ab0c-360e073fa69f>: Root step '${outputPlan.rootStep}' is not active; perhaps it was replaced (replacement: ${this.getStepById(outputPlan.rootStep.id)})`);
        }
        this.allOutputPlans.push(outputPlan);
        const store = this.outputPlansByRootStep.get(outputPlan.rootStep);
        if (store !== undefined) {
            store.add(outputPlan);
        }
        else {
            const outputPlans = new Set();
            outputPlans.add(outputPlan);
            this.outputPlansByRootStep.set(outputPlan.rootStep, outputPlans);
        }
    }
    /**
     * HIGHLY EXPERIMENTAL!
     *
     * @internal
     */
    deleteLayerPlan(layerPlan) {
        if (dev_js_1.isDev) {
            if (layerPlan.children.length > 0) {
                throw new Error("This layer plan has children... should we really be deleting it?!");
            }
            this.allOutputPlans.forEach((o) => {
                if (o.layerPlan === layerPlan) {
                    throw new Error("An output plan depends on this layer plan... should we really be deleting it?!");
                }
            });
        }
        this.layerPlans[layerPlan.id] = null;
        // Remove layerPlan from its parent
        if (layerPlan.parentLayerPlan !== null) {
            const idx = layerPlan.parentLayerPlan.children.indexOf(layerPlan);
            if (idx >= 0) {
                layerPlan.parentLayerPlan.children.splice(idx, 1);
            }
        }
        // Remove references
        const $root = layerPlan.rootStep;
        if ($root) {
            this.layerPlansByRootStep.get($root).delete(layerPlan);
        }
        if (layerPlan.reason.type !== "subroutine") {
            const $parent = "parentStep" in layerPlan.reason ? layerPlan.reason.parentStep : null;
            if ($parent) {
                this.layerPlansByParentStep
                    .get($parent)
                    .delete(layerPlan);
            }
        }
        // Remove all plans in this layer
        const handled = new Set();
        const handle = (step) => {
            if (handled.has(step))
                return;
            handled.add(step);
            // Handle dependents first
            for (const dependent of step.dependents) {
                if (dependent.step.layerPlan === layerPlan) {
                    handle(dependent.step);
                }
            }
            this.eradicate(step);
        };
        for (const step of this.activeSteps) {
            if (step.layerPlan === layerPlan) {
                handle(step);
            }
        }
    }
    getStepById(id, allowUnset = false) {
        const step = this.stepById[id];
        if (!step && !allowUnset) {
            throw new Error(`Illegal step access? Step with id ${id} doesn't exist`);
        }
        if (dev_js_1.isDev) {
            if (step && !this.activeSteps.has(step)) {
                throw new Error(`${step} is not active, but we retrieved it from stepTracker.getStepById(${id}, ${allowUnset})`);
            }
        }
        return step;
    }
    addStepDependency(raw$dependent, options) {
        const $dependent = (0, utils_js_1.sudo)(raw$dependent);
        const $dependency = (0, utils_js_1.sudo)(options.step);
        if (!this.activeSteps.has($dependent)) {
            throw new Error(`Cannot add ${$dependency} as a dependency of ${$dependent}; the latter is deleted!`);
        }
        if (!this.activeSteps.has($dependency)) {
            throw new Error(`Cannot add ${$dependency} as a dependency of ${$dependent}; the former is deleted!`);
        }
        if ($dependent.isFinalized) {
            throw new Error("You cannot add a dependency after the step is finalized.");
        }
        if (!($dependency instanceof step_js_1.Step)) {
            throw new Error(`Error occurred when adding dependency for '${$dependent}', value passed was not a step, it was '${(0, inspect_js_1.inspect)($dependency)}'`);
        }
        if (dev_js_1.isDev) {
            // Check that we can actually add this as a dependency
            if (!$dependent.layerPlan.ancestry.includes($dependency.layerPlan)) {
                throw new Error(
                //console.error(
                // This is not a GrafastInternalError
                `Attempted to add '${$dependency}' (${$dependency.layerPlan}) as a dependency of '${$dependent}' (${$dependent.layerPlan}), but we cannot because that LayerPlan isn't an ancestor`);
            }
        }
        const dependentDependencies = (0, utils_js_1.writeableArray)($dependent.dependencies);
        const dependentDependencyForbiddenFlags = (0, utils_js_1.writeableArray)($dependent.dependencyForbiddenFlags);
        const dependentDependencyOnReject = (0, utils_js_1.writeableArray)($dependent.dependencyOnReject);
        const { skipDeduplication, acceptFlags = interfaces_js_1.ALL_FLAGS & ~$dependent.defaultForbiddenFlags, onReject, } = options;
        // When copying dependencies between classes, we might not want to
        // deduplicate because we might refer to the dependency by its index. As
        // such, we should only dedupe by default but allow opting out.
        // TODO: change this to `!skipDeduplication`
        if (skipDeduplication === false) {
            const existingIndex = dependentDependencies.indexOf($dependency);
            if (existingIndex >= 0) {
                return existingIndex;
            }
        }
        if (!$dependency._isUnary && $dependent._isUnary) {
            if ($dependent._isUnaryLocked) {
                throw new Error(`Attempted to add non-unary step ${$dependency} as a dependency of ${$dependent}; but the latter is unary, so it cannot depend on batch steps`);
            }
            $dependent._isUnary = false;
        }
        const forbiddenFlags = interfaces_js_1.ALL_FLAGS & ~(acceptFlags & interfaces_js_1.TRAPPABLE_FLAGS);
        this.stepsWithNoDependenciesByConstructor
            .get($dependent.constructor)
            ?.delete($dependent);
        const dependencyIndex = dependentDependencies.push($dependency) - 1;
        dependentDependencyForbiddenFlags[dependencyIndex] = forbiddenFlags;
        dependentDependencyOnReject[dependencyIndex] = onReject;
        (0, utils_js_1.writeableArray)($dependency.dependents).push({
            step: $dependent,
            dependencyIndex,
        });
        return dependencyIndex;
    }
    addStepUnaryDependency($dependent, options) {
        const $dependency = options.step;
        if (!$dependency._isUnary) {
            const { nonUnaryMessage = defaultNonUnaryMessage } = options;
            throw new Error(nonUnaryMessage($dependent, $dependency));
        }
        $dependency._isUnaryLocked = true;
        return this.addStepDependency($dependent, options);
    }
    setOutputPlanRootStep(outputPlan, $dependency) {
        if (!this.activeSteps.has($dependency)) {
            throw new Error(`Cannot add ${$dependency} to ${outputPlan} because it's deleted`);
        }
        const $existing = outputPlan.rootStep;
        if ($existing) {
            const outputPlansBy$existing = this.outputPlansByRootStep.get($existing);
            if (!outputPlansBy$existing) {
                throw new Error(`GrafastInternalError<f39690fc-f565-40d9-a781-e68a3bf5e84a>: ${outputPlan}.rootStep (${$existing}) isn't in 'outputPlansByRootStep'`);
            }
            outputPlansBy$existing.delete(outputPlan);
            if (outputPlansBy$existing.size === 0) {
                // PERF: Cleanup, tree shake, etc
            }
        }
        outputPlan.rootStep = $dependency;
        const store = this.outputPlansByRootStep.get($dependency);
        if (store !== undefined) {
            store.add(outputPlan);
        }
        else {
            const outputPlans = new Set();
            outputPlans.add(outputPlan);
            this.outputPlansByRootStep.set($dependency, outputPlans);
        }
    }
    setLayerPlanRootStep(layerPlan, $dependency) {
        if (!this.activeSteps.has($dependency)) {
            throw new Error(`Cannot add ${$dependency} to ${layerPlan} because it's deleted`);
        }
        const $existing = layerPlan.rootStep;
        if ($existing) {
            const layerPlansBy$existing = this.layerPlansByRootStep.get($existing);
            if (!layerPlansBy$existing) {
                throw new Error(`GrafastInternalError<7b5b7fe6-d403-48bd-a75f-1c9557b9a030>: ${layerPlan}.rootStep (${$existing}) isn't in 'layerPlansByRootStep'`);
            }
            layerPlansBy$existing.delete(layerPlan);
            if (layerPlansBy$existing.size === 0) {
                this.layerPlansByRootStep.delete($existing);
                // PERF: Cleanup, tree shake, etc
            }
        }
        layerPlan.rootStep = $dependency;
        const store = this.layerPlansByRootStep.get($dependency);
        if (store !== undefined) {
            store.add(layerPlan);
        }
        else {
            const layerPlans = new Set();
            layerPlans.add(layerPlan);
            this.layerPlansByRootStep.set($dependency, layerPlans);
        }
    }
    /** @internal */
    replaceStep($original, $replacement) {
        if (!this.activeSteps.has($original)) {
            // OPTIMIZE: seems like there's unnecessary work being done here.
            // console.trace(`${$original} should be replaced with ${$replacement} but it's no longer alive`);
            // Already handled
            return;
        }
        // Replace all references to $original with $replacement
        const oldAliases = this.aliasesById[$original.id];
        const newAliases = this.aliasesById[$replacement.id] ?? [$replacement.id];
        this.aliasesById[$replacement.id] = newAliases;
        if (oldAliases !== undefined) {
            for (const id of oldAliases) {
                this.stepById[id] = $replacement;
                newAliases.push(id);
            }
            this.aliasesById[$original.id] = undefined;
        }
        else {
            this.stepById[$original.id] = $replacement;
            newAliases.push($original.id);
        }
        {
            // Transfer step dependents of $original to $replacement
            const dependents = $original.dependents;
            if (dependents.length > 0) {
                const replacementDependents = (0, utils_js_1.writeableArray)($replacement.dependents);
                for (const dependent of dependents) {
                    (0, utils_js_1.writeableArray)((0, utils_js_1.sudo)(dependent.step).dependencies)[dependent.dependencyIndex] = $replacement;
                    replacementDependents.push(dependent);
                }
                $original.dependents = [];
            }
        }
        {
            // Convert root step of output plans from $original to $replacement
            const outputPlans = this.outputPlansByRootStep.get($original);
            if (outputPlans?.size) {
                let outputPlansByReplacementStep = this.outputPlansByRootStep.get($replacement);
                if (!outputPlansByReplacementStep) {
                    outputPlansByReplacementStep = new Set();
                    this.outputPlansByRootStep.set($replacement, outputPlansByReplacementStep);
                }
                for (const outputPlan of outputPlans) {
                    outputPlan.rootStep = $replacement;
                    outputPlansByReplacementStep.add(outputPlan);
                }
                outputPlans.clear();
            }
        }
        {
            // Convert root step of layer plans from $original to $replacement
            const layerPlans = this.layerPlansByRootStep.get($original);
            if (layerPlans?.size) {
                let layerPlansByReplacementRootStep = this.layerPlansByRootStep.get($replacement);
                if (!layerPlansByReplacementRootStep) {
                    layerPlansByReplacementRootStep = new Set();
                    this.layerPlansByRootStep.set($replacement, layerPlansByReplacementRootStep);
                }
                for (const layerPlan of layerPlans) {
                    layerPlan.rootStep = $replacement;
                    layerPlansByReplacementRootStep.add(layerPlan);
                }
                layerPlans.clear();
            }
        }
        // NOTE: had to add the code ensuring all the layer plan parentStepId's
        // existed to fix polymorphism, but it feels wrong. Should we be doing
        // something different?
        {
            // Convert parent step of layer plans from $original to $replacement
            const layerPlans = this.layerPlansByParentStep.get($original);
            if (layerPlans?.size) {
                let layerPlansByReplacementParentStep = this.layerPlansByParentStep.get($replacement);
                if (!layerPlansByReplacementParentStep) {
                    layerPlansByReplacementParentStep = new Set();
                    this.layerPlansByParentStep.set($replacement, layerPlansByReplacementParentStep);
                }
                for (const layerPlan of layerPlans) {
                    layerPlan.reason.parentStep = $replacement;
                    layerPlansByReplacementParentStep.add(layerPlan);
                }
                layerPlans.clear();
            }
        }
        // NOTE: I don't think side-effect plans need any special handling, since
        // they cannot be deduplicated.
        // NOTE: there may be more work required here for 'subprocedure' layerPlans
        // (e.g. making sure their steps are retained), but it's not clear what
        // work is necessary and we've not seen any issues from this yet.
        // Remove this step (and perform localized tree-shaking)
        this.eradicate($original);
    }
    treeShakeSteps() {
        for (const $step of this.activeSteps) {
            if (this.isNotNeeded($step)) {
                this.eradicate($step);
            }
        }
    }
    /**
     * Return true if this step can be tree-shaken.
     */
    isNotNeeded($step) {
        if ($step.dependents.length !== 0)
            return false;
        if ($step.hasSideEffects)
            return false;
        if (this.internalDependencies.has($step)) {
            return false;
        }
        const s1 = this.outputPlansByRootStep.get($step);
        if (s1 && s1.size !== 0)
            return false;
        const s2 = this.layerPlansByRootStep.get($step);
        if (s2 && s2.size !== 0)
            return false;
        const s3 = this.layerPlansByParentStep.get($step);
        if (s3 && s3.size !== 0)
            return false;
        return true;
    }
    /**
     * Only for use during planField.
     */
    purgeBackTo(count) {
        const upper = this.stepCount;
        const toRemove = new Set();
        for (let i = count; i < upper; i++) {
            const step = this.stepById[i];
            if (step) {
                toRemove.add(step);
            }
        }
        const remove = (step) => {
            if (this.stepById[step.id] !== step) {
                return;
            }
            if (toRemove.has(step)) {
                for (const dependent of step.dependents) {
                    if (dependent.step.id >= count) {
                        remove(dependent.step);
                    }
                }
                this.eradicate(step);
                toRemove.delete(step);
            }
        };
        for (const step of toRemove) {
            remove(step);
        }
    }
    /**
     * ONLY CALL THIS IF NOTHING DEPENDS ON $original! It's intended to be called
     * from `replaceStep` or from itself.
     *
     * This method removes $original from the various maps/sets/lists, and also
     * removes the fact that it was dependent on other steps. If these other
     * steps no longer have any dependents (steps, layer plans or output plans)
     * then they can also be eradicated _except_ during the 'plan' phase.
     */
    eradicate($original) {
        if ($original[interfaces_js_1.$$subroutine] !== null) {
            this.deleteLayerPlan($original[interfaces_js_1.$$subroutine]);
        }
        this.removeStepFromItsLayerPlan($original);
        const oldAliases = this.aliasesById[$original.id];
        if (oldAliases !== undefined) {
            for (const id of oldAliases) {
                // Nothing needs us, so set ourself null (DELIBERATELY BYPASSES TYPESCRIPT!)
                this.stepById[id] = null;
            }
            this.aliasesById[$original.id] = undefined;
        }
        else if (this.stepById[$original.id] === $original) {
            this.stepById[$original.id] = null;
        }
        // Since this step is being removed, it doesn't need its dependencies any more
        const oldDependencies = (0, utils_js_1.sudo)($original).dependencies;
        for (const $dependency of oldDependencies) {
            // $dependency is no longer a dependent of $original, since we're getting
            // rid of $original
            $dependency.dependents = $dependency.dependents.filter((dependent) => dependent.step !== $original);
            // If we've done our first tree-shake, let's keep it tidy in here.
            if (this.operationPlan.phase !== "plan" &&
                this.isNotNeeded($dependency)) {
                // Nothing depends on $dependency and it has no side effects - we can get rid of it!
                this.eradicate($dependency);
            }
        }
        // Ensure nothing depends on this step - steps, layer plans, output plans.
        // This should already be the case, so we just do it in dev as a
        // consistency check.
        if (dev_js_1.isDev) {
            if ($original.dependents.length > 0) {
                throw new Error(`${$original} eradicated, but it is needed by ${$original.dependents.map((d) => d.step)}`);
            }
            const outputPlansByRoot = this.outputPlansByRootStep.get($original);
            if (outputPlansByRoot && outputPlansByRoot.size !== 0) {
                throw new Error(`${$original} eradicated, but it is needed by ${[
                    ...outputPlansByRoot,
                ]}`);
            }
            const layerPlansByRoot = this.layerPlansByRootStep.get($original);
            if (layerPlansByRoot && layerPlansByRoot.size !== 0) {
                throw new Error(`${$original} eradicated, but it is needed by ${[
                    ...layerPlansByRoot,
                ]}`);
            }
            const layerPlansByParent = this.layerPlansByParentStep.get($original);
            if (layerPlansByParent && layerPlansByParent.size !== 0) {
                throw new Error(`${$original} eradicated, but it is needed by ${[
                    ...layerPlansByParent,
                ]}`);
            }
        }
        this.stepsWithNoDependenciesByConstructor
            .get($original.constructor)
            ?.delete($original);
        this.outputPlansByRootStep.delete($original);
        this.layerPlansByRootStep.delete($original);
        this.layerPlansByParentStep.delete($original);
        this.activeSteps.delete($original);
        // Referencing $original after this will likely cause errors.
        $original.destroy();
    }
    moveStepToLayerPlan(step, targetLayerPlan) {
        this.removeStepFromItsLayerPlan(step);
        step.layerPlan = targetLayerPlan;
        this.addStepToItsLayerPlan(step);
    }
    addStepToItsLayerPlan(step) {
        const { layerPlan: { stepsByConstructor }, constructor, } = step;
        let set = stepsByConstructor.get(constructor);
        if (!set) {
            set = new Set();
            stepsByConstructor.set(constructor, set);
        }
        set.add(step);
    }
    removeStepFromItsLayerPlan(step) {
        step.layerPlan.stepsByConstructor.get(step.constructor).delete(step);
    }
    lockNewSteps() {
        if (!dev_js_1.isDev)
            return;
        for (let i = this.lockedStepCount; i < this.stepCount; i++) {
            const step = this.getStepById(i, true);
            if (step && step.id === i) {
                (0, lock_js_1.lock)(step);
            }
        }
        this.lockedStepCount = this.stepCount;
    }
}
exports.StepTracker = StepTracker;
function defaultNonUnaryMessage($dependent, $dependency) {
    return `${$dependent} attempted to create a unary step dependency on ${$dependency}, but that step is not unary. See https://err.red/gud`;
}
//# sourceMappingURL=StepTracker.js.map