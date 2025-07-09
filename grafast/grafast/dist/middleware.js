"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGrafastMiddleware = getGrafastMiddleware;
const graphile_config_1 = require("graphile-config");
const $$middleware = Symbol("middleware");
function getGrafastMiddleware(resolvedPreset) {
    if (resolvedPreset[$$middleware] !== undefined) {
        return resolvedPreset[$$middleware];
    }
    let middleware = null;
    (0, graphile_config_1.orderedApply)(resolvedPreset.plugins, (p) => p.grafast?.middleware, (name, fn, _plugin) => {
        if (!middleware)
            middleware = new graphile_config_1.Middleware();
        middleware.register(name, fn);
    });
    try {
        resolvedPreset[$$middleware] = middleware;
    }
    catch {
        // Ignore - preset must be readonly
    }
    return middleware;
}
//# sourceMappingURL=middleware.js.map