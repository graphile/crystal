import { isDev } from "../dev.js";
import type { OperationPlan } from "../index.js";
import type { ExecutableStep } from "../step";
import type { LayerPlan, LayerPlanReasonsWithParentStep } from "./LayerPlan";
import type { OperationPlanPhase } from "./OperationPlan.js";
import type { OutputPlan } from "./OutputPlan";

/**
 * We want everything else to treat things like `dependencies` as read only,
 * however we ourselves want to be able to write to them, so we can use
 * writeable for this.
 *
 * @internal
 */
function writeableArray<T>(a: ReadonlyArray<T>): Array<T> {
  return a as any;
}

/**
 * This class keeps track of all of our steps, and the dependencies between
 * steps and other steps, layer plans and steps, and output plans and steps.
 *
 * When a step is replaced by another step, all the dependencies are updated
 * such that the replaced step simply evaporates.
 *
 * @internal
 */
export class StepTracker {
  /** @internal */
  public stepCount = 0;
  /** @internal */
  public activeSteps = new Set<ExecutableStep>();
  /** @internal */
  public stepById: {
    [stepId: number]: ExecutableStep;
  } = [];
  /** @internal */
  private aliasesById: {
    [stepId: number]: Set<number> | undefined;
  } = [];
  /** @internal */
  public stepsWithNoDependencies = new Set<ExecutableStep>();

  /** @internal */
  public outputPlansByRootStep = new Map<ExecutableStep, Set<OutputPlan>>();
  /** @internal */
  public layerPlansByRootStep = new Map<ExecutableStep, Set<LayerPlan>>();
  /** @internal */
  public layerPlansByParentStep = new Map<
    ExecutableStep,
    Set<LayerPlan<LayerPlanReasonsWithParentStep>>
  >();

  /** @internal */
  public layerPlans: Array<LayerPlan | null> = [];
  /**
   * All the OutputPlans that were created to allow a more efficient
   * walkOutputPlans implementation.
   *
   * @internal
   */
  public allOutputPlans: OutputPlan[] = [];

  public nextStepIdToDeduplicate = 0;

  constructor(private readonly operationPlan: OperationPlan) {}

  /** Called when OperationPlan enters finalize phase. */
  public finalize() {
    const forbidden = () => {
      throw new Error(`Forbidden after 'finalize' phase`);
    };
    this.addStep = forbidden;
    this.addLayerPlan = forbidden;
    this.addOutputPlan = forbidden;
    this.deleteLayerPlan = forbidden;
    this.addStepDependency = forbidden;
    this.setOutputPlanRootStep = forbidden;
    this.setLayerPlanRootStep = forbidden;
    this.replaceStep = forbidden;
  }

  public addStep($step: ExecutableStep): number {
    const stepId = this.stepCount++;
    this.activeSteps.add($step);
    this.stepsWithNoDependencies.add($step);
    this.stepById[stepId] = $step;
    this.aliasesById[stepId] = undefined;
    this.addStepToItsLayerPlan($step);
    return stepId;
  }

