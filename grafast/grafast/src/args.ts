import type { ExecutionArgs } from "graphql";

import type { GrafastExecutionArgs, PromiseOrDirect } from "./interfaces.js";
import { $$hooked } from "./interfaces.js";
import { getMiddlewares } from "./middlewares.js";
import { isPromiseLike } from "./utils.js";
const EMPTY_OBJECT: Record<string, never> = Object.freeze(Object.create(null));

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
  if (
    legacyResolvedPreset !== undefined ||
    legacyCtx !== undefined ||
    rawArgs.middlewares === undefined
  ) {
    rawArgs.resolvedPreset = rawArgs.resolvedPreset ?? legacyResolvedPreset;
    rawArgs.requestContext = rawArgs.requestContext ?? legacyCtx;
    rawArgs.middlewares =
      rawArgs.middlewares === undefined && rawArgs.resolvedPreset != null
        ? getMiddlewares(rawArgs.resolvedPreset)
        : rawArgs.middlewares;
  }
  const args = rawArgs as Grafast.ExecutionArgs;
  const {
    resolvedPreset,
    requestContext: ctx = EMPTY_OBJECT,
    middlewares,
  } = args;
  // Assert that args haven't already been hooked
  if (args[$$hooked]) {
    throw new Error("Must not call hookArgs twice!");
  }
  args[$$hooked] = true;

  // Make context mutable
  args.contextValue = Object.assign(Object.create(null), args.contextValue);

  // finalize(args): args is deliberately shadowed
  const finalize = (args: Grafast.ExecutionArgs) => {
    const userContext = resolvedPreset?.grafast?.context;
    if (typeof userContext === "function") {
      const result = userContext(ctx, args);
      if (isPromiseLike(result)) {
        // Deliberately shadowed 'result'
        return result.then((result) => {
          Object.assign(args.contextValue as Partial<Grafast.Context>, result);
          return args;
        });
      } else {
        Object.assign(args.contextValue as Partial<Grafast.Context>, result);
        return args;
      }
    } else if (typeof userContext === "object" && userContext !== null) {
      Object.assign(args.contextValue as Partial<Grafast.Context>, userContext);
      return args;
    } else {
      return args;
    }
  };

  if (middlewares) {
    return middlewares.run("prepareArgs", { args }, ({ args }) =>
      finalize(args),
    );
  } else {
    return finalize(args);
  }
}
