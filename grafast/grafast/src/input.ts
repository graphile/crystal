import type {
  ConstValueNode,
  GraphQLInputType,
  GraphQLType,
  ListTypeNode,
  NamedTypeNode,
  NonNullTypeNode,
  ValueNode,
} from "graphql";
import * as graphql from "graphql";

import type { OperationPlan } from "./engine/OperationPlan.js";
import { inspect } from "./inspect.js";
import type { AnyInputStep } from "./interfaces.js";
import { __InputDynamicScalarStep } from "./steps/__inputDynamicScalar.js";
import type { __InputObjectStepWithDollars } from "./steps/__inputObject.js";
import { __InputObjectStep } from "./steps/__inputObject.js";
import { __TrackedValueStepWithDollars } from "./steps/__trackedValue.js";
import {
  __InputListStep,
  __InputStaticLeafStep,
  __TrackedValueStep,
  constant,
} from "./steps/index.js";

const {
  assertScalarType,
  GraphQLError,
  GraphQLList,
  GraphQLNonNull,
  isInputType,
  isLeafType,
  isInputObjectType,
  Kind,
} = graphql;

export function assertInputStep(
  itemPlan: unknown,
): asserts itemPlan is AnyInputStep {
  if (itemPlan instanceof __TrackedValueStep) return;
  if (itemPlan instanceof __InputListStep) return;
  if (itemPlan instanceof __InputStaticLeafStep) return;
  if (itemPlan instanceof __InputObjectStep) return;
  throw new Error(`Expected an InputStep, but found ${itemPlan}`);
}

export function graphqlGetTypeForNode(
  operationPlan: OperationPlan,
  node: NamedTypeNode | ListTypeNode | NonNullTypeNode,
): GraphQLType {
  switch (node.kind) {
    case Kind.NAMED_TYPE: {
      const type = operationPlan.schema.getType(node.name.value);
      if (!type) {
        // Should not happen since the GraphQL operation has already been
        // validated against the schema.
        throw new Error(
          `Could not find type with name '${node.name.value}' in the schema`,
        );
      }
      return type;
    }
    case Kind.LIST_TYPE:
      return new GraphQLList(graphqlGetTypeForNode(operationPlan, node.type));
    case Kind.NON_NULL_TYPE:
      return new GraphQLNonNull(
        graphqlGetTypeForNode(operationPlan, node.type),
      );
    default: {
      const never: never = node;
      throw new Error(`Unknown node kind; node: ${inspect(never)}`);
    }
  }
}

/**
 * Returns a plan for the given `rawInputValue` AST node which could be a
 * variable or a literal, and could be nested so that a variable (or more than
 * one) appears somewhere. More than one plan may be created.
 *
 * @internal
 */
