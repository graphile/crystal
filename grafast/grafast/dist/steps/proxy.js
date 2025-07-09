"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyStep = void 0;
exports.proxy = proxy;
const interfaces_js_1 = require("../interfaces.js");
const step_js_1 = require("../step.js");
const utils_js_1 = require("../utils.js");
/**
 * @experimental
 *
 * Never build this class directly.
 */
class ProxyStep extends step_js_1.UnbatchedStep {
    static { this.$$export = {
        moduleName: "grafast",
        exportName: "ProxyStep",
    }; }
    constructor($dep, $actualDep) {
        super();
        this.isSyncAndSafe = true;
        // Do not proxy stream requests
        this.stream = undefined;
        this.$depId = $dep.id;
        this.addDependency($actualDep);
    }
    toStringMeta() {
        const $dep = this.operationPlan.dangerouslyGetStep(this.$depId);
        return $dep.toString();
    }
    // Publicly expose this
    addDependency(step) {
        return super.addDependency(step);
    }
    execute({ count, values: [values0], }) {
        return values0.isBatch
            ? values0.entries
            : (0, utils_js_1.arrayOfLength)(count, values0.value);
    }
    unbatchedExecute(_extra, value) {
        return value;
    }
}
exports.ProxyStep = ProxyStep;
function makeProxyHandler($toStep) {
    return {
        // $proxy - the ProxyStep instance
        // p - the property being accessed
        // proxy - the `new Proxy($proxy, ...)`
        get($proxy, p, proxy) {
            // Do not deduplicate the proxy-ness away!
            if (p === "deduplicate") {
                return () => [proxy];
            }
            // DO optimize the proxy-ness away, so execution doesn't need to be proxied
            if (p === "optimize") {
                delete $proxy[interfaces_js_1.$$proxy];
                return () => [$proxy];
            }
            if (p in $proxy) {
                // $proxy has this property ('id', 'layerPlan', etc) - use it
                const val = $proxy[p];
                if (typeof val === "function") {
                    return function (...args) {
                        return val.apply($proxy, args);
                    };
                }
                else {
                    return val;
                }
            }
            else {
                // $proxy doesn't understand this - delegate to $toStep
                const val = $toStep[p];
                if (typeof val === "function") {
                    return function (...args) {
                        return val.apply($toStep, args);
                    };
                }
                else {
                    return val;
                }
            }
        },
        has($proxy, p) {
            if (p in $proxy) {
                return true;
            }
            else {
                return p in $toStep;
            }
        },
        set($proxy, p, newValue, receiver) {
            if (p in $proxy) {
                return Reflect.set($proxy, p, newValue, receiver);
            }
            else {
                throw new Error(`Setting through a ProxyStep is currently forbidden (attempted to set '${String(p)}' on '${$proxy}'`);
            }
        },
        getPrototypeOf(_$proxy) {
            return Object.getPrototypeOf($toStep);
        },
    };
}
/**
 * @experimental
 *
 * This could change at any time, may impact performance, and just, generally,
 * needs more work. You shouldn't need this in the vast majority of cases.
 */
function proxy($step, $actualDep = $step) {
    const $proxy = new ProxyStep($step, $actualDep);
    const proxy = new Proxy($proxy, makeProxyHandler($step)); // Lie.
    $proxy[interfaces_js_1.$$proxy] = proxy;
    return proxy;
}
//# sourceMappingURL=proxy.js.map