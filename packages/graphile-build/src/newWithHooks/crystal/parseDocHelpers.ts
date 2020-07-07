import { SelectionNode, DirectiveNode, ValueNode } from "graphql";
import { GraphQLVariables } from "./interfaces";

/**
 * Gets the value from a ValueNode, extracting from a variable if necessary.
 *
 * @remarks
 * Currently only supports boolean for `@include(if: ...)` / `@skip(if: ...)`
 */
function getValue(
  value: ValueNode,
  variables: TrackedObject<GraphQLVariables>,
): boolean {
  switch (value.kind) {
    case "BooleanValue": {
      return value.value;
    }
    case "Variable": {
      return variables.get(value.name.value) as boolean;
    }
    default: {
      throw new Error(
        `Sorry, we don't current support getting value from '${value.kind}'`,
      );
    }
  }
}

/**
 * Gets the value of the argument of a directive, extracting from variables if
 * necessary.
 *
 * @remarks
 * Currently only supports boolean for `@include(if: ...)` / `@skip(if: ...)`
 */
function getDirectiveArgument(
  directive: DirectiveNode,
  argName: string,
  variables: TrackedObject<GraphQLVariables>,
): boolean | undefined {
  if (!directive.arguments) {
    return undefined;
  }
  for (const arg of directive.arguments) {
    if (argName === arg.name.value) {
      return getValue(arg.value, variables);
    }
  }
  return undefined;
}

/**
 * Looks for `@include(if: ...)` / `@skip(if: ...)` directives and returns true
 * if should skip; otherwise false.
 */
export function shouldSkip(
  selection: SelectionNode,
  variables: TrackedObject<GraphQLVariables>,
): boolean {
  if (selection.directives) {
    for (const directive of selection.directives) {
      if (directive.name.value === "include") {
        const ifVal = getDirectiveArgument(directive, "if", variables);
        return ifVal !== false;
      } else if (directive.name.value === "skip") {
        const ifVal = getDirectiveArgument(directive, "if", variables);
        return ifVal === true;
      } else {
        /* We don't know about this directive; ignore */
      }
    }
  }
  return false;
}
