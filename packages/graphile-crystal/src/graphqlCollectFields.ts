import type { DirectiveNode, FieldNode, SelectionNode } from "graphql";
import {
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLUnionType,
  isInterfaceType,
  isObjectType,
  isUnionType,
} from "graphql";

import type { Aether } from "./aether";
import type { __TrackedObjectPlan } from "./plans";

/**
 * Given a selection, finds the first directive named `directiveName`.
 *
 * @internal
 *
 * TODO: inline.
 */
export function getDirective(
  selection: SelectionNode,
  directiveName: string,
): DirectiveNode | undefined {
  return selection.directives?.find((d) => d.name.value === directiveName);
}

/**
 * Given a selection, finds the first directive named `directiveName` and, if
 * found, extracts and returns the value from the argument named
 * `argumentName`, tracking variable access if necessary.
 *
 * @remarks Currently only supports booleans.
 *
 * @internal
 *
 * TODO: inline.
 */
export function getDirectiveArg(
  selection: SelectionNode,
  directiveName: string,
  argumentName: string,
  variableValuesPlan: __TrackedObjectPlan,
): unknown {
  const directive = getDirective(selection, directiveName);
  const argument = directive?.arguments?.find(
    (a) => a.name.value === argumentName,
  );
  if (argument) {
    const value = argument.value;
    switch (value.kind) {
      case "Variable": {
        return variableValuesPlan.get(value.name.value).eval();
      }
      case "BooleanValue": {
        return value.value;
      }
      case "NullValue": {
        return null;
      }
      default: {
        throw new Error(
          `Unsupported @${directiveName}(${argumentName}:) argument; expected Variable, Boolean or null; but received '${value.kind}'`,
        );
      }
    }
  }
  return undefined;
}

/**
 * Implements the `DoesFragmentTypeApply` algorithm from the GraphQL
 * specification.
 *
 * @see https://spec.graphql.org/draft/#DoesFragmentTypeApply()
 *
 * @internal
 */
function graphqlDoesFragmentTypeApply(
  objectType: GraphQLObjectType,
  fragmentType: GraphQLObjectType | GraphQLInterfaceType | GraphQLUnionType,
): boolean {
  if (fragmentType instanceof GraphQLObjectType) {
    return objectType === fragmentType;
  } else if (fragmentType instanceof GraphQLInterfaceType) {
    const interfaces = objectType.getInterfaces();
    return interfaces.includes(fragmentType);
  } else if (fragmentType instanceof GraphQLUnionType) {
    const types = fragmentType.getTypes();
    return types.includes(objectType);
  } else {
    throw new Error("Invalid call to graphqlDoesFragmentTypeApply");
  }
}

/**
 * Implements the `GraphQLCollectFields` algorithm - like `CollectFields` the
 * GraphQL spec, but modified such that access to variables is tracked.
 *
 * @see https://spec.graphql.org/draft/#CollectFields()
 *
 * @internal
 */
export function graphqlCollectFields(
  aether: Aether,
  objectType: GraphQLObjectType,
  selections: ReadonlyArray<SelectionNode>,
  visitedFragments = new Set<string>(),
  groupedFields = new Map<string, FieldNode[]>(),
): Map<string, FieldNode[]> {
  // TODO: factor in @defer / @stream via groupId / maxGroupId
  const trackedVariableValuesPlan = aether.trackedVariableValuesPlan;
  for (let i = 0, l = selections.length; i < l; i++) {
    const selection = selections[i];
    if (
      getDirectiveArg(selection, "skip", "if", trackedVariableValuesPlan) ===
      true
    ) {
      continue;
    }
    if (
      getDirectiveArg(selection, "include", "if", trackedVariableValuesPlan) ===
      false
    ) {
      continue;
    }
    switch (selection.kind) {
      case "Field": {
        const responseKey = selection.alias?.value ?? selection.name.value;
        let groupForResponseKey = groupedFields.get(responseKey);
        if (!groupForResponseKey) {
          groupForResponseKey = [selection];
          groupedFields.set(responseKey, groupForResponseKey);
        } else {
          groupForResponseKey.push(selection);
        }
        break;
      }
      case "FragmentSpread": {
        const fragmentSpreadName = selection.name.value;
        if (visitedFragments.has(fragmentSpreadName)) {
          continue;
        }
        visitedFragments.add(fragmentSpreadName);
        const fragment = aether.fragments[fragmentSpreadName];
        if (fragment == null) {
          continue;
        }
        const fragmentTypeName = fragment.typeCondition.name.value;
        const fragmentType = aether.schema.getType(fragmentTypeName);
        if (
          !fragmentType ||
          !(
            isObjectType(fragmentType) ||
            isInterfaceType(fragmentType) ||
            isUnionType(fragmentType)
          ) ||
          !graphqlDoesFragmentTypeApply(objectType, fragmentType)
        ) {
          continue;
        }
        const fragmentSelectionSet = fragment.selectionSet;
        graphqlCollectFields(
          aether,
          objectType,
          fragmentSelectionSet.selections,
          visitedFragments,
          groupedFields,
        );
        break;
      }
      case "InlineFragment": {
        const fragmentType = selection.typeCondition;
        if (
          fragmentType != null &&
          (!(
            isObjectType(fragmentType) ||
            isInterfaceType(fragmentType) ||
            isUnionType(fragmentType)
          ) ||
            !graphqlDoesFragmentTypeApply(objectType, fragmentType))
        ) {
          continue;
        }
        const fragmentSelectionSet = selection.selectionSet;
        graphqlCollectFields(
          aether,
          objectType,
          fragmentSelectionSet.selections,
          visitedFragments,
          groupedFields,
        );
        break;
      }
    }
  }
  return groupedFields;
}
