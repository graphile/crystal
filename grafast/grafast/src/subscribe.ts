import type {
  AsyncExecutionResult,
  ExecutionArgs,
  ExecutionResult,
} from "graphql";
import type { PromiseOrValue } from "graphql/jsutils/PromiseOrValue";

import { withGrafastArgs } from "./execute.js";
import type { GrafastExecutionArgs } from "./index.js";
import type { SubscribeEvent } from "./interfaces.js";
import { getGrafastMiddleware } from "./middleware.js";

/**
 * @deprecated Second and third parameters should be passed as part of args,
 * specifically `resolvedPreset` and `outputDataAsString`.
 */
export function subscribe(
  args: ExecutionArgs,
  resolvedPreset: GraphileConfig.ResolvedPreset | undefined,
  outputDataAsString?: boolean,
): PromiseOrValue<
  | AsyncGenerator<ExecutionResult | AsyncExecutionResult, void, void>
  | ExecutionResult
>;
/**
 * Use this instead of GraphQL.js' subscribe method and we'll automatically
 * run grafastPrepare for you and handle the result.
 */
export function subscribe(
  args: GrafastExecutionArgs,
): PromiseOrValue<
  | AsyncGenerator<ExecutionResult | AsyncExecutionResult, void, void>
  | ExecutionResult
>;
export function subscribe(
  args: GrafastExecutionArgs,
  legacyResolvedPreset?: GraphileConfig.ResolvedPreset,
  legacyOutputDataAsString?: boolean,
): PromiseOrValue<
  | AsyncGenerator<ExecutionResult | AsyncExecutionResult, void, void>
  | ExecutionResult
> {
  // TODO: remove legacy compatibility
  if (legacyResolvedPreset !== undefined) {
    args.resolvedPreset = legacyResolvedPreset;
  }
  if (legacyOutputDataAsString !== undefined) {
    args.outputDataAsString = legacyOutputDataAsString;
  }

  const { resolvedPreset } = args;
  const middleware =
    args.middleware === undefined && resolvedPreset != null
      ? getGrafastMiddleware(resolvedPreset)
      : args.middleware ?? null;
  if (args.middleware === undefined) {
    args.middleware = middleware;
  }
  if (middleware !== null) {
    return middleware.run("subscribe", { args }, subscribeMiddlewareCallback);
  } else {
    return withGrafastArgs(args);
  }
}

const subscribeMiddlewareCallback = (event: SubscribeEvent) =>
  withGrafastArgs(event.args);
