import type {
  GraphQLInputObjectType,
  GraphQLInputType,
  TypeNode,
  VariableDefinitionNode,
} from "graphql";
import {
  getNullableType,
  GraphQLList,
  GraphQLNonNull,
  isInputObjectType,
  isListType,
  Kind,
} from "graphql";

import type { Constraint } from "../constraints.js";
import { __ListTransformStep, arrayOfLength } from "../index.js";
import type {
  ExecutionDetails,
  GrafastResultsList,
  UnbatchedExecutionExtra,
} from "../interfaces.js";
import { UnbatchedExecutableStep } from "../step.js";
import type { __ValueStep } from "./__value.js";
import type { AccessStep } from "./access.js";

/**
 * Implements the `__TrackedValueStep(operationPlan, object, constraints, path)`
 * algorithm used to allow runtime AND plan-time access to the three special
 * entities: `variableValues`, `rootValue` and `context`.
 *
 * ExecutableStep-time access can evaluate the `object` passed to the constructor, and
 * will add constraints to the relevant operationPlan.variableValuesConstraints,
 * operationPlan.rootValueConstraints or operationPlan.contextConstraints to
 * ensure that all future variableValues, rootValues and context will match the
 * assumptions made.
 *
 * Run-time access will see the runtime values of these properties, it will
 * **NOT** reference the `object` passed to the constructor.
 *
 * In core this will be used for evaluating `@skip`, `@include`, `@defer` and
 * `@stream` directives so that a different OpPlan will be used if these would
 * change the query plan, but it can also be used within plan resolvers to
 * branch the logic of a plan based on something in these entities.
 */
export class __TrackedValueStep<
  TData = any,
  TInputType extends
    | GraphQLInputType
    | ReadonlyArray<VariableDefinitionNode>
    | undefined = undefined,
