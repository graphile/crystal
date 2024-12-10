import chalk from "chalk";
import debugFactory from "debug";
import type { TE } from "tamedevil";
import te from "tamedevil";

import { inspect } from "../inspect.js";
import type { ExecutionExtra, UnbatchedExecutionExtra } from "../interfaces.js";
import type { ExecutableStep } from "../step.js";
import { UnbatchedExecutableStep } from "../step.js";

/** @internal */
export const expressionSymbol = Symbol("expression");

// We could use an LRU here, but there's no need - there's only 100 possible values;
type Factory = (
  fallback: any,
  ...path: Array<string | number | symbol>
) => (_extra: ExecutionExtra, value: any) => any;
const makeDestructureCache: { [signature: string]: Factory | undefined } =
  Object.create(null);
const makingDestructureCache: {
  [signature: string]: Array<(factory: Factory) => void> | undefined;
} = Object.create(null);

/**
 * Returns a function that will extract the value at the given path from an
 * incoming object. If possible it will return a dynamically constructed
 * function which will enable V8 to optimise the function over time via the
 * JIT.
 */
function constructDestructureFunction(
  path: (string | number | symbol)[],
  fallback: any,
  callback: (fn: (_extra: ExecutionExtra, value: any) => any) => void,
): void {
  const n = path.length;
  /** 0 - slow mode; 1 - middle mode; 2 - turbo mode */
  let mode: 0 | 1 | 2 = n > 50 || n < 1 ? 0 : n > 5 ? 1 : 2;

  for (let i = 0; i < n; i++) {
    const pathItem = path[i];
    const t = typeof pathItem;
    if (t === "symbol") {
      // Cannot use in superfast mode (because cannot create signature)
      if (mode === 2) mode = 1;
    } else if (t === "string") {
      // Cannot use in superfast mode (because signature becomes ambiguous)
      if (mode === 2 && (pathItem as string).includes("|")) mode = 1;
    } else if (t === "number") {
      if (!Number.isFinite(pathItem)) {
        mode = 0;
      }
    } else if (pathItem == null) {
      // Slow mode required
      mode = 0;
    } else {
      throw new Error(
        `Invalid path item: ${inspect(pathItem)} in path '${JSON.stringify(
          path,
        )}'`,
      );
    }
  }

  if (mode === 0) {
    // Slow mode
    callback(function slowlyExtractValueAtPath(_meta: any, value: any): any {
      let current = value;
      for (let i = 0, l = path.length; i < l && current != null; i++) {
        const pathItem = path[i];
        current = current[pathItem];
      }
      return current ?? fallback;
    });
  } else {
    const signature = (fallback !== undefined ? "f" : "n") + n;

    const done =
      mode === 2
        ? (factory: Factory) => {
            const fn = factory(fallback, ...path);
            // ?.blah?.bog?.["!!!"]?.[0]
            const expressionDetail = [path, fallback];
            (fn as any)[expressionSymbol] = expressionDetail;
            callback(fn);
          }
        : (factory: Factory) => callback(factory(fallback, ...path));

    const fn = makeDestructureCache[signature];
    if (fn !== undefined) {
      done(fn);
      return;
    }
    const making = makingDestructureCache[signature];
    if (making !== undefined) {
      making.push(done);
      return;
    }
    const doneHandlers: Array<(fn: Factory) => void> = [done];
    makingDestructureCache[signature] = doneHandlers;

    // DO NOT REFERENCE 'path' BELOW HERE!

    const names: TE[] = [];
    const access: TE[] = [];
    for (let i = 0; i < n; i++) {
      const te_name = te.identifier(`p${i}`);
      names.push(te_name);
      access.push(te`[${te_name}]`);
    }
    te.runInBatch<Factory>(
      te`function (fallback, ${te.join(names, ", ")}) {
return (_meta, value) => value?.${te.join(access, "?.")}${
        fallback === undefined ? te.blank : te.cache` ?? fallback`
      };
}`,
      (factory) => {
        makeDestructureCache[signature] = factory;
        delete makingDestructureCache[signature];
        for (const doneHandler of doneHandlers) {
          doneHandler(factory);
        }
      },
    );
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
  private readonly pathJSONString: string;

  constructor(
    parentPlan: ExecutableStep<unknown>,
    path: (string | number | symbol)[],
    public readonly fallback?: any,
  ) {
    super();
    this.path = path;
    this.pathJSONString = JSON.stringify(this.path);
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
    return this.cacheStep(
      attrName,
      () => new AccessStep(this.getDep(0), [...this.path, attrName]),
    );
  }

  /**
   * Get the entry at the given index in an array.
   */
  at<TIndex extends keyof TData>(index: TIndex): AccessStep<TData[TIndex]> {
    if (typeof index !== "number") {
      throw new Error(`AccessStep::get can only be called with string values`);
    }
    return this.cacheStep(
      index,
      () => new AccessStep(this.getDep(0), [...this.path, index]),
    );
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
    const peersWithSamePath = peers.filter(
      (p) =>
        p.fallback === this.fallback &&
        p.pathJSONString === this.pathJSONString,
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
  path?: (string | number | symbol)[] | string | number | symbol,
  fallback?: any,
): AccessStep<TData> {
  return new AccessStep<TData>(
    parentPlan,
    Array.isArray(path) ? path : path != null ? [path] : [],
    fallback,
  );
}
