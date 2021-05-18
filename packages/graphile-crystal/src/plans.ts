import { Plan } from "./plan";
import { Aether } from "./aether";
import { getCurrentAether, globalState } from "./global";
import { CrystalResultsList, CrystalValuesList } from "./interfaces";
import debugFactory from "debug";

class MapPlan extends Plan {
  private mapper: (obj: object) => object;
  constructor(
    parentPlan: Plan,
    private actualKeyByDesiredKey: { [desiredKey: string]: string },
  ) {
    super();
    this.addDependency(parentPlan);
    // TODO: JIT this.
    this.mapper = (obj: object): object => {
      return Object.keys(actualKeyByDesiredKey).reduce((memo, desiredKey) => {
        memo[desiredKey] = obj[actualKeyByDesiredKey[desiredKey]];
        return memo;
      }, {} as object);
    };
  }

  execute(values: any[][]): any[] {
    return values.map((value) => {
      const previous = value[0];
      return this.mapper(previous);
    });
  }

  optimize(peers: MapPlan[]): MapPlan {
    const myMap = JSON.stringify(this.actualKeyByDesiredKey);
    const peersWithSameMap = peers.filter(
      (p) => JSON.stringify(p.actualKeyByDesiredKey) === myMap,
    );
    return peersWithSameMap.length > 0 ? peersWithSameMap[0] : this;
  }
}

export function map(
  p: Plan,
  actualKeyByDesiredKey: { [desiredKey: string]: string },
): MapPlan {
  return new MapPlan(p, actualKeyByDesiredKey);
}

export function aether(): Aether {
  return getCurrentAether();
}

const debugObjectPlan = debugFactory("crystal:ObjectPlan");
const debugObjectPlanVerbose = debugObjectPlan.extend("verbose");
class ObjectPlan<TData extends { [key: string]: any }> extends Plan<TData> {
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

type UnwrapPlanTuple<TPlanTuple extends readonly Plan<any>[]> = [
  ...(TPlanTuple extends readonly Plan<infer U>[] ? readonly U[] : never)
];

class ListPlan<TPlanTuple extends readonly Plan<any>[]> extends Plan<
  UnwrapPlanTuple<TPlanTuple>
> {
  private results: Array<UnwrapPlanTuple<TPlanTuple>> = [];
  constructor(list: readonly [...TPlanTuple]) {
    super();
    for (let i = 0, l = list.length; i < l; i++) {
      this.addDependency(list[i]);
    }
  }

  tupleToTuple(
    tuple: UnwrapPlanTuple<TPlanTuple>,
  ): UnwrapPlanTuple<TPlanTuple> {
    const tupleLength = tuple.length;
    // Note: `outerloop` is a JavaScript "label". They are not very common.
    // First look for an existing match:
    outerloop: for (let i = 0, l = this.results.length; i < l; i++) {
      const existingTuple = this.results[i];
      // Shortcut for identical tuples (unlikely).
      if (existingTuple === tuple) {
        return existingTuple;
      }
      // Slow loop over each value in the tuples; this is not expected to be a
      // particularly big loop, typically only 2-5 keys.
      for (let j = 0; j < tupleLength; j++) {
        if (existingTuple[j] !== tuple[j]) {
          // This isn't a match; try the next record in the outer loop
          continue outerloop;
        }
      }
      return existingTuple;
    }

    // That failed; store this tuple so the same tuple values result in the exact same array.
    this.results.push(tuple);
    return tuple;
  }

  execute(
    values: Array<UnwrapPlanTuple<TPlanTuple>>,
  ): Array<UnwrapPlanTuple<TPlanTuple>> {
    return values.map(this.tupleToTuple.bind(this));
  }

  optimize(peers: ListPlan<TPlanTuple>[]): ListPlan<TPlanTuple> {
    return peers.length > 0 ? peers[0] : this;
  }
}

export function list<TPlanTuple extends Plan<any>[]>(
  list: TPlanTuple,
): ListPlan<TPlanTuple> {
  return new ListPlan(list);
}

class FirstPlan<TData> extends Plan<TData> {
  constructor(parentPlan: Plan<ReadonlyArray<TData>>) {
    super();
    this.addDependency(parentPlan);
  }

  execute(
    values: CrystalValuesList<[ReadonlyArray<TData>]>,
  ): CrystalResultsList<TData> {
    return values.map((tuple) => tuple[0]?.[0]);
  }

  optimize(peers: FirstPlan<TData>[]): FirstPlan<TData> {
    return peers.length > 0 ? peers[0] : this;
  }
}

/**
 * A plan that resolves to the first entry in the list returned by the given
 * plan.
 */
export function first<TPlan extends Plan<ReadonlyArray<any>>>(
  plan: TPlan,
): FirstPlan<TPlan extends Plan<ReadonlyArray<infer U>> ? U : never> {
  return new FirstPlan(plan);
}

export function debugPlans<T>(callback: () => T): T {
  globalState.debug = true;
  const result = callback();
  globalState.debug = false;
  return result;
}
