import debugFactory from "debug";
import { inspect } from "util";
import { Plan } from "../plan";

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
): (value: any[]) => any {
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
    } else {
      throw new Error(`Invalid path item: ${inspect(pathItem)}`);
    }
  }

  // The below functions reference value[0] because value is the list for all
  // of our dependencies; but we only have one dependency so we just grab that
  // value directly.

  // Slow mode is if we need to do hasOwnProperty checks; otherwise we can use
  // a JIT-d function.
  if (slowMode) {
    return function slowlyExtractValueAtPath(value: any): any {
      let current = value[0];
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
      return current;
    };
  } else {
    // ?.blah?.bog?.["!!!"]?.[0]
    const expression = jitParts.join("");

    // return value[0]?.blah?.bog?.["!!!"]?.[0]
    const functionBody = `return value[0]${expression};`;

    // JIT this via `new Function` for great performance.
    const quicklyExtractValueAtPath = new Function(
      "value",
      functionBody,
    ) as any;
    quicklyExtractValueAtPath.displayName = "quicklyExtractValueAtPath";
    return quicklyExtractValueAtPath;
  }
}

const debugAccessPlan = debugFactory("crystal:AccessPlan");
const debugAccessPlanVerbose = debugAccessPlan.extend("verbose");
/**
 * Accesses a (potentially nested) property from the result of a plan.
 *
 * NOTE: this could lead to unexpected results (which could introduce security
 * issues) if it is not used carefully; only use it on JSON-like data,
 * preferably where the objects have null prototypes, and be sure to adhere to
 * the naming conventions detailed in assertSafeToAccessViaBraces.
 */
export class AccessPlan extends Plan {
  private destructure: (value: any) => any;
  private parentPlanId: number;

  constructor(parentPlan: Plan, public readonly path: (string | number)[]) {
    super();
    this.addDependency(parentPlan);
    this.parentPlanId = parentPlan.id;
    this.destructure = constructDestructureFunction(path);
  }

  /**
   * Get the named property of an object.
   */
  get(attrName: string): AccessPlan {
    return new AccessPlan(this.aether.plans[this.parentPlanId], [
      ...this.path,
      attrName,
    ]);
  }

  /**
   * Get the entry at the given index in an array.
   */
  at(index: number): AccessPlan {
    return new AccessPlan(this.aether.plans[this.parentPlanId], [
      ...this.path,
      index,
    ]);
  }

  execute(values: any[][]): any[] {
    return values.map(this.destructure);
  }

  finalize(): void {
    super.finalize();
  }

  optimize(peers: AccessPlan[]): AccessPlan {
    const myPath = JSON.stringify(this.path);
    const peersWithSamePath = peers.filter(
      (p) => JSON.stringify(p.path) === myPath,
    );
    debugAccessPlanVerbose(
      "%c optimize: peers with same path %o = %c",
      this,
      this.path,
      peersWithSamePath,
    );
    return peersWithSamePath.length > 0 ? peersWithSamePath[0] : this;
  }
}

export function access(
  parentPlan: Plan,
  path: (string | number)[],
): AccessPlan {
  return new AccessPlan(parentPlan, path);
}
