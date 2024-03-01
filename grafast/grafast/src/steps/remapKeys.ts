/* eslint-disable @typescript-eslint/ban-types */
import chalk from "chalk";
import te, { isSafeObjectPropertyName } from "tamedevil";

import type {
  ExecutionDetails,
  GrafastResultsList,
  UnbatchedExecutionExtra,
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
      te`(function(obj) {
  return (obj == null ? obj : { ${te.join(
    entries.map(
      ([key, val]) => te`${te.safeKeyOrThrow(key)}: obj${te.get(val)}`,
    ),
    ", ",
  )} });
})`,
      callback,
    );
  }
  // Fallback to slow conversion
  return callback(
    (obj: Record<string, any> | null): Record<string, any> | null => {
      if (obj == null) {
        return obj;
      }
      return Object.keys(actualKeyByDesiredKey).reduce(
        (memo, desiredKey) => {
          memo[desiredKey] = obj[actualKeyByDesiredKey[desiredKey]];
          return memo;
        },
        Object.create(null) as Record<string, any>,
      );
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

  optimize() {
    for (const [key, val] of Object.entries(this.actualKeyByDesiredKey)) {
      if (String(key) !== String(val)) {
        return this;
      }
    }
    // If we're not actually remapping, just return the parent
    return this.getDep(0);
  }

  finalize(): void {
    makeMapper(this.actualKeyByDesiredKey, (fn) => {
      this.mapper = fn;
    });
    super.finalize();
  }

  executeV2({
    count,
    values: [values0],
  }: ExecutionDetails): GrafastResultsList<any> {
    return values0.isBatch
      ? values0.entries.map(this.mapper)
      : new Array(count).fill(this.mapper(values0.value));
  }

  unbatchedExecute(_extra: UnbatchedExecutionExtra, value: any): any {
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
