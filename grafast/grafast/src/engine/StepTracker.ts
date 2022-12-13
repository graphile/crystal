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
  private steps = new Set<ExecutableStep>();

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
    this.steps.add($step);
    this.dependenciesByStep.set($step, []);
    this.dependentsByStep.set($step, new Set());
    this.outputPlansByRootStep.set($step, []);
    this.layerPlansByRootStep.set($step, []);
    this.layerPlansByParentStep.set($step, []);
    return stepId;
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

  public setOutputPlanRootStepDependency(
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

  getOutputPlanRootStep(outputPlan: OutputPlan): ExecutableStep | undefined {
    return this.rootStepByOutputPlan.get(outputPlan);
  }

  /** @internal */
  public replaceStep(
    $original: ExecutableStep,
    $replacement: ExecutableStep,
  ): void {
    // Transfer step dependents of $original to $replacement
    const dependents = this.dependentsByStep.get($original)!;
    const replacementDependents = this.dependentsByStep.get($replacement)!;
    for (const { step: $dependent, dependencyIndex } of dependents) {
      this.dependenciesByStep.get($dependent)![dependencyIndex] = $replacement;
      replacementDependents.add({ step: $dependent, dependencyIndex });
    }

    // Transfer output plan dependents of $original to $replacement
    const outputPlans = this.outputPlansByRootStep.get($original)!;
    const outputPlansByReplacementStep =
      this.outputPlansByRootStep.get($replacement)!;
    for (const outputPlan of outputPlans) {
      this.rootStepByOutputPlan.set(outputPlan, $replacement);
      outputPlansByReplacementStep.push(outputPlan);
    }

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
        this.outputPlansByRootStep.get($dependency)?.length === 0
        // TODO: && noLayerPlans
      ) {
        // No-one depends on $dependency and it has no side effects - we can get rid of it!
        this.eradicate($dependency);
      }
    }

    this.outputPlansByRootStep.delete($original);
    this.dependentsByStep.delete($original);
    this.steps.delete($original);
  }
}