> extends UnbatchedExecutableStep<TData> {
  static $$export = {
    moduleName: "grafast",
    exportName: "__TrackedValueStep",
  };
  isSyncAndSafe = true;

  /**
   * Could be anything. In the case of context it could even have exotic
   * entries such as `pgClient`.
   */
  private readonly value: TData | undefined;

  /**
   * A reference to the relevant
   * operationPlan.variableValuesConstraints/contextConstraints/rootValueConstraints.
   *
   * @internal
   */
  private readonly constraints: Constraint[];

  /**
   * The path that we are through the original value (the one that
   * `constraints` relates to).
   */
  private readonly path: Array<string | number>;

  static withGraphQLType<TInputType extends GraphQLInputType, TData = any>(
    value: TData | undefined,
    valuePlan: __ValueStep<TData> | AccessStep<TData>,
    constraints: Constraint[],
    path: Array<string | number> = [],
    graphqlType: TInputType,
  ) {
    return new __TrackedValueStep<TData, TInputType>(
      value,
      valuePlan,
      constraints,
      path,
      graphqlType,
    ) as __TrackedValueStepWithDollars<TData, TInputType>;
  }

  private nullableGraphQLType: GraphQLInputType | undefined;
  private variableDefinitions:
    | ReadonlyArray<VariableDefinitionNode>
    | undefined;
  /**
   * @internal
   */
  constructor(
    value: TData | undefined,
    valuePlan: __ValueStep<TData> | AccessStep<TData>,
    constraints: Constraint[],
    path: Array<string | number> = [],
    graphqlTypeOrVariableDefinitions?: TInputType,
  ) {
    super();
    this.addDependency(valuePlan);
    this.value = value;
    this.constraints = constraints;
    this.path = path;
    this.nullableGraphQLType =
      graphqlTypeOrVariableDefinitions &&
      !isArray(graphqlTypeOrVariableDefinitions)
        ? getNullableType(graphqlTypeOrVariableDefinitions)
        : undefined;
    this.variableDefinitions =
      graphqlTypeOrVariableDefinitions &&
      isArray(graphqlTypeOrVariableDefinitions)
        ? graphqlTypeOrVariableDefinitions
        : undefined;

    if (isInputObjectType(this.nullableGraphQLType)) {
      const fields = this.nullableGraphQLType.getFields();
      for (const fieldName of Object.keys(fields)) {
        let step: __TrackedValueStepWithDollars<any, any>;
        Object.defineProperty(this, `$${fieldName}`, {
          get: () => {
            if (!step) {
              step = this.get(fieldName as keyof TData & string) as any;
            }
            return step;
          },
        });
      }
    } else if (this.variableDefinitions) {
      for (const def of this.variableDefinitions) {
        const varName = def.variable.name.value;
        let step: __TrackedValueStepWithDollars<any, any>;
        Object.defineProperty(this, `$${varName}`, {
          get: () => {
            if (!step) {
              step = this.get(varName as keyof TData & string) as any;
            }
            return step;
          },
        });
      }
    }
  }

  execute({
    count,
    values: [values0],
  }: ExecutionDetails<[TData]>): GrafastResultsList<TData> {
    // We have only one dependency, return the value of that.
    return values0.isBatch
      ? values0.entries
      : arrayOfLength(count, values0.value);
  }

  unbatchedExecute(_extra: UnbatchedExecutionExtra, v: TData): TData {
    return v;
  }

  private getValuePlan() {
    return this.getDep(0) as __ValueStep<TData> | AccessStep<TData>;
  }

  /**
   * Get the named property of an object.
   */
  get<TAttribute extends keyof TData & string>(
    attrName: TAttribute,
  ): __TrackedValueStepWithDollars<
    TData[TAttribute],
    TInputType extends GraphQLInputObjectType
      ? ReturnType<TInputType["getFields"]>[TAttribute]["type"]
      : undefined
  > {
    const { value, path, constraints } = this;
    const newValue = value?.[attrName];
    const newValuePlan = this.getValuePlan().get(attrName);
    const newPath = [...path, attrName];

    if (this.nullableGraphQLType) {
      if (isInputObjectType(this.nullableGraphQLType)) {
        const fields = this.nullableGraphQLType.getFields();
        const field = fields[attrName];
        if (!field) {
          throw new Error(
            `'${this.nullableGraphQLType}' has no attribute '${attrName}'`,
          );
        }
        return __TrackedValueStep.withGraphQLType(
          newValue,
          newValuePlan,
          constraints,
          newPath,
          field.type,
        ) as any;
      } else {
        throw new Error(
          `Cannot get field '${attrName}' on non-input-object type '${this.nullableGraphQLType}'`,
        );
      }
    } else if (this.variableDefinitions) {
      const def = this.variableDefinitions.find(
        (d) => d.variable.name.value === attrName,
      );
      if (!def) {
        throw new Error(
          `No variable named '$${attrName}' exists in this operation`,
        );
      }
      const getType = (t: TypeNode): GraphQLInputType => {
        if (t.kind === Kind.NON_NULL_TYPE) {
          return new GraphQLNonNull(getType(t.type));
        } else if (t.kind === Kind.LIST_TYPE) {
          return new GraphQLList(getType(t.type));
        } else {
          const name = t.name.value;
          return this.operationPlan.schema.getType(name) as GraphQLInputType;
        }
      };
      const type = getType(def.type);
      return __TrackedValueStep.withGraphQLType(
        newValue,
        newValuePlan,
        constraints,
        newPath,
        type,
      ) as any;
    } else {
      return new __TrackedValueStep(
        newValue,
        newValuePlan,
        constraints,
        newPath,
      ) as any;
    }
  }

  /**
   * Get the entry at the given index in an array.
   */
  at<TIndex extends keyof TData & number>(
    index: TIndex,
  ): __TrackedValueStepWithDollars<
    TData[TIndex],
    TInputType extends GraphQLList<infer U>
      ? U & GraphQLInputType
      : TInputType extends GraphQLNonNull<GraphQLList<infer U>>
      ? U & GraphQLInputType
      : undefined
  > {
    const { value, path, constraints } = this;
    const newValue = value?.[index];
    const newValuePlan = this.getValuePlan().at(index);
    const newPath = [...path, index];
    if (this.nullableGraphQLType) {
      if (isListType(this.nullableGraphQLType)) {
        return __TrackedValueStep.withGraphQLType(
          newValue,
          newValuePlan,
          constraints,
          newPath,
          this.nullableGraphQLType.ofType,
        ) as any;
      } else {
        throw new Error(
          `'${this.nullableGraphQLType}' is not a list type, cannot access array index '${index}' on it`,
        );
      }
    } else {
      return new __TrackedValueStep(
        newValue,
        newValuePlan,
        constraints,
        newPath,
      ) as any;
    }
  }

  /**
   * Evaluates the current value, and adds a constraint to the OpPlan to ensure
   * that all future evaluations of this property will always return the same
   * value.
   *
   * **WARNING**: avoid using this where possible, it causes OpPlans to split.
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
   * constraint to the OpPlan to ensure that all future evaluations of this
   * check will always return the same (boolean) result.
   *
   * Should only be used on scalars.
   *
   * **WARNING**: avoid using this where possible, it causes OpPlans to split.
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

  evalIsEmpty() {
    const { value, path } = this;
    const isEmpty =
      typeof value === "object" &&
      value !== null &&
      Object.keys(value).length === 0;
    this.constraints.push({
      type: "isEmpty",
      path,
      isEmpty,
    });
    return isEmpty;
  }

  /**
   * Evaluates if the current value is an object with the given key, and adds a
   * constraint to the OpPlan to ensure that all future evaluations of this
   * check will always return the same (boolean) result.
   *
   * **WARNING**: avoid using this where possible, it causes OpPlans to split.
   */
  evalHas(key: string): boolean {
    const { value, path } = this;
    const newPath = [...path, key];

    // NOTE: `key in value` would be more performant here, but we cannot trust
    // users not to pass `{foo: undefined}` so we must do the more expensive
    // `value[key] !== undefined` check.
    const exists =
      (typeof value === "object" &&
        value &&
        (value as any)[key] !== undefined) ||
      false;

    this.constraints.push({
      type: "exists",
      path: newPath,
      exists,
    });
    return exists;
  }

  /**
   * Evaluates the length of the current value (assumed to be an array), and
   * adds a constraint to the OpPlan to ensure that all future values will have
   * the same length.
   *
   * **WARNING**: avoid using this where possible, it causes OpPlans to split.
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

  // At runtime, __TrackedValueStep doesn't need to exist
  optimize() {
    return this.getDep(0);
  }
}

export type __TrackedValueStepWithDollars<
  TData = any,
  TInputType extends GraphQLInputType | undefined = undefined,
> = __TrackedValueStep<TData, TInputType> &
  (TInputType extends GraphQLInputObjectType
    ? {
        [key in keyof ReturnType<TInputType["getFields"]> &
          string as `$${key}`]: __TrackedValueStepWithDollars<
          TData extends { [k in key]: infer U } ? U : any,
          ReturnType<TInputType["getFields"]>[key]["type"]
        >;
      }
    : Record<string, never>);

function isArray(t: ReadonlyArray<any> | any): t is ReadonlyArray<any>;
function isArray(t: any): t is Array<any>;
function isArray(t: any): boolean {
  return Array.isArray(t);
}
