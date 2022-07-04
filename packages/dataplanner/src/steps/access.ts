import chalk from "chalk";
import debugFactory from "debug";
import { inspect } from "util";

import type { CrystalResultsList, CrystalValuesList } from "../interfaces.js";
import { ExecutableStep } from "../plan.js";

// NOTE: this runs at startup so it will NOT notice values that pollute the
// Object prototype after startup. It is assumed that you are running Node in
// an environment where the prototype will NOT be polluted.
// RECOMMENDATION: `Object.seal(Object.prototype)`
const forbiddenPropertyNames = Object.getOwnPropertyNames(Object.prototype);

/**
 * Returns true for values of 'blah' that you can do `foo.blah` with.
 * Extremely conservative.
 */
function canAccessViaDot(str: string): boolean {
  return /^[_a-zA-Z][_a-zA-Z0-9]{0,200}$/.test(str);
}

/**
 * Throws an error if the path value is unsafe, for example `__proto__`,
 * or a value which cannot safely be serialized via JSON.stringify.
 *
 * NOTE: it's HEAVILY ENCOURAGED that all properties to be used like this have
 * a `$` or `@` prefix to make sure no builtins are accessed by accident.
 *
 * **IMPORTANT**: Any properties that can be influenced by untrusted user input
 * _MUST_ adhere to the above naming prefixes.
 *
 * @see https://github.com/brianc/node-postgres/issues/1408#issuecomment-322444305
 * @see https://github.com/joliss/js-string-escape
 */
function assertSafeToAccessViaBraces(str: string): void {
  if (!/^[-@$_a-zA-Z0-9]*$/.test(str)) {
    // Note this is a _lot_ stricter than it needs to be, but I'd rather be
    // over-strict than have to add a dependency that _might_ change as
    // JS/Unicode evolve.
    throw new Error(`Forbidden property access to unsafe property '${str}'`);
  }
}

/**
 * This function adds a modicum of safety to property access. Really you should
 * conform to the naming conventions mentioned in assertSafeToAccessViaBraces,
 * so you should never hit this.
 */
function needsHasOwnPropertyCheck(str: string): boolean {
  return forbiddenPropertyNames.includes(str);
}

const warnedAboutItems = new Set<string>();
const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * Returns a function that will extract the value at the given path from an
 * incoming object. If possible it will return a dynamically constructed
 * function which will enable V8 to optimise the function over time via the
 * JIT.
 *
 * TODO: this is security critical! Be hyper vigilant when reviewing it.
 */
