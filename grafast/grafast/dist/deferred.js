"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defer = defer;
function NOOP() { }
/**
 * Returns a promise that can be `.resolve()`-ed or `.reject()`-ed at a later
 * time.
 */
function defer() {
    let resolve;
    let reject;
    const promise = new Promise((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
    });
    promise.resolve = resolve;
    promise.reject = reject;
    // PERF: this is to avoid unhandledPromiseRejection errors; generally
    // deferred errors are handled at a later time (or can be safely ignored if
    // another error wins). Maybe there's a better way?
    promise.then(null, NOOP);
    return promise;
}
//# sourceMappingURL=deferred.js.map