import {
  currentPlanningPath,
  currentPolymorphicPaths,
} from "../engine/lib/withGlobalLayerPlan.js";
import type { ExecutionDetails } from "../index.js";
import { $$inhibit, operationPlan } from "../index.js";
import {
  FLAG_INHIBITED,
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

  /** @internal */
  public getDepFor(step: Step) {
    const polyPaths = currentPolymorphicPaths() ?? step.polymorphicPaths;
    if (polyPaths == null) {
      return this;
    }
    let matchingIndex: number | null = null;
    for (const path of polyPaths) {
      const idx = this.indexByPath[path];
      if (idx == null) {
        console.warn(
          `GrafastInternalWarning<1fe0eee2-bee0-4c04-ba14-cf1cb592f1de>: Could not determine data only step dependency to use with polymorphic path ${path}`,
        );
        return this;
      }
      if (matchingIndex !== null && matchingIndex !== idx) {
        console.warn(
          `GrafastInternalWarning<a173445b-7027-44ba-8985-f60743774cb1>: Data only steps did not match for current polymorphic paths!`,
        );
        return this;
      }
      matchingIndex = idx;
    }
    if (matchingIndex === null) {
      console.warn(
        `GrafastInternalWarning<1c9558d5-9952-43f9-aa2f-90267ba2a078>: Could not find a dataOnly match for ${[...polyPaths]}`,
      );
      return this;
    }
    const depOptions = this.getDepOptions(matchingIndex);
    return depOptions.step;
  }

  public toStringMeta(): string | null {
    if (this.dependencies.length === 1) {
      return this.getDepOptions(0).step.toString();
    } else {
      return this.dependencies.map((step) => step.id).join(",");
    }
  }

  public deduplicate(_peers: readonly Step[]): readonly Step[] {
    return _peers;
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
    if (this.dependencies.length === 1) {
      return this.dependencies[0];
    }
    return this;
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
    // WARN: DO NOT CACHE THIS beyond the current planning path! Different
    // fields will want to use this in different ways, we must deduplicate them
    // all separately.
    return opPlan.cacheStep(
      step,
      "__dataOnly",
      currentPlanningPath(),
      () => new __DataOnlyStep<T>(step, polyPaths),
    );
  } else {
    // Only use data-only during planning phase
    return step;
  }
}
