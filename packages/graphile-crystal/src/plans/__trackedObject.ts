import type { Constraint } from "../constraints";
import { ExecutablePlan } from "../plan";
import type { __ValuePlan } from "./__value";
import type { AccessPlan } from "./access";

// TODO: rename to __TrackedValuePlan? Seems to represent values as well as
// objects.
/**
 * Implements the `__TrackedObjectPlan(aether, object, constraints, path)`
 * algorithm used to allow runtime AND plan-time access to the three special
 * entities: `variableValues`, `rootValue` and `context`.
 *
 * ExecutablePlan-time access can evaluate the `object` passed to the constructor, and
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
export class __TrackedObjectPlan<TData = any> extends ExecutablePlan<TData> {
  /**
   * Could be anything. In the case of context it could even have exotic
   * entries such as `pgClient`.
   */
  private readonly value: TData;

  /**
   * For runtime (not plan-time) access to the value.
   */
  private readonly valuePlan: __ValuePlan<TData> | AccessPlan<TData>;

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
    valuePlan: __ValuePlan<TData> | AccessPlan<TData>,
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
