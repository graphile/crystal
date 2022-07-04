import type { DirectiveNode, SelectionNode } from "graphql";
import {
  assertListType,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLUnionType,
  isInterfaceType,
  isObjectType,
  isUnionType,
} from "graphql";

import type { Aether } from "./aether.js";
import { isDev } from "./dev.js";
import type { FieldAndGroup, GroupedSelections } from "./interfaces.js";
import type { __TrackedObjectStep } from "./steps/index.js";

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
  variableValuesPlan: __TrackedObjectStep,
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
      case "IntValue": {
        return parseInt(value.value, 10);
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
 * @internal
 */
export interface Group {
  parent: Group | null;
  parentStepId: string;
  reason: "root" | "defer" | "stream" | "mutation" | "mutationPayload";
  /**
   * Only set for 'mutation'
   */
  responseKey?: string;
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
  parentStepId: string,
  objectType: GraphQLObjectType,
  groupedSelectionsList: GroupedSelections[],
  isMutation = false,
  visitedFragments = new Set<string>(),
  groupedFields = new Map<string, FieldAndGroup[]>(),
): Map<string, FieldAndGroup[]> {
  for (
    let listIndex = 0, listLength = groupedSelectionsList.length;
    listIndex < listLength;
    listIndex++
  ) {
    const { groupId, selections } = groupedSelectionsList[listIndex];
    const parent = aether.groups[groupId];
    const objectTypeFields = objectType.getFields();
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
        getDirectiveArg(
          selection,
          "include",
          "if",
          trackedVariableValuesPlan,
        ) === false
      ) {
        continue;
      }
      switch (selection.kind) {
        case "Field": {
          const field = selection;
          const responseKey = field.alias?.value ?? field.name.value;
          let groupForResponseKey = groupedFields.get(responseKey);
          if (!groupForResponseKey) {
            groupForResponseKey = [];
            groupedFields.set(responseKey, groupForResponseKey);
          }

          const stream = getDirective(field, "stream");
          if (stream && isDev) {
            const fieldName = field.name.value;
            const fieldType = objectTypeFields[fieldName].type;
            assertListType(fieldType);
          }
          const selectionGroupId = stream
            ? aether.addGroup({ reason: "stream", parentStepId, parent })
            : isMutation
            ? aether.addGroup({
                reason: "mutation",
                parentStepId,
                parent,
                responseKey,
              })
            : groupId;

          groupForResponseKey.push({
            field,
            groupId: selectionGroupId,
          });
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

          const defer = getDirective(selection, "defer");
          const fragmentGroupId = defer
            ? aether.addGroup({ reason: "defer", parentStepId, parent })
            : isMutation
            ? aether.addGroup({
                reason: "mutationPayload",
                parentStepId,
                parent,
              })
            : groupId;

          graphqlCollectFields(
            aether,
            parentStepId,
            objectType,
            [
              {
                groupId: fragmentGroupId,
                selections: fragmentSelectionSet.selections,
              },
            ],
            false,
            visitedFragments,
            groupedFields,
          );
          break;
        }
        case "InlineFragment": {
          const fragmentTypeAst = selection.typeCondition;
          if (fragmentTypeAst != null) {
            const fragmentTypeName = fragmentTypeAst.name.value;
            const fragmentType = aether.schema.getType(fragmentTypeName);
            if (fragmentType == null) {
              throw new Error(
                `We don't have a type named '${fragmentTypeName}'`,
              );
            }
            if (
              !(
                isObjectType(fragmentType) ||
                isInterfaceType(fragmentType) ||
                isUnionType(fragmentType)
              ) ||
              !graphqlDoesFragmentTypeApply(objectType, fragmentType)
            ) {
              continue;
            }
          }
          const fragmentSelectionSet = selection.selectionSet;

          const defer = getDirective(selection, "defer");

          // TODO: previously we bumped the groupId here if it was a mutation;
          // however it doesn't seem that this is actually desired/necessary
          // since the parent selection set would already have been bumped.
          // I've thus removed this, but we need to be sure it's correct to do
          // so.
          const fragmentGroupId = defer
            ? aether.addGroup({ reason: "defer", parentStepId, parent })
            : groupId;

          graphqlCollectFields(
            aether,
            parentStepId,
            objectType,
            [
              {
                groupId: fragmentGroupId,
                selections: fragmentSelectionSet.selections,
              },
            ],
            false,
            visitedFragments,
            groupedFields,
          );
          break;
        }
      }
    }
  }
  return groupedFields;
}
