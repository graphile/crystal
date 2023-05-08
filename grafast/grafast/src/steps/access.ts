import chalk from "chalk";
import debugFactory from "debug";
import type { TE } from "tamedevil";
import te from "tamedevil";

import { inspect } from "../inspect.js";
import type { ExecutionExtra } from "../interfaces.js";
import type { ExecutableStep } from "../step.js";
import { UnbatchedExecutableStep } from "../step.js";

/** @internal */
export const expressionSymbol = Symbol("expression");

/**
 * Returns a function that will extract the value at the given path from an
 * incoming object. If possible it will return a dynamically constructed
 * function which will enable V8 to optimise the function over time via the
 * JIT.
 */
function constructDestructureFunction(
  path: (string | number | symbol)[],
  fallback: any,
): (_extra: ExecutionExtra, value: any) => any {
  const jitParts: TE[] = [];

  let slowMode = false;

  for (let i = 0, l = path.length; i < l; i++) {
    const pathItem = path[i];
    const t = typeof pathItem;
    if (
      t === "symbol" ||
      t === "string" ||
      (t === "number" && Number.isFinite(pathItem))
    ) {
      jitParts.push(te.get(pathItem));
    } else if (pathItem == null) {
      slowMode = true;
    } else {
      throw new Error(
        `Invalid path item: ${inspect(pathItem)} in path '${JSON.stringify(
          path,
        )}'`,
      );
    }
  }

  // Slow mode is if we need to do hasOwnProperty checks; otherwise we can use
  // a JIT-d function.
  if (slowMode) {
    return function slowlyExtractValueAtPath(_meta: any, value: any): any {
      let current = value;
      for (let i = 0, l = path.length; i < l && current != null; i++) {
        const pathItem = path[i];
        current = current[pathItem];
      }
      return fallback !== undefined ? current ?? fallback : current;
    };
  } else {
    // ?.blah?.bog?.["!!!"]?.[0]
    const expression = te.join(jitParts, "");

    // (extra, value) => value?.blah?.bog?.["!!!"]?.[0]
    const quicklyExtractValueAtPath = te.run<any>`\
return function quicklyExtractValueAtPath(extra, value) {
  return (value${expression})${
      fallback !== undefined ? te` ?? ${te.lit(fallback)}` : te.blank
    };
};`;

    // JIT this for great performance.
    quicklyExtractValueAtPath[expressionSymbol] = [expression, fallback];
    return quicklyExtractValueAtPath;
  }
}

const debugAccessPlan = debugFactory("grafast:AccessStep");
const debugAccessPlanVerbose = debugAccessPlan.extend("verbose");

/**
 * Accesses a (potentially nested) property from the result of a plan.
 *
 * NOTE: this could lead to unexpected results (which could introduce security
 * issues) if it is not used carefully; only use it on JSON-like data,
 * preferably where the objects have null prototypes, and be sure to adhere to
 * the naming conventions detailed in assertSafeToAccessViaBraces.
 */
export class AccessStep<TData> extends UnbatchedExecutableStep<TData> {
  static $$export = {
    moduleName: "grafast",
    exportName: "AccessStep",
  };
  isSyncAndSafe = true;

  allowMultipleOptimizations = true;
  public readonly path: (string | number | symbol)[];

  constructor(
    parentPlan: ExecutableStep<unknown>,
    path: (string | number | symbol)[],
    public readonly fallback?: any,
  ) {
    super();
    this.path = path;
    this.addDependency(parentPlan);
  }

  toStringMeta(): string {
    return `${chalk.bold.yellow(String(this.getDep(0).id))}.${this.path
      .map((p) => String(p))
      .join(".")}`;
  }

  /**
   * Get the named property of an object.
   */
  get<TAttr extends keyof TData>(attrName: TAttr): AccessStep<TData[TAttr]> {
    if (typeof attrName !== "string") {
      throw new Error(`AccessStep::get can only be called with string values`);
    }
    return new AccessStep(this.getDep(0), [...this.path, attrName]);
  }

  /**
   * Get the entry at the given index in an array.
   */
  at<TIndex extends keyof TData>(index: TIndex): AccessStep<TData[TIndex]> {
    if (typeof index !== "number") {
      throw new Error(`AccessStep::get can only be called with string values`);
    }
    return new AccessStep(this.getDep(0), [...this.path, index]);
  }

  // An access of an access can become a single access
  optimize(): AccessStep<TData> {
    const $dep = this.getDep(0);
    if ($dep instanceof AccessStep && $dep.fallback === undefined) {
      return access(
        $dep.getDep(0),
        [...$dep.path, ...this.path],
        this.fallback,
      );
    }
    return this;
  }

  finalize(): void {
    this.unbatchedExecute = constructDestructureFunction(
      this.path,
      this.fallback,
    );
    super.finalize();
  }

  unbatchedExecute(_extra: ExecutionExtra, ..._values: any[]): any {
    throw new Error(
      `${this}: should have had unbatchedExecute method replaced`,
    );
  }

  deduplicate(peers: AccessStep<unknown>[]): AccessStep<TData>[] {
    const myPath = JSON.stringify(this.path);
    const peersWithSamePath = peers.filter(
      (p) => p.fallback === this.fallback && JSON.stringify(p.path) === myPath,
    );
    debugAccessPlanVerbose(
      "%c deduplicate: peers with same path %o = %c",
      this,
      this.path,
      peersWithSamePath,
    );
    return peersWithSamePath as AccessStep<TData>[];
  }
}

/**
 * Access the property at path `path` in the value returned from `parentPlan`,
 * falling back to `fallback` if it were null-ish.
 */
export function access<TData>(
  parentPlan: ExecutableStep<unknown>,
  path: (string | number | symbol)[] | string | number | symbol,
  fallback?: any,
): AccessStep<TData> {
  return new AccessStep<TData>(
    parentPlan,
    Array.isArray(path) ? path : [path],
    fallback,
  );
}
