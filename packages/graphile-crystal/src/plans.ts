import { Plan } from "./plan";
import { getCurrentAether, Aether } from "./aether";

class MapPlan extends Plan {
  private mapper: (obj: object) => object;
  constructor(
    parentPlan: Plan,
    actualKeyByDesiredKey: { [desiredKey: string]: string },
  ) {
    super();
    this.addDependency(parentPlan);
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
    const newObj = this.keys.reduce((memo, key, i) => {
      memo[key] = tuple[i];
      return memo;
    }, {} as Partial<TData>) as TData;

    // Cache newObj so the same tuple values result in the exact same object.
    this.results.push([tuple, newObj]);
    return newObj;
  }

  execute(values: Array<Array<TData[keyof TData]>>): Array<TData> {
    return values.map(this.tupleToObject);
  }
}

export function object<TData extends { [key: string]: any }>(
  obj: { [key in keyof TData]: Plan<TData[key]> },
): ObjectPlan<TData> {
  return new ObjectPlan<TData>(obj);
}

/*
class ListPlan<TData extends any[]> extends Plan<[...TData]> {
  private results: Array<TData> = [];
  constructor(obj: [...Plan<TData>]) {
    super();
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
    const newObj = this.keys.reduce((memo, key, i) => {
      memo[key] = tuple[i];
      return memo;
    }, {} as Partial<TData>) as TData;

    // Cache newObj so the same tuple values result in the exact same object.
    this.results.push([tuple, newObj]);
    return newObj;
  }

  execute(values: Array<Array<TData[keyof TData]>>): Array<TData> {
    return values.map(this.tupleToObject);
  }
}

export function list<TData extends any>(list: any): ListPlan<TData> {
  return new ListPlan<TData>(list);
}
*/
