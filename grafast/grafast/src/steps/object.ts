// import debugFactory from "debug";

import te, { isSafeObjectPropertyName } from "tamedevil";

import type { ExecutionExtra, StepOptimizeOptions } from "../interfaces.js";
import type { ExecutableStep } from "../step.js";
import { UnbatchedExecutableStep } from "../step.js";
import { constant, ConstantStep } from "./constant.js";
import type { SetterCapableStep } from "./setter.js";

const EMPTY_OBJECT = Object.freeze(Object.create(null));

// const debugObjectPlan = debugFactory("grafast:ObjectStep");
// const debugObjectPlanVerbose = debugObjectPlan.extend("verbose");

type DataFromStep<TStep extends ExecutableStep> = TStep extends ExecutableStep<
  infer TData
>
  ? TData
  : never;

type DataFromPlans<TPlans extends { [key: string]: ExecutableStep }> = {
  [key in keyof TPlans]: DataFromStep<TPlans[key]>;
};
type Results<TPlans extends { [key: string]: ExecutableStep }> = Array<
  [Array<DataFromPlans<TPlans>[keyof TPlans]>, DataFromPlans<TPlans>]
>;

export interface ObjectPlanMeta<
  TPlans extends { [key: string]: ExecutableStep },
> {
  results: Results<TPlans>;
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
  extends UnbatchedExecutableStep<DataFromPlans<TPlans>>
  implements SetterCapableStep<TPlans>
{
  static $$export = {
    moduleName: "grafast",
    exportName: "ObjectStep",
  };
  isSyncAndSafe = true;
  allowMultipleOptimizations = true;
  private keys: Array<keyof TPlans & string>;

  // Optimize needs the same 'meta' for all ObjectSteps
  optimizeMetaKey = "ObjectStep";

  constructor(obj: TPlans) {
    super();
    this.metaKey = this.id;
    this.keys = Object.keys(obj);
    for (let i = 0, l = this.keys.length; i < l; i++) {
      this.addDependency(obj[this.keys[i]]);
    }
  }

  /**
   * This key doesn't get typed, but it can be added later which can be quite
   * handy.
   */
  public set<TKey extends keyof TPlans>(key: TKey, plan: TPlans[TKey]): void {
    this.keys.push(key as string);
    this.addDependency(plan);
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
    ...tuple: Array<DataFromPlans<TPlans>[keyof TPlans]>
  ): DataFromPlans<TPlans> {
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
    }, {} as Partial<DataFromPlans<TPlans>>) as DataFromPlans<TPlans>;

    // Cache newObj so the same tuple values result in the exact same object.
    meta.results.push([tuple, newObj]);
    return newObj;
  }
  */

  tupleToObjectJIT(
    callback: (
      fn: (
        extra: ExecutionExtra,
        ...tuple: Array<DataFromPlans<TPlans>[keyof TPlans]>
      ) => DataFromPlans<TPlans>,
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
    (key, i) => te`    ${te.dangerousKey(key)}: ${te.identifier(`val${i}`)}`,
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
    return te.runInBatch<Parameters<typeof callback>[0]>(
      te`\
(function ({ meta }, ${te.join(
        this.keys.map((_k, i) => te.identifier(`val${i}`)),
        ", ",
      )}) {
  if (meta.nextIndex) {
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
    if (!meta.results) {
      meta.results = [];
    }
  }
${inner}
  meta.results[meta.nextIndex] = [[${te.join(
    this.keys.map((_key, i) => te.identifier(`val${i}`)),
    ",",
  )}], newObj];
  // Only cache 10 results, use a round-robin
  meta.nextIndex = meta.nextIndex === 9 ? 0 : meta.nextIndex + 1;
  return newObj;
})`,
      callback,
    );
  }

  finalize() {
    this.tupleToObjectJIT((fn) => {
      this.unbatchedExecute = fn;
    });
    return super.finalize();
  }

  execute(
    count: number,
    values: Array<Array<DataFromPlans<TPlans>[keyof TPlans]>>,
    extra: ExecutionExtra,
  ): Array<DataFromPlans<TPlans>> {
    const result: Array<DataFromPlans<TPlans>> = [];
    for (let i = 0; i < count; i++) {
      result[i] = this.unbatchedExecute!(extra, ...values.map((v) => v[i]));
    }
    return result;
  }

  unbatchedExecute(_extra: ExecutionExtra, ..._values: any[]): any {
    throw new Error(`${this} didn't finalize? No unbatchedExecute method.`);
  }

  deduplicate(peers: ObjectStep<any>[]): ObjectStep<TPlans>[] {
    const myKeys = JSON.stringify(this.keys);
    return peers.filter((p) => JSON.stringify(p.keys) === myKeys);
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
      if (existing !== undefined) {
        return constant(existing);
      } else {
        const obj = Object.create(null);
        for (let i = 0, l = this.keys.length; i < l; i++) {
          const key = this.keys[i];
          const value = (this.dependencies[i] as ConstantStep<any>).data;
          obj[key] = value;
        }
        meta[keysJoined].push(obj);
        return constant(obj);
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
): ObjectStep<TPlans> {
  return new ObjectStep<TPlans>(obj);
}
