import {
  FLAG_INHIBITED,
  FLAG_POLY_SKIPPED,
  TRAPPABLE_FLAGS,
} from "../constants.js";
import { currentPolymorphicPaths } from "../engine/lib/withGlobalLayerPlan.js";
import type { ExecutionDetails } from "../index.js";
import { $$inhibit, operationPlan } from "../index.js";
import { Step } from "../step.js";

const TRAPPABLE_OR_POLY_SKIPPED = TRAPPABLE_FLAGS | FLAG_POLY_SKIPPED;

export class __DataOnlyStep<T> extends Step<T> {
  static $$export = {
    moduleName: "grafast",
    exportName: "__DataOnlyStep",
  };
  isSyncAndSafe = true;
  indexByPath: Record<string, number> = Object.create(null);

  constructor(dep: Step<T>, polymorphicPaths: ReadonlySet<string>) {
    super();
    this.__trappableFlags = TRAPPABLE_OR_POLY_SKIPPED;
    this.allowMultipleOptimizations = true;
    this.addDepForPaths(dep, polymorphicPaths);
  }

  /**
   * @internal
   */
  private addDepForPaths(dep: Step<T>, polymorphicPaths: ReadonlySet<string>) {
    const depIndex = this.addStrongDependency({
      step: dep,
      acceptFlags: TRAPPABLE_OR_POLY_SKIPPED,
    });
    for (const polymorphicPath of polymorphicPaths) {
      this.indexByPath[polymorphicPath] = depIndex;
    }
  }

  public toStringMeta(): string | null {
    if (this.dependencies.length === 1) {
      return this.getDepOptions(0).step.toString();
    } else {
      return this.dependencies.map((step) => step.id).join(",");
    }
  }

  public deduplicate(_peers: readonly Step[]): readonly Step[] {
    return _peers.filter((p) => p.layerPlan === this.layerPlan);
  }
  public deduplicatedWith(replacement: __DataOnlyStep<any>): void {
    this.mergeInto(replacement);
  }

  public mergeInto(replacement: __DataOnlyStep<T>): void {
    for (let i = 0, l = this.dependencies.length; i < l; i++) {
      const step = this.dependencies[i];
      const paths = new Set<string>();
      for (const [path, idx] of Object.entries(this.indexByPath)) {
        if (idx === i) {
          paths.add(path);
        }
      }
      replacement.addDepForPaths(step, paths);
    }
  }

  optimize(): Step<T> {
    if (this.polymorphicPaths === null) {
      // No need for me to exist
      const firstDep = this.dependencies[0];
      for (const dep of this.dependencies) {
        if (dep !== firstDep) {
          throw new Error(
            `${this} has multiple dependencies (${dep} != ${firstDep}), but no polymorphism?`,
          );
        }
      }
      return firstDep;
    }

    const firstDep = this.dependencies[0];
    for (const dep of this.dependencies) {
      if (dep !== firstDep) return this;
    }
    return firstDep;
  }

  execute(details: ExecutionDetails) {
    return details.indexMap((i) => {
      const ppath = details.polymorphicPathList[i];
      if (ppath === null) {
        throw new Error(
          `GrafastInternalError<66cb239e-73bf-4430-ac56-4f77bee0ac0a>: ${this} may only exist within polymorphic context, but there is none?`,
        );
      }
      const polyIndex = this.indexByPath[ppath];
      if (polyIndex === undefined) {
        return $$inhibit;
      }
      const val = details.values[polyIndex];
      const flags = val._flagsAt(i);
      if ((flags & FLAG_INHIBITED) === FLAG_INHIBITED) {
        return $$inhibit;
      } else {
        return val.at(i);
      }
    });
  }
}

export function __dataOnly<T>(step: Step<T>) {
  if (step instanceof __DataOnlyStep) {
    return step;
  }
  const opPlan = operationPlan();
  if (opPlan.phase === "plan") {
    const polyPaths = currentPolymorphicPaths();
    if (polyPaths === null) {
      // Only needed for polymorphism
      return step;
    }
    return new __DataOnlyStep<T>(step, polyPaths);
    /*
    // WARN: DO NOT CACHE THIS beyond the current planning path! Different
    // fields will want to use this in different ways, we must deduplicate them
    // all separately.
    return opPlan.cacheStep(
      step,
      "__dataOnly",
      currentPlanningPath(),
      () => new __DataOnlyStep<T>(step, polyPaths),
    );
    */
  } else {
    // Only use data-only during planning phase
    return step;
  }
}
