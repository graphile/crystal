// import debugFactory from "debug";

import te, { isSafeObjectPropertyName } from "tamedevil";

import type {
  DataFromStep,
  ExecutionDetails,
  ExecutionExtra,
  StepOptimizeOptions,
  UnbatchedExecutionExtra,
} from "../interfaces.js";
import type { ExecutableStep } from "../step.js";
import { UnbatchedExecutableStep } from "../step.js";
import { constant, ConstantStep } from "./constant.js";
import type { SetterCapableStep } from "./setter.js";

const DEFAULT_CACHE_SIZE = 100;

const EMPTY_OBJECT = Object.freeze(Object.create(null));

// const debugObjectPlan = debugFactory("grafast:ObjectStep");
// const debugObjectPlanVerbose = debugObjectPlan.extend("verbose");

export type DataFromObjectSteps<
  TSteps extends { [key: string]: ExecutableStep },
> = {
  [key in keyof TSteps]: DataFromStep<TSteps[key]>;
};
type Results<TSteps extends { [key: string]: ExecutableStep }> = Array<
  [
    Array<DataFromObjectSteps<TSteps>[keyof TSteps]>,
    DataFromObjectSteps<TSteps>,
  ]
>;

export interface ObjectPlanMeta<
  TSteps extends { [key: string]: ExecutableStep },
> {
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
    TPlans extends { [key: string]: ExecutableStep } = {
      [key: string]: ExecutableStep;
    },
  >
  extends UnbatchedExecutableStep<DataFromObjectSteps<TPlans>>
  implements SetterCapableStep<TPlans>
{
  static $$export = {
    moduleName: "grafast",
    exportName: "ObjectStep",
  };
  isSyncAndSafe = true;
  allowMultipleOptimizations = true;
  private readonly keys: ReadonlyArray<keyof TPlans & string> = [];
  private readonly keysString: string = "[]";

  // Optimize needs the same 'meta' for all ObjectSteps
  optimizeMetaKey = "ObjectStep";
  private cacheSize: number;

  constructor(obj: TPlans, cacheConfig?: ObjectStepCacheConfig) {
    super();
    this.cacheSize =
      cacheConfig?.cacheSize ??
      (cacheConfig?.identifier ? DEFAULT_CACHE_SIZE : 0);
    this.metaKey =
      this.cacheSize <= 0
        ? undefined
        : cacheConfig?.identifier
        ? `object|${this.keysString}|${cacheConfig.identifier}`
        : this.id;

    this._setKeys(Object.keys(obj));
    for (let i = 0, l = this.keys.length; i < l; i++) {
      this.addDependency({ step: obj[this.keys[i]], skipDeduplication: true });
    }
  }

  private _setKeys(keys: ReadonlyArray<keyof TPlans & string>) {
    (this.keys as readonly string[]) = keys;
    (this.keysString as string) = JSON.stringify(keys);
    this.peerKey = this.keysString;
  }

  /**
   * This key doesn't get typed, but it can be added later which can be quite
   * handy.
   */
  public set<TKey extends keyof TPlans>(key: TKey, plan: TPlans[TKey]): void {
    this._setKeys([...this.keys, key as keyof TPlans & string]);
    this.addDependency({ step: plan, skipDeduplication: true });
  }

  getStepForKey<TKey extends keyof TPlans>(
    key: TKey,
    allowMissing = false,
  ): TKey extends keyof TPlans ? TPlans[TKey] : null {
    const idx = this.keys.indexOf(key as string);
    if (idx < 0) {
      if (!allowMissing) {
        throw new Error(
          `${this}: failed to retrieve plan for key '${String(
            key,
          )}' - we have no such key`,
        );
      }
      return null as any;
    }
    return this.getDep(idx) as any;
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
    const newObj = this.keys.reduce((memo, key, i) => {
      memo[key] = tuple[i];
      return memo;
    }, {} as Partial<DataFromObjectSteps<TPlans>>) as DataFromObjectSteps<TPlans>;

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
    if (this.keys.length === 0) {
      // Shortcut simple case
      return callback(() => EMPTY_OBJECT);
    }
    const keysAreSafe = this.keys.every(isSafeObjectPropertyName);
    const inner = keysAreSafe
      ? te`\
  const newObj = {
${te.join(
  this.keys.map(
    (key, i) => te`    ${te.safeKeyOrThrow(key)}: ${te.identifier(`val${i}`)}`,
  ),
  ",\n",
)}
  };
`
      : te`\
  const newObj = Object.create(null);
${te.join(
  this.keys.map(
    (key, i) =>
      te`  newObj${te.set(key, true)} = ${te.identifier(`val${i}`)};\n`,
  ),
  "",
)}\
`;
    const vals = te.join(
      this.keys.map((_k, i) => te.identifier(`val${i}`)),
      ", ",
    );
    if (this.cacheSize > 0) {
      return te.runInBatch<Parameters<typeof callback>[0]>(
        te`\
(function ({ meta }, ${vals}) {
  if (meta.nextIndex != null) {
    for (let i = 0, l = meta.results.length; i < l; i++) {
      const [values, obj] = meta.results[i];
      if (${te.join(
        this.keys.map(
          (_key, i) => te`values[${te.lit(i)}] === ${te.identifier(`val${i}`)}`,
        ),
        " && ",
      )}) {
        return obj;
      }
    }
  } else {
    meta.nextIndex = 0;
    meta.results = [];
  }
${inner}
  meta.results[meta.nextIndex] = [[${te.join(
    this.keys.map((_key, i) => te.identifier(`val${i}`)),
    ",",
  )}], newObj];
  // Only cache ${te.lit(this.cacheSize)} results, use a round-robin
  meta.nextIndex = meta.nextIndex === ${te.lit(
    this.cacheSize - 1,
  )} ? 0 : meta.nextIndex + 1;
  return newObj;
})`,
        callback,
      );
    } else {
      return te.runInBatch<Parameters<typeof callback>[0]>(
        te`\
(function (_, ${vals}) {
${inner}
  return newObj;
})`,
        callback,
      );
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
      const keysJoined = this.keys.join(",");
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

  /**
   * Get the original plan with the given key back again.
   */
  get<TKey extends keyof TPlans>(key: TKey): TPlans[TKey] {
    const index = this.keys.indexOf(key as string);
    if (index < 0) {
      throw new Error(
        `This ObjectStep doesn't have key '${String(
          key,
        )}'; supported keys: '${this.keys.join("', '")}'`,
      );
    }
    return this.getDep(index) as TPlans[TKey];
  }
}

/**
 * A plan that represents an object using the keys given and the values being
 * the results of the associated plans.
 */
export function object<TPlans extends { [key: string]: ExecutableStep }>(
  obj: TPlans,
  cacheConfig?: ObjectStepCacheConfig,
): ObjectStep<TPlans> {
  return new ObjectStep<TPlans>(obj, cacheConfig);
}
