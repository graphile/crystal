import EventEmitter from "events";
import type {
  AsyncExecutionResult,
  ExecutionArgs,
  ExecutionResult,
} from "graphql";
import { execute as graphqlExecute } from "graphql";
import { inspect } from "util";

import type {
  ExecutionEventEmitter,
  ExecutionEventMap,
  PromiseOrDirect,
} from "./interfaces.js";
import { $$eventEmitter, $$extensions } from "./interfaces.js";
import type { CrystalPrepareOptions } from "./prepare.js";
import { dataplannerPrepare } from "./prepare.js";

export interface DataPlannerExecuteOptions {
  explain?: CrystalPrepareOptions["explain"];
}

/**
 * Used by `execute` and `subscribe`.
 * @internal
 */
export function withDataPlannerArgs(
  args: ExecutionArgs,
  options: DataPlannerExecuteOptions = {},
): PromiseOrDirect<
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
    explain: options.explain,
  });
  if (unlisten) {
    Promise.resolve(rootValue).then(unlisten, unlisten);
  }
  return rootValue;
}

/**
 * Use this instead of GraphQL.js' execute method and we'll automatically
 * run dataplannerPrepare for you and handle the result.
 */
export function execute(
  args: ExecutionArgs,
  options: DataPlannerExecuteOptions = {},
): PromiseOrDirect<
  ExecutionResult | AsyncGenerator<AsyncExecutionResult, void, void>
> {
  return withDataPlannerArgs(args, options);
}
