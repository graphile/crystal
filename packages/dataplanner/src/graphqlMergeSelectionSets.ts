import type {
  GraphQLInterfaceType,
  GraphQLObjectType,
  SelectionNode,
} from "graphql";
import { Kind } from "graphql";
import { inspect } from "util";

import type { FieldAndGroup } from "./interfaces.js";
import type { OpPlan } from "./opPlan.js";

/**
 * Implements the `MergeSelectionSets` algorithm from the GraphQL spec.
 *
 * @see https://spec.graphql.org/draft/#MergeSelectionSets()
 */
export function graphqlMergeSelectionSets(
  fields: FieldAndGroup[],
): { groupId: number; selections: SelectionNode[] }[] {
  const selectionSetsByGroupId: Record<number, SelectionNode[]> = {};
  for (let i = 0, l = fields.length; i < l; i++) {
    const { field, groupId } = fields[i];
    const fieldSelectionSet = field.selectionSet;
    if (fieldSelectionSet) {
      if (!selectionSetsByGroupId[groupId]) {
        selectionSetsByGroupId[groupId] = [];
      }
      selectionSetsByGroupId[groupId].push(...fieldSelectionSet.selections);
    }
  }
  return Object.entries(selectionSetsByGroupId).map(
    ([groupId, selections]) => ({ groupId: Number(groupId), selections }),
  );
}

/**
 * Given a list of object types and a list of selections, returns only the
 * types that may be queried in that selection (e.g. because there's a type
 * fragment on them or on one of the interfaces they implement).
 */
export function typesUsedInSelections(
  opPlan: OpPlan,
  types: ReadonlyArray<GraphQLObjectType>,
  selections: ReadonlyArray<SelectionNode>,
): GraphQLObjectType[] {
  const typeNamesMap: { [typeName: string]: true } = Object.create(null);
  for (let i = 0, l = selections.length; i < l; i++) {
    const selection = selections[i];
    switch (selection.kind) {
      case "FragmentSpread": {
        // Assumed to exist because query passed validation.
        const fragment = opPlan.fragments[selection.name.value];
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
      opPlan.unionsContainingObjectType[t.name].some(
        (u) => typeNamesMap[u.name],
      ),
  );
}

/**
 * Given an interface type and a list of selections, returns true if any
 * non-introspection fields are queried on the interface (or any of the
 * interfaces it implements), false otherwise.
 */
export function interfaceTypeHasNonIntrospectionFieldQueriedInSelections(
  opPlan: OpPlan,
  interfaceType: GraphQLInterfaceType,
  selections: readonly SelectionNode[],
): boolean {
  const types = [interfaceType, ...interfaceType.getInterfaces()];
  for (let i = 0, l = selections.length; i < l; i++) {
    const selection = selections[i];
    switch (selection.kind) {
      case Kind.FRAGMENT_SPREAD: {
        // Assumed to exist because query passed validation.
        const fragment = opPlan.fragments[selection.name.value];
        const typeCondition = fragment.typeCondition;
        const matchingInterfaceType = types.find(
          (t) => t.name === typeCondition.name.value,
        );
        if (matchingInterfaceType && fragment.selectionSet.selections) {
          const result =
            interfaceTypeHasNonIntrospectionFieldQueriedInSelections(
              opPlan,
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
                opPlan,
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
