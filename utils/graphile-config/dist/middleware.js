"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Middleware = void 0;
const utils_js_1 = require("./utils.js");
class Middleware {
    constructor() {
        this.middleware = Object.create(null);
    }
    register(activityName, fn) {
        const list = this.middleware[activityName];
        if (list !== undefined) {
            list.push(fn);
        }
        else {
            this.middleware[activityName] = [fn];
        }
    }
    run(activityName, arg, activity) {
        const middleware = this.middleware[activityName];
        if (middleware === undefined) {
            return activity(arg);
        }
        const m = middleware.length - 1;
        return executeMiddleware(activityName, true, middleware, activity, arg, 0, m);
    }
    runSync(activityName, arg, activity) {
        const middleware = this.middleware[activityName];
        if (middleware === undefined) {
            return activity(arg);
        }
        const m = middleware.length - 1;
        return executeMiddleware(activityName, false, middleware, activity, arg, 0, m);
    }
}
exports.Middleware = Middleware;
function executeMiddleware(activityName, allowAsync, middlewareList, activity, arg, idx, maxIdx) {
    const next = makeNext(idx === maxIdx
        ? () => activity(arg)
        : () => executeMiddleware(activityName, allowAsync, middlewareList, activity, arg, idx + 1, maxIdx));
    const middleware = middlewareList[idx];
    const result = middleware(next, arg);
    if (!allowAsync && (0, utils_js_1.isPromiseLike)(result)) {
        throw new Error(`'${String(activityName)}' is a synchronous activity, all middleware must be synchronous but the middleware at index ${idx} returned a promise.`);
    }
    return result;
}
function makeNext(fn) {
    let called = false;
    const next = fn;
    next.callback = (callback) => {
        if (called) {
            throw new Error(`next() was already called; don't call it twice!`);
        }
        called = true;
        let result;
        try {
            result = fn();
        }
        catch (error) {
            return callback(error, undefined);
        }
        if ((0, utils_js_1.isPromiseLike)(result)) {
            return result.then((result) => callback(null, result), callback);
        }
        else {
            return callback(null, result);
        }
    };
    return next;
}
//# sourceMappingURL=middleware.js.map