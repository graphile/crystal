import EventEmitter from "events";
import type {
  AsyncExecutionResult,
  ExecutionArgs,
  ExecutionResult,
} from "graphql";
import { execute as graphqlExecute } from "graphql";
import type { PromiseOrValue } from "graphql/jsutils/PromiseOrValue";
import { isAsyncIterable } from "iterall";
import { inspect } from "util";

import type { ExecutionEventEmitter, ExecutionEventMap } from "./interfaces";
import { $$bypassGraphQL, $$eventEmitter, $$extensions } from "./interfaces";
import type { CrystalPrepareOptions } from "./prepare";
import { bypassGraphQLExecute, dataplannerPrepare } from "./prepare";
import { isPromiseLike } from "./utils";

export interface DataPlannerExecuteOptions {
  experimentalGraphQLBypass?: boolean;
  explain?: CrystalPrepareOptions["explain"];
}

/**
 * @internal
 */
export function withDataPlannerArgs(
  args: ExecutionArgs,
  options: DataPlannerExecuteOptions = {},
  callback: typeof executeInner,
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
  if (args.rootValue == null) {
    args.rootValue = Object.create(null);
  }
  if (typeof args.rootValue !== "object" || args.rootValue == null) {
    throw new Error("DataPlanner requires that the 'rootValue' be an object");
  }
  const shouldExplain = !!options.explain?.length;
  const eventEmitter: ExecutionEventEmitter | undefined = shouldExplain
    ? new EventEmitter()
    : undefined;
  if (shouldExplain) {
    args.rootValue[$$extensions] = {
      explain: {
        operations: [],
      },
    };
  }

  const explainOperations = shouldExplain
    ? args.rootValue[$$extensions].explain.operations
    : undefined;
  const handleExplainOperation = ({
    operation,
  }: ExecutionEventMap["explainOperation"]) => {
    if (options.explain!.includes(operation.type)) {
      explainOperations.push(operation);
    }
  };
  if (shouldExplain) {
    args.rootValue[$$eventEmitter] = eventEmitter;
    eventEmitter!.on("explainOperation", handleExplainOperation);
  }
  const unlisten = shouldExplain
    ? () => {
        eventEmitter!.removeListener(
          "explainOperation",
          handleExplainOperation,
        );
      }
    : undefined;

  const rootValue = dataplannerPrepare(args, {
    experimentalGraphQLBypass: options.experimentalGraphQLBypass ?? true,
    explain: options.explain,
  });
  let next;
  if (isPromiseLike(rootValue)) {
    next = rootValue.then((rootValue) =>
      callback(args, rootValue),
    ) as PromiseOrValue<
      ExecutionResult | AsyncGenerator<AsyncExecutionResult, void, void>
    >;
  } else {
    next = callback(args, rootValue);
  }
  if (unlisten) {
    Promise.resolve(next).finally(unlisten);
  }
  return next;
}

/**
 * Use this instead of GraphQL.js' execute method and we'll automatically
 * run dataplannerPrepare for you and handle the result.
 */
export function execute(
  args: ExecutionArgs,
  options: DataPlannerExecuteOptions = {},
): PromiseOrValue<
  ExecutionResult | AsyncGenerator<AsyncExecutionResult, void, void>
> {
  return withDataPlannerArgs(args, options, executeInner);
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
  const executeResult = (realArgs.rootValue as any)?.[$$bypassGraphQL]
    ? bypassGraphQLExecute(realArgs)
    : graphqlExecute(realArgs);
  if (isPromiseLike(executeResult)) {
    return executeResult.then((r) =>
      addExtensionsToExecutionResult(r, rootValue),
    );
  } else {
    return addExtensionsToExecutionResult(executeResult, rootValue);
  }
}

/**
 * @internal
 */
export function addExtensionsToExecutionResult<
  T extends ExecutionResult | AsyncGenerator<AsyncExecutionResult, void, void>,
>(executionResult: T, rootValue: any): T {
  const extensions = rootValue[$$extensions];
  if (!extensions) {
    return executionResult;
  }
  if (isAsyncIterable(executionResult)) {
    let first = true;
    return {
      ...executionResult,
      next(...args: any[]) {
        if (first) {
          first = false;
          const val = executionResult.next(...(args as any));
          if (isPromiseLike(val)) {
            return val.then((iteratorResult) => {
              if (iteratorResult.value) {
                return {
                  ...iteratorResult,
                  value: mergeExtensions(iteratorResult.value, extensions),
                };
              } else {
                return iteratorResult;
              }
            });
          } else {
            return mergeExtensions(val, extensions);
          }
        } else {
          return executionResult.next(...(args as any));
        }
      },
    } as AsyncGenerator<AsyncExecutionResult, void, void> as any;
  } else {
    return mergeExtensions(executionResult, extensions) as any;
  }
}

/**
 * @internal
 */
function mergeExtensions<T extends ExecutionResult | AsyncExecutionResult>(
  executionResult: T,
  extensions: any,
): T {
  if (!executionResult.extensions) {
    executionResult.extensions = extensions;
  } else {
    Object.assign(executionResult.extensions, extensions);
  }
  return executionResult;
}
