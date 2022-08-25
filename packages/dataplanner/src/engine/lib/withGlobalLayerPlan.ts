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
      "GraphileInternalError<6101a346-cfe6-4da7-8e63-010e36fd7f37>: currentLayerPlan called out of turn; must only called within a withGlobalLayerPlan callback",
    );
  }
  return lp;
}

export function currentPolymorphicPaths(): ReadonlySet<string> {
  const pp = globalData?.polymorphicPaths;
  if (!pp) {
    throw new Error(
      "GraphileInternalError<b0b05743-8b21-42c6-9b53-925013d88bd1>: currentPolymorphicPaths called out of turn; must only called within a withGlobalLayerPlan callback",
    );
  }
  return pp;
}
