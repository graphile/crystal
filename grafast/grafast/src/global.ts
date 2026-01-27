import { currentLayerPlan } from "./engine/lib/withGlobalLayerPlan.ts";
import type { OperationPlan } from "./engine/OperationPlan.ts";
import type { __TrackedValueStep, __ValueStep } from "./steps/index.ts";

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

export function context(): __ValueStep<Grafast.Context> {
  return operationPlan().contextStep as __ValueStep<any>;
}

export function rootValue(): __ValueStep<Record<string, any>> {
  return operationPlan().rootValueStep as __ValueStep<any>;
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
