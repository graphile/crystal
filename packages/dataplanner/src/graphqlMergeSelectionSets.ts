import type {
  FieldNode,
  GraphQLInterfaceType,
  GraphQLObjectType,
  NamedTypeNode,
  SelectionNode,
} from "graphql";
import { Kind } from "graphql";
import { inspect } from "util";

import type { OperationPlan } from "./index.js";

/**
 * Given a list of object types and a list of selections, returns only the
 * types that may be queried in that selection (e.g. because there's a type
 * fragment on them or on one of the interfaces they implement).
 */
export function typesUsedInSelections(
  operationPlan: OperationPlan,
  types: ReadonlyArray<GraphQLObjectType>,
  selections: ReadonlyArray<SelectionNode>,
): GraphQLObjectType[] {
  const typeNamesMap: { [typeName: string]: true } = Object.create(null);
  for (let i = 0, l = selections.length; i < l; i++) {
    const selection = selections[i];
    switch (selection.kind) {
      case "FragmentSpread": {
        // Assumed to exist because query passed validation.
        const fragment = operationPlan.fragments[selection.name.value];
        const typeCondition = fragment.typeCondition;
        typeNamesMap[typeCondition.name.value] = true;
        break;
      }
      case "InlineFragment": {
        const typeCondition = selection.typeCondition;
        if (typeCondition) {
          typeNamesMap[typeCondition.name.value] = true;
        }
        break;
      }
      default: {
        /* noop */
      }
    }
  }
  // Return types with matching names, or where they have an interface with a
  // matching name, or where they belong to a union with a matching name
  return types.filter(
    (t) =>
      typeNamesMap[t.name] ||
      t.getInterfaces().some((i) => typeNamesMap[i.name]) ||
      operationPlan.unionsContainingObjectType[t.name].some(
        (u) => typeNamesMap[u.name],
      ),
  );
}

// TODO:perf: this is incredibly inefficient
function typeMatchesCondition(
  operationPlan: OperationPlan,
  type: GraphQLObjectType,
  condition: NamedTypeNode,
) {
  if (type.name === condition.name.value) {
    return true;
  }
  if (type.getInterfaces().some((i) => i.name === condition.name.value)) {
    return true;
  }
  if (
    operationPlan.unionsContainingObjectType[type.name].some(
      (u) => u.name === condition.name.value,
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
          `GraphileInternalError<10b01e35-cf2b-4f48-9c66-486cdef00323>: cannot process selection '${inspect(
            never,
          )}'`,
        );
      }
    }
  }
  return result;
}

/**
 * Given an interface type and a list of selections, returns true if any
 * non-introspection fields are queried on the interface (or any of the
 * interfaces it implements), false otherwise.
 */
export function interfaceTypeHasNonIntrospectionFieldQueriedInSelections(
  operationPlan: OperationPlan,
  interfaceType: GraphQLInterfaceType,
  selections: readonly SelectionNode[],
): boolean {
  const types = [interfaceType, ...interfaceType.getInterfaces()];
  for (let i = 0, l = selections.length; i < l; i++) {
    const selection = selections[i];
    switch (selection.kind) {
      case Kind.FRAGMENT_SPREAD: {
        // Assumed to exist because query passed validation.
        const fragment = operationPlan.fragments[selection.name.value];
        const typeCondition = fragment.typeCondition;
        const matchingInterfaceType = types.find(
          (t) => t.name === typeCondition.name.value,
        );
        if (matchingInterfaceType && fragment.selectionSet.selections) {
          const result =
            interfaceTypeHasNonIntrospectionFieldQueriedInSelections(
              operationPlan,
              matchingInterfaceType,
              fragment.selectionSet.selections,
            );
          if (result) {
            return true;
          }
        }
        break;
      }
      case Kind.INLINE_FRAGMENT: {
        const typeCondition = selection.typeCondition;
        if (typeCondition) {
          const matchingInterfaceType = types.find(
            (t) => t.name === typeCondition.name.value,
          );
          if (matchingInterfaceType && selection.selectionSet.selections) {
            const result =
              interfaceTypeHasNonIntrospectionFieldQueriedInSelections(
                operationPlan,
                matchingInterfaceType,
                selection.selectionSet.selections,
              );
            if (result) {
              return true;
            }
          }
        }
        break;
      }
      case Kind.FIELD: {
        const fieldName = selection.name.value;
        if (!fieldName.startsWith("__")) {
          return true;
        }
        break;
      }
      default: {
        const never: never = selection;
        console.error(`Unexpected invalid selection: ${inspect(never)}`);
        throw new Error("Unexpected invalid selection");
      }
    }
  }
  return false;
}
