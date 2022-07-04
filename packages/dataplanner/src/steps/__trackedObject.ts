import type { Constraint } from "../constraints.js";
import type { CrystalResultsList, CrystalValuesList } from "../interfaces.js";
import { ExecutableStep } from "../plan.js";
import type { __ValueStep } from "./__value.js";
import type { AccessStep } from "./access.js";

// TODO: rename to __TrackedValueStep? Seems to represent values as well as
// objects.
/**
 * Implements the `__TrackedObjectStep(aether, object, constraints, path)`
 * algorithm used to allow runtime AND plan-time access to the three special
 * entities: `variableValues`, `rootValue` and `context`.
 *
 * ExecutableStep-time access can evaluate the `object` passed to the constructor, and
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
export class __TrackedObjectStep<TData = any> extends ExecutableStep<TData> {
  static $$export = {
    moduleName: "dataplanner",
    exportName: "__TrackedObjectStep",
  };
  isSyncAndSafe = true;

  /**
   * Could be anything. In the case of context it could even have exotic
   * entries such as `pgClient`.
   */
  private readonly value: TData | undefined;

  /**
   * For runtime (not plan-time) access to the value.
   */
  private readonly valuePlan: __ValueStep<TData> | AccessStep<TData>;

  /**
   * A reference to the relevant
   * aether.variableValuesConstraints/contextConstraints/rootValueConstraints.
   *
   * @internal
   */
  private readonly constraints: Constraint[];

  /**
   * The path that we are through the original value (the one that
   * `constraints` relates to).
   */
  private readonly path: Array<string | number>;

  /**
   * @internal
   */
  constructor(
    value: TData | undefined,
    valuePlan: __ValueStep<TData> | AccessStep<TData>,
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

  execute(values: [CrystalValuesList<TData>]): CrystalResultsList<TData> {
    // We have only one dependency, return the value of that.
    return values[0];
  }

  executeSingle = (v: [TData]): TData => v[0];

  /**
   * Get the named property of an object.
   */
  get<TAttribute extends keyof TData & string>(
    attrName: TAttribute,
  ): __TrackedObjectStep<TData[TAttribute]> {
    const { value, path, constraints } = this;
    const newValue = value?.[attrName];
    const newValuePlan = this.valuePlan.get(attrName);
    const newPath = [...path, attrName];
    return new __TrackedObjectStep(
      newValue,
      newValuePlan,
      constraints,
      newPath,
    );
  }

  /**
   * Get the entry at the given index in an array.
   */
  at<TIndex extends keyof TData & number>(
    index: TIndex,
  ): __TrackedObjectStep<TData[TIndex]> {
    const { value, path, constraints } = this;
    const newValue = value?.[index];
    const newValuePlan = this.valuePlan.at(index);
    const newPath = [...path, index];
    return new __TrackedObjectStep(
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
  eval(): TData | undefined {
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
  evalIs(expectedValue: unknown): boolean {
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
