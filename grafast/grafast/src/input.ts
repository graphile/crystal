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
import { __InputDefaultStep } from "./steps/__inputDefault.js";
import { __InputDynamicScalarStep } from "./steps/__inputDynamicScalar.js";
import type { __InputObjectStepWithDollars } from "./steps/__inputObject.js";
import { __InputObjectStep } from "./steps/__inputObject.js";
import { __inputStaticLeaf } from "./steps/__inputStaticLeaf.js";
import { __TrackedValueStepWithDollars } from "./steps/__trackedValue.js";
import {
  __InputListStep,
  __InputStaticLeafStep,
  __TrackedValueStep,
  constant,
} from "./steps/index.js";
import {
  findVariableNamesUsedInValueNode,
  valueNodeToStaticValue,
} from "./utils.js";

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
  inputValue: ValueNode | undefined,
  defaultValue: ConstValueNode | undefined = undefined,
): AnyInputStep {
  let c1 = operationPlan._inputStepCache.get(inputType);
  if (!c1) {
    c1 = new Map();
    operationPlan._inputStepCache.set(inputType, c1);
  }
  let c2 = c1.get(inputValue);
  if (!c2) {
    c2 = new Map();
    c1.set(inputValue, c2);
  }
  let c3 = c2.get(defaultValue);
  if (c3) return c3;
  c3 = _inputStep(operationPlan, inputType, inputValue, defaultValue);
  c2.set(defaultValue, c3);
  return c3;
}

function _inputStep(
  operationPlan: OperationPlan,
  inputType: GraphQLInputType,
  inputValue: ValueNode | undefined,
  defaultValue: ConstValueNode | undefined,
): AnyInputStep {
  const { valueNodeToStaticValueCache } = operationPlan;
  if (inputValue === undefined) {
    // Definitely can't be or contain a variable!
    if (defaultValue === undefined) {
      return constant(undefined);
    } else {
      return valueNodeToCachedStaticValueConstantStep(
        valueNodeToStaticValueCache,
        defaultValue,
        inputType,
      );
    }
  }

  const isObj = isInputObjectType(inputType);

  if (inputValue.kind === "Variable") {
    // Note: this is the only other place where `defaultValue` might be used
    // we know `inputValue` is not a variable.
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
    const variableWillDefinitelyBeSet =
      variableType instanceof GraphQLNonNull ||
      variableDefinition.defaultValue != null;
    return inputVariablePlan(
      operationPlan,
      variableName,
      variableType,
      inputType,
      defaultValue,
      variableWillDefinitelyBeSet,
    );
  } else if (inputType instanceof GraphQLNonNull) {
    const innerType = inputType.ofType;
    if (inputValue.kind === Kind.NULL) {
      throw new Error(
        `Null found in non-null position; this should have been prevented by validation.`,
      );
    }
    const valuePlan = inputStep(
      operationPlan,
      innerType,
      inputValue,
      undefined,
    );
    return inputNonNullPlan(operationPlan, valuePlan);
  } else if (inputValue.kind === Kind.NULL) {
    return constant(null);
  } else if (inputType instanceof GraphQLList) {
    const variableNames = new Set<string>();
    findVariableNamesUsedInValueNode(inputValue, variableNames);
    if (variableNames.size === 0) {
      return valueNodeToCachedStaticValueConstantStep(
        valueNodeToStaticValueCache,
        inputValue,
        inputType,
      );
    }
    return new __InputListStep(inputType, inputValue);
  } else if (isLeafType(inputType)) {
    if (inputValue?.kind === Kind.OBJECT || inputValue?.kind === Kind.LIST) {
      const scalarType = assertScalarType(inputType);
      return new __InputDynamicScalarStep(scalarType, inputValue);
    } else {
      // Variable is already ruled out, so it must be one of: Kind.INT | Kind.FLOAT | Kind.STRING | Kind.BOOLEAN | Kind.NULL | Kind.ENUM
      // none of which can contain a variable:
      return __inputStaticLeaf(inputType, inputValue);
    }
  } else if (isObj) {
    return new __InputObjectStep(
      inputType,
      inputValue,
    ) as __InputObjectStepWithDollars;
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

/**
 * Returns a step representing a variable's value.
 *
 * @param operationPlan -
 * @param variableName -
 * @param variableType -
 * @param inputType -
 * @param defaultValue -
 * @param variableWillDefinitelyBeSet - If `true` the variable is either
 * non-null _or_ it has a default value (including null). In this case, the
 * variable will never be `undefined` and thus an input position's defaultValue
 * will never be invoked where it is used.
 */
function inputVariablePlan(
  operationPlan: OperationPlan,
  variableName: string,
  variableType: GraphQLInputType,
  inputType: GraphQLInputType,
  defaultValue: ConstValueNode | undefined,
  variableWillDefinitelyBeSet: boolean,
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
      variableWillDefinitelyBeSet,
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
        variableWillDefinitelyBeSet,
      );
      // TODO: find a way to do this without doing eval. For example: track list of variables that may not be nullish.
      if (
        variablePlan.evalIs(null) ||
        (!variableWillDefinitelyBeSet && variablePlan.evalIs(undefined))
      ) {
        throw new GraphQLError(
          `Expected non-null value of type ${inputType.ofType.toString()}`,
          // FIXME: The error here needs more details to make it conform to spec (AST nodes, etc). At least I think so?
        );
      }
      return variablePlan;
    }
    throw new Error("Expected variable and input types to match");
  }
  const $variableValue =
    operationPlan.trackedVariableValuesStep.get(variableName);
  if (defaultValue === undefined) {
    // There's no default value and thus the default will not be used; use the variable.
    return $variableValue;
  } else if (variableWillDefinitelyBeSet) {
    // The variable will DEFINITELY be set (even if it is set to null, possibly
    // by a default), so the input position's default value will never apply.
    return $variableValue;
  } else {
    // Here:
    // - the variable is nullable, optional, and has no default value
    // - the input position has a default value
    // We thus need a step that results in `variableValue === undefined ? defaultValue : variableValue`
    const runtimeDefaultValue = valueNodeToStaticValue(defaultValue, inputType);
    return new __InputDefaultStep($variableValue, runtimeDefaultValue);
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

function valueNodeToCachedStaticValueConstantStep(
  cache: Map<ValueNode, AnyInputStep>,
  valueNode: ValueNode,
  inputType: GraphQLInputType,
) {
  let step = cache.get(valueNode);
  if (!step) {
    step = constant(valueNodeToStaticValue(valueNode, inputType), false);
    cache.set(valueNode, step);
  }
  return step;
}
