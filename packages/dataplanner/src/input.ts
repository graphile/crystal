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
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  isInputType,
  isLeafType,
  Kind,
} from "graphql";
import { inspect } from "util";

import type { Aether } from "./aether.js";
import * as assert from "./assert.js";
import { __InputDynamicScalarPlan } from "./plans/__inputDynamicScalar.js";
import { __InputObjectPlan } from "./plans/__inputObject.js";
import {
  __InputListPlan,
  __InputStaticLeafPlan,
  __TrackedObjectPlan,
} from "./plans/index.js";

// TODO: should this have `__` prefix?
export type InputPlan =
  | __TrackedObjectPlan // .get(), .eval(), .evalIs(), .evalHas(), .at(), .evalLength()
  | __InputListPlan // .at(), .eval(), .evalLength(), .evalIs(null)
  | __InputStaticLeafPlan // .eval(), .evalIs()
  | __InputDynamicScalarPlan // .eval(), .evalIs()
  | __InputObjectPlan; // .get(), .eval(), .evalHas(), .evalIs(null)

export function assertInputPlan(
  itemPlan: unknown,
): asserts itemPlan is InputPlan {
  if (itemPlan instanceof __TrackedObjectPlan) return;
  if (itemPlan instanceof __InputListPlan) return;
  if (itemPlan instanceof __InputStaticLeafPlan) return;
  if (itemPlan instanceof __InputObjectPlan) return;
  throw new Error(`Expected an InputPlan, but found ${itemPlan}`);
}

export function graphqlGetTypeForNode(
  aether: Aether,
  node: NamedTypeNode | ListTypeNode | NonNullTypeNode,
): GraphQLType {
  switch (node.kind) {
    case Kind.NAMED_TYPE: {
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
    case Kind.LIST_TYPE:
      return new GraphQLList(graphqlGetTypeForNode(aether, node.type));
    case Kind.NON_NULL_TYPE:
      return new GraphQLNonNull(graphqlGetTypeForNode(aether, node.type));
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
    return new __InputListPlan(inputType, inputValue);
  } else if (isLeafType(inputType)) {
    if (inputValue?.kind === Kind.OBJECT || inputValue?.kind === Kind.LIST) {
      const scalarType = assertScalarType(inputType);
      // TODO: should tidy this up somewhat. (Mostly it's for handling JSON
      // scalars that have variables in subfields.)
      return new __InputDynamicScalarPlan(scalarType, inputValue);
    } else {
      // Variable is already ruled out, so it must be one of: Kind.INT | Kind.FLOAT | Kind.STRING | Kind.BOOLEAN | Kind.NULL | Kind.ENUM
      // none of which can contain a variable:
      return new __InputStaticLeafPlan(inputType, inputValue);
    }
  } else if (inputType instanceof GraphQLInputObjectType) {
    return new __InputObjectPlan(inputType, inputValue);
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
