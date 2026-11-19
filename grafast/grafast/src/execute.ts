import { EventEmitter } from "eventemitter3";
import type {
  AsyncExecutionResult,
  ExecutionArgs,
  ExecutionResult,
} from "graphql";
import type { PromiseOrValue } from "graphql/jsutils/PromiseOrValue.js";

import { $$eventEmitter, $$extensions } from "./constants.ts";
import type {
  ExecuteEvent,
  ExecutionEventEmitter,
  ExecutionEventMap,
  GrafastExecutionArgs,
} from "./interfaces.ts";
import { establishMiddleware } from "./middleware.ts";
import { establishInternalExecutionArgs } from "./plan.ts";
import { grafastPrepare } from "./prepare.ts";
import { isPromiseLike } from "./utils.ts";

/**
 * Used by `execute` and `subscribe`.
 * @internal
 */
export function withGrafastArgs(
  inArgs: GrafastExecutionArgs,
): PromiseOrValue<
  ExecutionResult | AsyncGenerator<AsyncExecutionResult, void, void>
> {
  const args = establishInternalExecutionArgs(inArgs);
  const explain = args.explain;
  const shouldExplain = !!explain;

  let unlisten: (() => void) | null = null;
  if (shouldExplain) {
    const eventEmitter: ExecutionEventEmitter = new EventEmitter();
    const explainOperations: any[] = [];
    args[$$eventEmitter] = eventEmitter;
    args[$$extensions] = {
      explain: {
        operations: explainOperations,
      },
    };
    const handleExplainOperation = ({
      operation,
    }: ExecutionEventMap["explainOperation"]) => {
      if (explain === true || (explain && explain.includes(operation.type))) {
        explainOperations.push(operation);
      }
    };
    eventEmitter.on("explainOperation", handleExplainOperation);
    unlisten = () => {
      eventEmitter.removeListener("explainOperation", handleExplainOperation);
    };
  }

  const executionResult = grafastPrepare(args);
  if (unlisten !== null) {
    Promise.resolve(executionResult).then(unlisten, unlisten);
  }
  // Convert from PromiseOrDirect to PromiseOrValue
  if (isPromiseLike(executionResult)) {
    return Promise.resolve(executionResult);
  } else {
    return executionResult;
  }
}

/**
 * @deprecated Second and third parameters should be passed as part of args,
 * specifically `resolvedPreset` and `outputDataAsString`.
 */
export function execute(
  args: ExecutionArgs,
  resolvedPreset: GraphileConfig.ResolvedPreset | undefined,
  outputDataAsString?: boolean,
): PromiseOrValue<
  ExecutionResult | AsyncGenerator<AsyncExecutionResult, void, undefined>
>;
/**
 * Use this instead of GraphQL.js' execute method and we'll automatically
 * run grafastPrepare for you and handle the result.
 */
export function execute(
  args: GrafastExecutionArgs,
): PromiseOrValue<
  ExecutionResult | AsyncGenerator<AsyncExecutionResult, void, undefined>
>;
export function execute(
  args: GrafastExecutionArgs,
  legacyResolvedPreset?: GraphileConfig.ResolvedPreset,
  legacyOutputDataAsString?: boolean,
): PromiseOrValue<
  ExecutionResult | AsyncGenerator<AsyncExecutionResult, void, undefined>
> {
  // TODO: remove legacy compatibility
  if (legacyResolvedPreset !== undefined) {
    args.resolvedPreset = legacyResolvedPreset;
  }
  if (legacyOutputDataAsString !== undefined) {
    args.outputDataAsString = legacyOutputDataAsString;
  }

  const middleware = establishMiddleware(args);
  if (middleware !== null) {
    return middleware.run("execute", { args }, executeMiddlewareCallback);
  } else {
    return withGrafastArgs(args);
  }
}

const executeMiddlewareCallback = (event: ExecuteEvent) =>
  withGrafastArgs(event.args);
