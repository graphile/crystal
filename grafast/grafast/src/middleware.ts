import { Middleware, orderedApply } from "graphile-config";

import type { GrafastExecutionArgs } from ".";

const $$middleware = Symbol("middleware");
export function getGrafastMiddleware(
  resolvedPreset: GraphileConfig.ResolvedPreset & {
    [$$middleware]?: Middleware<GraphileConfig.GrafastMiddleware> | null;
  },
) {
  if (resolvedPreset[$$middleware] !== undefined) {
    return resolvedPreset[$$middleware];
  }
  let middleware: Middleware<GraphileConfig.GrafastMiddleware> | null = null;
  orderedApply(
    resolvedPreset.plugins,
    (p) => p.grafast?.middleware,
    (name, fn, _plugin) => {
      if (!middleware) middleware = new Middleware();
      middleware.register(name, fn as any);
    },
  );
  try {
    resolvedPreset[$$middleware] = middleware;
  } catch {
    // Ignore - preset must be readonly
  }
  return middleware;
}

export function establishMiddleware(args: {
  resolvedPreset?: GraphileConfig.ResolvedPreset;
  middleware?: Middleware<GraphileConfig.GrafastMiddleware> | null;
}) {
  if (args.middleware === undefined && args.resolvedPreset != null) {
    return getGrafastMiddleware(args.resolvedPreset);
  } else {
    return args.middleware ?? null;
  }
}
