import * as assert from "assert";
import type {
  GraphQLInputType,
  GraphQLLeafType,
  GraphQLType,
  ListTypeNode,
  NamedTypeNode,
  NonNullTypeNode,
  ValueNode,
} from "graphql";
import { valueFromAST } from "graphql";
import {
  coerceInputValue,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  isInputType,
  isLeafType,
} from "graphql";
import { inspect } from "util";

import type { Aether } from "./aether";
import { ExecutablePlan } from "./plan";
import type { __TrackedObjectPlan } from "./plans";
import { defaultValueToValueNode } from "./utils";

export type InputPlan =
  | __TrackedObjectPlan // .get(), .eval(), .evalIs(), .evalHas(), .at(), .evalLength()
  | InputListPlan // .at(), .eval(), .evalLength(), .evalIs(null)
  | InputStaticLeafPlan // .eval(), .evalIs()
  | InputObjectPlan; // .get(), .eval(), .evalHas(), .evalIs(null)

function graphqlGetTypeForNode(
  aether: Aether,
  node: NamedTypeNode | ListTypeNode | NonNullTypeNode,
): GraphQLType {
  switch (node.kind) {
    case "NamedType": {
      const type = aether.schema.getType(node.name.value);
      if (!type) {
        // Should not happen since the GraphQL operation has already been
        // validated against the schema.
        throw new Error(
          `Could not find type with name '${node.name.value}' in the schema`,
        );
      }
      return type;
    }
    case "ListType":
      return new GraphQLList(graphqlGetTypeForNode(aether, node.type));
    case "NonNullType":
      return new GraphQLNonNull(graphqlGetTypeForNode(aether, node.type));
    default: {
      const never: never = node;
      throw new Error(`Unknown node kind; node: ${inspect(never)}`);
    }
  }
}

export function inputPlan(
  aether: Aether,
  inputType: GraphQLInputType,
  rawInputValue: ValueNode | undefined,
  defaultValue: ValueNode | undefined = undefined,
): InputPlan {
  let inputValue = rawInputValue;
  if (inputValue?.kind === "Variable") {
    const variableName = inputValue.name.value;
    const variableDefinition = aether.operation.variableDefinitions?.find(
      (def) => def.variable.name.value === variableName,
    );
    if (!variableDefinition) {
      // Should not happen since the GraphQL operation has already been
      // validated.
      throw new Error(`No definition for variable '${variableName}' found`);
    }
    const variableType = graphqlGetTypeForNode(aether, variableDefinition.type);
    if (!isInputType(variableType)) {
      throw new Error(`Expected varible type to be an input type`);
    }
    return inputVariablePlan(
      aether,
      variableName,
      variableType,
      inputType,
      defaultValue,
    );
  }
  // Note: past here we know whether `defaultValue` will be used or not because
  // we know `inputValue` is not a variable.
  inputValue = inputValue ?? defaultValue;
  if (inputType instanceof GraphQLNonNull) {
    const innerType = inputType.ofType;
    const valuePlan = inputPlan(aether, innerType, inputValue);
    return inputNonNullPlan(aether, valuePlan);
  } else if (inputType instanceof GraphQLList) {
    return new InputListPlan(inputType, inputValue);
  } else if (isLeafType(inputType)) {
    return new InputStaticLeafPlan(inputType, inputValue);
  } else if (inputType instanceof GraphQLInputObjectType) {
    return new InputObjectPlan(inputType, inputValue);
  } else {
    const never: never = inputType;
    throw new Error(`Unsupported type in inputPlan: '${inspect(never)}'`);
  }
}

function doTypesMatch(a: GraphQLInputType, b: GraphQLInputType): boolean {
  if (a instanceof GraphQLNonNull && b instanceof GraphQLNonNull) {
    return doTypesMatch(a.ofType, b.ofType);
  } else if (a instanceof GraphQLList && b instanceof GraphQLList) {
    return doTypesMatch(a.ofType, b.ofType);
  } else {
    return a === b;
  }
}

