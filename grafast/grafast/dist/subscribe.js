"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribe = subscribe;
const execute_js_1 = require("./execute.js");
const middleware_js_1 = require("./middleware.js");
function subscribe(args, legacyResolvedPreset, legacyOutputDataAsString) {
    // TODO: remove legacy compatibility
    if (legacyResolvedPreset !== undefined) {
        args.resolvedPreset = legacyResolvedPreset;
    }
    if (legacyOutputDataAsString !== undefined) {
        args.outputDataAsString = legacyOutputDataAsString;
    }
    const { resolvedPreset } = args;
    const middleware = args.middleware === undefined && resolvedPreset != null
        ? (0, middleware_js_1.getGrafastMiddleware)(resolvedPreset)
        : (args.middleware ?? null);
    if (args.middleware === undefined) {
        args.middleware = middleware;
    }
    if (middleware !== null) {
        return middleware.run("subscribe", { args }, subscribeMiddlewareCallback);
    }
    else {
        return (0, execute_js_1.withGrafastArgs)(args);
    }
}
const subscribeMiddlewareCallback = (event) => (0, execute_js_1.withGrafastArgs)(event.args);
//# sourceMappingURL=subscribe.js.map