import type { ExecutableStep } from "../..";
import type { LayerPlan } from "../LayerPlan";

let globalData_layerPlan: LayerPlan | undefined = undefined;
let globalData_polymorphicPaths: ReadonlySet<string> | null | undefined =
  undefined;

export function withGlobalLayerPlan<
  T,
  TThis = any,
  TArgs extends [...args: any[]] = [...args: any[]],
>(
  layerPlan: LayerPlan,
  polymorphicPaths: ReadonlySet<string> | null,
  callback: (this: TThis, ...args: TArgs) => T,
  callbackThis?: TThis,
  ...callbackArgs: TArgs
): T {
  const oldLayerPlan = globalData_layerPlan;
  globalData_layerPlan = layerPlan;
  const oldPolymorphicPaths = globalData_polymorphicPaths;
  globalData_polymorphicPaths = polymorphicPaths;
  try {
    return callback.apply(callbackThis as TThis, callbackArgs);
  } finally {
    globalData_layerPlan = oldLayerPlan;
    globalData_polymorphicPaths = oldPolymorphicPaths;
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

export function isUnaryStep($step: ExecutableStep): boolean {
  return $step._isUnary;
}
