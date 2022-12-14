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
function writeableSet<T>(a: ReadonlySet<T>): Set<T> {
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
  public aliasesById: {
    [stepId: number]: Set<number>;
  } = [];

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

  constructor(private readonly operationPlan: OperationPlan) {}

  private assertPhaseNot(phase: OperationPlanPhase) {
    if (this.operationPlan.phase === phase) {
      throw new Error(`Forbidden in '${phase}' phase`);
    }
  }

  public addStep($step: ExecutableStep): number {
    this.assertPhaseNot("finalize");
    const stepId = this.stepCount++;
    this.activeSteps.add($step);
    this.stepById[stepId] = $step;
    this.aliasesById[stepId] = new Set([stepId]);
    this.outputPlansByRootStep.set($step, new Set());
    this.layerPlansByRootStep.set($step, new Set());
    this.layerPlansByParentStep.set($step, new Set());
    return stepId;
  }

  /**
   * @internal
   */
  public addLayerPlan(layerPlan: LayerPlan) {
    this.assertPhaseNot("finalize");
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
        this.layerPlansByParentStep
          .get(layerPlan.reason.parentStep)!
          .add(layerPlan as LayerPlan<LayerPlanReasonsWithParentStep>);
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
    this.assertPhaseNot("finalize");
    this.allOutputPlans.push(outputPlan);
    this.outputPlansByRootStep.get(outputPlan.rootStep)!.add(outputPlan);
  }

  /**
   * HIGHLY EXPERIMENTAL!
   *
   * @internal
   */
  public deleteLayerPlan(layerPlan: LayerPlan) {
    this.assertPhaseNot("finalize");
    if (isDev) {
      // TODO: validate assertions
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
    this.assertPhaseNot("finalize");
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
    const dependencyIndex =
      writeableArray($dependent.dependencies).push($dependency) - 1;
    writeableSet($dependency.dependents).add({
      step: $dependent,
      dependencyIndex,
    });
    return dependencyIndex;
  }

  public setOutputPlanRootStep(
    outputPlan: OutputPlan,
    $dependency: ExecutableStep,
  ) {
    this.assertPhaseNot("finalize");
    if (!this.activeSteps.has($dependency)) {
      throw new Error(
        `Cannot add ${$dependency} to ${outputPlan} because it's deleted`,
      );
    }
    const $existing = outputPlan.rootStep;
    if ($existing) {
      // TODO: Cleanup, tree shake, etc
      this.outputPlansByRootStep.get($existing)!.delete(outputPlan);
    }
    (outputPlan.rootStep as any) = $dependency;
    this.outputPlansByRootStep.get($dependency)!.add(outputPlan);
  }

  public setLayerPlanRootStep(
    layerPlan: LayerPlan,
    $dependency: ExecutableStep,
  ) {
    this.assertPhaseNot("finalize");
    if (!this.activeSteps.has($dependency)) {
      throw new Error(
        `Cannot add ${$dependency} to ${layerPlan} because it's deleted`,
      );
    }
    const $existing = layerPlan.rootStep;
    if ($existing) {
      // TODO: Cleanup, tree shake, etc
      this.layerPlansByRootStep.get($existing)!.delete(layerPlan);
    }
    (layerPlan.rootStep as any) = $dependency;
    this.layerPlansByRootStep.get($dependency)!.add(layerPlan);
  }

  /** @internal */
  public replaceStep(
    $original: ExecutableStep,
    $replacement: ExecutableStep,
  ): void {
    this.assertPhaseNot("finalize");
    if (!this.activeSteps.has($original)) {
      // TODO: should this be an error?
      // console.warn(`${$original} should be replaced with ${$replacement} but it's no longer alive`);
      // Already handled
      return;
    }

    // Replace all references to $original with $replacement
    for (const id of this.aliasesById[$original.id]) {
      this.stepById[id] = $replacement;
      this.aliasesById[$replacement.id].add(id);
    }
    this.aliasesById[$original.id].clear();

    {
      // Transfer step dependents of $original to $replacement
      const dependents = $original.dependents;
      const replacementDependents = writeableSet($replacement.dependents);
      for (const { step: $dependent, dependencyIndex } of dependents) {
        writeableArray($dependent.dependencies)[dependencyIndex] = $replacement;
        replacementDependents.add({ step: $dependent, dependencyIndex });
      }
      writeableSet($original.dependents).clear();
    }

    {
      // Convert root step of output plans from $original to $replacement
      const outputPlans = this.outputPlansByRootStep.get($original)!;
      if (!outputPlans) {
        throw new Error(`No outputPlans for ${$original}?!`);
      }
      const outputPlansByReplacementStep =
        this.outputPlansByRootStep.get($replacement)!;
      for (const outputPlan of outputPlans) {
        (outputPlan.rootStep as any) = $replacement;
        outputPlansByReplacementStep.add(outputPlan);
      }
      this.outputPlansByRootStep.get($original)!.clear();
    }

    {
      // Convert root step of layer plans from $original to $replacement
      const layerPlans = this.layerPlansByRootStep.get($original)!;
      const layerPlansByReplacementRootStep =
        this.layerPlansByRootStep.get($replacement)!;
      for (const layerPlan of layerPlans) {
        (layerPlan.rootStep as any) = $replacement;
        layerPlansByReplacementRootStep.add(layerPlan);
      }
      this.layerPlansByRootStep.get($original)!.clear();
    }

    // TODO: had to add the code ensuring all the layer plan parentPlanId's
    // existed to fix polymorphism, but it feels wrong. Should we be doing
    // something different?
    {
      // Convert parent step of layer plans from $original to $replacement
      const layerPlans = this.layerPlansByParentStep.get($original)!;
      const layerPlansByReplacementParentStep =
        this.layerPlansByParentStep.get($replacement)!;
      for (const layerPlan of layerPlans) {
        (layerPlan.reason.parentStep as any) = $replacement;
        layerPlansByReplacementParentStep.add(layerPlan);
      }
      this.layerPlansByParentStep.get($original)!.clear();
    }

    // TODO: ensure side-effect plans are handled nicely
    // TODO: ensure plans in 'subprocedure' layerPlans are marked active

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
    return (
      $step.dependents.size === 0 &&
      !$step.hasSideEffects &&
      this.outputPlansByRootStep.get($step)!.size === 0 &&
      this.layerPlansByRootStep.get($step)!.size === 0 &&
      this.layerPlansByParentStep.get($step)!.size === 0
    );
  }

  /**
   * ONLY CALL THIS IF NOTHING DEPENDS ON $original! It's intended to be called
   * from `replaceStep` or from itself.
   *
   * This method removes $original from the various maps/sets/lists, and also
   * removes the fact that it was dependent on other steps. If these other
   * steps no longer have any dependents (steps, layer plans or output plans)
   * then they can also be eradicated.
   */
  private eradicate($original: ExecutableStep) {
    // TODO: first eradicate everything that depends on this step - steps,
    // layer plans, output plans. (NOTE: if this call has come from replaceStep
    // then there shouldn't be any dependents).

    for (const id of this.aliasesById[$original.id]) {
      // Nothing needs us, so set ourself null (DELIBERATELY BYPASSES TYPESCRIPT!)
      this.stepById[id] = null as any;
    }
    this.aliasesById[$original.id] = null as any;

    // Since this step is being removed, it doesn't need its dependencies any more
    const oldDependencies = $original.dependencies;
    for (const $dependency of oldDependencies) {
      // $dependency is no longer a dependent of $original, since we're getting
      // rid of $original
      const dependents = writeableSet($dependency.dependents);
      for (const dependent of dependents) {
        if (dependent.step === $original) {
          dependents.delete(dependent);
        }
      }

      // If we've done our first tree-shake, let's keep it tidy in here.
      if (
        this.operationPlan.phase !== "plan" &&
        this.isNotNeeded($dependency)
      ) {
        // Nothing depends on $dependency and it has no side effects - we can get rid of it!
        this.eradicate($dependency);
      }
    }

    if (isDev) {
      const outputPlansByRoot = this.outputPlansByRootStep.get($original)!;
      if (outputPlansByRoot.size !== 0) {
        throw new Error(
          `${$original} eradicated, but it is needed by ${[
            ...outputPlansByRoot,
          ]}`,
        );
      }
      const layerPlansByRoot = this.layerPlansByRootStep.get($original)!;
      if (layerPlansByRoot.size !== 0) {
        throw new Error(
          `${$original} eradicated, but it is needed by ${[
            ...layerPlansByRoot,
          ]}`,
        );
      }
      const layerPlansByParent = this.layerPlansByParentStep.get($original)!;
      if (layerPlansByParent.size !== 0) {
        throw new Error(
          `${$original} eradicated, but it is needed by ${[
            ...layerPlansByParent,
          ]}`,
        );
      }
    }

    this.outputPlansByRootStep.delete($original);
    this.layerPlansByRootStep.delete($original);
    this.layerPlansByParentStep.delete($original);
    this.activeSteps.delete($original);
    $original.destroy();
  }
}