function constructDestructureFunction(
  path: (string | number)[],
  fallback: any,
): (value: any) => any {
  const jitParts: string[] = [];

  let slowMode = false;

  for (let i = 0, l = path.length; i < l; i++) {
    const pathItem = path[i];
    if (typeof pathItem === "string") {
      // Don't use JIT mode if we need to add hasOwnProperty checks.
      if (!slowMode && needsHasOwnPropertyCheck(pathItem)) {
        slowMode = true;
        if (!warnedAboutItems.has(pathItem)) {
          warnedAboutItems.add(pathItem);
          // TODO: link to documentation.
          console.warn(
            `WARNING: access to '${pathItem}' opts out of performant destructurer. Please ensure that properties being accessed are prefixed with '$' or '@'.`,
          );
        }
      }

      // ESSENTIAL security check to enable our JIT-ing below.
      assertSafeToAccessViaBraces(pathItem);

      if (canAccessViaDot(pathItem)) {
        // ?._mySimpleProperty
        jitParts.push(`?.${pathItem}`);
      } else {
        // ?.["@@meaning"]
        jitParts.push(`?.[${JSON.stringify(pathItem)}]`);
      }
    } else if (Number.isFinite(pathItem)) {
      // ?.[42]
      jitParts.push(`?.[${JSON.stringify(pathItem)}]`);
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
    return function slowlyExtractValueAtPath(value: any): any {
      let current = value;
      for (let i = 0, l = path.length; i < l; i++) {
        const pathItem = path[i];
        if (current == null) {
          current = undefined;
        } else if (typeof pathItem === "number") {
          current = Array.isArray(current) ? current[pathItem] : undefined;
        } else {
          current =
            typeof current === "object" &&
            current &&
            hasOwnProperty.call(current, pathItem)
              ? current[pathItem]
              : undefined;
        }
      }
      return current ?? fallback;
    };
  } else {
    // ?.blah?.bog?.["!!!"]?.[0]
    const expression = jitParts.join("");

    // return value?.blah?.bog?.["!!!"]?.[0]
    const functionBody = `return value${expression};`;

    // JIT this via `new Function` for great performance.
    const quicklyExtractValueAtPath = new Function(
      "value",
      functionBody,
    ) as any;
    quicklyExtractValueAtPath.displayName = "quicklyExtractValueAtPath";
    if (fallback !== undefined) {
      const quicklyExtractValueAtPathWithFallback = (value: any): any =>
        quicklyExtractValueAtPath(value) ?? fallback;
      return quicklyExtractValueAtPathWithFallback;
    } else {
      return quicklyExtractValueAtPath;
    }
  }
}

const debugAccessPlan = debugFactory("dataplanner:AccessStep");
const debugAccessPlanVerbose = debugAccessPlan.extend("verbose");

/**
 * Accesses a (potentially nested) property from the result of a plan.
 *
 * NOTE: this could lead to unexpected results (which could introduce security
 * issues) if it is not used carefully; only use it on JSON-like data,
 * preferably where the objects have null prototypes, and be sure to adhere to
 * the naming conventions detailed in assertSafeToAccessViaBraces.
 */
export class AccessStep<TData> extends ExecutableStep<TData> {
  static $$export = {
    moduleName: "dataplanner",
    exportName: "AccessStep",
  };
  isSyncAndSafe = true;

  private destructure: (value: TData) => any;
  private parentStepId: string;
  allowMultipleOptimizations = true;

  constructor(
    parentPlan: ExecutableStep<unknown>,
    public readonly path: (string | number)[],
    private fallback?: any,
  ) {
    super();
    this.addDependency(parentPlan);
    this.parentStepId = parentPlan.id;
    this.destructure = constructDestructureFunction(path, fallback);
  }

  toStringMeta(): string {
    return `${chalk.bold.yellow(String(this.dependencies[0]))}.${this.path.join(
      ".",
    )}`;
  }

  /**
   * Get the named property of an object.
   */
  get<TAttr extends keyof TData>(attrName: TAttr): AccessStep<TData[TAttr]> {
    if (typeof attrName !== "string") {
      throw new Error(`AccessStep::get can only be called with string values`);
    }
    return new AccessStep(this.getStep(this.parentStepId), [
      ...this.path,
      attrName,
    ]);
  }

  /**
   * Get the entry at the given index in an array.
   */
  at<TIndex extends keyof TData>(index: TIndex): AccessStep<TData[TIndex]> {
    if (typeof index !== "number") {
      throw new Error(`AccessStep::get can only be called with string values`);
    }
    return new AccessStep(this.getStep(this.parentStepId), [
      ...this.path,
      index,
    ]);
  }

  execute(values: [CrystalValuesList<TData>]): CrystalResultsList<TData> {
    return values[0].map(this.destructure);
  }

  finalize(): void {
    super.finalize();
  }

  deduplicate(peers: AccessStep<unknown>[]): AccessStep<TData> {
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
    return peersWithSamePath.length > 0
      ? (peersWithSamePath[0] as AccessStep<TData>)
      : this;
  }
}

/**
 * Access the property at path `path` in the value returned from `parentPlan`,
 * falling back to `fallback` if it were null-ish.
 */
export function access<TData>(
  parentPlan: ExecutableStep<unknown>,
  path: (string | number)[],
  fallback?: any,
): AccessStep<TData> {
  return new AccessStep<TData>(parentPlan, path, fallback);
}
