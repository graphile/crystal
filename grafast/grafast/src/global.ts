import { currentLayerPlan } from "./engine/lib/withGlobalLayerPlan.js";
import type { OperationPlan } from "./engine/OperationPlan.js";
import type { __TrackedValueStep, __ValueStep } from "./steps/index.js";

let debug = false;
export function setDebug(newDebug: boolean): void {
  debug = newDebug;
}
export function getDebug(): boolean {
  return debug;
}

export function operationPlan(): OperationPlan {
  return currentLayerPlan().operationPlan;
}

export function context<
  TContext extends Grafast.Context = Grafast.Context,
>(): __ValueStep<TContext> {
  return operationPlan().contextStep as __ValueStep<any>;
}

export function rootValue(): __ValueStep<Record<string, any>> {
  return operationPlan().rootValueStep as __ValueStep<any>;
}

export function trackedContext<
  TContext extends Grafast.Context = Grafast.Context,
>(): __TrackedValueStep<TContext> {
  return operationPlan().trackedContextStep as __TrackedValueStep<any>;
}

export function trackedRootValue(): __TrackedValueStep<Record<string, any>> {
  return operationPlan().trackedRootValueStep as __TrackedValueStep<any>;
}

/**
 * Turns on debug mode, calls the callback, and then turns debug mode back off
 * again.
 */
export function debugPlans<T>(callback: () => T): T {
  const oldDebug = getDebug();
  setDebug(true);
  const result = callback();
  setDebug(oldDebug);
  return result;
}
