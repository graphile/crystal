import EventEmitter from "eventemitter3";
import type {
  AsyncExecutionResult,
  ExecutionArgs,
  ExecutionResult,
} from "graphql";
import type { PromiseOrValue } from "graphql/jsutils/PromiseOrValue";

import { NULL_PRESET } from "./config.js";
import { inspect } from "./inspect.js";
import type { ExecutionEventEmitter, ExecutionEventMap } from "./interfaces.js";
import { $$eventEmitter, $$extensions } from "./interfaces.js";
import { grafastPrepare } from "./prepare.js";
import { isPromiseLike } from "./utils.js";

const isDev =
  typeof process !== "undefined" && process.env.NODE_ENV === "development";

/**
 * Used by `execute` and `subscribe`.
 * @internal
 */
export function withGrafastArgs(
  args: ExecutionArgs,
  resolvedPreset: GraphileConfig.ResolvedPreset,
  outputDataAsString: boolean,
): PromiseOrValue<
  ExecutionResult | AsyncGenerator<AsyncExecutionResult, void, void>
> {
  const options = resolvedPreset?.grafast;
  if (isDev) {
    if (
      args.rootValue != null &&
      (typeof args.rootValue !== "object" ||
        Object.keys(args.rootValue).length > 0)
    ) {
      throw new Error(
        `Grafast executor doesn't support there being a rootValue (found ${inspect(
          args.rootValue,
        )})`,
      );
    }
  }
  if (args.rootValue == null) {
    args.rootValue = Object.create(null);
  }
  if (typeof args.rootValue !== "object" || args.rootValue == null) {
    throw new Error("Grafast requires that the 'rootValue' be an object");
  }
  const explain = options?.explain;
  const shouldExplain = !!explain;
  const eventEmitter: ExecutionEventEmitter | undefined = shouldExplain
    ? new EventEmitter()
    : undefined;

  // FIXME: modifying rootValue like this is super dirty. Also, are we sure
  // that rootValue will be different for each request? Seems risky if someone
  // passes a constant...

  if (shouldExplain) {
    (args.rootValue as any)[$$extensions] = {
      explain: {
        operations: [],
      },
    };
  }

  const explainOperations = shouldExplain
    ? (args.rootValue as any)[$$extensions].explain.operations
    : undefined;
  const handleExplainOperation = ({
    operation,
  }: ExecutionEventMap["explainOperation"]) => {
    if (explain === true || (explain && explain.includes(operation.type))) {
      explainOperations.push(operation);
    }
  };
  if (shouldExplain) {
    (args.rootValue as any)[$$eventEmitter] = eventEmitter;
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

  const rootValue = grafastPrepare(args, {
    explain: options?.explain,
    outputDataAsString,
  });
  if (unlisten) {
    Promise.resolve(rootValue).then(unlisten, unlisten);
  }
  // Convert from PromiseOrDirect to PromiseOrValue
  if (isPromiseLike(rootValue)) {
    return Promise.resolve(rootValue);
  } else {
    return rootValue;
  }
}

/**
 * Use this instead of GraphQL.js' execute method and we'll automatically
 * run grafastPrepare for you and handle the result.
 */
export function execute(
  args: ExecutionArgs,
  resolvedPreset: GraphileConfig.ResolvedPreset = NULL_PRESET,
  outputDataAsString = false,
): PromiseOrValue<
  ExecutionResult | AsyncGenerator<AsyncExecutionResult, void, undefined>
> {
  return withGrafastArgs(args, resolvedPreset, outputDataAsString);
}
