import EventEmitter from "events";
import {
  AsyncExecutionResult,
  ExecutionArgs,
  ExecutionResult,
  subscribe as graphqlSubscribe,
} from "graphql";
import { PromiseOrValue } from "graphql/jsutils/PromiseOrValue";
import { inspect } from "util";
import {
  addExtensionsToExecutionResult,
  DataPlannerExecuteOptions,
  withDataPlannerArgs,
} from "./execute.js";
import { $$extensions, ExecutionEventEmitter } from "./interfaces.js";
import { isPromiseLike } from "./utils.js";

/**
 * Use this instead of GraphQL.js' subscribe method and we'll automatically
 * run dataplannerPrepare for you and handle the result.
 */
export function subscribe(
  args: ExecutionArgs,
  options: DataPlannerExecuteOptions = {},
): PromiseOrValue<
  | AsyncGenerator<ExecutionResult | AsyncExecutionResult, void, void>
  | ExecutionResult
> {
  return withDataPlannerArgs(args, options, subscribeInner);
}

/**
 * @internal
 */
function subscribeInner(
  args: ExecutionArgs,
  rootValue: any,
): PromiseOrValue<
  ExecutionResult | AsyncGenerator<AsyncExecutionResult, void, void>
> {
  const realArgs = args.rootValue !== rootValue ? { ...args, rootValue } : args;
  const subscribeResult =
    // TODO: support bypassing
    /*(realArgs.rootValue as any)?.[$$bypassGraphQL]
    ? bypassGraphQLExecute(realArgs)
    :*/ graphqlSubscribe(realArgs);
  if (isPromiseLike(subscribeResult)) {
    return subscribeResult.then((r) =>
      addExtensionsToExecutionResult(r, rootValue),
    );
  } else {
    return addExtensionsToExecutionResult(subscribeResult, rootValue);
  }
}
