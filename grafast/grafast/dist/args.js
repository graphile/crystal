"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hookArgs = hookArgs;
const interfaces_js_1 = require("./interfaces.js");
const middleware_js_1 = require("./middleware.js");
const utils_js_1 = require("./utils.js");
const EMPTY_OBJECT = Object.freeze(Object.create(null));
const $$writeTest = Symbol("grafastWriteTest");
/**
 * Applies Graphile Config hooks to your GraphQL request, e.g. to
 * populate context or similar.
 *
 * @experimental
 */
function hookArgs(rawArgs, legacyResolvedPreset, legacyCtx) {
    if (legacyResolvedPreset !== undefined) {
        rawArgs.resolvedPreset = legacyResolvedPreset;
    }
    if (legacyCtx !== undefined) {
        rawArgs.requestContext = rawArgs.requestContext ?? legacyCtx;
    }
    const { middleware: rawMiddleware, resolvedPreset, contextValue: rawContextValue, } = rawArgs;
    try {
        rawContextValue[$$writeTest] = true;
    }
    catch (e) {
        // Make context mutable
        rawArgs.contextValue = Object.assign(Object.create(null), rawContextValue);
    }
    const middleware = rawMiddleware === undefined && resolvedPreset != null
        ? (0, middleware_js_1.getGrafastMiddleware)(resolvedPreset)
        : (rawMiddleware ?? null);
    if (rawMiddleware === undefined) {
        rawArgs.middleware = middleware;
    }
    const args = rawArgs;
    // Assert that args haven't already been hooked
    if (args[interfaces_js_1.$$hooked]) {
        throw new Error("Must not call hookArgs twice!");
    }
    args[interfaces_js_1.$$hooked] = true;
    if (middleware != null) {
        return middleware.run("prepareArgs", { args }, finalizeWithEvent);
    }
    else {
        return finalize(args);
    }
}
function finalize(args) {
    const userContext = args.resolvedPreset?.grafast?.context;
    const contextValue = args.contextValue;
    if (typeof userContext === "function") {
        const result = userContext(args.requestContext ?? EMPTY_OBJECT, args);
        if ((0, utils_js_1.isPromiseLike)(result)) {
            // Deliberately shadowed 'result'
            return result.then((result) => {
                Object.assign(contextValue, result);
                return args;
            });
        }
        else {
            Object.assign(contextValue, result);
            return args;
        }
    }
    else if (typeof userContext === "object" && userContext !== null) {
        Object.assign(contextValue, userContext);
        return args;
    }
    else {
        return args;
    }
}
function finalizeWithEvent(event) {
    return finalize(event.args);
}
//# sourceMappingURL=args.js.map