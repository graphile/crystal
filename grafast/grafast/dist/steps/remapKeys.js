"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemapKeysStep = void 0;
exports.remapKeys = remapKeys;
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/ban-types */
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const tamedevil_1 = tslib_1.__importStar(require("tamedevil"));
const step_js_1 = require("../step.js");
const utils_js_1 = require("../utils.js");
function makeMapper(actualKeyByDesiredKey, callback) {
    const entries = Object.entries(actualKeyByDesiredKey);
    if (entries.every(([key, val]) => (0, tamedevil_1.isSafeObjectPropertyName)(key) && (0, tamedevil_1.isSafeObjectPropertyName)(val))) {
        // We can do a fast custom conversion
        return tamedevil_1.default.runInBatch((0, tamedevil_1.default) `(function(obj) {
  return (obj == null ? obj : { ${tamedevil_1.default.join(entries.map(([key, val]) => (0, tamedevil_1.default) `${tamedevil_1.default.safeKeyOrThrow(key)}: obj${tamedevil_1.default.get(val)}`), ", ")} });
})`, callback);
    }
    // Fallback to slow conversion
    return callback((obj) => {
        if (obj == null) {
            return obj;
        }
        return Object.keys(actualKeyByDesiredKey).reduce((memo, desiredKey) => {
            memo[desiredKey] = obj[actualKeyByDesiredKey[desiredKey]];
            return memo;
        }, Object.create(null));
    });
}
/**
 * A plan that returns an object resulting from extracting the given
 * `actualKey` from the input and storing it as the `desiredKey` in the output.
 */
class RemapKeysStep extends step_js_1.UnbatchedStep {
    static { this.$$export = {
        moduleName: "grafast",
        exportName: "RemapKeysStep",
    }; }
    constructor($plan, actualKeyByDesiredKey) {
        super();
        this.actualKeyByDesiredKey = actualKeyByDesiredKey;
        this.isSyncAndSafe = true;
        this.allowMultipleOptimizations = true;
        this.addDependency($plan);
        this.peerKey = (0, utils_js_1.digestKeys)([
            ...Object.keys(this.actualKeyByDesiredKey),
            ...Object.values(this.actualKeyByDesiredKey),
        ]);
    }
    toStringMeta() {
        return (chalk_1.default.bold.yellow(String(this.dependencies[0].id)) +
            ":" +
            JSON.stringify(this.actualKeyByDesiredKey));
    }
    optimize() {
        for (const [key, val] of Object.entries(this.actualKeyByDesiredKey)) {
            if (String(key) !== String(val)) {
                return this;
            }
        }
        // If we're not actually remapping, just return the parent
        return this.getDep(0);
    }
    finalize() {
        makeMapper(this.actualKeyByDesiredKey, (fn) => {
            this.mapper = fn;
        });
        super.finalize();
    }
    execute({ count, values: [values0], }) {
        return values0.isBatch
            ? values0.entries.map(this.mapper)
            : new Array(count).fill(this.mapper(values0.value));
    }
    unbatchedExecute(_extra, value) {
        return this.mapper(value);
    }
    deduplicate(peers) {
        // Handled by peerKey
        return peers;
    }
}
exports.RemapKeysStep = RemapKeysStep;
/**
 * A plan that returns an object resulting from extracting the given
 * `actualKey` from the input and storing it as the `desiredKey` in the output.
 */
function remapKeys($step, actualKeyByDesiredKey) {
    return new RemapKeysStep($step, actualKeyByDesiredKey);
}
//# sourceMappingURL=remapKeys.js.map