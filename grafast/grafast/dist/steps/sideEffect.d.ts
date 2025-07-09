import type { PromiseOrDirect, UnbatchedExecutionExtra } from "../interfaces.js";
import type { Multistep, UnwrapMultistep } from "../multistep.js";
import type { Step } from "../step.js";
import { UnbatchedStep } from "../step.js";
/**
 * Calls the given callback function for each tuple
 */
export declare class SideEffectStep<TIn, TOut> extends UnbatchedStep<TOut> {
    private fn;
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    allowMultipleOptimizations: boolean;
    private planDep;
    constructor($plan: Step<TIn> | null | undefined, fn: (value: TIn) => PromiseOrDirect<TOut>);
    toStringMeta(): any;
    unbatchedExecute(_extra: UnbatchedExecutionExtra, value: TIn): PromiseOrDirect<TOut>;
}
/**
 * A plan that takes the input `$plan` and feeds each value through the `fn`
 * callback. Note: if you need to pass more than one value, pass a `ListStep`
 * as the `$plan` argument.
 */
declare function sideEffect<const TInMultistep extends Multistep, TOut>(spec: TInMultistep, fn: (value: UnwrapMultistep<TInMultistep>) => PromiseOrDirect<TOut>): SideEffectStep<UnwrapMultistep<TInMultistep>, TOut>;
export { sideEffect };
//# sourceMappingURL=sideEffect.d.ts.map