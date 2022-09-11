import type {
  AsyncExecutionResult,
  ExecutionArgs,
  ExecutionResult,
} from "graphql";
import type { PromiseOrValue } from "graphql/jsutils/PromiseOrValue";

import type { GrafastExecuteOptions } from "./execute.js";
import { withGrafastArgs } from "./execute.js";

/**
 * Use this instead of GraphQL.js' subscribe method and we'll automatically
 * run grafastPrepare for you and handle the result.
 */
export function subscribe(
  args: ExecutionArgs,
  options: GrafastExecuteOptions = {},
): PromiseOrValue<
  | AsyncGenerator<ExecutionResult | AsyncExecutionResult, void, void>
  | ExecutionResult
> {
  return withGrafastArgs(args, options);
}
