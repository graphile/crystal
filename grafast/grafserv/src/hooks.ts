import { isPromiseLike } from "grafast";
import type { MiddlewareNext } from "graphile-config";
import { applyHooks, Middlewares } from "graphile-config";

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
  const hooks = new Middlewares<GraphileConfig.GrafservMiddlewares>();
  applyHooks(
    resolvedPreset.plugins,
    (p) => p.grafserv?.middlewares,
    (name, fn, _plugin) => {
      hooks.register(name, fn as any);
    },
  );

  // TODO: Delete this backwards compatibility
  applyHooks(
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
          hooks.register("setPreset", (next, event) => {
            const { resolvedPreset } = event;
            const result = fn({ resolvedPreset }, event);
            return resultThenNext(result, next);
          });
          break;
        }
        case "ruruHTMLParts": {
          hooks.register("ruruHTMLParts", (next, event) => {
            const { resolvedPreset, request, htmlParts } = event;
            const result = fn({ resolvedPreset }, htmlParts, {
              request,
            });
            return resultThenNext(result, next);
          });
          break;
        }
        case "processGraphQLRequestBody": {
          hooks.register("processGraphQLRequestBody", (next, event) => {
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
    resolvedPreset[$$middleware] = hooks;
  } catch {
    // Ignore - preset must be readonly
  }
  return hooks;
}
