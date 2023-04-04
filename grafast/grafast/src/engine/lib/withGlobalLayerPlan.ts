import type { LayerPlan } from "../LayerPlan";

let globalData: {
  layerPlan: LayerPlan;
  polymorphicPaths: ReadonlySet<string>;
} | null = null;

export function withGlobalLayerPlan<T>(
  layerPlan: LayerPlan,
  polymorphicPaths: ReadonlySet<string>,
  callback: () => T,
): T {
  const oldGlobalData = globalData;
  globalData = {
    layerPlan,
    polymorphicPaths,
  };
  try {
    return callback();
  } finally {
    globalData = oldGlobalData;
  }
}

export function currentLayerPlan(): LayerPlan {
  const lp = globalData?.layerPlan;
  if (!lp) {
    throw new Error(
      // Must only be called from inside `withGlobalLayerPlan`!
      "Now is not a valid time to call `currentLayerPlan`. This error typically occurs when you attempt to call a Grafast step function from outside of the planning lifecycle - it's important to note that Grafast plans must be resolved synchronously, so check for 'async' or 'setTimeout' or any location where a step function is called outside of a plan resolver. For more information, read about plan resolvers: https://grafast.org/grafast/plan-resolvers",
    );
  }
  return lp;
}

export function currentPolymorphicPaths(): ReadonlySet<string> {
  const pp = globalData?.polymorphicPaths;
  if (!pp) {
    throw new Error(
      "GrafastInternalError<b0b05743-8b21-42c6-9b53-925013d88bd1>: currentPolymorphicPaths called out of turn; must only called within a withGlobalLayerPlan callback",
    );
  }
  return pp;
}
