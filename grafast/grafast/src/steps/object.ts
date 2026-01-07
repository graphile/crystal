// import debugFactory from "debug";

import { isDev } from "../dev.js";
import type {
  DataFromStep,
  ExecutionDetails,
  ExecutionExtra,
  StepOptimizeOptions,
  UnbatchedExecutionExtra,
} from "../interfaces.js";
import type { Step } from "../step.js";
import { UnbatchedStep } from "../step.js";
import { isSafeObjectPropertyName } from "../tamedevilUtils";
import { digestKeys } from "../utils.js";
import { constant, ConstantStep } from "./constant.js";

const DEFAULT_CACHE_SIZE = 100;

const EMPTY_OBJECT = Object.freeze(Object.create(null));

// const debugObjectPlan = debugFactory("grafast:ObjectStep");
// const debugObjectPlanVerbose = debugObjectPlan.extend("verbose");

export type DataFromObjectSteps<TSteps extends { [key: string]: Step }> = {
  [key in keyof TSteps]: DataFromStep<TSteps[key]>;
};
type Results<TSteps extends { [key: string]: Step }> = Array<
  [
    Array<DataFromObjectSteps<TSteps>[keyof TSteps]>,
    DataFromObjectSteps<TSteps>,
  ]
>;

export interface ObjectPlanMeta<TSteps extends { [key: string]: Step }> {
  results: Results<TSteps>;
}

interface ObjectStepCacheConfig {
  identifier?: string;
  cacheSize?: number;
}

/**
 * A plan that represents an object using the keys given and the values being
 * the results of the associated plans.
 */
export class ObjectStep<
  TPlans extends { [key: string]: Step } = {
    [key: string]: Step;
  },