function inputVariablePlan(
  aether: Aether,
  variableName: string,
  variableType: GraphQLInputType,
  inputType: GraphQLInputType,
  defaultValue: ValueNode | undefined = undefined,
): InputPlan {
  if (
    variableType instanceof GraphQLNonNull &&
    !(inputType instanceof GraphQLNonNull)
  ) {
    const unwrappedVariableType = variableType.ofType;
    return inputVariablePlan(
      aether,
      variableName,
      unwrappedVariableType,
      inputType,
      defaultValue,
    );
  }
  const typesMatch = doTypesMatch(variableType, inputType);
  assert.ok(typesMatch, "Expected variable and input types to match");
  const variableValuePlan = aether.trackedVariableValuesPlan.get(variableName);
  if (defaultValue === undefined || !variableValuePlan.evalIs(undefined)) {
    // There's no default value, or we know for sure that our variable will be
    // set (even if null) and thus the default will not be used; use the variable.
    return variableValuePlan;
  } else {
    // `defaultValue` is NOT undefined, and we know variableValue is
    // `undefined` (and always will be); we're going to loop back and pretend
    // that no value was passed in the first place (instead of the variable):
    return inputPlan(aether, inputType, undefined, defaultValue);
  }
}

/**
 * Implements `InputNonNullPlan`.
 */
function inputNonNullPlan(_aether: Aether, innerPlan: InputPlan): InputPlan {
  return innerPlan;
}

/**
 * Implements `InputListPlan`.
 */
class InputListPlan extends ExecutablePlan {
  private itemPlans: InputPlan[] = [];
  private outOfBoundsPlan: InputPlan;

  constructor(
    inputType: GraphQLList<GraphQLInputType>,
    private readonly inputValues: ValueNode | undefined,
  ) {
    super();
    assert.ok(
      inputType instanceof GraphQLList,
      "Expected inputType to be a List",
    );
    const innerType = inputType.ofType;
    // TODO: should we coerce to list here?
    if (inputValues && inputValues.kind === "ListValue") {
      const values = inputValues.values;
      for (
        let inputValueIndex = 0, inputValuesLength = values.length;
        inputValueIndex < inputValuesLength;
        inputValueIndex++
      ) {
        const inputValue = values[inputValueIndex];
        const innerPlan = inputPlan(this.aether, innerType, inputValue);
        this.itemPlans.push(innerPlan);
      }
    }
    // TODO: is `outOfBoundsPlan` safe? Maybe it was before we simplified
    // `InputNonNullPlan`, but maybe it's not safe any more?
    this.outOfBoundsPlan = inputPlan(this.aether, innerType, undefined);
  }

  execute(values: any[][]): any[] {
    const { inputValues } = this;

    /**
     * All the results will be the same, so generate them once and then share
     * them with everyone.
     */
    let eachResult;
    if (inputValues?.kind === "NullValue") {
      eachResult = null;
    } else {
      const itemPlansLength = this.itemPlans.length;
      const list = new Array(itemPlansLength);
      for (
        let itemPlanIndex = 0;
        itemPlanIndex < itemPlansLength;
        itemPlanIndex++
      ) {
        const itemPlan = this.itemPlans[itemPlanIndex];
        const value = itemPlan.eval();
        list[itemPlanIndex] = value;
      }
      eachResult = list;
    }

    return new Array(values.length).fill(eachResult);
  }

  at(index: number): InputPlan {
    return this.itemPlans[index] || this.outOfBoundsPlan;
  }

  eval(): any[] | null {
    if (this.inputValues?.kind === "NullValue") {
      return null;
    }
    const itemPlansLength = this.itemPlans.length;
    const list = new Array(itemPlansLength);
    for (
      let itemPlanIndex = 0;
      itemPlanIndex < itemPlansLength;
      itemPlanIndex++
    ) {
      const itemPlan = this.itemPlans[itemPlanIndex];
      const value = itemPlan.eval();
      list[itemPlanIndex] = value;
    }
    return list;
  }

  evalIs(value: null | undefined): boolean {
    if (value === undefined) {
      return this.inputValues === value;
    } else if (value === null) {
      return this.inputValues?.kind === "NullValue";
    } else {
      throw new Error(
        "InputListPlan cannot evalIs values other than null and undefined currently",
      );
    }
  }
}

