import type { AsyncExecutionResult, ExecutionArgs, ExecutionResult } from "graphql";
import type { PromiseOrValue } from "graphql/jsutils/PromiseOrValue";
import type { GrafastExecutionArgs } from "./index.js";
/**
 * @deprecated Second and third parameters should be passed as part of args,
 * specifically `resolvedPreset` and `outputDataAsString`.
 */
export declare function subscribe(args: ExecutionArgs, resolvedPreset: GraphileConfig.ResolvedPreset | undefined, outputDataAsString?: boolean): PromiseOrValue<AsyncGenerator<ExecutionResult | AsyncExecutionResult, void, void> | ExecutionResult>;
/**
 * Use this instead of GraphQL.js' subscribe method and we'll automatically
 * run grafastPrepare for you and handle the result.
 */
export declare function subscribe(args: GrafastExecutionArgs): PromiseOrValue<AsyncGenerator<ExecutionResult | AsyncExecutionResult, void, void> | ExecutionResult>;
//# sourceMappingURL=subscribe.d.ts.map