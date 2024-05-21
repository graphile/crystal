import { Middleware, orderedApply } from "graphile-config";

const $$middleware = Symbol("middleware");
export function getGrafastMiddleware(
  resolvedPreset: GraphileConfig.ResolvedPreset & {
    [$$middleware]?: Middleware<GraphileConfig.GrafastMiddleware>;
  },
) {
  if (resolvedPreset[$$middleware]) {
    return resolvedPreset[$$middleware];
  }
  const middleware = new Middleware<GraphileConfig.GrafastMiddleware>();
  orderedApply(
    resolvedPreset.plugins,
    (p) => p.grafast?.middleware,
    (name, fn, _plugin) => {
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