export function inputStep(
  operationPlan: OperationPlan,
  inputType: GraphQLInputType,
  rawInputValue: ValueNode | undefined,
  defaultValue: ConstValueNode | undefined = undefined,
): AnyInputStep {
  // This prevents recursion
  if (rawInputValue === undefined && defaultValue === undefined) {
    return constant(undefined);
  }

  const isObj = isInputObjectType(inputType);

  let inputValue = rawInputValue;
  if (inputValue?.kind === "Variable") {
    const variableName = inputValue.name.value;
    const variableDefinition =
      operationPlan.operation.variableDefinitions?.find(
        (def) => def.variable.name.value === variableName,
      );
    if (!variableDefinition) {
      // Should not happen since the GraphQL operation has already been
      // validated.
      throw new Error(`No definition for variable '${variableName}' found`);
    }
    const variableType = graphqlGetTypeForNode(
      operationPlan,
      variableDefinition.type,
    );
    if (!isInputType(variableType)) {
      throw new Error(`Expected varible type to be an input type`);
    }
    return inputVariablePlan(
      operationPlan,
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
    const valuePlan = inputStep(
      operationPlan,
      innerType,
      inputValue,
      undefined,
    );
    return inputNonNullPlan(operationPlan, valuePlan);
  } else if (inputType instanceof GraphQLList) {
    return new __InputListStep(inputType, inputValue);
  } else if (isLeafType(inputType)) {
    if (inputValue?.kind === Kind.OBJECT || inputValue?.kind === Kind.LIST) {
      const scalarType = assertScalarType(inputType);
      return new __InputDynamicScalarStep(scalarType, inputValue);
    } else {
      // Variable is already ruled out, so it must be one of: Kind.INT | Kind.FLOAT | Kind.STRING | Kind.BOOLEAN | Kind.NULL | Kind.ENUM
      // none of which can contain a variable:
      return new __InputStaticLeafStep(inputType, inputValue);
    }
  } else if (isObj) {
    return new __InputObjectStep(
      inputType,
      inputValue,
    ) as __InputObjectStepWithDollars<any>;
  } else {
    const never: never = inputType;
    throw new Error(`Unsupported type in inputPlan: '${inspect(never)}'`);
  }
}

function doTypesMatch(
  variableType: GraphQLInputType,
  expectedType: GraphQLInputType,
): boolean {
  if (
    variableType instanceof GraphQLNonNull &&
    expectedType instanceof GraphQLNonNull
  ) {
    return doTypesMatch(variableType.ofType, expectedType.ofType);
  } else if (variableType instanceof GraphQLNonNull) {
    // Variable is stricter than input type, that's fine
    return doTypesMatch(variableType.ofType, expectedType);
  } else if (
    variableType instanceof GraphQLList &&
    expectedType instanceof GraphQLList
  ) {
    return doTypesMatch(variableType.ofType, expectedType.ofType);
  } else {
    return variableType === expectedType;
  }
}

function inputVariablePlan(
  operationPlan: OperationPlan,
  variableName: string,
  variableType: GraphQLInputType,
  inputType: GraphQLInputType,
  defaultValue: ConstValueNode | undefined = undefined,
): AnyInputStep {
  if (
    variableType instanceof GraphQLNonNull &&
    !(inputType instanceof GraphQLNonNull)
  ) {
    const unwrappedVariableType = variableType.ofType;
    return inputVariablePlan(
      operationPlan,
      variableName,
      unwrappedVariableType,
      inputType,
      defaultValue,
    );
  }
  const typesMatch = doTypesMatch(variableType, inputType);
  if (!typesMatch) {
    // REF: https://spec.graphql.org/draft/#IsVariableUsageAllowed()
    if (
      inputType instanceof GraphQLNonNull &&
      !(variableType instanceof GraphQLNonNull)
    ) {
      const variablePlan = inputVariablePlan(
        operationPlan,
        variableName,
        variableType,
        inputType.ofType,
        defaultValue,
      );
      if (variablePlan.evalIs(null) || variablePlan.evalIs(undefined)) {
        throw new GraphQLError(
          `Expected non-null value of type ${inputType.ofType.toString()}`,
          // FIXME: The error here needs more details to make it conform to spec (AST nodes, etc). At least I think so?
        );
      }
      return variablePlan;
    }
    throw new Error("Expected variable and input types to match");
  }
  const variableValuePlan =
    operationPlan.trackedVariableValuesStep.get(variableName);
  if (defaultValue === undefined || !variableValuePlan.evalIs(undefined)) {
    // There's no default value, or we know for sure that our variable will be
    // set (even if null) and thus the default will not be used; use the variable.
    return variableValuePlan;
  } else {
    // `defaultValue` is NOT undefined, and we know variableValue is
    // `undefined` (and always will be); we're going to loop back and pretend
    // that no value was passed in the first place (instead of the variable):
    return inputStep(operationPlan, inputType, undefined, defaultValue);
  }
}

/**
 * Implements `InputNonNullStep`.
 */
function inputNonNullPlan(
  _operationPlan: OperationPlan,
  innerPlan: AnyInputStep,
): AnyInputStep {
  return innerPlan;
}
