/* eslint-disable @typescript-eslint/class-name-casing */
import * as assert from "assert";
import chalk from "chalk";
import { Aether, getCurrentAether, getCurrentPathIdentity } from "./aether";
import { Constraint } from "./constraints";
import { isDev, noop } from "./dev";
import { inspect } from "util";
import { GraphQLObjectType } from "graphql";

function reallyAssertFinalized(plan: Plan): void {
  if (!plan.isFinalized) {
    throw new Error(
      "Plan is not finalized; did you forget to call super.finalize()?",
    );
  }
}

// Optimise this away in production.
export const assertFinalized = !isDev ? noop : reallyAssertFinalized;

export abstract class Plan<TData = any> {
  /**
   * Plans this plan will need data from in order to execute.
   *
   * @internal
   */
  private readonly _dependencies: Plan[] = [];

  /**
   * Plans this plan will need data from in order to execute.
   */
  public readonly dependencies: ReadonlyArray<Plan> = this._dependencies;

  /**
   * Plans this plan might execute; e.g. in `BranchPlan`.
   */
  readonly children: Plan[] = [];

  public readonly aether: Aether;
  public isFinalized = false;
  public readonly id: number;
  public readonly groupId: number;
  public readonly pathIdentity: string;
  public readonly parentPathIdentity: string;

  constructor() {
    const aether = getCurrentAether();
    this.aether = aether;
    this.groupId = aether.groupId;
    this.pathIdentity = getCurrentPathIdentity();
    this.parentPathIdentity = this.pathIdentity.substr(
      0,
      this.pathIdentity.lastIndexOf(">"),
    );
    this.id = aether.plans.push(this) - 1;
  }

  toString(): string {
    return chalk.bold.blue(
      `${this.constructor.name}[${inspect(this.id, { colors: true })}@${
        this.pathIdentity || "root"
      }]`,
    );
  }

  addDependency(plan: Plan): number {
    if (isDev) {
      assert.ok(
        plan instanceof Plan,
        `Error occurred when adding dependency for '${this}', value passed was not a plan, it was '${inspect(
          plan,
        )}'`,
      );
    }
    return this._dependencies.push(plan) - 1;
  }

  /**
   * This function will be called with a `values` list: an array of entries for
   * each incoming crystal object, where each entry in the array is a list of
   * the values retrieved from executing the plans in `this.dependencies` for
   * that crystal object.
   *
   * It must return a list with the same length as `values`, where each value
   * in the list relates to the result of executing this plan for the
   * corresponding entry in the `values` list.
   *
   * IMPORTANT: it is up to the execute function to cache/memoize results as
   * appropriate for performance, this can be done via the `meta` object.
   *
   * The `meta` object is an empty object stored to `crystalContext.metaByPlan`
   * that can be used to store anything this plan needs. We recommend that you
   * add attributes to meta for each purpose (e.g. use `meta.cache` for
   * memoizing results) so that you can expand your usage of meta in future.
   */
  abstract execute(values: any[][], meta: {}): Promise<TData[]> | TData[];

  finalize(): void {
    this.isFinalized = true;
  }
}

export type PolymorphicPlan = Plan & {
  planForType(objectType: GraphQLObjectType): Plan;
};

export type ArgumentPlan = Plan & {
  null(): void;
};

/**
 * Returns true for values of 'blah' that you can do `foo.blah` with.
 * Extremely conservative.
 */
function canAccessViaDot(str: string): boolean {
  return /^[_a-zA-Z][_a-zA-Z0-9]{0,200}$/.test(str);
}

// NOTE: this runs at startup so it will NOT notice values that pollute the
// Object prototype after startup. It is assumed that you are running Node in
// an environment where the prototype will NOT be polluted.
// RECOMMENDATION: `Object.seal(Object.prototype)`
const forbiddenPropertyNames = Object.getOwnPropertyNames(Object.prototype);

/**
 * This function adds a modicum of safety to property access. Really you should
 * conform to the naming conventions mentioned in assertSafeToAccessViaBraces,
 * so you should never hit this.
 */
function needsHasOwnPropertyCheck(str: string): boolean {
  return forbiddenPropertyNames.includes(str);
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

  constructor(
    private readonly parentPlan: Plan,
    public readonly path: (string | number)[],
  ) {
    super();
    this.addDependency(parentPlan);
    this.destructure = constructDestructureFunction(path);
  }

  /**
   * Get the named property of an object.
   */
  get(attrName: string): AccessPlan {
    return new AccessPlan(this.parentPlan, [...this.path, attrName]);
  }

  /**
   * Get the entry at the given index in an array.
   */
  at(index: number): AccessPlan {
    return new AccessPlan(this.parentPlan, [...this.path, index]);
  }

  execute(values: any[][]): any[] {
    return values.map(this.destructure);
  }

  finalize(): void {
    super.finalize();
  }
}

/**
 * Implements `__ValuePlan(aether)` which is never executed; it's purely
 * internal - we populate the value as part of the algorithm - see
 * `GetValuePlanId` and `PopulateValuePlan`.
 *
 * @internal
 */
export class __ValuePlan extends Plan {
  execute(): never {
    throw new Error("__ValuePlan must never execute");
  }

  get(attrName: string): AccessPlan {
    return new AccessPlan(this, [attrName]);
  }