/**
 * Implements `InputStaticLeafPlan`
 */
class InputStaticLeafPlan extends ExecutablePlan {
  private readonly coercedValue: any;
  constructor(inputType: GraphQLLeafType, value: ValueNode | undefined) {
    super();
    // `coerceInputValue` throws on coercion failure. NOTE: it's only safe for
    // us to call coerceInputValue because we already know this is a scalar and
    // *not* a variable. Otherwise we'd need to process it via
    // aether.trackedVariableValuesPlan.
    this.coercedValue = value != null ? valueFromAST(value, inputType) : value;
  }

  execute(values: any[][]): any[] {
    return new Array(values.length).fill(this.coercedValue);
  }

  eval(): any {
    return this.coercedValue;
  }

  evalIs(expectedValue: any): boolean {
    return this.coercedValue === expectedValue;
  }
}

/**
 * Implements `InputObjectPlan`
 */
export class InputObjectPlan extends ExecutablePlan {
  private inputFields: {
    [fieldName: string]: { dependencyIndex: number; plan: InputPlan };
  } = {};
  constructor(
    private inputObjectType: GraphQLInputObjectType,
    private inputValues: ValueNode | undefined,
  ) {
    super();
    const inputFieldDefinitions = inputObjectType.getFields();
    const inputFields =
      inputValues?.kind === "ObjectValue" ? inputValues.fields : undefined;
    for (const inputFieldName in inputFieldDefinitions) {
      const inputFieldDefinition = inputFieldDefinitions[inputFieldName];
      const inputFieldType = inputFieldDefinition.type;
      const defaultValue = defaultValueToValueNode(
        inputFieldType,
        inputFieldDefinition.defaultValue,
      );
      const inputFieldValue = inputFields?.find(
        (val) => val.name.value === inputFieldName,
      );
      const plan = inputPlan(
        this.aether,
        inputFieldType,
        inputFieldValue?.value,
        defaultValue,
      );
      this.inputFields[inputFieldName] = {
        plan,
        dependencyIndex: this.addDependency(plan),
      };
    }
  }

  execute(values: any[][]): any[] {
    if (this.inputValues?.kind === "NullValue") {
      return new Array(values.length).fill(null);
    }
    return values.map((planResults) => {
      const resultValues = {};
      for (const inputFieldName in this.inputFields) {
        const { dependencyIndex } = this.inputFields[inputFieldName];
        if (dependencyIndex == null) {
          throw new Error("inputFieldPlan has gone missing.");
        }
        const value = planResults[dependencyIndex];
        resultValues[inputFieldName] = value;
      }
      return resultValues;
    });
  }

  get(attrName: string): InputPlan {
    const plan = this.inputFields[attrName]?.plan;
    if (plan === undefined) {
      throw new Error(
        `Tried to '.get("${attrName}")', but no such attribute exists on ${this.inputObjectType.name}`,
      );
    }
    return plan;
  }

  eval(): any {
    if (this.inputValues?.kind === "NullValue") {
      return null;
    }
    const resultValues = {};
    for (const inputFieldName in this.inputFields) {
      const inputFieldPlan = this.inputFields[inputFieldName].plan;
      resultValues[inputFieldName] = inputFieldPlan.eval();
    }
    return resultValues;
  }

  evalIs(value: null | undefined): boolean {
    if (value === undefined) {
      return this.inputValues === value;
    } else if (value === null) {
      return this.inputValues?.kind === "NullValue";
    } else {
      throw new Error(
        "InputObjectPlan cannot evalIs values other than null and undefined currently",
      );
    }
  }

  // Written without consulting spec.
  evalHas(attrName: string): boolean {
    if (!this.inputValues) {
      return false;
    }
    if (this.inputValues.kind === "NullValue") {
      return false;
    }
    if (!(attrName in this.inputFields)) {
      return false;
    }
    return !this.inputFields[attrName].plan.evalIs(undefined);
  }
}
