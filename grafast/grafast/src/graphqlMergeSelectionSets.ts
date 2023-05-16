import type {
  FieldNode,
  GraphQLObjectType,
  NamedTypeNode,
  SelectionNode,
} from "graphql";
import * as graphql from "graphql";

import type { OperationPlan } from "./index.js";
import { inspect } from "./inspect.js";

const { Kind } = graphql;

// PERF: this is incredibly inefficient
function typeMatchesCondition(
  operationPlan: OperationPlan,
  type: GraphQLObjectType,
  condition: NamedTypeNode,
) {
  const name = condition.name.value;
  if (type.name === name) {
    return true;
  }
  if (type.getInterfaces().some((i) => i.name === name)) {
    return true;
  }
  if (
    operationPlan.unionsContainingObjectType[type.name].some(
      (u) => u.name === name,
    )
  ) {
    return true;
  }
  return false;
}

/**
 * Given a list of polymorphic selections, return a list of the nested field
 * selections that apply to the object type `type`.
 */
export function fieldSelectionsForType(
  operationPlan: OperationPlan,
  type: GraphQLObjectType,
  selections: ReadonlyArray<SelectionNode>,
  result: Array<FieldNode> = [],
): ReadonlyArray<FieldNode> {
  for (let i = 0, l = selections.length; i < l; i++) {
    const selection = selections[i];
    switch (selection.kind) {
      case Kind.FRAGMENT_SPREAD: {
        // Assumed to exist because query passed validation.
        const fragment = operationPlan.fragments[selection.name.value];
        const typeCondition = fragment.typeCondition;
        if (typeMatchesCondition(operationPlan, type, typeCondition)) {
          fieldSelectionsForType(
            operationPlan,
            type,
            fragment.selectionSet.selections,
            result,
          );
        }
        break;
      }
      case Kind.INLINE_FRAGMENT: {
        const typeCondition = selection.typeCondition;
        if (
          !typeCondition ||
          typeMatchesCondition(operationPlan, type, typeCondition)
        ) {
          fieldSelectionsForType(
            operationPlan,
            type,
            selection.selectionSet.selections,
            result,
          );
        }
        break;
      }
      case Kind.FIELD: {
        result.push(selection);
        break;
      }
      default: {
        const never: never = selection;
        throw new Error(
          `GrafastInternalError<10b01e35-cf2b-4f48-9c66-486cdef00323>: cannot process selection '${inspect(
            never,
          )}'`,
        );
      }
    }
  }
  return result;
}