  at(index: number): AccessPlan {
    return new AccessPlan(this, [index]);
  }
}

/**
 * Implements the `__TrackedObjectPlan(aether, object, constraints, path)`
 * algorithm used to allow runtime AND plan-time access to the three special
 * entities: `variableValues`, `rootValue` and `context`.
 *
 * Plan-time access can evaluate the `object` passed to the constructor, and
 * will add constraints to the relevant aether.variableValuesConstraints,
 * aether.rootValueConstraints or aether.contextConstraints to ensure that all
 * future variableValues, rootValues and context will match the assumptions
 * made.
 *
 * Run-time access will see the runtime values of these properties, it will
 * **NOT** reference the `object` passed to the constructor.
 *
 * In core this will be used for evaluating `@skip`, `@include`, `@defer` and
 * `@stream` directives so that a different Aether will be used if these would
 * change the query plan, but it can also be used within plan resolvers to
 * branch the logic of a plan based on something in these entities.
 */
export class __TrackedObjectPlan<TData = any> extends Plan {
  /**
   * Could be anything. In the case of context it could even have exotic
   * entries such as `pgClient`.
   */
  private readonly value: TData;

  /**
   * For runtime (not plan-time) access to the value.
   */
  private readonly valuePlan: __ValuePlan | AccessPlan;

  /**
   * A reference to the relevant
   * aether.variableValuesConstraints/contextConstraints/rootValueConstraints.
   */
  private readonly constraints: Constraint[];

  /**
   * The path that we are through the original value (the one that
   * `constraints` relates to).
   */
  private readonly path: Array<string | number>;

  constructor(
    value: TData,
    valuePlan: __ValuePlan | AccessPlan,
    constraints: Constraint[],
    path: Array<string | number> = [],
  ) {
    super();
    this.addDependency(valuePlan);
    this.value = value;
    this.valuePlan = valuePlan;
    this.constraints = constraints;
    this.path = path;
  }

  execute(values: any[][]): any[] {
    // We have only one dependency, return the value of that.
    return values.map((v) => v[0]);
  }

  /**
   * Get the named property of an object.
   */
  get<TAttribute extends string>(
    attrName: TAttribute,
  ): __TrackedObjectPlan<
    TData extends { [key in TAttribute]: infer U } ? U : any
  > {
    const { value, path, constraints } = this;
    const newValue = (value as any)?.[attrName];
    const newValuePlan = this.valuePlan.get(attrName);
    const newPath = [...path, attrName];
    return new __TrackedObjectPlan(
      newValue,
      newValuePlan,
      constraints,
      newPath,
    );
  }

  /**
   * Get the entry at the given index in an array.
   */
  at(index: number): __TrackedObjectPlan<TData extends (infer U)[] ? U : any> {
    const { value, path, constraints } = this;
    const newValue = (value as any)?.[index];
    const newValuePlan = this.valuePlan.at(index);
    const newPath = [...path, index];
    return new __TrackedObjectPlan(
      newValue,
      newValuePlan,
      constraints,
      newPath,
    );
  }

  /**
   * Evaluates the current value, and adds a constraint to the Aether to ensure
   * that all future evaluations of this property will always return the same
   * value.
   *
   * **WARNING**: avoid using this where possible, it causes Aethers to split.
   *
   * **WARNING**: this is the most expensive eval, if you need to eval, prefer evalIs, evalHas, etc instead.
   */
  eval(): TData {
    const { path, value } = this;
    this.constraints.push({
      type: "value",
      path,
      value,
    });
    return value;
  }

  /**
   * Evaluates if the current value is equal to this specific value, and adds a
   * constraint to the Aether to ensure that all future evaluations of this
   * check will always return the same (boolean) result.
   *
   * Should only be used on scalars.
   *
   * **WARNING**: avoid using this where possible, it causes Aethers to split.
   */
  evalIs(expectedValue: any): boolean {
    const { value, path } = this;
    const pass = value === expectedValue;
    this.constraints.push({
      type: "equal",
      path,
      expectedValue,
      pass,
    });
    return pass;
  }

  /**
   * Evaluates if the current value is an object with the given key, and adds a
   * constraint to the Aether to ensure that all future evaluations of this
   * check will always return the same (boolean) result.
   *
   * **WARNING**: avoid using this where possible, it causes Aethers to split.
   */
  evalHas(key: string): boolean {
    const { value, path } = this;
    const newPath = [...path, key];

    // NOTE: `key in value` would be more performant here, but we cannot trust
    // users not to pass `{foo: undefined}` so we must do the more expensive
    // `value[key] !== undefined` check.
    const exists =
      (typeof value === "object" && value && value[key] !== undefined) || false;

    this.constraints.push({
      type: "exists",
      path: newPath,
      exists,
    });
    return exists;
  }

  /**
   * Evaluates the length of the current value (assumed to be an array), and
   * adds a constraint to the Aether to ensure that all future values will have
   * the same length.
   *
   * **WARNING**: avoid using this where possible, it causes Aethers to split.
   */
  evalLength(): number | null {
    const { value, path } = this;
    const length = Array.isArray(value) ? value.length : null;
    this.constraints.push({
      type: "length",
      path,
      expectedLength: length,
    });
    return length;
  }
}
