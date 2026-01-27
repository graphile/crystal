import chalk from "chalk";

import type {
  ExecutionDetails,
  GrafastResultsList,
  UnbatchedExecutionExtra,
} from "../interfaces.ts";
import type { Step } from "../step.ts";
import { UnbatchedStep } from "../step.ts";
import { digestKeys } from "../utils.ts";

export type ActualKeyByDesiredKey = { [desiredKey: string]: string };

function makeMapper(
  actualKeyByDesiredKey: ActualKeyByDesiredKey,
  callback: (fn: (obj: object | null) => object | null) => void,
) {
  const entries = Object.entries(actualKeyByDesiredKey);
  // Fallback to slow conversion
  return callback(
    (obj: Record<string, any> | null): Record<string, any> | null => {
      if (obj == null) return obj;
      const result = Object.create(null);
      for (const [desiredKey, actualKey] of entries) {
        result[desiredKey] = obj[actualKey];
      }
      return result;
    },
  );
}

/**
 * A plan that returns an object resulting from extracting the given
 * `actualKey` from the input and storing it as the `desiredKey` in the output.
 */
export class RemapKeysStep extends UnbatchedStep {
  static $$export = {
    moduleName: "grafast",
    exportName: "RemapKeysStep",
  };
  isSyncAndSafe = true;
  allowMultipleOptimizations = true;

  private mapper!: (obj: object | null) => object | null;
  private readonly actualKeyByDesiredKey: ActualKeyByDesiredKey;
  constructor($plan: Step, actualKeyByDesiredKey: ActualKeyByDesiredKey) {
    super();
    this.actualKeyByDesiredKey = actualKeyByDesiredKey;
    this.addDependency($plan);
    this.peerKey = digestKeys([
      ...Object.keys(this.actualKeyByDesiredKey),
      ...Object.values(this.actualKeyByDesiredKey),
    ]);
  }

  toStringMeta(): string {
    return (
      chalk.bold.yellow(String(this.dependencies[0].id)) +
      ":" +
      JSON.stringify(this.actualKeyByDesiredKey)
    );
  }

  optimize(): Step {
    for (const [key, val] of Object.entries(this.actualKeyByDesiredKey)) {
      if (String(key) !== String(val)) {
        return this;
      }
    }
    // If we're not actually remapping, just return the parent
    return this.getDep(0) as Step;
  }

  finalize(): void {
    makeMapper(this.actualKeyByDesiredKey, (fn) => {
      this.mapper = fn;
    });
    super.finalize();
  }

  execute({
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
    // Handled by peerKey
    return peers;
  }
}

/**
 * A plan that returns an object resulting from extracting the given
 * `actualKey` from the input and storing it as the `desiredKey` in the output.
 */
export function remapKeys(
  $step: Step,
  actualKeyByDesiredKey: { [desiredKey: string]: string },
): RemapKeysStep {
  return new RemapKeysStep($step, actualKeyByDesiredKey);
}
