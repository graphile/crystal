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
  isNamedType,
  GraphQLField,
  GraphQLOutputType,
  GraphQLNamedType,
} from "graphql";
import {
  GraphQLVariables,
  PathIdentity,
  PlanResolver,
  // InputPlanResolver,
} from "./interfaces";
import { Doc } from "./doc";
import { shouldSkip } from "./parseDocHelpers";

/**
 * This represents either an argument or an input field that might be passed to
 * an argument (or another input field).
 */
interface InputDigest {
  // inputPlan?: InputPlanResolver<any, any, any>;
  dependencies: string[];
  inputFields: {
    [inputFieldName: string]: InputDigest;
  } | null;
}

/**
 * This represents a field on a concrete type in the GraphQL document.
 */
export interface FieldDigest {
  pathIdentity: PathIdentity;
  fieldName: string;
  alias: string;
  parentType: GraphQLObjectType;
  field: GraphQLField<any, any, any>;
  resultType: GraphQLOutputType;
  namedResultType: GraphQLNamedType;

  /**
   * The plan resolver from extensions.graphile
   */
  plan?: PlanResolver<any, any, any, any>;

  /**
   * This isn't all the field arguments, it's the ones reachable based on the
   * document. Some might be skipped based on variable values.
   */
  args: {
    [argName: string]: InputDigest;
  };

  /**
   * Dependencies collected from all the fields, across all the selection sets
   * (e.g. if this field returns an interface/union).
   *
   * TODO: how to collect dependencies from sub-subselections, e.g.
   * `{contact{address{city street number postcode}}}` the address sub-fields
   * might actually belong to contact, so we'd like to express dependencies
   * ignoring the intermediary address field.
   */
  dependencies: string[];

  /**
   * An amalgamation of all the selection sets for this field, collapsed down
   * to their concrete object types.
   *
   * NOTE: for unions with a lot of members, this might end up in a *lot* of
   * sub-selections.
   *
   * Will be null if the return type does not support selection sets (i.e. is a
   * scalar).
   */
  selections: Array<{
    type: GraphQLObjectType;
    fields: {
      [fieldName: string]: FieldDigest;
    };
  }> | null;

  // TODO:
  //subplans?: SubplanResolver<any, any>;
}

/**
 * This represents a full document parsed under a specific set of variables. It
 * pulls out all the metadata ahead of time to reduce future runtime costs. It
 * may be used any time the same GraphQL document is used with compatible
 * variables.
 *
 * Note since this represents a query, mutation or subscription we know that
 * the type is a concrete Object Type, so we can reference fields directly.
 */
interface DocumentDigest {
  name: string | null;
  fieldDigestByPath: Map<PathIdentity, FieldDigest>;
}

/* *
 * This is the data associated with a particular field within a document.
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
*/

/**
 * Parses a Doc with given variables, skipping over items tagged with relevant
 * `@include(if: false)` / `@skip(if: true)` directives, and returns an
 * optimized reference describing the document for use by the lookahead system.
 */
export function parseDoc(
  doc: Doc,
  variables: TrackedObject<GraphQLVariables>,
): DocumentDigest {
  const selectionSet = doc.document.selectionSet;
  const parentType = doc.rootType;
  return {
    name: doc.document.name?.value ?? null,
    fieldDigestByPath: processSelectionSet(
      doc,
      variables,
      selectionSet,
      parentType,
    ),
  };
}

function processObjectField(
  doc: Doc,
  variables: TrackedObject<GraphQLVariables>,
  map: Map<PathIdentity, FieldDigest> = new Map(),
  selection: FieldNode,
  parentType: GraphQLObjectType,
  pathIdentity: PathIdentity,
): void {
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
    isNamedType(unwrappedType),
    "Expected unwrappedType to be a named type",
  );

  // This variable alias appeases TypeScript in the fieldDigest object below
  // (the cast isn't required).
  const namedResultType: GraphQLNamedType = unwrappedType;

  const graphile:
    | GraphileEngine.GraphQLFieldGraphileExtension<any, any, any, any>
    | undefined = field.extensions?.graphile;
  console.dir(field.extensions);

  const dependencies: string[] = [
    /* TODO */
  ];

  let fieldDigest = map.get(pathIdentity);
  if (!fieldDigest) {
    fieldDigest = {
      parentType,
      field,
      resultType,
      namedResultType,
      dependencies,
      pathIdentity,
      fieldName,
      alias: selection.alias?.value ?? fieldName,
      plan: graphile?.plan,
      args: {
        /* TODO */
      },
      selections: selection.selectionSet
        ? [
            /* TODO */
          ]
        : null,
    };
    map.set(pathIdentity, fieldDigest);
  }
  // TODO: multiple fields (across different fragments) might augment this meta

  if (selection.selectionSet) {
    assert(
      isObjectType(unwrappedType) ||
        isUnionType(unwrappedType) ||
        isInterfaceType(unwrappedType),
      "Cannot have a selection set on this type",
    );
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
  path = "",
  map: Map<PathIdentity, FieldDigest> = new Map(),
): void {
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
  path = "",
  map: Map<PathIdentity, FieldDigest> = new Map(),
): Map<PathIdentity, FieldDigest> {
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
