import type { ExecutionArgs } from "graphql";

import type {
  GrafastExecutionArgs,
  PrepareArgsEvent,
  PromiseOrDirect,
} from "./interfaces.js";
import { $$hooked } from "./interfaces.js";
import { getGrafastMiddleware } from "./middleware.js";
import { isPromiseLike } from "./utils.js";
const EMPTY_OBJECT: Record<string, never> = Object.freeze(Object.create(null));

const $$writeTest = Symbol("grafastWriteTest");

/** @deprecated Pass `resolvedPreset` and `requestContext` via args directly */
export function hookArgs(
  rawArgs: ExecutionArgs,
  resolvedPreset: GraphileConfig.ResolvedPreset,
  ctx: Partial<Grafast.RequestContext>,
): PromiseOrDirect<Grafast.ExecutionArgs>;
export function hookArgs(
  rawArgs: GrafastExecutionArgs,
): PromiseOrDirect<Grafast.ExecutionArgs>;
/**
 * Applies Graphile Config hooks to your GraphQL request, e.g. to
 * populate context or similar.
 *
 * @experimental
 */
export function hookArgs(
  rawArgs: GrafastExecutionArgs,
  legacyResolvedPreset?: GraphileConfig.ResolvedPreset,
  legacyCtx?: Partial<Grafast.RequestContext>,
): PromiseOrDirect<Grafast.ExecutionArgs> {
  if (legacyResolvedPreset !== undefined) {
    rawArgs.resolvedPreset = legacyResolvedPreset;
  }
  if (legacyCtx !== undefined) {
    rawArgs.requestContext = rawArgs.requestContext ?? legacyCtx;
  }
  const {
    middleware: rawMiddleware,
    resolvedPreset,
    contextValue: rawContextValue,
  } = rawArgs;
  try {
    (rawContextValue as Record<string | symbol, any>)[$$writeTest] = true;
  } catch (e) {
    // Make context mutable
    rawArgs.contextValue = Object.assign(Object.create(null), rawContextValue);
  }
  const middleware =
    rawMiddleware === undefined && resolvedPreset != null
      ? getGrafastMiddleware(resolvedPreset)
      : rawMiddleware ?? null;
  if (rawMiddleware === undefined) {
    rawArgs.middleware = middleware;
  }
  const args = rawArgs as Grafast.ExecutionArgs;
  // Assert that args haven't already been hooked
  if (args[$$hooked]) {
    throw new Error("Must not call hookArgs twice!");
  }
  args[$$hooked] = true;

  if (middleware != null) {
    return middleware.run("prepareArgs", { args }, finalizeWithEvent);
  } else {
    return finalize(args);
  }
}

function finalize(args: Grafast.ExecutionArgs) {
  const userContext = args.resolvedPreset?.grafast?.context;
  const contextValue = args.contextValue as Partial<Grafast.Context>;
  if (typeof userContext === "function") {
    const result = userContext(args.requestContext ?? EMPTY_OBJECT, args);
    if (isPromiseLike(result)) {
      // Deliberately shadowed 'result'
      return result.then((result) => {
        Object.assign(contextValue, result);
        return args;
      });
    } else {
      Object.assign(contextValue, result);
      return args;
    }
  } else if (typeof userContext === "object" && userContext !== null) {
    Object.assign(contextValue, userContext);
    return args;
  } else {
    return args;
  }
}

function finalizeWithEvent(event: PrepareArgsEvent) {
  return finalize(event.args);
}
