import type {
  DirectiveNode,
  FieldNode,
  SelectionNode,
  SelectionSetNode,
} from "graphql";
import {
  GraphQLError,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLUnionType,
  isInterfaceType,
  isObjectType,
  isUnionType,
} from "graphql";

import type { OperationPlan } from "./engine/OperationPlan.js";
import { SafeError } from "./error.js";
import type { __TrackedValueStep } from "./steps/index.js";

/**
 * Given a selection, finds the first directive named `directiveName`.
 *
 * @internal
 *
 * PERF: inline.
 */
function getDirective(
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
 * PERF: inline.
 */
export function evalDirectiveArg<T = unknown>(
  selection: SelectionNode,
  directiveName: string,
  argumentName: string,
  variableValuesStep: __TrackedValueStep,
): T | undefined {
  const directive = getDirective(selection, directiveName);
  const argument = directive?.arguments?.find(
    (a) => a.name.value === argumentName,
  );
  if (argument) {
    const value = argument.value;
    switch (value.kind) {
      case "Variable": {
        return variableValuesStep.get(value.name.value).eval();
      }
      case "BooleanValue": {
        return value.value as any;
      }
      case "IntValue": {
        return parseInt(value.value, 10) as any;
      }
      case "NullValue": {
        return null as any;
      }
      default: {
        throw new SafeError(
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
export interface SelectionSetDigest {
  label: string | undefined;
  fields: Map<string, FieldNode[]>;
  deferred: SelectionSetDigest[];
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
  operationPlan: OperationPlan,
  parentStepId: number,
  objectType: GraphQLObjectType,
  selections: readonly SelectionNode[],
  isMutation = false,
  visitedFragments = new Set<string>(),
  selectionSetDigest: SelectionSetDigest = {
    label: undefined,
    fields: new Map(),
    deferred: [],
  },
): SelectionSetDigest {
  // const objectTypeFields = objectType.getFields();
  const trackedVariableValuesStep = operationPlan.trackedVariableValuesStep;
  for (let i = 0, l = selections.length; i < l; i++) {
    const selection = selections[i];
    if (
      evalDirectiveArg<boolean | null>(
        selection,
        "skip",
        "if",
        trackedVariableValuesStep,
      ) === true
    ) {
      continue;
    }
    if (
      evalDirectiveArg<boolean | null>(
        selection,
        "include",
        "if",
        trackedVariableValuesStep,
      ) === false
    ) {
      continue;
    }

    const processFragment = (
      selection: SelectionNode,
      fragmentSelectionSet: SelectionSetNode,
    ) => {
      const defer = getDirective(selection, "defer");
      const deferIf = evalDirectiveArg<boolean | null>(
        selection,
        "defer",
        "if",
        trackedVariableValuesStep,
      );
      const label =
        evalDirectiveArg<string | null>(
          selection,
          "defer",
          "label",
          trackedVariableValuesStep,
        ) ?? undefined;
      const deferredDigest: SelectionSetDigest | null =
        !defer || deferIf === false
          ? null
          : {
              label,
              fields: new Map(),
              deferred: [],
            };
      if (deferredDigest) {
        selectionSetDigest.deferred.push(deferredDigest);
      }
      graphqlCollectFields(
        operationPlan,
        parentStepId,
        objectType,
        fragmentSelectionSet.selections,
        isMutation,
        visitedFragments,
        deferredDigest ?? selectionSetDigest,
      );
    };

    switch (selection.kind) {
      case "Field": {
        const field = selection;
        const responseKey = field.alias?.value ?? field.name.value;
        let groupForResponseKey: FieldNode[] | undefined =
          selectionSetDigest.fields.get(responseKey);
        if (!groupForResponseKey) {
          groupForResponseKey = [];
          selectionSetDigest.fields.set(responseKey, groupForResponseKey);
        }
        groupForResponseKey.push(field);
        break;
      }

      case "FragmentSpread": {
        const fragmentSpreadName = selection.name.value;
        if (visitedFragments.has(fragmentSpreadName)) {
          continue;
        }
        visitedFragments.add(fragmentSpreadName);
        const fragment = operationPlan.fragments[fragmentSpreadName];
        if (fragment == null) {
          continue;
        }
        const fragmentTypeName = fragment.typeCondition.name.value;
        const fragmentType = operationPlan.schema.getType(fragmentTypeName);
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
        processFragment(selection, fragmentSelectionSet);
        break;
      }

      case "InlineFragment": {
        const fragmentTypeAst = selection.typeCondition;
        if (fragmentTypeAst != null) {
          const fragmentTypeName = fragmentTypeAst.name.value;
          const fragmentType = operationPlan.schema.getType(fragmentTypeName);
          if (fragmentType == null) {
            throw new GraphQLError(
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
        processFragment(selection, fragmentSelectionSet);
        break;
      }
    }
  }
  return selectionSetDigest;
}
