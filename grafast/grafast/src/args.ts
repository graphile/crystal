import type { ExecutionArgs } from "graphql";

import { hook, NULL_PRESET } from "./config.js";
import { isPromiseLike } from "./utils.js";
import { $$hooked } from "./interfaces.js";

/**
 * Applies Graphile Config hooks to your GraphQL request, e.g. to
 * populate context or similar.
 *
 * @experimental
 */
export function hookArgs(
  rawArgs: ExecutionArgs,
  resolvedPreset: GraphileConfig.ResolvedPreset,
  ctx: Partial<Grafast.RequestContext>,
): Grafast.ExecutionArgs | PromiseLike<Grafast.ExecutionArgs> {
  const args = rawArgs as Grafast.ExecutionArgs;
  // Assert that args haven't already been hooked
  if (args[$$hooked]) {
    throw new Error("Must not call hookArgs twice!");
  }
  args[$$hooked] = true;

  // Make context mutable
  args.contextValue = Object.assign(Object.create(null), args.contextValue);

  // finalize(args): args is deliberately shadowed
  const finalize = (args: Grafast.ExecutionArgs) => {
    const userContext = resolvedPreset.grafast?.context;
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

  if (
    resolvedPreset !== NULL_PRESET &&
    resolvedPreset.plugins &&
    resolvedPreset.plugins.length > 0
  ) {
    const event = { args, ctx, resolvedPreset };
    const result = hook(resolvedPreset, "args", event);
    if (isPromiseLike(result)) {
      return result.then(() => finalize(event.args));
    } else {
      return finalize(event.args);
    }
  }
  return finalize(args);
}
