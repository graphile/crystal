import assert from "assert";
import {
  SelectionSetNode,
  GraphQLObjectType,
  GraphQLUnionType,
  GraphQLInterfaceType,
  isUnionType,
  isListType,
  isNonNullType,
  isObjectType,
  isInterfaceType,
  SelectionNode,
  DirectiveNode,
  ValueNode,
  FieldNode,
  NamedTypeNode,
} from "graphql";
import { GraphQLVariables, PathIdentity } from "./interfaces";
import { Doc } from "./doc";

/**
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
 * Looks for `@include(if: ...)` / `@skip(if: ...)` directives and returns true if should skip; otherwise false
 */
function shouldSkip(
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

export function parseDoc(doc: Doc, variables: TrackedObject<GraphQLVariables>) {
  const selectionSet = doc.document.selectionSet;
  const parentType = doc.rootType;
  processSelectionSet(doc, variables, selectionSet, parentType);
}

interface Meta {}

function processObjectField(
  doc: Doc,
  variables: TrackedObject<GraphQLVariables>,
  map: Map<PathIdentity, Meta> = new Map(),
  selection: FieldNode,
  parentType: GraphQLObjectType,
  pathIdentity: PathIdentity,
) {
  const field = parentType.getFields()[selection.name.value];
  const resultType = field.type;
  let unwrappedType = resultType;
  let listDepth = 0;
  while ("ofType" in unwrappedType && unwrappedType.ofType) {
    if (isListType(unwrappedType)) {
      listDepth++;
    } else if (isNonNullType(unwrappedType)) {
      // ignore
    } else {
      throw new Error("Wrapping type not understood.");
    }
    unwrappedType = unwrappedType.ofType;
  }
  assert(
    isObjectType(unwrappedType) ||
      isUnionType(unwrappedType) ||
      isInterfaceType(unwrappedType),
    "Expected type to have been unwrapped to reveal an object, union or interface type",
  );
  const graphile = unwrappedType.extensions?.graphile;

  let meta = map.get(pathIdentity);
  if (!meta) {
    meta = {
      pathIdentity,
      graphile,
      plan: {
        /* TODO */
      },
    };
    map.set(pathIdentity, meta);
  }
  // TODO: multiple fields (across different fragments) might augment this meta

  if (selection.selectionSet) {
    processSelectionSet(
      doc,
      variables,
      selection.selectionSet,
      unwrappedType,
      pathIdentity,
      map,
    );
  }
}
function processFragment(
  doc: Doc,
  variables: TrackedObject<GraphQLVariables>,
  typeCondition: NamedTypeNode | undefined,
  selectionSet: SelectionSetNode,
  parentType: GraphQLObjectType | GraphQLUnionType | GraphQLInterfaceType,
  path: string = "",
  map: Map<PathIdentity, Meta> = new Map(),
) {
  if (
    !typeCondition ||
    (typeCondition && typeCondition.name.value === parentType.name)
  ) {
    // Redundant fragment `{ ... { [...] } }` or `{ ... on SameType { [...] } }`
    processSelectionSet(doc, variables, selectionSet, parentType, path, map);
    return;
  }
  const fragmentType = doc.schema.getType(typeCondition.name.value);
  assert(
    isUnionType(fragmentType) ||
      isInterfaceType(fragmentType) ||
      isObjectType(fragmentType),
    "Couldn't find type associated with this fragment",
  );
  // It's possible to do `{ user { ... on Node { id } } }`; in this case,
  // we know it's still a User even though Node is used here. We want the
  // narrower type.
  // TODO: implement all forms of narrower types
  const narrowerType = isObjectType(parentType) ? parentType : fragmentType;
  processSelectionSet(doc, variables, selectionSet, narrowerType, path, map);
}

function processSelectionSet(
  doc: Doc,
  variables: TrackedObject<GraphQLVariables>,
  selectionSet: SelectionSetNode,
  parentType: GraphQLObjectType | GraphQLUnionType | GraphQLInterfaceType,
  path: string = "",
  map: Map<PathIdentity, Meta> = new Map(),
) {
  for (const selection of selectionSet.selections) {
    if (shouldSkip(selection, variables)) {
      continue;
    }
    switch (selection.kind) {
      case "Field": {
        if (selection.name.value.startsWith("__")) {
          // Introspection field; ignore
          break;
        }
        assert(
          !isUnionType(parentType),
          "Cannot select fields on a union type",
        );
        const alias = selection.alias
          ? selection.alias.value
          : selection.name.value;
        if (isObjectType(parentType)) {
          const pathIdentity =
            path + (path ? ">" : "") + `${parentType.name}.${alias}`;
          processObjectField(
            doc,
            variables,
            map,
            selection,
            parentType,
            pathIdentity,
          );
        } else if (isInterfaceType(parentType)) {
          const possibleTypes = doc.schema.getPossibleTypes(parentType);
          for (const possibleType of possibleTypes) {
            const pathIdentity =
              path + (path ? ">" : "") + `${possibleType.name}.${alias}`;
            processObjectField(
              doc,
              variables,
              map,
              selection,
              possibleType,
              pathIdentity,
            );
          }
        } else {
          throw new Error(`Unsupported parent type '${parentType}'`);
        }
        break;
      }
      case "InlineFragment": {
        processFragment(
          doc,
          variables,
          selection.typeCondition,
          selection.selectionSet,
          parentType,
          path,
          map,
        );

        break;
      }
      case "FragmentSpread": {
        const fragmentName = selection.name.value;
        const fragment = doc.fragments[fragmentName];
        assert(fragment, `Expected to have a fragment named '${fragmentName}'`);
        // TODO: we'll need to handle fragment.variableDefinitions at some point
        processFragment(
          doc,
          variables,
          fragment.typeCondition,
          fragment.selectionSet,
          parentType,
          path,
          map,
        );
        break;
      }
      default: {
        const never: never = selection;
        assert(!never, `Unexpected node '${never}'`);
      }
    }
  }
  return map;
}
