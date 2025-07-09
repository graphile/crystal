import type { AsyncExecutionResult, ExecutionArgs, ExecutionResult } from "graphql";
import type { PromiseOrValue } from "graphql/jsutils/PromiseOrValue";
import type { GrafastExecutionArgs } from "./interfaces.js";
/**
 * @deprecated Second and third parameters should be passed as part of args,
 * specifically `resolvedPreset` and `outputDataAsString`.
 */
export declare function execute(args: ExecutionArgs, resolvedPreset: GraphileConfig.ResolvedPreset | undefined, outputDataAsString?: boolean): PromiseOrValue<ExecutionResult | AsyncGenerator<AsyncExecutionResult, void, undefined>>;
/**
 * Use this instead of GraphQL.js' execute method and we'll automatically
 * run grafastPrepare for you and handle the result.
 */
export declare function execute(args: GrafastExecutionArgs): PromiseOrValue<ExecutionResult | AsyncGenerator<AsyncExecutionResult, void, undefined>>;
//# sourceMappingURL=execute.d.ts.map