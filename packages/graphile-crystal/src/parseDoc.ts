/* eslint-disable @typescript-eslint/no-use-before-define */
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
  DirectiveNode,
  GraphQLSchema,
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
 * All the selections made on a field within a GraphQL document.
 *
 * TODO: should this include details about `@skip`/`@include`?
 *
 * TODO: will this work for `@stream`?
 *
 * TODO: will this work for `@defer`? Possibly not, because defer is on a
 * _fragment_.
 */
export interface FieldDigestSelections {
  [typeName: string]: { [fieldAlias: string]: FieldDigest };
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
  /**
   * How many arrays is `resultType` wrapped in?
   *
   * @internal
   */
  listDepth: number;
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
   * sub-selections. (Note to self: did I mean 'interfaces' rather than
   * 'unions' here? I suspect so, since with interfaces we'd have to check all
   * the types, whereas with unions we'd only check the types the fragments
   * actually reference.)
   *
   * Will be null if the return type does not support selection sets (i.e. is a
   * scalar).
   */
  selections: FieldDigestSelections | null;
  //selections: Array<FieldDigestSelection> | null;

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
  schema: GraphQLSchema,
  doc: Doc,
  variables: TrackedObject<GraphQLVariables>,
): DocumentDigest {
  const selectionSet = doc.document.selectionSet;
  const parentType = doc.rootType;
  const map: Map<PathIdentity, FieldDigest> = new Map();
  return {
    name: doc.document.name?.value ?? null,
    fieldDigestByPath: processSelectionSet(
      schema,
      doc,
      variables,
      selectionSet,
      parentType,
      "",
      map,
    ),
  };
}

/**
 * Processes when a field is requested on a particular object type at a
 * particular point in the query.
 *
 * NOTE: when querying a field on an interface we'll do this for each possible
 * type (this could be expensive).
 *
 * NOTE: because selection sets can overlap, this may be called multiple times
 * for the same path identity. If this occurs, we still have to process it
 * again because the selection set may differ; however some of the logic won't
 * change (e.g. the expected return type of the field, the plan, etc).
 */
function processObjectField(
  schema: GraphQLSchema,
  doc: Doc,
  variables: TrackedObject<GraphQLVariables>,
  map: Map<PathIdentity, FieldDigest> = new Map(),
  selection: FieldNode,
  parentType: GraphQLObjectType,
  parentPathIdentity: PathIdentity,
  parentFieldDigest: FieldDigest | undefined,
): FieldDigest {
  const fieldName = selection.name.value;
  const alias = selection.alias?.value;
  const key = alias || fieldName;
  const pathIdentity = parentPathIdentity
    ? `${parentPathIdentity}>${parentType.name}.${key}`
    : `${parentType.name}.${key}`;

  let fieldDigest = map.get(pathIdentity);
  // NOTE: this function could be called with the same pathIdentity multiple times, but different selection sets.
  if (!fieldDigest) {
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

    const dependencies: string[] = [
      /* TODO */
    ];

    fieldDigest = {
      parentType,
      field,
      resultType,
      listDepth,
      namedResultType,
      dependencies,
      pathIdentity,
      fieldName,
      alias: selection.alias?.value ?? fieldName,
      plan: graphile?.plan,
      args: {
        /* TODO */
      },
      selections: selection.selectionSet ? Object.create(null) : null,
    };
    map.set(pathIdentity, fieldDigest);
  }

  // Whether or not there was a plan, keep populating the rest of the document.
  if (selection.selectionSet) {
    const { namedResultType } = fieldDigest;
    assert(
      isObjectType(namedResultType) ||
        isUnionType(namedResultType) ||
        isInterfaceType(namedResultType),
      "Cannot have a selection set on this type",
    );
    processSelectionSet(
      schema,
      doc,
      variables,
      selection.selectionSet,
      namedResultType,
      pathIdentity,
      map,
    );
  }

  if (parentFieldDigest) {
    assert(
      parentFieldDigest.selections,
      "Invalid query? Mixture of selection sets and no-selection sets for same field.",
    );
    if (!parentFieldDigest.selections[parentType.name]) {
      parentFieldDigest.selections[parentType.name] = Object.create(null);
    }
    if (!parentFieldDigest.selections[parentType.name][key]) {
      parentFieldDigest.selections[parentType.name][key] = fieldDigest;
    } else {
      // TODO: can compile this out of production bundle.
      assert.equal(
        parentFieldDigest.selections[parentType.name][key],
        fieldDigest,
        "All references to the same field on the same type at the same path should be the same FieldDigest.",
      );
    }
  }

  return fieldDigest;
}

function processFragment(
  schema: GraphQLSchema,
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
    processSelectionSet(
      schema,
      doc,
      variables,
      selectionSet,
      parentType,
      path,
      map,
    );
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
  processSelectionSet(
    schema,
    doc,
    variables,
    selectionSet,
    narrowerType,
    path,
    map,
  );
}

function processSelectionSet(
  schema: GraphQLSchema,
  doc: Doc,
  variables: TrackedObject<GraphQLVariables>,
  selectionSet: SelectionSetNode,
  parentType: GraphQLObjectType | GraphQLUnionType | GraphQLInterfaceType,
  path: string,
  map: Map<PathIdentity, FieldDigest>,
): Map<PathIdentity, FieldDigest> {
  const parentFieldDigest = map.get(path);
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
        if (isObjectType(parentType)) {
          processObjectField(
            schema,
            doc,
            variables,
            map,
            selection,
            parentType,
            path,
            parentFieldDigest,
          );
        } else if (isInterfaceType(parentType)) {
          const possibleTypes = doc.schema.getPossibleTypes(parentType);
          for (const possibleType of possibleTypes) {
            processObjectField(
              schema,
              doc,
              variables,
              map,
              selection,
              possibleType,
              path,
              parentFieldDigest,
            );
          }
        } else {
          throw new Error(`Unsupported parent type '${parentType}'`);
        }
        break;
      }
      case "InlineFragment": {
        processFragment(
          schema,
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
          schema,
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
