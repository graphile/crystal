import {
  SelectionSetNode,
  FieldNode,
  SelectionNode,
  GraphQLObjectType,
  GraphQLInterfaceType,
  GraphQLUnionType,
  isObjectType,
  isInterfaceType,
  isUnionType,
} from "graphql";
import { Aether } from "./aether";
import { TrackedObjectPlan } from "./plan";

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
function getDirectiveArg(
  selection: SelectionNode,
  directiveName: string,
  argumentName: string,
  variableValuesPlan: TrackedObjectPlan,
): unknown {
  const directive = selection.directives?.find(
    (d) => d.name.value === directiveName,
  );
  const argument = directive?.arguments?.find(
    (a) => a.name.value === argumentName,
  );
  if (argument) {
    const value = argument.value;
    switch (value.kind) {
      case "Variable": {
        return variableValuesPlan.evalGet(value.name.value);
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
 * Implements the `CollectFields` algorithm from the GraphQL spec, but modified
 * such that access to variables is tracked.
 *
 * @see https://spec.graphql.org/draft/#CollectFields()
 *
 * @internal
 */
export function graphqlCollectFields(
  aether: Aether,
  objectType: GraphQLObjectType,
  selectionSet: SelectionSetNode,
  variableValuesPlan: TrackedObjectPlan,
  visitedFragments = new Set<string>(),
  groupedFields = new Map<string, FieldNode[]>(),
): Map<string, FieldNode[]> {
  for (let i = 0, l = selectionSet.selections.length; i < l; i++) {
    const selection = selectionSet.selections[i];
    if (getDirectiveArg(selection, "skip", "if", variableValuesPlan) === true) {
      continue;
    }
    if (
      getDirectiveArg(selection, "include", "if", variableValuesPlan) === false
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
          fragmentSelectionSet,
          variableValuesPlan,
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
          fragmentSelectionSet,
          variableValuesPlan,
          visitedFragments,
          groupedFields,
        );
        break;
      }
    }
  }
  return groupedFields;
}
