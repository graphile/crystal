import {
  type MiddlewareNext,
  Middlewares,
  orderedApply,
} from "graphile-config";

const $$middleware = Symbol("middleware");
export function getMiddlewares(
  resolvedPreset: GraphileConfig.ResolvedPreset & {
    [$$middleware]?: Middlewares<GraphileConfig.GrafastMiddlewares>;
  },
) {
  if (resolvedPreset[$$middleware]) {
    return resolvedPreset[$$middleware];
  }
  const middlewares = new Middlewares<GraphileConfig.GrafastMiddlewares>();
  orderedApply(
    resolvedPreset.plugins,
    (p) => p.grafast?.middlewares,
    (name, fn, _plugin) => {
      middlewares.register(name, fn as any);
    },
  );
  try {
    resolvedPreset[$$middleware] = middlewares;
  } catch {
    // Ignore - preset must be readonly
  }
  return middlewares;
}
