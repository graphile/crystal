import chalk from "chalk";

import type { ExecutionExtra, UnbatchedExecutionExtra } from "../interfaces.js";
import type { Step } from "../step.js";
import { UnbatchedStep } from "../step.js";
import { arraysMatch, digestKeys } from "../utils.js";

/**
 * Returns a function that will extract the value at the given path from an
 * incoming object. Optimized functions for common cases
 */
function constructDestructureFunction(
  path: ReadonlyArray<PropertyKey>,
  fallback: any,
  callback: (fn: (_extra: ExecutionExtra, value: any) => any) => void,
): void {
  const n = path.length;
  if (n === 0) {
    if (fallback === undefined) {
      callback((_meta, value) => value);
    } else {
      callback((_meta, value) => value ?? fallback);
    }
  } else if (n === 1) {
    const [p0] = path;
    if (fallback === undefined) {
      callback((_meta, value) => value?.[p0]);
    } else {
      callback((_meta, value) => value?.[p0] ?? fallback);
    }
  } else if (n === 2) {
    const [p0, p1] = path;
    if (fallback === undefined) {
      callback((_meta, value) => value?.[p0]?.[p1]);
    } else {
      callback((_meta, value) => value?.[p0]?.[p1] ?? fallback);
    }
  } else if (n === 3) {
    const [p0, p1, p2] = path;
    if (fallback === undefined) {
      callback((_meta, value) => value?.[p0]?.[p1]?.[p2]);
    } else {
      callback((_meta, value) => value?.[p0]?.[p1]?.[p2] ?? fallback);
    }
  } else {
    callback(function slowlyExtractValueAtPath(_meta: any, value: any): any {
      let current = value;
      for (let i = 0; i < n && current != null; i++) {
        const pathItem = path[i];
        current = current[pathItem];
      }
      return current ?? fallback;
    });
  }
}

/**
 * Accesses a (potentially nested) property from the result of a plan.
 *
 * NOTE: this could lead to unexpected results (which could introduce security
 * issues) if it is not used carefully; only use it on JSON-like data,
 * preferably where the objects have null prototypes, and be sure to adhere to
 * the naming conventions detailed in assertSafeToAccessViaBraces.
 */
export class AccessStep<TData> extends UnbatchedStep<TData> {
  static $$export = {
    moduleName: "grafast",
    exportName: "AccessStep",
  };
  isSyncAndSafe = true;

  allowMultipleOptimizations = true;
  public readonly path: (string | number | symbol)[];
  private readonly hasSymbols: boolean;

  constructor(
    parentPlan: Step<unknown>,
    path: (string | number | symbol)[],
    public readonly fallback?: any,
  ) {
    super();
    this._isImmutable = parentPlan._isImmutable;
    this.path = path;
    this.hasSymbols = this.path.some((k) => typeof k === "symbol");
    this.peerKey =
      (this.fallback === undefined ? "U" : "D") +
      (this.hasSymbols ? "§" : ".") +
      digestKeys(this.path);
    this.addStrongDependency(parentPlan);
  }

  toStringMeta(): string {
    return `${chalk.bold.yellow(
      String(this.getDepOptions(0).step.id),
    )}.${this.path.map((p) => String(p)).join(".")}`;
  }

  getParentStep() {
    return this.getDep(0);
  }

  __inferGet?: { [TAttr in keyof TData]: AccessStep<TData[TAttr]> };
  /**
   * Get the named property of an object.
   */
  get<TAttr extends keyof TData>(attrName: TAttr): AccessStep<TData[TAttr]> {
    if (typeof attrName !== "string") {
      throw new Error(`AccessStep::get can only be called with string values`);
    }
    return access(this.getDep(0), [...this.path, attrName]);
  }

  /**
   * Get the entry at the given index in an array.
   */
  at<TIndex extends keyof TData>(index: TIndex): AccessStep<TData[TIndex]> {
    if (typeof index !== "number") {
      throw new Error(`AccessStep::get can only be called with string values`);
    }
    return access(this.getDep(0), [...this.path, index]);
  }

  // An access of an access can become a single access
  optimize(): Step<TData> {
    const $dep = this.getDep(0);
    if (this.fallback === undefined && this.path.length === 0) {
      // I don't do anything
      return $dep;
    }
    if ($dep instanceof AccessStep && $dep.fallback === undefined) {
      return access(
        $dep.getDep(0),
        [...$dep.path, ...this.path],
        this.fallback,
      );
    }
    return this;
  }

  finalize() {
    // Note that `OutputPlan.optimize` depends on this.
    constructDestructureFunction(this.path, this.fallback, (fn) => {
      this.unbatchedExecute = fn;
    });

    super.finalize();
  }

  unbatchedExecute(_extra: UnbatchedExecutionExtra, ..._values: any[]): any {
    throw new Error(
      `${this}: should have had unbatchedExecute method replaced`,
    );
  }

  deduplicate(peers: AccessStep<unknown>[]): AccessStep<TData>[] {
    if (peers.length === 0) {
      return peers as never[];
    } else if (!this.hasSymbols && this.fallback === undefined) {
      // Rely entirely on peerKey
      return peers as AccessStep<TData>[];
    } else if (!this.hasSymbols) {
      // Rely on peerKey for path, but check fallback
      const { fallback } = this;
      return peers.filter(
        (p) => p.fallback === fallback,
      ) as AccessStep<TData>[];
    } else {
      // Check both fallback and path
      const { fallback, path } = this;
      return peers.filter(
        (p) => p.fallback === fallback && arraysMatch(p.path, path),
      ) as AccessStep<TData>[];
    }
  }
}

/**
 * Access the property at path `path` in the value returned from `parentPlan`,
 * falling back to `fallback` if it were null-ish.
 */
export function access<
  TData,
  TKey extends keyof Exclude<TData, null | undefined>,
  TFallback = undefined,
>(
  parentPlan: Step<TData>,
  key: TKey,
  fallback?: TFallback,
): AccessStep<
  | Exclude<Exclude<TData, null | undefined>[TKey], null | undefined>
  | (TData extends Exclude<TData, null | undefined> // Is non-nullable
      ? TData[TKey] extends Exclude<TData[TKey], null | undefined> // Key is also non-nullable
        ? never
        : TFallback
      : TFallback)
>;
export function access<TData>(
  parentPlan: Step<unknown>,
  rawPath?: (string | number | symbol)[] | string | number | symbol,
  fallback?: any,
): AccessStep<TData>;
export function access<TData>(
  parentPlan: Step<unknown>,
  rawPath?: (string | number | symbol)[] | string | number | symbol,
  fallback?: any,
): AccessStep<TData> {
  const path = Array.isArray(rawPath)
    ? rawPath
    : rawPath != null
      ? [rawPath]
      : [];
  if (
    typeof fallback === "undefined" &&
    !path.some((k) => typeof k === "symbol")
  ) {
    const pathKey = digestKeys(path);
    if (parentPlan._isImmutable) {
      return parentPlan.operationPlan.withRootLayerPlan(() =>
        parentPlan.operationPlan.cacheStep(
          parentPlan,
          "GrafastInternal:access()",
          pathKey,
          () => new AccessStep<TData>(parentPlan, path),
        ),
      );
    } else {
      return parentPlan.operationPlan.cacheStep(
        parentPlan,
        "GrafastInternal:access()",
        pathKey,
        () => new AccessStep<TData>(parentPlan, path),
      );
    }
  }
  return new AccessStep<TData>(parentPlan, path, fallback);
}
