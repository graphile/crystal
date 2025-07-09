"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGrafservMiddleware = getGrafservMiddleware;
const grafast_1 = require("grafast");
const graphile_config_1 = require("graphile-config");
// We could use a global WeakMap, but storing directly onto the resolvedPreset
// should use more traditional garbage collection.
const $$middleware = Symbol("middleware");
function getGrafservMiddleware(resolvedPreset) {
    if (resolvedPreset[$$middleware]) {
        return resolvedPreset[$$middleware];
    }
    let middleware = null;
    (0, graphile_config_1.orderedApply)(resolvedPreset.plugins, (p) => p.grafserv?.middleware, (name, fn, _plugin) => {
        if (!middleware)
            middleware = new graphile_config_1.Middleware();
        middleware.register(name, fn);
    });
    // TODO: Delete this backwards compatibility
    (0, graphile_config_1.orderedApply)(resolvedPreset.plugins, (p) => p.grafserv?.hooks, (name, fn, _plugin) => {
        function resultThenNext(result, next) {
            if ((0, grafast_1.isPromiseLike)(result)) {
                return result.then(next);
            }
            else {
                return next();
            }
        }
        if (!middleware)
            middleware = new graphile_config_1.Middleware();
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
    });
    try {
        resolvedPreset[$$middleware] = middleware;
    }
    catch {
        // Ignore - preset must be readonly
    }
    return middleware;
}
//# sourceMappingURL=hooks.js.map