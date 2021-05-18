import { Plan } from "../plan";
import debugFactory from "debug";

const debugObjectPlan = debugFactory("crystal:ObjectPlan");
const debugObjectPlanVerbose = debugObjectPlan.extend("verbose");

export class ObjectPlan<TData extends { [key: string]: any }> extends Plan<
  TData
> {
  private keys: Array<keyof TData>;
  private results: Array<[Array<TData[keyof TData]>, TData]> = [];
  constructor(obj: { [key in keyof TData]: Plan<TData[key]> }) {
    super();
    this.keys = Object.keys(obj);
    for (let i = 0, l = this.keys.length; i < l; i++) {
      this.addDependency(obj[this.keys[i]]);
    }
  }

  // TODO: JIT this function
  tupleToObject(tuple: Array<TData[keyof TData]>): TData {
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
    }, {} as Partial<TData>) as TData;

    // Cache newObj so the same tuple values result in the exact same object.
    this.results.push([tuple, newObj]);
    return newObj;
  }

  execute(values: Array<Array<TData[keyof TData]>>): Array<TData> {
    return values.map(this.tupleToObject.bind(this));
  }

  optimize(peers: ObjectPlan<TData>[]): ObjectPlan<TData> {
    const myKeys = JSON.stringify(this.keys);
    const peersWithSameKeys = peers.filter(
      (p) => JSON.stringify(p.keys) === myKeys,
    );
    return peersWithSameKeys.length > 0 ? peersWithSameKeys[0] : this;
  }
}

export function object<TData extends { [key: string]: any }>(
  obj: { [key in keyof TData]: Plan<TData[key]> },
): ObjectPlan<TData> {
  return new ObjectPlan<TData>(obj);
}
