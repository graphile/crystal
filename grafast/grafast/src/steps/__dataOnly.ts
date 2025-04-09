import type { ExecutionDetails } from "../index.js";
import { $$inhibit } from "../index.js";
import {
  FLAG_INHIBITED,
  FLAG_NULL,
  FLAG_POLY_SKIPPED,
  TRAPPABLE_FLAGS,
} from "../interfaces.js";
import { Step } from "../step.js";

const TRAPPABLE_OR_POLY_SKIPPED = TRAPPABLE_FLAGS | FLAG_POLY_SKIPPED;

export class __DataOnlyStep<T> extends Step<T> {
  static $$export = {
    moduleName: "grafast",
    exportName: "__DataOnlyStep",
  };
  isSyncAndSafe = true;
  depIndexes: number[];
  constructor(dep: Step<T>) {
    super();
    this.__trappableFlags = TRAPPABLE_OR_POLY_SKIPPED;
    this.depIndexes = [
      this.addStrongDependency({
        step: dep,
        acceptFlags: TRAPPABLE_OR_POLY_SKIPPED,
      }),
    ];
  }
  public deduplicatedWith(replacement: __DataOnlyStep<T>): void {
    for (const idx of this.depIndexes) {
      const options = this.getDepOptions(idx);
      replacement.depIndexes.push(
        replacement.addStrongDependency({
          ...options,
          acceptFlags: TRAPPABLE_OR_POLY_SKIPPED,
        }),
      );
    }
  }
  optimize(): Step<T> {
    if (this.depIndexes.length === 1) {
      return this.getDepOptions(0).step;
    }
    return this;
  }
  execute(details: ExecutionDetails) {
    return details.indexMap((i) => {
      for (const val of details.values) {
        const flags = val._flagsAt(i);
        if ((flags & FLAG_POLY_SKIPPED) === 0) {
          if ((flags & FLAG_INHIBITED) === FLAG_INHIBITED) {
            return $$inhibit;
          } else {
            return val.at(i);
          }
        }
      }
      // This should only happen on error, and even then... we shouldn't
      // reach here?
      return $$inhibit;
    });
  }
}

export function __dataOnly<T>(step: Step<T>) {
  if (step instanceof __DataOnlyStep) {
    return step;
  }
  return new __DataOnlyStep<T>(step);
}
