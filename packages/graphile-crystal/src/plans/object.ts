import debugFactory from "debug";

import { ExecutablePlan } from "../plan";

const debugObjectPlan = debugFactory("crystal:ObjectPlan");
const debugObjectPlanVerbose = debugObjectPlan.extend("verbose");

type DataFromPlan<TPlan extends ExecutablePlan<any>> =
  TPlan extends ExecutablePlan<infer TData> ? TData : never;

type DataFromPlans<TPlans extends { [key: string]: ExecutablePlan<any> }> = {
  [key in keyof TPlans]: DataFromPlan<TPlans[key]>;
};

export class ObjectPlan<
  TPlans extends { [key: string]: ExecutablePlan<any> },
> extends ExecutablePlan<DataFromPlans<TPlans>> {
  static $$export = {
    moduleName: "graphile-crystal",
    exportName: "ObjectPlan",
  };
  sync = true;
  private keys: Array<keyof TPlans>;
  private results: Array<
    [Array<DataFromPlans<TPlans>[keyof TPlans]>, DataFromPlans<TPlans>]
  > = [];
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
  public set(key: string, plan: ExecutablePlan<any>): void {
    this.keys.push(key);
    this.addDependency(plan);
  }

  getPlanForKey<TKey extends keyof TPlans>(
    key: TKey,
    allowMissing = false,
  ): TKey extends keyof TPlans ? TPlans[TKey] : null {
    const idx = this.keys.indexOf(key);
    if (idx < 0) {
      if (!allowMissing) {
        throw new Error(
          `${this}: failed to retrieve plan for key '${key}' - we have no such key`,
        );
      }
      return null as any;
    }
    return this.getDep(idx) as any;
  }

  toStringMeta(): string {
    return "{" + this.keys.join(",") + "}";
  }

  // TODO: JIT this function
  tupleToObject(
    tuple: Array<DataFromPlans<TPlans>[keyof TPlans]>,
  ): DataFromPlans<TPlans> {
    // Note: `outerloop` is a JavaScript "label". They are not very common.
    // First look for an existing match:
    outerloop: for (let i = 0, l = this.results.length; i < l; i++) {
      const [values, obj] = this.results[i];
      // Shortcut for identical tuples (unlikely).
      if (values === tuple) {
        return obj;
      }
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
    this.results.push([tuple, newObj]);
    return newObj;
  }

  finalize() {
    // TODO: JIT here
    this.executeSingle = this.tupleToObject.bind(this);
    return super.finalize();
  }

  execute(
    values: Array<Array<DataFromPlans<TPlans>[keyof TPlans]>>,
  ): Array<DataFromPlans<TPlans>> {
    return values.map(this.executeSingle!);
  }

  executeSingle:
    | ((
        values: Array<DataFromPlans<TPlans>[keyof TPlans]>,
      ) => DataFromPlans<TPlans>)
    | null = null;

  deduplicate(peers: ObjectPlan<any>[]): ObjectPlan<TPlans> {
    const myKeys = JSON.stringify(this.keys);
    const peersWithSameKeys = peers.filter(
      (p) => JSON.stringify(p.keys) === myKeys,
    );
    return peersWithSameKeys.length > 0 ? peersWithSameKeys[0] : this;
  }

  /**
   * Get the original plan with the given key back again.
   */
  get<TKey extends keyof TPlans>(key: TKey): TPlans[TKey] {
    const index = this.keys.indexOf(key);
    if (index < 0) {
      throw new Error(
        `This ObjectPlan doesn't have key '${key}'; supported keys: '${this.keys.join(
          "', '",
        )}'`,
      );
    }
    return this.getPlan(this.dependencies[index]) as TPlans[TKey];
  }
}

export function object<TPlans extends { [key: string]: ExecutablePlan<any> }>(
  obj: TPlans,
): ObjectPlan<TPlans> {
  return new ObjectPlan<TPlans>(obj);
}
