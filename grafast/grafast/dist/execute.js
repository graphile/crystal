"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withGrafastArgs = withGrafastArgs;
exports.execute = execute;
const tslib_1 = require("tslib");
const eventemitter3_1 = tslib_1.__importDefault(require("eventemitter3"));
const dev_js_1 = require("./dev.js");
const inspect_js_1 = require("./inspect.js");
const interfaces_js_1 = require("./interfaces.js");
const middleware_js_1 = require("./middleware.js");
const prepare_js_1 = require("./prepare.js");
const utils_js_1 = require("./utils.js");
/**
 * Used by `execute` and `subscribe`.
 * @internal
 */
function withGrafastArgs(args) {
    const options = args.resolvedPreset?.grafast;
    if (dev_js_1.isDev) {
        if (args.rootValue != null &&
            (typeof args.rootValue !== "object" ||
                Object.keys(args.rootValue).length > 0)) {
            throw new Error(`Grafast executor doesn't support there being a rootValue (found ${(0, inspect_js_1.inspect)(args.rootValue)})`);
        }
    }
    if (args.rootValue == null) {
        args.rootValue = Object.create(null);
    }
    if (typeof args.rootValue !== "object" || args.rootValue == null) {
        throw new Error("Grafast requires that the 'rootValue' be an object");
    }
    const explain = options?.explain;
    const shouldExplain = !!explain;
    let unlisten = null;
    if (shouldExplain) {
        const eventEmitter = new eventemitter3_1.default();
        const explainOperations = [];
        args.rootValue = Object.assign(Object.create(null), args.rootValue, {
            [interfaces_js_1.$$eventEmitter]: eventEmitter,
            [interfaces_js_1.$$extensions]: {
                explain: {
                    operations: explainOperations,
                },
            },
        });
        const handleExplainOperation = ({ operation, }) => {
            if (explain === true || (explain && explain.includes(operation.type))) {
                explainOperations.push(operation);
            }
        };
        eventEmitter.on("explainOperation", handleExplainOperation);
        unlisten = () => {
            eventEmitter.removeListener("explainOperation", handleExplainOperation);
        };
    }
    const rootValue = (0, prepare_js_1.grafastPrepare)(args, {
        explain: options?.explain,
        timeouts: options?.timeouts,
        // TODO: Delete this
        outputDataAsString: args.outputDataAsString,
    });
    if (unlisten !== null) {
        Promise.resolve(rootValue).then(unlisten, unlisten);
    }
    // Convert from PromiseOrDirect to PromiseOrValue
    if ((0, utils_js_1.isPromiseLike)(rootValue)) {
        return Promise.resolve(rootValue);
    }
    else {
        return rootValue;
    }
}
function execute(args, legacyResolvedPreset, legacyOutputDataAsString) {
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
        return middleware.run("execute", { args }, executeMiddlewareCallback);
    }
    else {
        return withGrafastArgs(args);
    }
}
const executeMiddlewareCallback = (event) => withGrafastArgs(event.args);
//# sourceMappingURL=execute.js.map