import type {
  AsyncExecutionResult,
  ExecutionArgs,
  ExecutionResult,
} from "graphql";

import type { DataPlannerExecuteOptions } from "./execute.js";
import { withDataPlannerArgs } from "./execute.js";
import type { PromiseOrDirect } from "./interfaces.js";

/**
 * Use this instead of GraphQL.js' subscribe method and we'll automatically
 * run dataplannerPrepare for you and handle the result.
 */
export function subscribe(
  args: ExecutionArgs,
  options: DataPlannerExecuteOptions = {},
): PromiseOrDirect<
  | AsyncGenerator<ExecutionResult | AsyncExecutionResult, void, void>
  | ExecutionResult
> {
  return withDataPlannerArgs(args, options);
}
