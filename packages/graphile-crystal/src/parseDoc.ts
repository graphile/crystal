import { TrackedObject } from "./trackedObject";
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
  FieldNode,
  NamedTypeNode,
} from "graphql";
import {
  GraphQLVariables,
  PathIdentity,
  PlanResolver,
  InputPlanResolver,
} from "./interfaces";
import { Doc } from "./doc";
import { shouldSkip } from "./parseDocHelpers";

/**
 * This is the data associated with a particular field within a document.
 */
interface FieldDigest {
  pathIdentity: PathIdentity;
  fieldName: string;
  alias: string;
  plan?: PlanResolver<any, any>;
  args: {
    [key: string]: {
      dependencies: string[];
      argPlan?: InputPlanResolver<any, any, any>;
    };
  };
  fields: {
    [alias: string]: FieldDigest;
  };
}

/**
 * Parses a Doc with given variables, skipping over items tagged with relevant
 * `@include(if: false)` / `@skip(if: true)` directives, and returns an
 * optimized reference describing the document for use by the lookahead system.
 */
export function parseDoc(doc: Doc, variables: TrackedObject<GraphQLVariables>) {
  const selectionSet = doc.document.selectionSet;
  const parentType = doc.rootType;
  return processSelectionSet(doc, variables, selectionSet, parentType);
}

function processObjectField(
  doc: Doc,
  variables: TrackedObject<GraphQLVariables>,
  map: Map<PathIdentity, FieldDigest> = new Map(),
  selection: FieldNode,
  parentType: GraphQLObjectType,
  pathIdentity: PathIdentity,
) {
  const fieldName = selection.name.value;
  const field = parentType.getFields()[fieldName];
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
  const graphile:
    | GraphileEngine.GraphQLObjectTypeGraphileExtension
    | undefined = unwrappedType.extensions?.graphile;

  let fieldDigest = map.get(pathIdentity);
  if (!fieldDigest) {
    fieldDigest = {
      pathIdentity,
      fieldName,
      alias: selection.alias?.value ?? fieldName,
      plan: graphile?.plan,
      args: {
        /* TODO */
      },
      fields: {
        /* TODO */
      },
    };
    map.set(pathIdentity, fieldDigest);
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
  map: Map<PathIdentity, FieldDigest> = new Map(),
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
  map: Map<PathIdentity, FieldDigest> = new Map(),
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
