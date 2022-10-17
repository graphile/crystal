import { AsyncHooks, PluginHook } from "graphile-config";
import type { ExecutionArgs } from "graphql";

import { NULL_PRESET, hook } from "./config.js";
import { isPromiseLike } from "./utils.js";

type PromiseOrValue<T> = T | Promise<T>;

// TODO: rename this.
/**
 * Applies Graphile Config hooks to your GraphQL request, e.g. to
 * populate context or similar.
 *
 * @experimental
 */
export function hookArgs(
  args: ExecutionArgs,
  ctx: GraphileConfig.GraphQLRequestContext,
  resolvedPreset: GraphileConfig.ResolvedPreset = NULL_PRESET,
): ExecutionArgs | PromiseLike<ExecutionArgs> {
  if (
    resolvedPreset !== NULL_PRESET &&
    resolvedPreset.plugins &&
    resolvedPreset.plugins.length > 0
  ) {
    const event = { args, ctx, resolvedPreset };
    const result = hook(resolvedPreset, "args", event);
    if (isPromiseLike(result)) {
      return result.then(() => event.args);
    } else {
      return event.args;
    }
  }
  return args;
}
