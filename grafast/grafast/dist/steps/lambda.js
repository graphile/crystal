"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LambdaStep = void 0;
exports.lambda = lambda;
const multistep_js_1 = require("../multistep.js");
const step_js_1 = require("../step.js");
const sideEffect_js_1 = require("./sideEffect.js");
/**
 * Calls the given lambda function for each tuple
 */
class LambdaStep extends step_js_1.UnbatchedStep {
    static { this.$$export = {
        moduleName: "grafast",
        exportName: "LambdaStep",
    }; }
    constructor($plan, fn) {
        super();
        this.fn = fn;
        // Lambda is only sync and safe if the callback is; so default to false
        this.isSyncAndSafe = false;
        this.allowMultipleOptimizations = true;
        this.depId = $plan != null ? this.addDependency($plan) : null;
        if (fn.hasSideEffects) {
            this.hasSideEffects = true;
        }
        else if (fn.isSyncAndSafe) {
            if (fn.constructor.name === "AsyncFunction") {
                throw new Error(`${this}'s callback claims to be syncAndSafe, however it is asynchronous`);
            }
            this.isSyncAndSafe = true;
        }
    }
    toStringMeta() {
        return this.fn.displayName || this.fn.name;
    }
    deduplicate(peers) {
        return peers.filter((peer) => peer.fn === this.fn);
    }
    unbatchedExecute(_extra, value) {
        return this.fn(value);
    }
}
exports.LambdaStep = LambdaStep;
/**
 * A plan that takes the input `$plan` and feeds each value through the `fn`
 * callback. Note: if you need to pass more than one value, pass a `ListStep`
 * as the `$plan` argument.
 */
function lambda(spec, fn, isSyncAndSafe = false) {
    if (fn.length > 1) {
        throw new Error("lambda callback should accept one argument, perhaps you forgot to destructure the arguments?");
    }
    const $in = (0, multistep_js_1.multistep)(spec);
    const $lambda = new LambdaStep($in, fn);
    if (fn.hasSideEffects) {
        console.trace(`You passed a function with \`hasSideEffects = true\` to \`lambda()\`, you should use \`sideEffect()\` instead (it has the same signature). We've automatically corrected this, but you should fix it in your code so the types are correct.`);
        return (0, sideEffect_js_1.sideEffect)(spec, fn);
    }
    if (isSyncAndSafe) {
        if (fn.constructor.name === "AsyncFunction") {
            throw new Error(`lambda call claims to be syncAndSafe, however the callback function is asynchronous`);
        }
        $lambda.isSyncAndSafe = true;
    }
    return $lambda;
}
//# sourceMappingURL=lambda.js.map