import EventEmitter from "eventemitter3";
import type {
  AsyncExecutionResult,
  ExecutionArgs,
  ExecutionResult,
} from "graphql";
import type { PromiseOrValue } from "graphql/jsutils/PromiseOrValue";

import { isDev } from "./dev.js";
import { inspect } from "./inspect.js";
import type {
  ExecuteEvent,
  ExecutionEventEmitter,
  ExecutionEventMap,
  GrafastExecutionArgs,
} from "./interfaces.js";
import { $$eventEmitter, $$extensions } from "./interfaces.js";
import { getGrafastMiddlewares } from "./middlewares.js";
import { grafastPrepare } from "./prepare.js";
import { isPromiseLike } from "./utils.js";

/**
 * Used by `execute` and `subscribe`.
 * @internal
 */
export function withGrafastArgs(
  args: GrafastExecutionArgs,
): PromiseOrValue<
  ExecutionResult | AsyncGenerator<AsyncExecutionResult, void, void>
> {
  const options = args.resolvedPreset?.grafast;
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

  let unlisten: (() => void) | null = null;
  if (shouldExplain) {
    const eventEmitter: ExecutionEventEmitter | undefined = new EventEmitter();
    const explainOperations: any[] = [];
    args.rootValue = Object.assign(Object.create(null), args.rootValue, {
      [$$eventEmitter]: eventEmitter,
      [$$extensions]: {
        explain: {
          operations: explainOperations,
        },
      },
    });
    const handleExplainOperation = ({
      operation,
    }: ExecutionEventMap["explainOperation"]) => {
      if (explain === true || (explain && explain.includes(operation.type))) {
        explainOperations.push(operation);
      }
    };
    eventEmitter!.on("explainOperation", handleExplainOperation);
    unlisten = () => {
      eventEmitter!.removeListener("explainOperation", handleExplainOperation);
    };
  }

  const rootValue = grafastPrepare(args, {
    explain: options?.explain,
    timeouts: options?.timeouts,
    // TODO: Delete this
    outputDataAsString: args.outputDataAsString,
  });
  if (unlisten !== null) {
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

  const { resolvedPreset } = args;
  const middlewares =
    args.middlewares === undefined && resolvedPreset != null
      ? getGrafastMiddlewares(resolvedPreset)
      : args.middlewares ?? null;
  if (args.middlewares === undefined) {
    args.middlewares = middlewares;
  }
  if (middlewares !== null) {
    return middlewares.run("execute", { args }, executeMiddlewareCallback);
  } else {
    return withGrafastArgs(args);
  }
}

const executeMiddlewareCallback = (event: ExecuteEvent) =>
  withGrafastArgs(event.args);
