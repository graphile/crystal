import { operationPlan } from "../../global.js";
import type {
  ExecutionDetailsStream,
  Maybe,
  StepStreamOptions,
} from "../../interfaces";
import type { Step } from "../../step";
import { constant } from "../../steps/constant";
import { lambda } from "../../steps/lambda.js";
import { object } from "../../steps/object.js";
import type { LayerPlan } from "../LayerPlan";

let globalData_layerPlan: LayerPlan | undefined = undefined;
let globalData_polymorphicPaths: ReadonlySet<string> | null | undefined =
  undefined;
let globalData_planningPath: string | undefined = undefined;
let globalData_stepStreamOptions: StepStreamOptions | true | null | undefined =
  undefined;

export function withGlobalLayerPlan<
  T,
  TThis = any,
  TArgs extends [...args: any[]] = [...args: any[]],
>(
  layerPlan: LayerPlan,
  polymorphicPaths: ReadonlySet<string> | null,
  planningPath: string | null,
  stepStreamOptions: StepStreamOptions | true | null,
  callback: (this: TThis, ...args: TArgs) => T,
  callbackThis?: TThis,
  ...callbackArgs: TArgs
): T {
  const oldLayerPlan = globalData_layerPlan;
  globalData_layerPlan = layerPlan;
  const oldPolymorphicPaths = globalData_polymorphicPaths;
  globalData_polymorphicPaths = polymorphicPaths;
  const oldStepStreamOptions = globalData_stepStreamOptions;
  globalData_stepStreamOptions = stepStreamOptions;
  const oldPlanningPath = globalData_planningPath;
  // Keep the old planning path if we've not been given a new one
  if (planningPath != null) {
    globalData_planningPath = planningPath;
  }
  try {
    return callback.apply(callbackThis as TThis, callbackArgs);
  } finally {
    globalData_layerPlan = oldLayerPlan;
    globalData_polymorphicPaths = oldPolymorphicPaths;
    globalData_stepStreamOptions = oldStepStreamOptions;
    globalData_planningPath = oldPlanningPath;
  }
}

export function currentLayerPlan(): LayerPlan {
  if (globalData_layerPlan === undefined) {
    throw new Error(
      // Must only be called from inside `withGlobalLayerPlan`!
      "Now is not a valid time to call `currentLayerPlan`. This error typically occurs when you attempt to call a Grafast step function from outside of the planning lifecycle - it's important to note that Grafast plans must be resolved synchronously, so check for 'async' or 'setTimeout' or any location where a step function is called outside of a plan resolver. For more information, read about plan resolvers: https://grafast.org/grafast/plan-resolvers",
    );
  }
  return globalData_layerPlan;
}

export function currentPolymorphicPaths(): ReadonlySet<string> | null {
  if (globalData_polymorphicPaths === undefined) {
    throw new Error(
      "GrafastInternalError<b0b05743-8b21-42c6-9b53-925013d88bd1>: currentPolymorphicPaths called out of turn; must only called within a withGlobalLayerPlan callback",
    );
  }
  return globalData_polymorphicPaths;
}

/** UNUSED */
export function currentPlanningPath(): string | undefined {
  const opPlan = operationPlan();
  if (opPlan.phase === "plan" && globalData_planningPath === undefined) {
    // This might happen during deduplicate for example
    console.warn(
      "GrafastInternalWarning<6a484dc3-a690-493c-b8b3-d6196bf2c290>: currentPlanningPath could not retrieve the current path even in 'plan' phase",
    );
  }
  return globalData_planningPath;
}

/**
 * Step - stream details.
 * true - Not a stream, but it is a subscription.
 * null - neither stream nor subscription
 *
 * @experimental
 */
export function currentFieldStreamDetails():
  | Step<ExecutionDetailsStream | null>
  | true
  | null {
  if (globalData_stepStreamOptions == null) {
    return null;
  }
  if (globalData_stepStreamOptions === true) {
    return true;
  }
  const { ifStepId, initialCountStepId } = globalData_stepStreamOptions;
  return operationPlan().withRootLayerPlan(() => {
    const $obj = object({
      if: ifStepId
        ? operationPlan().dangerouslyGetStep(ifStepId)
        : constant(undefined),
      initialCount: initialCountStepId
        ? operationPlan().dangerouslyGetStep(initialCountStepId)
        : constant(undefined),
    });
    return lambda($obj, resolveStreamDetails, true);
  });
}

function resolveStreamDetails(details: {
  if: boolean;
  initialCount: Maybe<number>;
}): ExecutionDetailsStream | null {
  if (details.if === false) return null;
  return {
    initialCount: details.initialCount ?? 0,
  };
}

export function isUnaryStep($step: Step): boolean {
  return $step._isUnary;
}
