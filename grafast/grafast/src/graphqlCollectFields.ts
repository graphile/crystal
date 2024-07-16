import type {
  DirectiveNode,
  FieldNode,
  SelectionNode,
  SelectionSetNode,
} from "graphql";
import * as graphql from "graphql";

import type { OperationPlan } from "./engine/OperationPlan.js";
import { SafeError } from "./error.js";
import type { __TrackedValueStep } from "./steps/index.js";

const {
  GraphQLError,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLUnionType,
} = graphql;

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
  defaultValue: T,
): T | undefined {
  const directive = getDirective(selection, directiveName);
  if (!directive) return undefined;
  return evalDirectiveArgDirect(
    directive,
    argumentName,
    variableValuesStep,
    defaultValue,
  );
}

export function evalDirectiveArgDirect<T = unknown>(
  directive: DirectiveNode,
  argumentName: string,
  variableValuesStep: __TrackedValueStep,
  defaultValue: T,
): T | undefined {
  if (!directive.arguments) return defaultValue;
  const argument = directive.arguments.find(
    (a) => a.name.value === argumentName,
  );
  if (argument !== undefined) {
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
          `Unsupported @${directive.name}(${argumentName}:) argument; expected Variable, Boolean or null; but received '${value.kind}'`,
        );
      }
    }
  } else {
    return defaultValue;
  }
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
  objectType: graphql.GraphQLObjectType,
  fragmentType:
    | graphql.GraphQLObjectType
    | graphql.GraphQLInterfaceType
    | graphql.GraphQLUnionType,
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
  deferred: SelectionSetDigest[] | undefined;
  resolverEmulation: boolean;
}

const processFragment = (
  operationPlan: OperationPlan,
  parentStepId: number,
  objectType: graphql.GraphQLObjectType,
  isMutation: boolean,
  selectionSetDigest: SelectionSetDigest,
  selection: SelectionNode,
  fragmentSelectionSet: SelectionSetNode,
  visitedFragments: { [fragmentName: string]: true },
) => {
  const trackedVariableValuesStep = operationPlan.trackedVariableValuesStep;
  const defer = selection.directives?.find((d) => d.name.value === "defer");
  const deferIf = defer
    ? evalDirectiveArgDirect<boolean | null>(
        defer,
        "if",
        trackedVariableValuesStep,
        true,
      ) ?? true
    : undefined;
  const label = defer
    ? evalDirectiveArgDirect<string | null>(
        defer,
        "label",
        trackedVariableValuesStep,
        null,
      ) ?? undefined
    : undefined;
  const deferredDigest: SelectionSetDigest | null =
    deferIf === true
      ? {
          label,
          fields: new Map(),
          deferred: undefined,
          resolverEmulation: selectionSetDigest.resolverEmulation,
        }
      : null;
  if (deferredDigest !== null) {
    if (selectionSetDigest.deferred === undefined) {
      selectionSetDigest.deferred = [deferredDigest];
    } else {
      selectionSetDigest.deferred.push(deferredDigest);
    }
  }
  graphqlCollectFields(
    operationPlan,
    parentStepId,
    objectType,
    fragmentSelectionSet.selections,
    deferredDigest ?? selectionSetDigest,
    isMutation,
    visitedFragments,
  );
};

export function newSelectionSetDigest(resolverEmulation: boolean) {
  return {
    label: undefined,
    fields: new Map(),
    deferred: undefined,
    resolverEmulation,
  };
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
  objectType: graphql.GraphQLObjectType,
  selections: readonly SelectionNode[],
  selectionSetDigest: SelectionSetDigest,
  isMutation = false,
  // This is significantly faster than an array or a Set
  visitedFragments: { [fragmentName: string]: true } = Object.create(null),
): SelectionSetDigest {
  // const objectTypeFields = objectType.getFields();
  const trackedVariableValuesStep = operationPlan.trackedVariableValuesStep;
  for (let i = 0, l = selections.length; i < l; i++) {
    const selection = selections[i];
    if (selection.directives !== undefined) {
      if (
        evalDirectiveArg<boolean | null>(
          selection,
          "skip",
          "if",
          trackedVariableValuesStep,
          true,
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
          true,
        ) === false
      ) {
        continue;
      }
    }

    switch (selection.kind) {
      case "Field": {
        const field = selection;
        const responseKey = field.alias ? field.alias.value : field.name.value;
        let groupForResponseKey = selectionSetDigest.fields.get(responseKey);
        if (groupForResponseKey === undefined) {
          groupForResponseKey = [field];
          selectionSetDigest.fields.set(responseKey, groupForResponseKey);
        } else {
          groupForResponseKey.push(field);
        }
        break;
      }

      case "FragmentSpread": {
        const fragmentSpreadName = selection.name.value;
        if (visitedFragments[fragmentSpreadName]) {
          continue;
        }
        const fragment = operationPlan.fragments[fragmentSpreadName];

        // This is forbidden by validation
        if (fragment == null) continue;

        const fragmentTypeName = fragment.typeCondition.name.value;
        if (fragmentTypeName === objectType.name) {
          // No further checks needed
        } else {
          const fragmentType = operationPlan.schema.getType(fragmentTypeName);

          // This is forbidden by validation
          if (!fragmentType) continue;

          if (
            fragmentType.constructor === GraphQLObjectType ||
            /* According to validation, this must be the case */
            // !(isInterfaceType(fragmentType) || isUnionType(fragmentType)) ||
            !graphqlDoesFragmentTypeApply(
              objectType,
              fragmentType as
                | graphql.GraphQLUnionType
                | graphql.GraphQLInterfaceType,
            )
          ) {
            continue;
          }
        }

        const fragmentSelectionSet = fragment.selectionSet;

        const newVisitedFragments = Object.assign(
          Object.create(null),
          visitedFragments,
        );
        newVisitedFragments[fragmentSpreadName] = true;

        processFragment(
          operationPlan,
          parentStepId,
          objectType,
          isMutation,
          selectionSetDigest,
          selection,
          fragmentSelectionSet,
          newVisitedFragments,
        );
        break;
      }

      case "InlineFragment": {
        const fragmentTypeAst = selection.typeCondition;
        if (fragmentTypeAst != null) {
          const fragmentTypeName = fragmentTypeAst.name.value;
          if (fragmentTypeName === objectType.name) {
            // No further checks required
          } else {
            const fragmentType = operationPlan.schema.getType(fragmentTypeName);

            // This is forbidden by validation
            if (fragmentType == null) {
              throw new GraphQLError(
                `We don't have a type named '${fragmentTypeName}'`,
              );
            }

            if (
              fragmentType.constructor === GraphQLObjectType ||
              /* According to validation, this must be the case */
              // !(isInterfaceType(fragmentType) || isUnionType(fragmentType)) ||
              !graphqlDoesFragmentTypeApply(
                objectType,
                fragmentType as
                  | graphql.GraphQLUnionType
                  | graphql.GraphQLInterfaceType,
              )
            ) {
              continue;
            }
          }
        }
        const fragmentSelectionSet = selection.selectionSet;
        processFragment(
          operationPlan,
          parentStepId,
          objectType,
          isMutation,
          selectionSetDigest,
          selection,
          fragmentSelectionSet,
          visitedFragments,
        );
        break;
      }
    }
  }
  return selectionSetDigest;
}
