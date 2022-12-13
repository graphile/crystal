import type { ExecutableStep } from "../step";
import type { LayerPlan } from "./LayerPlan";
import type { OutputPlan } from "./OutputPlan";

/**
 * This class keeps track of all of our steps, and the dependencies between
 * steps and other steps, layer plans and steps, and output plans and steps.
 *
 * When a step is replaced by another step, all the dependencies are updated
 * such that the replaced step simply evaporates.
 */
export class StepTracker {
  private stepCount = 0;
  private activeSteps = new Set<ExecutableStep>();
  private stepById: {
    [stepId: number]: ExecutableStep;
  } = [];

  private dependenciesByStep = new Map<ExecutableStep, ExecutableStep[]>();
  private dependentsByStep = new Map<
    ExecutableStep,
    Set<{ step: ExecutableStep; dependencyIndex: number }>
  >();

  private rootStepByOutputPlan = new Map<OutputPlan, ExecutableStep>();
  private outputPlansByRootStep = new Map<ExecutableStep, OutputPlan[]>();

  private rootStepByLayerPlan = new Map<LayerPlan, ExecutableStep>();
  private layerPlansByRootStep = new Map<ExecutableStep, LayerPlan[]>();

  private parentStepByLayerPlan = new Map<LayerPlan, ExecutableStep>();
  private layerPlansByParentStep = new Map<ExecutableStep, LayerPlan[]>();

  public addStep($step: ExecutableStep): number {
    const stepId = this.stepCount++;
    this.activeSteps.add($step);
    this.stepById[stepId] = $step;
    this.dependenciesByStep.set($step, []);
    this.dependentsByStep.set($step, new Set());
    this.outputPlansByRootStep.set($step, []);
    this.layerPlansByRootStep.set($step, []);
    this.layerPlansByParentStep.set($step, []);
    return stepId;
  }

  public getStepById(id: number): ExecutableStep {
    const step = this.stepById[id];
    if (!step) {
      throw new Error(`Illegal step access? Step with id ${id} doesn't exist`);
    }
    return step;
  }

  public addStepDependency(
    $dependent: ExecutableStep,
    $dependency: ExecutableStep,
  ): number {
    const dependencyIndex =
      this.dependenciesByStep.get($dependent)!.push($dependency) - 1;
    this.dependentsByStep
      .get($dependency)!
      .add({ step: $dependent, dependencyIndex });
    return dependencyIndex;
  }

  public getStepDependenies(
    $step: ExecutableStep,
  ): ReadonlyArray<ExecutableStep> {
    return this.dependenciesByStep.get($step)!;
  }

  public setOutputPlanRootStep(
    outputPlan: OutputPlan,
    $dependency: ExecutableStep,
  ) {
    const $existing = this.rootStepByOutputPlan.get(outputPlan);
    if ($existing) {
      throw new Error(`Root step replacement not yet supported`);
    }
    this.rootStepByOutputPlan.set(outputPlan, $dependency);
    this.outputPlansByRootStep.get($dependency)!.push(outputPlan);
  }

  public getOutputPlanRootStep(
    outputPlan: OutputPlan,
  ): ExecutableStep | undefined {
    return this.rootStepByOutputPlan.get(outputPlan);
  }

  public setLayerPlanRootStep(
    layerPlan: LayerPlan,
    $dependency: ExecutableStep,
  ) {
    const $existing = this.rootStepByLayerPlan.get(layerPlan);
    if ($existing) {
      throw new Error(`Root step replacement not yet supported`);
    }
    this.rootStepByLayerPlan.set(layerPlan, $dependency);
    this.layerPlansByRootStep.get($dependency)!.push(layerPlan);
  }

  public getLayerPlanRootStep(
    layerPlan: LayerPlan,
  ): ExecutableStep | undefined {
    return this.rootStepByLayerPlan.get(layerPlan);
  }

  public setLayerPlanParentStep(
    layerPlan: LayerPlan,
    $dependency: ExecutableStep,
  ) {
    const $existing = this.parentStepByLayerPlan.get(layerPlan);
    if ($existing) {
      throw new Error(`Parent step replacement not yet supported`);
    }
    this.parentStepByLayerPlan.set(layerPlan, $dependency);
    this.layerPlansByParentStep.get($dependency)!.push(layerPlan);
  }

  public getLayerPlanParentStep(
    layerPlan: LayerPlan,
  ): ExecutableStep | undefined {
    return this.parentStepByLayerPlan.get(layerPlan);
  }

  /** @internal */
  public replaceStep(
    $original: ExecutableStep,
    $replacement: ExecutableStep,
  ): void {
    this.stepById[$original.id] = $replacement;

    {
      // Transfer step dependents of $original to $replacement
      const dependents = this.dependentsByStep.get($original)!;
      const replacementDependents = this.dependentsByStep.get($replacement)!;
      for (const { step: $dependent, dependencyIndex } of dependents) {
        this.dependenciesByStep.get($dependent)![dependencyIndex] =
          $replacement;
        replacementDependents.add({ step: $dependent, dependencyIndex });
      }
    }

    {
      // Convert root step of output plans from $original to $replacement
      const outputPlans = this.outputPlansByRootStep.get($original)!;
      const outputPlansByReplacementStep =
        this.outputPlansByRootStep.get($replacement)!;
      for (const outputPlan of outputPlans) {
        this.rootStepByOutputPlan.set(outputPlan, $replacement);
        outputPlansByReplacementStep.push(outputPlan);
      }
    }

    {
      // Convert root step of layer plans from $original to $replacement
      const layerPlans = this.layerPlansByRootStep.get($original)!;
      const layerPlansByReplacementRootStep =
        this.layerPlansByRootStep.get($replacement)!;
      for (const layerPlan of layerPlans) {
        this.rootStepByLayerPlan.set(layerPlan, $replacement);
        layerPlansByReplacementRootStep.push(layerPlan);
      }
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
        this.parentStepByLayerPlan.set(layerPlan, $replacement);
        layerPlansByReplacementParentStep.push(layerPlan);
      }
    }

    // TODO: ensure side-effect plans are handled nicely
    // TODO: ensure plans in 'subprocedure' layerPlans are marked active

    // Remove this step (and perform localized tree-shaking)
    this.eradicate($original);
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
    // Since this step is being removed, it doesn't need its dependencies any more
    const oldDependencies = this.dependenciesByStep.get($original)!;
    this.dependenciesByStep.delete($original);
    for (const $dependency of oldDependencies) {
      // $dependency is no longer a dependent of $original, since we're getting
      // rid of $original
      const dependents = this.dependentsByStep.get($dependency)!;
      for (const dependent of dependents) {
        if (dependent.step === $original) {
          dependents.delete(dependent);
        }
      }
      if (
        dependents.size === 0 &&
        !$dependency.hasSideEffects &&
        this.outputPlansByRootStep.get($dependency)!.length === 0 &&
        this.layerPlansByRootStep.get($dependency)!.length === 0 &&
        this.layerPlansByParentStep.get($dependency)!.length === 0
      ) {
        // Nothing depends on $dependency and it has no side effects - we can get rid of it!
        this.eradicate($dependency);
      }
    }

    this.outputPlansByRootStep.delete($original);
    this.layerPlansByRootStep.delete($original);
    this.layerPlansByParentStep.delete($original);
    this.dependentsByStep.delete($original);
    this.activeSteps.delete($original);
    $original.destroy();
  }
}
