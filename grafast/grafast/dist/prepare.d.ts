import type { GrafastPlanJSON } from "./index.js";
import type { GrafastTimeouts } from "./interfaces.js";
declare const $$contextPlanCache: unique symbol;
export interface GrafastPrepareOptions {
    /**
     * A list of 'explain' types that should be included in `extensions.explain`.
     *
     * - `plan` will cause the plan JSON to be included
     * - other values are dependent on the plugins in play
     *
     * If set to `true` then all possible explain types will be exposed.
     */
    explain?: boolean | string[];
    /**
     * If true, the result will be returned as a string rather than an object -
     * this is an optimization for returning the data over a network socket or
     * similar.
     */
    outputDataAsString?: boolean;
    timeouts?: GrafastTimeouts;
}
declare module "./engine/OperationPlan.js" {
    interface OperationPlan {
        [$$contextPlanCache]?: GrafastPlanJSON;
    }
}
export {};
//# sourceMappingURL=prepare.d.ts.map