  /**
   * @internal
   */
  public addLayerPlan(layerPlan: LayerPlan) {
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
      case "polymorphic":
      case "subroutine": {
        const store = this.layerPlansByParentStep.get(
          layerPlan.reason.parentStep,
        )!;
        if (store) {
          store.add(layerPlan as LayerPlan<LayerPlanReasonsWithParentStep>);
        } else {
          this.layerPlansByParentStep.set(
            layerPlan.reason.parentStep,
            new Set([layerPlan as LayerPlan<LayerPlanReasonsWithParentStep>]),
          );
        }
        break;
      }
      default: {
        const never: never = layerPlan.reason;
        throw new Error(`Unexpected layerPlan reason ${(never as any).type}`);
      }
    }
    return id;
  }

  /**
   * @internal
   */
  public addOutputPlan(outputPlan: OutputPlan): void {
    this.allOutputPlans.push(outputPlan);
    const store = this.outputPlansByRootStep.get(outputPlan.rootStep);
    if (store) {
      store.add(outputPlan);
    } else {
      this.outputPlansByRootStep.set(
        outputPlan.rootStep,
        new Set([outputPlan]),
      );
    }
  }

  /**
   * HIGHLY EXPERIMENTAL!
   *
   * @internal
   */
  public deleteLayerPlan(layerPlan: LayerPlan) {
    if (isDev) {
      if (layerPlan.children.length > 0) {
        throw new Error(
          "This layer plan has children... should we really be deleting it?!",
        );
      }
      this.allOutputPlans.forEach((o) => {
        if (o.layerPlan === layerPlan) {
          throw new Error(
            "An output plan depends on this layer plan... should we really be deleting it?!",
          );
        }
      });
    }
    this.layerPlans[layerPlan.id] = null;
    // Remove layerPlan from its parent
    if (layerPlan.parentLayerPlan) {
      const idx = layerPlan.parentLayerPlan.children.indexOf(layerPlan);
      if (idx >= 0) {
        layerPlan.parentLayerPlan.children.splice(idx, 1);
      }
    }
    // Remove references
    const $root = layerPlan.rootStep;
    if ($root) {
      this.layerPlansByRootStep.get($root)!.delete(layerPlan);
    }
    const $parent =
      "parentStep" in layerPlan.reason ? layerPlan.reason.parentStep : null;
    if ($parent) {
      this.layerPlansByParentStep
        .get($parent)!
        .delete(layerPlan as LayerPlan<LayerPlanReasonsWithParentStep>);
    }
    // Remove all plans in this layer
    for (const step of this.activeSteps) {
      if (step.layerPlan === layerPlan) {
        this.eradicate(step);
      }
    }
  }

  public getStepById(id: number): ExecutableStep;
  public getStepById(id: number, allowUnset: true): ExecutableStep | null;
  public getStepById(id: number, allowUnset = false): ExecutableStep | null {
    const step = this.stepById[id];
    if (!step && !allowUnset) {
      throw new Error(`Illegal step access? Step with id ${id} doesn't exist`);
    }
    if (isDev) {
      if (step && !this.activeSteps.has(step)) {
        throw new Error(
          `${step} is not active, but we retrieved it from stepTracker.getStepById(${id}, ${allowUnset})`,
        );
      }
    }
    return step;
  }

  public addStepDependency(
    $dependent: ExecutableStep,
    $dependency: ExecutableStep,
  ): number {
    if (!this.activeSteps.has($dependent)) {
      throw new Error(
        `Cannot add ${$dependency} as a dependency of ${$dependent}; the latter is deleted!`,
      );
    }
    if (!this.activeSteps.has($dependency)) {
      throw new Error(
        `Cannot add ${$dependency} as a dependency of ${$dependent}; the former is deleted!`,
      );
    }
    this.stepsWithNoDependencies.delete($dependent);
    const dependencyIndex =
      writeableArray($dependent.dependencies).push($dependency) - 1;
    writeableArray($dependency.dependents).push({
      step: $dependent,
      dependencyIndex,
    });
    return dependencyIndex;
  }

  public setOutputPlanRootStep(
    outputPlan: OutputPlan,
    $dependency: ExecutableStep,
  ) {
    if (!this.activeSteps.has($dependency)) {
      throw new Error(
        `Cannot add ${$dependency} to ${outputPlan} because it's deleted`,
      );
    }
    const $existing = outputPlan.rootStep;
    if ($existing) {
      const outputPlansBy$existing = this.outputPlansByRootStep.get($existing);
      if (!outputPlansBy$existing) {
        throw new Error(
          `GrafastInternalError<f39690fc-f565-40d9-a781-e68a3bf5e84a>: ${outputPlan}.rootStep (${$existing}) isn't in 'outputPlansByRootStep'`,
        );
      }
      outputPlansBy$existing.delete(outputPlan);
      if (outputPlansBy$existing.size === 0) {
        // TODO: Cleanup, tree shake, etc
      }
    }
    (outputPlan.rootStep as any) = $dependency;
    const store = this.outputPlansByRootStep.get($dependency);
    if (store) {
      store.add(outputPlan);
    } else {
      this.outputPlansByRootStep.set($dependency, new Set([outputPlan]));
    }
  }

  public setLayerPlanRootStep(
    layerPlan: LayerPlan,
    $dependency: ExecutableStep,
  ) {
    if (!this.activeSteps.has($dependency)) {
      throw new Error(
        `Cannot add ${$dependency} to ${layerPlan} because it's deleted`,
      );
    }
    const $existing = layerPlan.rootStep;
    if ($existing) {
      const layerPlansBy$existing = this.layerPlansByRootStep.get($existing);
      if (!layerPlansBy$existing) {
        throw new Error(
          `GrafastInternalError<7b5b7fe6-d403-48bd-a75f-1c9557b9a030>: ${layerPlan}.rootStep (${$existing}) isn't in 'layerPlansByRootStep'`,
        );
      }
      layerPlansBy$existing.delete(layerPlan);
      if (layerPlansBy$existing.size === 0) {
        // TODO: Cleanup, tree shake, etc
      }
    }
    (layerPlan.rootStep as any) = $dependency;
    const store = this.layerPlansByRootStep.get($dependency);
    if (store) {
      store.add(layerPlan);
    } else {
      this.layerPlansByRootStep.set($dependency, new Set([layerPlan]));
    }
  }

  /** @internal */
  public replaceStep(
    $original: ExecutableStep,
    $replacement: ExecutableStep,
  ): void {
    if (!this.activeSteps.has($original)) {
      // OPTIMIZE: seems like there's unnecessary work being done here.
      // console.trace(`${$original} should be replaced with ${$replacement} but it's no longer alive`);

      // Already handled
      return;
    }

    // Replace all references to $original with $replacement
    const oldAliases = this.aliasesById[$original.id];
    const newAliases =
      this.aliasesById[$replacement.id] ?? new Set([$replacement.id]);
    this.aliasesById[$replacement.id] = newAliases;
    if (oldAliases) {
      for (const id of oldAliases) {
        this.stepById[id] = $replacement;
        newAliases.add(id);
      }
      this.aliasesById[$original.id] = undefined;
    } else {
      this.stepById[$original.id] = $replacement;
      newAliases.add($original.id);
    }

    {
      // Transfer step dependents of $original to $replacement
      const dependents = $original.dependents;
      const replacementDependents = writeableArray($replacement.dependents);
      for (const dependent of dependents) {
        writeableArray(dependent.step.dependencies)[dependent.dependencyIndex] =
          $replacement;
        replacementDependents.push(dependent);
      }
      ($original.dependents as any) = [];
    }

    {
      // Convert root step of output plans from $original to $replacement
      const outputPlans = this.outputPlansByRootStep.get($original);
      if (outputPlans) {
        let outputPlansByReplacementStep =
          this.outputPlansByRootStep.get($replacement);
        if (!outputPlansByReplacementStep) {
          outputPlansByReplacementStep = new Set();
          this.outputPlansByRootStep.set(
            $replacement,
            outputPlansByReplacementStep,
          );
        }
        for (const outputPlan of outputPlans) {
          (outputPlan.rootStep as any) = $replacement;
          outputPlansByReplacementStep.add(outputPlan);
        }
        outputPlans.clear();
      }
    }

    {
      // Convert root step of layer plans from $original to $replacement
      const layerPlans = this.layerPlansByRootStep.get($original)!;
      if (layerPlans) {
        let layerPlansByReplacementRootStep =
          this.layerPlansByRootStep.get($replacement);
        if (!layerPlansByReplacementRootStep) {
          layerPlansByReplacementRootStep = new Set();
          this.layerPlansByRootStep.set(
            $replacement,
            layerPlansByReplacementRootStep,
          );
        }
        for (const layerPlan of layerPlans) {
          (layerPlan.rootStep as any) = $replacement;
          layerPlansByReplacementRootStep.add(layerPlan);
        }
        layerPlans.clear();
      }
    }

    // HACK: had to add the code ensuring all the layer plan parentStepId's
    // existed to fix polymorphism, but it feels wrong. Should we be doing
    // something different?
    {
      // Convert parent step of layer plans from $original to $replacement
      const layerPlans = this.layerPlansByParentStep.get($original);
      if (layerPlans) {
        let layerPlansByReplacementParentStep =
          this.layerPlansByParentStep.get($replacement);
        if (!layerPlansByReplacementParentStep) {
          layerPlansByReplacementParentStep = new Set();
          this.layerPlansByParentStep.set(
            $replacement,
            layerPlansByReplacementParentStep,
          );
        }
        for (const layerPlan of layerPlans) {
          (layerPlan.reason.parentStep as any) = $replacement;
          layerPlansByReplacementParentStep.add(layerPlan);
        }
        layerPlans.clear();
      }
    }

    // FIXME: ensure side-effect plans are handled nicely
    // FIXME: ensure plans in 'subprocedure' layerPlans are marked active

    // Remove this step (and perform localized tree-shaking)
    this.eradicate($original);
  }

  public treeShakeSteps() {
    for (const $step of this.activeSteps) {
      if (this.isNotNeeded($step)) {
        this.eradicate($step);
      }
    }
  }

  /**
   * Return true if this step can be tree-shaken.
   */
  private isNotNeeded($step: ExecutableStep): boolean {
    if ($step.dependents.length !== 0) return false;
    if ($step.hasSideEffects) return false;
    const s1 = this.outputPlansByRootStep.get($step);
    if (s1 && s1.size !== 0) return false;
    const s2 = this.layerPlansByRootStep.get($step);
    if (s2 && s2.size !== 0) return false;
    const s3 = this.layerPlansByParentStep.get($step);
    if (s3 && s3.size !== 0) return false;
    return true;
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
  private eradicate($original: ExecutableStep) {
    this.removeStepFromItsLayerPlan($original);
    const oldAliases = this.aliasesById[$original.id];
    if (oldAliases) {
      for (const id of oldAliases) {
        // Nothing needs us, so set ourself null (DELIBERATELY BYPASSES TYPESCRIPT!)
        this.stepById[id] = null as any;
      }
      this.aliasesById[$original.id] = undefined;
    } else if (this.stepById[$original.id] === $original) {
      this.stepById[$original.id] = null as any;
    }

    // Since this step is being removed, it doesn't need its dependencies any more
    const oldDependencies = $original.dependencies;
    for (const $dependency of oldDependencies) {
      // $dependency is no longer a dependent of $original, since we're getting
      // rid of $original
      ($dependency.dependents as any) = $dependency.dependents.filter(
        (dependent) => dependent.step !== $original,
      );

      // If we've done our first tree-shake, let's keep it tidy in here.
      if (
        this.operationPlan.phase !== "plan" &&
        this.isNotNeeded($dependency)
      ) {
        // Nothing depends on $dependency and it has no side effects - we can get rid of it!
        this.eradicate($dependency);
      }
    }

    // Ensure nothing depends on this step - steps, layer plans, output plans.
    // This should already be the case, so we just do it in dev as a
    // consistency check.
    if (isDev) {
      if ($original.dependents.length > 0) {
        throw new Error(
          `${$original} eradicated, but it is needed by ${$original.dependents.map(
            (d) => d.step,
          )}`,
        );
      }
      const outputPlansByRoot = this.outputPlansByRootStep.get($original);
      if (outputPlansByRoot && outputPlansByRoot.size !== 0) {
        throw new Error(
          `${$original} eradicated, but it is needed by ${[
            ...outputPlansByRoot,
          ]}`,
        );
      }
      const layerPlansByRoot = this.layerPlansByRootStep.get($original);
      if (layerPlansByRoot && layerPlansByRoot.size !== 0) {
        throw new Error(
          `${$original} eradicated, but it is needed by ${[
            ...layerPlansByRoot,
          ]}`,
        );
      }
      const layerPlansByParent = this.layerPlansByParentStep.get($original);
      if (layerPlansByParent && layerPlansByParent.size !== 0) {
        throw new Error(
          `${$original} eradicated, but it is needed by ${[
            ...layerPlansByParent,
          ]}`,
        );
      }
    }

    this.stepsWithNoDependencies.delete($original);
    this.outputPlansByRootStep.delete($original);
    this.layerPlansByRootStep.delete($original);
    this.layerPlansByParentStep.delete($original);
    this.activeSteps.delete($original);

    // Referencing $original after this will likely cause errors.
    $original.destroy();
  }

  moveStepToLayerPlan(step: ExecutableStep, targetLayerPlan: LayerPlan) {
    this.removeStepFromItsLayerPlan(step);
    (step.layerPlan as any) = targetLayerPlan;
    this.addStepToItsLayerPlan(step);
  }

  addStepToItsLayerPlan(step: ExecutableStep) {
    const {
      layerPlan: { stepsByConstructor },
      constructor,
    } = step;
    let set = stepsByConstructor.get(constructor);
    if (!set) {
      set = new Set();
      stepsByConstructor.set(constructor, set);
    }
    set.add(step);
  }

  removeStepFromItsLayerPlan(step: ExecutableStep) {
    step.layerPlan.stepsByConstructor.get(step.constructor)!.delete(step);
  }
}
