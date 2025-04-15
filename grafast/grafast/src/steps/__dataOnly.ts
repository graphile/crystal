import { currentPlanningPath } from "../engine/lib/withGlobalLayerPlan.js";
import type { ExecutionDetails } from "../index.js";
import { $$inhibit, operationPlan } from "../index.js";
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
    this.allowMultipleOptimizations = true;
    this.depIndexes = [
      this.addStrongDependency({
        step: dep,
        acceptFlags: TRAPPABLE_OR_POLY_SKIPPED,
      }),
    ];
  }
  /** @internal */
  public getDepFor(step: Step) {
    if (this.depIndexes.length === 1) {
      return this.getDepOptions(0).step;
    } else {
      // find the dep that matches the poly paths
      const paths = [...(step.polymorphicPaths ?? [])];
      for (const i of this.depIndexes) {
        const $dep = this.getDepOptions(i).step;
        if (
          paths.every(
            (p) =>
              $dep.polymorphicPaths === null || $dep.polymorphicPaths.has(p),
          )
        ) {
          return $dep;
        }
      }
      throw new Error(`Failed to find dep of ${this} that matched ${step}`);
    }
  }
  public toStringMeta(): string | null {
    if (this.depIndexes.length === 1) {
      return this.getDepOptions(0).step.toString();
    } else {
      return this.depIndexes
        .map((i) => this.getDepOptions(i).step.id)
        .join(",");
    }
  }
  public deduplicate(_peers: readonly Step[]): readonly Step[] {
    return _peers;
  }
  public mergeInto(replacement: __DataOnlyStep<T>): void {
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
  const opPlan = operationPlan();
  if (opPlan.phase === "plan") {
    // WARN: DO NOT CACHE THIS beyond the current planning path! Different
    // fields will want to use this in different ways, we must deduplicate them
    // all separately.
    return opPlan.cacheStep(
      step,
      "__dataOnly",
      currentPlanningPath(),
      () => new __DataOnlyStep<T>(step),
    );
  } else {
    // Only use data-only during planning phase
    return step;
  }
}
