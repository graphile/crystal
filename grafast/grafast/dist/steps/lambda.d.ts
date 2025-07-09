import type { PromiseOrDirect, UnbatchedExecutionExtra } from "../interfaces.js";
import type { Multistep, UnwrapMultistep } from "../multistep.js";
import type { Step } from "../step.js";
import { UnbatchedStep } from "../step.js";
/**
 * Calls the given lambda function for each tuple
 */
export declare class LambdaStep<TIn, TOut> extends UnbatchedStep<TOut> {
    private fn;
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    allowMultipleOptimizations: boolean;
    private depId;
    constructor($plan: Step<TIn> | null | undefined, fn: (value: TIn) => PromiseOrDirect<TOut>);
    toStringMeta(): any;
    deduplicate(peers: LambdaStep<any, any>[]): LambdaStep<TIn, TOut>[];
    unbatchedExecute(_extra: UnbatchedExecutionExtra, value: TIn): PromiseOrDirect<TOut>;
}
/**
 * A plan that takes the input `$plan` and feeds each value through the `fn`
 * callback. Note: if you need to pass more than one value, pass a `ListStep`
 * as the `$plan` argument.
 */
declare function lambda<const TInMultistep extends Multistep, TOut>(spec: TInMultistep, fn: (value: UnwrapMultistep<TInMultistep>) => PromiseOrDirect<TOut>, isSyncAndSafe?: boolean): LambdaStep<UnwrapMultistep<TInMultistep>, TOut>;
export { lambda };
//# sourceMappingURL=lambda.d.ts.map