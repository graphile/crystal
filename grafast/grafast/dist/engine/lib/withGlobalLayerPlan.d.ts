import type { Step } from "../..";
import type { LayerPlan } from "../LayerPlan";
export declare function withGlobalLayerPlan<T, TThis = any, TArgs extends [...args: any[]] = [...args: any[]]>(layerPlan: LayerPlan, polymorphicPaths: ReadonlySet<string> | null, callback: (this: TThis, ...args: TArgs) => T, callbackThis?: TThis, ...callbackArgs: TArgs): T;
export declare function currentLayerPlan(): LayerPlan;
export declare function currentPolymorphicPaths(): ReadonlySet<string> | null;
export declare function isUnaryStep($step: Step): boolean;
//# sourceMappingURL=withGlobalLayerPlan.d.ts.map