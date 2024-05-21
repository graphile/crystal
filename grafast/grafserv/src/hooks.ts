import { isPromiseLike } from "grafast";
import type { MiddlewareNext } from "graphile-config";
import { Middleware, orderedApply } from "graphile-config";

// We could use a global WeakMap, but storing directly onto the resolvedPreset
// should use more traditional garbage collection.
const $$middleware = Symbol("middleware");

export function getGrafservMiddleware(
  resolvedPreset: GraphileConfig.ResolvedPreset & {
    [$$middleware]?: Middleware<GraphileConfig.GrafservMiddleware> | null;
  },
) {
  if (resolvedPreset[$$middleware]) {
    return resolvedPreset[$$middleware];
  }
  let middleware: Middleware<GraphileConfig.GrafservMiddleware> | null = null;
  orderedApply(
    resolvedPreset.plugins,
    (p) => p.grafserv?.middleware,
    (name, fn, _plugin) => {
      if (!middleware) middleware = new Middleware();
      middleware.register(name, fn as any);
    },
  );

  // TODO: Delete this backwards compatibility
  orderedApply(
    resolvedPreset.plugins,
    (p) => p.grafserv?.hooks,
    (name, fn, _plugin) => {
      function resultThenNext(result: any, next: MiddlewareNext<any>) {
        if (isPromiseLike(result)) {
          return result.then(next);
        } else {
          return next();
        }
      }
      if (!middleware) middleware = new Middleware();
      // Backwards compatibility with the old hooks
      switch (name) {
        case "init": {
          middleware.register("setPreset", (next, event) => {
            const { resolvedPreset } = event;
            const result = fn({ resolvedPreset }, event);
            return resultThenNext(result, next);
          });
          break;
        }
        case "ruruHTMLParts": {
          middleware.register("ruruHTMLParts", (next, event) => {
            const { resolvedPreset, request, htmlParts } = event;
            const result = fn({ resolvedPreset }, htmlParts, {
              request,
            });
            return resultThenNext(result, next);
          });
          break;
        }
        case "processGraphQLRequestBody": {
          middleware.register("processGraphQLRequestBody", (next, event) => {
            const { resolvedPreset } = event;
            const result = fn({ resolvedPreset }, event);
            return resultThenNext(result, next);
          });
          break;
        }
      }
    },
  );

  try {
    resolvedPreset[$$middleware] = middleware;
  } catch {
    // Ignore - preset must be readonly
  }
  return middleware;
}
