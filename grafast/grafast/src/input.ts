import type {
  GraphQLInputType,
  GraphQLType,
  ListTypeNode,
  NamedTypeNode,
  NonNullTypeNode,
  ValueNode,
} from "graphql";
import {
  assertScalarType,
  GraphQLError,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  isInputType,
  isLeafType,
  Kind,
} from "graphql";

import { withGlobalLayerPlan } from "./engine/lib/withGlobalLayerPlan.js";
import type { OperationPlan } from "./engine/OperationPlan.js";
import { inspect } from "./inspect.js";
import { __InputDynamicScalarStep } from "./steps/__inputDynamicScalar.js";
import { __InputObjectStep } from "./steps/__inputObject.js";
import type { ConstantStep } from "./steps/index.js";
import {
  __InputListStep,
  __InputStaticLeafStep,
  __TrackedObjectStep,
  constant,
} from "./steps/index.js";

// TODO: should this have `__` prefix?
export type InputStep =
  | __TrackedObjectStep // .get(), .eval(), .evalIs(), .evalHas(), .at(), .evalLength(), .evalIsEmpty()
  | __InputListStep // .at(), .eval(), .evalLength(), .evalIs(null)
  | __InputStaticLeafStep // .eval(), .evalIs()
  | __InputDynamicScalarStep // .eval(), .evalIs()
  | __InputObjectStep // .get(), .eval(), .evalHas(), .evalIs(null), .evalIsEmpty()
  | ConstantStep<undefined>; // .eval(), .evalIs(), .evalIsEmpty()

export function assertInputStep(
  itemPlan: unknown,
): asserts itemPlan is InputStep {
  if (itemPlan instanceof __TrackedObjectStep) return;
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

// TODO: rename to 'inputStep'
/**
 * Returns a plan for the given `rawInputValue` AST node which could be a
 * variable or a literal, and could be nested so that a variable (or more than
 * one) appears somewhere. More than one plan may be created.
 *
 * @internal
 */
export function inputPlan(
  operationPlan: OperationPlan,
  inputType: GraphQLInputType,
  seenTypes: Set<GraphQLInputType>,
  rawInputValue: ValueNode | undefined,
  defaultValue: ValueNode | undefined = undefined,
): InputStep {
  if (rawInputValue === undefined && defaultValue === undefined) {
    return constant(undefined);
  }

  if (seenTypes.has(inputType)) {
    // TODO: Stop recursion if no data
  } else {
    seenTypes.add(inputType);
  }

  return withGlobalLayerPlan(
    operationPlan.rootLayerPlan,
    operationPlan.rootLayerPlan.polymorphicPaths,
    () => {
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
          seenTypes,
          inputType,
          defaultValue,
        );
      }
      // Note: past here we know whether `defaultValue` will be used or not because
      // we know `inputValue` is not a variable.
      inputValue = inputValue ?? defaultValue;
      if (inputType instanceof GraphQLNonNull) {
        const innerType = inputType.ofType;
        const valuePlan = inputPlan(
          operationPlan,
          innerType,
          seenTypes,
          inputValue,
        );
        return inputNonNullPlan(operationPlan, valuePlan);
      } else if (inputType instanceof GraphQLList) {
        return new __InputListStep(inputType, seenTypes, inputValue);
      } else if (isLeafType(inputType)) {
        if (
          inputValue?.kind === Kind.OBJECT ||
          inputValue?.kind === Kind.LIST
        ) {
          const scalarType = assertScalarType(inputType);
          // TODO: should tidy this up somewhat. (Mostly it's for handling JSON
          // scalars that have variables in subfields.)
          return new __InputDynamicScalarStep(scalarType, inputValue);
        } else {
          // Variable is already ruled out, so it must be one of: Kind.INT | Kind.FLOAT | Kind.STRING | Kind.BOOLEAN | Kind.NULL | Kind.ENUM
          // none of which can contain a variable:
          return new __InputStaticLeafStep(inputType, inputValue);
        }
      } else if (inputType instanceof GraphQLInputObjectType) {
        return new __InputObjectStep(inputType, seenTypes, inputValue);
      } else {
        const never: never = inputType;
        throw new Error(`Unsupported type in inputPlan: '${inspect(never)}'`);
      }
    },
  );
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
  operationPlan: OperationPlan,
  variableName: string,
  variableType: GraphQLInputType,
  seenTypes: Set<GraphQLInputType>,
  inputType: GraphQLInputType,
  defaultValue: ValueNode | undefined = undefined,
): InputStep {
  if (
    variableType instanceof GraphQLNonNull &&
    !(inputType instanceof GraphQLNonNull)
  ) {
    const unwrappedVariableType = variableType.ofType;
    return inputVariablePlan(
      operationPlan,
      variableName,
      unwrappedVariableType,
      seenTypes,
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
        seenTypes,
        inputType.ofType,
        defaultValue,
      );
      if (variablePlan.evalIs(null) || variablePlan.evalIs(undefined)) {
        // TODO: Proper GraphQL error here
        throw new GraphQLError(
          `Expected non-null value of type ${inputType.ofType.toString()}`,
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
    return inputPlan(
      operationPlan,
      inputType,
      seenTypes,
      undefined,
      defaultValue,
    );
  }
}

/**
 * Implements `InputNonNullStep`.
 */
function inputNonNullPlan(
  _operationPlan: OperationPlan,
  innerPlan: InputStep,
): InputStep {
  return innerPlan;
}
