import { isPromiseLike } from "grafast";
import type { MiddlewareNext } from "graphile-config";
import { Middlewares, orderedApply } from "graphile-config";

// We could use a global WeakMap, but storing directly onto the resolvedPreset
// should use more traditional garbage collection.
const $$middleware = Symbol("middleware");

export function getGrafservMiddlewares(
  resolvedPreset: GraphileConfig.ResolvedPreset & {
    [$$middleware]?: Middlewares<GraphileConfig.GrafservMiddlewares>;
  },
) {
  if (resolvedPreset[$$middleware]) {
    return resolvedPreset[$$middleware];
  }
  const middlewares = new Middlewares<GraphileConfig.GrafservMiddlewares>();
  orderedApply(
    resolvedPreset.plugins,
    (p) => p.grafserv?.middlewares,
    (name, fn, _plugin) => {
      middlewares.register(name, fn as any);
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
      // Backwards compatibility with the old hooks
      switch (name) {
        case "init": {
          middlewares.register("setPreset", (next, event) => {
            const { resolvedPreset } = event;
            const result = fn({ resolvedPreset }, event);
            return resultThenNext(result, next);
          });
          break;
        }
        case "ruruHTMLParts": {
          middlewares.register("ruruHTMLParts", (next, event) => {
            const { resolvedPreset, request, htmlParts } = event;
            const result = fn({ resolvedPreset }, htmlParts, {
              request,
            });
            return resultThenNext(result, next);
          });
          break;
        }
        case "processGraphQLRequestBody": {
          middlewares.register("processGraphQLRequestBody", (next, event) => {
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
    resolvedPreset[$$middleware] = middlewares;
  } catch {
    // Ignore - preset must be readonly
  }
  return middlewares;
}
