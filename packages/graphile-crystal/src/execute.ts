import type {
  AsyncExecutionResult,
  ExecutionArgs,
  ExecutionResult,
} from "graphql";
import { execute as graphqlExecute } from "graphql";
import type { PromiseOrValue } from "graphql/jsutils/PromiseOrValue";
import { inspect } from "util";

import type { PromiseOrDirect } from "./interfaces";
import { $$bypassGraphQL } from "./interfaces";
import { bypassGraphQLExecute, crystalPrepare } from "./prepare";
import { isPromiseLike } from "./utils";

/**
 * Use this instead of GraphQL.js' execute method and we'll automatically
 * run crystalPrepare for you and handle the result.
 */
export function execute(
  args: ExecutionArgs,
): PromiseOrValue<
  ExecutionResult | AsyncGenerator<AsyncExecutionResult, void, void>
> {
  if (process.env.NODE_ENV === "development") {
    if (
      args.rootValue != null &&
      (typeof args.rootValue !== "object" ||
        Object.keys(args.rootValue).length > 0)
    ) {
      throw new Error(
        `Crystal executor doesn't support there being a rootValue (found ${inspect(
          args.rootValue,
        )})`,
      );
    }
  }
  const rootValue = crystalPrepare(args, {
    experimentalGraphQLBypass: true,
  });
  if (isPromiseLike(rootValue)) {
    return rootValue.then((rootValue) =>
      executeInner(args, rootValue),
    ) as PromiseOrValue<
      ExecutionResult | AsyncGenerator<AsyncExecutionResult, void, void>
    >;
  } else {
    return executeInner(args, rootValue);
  }
}

/**
 * @internal
 */
function executeInner(
  args: ExecutionArgs,
  rootValue: any,
): PromiseOrValue<
  ExecutionResult | AsyncGenerator<AsyncExecutionResult, void, void>
> {
  const realArgs = args.rootValue !== rootValue ? { ...args, rootValue } : args;
  return (realArgs.rootValue as any)?.[$$bypassGraphQL]
    ? bypassGraphQLExecute(realArgs)
    : graphqlExecute(realArgs);
}
