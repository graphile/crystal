import type { PluginHook } from "graphile-config";
import type { ExecutionArgs } from "graphql";
import { NULL_PRESET } from "./config";
import { isPromiseLike } from "./utils";

type PromiseOrValue<T> = T | Promise<T>;

export interface GrafastOptions {
  // TODO: context should be a generic
  /**
   * An object to merge into the GraphQL context. Alternatively, pass an
   * (optionally asynchronous) function that returns an object to merge into
   * the GraphQL context.
   */
  context?:
    | Record<string, any>
    | (<TContext extends Record<string, any>>(
        ctx: GraphileConfig.GraphQLRequestContext,
        currentContext: Partial<TContext>,
      ) => PromiseOrValue<Partial<TContext>>);

  /**
   * A list of 'explain' types that should be included in `extensions.explain`.
   *
   * - `mermaid-js` will cause the mermaid plan to be included
   * - other values are dependent on the plugins in play
   *
   * If set to `true` then all possible explain types will be exposed.
   */
  explain?: boolean | string[];

  /**
   * If true, the result will be returned as a string rather than an object -
   * this is an optimization for returning the data over a network socket or
   * similar.
   */
  asString?: boolean;
}

declare global {
  namespace GraphileConfig {
    interface GraphQLRequestContext {}
    interface Preset {
      grafast?: GrafastOptions;
    }
    interface GrafastHooks {
      args: (event: {
        args: ExecutionArgs;
        ctx: GraphileConfig.GraphQLRequestContext;
        resolvedPreset: GraphileConfig.ResolvedPreset;
      }) => PromiseOrValue<ExecutionArgs>;
    }
    interface Plugin {
      grafast?: {
        hooks?: GrafastHooks;
      };
    }
  }
}

let GraphileConfig:
  | undefined
  | null
  | typeof import("graphile-config")
  | Promise<typeof import("graphile-config") | null> = undefined;
let graphileConfigLoaded = false;

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
): ExecutionArgs | Promise<ExecutionArgs> {
  if (
    resolvedPreset !== NULL_PRESET &&
    resolvedPreset.plugins &&
    resolvedPreset.plugins.length > 0
  ) {
    if (GraphileConfig === undefined) {
      GraphileConfig = import("graphile-config").then(
        (GC) => {
          GraphileConfig = GC;
          graphileConfigLoaded = true;
          return GC;
        },
        () => {
          GraphileConfig = null;
          graphileConfigLoaded = true;
          return null;
        },
      );
    }

    const next = () => {
      if (GraphileConfig) {
        const hooks = new (
          GraphileConfig as typeof import("graphile-config")
        ).AsyncHooks<GraphileConfig.GrafastHooks>();
        const argResult = hooks.process("args", { args, ctx, resolvedPreset });
        if (isPromiseLike(argResult)) {
          return argResult.then(() => args);
        } else {
          return args;
        }
      } else {
        return args;
      }
    };

    if (graphileConfigLoaded) {
      return next();
    } else {
      return (GraphileConfig as Promise<any>).then(next);
    }
  }
  return args;
}
