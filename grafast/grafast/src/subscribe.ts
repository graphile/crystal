import type {
  AsyncExecutionResult,
  ExecutionArgs,
  ExecutionResult,
} from "graphql";
import type { PromiseOrValue } from "graphql/jsutils/PromiseOrValue";

import { NULL_PRESET } from "./config.js";
import { withGrafastArgs } from "./execute.js";
import type { GrafastExecutionArgs } from "./index.js";
import type { SubscribeEvent } from "./interfaces.js";
import { getMiddlewares } from "./middlewares.js";

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
  if (
    legacyResolvedPreset !== undefined ||
    legacyOutputDataAsString !== undefined ||
    args.middlewares === undefined
  ) {
    const resolvedPreset = args.resolvedPreset ?? legacyResolvedPreset;
    const middlewares =
      args.middlewares === undefined && resolvedPreset != null
        ? getMiddlewares(resolvedPreset)
        : args.middlewares;
    return subscribe({
      ...args,
      resolvedPreset,
      middlewares,
    });
  }
  if (args.middlewares != null) {
    return args.middlewares.run(
      "subscribe",
      { args },
      subscribeMiddlewareCallback,
    );
  } else {
    return withGrafastArgs(args);
  }
}

const subscribeMiddlewareCallback = (event: SubscribeEvent) =>
  withGrafastArgs(event.args);
