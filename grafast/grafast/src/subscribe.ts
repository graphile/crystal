import type {
  AsyncExecutionResult,
  ExecutionArgs,
  ExecutionResult,
} from "graphql";
import type { PromiseOrValue } from "graphql/jsutils/PromiseOrValue";

import { withGrafastArgs } from "./execute.js";
import { NULL_PRESET } from "./config.js";

/**
 * Use this instead of GraphQL.js' subscribe method and we'll automatically
 * run grafastPrepare for you and handle the result.
 */
export function subscribe(
  args: ExecutionArgs,
  resolvedPreset: GraphileConfig.ResolvedPreset = NULL_PRESET,
  asString = false,
): PromiseOrValue<
  | AsyncGenerator<ExecutionResult | AsyncExecutionResult, void, void>
  | ExecutionResult
> {
  return withGrafastArgs(args, resolvedPreset, asString);
}
