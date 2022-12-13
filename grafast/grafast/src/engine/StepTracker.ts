import type { ExecutableStep } from "../step";
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
    Array<{ step: ExecutableStep; dependencyIndex: number }>
  >();

  private rootStepByOutputPlan = new Map<OutputPlan, ExecutableStep>();
  private outputPlansByRootStep = new Map<ExecutableStep, OutputPlan[]>();

  public addStep($step: ExecutableStep): number {
    const stepId = this.stepCount++;
    this.steps.add($step);
    this.dependenciesByStep.set($step, []);
    this.dependentsByStep.set($step, []);
    this.outputPlansByRootStep.set($step, []);
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
      .push({ step: $dependent, dependencyIndex });
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
    this.dependentsByStep.delete($original);
    const replacementDependents = this.dependentsByStep.get($replacement)!;
    for (const { step: $dependent, dependencyIndex } of dependents) {
      this.dependenciesByStep.get($dependent)![dependencyIndex] = $replacement;
      replacementDependents.push({ step: $dependent, dependencyIndex });
    }
    // Since this step has been replaced, it no longer has any dependencies
    this.dependenciesByStep.delete($original);

    // Transfer output plan dependents of $original to $replacement
    const outputPlans = this.outputPlansByRootStep.get($original)!;
    this.outputPlansByRootStep.delete($original);
    const outputPlansByReplacementStep =
      this.outputPlansByRootStep.get($replacement)!;
    for (const outputPlan of outputPlans) {
      this.rootStepByOutputPlan.set(outputPlan, $replacement);
      outputPlansByReplacementStep.push(outputPlan);
    }
  }
}