> extends UnbatchedStep<DataFromObjectSteps<TPlans>> {
  static $$export = {
    moduleName: "grafast",
    exportName: "ObjectStep",
  };
  isSyncAndSafe = true;
  allowMultipleOptimizations = true;
  private readonly keys: ReadonlyArray<keyof TPlans & string> = [];

  // Optimize needs the same 'meta' for all ObjectSteps
  optimizeMetaKey = "ObjectStep";
  private cacheSize: number;

  constructor(
    obj: TPlans,
    private cacheConfig?: ObjectStepCacheConfig,
  ) {
    super();
    this.cacheSize =
      cacheConfig?.cacheSize ??
      (cacheConfig?.identifier ? DEFAULT_CACHE_SIZE : 0);

    const keys = Object.keys(obj);
    this._setKeys(keys);
    for (let i = 0, l = this.keys.length; i < l; i++) {
      this.addDependency({ step: obj[keys[i]], skipDeduplication: true });
    }
  }

  private _setKeys(keys: ReadonlyArray<keyof TPlans & string>) {
    (this.keys as readonly string[]) = keys;
    this.peerKey = digestKeys(keys);
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
  public set<TKey extends keyof TPlans>(key: TKey, plan: TPlans[TKey]): void {
    this._setKeys([...this.keys, key as keyof TPlans & string]);
    this.addDependency({ step: plan, skipDeduplication: true });
  }

  getStepForKey<TKey extends keyof TPlans>(key: TKey): TPlans[TKey];
  getStepForKey<TKey extends keyof TPlans>(
    key: TKey,
    allowMissing: true,
  ): TPlans[TKey] | null;
  getStepForKey<TKey extends keyof TPlans>(
    key: TKey,
    allowMissing = false,
  ): TPlans[TKey] | null {
    const idx = this.keys.indexOf(key as string);
    if (idx < 0) {
      if (!allowMissing) {
        throw new Error(
          `${this}: failed to retrieve plan for key '${String(
            key,
          )}' - we have no such key`,
        );
      }
      return null;
    }
    return this.getDepOptions<TPlans[TKey]>(idx).step;
  }

  toStringMeta(): string {
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
    const newObj = this.keys.reduce(
      (memo, key, i) => {
        memo[key] = tuple[i];
        return memo;
      },
      Object.create(null) as Partial<DataFromObjectSteps<TPlans>>,
    ) as DataFromObjectSteps<TPlans>;

    // Cache newObj so the same tuple values result in the exact same object.
    meta.results.push([tuple, newObj]);
    return newObj;
  }
  */

  tupleToObjectJIT(
    callback: (
      fn: (
        extra: ExecutionExtra,
        ...tuple: Array<DataFromObjectSteps<TPlans>[keyof TPlans]>
      ) => DataFromObjectSteps<TPlans>,
    ) => void,
  ): void {
    const keysAreSafe = this.keys.every(isSafeObjectPropertyName);
    // Optimize common cases
    if (keysAreSafe) {
      if (this.cacheSize === 0 || this.keys.length === 0) {
        switch (this.keys.length) {
          case 0: {
            return callback(() => EMPTY_OBJECT);
          }
          case 1: {
            const [k0] = this.keys;
            return callback((_, val0) => ({ [k0]: val0 }) as any);
          }
          case 2: {
            const [k0, k1] = this.keys;
            return callback(
              (_, val0, val1) => ({ [k0]: val0, [k1]: val1 }) as any,
            );
          }
          case 3: {
            const [k0, k1, k2] = this.keys;
            return callback(
              (_, val0, val1, val2) =>
                ({ [k0]: val0, [k1]: val1, [k2]: val2 }) as any,
            );
          }
          case 4: {
            const [k0, k1, k2, k3] = this.keys;
            return callback(
              (_, val0, val1, val2, val3) =>
                ({ [k0]: val0, [k1]: val1, [k2]: val2, [k3]: val3 }) as any,
            );
          }
          case 5: {
            const [k0, k1, k2, k3, k4] = this.keys;
            return callback(
              (_, val0, val1, val2, val3, val4) =>
                ({
                  [k0]: val0,
                  [k1]: val1,
                  [k2]: val2,
                  [k3]: val3,
                  [k4]: val4,
                }) as any,
            );
          }
          case 6: {
            const [k0, k1, k2, k3, k4, k5] = this.keys;
            return callback(
              (_, val0, val1, val2, val3, val4, val5) =>
                ({
                  [k0]: val0,
                  [k1]: val1,
                  [k2]: val2,
                  [k3]: val3,
                  [k4]: val4,
                  [k5]: val5,
                }) as any,
            );
          }
        }
      } else {
        const maxIdx = this.cacheSize - 1;
        switch (this.keys.length) {
          case 1: {
            const [k0] = this.keys;
            return callback((extra, val0) => {
              const meta = extra.meta as { nextIndex?: number; results: any[] };
              if (meta.nextIndex == null) {
                meta.nextIndex = 0;
                meta.results = [];
              } else {
                const cacheLen = meta.results.length;
                for (let cacheIdx = 0; cacheIdx < cacheLen; cacheIdx++) {
                  const [cache0, obj] = meta.results[cacheIdx];
                  if (cache0 === val0) {
                    return obj;
                  }
                }
              }

              const obj = { [k0]: val0 } as any;

              meta.results[meta.nextIndex] = [val0, obj];
              // Only cache `this.cacheSize` results, use a round-robin
              meta.nextIndex =
                meta.nextIndex >= maxIdx ? 0 : meta.nextIndex + 1;

              return obj;
            });
          }
          case 2: {
            const [k0, k1] = this.keys;
            return callback((extra, val0, val1) => {
              const meta = extra.meta as { nextIndex?: number; results: any[] };
              if (meta.nextIndex == null) {
                meta.nextIndex = 0;
                meta.results = [];
              } else {
                const cacheLen = meta.results.length;
                for (let cacheIdx = 0; cacheIdx < cacheLen; cacheIdx++) {
                  const [cache0, cache1, obj] = meta.results[cacheIdx];
                  if (cache0 === val0 && cache1 === val1) {
                    return obj;
                  }
                }
              }

              const obj = { [k0]: val0, [k1]: val1 } as any;

              meta.results[meta.nextIndex] = [val0, val1, obj];
              // Only cache `this.cacheSize` results, use a round-robin
              meta.nextIndex =
                meta.nextIndex >= maxIdx ? 0 : meta.nextIndex + 1;

              return obj;
            });
          }
        }
      }
    }
    const keys = this.keys;
    const keyCount = keys.length;
    if (this.cacheSize > 0) {
      // NOTE: `peerKey` ensures that the keys match, so we only need to check values
      return callback((extra, ...vals) => {
        const meta = extra.meta as { nextIndex?: number; results: any[] };
        if (meta.nextIndex != null) {
          nextMetaResult: for (
            let metaResultIndex = 0, metaResultLength = meta.results.length;
            metaResultIndex < metaResultLength;
            metaResultIndex++
          ) {
            const [cacheValues, obj] = meta.results[metaResultIndex];
            for (let keyIndex = 0; keyIndex < keyCount; keyIndex++) {
              if (cacheValues[keyIndex] !== vals[keyIndex]) {
                continue nextMetaResult;
              }
            }
            return obj;
          }
        } else {
          meta.nextIndex = 0;
          meta.results = [];
        }

        const obj = Object.create(null);
        for (let keyIndex = 0; keyIndex < keyCount; keyIndex++) {
          obj[keys[keyIndex]] = vals[keyIndex];
        }

        meta.results[meta.nextIndex] = [vals, obj];
        // Only cache `this.cacheSize` results, use a round-robin
        meta.nextIndex =
          meta.nextIndex >= this.cacheSize - 1 ? 0 : meta.nextIndex + 1;

        return obj;
      });
    } else {
      return callback((_, ...values) => {
        const obj = Object.create(null);
        for (let keyIndex = 0; keyIndex < keyCount; keyIndex++) {
          obj[keys[keyIndex]] = values[keyIndex];
        }
        return obj;
      });
    }
  }

  finalize() {
    this.tupleToObjectJIT((fn) => {
      this.unbatchedExecute = fn;
    });
    return super.finalize();
  }

  execute({
    indexMap,
    values,
    extra,
  }: ExecutionDetails<
    Array<DataFromObjectSteps<TPlans>[keyof TPlans]>
  >): ReadonlyArray<DataFromObjectSteps<TPlans>> {
    return indexMap((i) =>
      this.unbatchedExecute!(extra, ...values.map((v) => v.at(i))),
    );
  }

  unbatchedExecute(_extra: UnbatchedExecutionExtra, ..._values: any[]): any {
    throw new Error(`${this} didn't finalize? No unbatchedExecute method.`);
  }

  deduplicate(peers: ObjectStep<any>[]): ObjectStep<TPlans>[] {
    // Managed through peerKey
    return peers;
  }

  optimize(opts: StepOptimizeOptions) {
    if (this.dependencies.every((dep) => dep instanceof ConstantStep)) {
      // Replace self with constant

      // We'll cache so that the constants can be more easily deduplicated
      const meta = opts.meta as Record<string, Record<string, any>[]>;
      const keysJoined = JSON.stringify(this.keys);
      if (!meta[keysJoined]) {
        meta[keysJoined] = [];
      }
      const existing = meta[keysJoined].find((existingObj) =>
        this.keys.every(
          (key, i) =>
            existingObj[key] ===
            (this.dependencies[i] as ConstantStep<any>).data,
        ),
      );
      const isSensitive = this.dependencies.some(
        (d) => (d as ConstantStep<any>).isSensitive,
      );
      if (existing !== undefined) {
        return constant(existing, isSensitive);
      } else {
        const obj = Object.create(null);
        for (let i = 0, l = this.keys.length; i < l; i++) {
          const key = this.keys[i];
          const value = (this.dependencies[i] as ConstantStep<any>).data;
          obj[key] = value;
        }
        meta[keysJoined].push(obj);
        return constant(obj, isSensitive);
      }
    }
    return this;
  }

  __inferGet?: TPlans;
  /**
   * Get the original plan with the given key back again.
   */
  get<TKey extends keyof TPlans>(key: TKey): TPlans[TKey] {
    const index = this.keys.indexOf(key as string);
    if (index < 0) {
      if (isDev) {
        // TODO: move this to diagnostics
        console.warn(
          `${this} doesn't have key '${String(
            key,
          )}'; supported keys: '${this.keys.join("', '")}'`,
        );
      }
      return constant(undefined) as any;
    }
    return this.getDepOptions<TPlans[TKey]>(index).step;
  }
}

/**
 * A plan that represents an object using the keys given and the values being
 * the results of the associated plans.
 */
export function object<TPlans extends { [key: string]: Step }>(
  obj: TPlans,
  cacheConfig?: ObjectStepCacheConfig,
): ObjectStep<TPlans> {
  return new ObjectStep<TPlans>(obj, cacheConfig);
}
