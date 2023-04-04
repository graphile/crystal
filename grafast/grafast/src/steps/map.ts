/* eslint-disable @typescript-eslint/ban-types */
import chalk from "chalk";
import te, { isSafeObjectPropertyName } from "tamedevil";

import type {
  ExecutionExtra,
  GrafastResultsList,
  GrafastValuesList,
} from "../interfaces.js";
import type { ExecutableStep } from "../step.js";
import { UnbatchedExecutableStep } from "../step.js";

export type ActualKeyByDesiredKey = { [desiredKey: string]: string };

export function makeMapper(actualKeyByDesiredKey: ActualKeyByDesiredKey) {
  const entries = Object.entries(actualKeyByDesiredKey);
  if (
    entries.every(
      ([key, val]) =>
        isSafeObjectPropertyName(key) && isSafeObjectPropertyName(val),
    )
  ) {
    // We can do a fast custom conversion
    return te.run`return function(obj) {
  return (obj == null ? obj : { ${te.join(
    entries.map(([key, val]) => te`${te.dangerousKey(key)}: obj${te.get(val)}`),
    ", ",
  )} });
}` as any;
  }
  // Fallback to slow conversion
  return (obj: Record<string, any> | null): Record<string, any> | null => {
    if (obj == null) {
      return obj;
    }
    return Object.keys(actualKeyByDesiredKey).reduce((memo, desiredKey) => {
      memo[desiredKey] = obj[actualKeyByDesiredKey[desiredKey]];
      return memo;
    }, Object.create(null) as Record<string, any>);
  };
}

/**
 * A plan that returns an object resulting from extracting the given
 * `actualKey` from the input and storing it as the `desiredKey` in the output.
 */
export class MapStep extends UnbatchedExecutableStep {
  static $$export = {
    moduleName: "grafast",
    exportName: "MapStep",
  };
  isSyncAndSafe = true;
  allowMultipleOptimizations = true;

  private mapper: (obj: object) => object;
  constructor(
    $plan: ExecutableStep,
    private actualKeyByDesiredKey: ActualKeyByDesiredKey,
  ) {
    super();
    this.addDependency($plan);
    this.mapper = makeMapper(actualKeyByDesiredKey);
  }

  toStringMeta(): string {
    return (
      chalk.bold.yellow(String(this.dependencies[0].id)) +
      ":" +
      JSON.stringify(this.actualKeyByDesiredKey)
    );
  }

  execute(values: GrafastValuesList<any[]>): GrafastResultsList<any> {
    return values[0].map(this.mapper);
  }

  unbatchedExecute(extra: ExecutionExtra, value: any): any {
    return this.mapper(value);
  }

  deduplicate(peers: MapStep[]): MapStep[] {
    const myMap = JSON.stringify(this.actualKeyByDesiredKey);
    return peers.filter(
      (p) => JSON.stringify(p.actualKeyByDesiredKey) === myMap,
    );
  }
}

// TODO: people think of 'map' in turns of mapping over an array, or Maps,
// rather than a mathematical-style mapping of the keys of an object. We should
// rename this - objectMap or something?
/**
 * A plan that returns an object resulting from extracting the given
 * `actualKey` from the input and storing it as the `desiredKey` in the output.
 */
export function map(
  $step: ExecutableStep,
  actualKeyByDesiredKey: { [desiredKey: string]: string },
): MapStep {
  return new MapStep($step, actualKeyByDesiredKey);
}
