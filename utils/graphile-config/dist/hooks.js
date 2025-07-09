"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyHooks = exports.AsyncHooks = void 0;
const functionality_js_1 = require("./functionality.js");
const isDev = typeof process !== "undefined" && process.env.GRAPHILE_ENV === "development";
class AsyncHooks {
    constructor() {
        this.callbacks = Object.create(null);
    }
    hook(event, fn) {
        this.callbacks[event] = this.callbacks[event] || [];
        this.callbacks[event].push(fn);
    }
    /**
     * Hooks can _mutate_ the argument, they cannot return a replacement. This
     * allows us to completely side-step the problem of recursive calls.
     */
    process(hookName, ...args) {
        const callbacks = this.callbacks[hookName];
        if (!callbacks) {
            return;
        }
        const l = callbacks.length;
        let chain = undefined;
        for (let i = 0; i < l; i++) {
            const callback = callbacks[i];
            if (chain !== undefined) {
                chain = chain.then(() => callback.apply(null, args));
            }
            else {
                const result = callback.apply(null, args);
                if (result != null) {
                    if (isDev && typeof result.then !== "function") {
                        throw new Error(`Hook '${hookName}' returned invalid value of type ${typeof result} - must be 'undefined' or a Promise/PromiseLike.`);
                    }
                    chain = result;
                }
            }
        }
        return chain;
    }
}
exports.AsyncHooks = AsyncHooks;
/** @deprecated Use `orderedApply` */
exports.applyHooks = functionality_js_1.orderedApply;
//# sourceMappingURL=hooks.js.map