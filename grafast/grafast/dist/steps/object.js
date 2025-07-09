"use strict";
// import debugFactory from "debug";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectStep = void 0;
exports.object = object;
const tslib_1 = require("tslib");
const tamedevil_1 = tslib_1.__importStar(require("tamedevil"));
const step_js_1 = require("../step.js");
const utils_js_1 = require("../utils.js");
const constant_js_1 = require("./constant.js");
const DEFAULT_CACHE_SIZE = 100;
const EMPTY_OBJECT = Object.freeze(Object.create(null));
/**
 * A plan that represents an object using the keys given and the values being
 * the results of the associated plans.
 */
class ObjectStep extends step_js_1.UnbatchedStep {
    static { this.$$export = {
        moduleName: "grafast",
        exportName: "ObjectStep",
    }; }
    constructor(obj, cacheConfig) {
        super();
        this.cacheConfig = cacheConfig;
        this.isSyncAndSafe = true;
        this.allowMultipleOptimizations = true;
        this.keys = [];
        // Optimize needs the same 'meta' for all ObjectSteps
        this.optimizeMetaKey = "ObjectStep";
        this.cacheSize =
            cacheConfig?.cacheSize ??
                (cacheConfig?.identifier ? DEFAULT_CACHE_SIZE : 0);
        const keys = Object.keys(obj);
        this._setKeys(keys);
        for (let i = 0, l = this.keys.length; i < l; i++) {
            this.addDependency({ step: obj[keys[i]], skipDeduplication: true });
        }
    }
    _setKeys(keys) {
        this.keys = keys;
        this.peerKey = (0, utils_js_1.digestKeys)(keys);
        this.metaKey =
            this.cacheSize <= 0
                ? undefined
                : this.cacheConfig?.identifier
                    ? `object|${this.peerKey}|${this.cacheConfig.identifier}`
                    : this.id;
    }
    /**
     * This key doesn't get typed, but it can be added later which can be quite
     * handy.
     */
    set(key, plan) {
        this._setKeys([...this.keys, key]);
        this.addDependency({ step: plan, skipDeduplication: true });
    }
    getStepForKey(key, allowMissing = false) {
        const idx = this.keys.indexOf(key);
        if (idx < 0) {
            if (!allowMissing) {
                throw new Error(`${this}: failed to retrieve plan for key '${String(key)}' - we have no such key`);
            }
            return null;
        }
        return this.getDepOptions(idx).step;
    }
    toStringMeta() {
        return "{" + this.keys.join(",") + "}";
    }
    /*
    tupleToObject(
      meta: ObjectPlanMeta<TPlans>,
      ...tuple: Array<DataFromObjectSteps<TPlans>[keyof TPlans]>
    ): DataFromObjectSteps<TPlans> {
      // Note: `outerloop` is a JavaScript "label". They are not very common.
      // First look for an existing match:
      outerloop: for (let i = 0, l = meta.results.length; i < l; i++) {
        const [values, obj] = meta.results[i];
        // Slow loop over each value in the tuples; this is not expected to be a
        // particularly big loop, typically only 2-5 keys.
        for (let j = 0, m = this.keys.length; j < m; j++) {
          if (values[j] !== tuple[j]) {
            // This isn't a match; try the next record in the outer loop
            continue outerloop;
          }
        }
        return obj;
      }
  
      // That failed; create a new object.
      debugObjectPlanVerbose(
        "%s: Could not find cache for keys %c values %c, constructing new object",
        this,
        this.keys,
        tuple,
      );
      const newObj = this.keys.reduce((memo, key, i) => {
        memo[key] = tuple[i];
        return memo;
      }, {} as Partial<DataFromObjectSteps<TPlans>>) as DataFromObjectSteps<TPlans>;
  
      // Cache newObj so the same tuple values result in the exact same object.
      meta.results.push([tuple, newObj]);
      return newObj;
    }
    */
    tupleToObjectJIT(callback) {
        if (this.keys.length === 0) {
            // Shortcut simple case
            return callback(() => EMPTY_OBJECT);
        }
        const keysAreSafe = this.keys.every(tamedevil_1.isSafeObjectPropertyName);
        const inner = keysAreSafe
            ? (0, tamedevil_1.default) `\
  const newObj = {
${tamedevil_1.default.join(this.keys.map((key, i) => (0, tamedevil_1.default) `    ${tamedevil_1.default.safeKeyOrThrow(key)}: ${tamedevil_1.default.identifier(`val${i}`)}`), ",\n")}
  };
`
            : (0, tamedevil_1.default) `\
  const newObj = Object.create(null);
${tamedevil_1.default.join(this.keys.map((key, i) => (0, tamedevil_1.default) `  newObj${tamedevil_1.default.set(key, true)} = ${tamedevil_1.default.identifier(`val${i}`)};\n`), "")}\
`;
        const vals = tamedevil_1.default.join(this.keys.map((_k, i) => tamedevil_1.default.identifier(`val${i}`)), ", ");
        if (this.cacheSize > 0) {
            return tamedevil_1.default.runInBatch((0, tamedevil_1.default) `\
(function ({ meta }, ${vals}) {
  if (meta.nextIndex != null) {
    for (let i = 0, l = meta.results.length; i < l; i++) {
      const [values, obj] = meta.results[i];
      if (${tamedevil_1.default.join(this.keys.map((_key, i) => (0, tamedevil_1.default) `values[${tamedevil_1.default.lit(i)}] === ${tamedevil_1.default.identifier(`val${i}`)}`), " && ")}) {
        return obj;
      }
    }
  } else {
    meta.nextIndex = 0;
    meta.results = [];
  }
${inner}
  meta.results[meta.nextIndex] = [[${tamedevil_1.default.join(this.keys.map((_key, i) => tamedevil_1.default.identifier(`val${i}`)), ",")}], newObj];
  // Only cache ${tamedevil_1.default.lit(this.cacheSize)} results, use a round-robin
  meta.nextIndex = meta.nextIndex === ${tamedevil_1.default.lit(this.cacheSize - 1)} ? 0 : meta.nextIndex + 1;
  return newObj;
})`, callback);
        }
        else {
            return tamedevil_1.default.runInBatch((0, tamedevil_1.default) `\
(function (_, ${vals}) {
${inner}
  return newObj;
})`, callback);
        }
    }
    finalize() {
        this.tupleToObjectJIT((fn) => {
            this.unbatchedExecute = fn;
        });
        return super.finalize();
    }
    execute({ indexMap, values, extra, }) {
        return indexMap((i) => this.unbatchedExecute(extra, ...values.map((v) => v.at(i))));
    }
    unbatchedExecute(_extra, ..._values) {
        throw new Error(`${this} didn't finalize? No unbatchedExecute method.`);
    }
    deduplicate(peers) {
        // Managed through peerKey
        return peers;
    }
    optimize(opts) {
        if (this.dependencies.every((dep) => dep instanceof constant_js_1.ConstantStep)) {
            // Replace self with constant
            // We'll cache so that the constants can be more easily deduplicated
            const meta = opts.meta;
            const keysJoined = this.keys.join(",");
            if (!meta[keysJoined]) {
                meta[keysJoined] = [];
            }
            const existing = meta[keysJoined].find((existingObj) => this.keys.every((key, i) => existingObj[key] ===
                this.dependencies[i].data));
            const isSensitive = this.dependencies.some((d) => d.isSensitive);
            if (existing !== undefined) {
                return (0, constant_js_1.constant)(existing, isSensitive);
            }
            else {
                const obj = Object.create(null);
                for (let i = 0, l = this.keys.length; i < l; i++) {
                    const key = this.keys[i];
                    const value = this.dependencies[i].data;
                    obj[key] = value;
                }
                meta[keysJoined].push(obj);
                return (0, constant_js_1.constant)(obj, isSensitive);
            }
        }
        return this;
    }
    /**
     * Get the original plan with the given key back again.
     */
    get(key) {
        const index = this.keys.indexOf(key);
        if (index < 0) {
            throw new Error(`This ObjectStep doesn't have key '${String(key)}'; supported keys: '${this.keys.join("', '")}'`);
        }
        return this.getDepOptions(index).step;
    }
}
exports.ObjectStep = ObjectStep;
/**
 * A plan that represents an object using the keys given and the values being
 * the results of the associated plans.
 */
function object(obj, cacheConfig) {
    return new ObjectStep(obj, cacheConfig);
}
//# sourceMappingURL=object.js.map