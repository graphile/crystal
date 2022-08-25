import type { LayerPlan } from "../LayerPlan";

let globalData: {
  layerPlan: LayerPlan;
} | null = null;

export function withGlobalLayerPlan<T>(
  layerPlan: LayerPlan,
  callback: () => T,
): T {
  const oldGlobalData = globalData;
  globalData = {
    layerPlan,
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
      "currentLayerPlan called out of turn; must only called within a withGlobalLayerPlan callback",
    );
  }
  return lp;
}

export function currentPolymorphicPath(): string {
  const lp = currentLayerPlan();
  // A bit of a hack
  return lp._currentPolymorphicPath;
}
