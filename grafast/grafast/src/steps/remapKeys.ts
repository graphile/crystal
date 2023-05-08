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

function makeMapper(
  actualKeyByDesiredKey: ActualKeyByDesiredKey,
  callback: (fn: (obj: object | null) => object | null) => void,
) {
  const entries = Object.entries(actualKeyByDesiredKey);
  if (
    entries.every(
      ([key, val]) =>
        isSafeObjectPropertyName(key) && isSafeObjectPropertyName(val),
    )
  ) {
    // We can do a fast custom conversion
    return te.runInBatch<any>(
      te`return function(obj) {
  return (obj == null ? obj : { ${te.join(
    entries.map(([key, val]) => te`${te.dangerousKey(key)}: obj${te.get(val)}`),
    ", ",
  )} });
}`,
      callback,
    );
  }
  // Fallback to slow conversion
  return callback(
    (obj: Record<string, any> | null): Record<string, any> | null => {
      if (obj == null) {
        return obj;
      }
      return Object.keys(actualKeyByDesiredKey).reduce((memo, desiredKey) => {
        memo[desiredKey] = obj[actualKeyByDesiredKey[desiredKey]];
        return memo;
      }, Object.create(null) as Record<string, any>);
    },
  );
}

/**
 * A plan that returns an object resulting from extracting the given
 * `actualKey` from the input and storing it as the `desiredKey` in the output.
 */
export class RemapKeysStep extends UnbatchedExecutableStep {
  static $$export = {
    moduleName: "grafast",
    exportName: "RemapKeysStep",
  };
  isSyncAndSafe = true;
  allowMultipleOptimizations = true;

  private mapper!: (obj: object | null) => object | null;
  constructor(
    $plan: ExecutableStep,
    private actualKeyByDesiredKey: ActualKeyByDesiredKey,
  ) {
    super();
    this.addDependency($plan);
  }

  toStringMeta(): string {
    return (
      chalk.bold.yellow(String(this.dependencies[0].id)) +
      ":" +
      JSON.stringify(this.actualKeyByDesiredKey)
    );
  }

  finalize(): void {
    makeMapper(this.actualKeyByDesiredKey, (fn) => {
      this.mapper = fn;
    });
    super.finalize();
  }

  execute(
    _count: number,
    values: GrafastValuesList<any[]>,
  ): GrafastResultsList<any> {
    return values[0].map(this.mapper);
  }

  unbatchedExecute(extra: ExecutionExtra, value: any): any {
    return this.mapper(value);
  }

  deduplicate(peers: RemapKeysStep[]): RemapKeysStep[] {
    const myMap = JSON.stringify(this.actualKeyByDesiredKey);
    return peers.filter(
      (p) => JSON.stringify(p.actualKeyByDesiredKey) === myMap,
    );
  }
}

/**
 * A plan that returns an object resulting from extracting the given
 * `actualKey` from the input and storing it as the `desiredKey` in the output.
 */
export function remapKeys(
  $step: ExecutableStep,
  actualKeyByDesiredKey: { [desiredKey: string]: string },
): RemapKeysStep {
  return new RemapKeysStep($step, actualKeyByDesiredKey);
}
