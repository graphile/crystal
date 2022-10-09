import debugFactory from "debug";

import type { ExecutionExtra } from "../interfaces.js";
import { ExecutableStep } from "../step.js";
import { isSafeIdentifier, STARTS_WITH_NUMBER } from "../utils.js";
import type { SetterCapableStep } from "./setter.js";

const EMPTY_OBJECT = Object.freeze(Object.create(null));

// const debugObjectPlan = debugFactory("grafast:ObjectStep");
// const debugObjectPlanVerbose = debugObjectPlan.extend("verbose");

type DataFromStep<TStep extends ExecutableStep<any>> =
  TStep extends ExecutableStep<infer TData> ? TData : never;

type DataFromPlans<TPlans extends { [key: string]: ExecutableStep<any> }> = {
  [key in keyof TPlans]: DataFromStep<TPlans[key]>;
};
type Results<TPlans extends { [key: string]: ExecutableStep<any> }> = Array<
  [Array<DataFromPlans<TPlans>[keyof TPlans]>, DataFromPlans<TPlans>]
>;

export interface ObjectPlanMeta<
  TPlans extends { [key: string]: ExecutableStep<any> },
> {
  results: Results<TPlans>;
}

/**
 * A plan that represents an object using the keys given and the values being
 * the results of the associated plans.
 */
export class ObjectStep<
    TPlans extends { [key: string]: ExecutableStep<any> } = {
      [key: string]: ExecutableStep<any>;
    },
  >
  extends ExecutableStep<DataFromPlans<TPlans>>
  implements SetterCapableStep<TPlans>
{
  static $$export = {
    moduleName: "grafast",
    exportName: "ObjectStep",
  };
  isSyncAndSafe = true;
  allowMultipleOptimizations = true;
  private keys: Array<keyof TPlans & string>;
  constructor(obj: TPlans) {
    super();
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

  tupleToObjectJIT(): (
    extra: ExecutionExtra,
    ...tuple: Array<DataFromPlans<TPlans>[keyof TPlans]>
  ) => DataFromPlans<TPlans> {
    if (this.keys.length === 0) {
      // Shortcut simple case
      return () => EMPTY_OBJECT;
    }
    const keysAreSafe = this.keys.every(isSafeIdentifier);
    const inner = keysAreSafe
      ? `\
  const newObj = {
${this.keys
  .map(
    (key, i) =>
      `    ${
        STARTS_WITH_NUMBER.test(key) ? JSON.stringify(key) : key
      }: val${i}`,
  )
  .join(",\n")}
  };
`
      : `\
  const newObj = Object.create(null);
${this.keys.map((key, i) => `  newObj[keys[${i}]] = val${i};\n`).join("")}\
`;
    const functionBody = `\
return function ({ meta }, ${this.keys.map((k, i) => `val${i}`).join(", ")}) {
  if (meta.nextIndex) {
    for (let i = 0, l = meta.results.length; i < l; i++) {
      const [values, obj] = meta.results[i];
      if (${this.keys
        .map((key, i) => `values[${i}] === val${i}`)
        .join(" && ")}) {
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
  meta.results[meta.nextIndex] = [[${this.keys
    .map((key, i) => `val${i}`)
    .join(",")}], newObj];
  // Only cache 10 results, use a round-robin
  meta.nextIndex = meta.nextIndex === 9 ? 0 : meta.nextIndex + 1;
  return newObj;
}
`;
    if (keysAreSafe) {
      return new Function(functionBody)() as any;
    } else {
      return new Function("keys", functionBody)(this.keys) as any;
    }
  }

  finalize() {
    this.executeSingle = this.tupleToObjectJIT();
    return super.finalize();
  }

  execute(
    values: Array<Array<DataFromPlans<TPlans>[keyof TPlans]>>,
    extra: ExecutionExtra,
  ): Array<DataFromPlans<TPlans>> {
    const count = values[0].length;
    const result = [];
    for (let i = 0; i < count; i++) {
      result[i] = this.executeSingle!(extra, ...values.map((v) => v[i]));
    }
    return result;
  }

  executeSingle?: (
    extra: ExecutionExtra,
    ...tuple: any[]
  ) => DataFromPlans<TPlans> = undefined;

  deduplicate(peers: ObjectStep<any>[]): ObjectStep<TPlans>[] {
    const myKeys = JSON.stringify(this.keys);
    return peers.filter((p) => JSON.stringify(p.keys) === myKeys);
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
    return this.getStep(this.dependencies[index]) as TPlans[TKey];
  }
}

/**
 * A plan that represents an object using the keys given and the values being
 * the results of the associated plans.
 */
export function object<TPlans extends { [key: string]: ExecutableStep<any> }>(
  obj: TPlans,
): ObjectStep<TPlans> {
  return new ObjectStep<TPlans>(obj);
}
