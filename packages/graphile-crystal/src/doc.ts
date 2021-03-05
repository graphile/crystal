import { TrackedObject } from "./trackedObject";
import {
  GraphQLSchema,
  OperationDefinitionNode,
  GraphQLResolveInfo,
  GraphQLObjectType,
  FragmentDefinitionNode,
  SelectionSetNode,
} from "graphql";
import {
  GraphQLRootValue,
  GraphQLVariables,
  PathIdentity,
  GraphQLContext,
} from "./interfaces";
import { Aether } from "./aether";
import { parseDoc, FieldDigest } from "./parseDoc";

/**
 * Weak maps cannot use a primitive as a key; so we use this object as a
 * fallback.
 *
 * @internal
 */
const WEAK_MAP_FALLBACK_KEY = {};

interface PathDigestVariant {
  pathIdentity: PathIdentity;
  /**
   * This contains ONLY the variables that are used in `@include`/`@skip` and
   * similar directive; these variables identify the variant. The variant must
   * only be used when the variables given here match the request variables.
   */
  matchesVariables: GraphQLVariables;

  fieldDigest: FieldDigest;
}

function isDigestValidAgainstVariables(variables: GraphQLVariables) {
  // TODO: optimise this with a JIT or something?
  return (digest: PathDigestVariant): boolean => {
    // NOTE: null and undefined are deliberately treated as separate values.
    // NOTE: variables may define more values than matchesVariables; that
    // shouldn't affect the match.
    return Object.keys(digest.matchesVariables).every(
      (key) => digest.matchesVariables[key] === variables[key],
    );
  };
}

/**
 * The Doc represents a GraphQL Document (query, mutation, subscription) within
 * a GraphQL schema. It's used for determining the Aether that different
 * resolver calls belong within, and in turn calculating/caching Batch entries
 * during GraphQL execution.
 *
 * This mechanism allows us to do work up front such that following requests
 * for the same document can reuse existing plans/work.
 *
 * If the schema or document changes, then a different Doc should be
 * used since the fields/plans/etc will differ. For the same schema/document,
 * the plans may be affected by variables, context, rootValue; we handle this
 * via the {@link Aether}.
 *
 * See {@link getDoc} for additional details.
 */
export class Doc {
  private aetherByVariablesByContextByRootValue: WeakMap<
    GraphQLRootValue,
    WeakMap<GraphQLContext, WeakMap<GraphQLVariables, Aether>>
  >;

  private digestsByPathIdentity: Map<PathIdentity, PathDigestVariant[]>;

  public readonly rootType: GraphQLObjectType;

  constructor(
    public readonly schema: GraphQLSchema,
    public readonly document: OperationDefinitionNode,
    public readonly fragments: {
      [key: string]: FragmentDefinitionNode;
    },
  ) {
    this.aetherByVariablesByContextByRootValue = new WeakMap();
    this.digestsByPathIdentity = new Map();

    const rootType =
      document.operation === "query"
        ? schema.getQueryType()
        : document.operation === "mutation"
        ? schema.getMutationType()
        : document.operation === "subscription"
        ? schema.getSubscriptionType()
        : null;
    if (!rootType) {
      throw new Error("Could not determine root type of GraphQL query.");
    }
    this.rootType = rootType;
  }

  /**
   * Gets the {@link Aether} to run based on rootValue, context and variables.
   * If these values are the same, then it's expected that it's the same
   * individual GraphQL operation execution (or at least compatible ones!).
   */
  getAether(context: GraphQLContext, resolveInfo: GraphQLResolveInfo): Aether {
    // IMPORTANT: all fallback values MUST be global constants, otherwise we might
    // make multiple Aethers for the same operation.
    const rootValue = resolveInfo.rootValue || WEAK_MAP_FALLBACK_KEY;
    const variables = resolveInfo.variableValues || WEAK_MAP_FALLBACK_KEY;

    // This is an unrolled loop because it's extremely hot.
    // TODO: would be less error-prone to do this with a macro; fortunately
    // TypeScript catches most of the issues.
    let aetherByVariablesByContext = this.aetherByVariablesByContextByRootValue.get(
      rootValue,
    );
    if (!aetherByVariablesByContext) {
      aetherByVariablesByContext = new WeakMap();
      this.aetherByVariablesByContextByRootValue.set(
        rootValue,
        aetherByVariablesByContext,
      );
    }
    let aetherByVariables = aetherByVariablesByContext.get(context);
    if (!aetherByVariables) {
      aetherByVariables = new WeakMap();
      aetherByVariablesByContext.set(context, aetherByVariables);
    }
    let aether = aetherByVariables.get(variables);
    if (!aether) {
      aether = new Aether(this, context);
      aetherByVariables.set(variables, aether);
    }
    return aether;
  }

  digestForPath(
    pathIdentity: PathIdentity,
    variables: GraphQLVariables,
  ): FieldDigest {
    // Get the list of digests valid for the current path
    let digests = this.digestsByPathIdentity.get(pathIdentity);
    if (!digests) {
      digests = [];
      this.digestsByPathIdentity.set(pathIdentity, digests);
    }

    // Can we use one of them?
    const validDigest = digests.find(isDigestValidAgainstVariables(variables));
    if (validDigest) {
      return validDigest.fieldDigest;
    }

    // No... Time to build our own digest then!

    // TODO: find a more efficient way of doing this.

    const trackedVariables = new TrackedObject(variables);

    // TODO: memoize
    const parseResult = parseDoc(this.schema, this, trackedVariables);

    const matchesVariables = {};
    for (const key of trackedVariables.accessedKeys) {
      matchesVariables[key] = variables[key];
    }

    const fieldDigest = parseResult.fieldDigestByPath.get(pathIdentity);

    if (!fieldDigest) {
      throw new Error(
        `Parsing failed, field digest did not exist for '${pathIdentity}'`,
      );
    }
    const newDigest: PathDigestVariant = {
      pathIdentity,
      matchesVariables,
      fieldDigest,
    };

    digests.push(newDigest);
    return newDigest.fieldDigest;
  }

  /** 
  private parseDocument(
    trackedVariables: TrackedObject<GraphQLVariables>,
  ): ParsedDocument {
    const pd: ParsedDocument = {
      name: this.document.name?.value ?? null,
      fields: this.collectFields(
        this.rootType,
        this.document.selectionSet,
        trackedVariables,
      ),
    };
  }

  private collectFields(
    objectType: GraphQLObjectType,
    selectionSet: SelectionSetNode,
    trackedVariables: TrackedObject<GraphQLVariables>,
    visitedFragments: string[]
  ): {
    [fieldName: string]: ParsedField;
  } {
    const groupedFields: {[responseKey: string]:} = {};

  }
  */
}

/**
 * See definition an documentation of {@link getDoc} for more information.
 *
 * @internal
 */
const docByFragmentsByDocumentBySchema = new WeakMap<
  GraphQLSchema,
  WeakMap<
    OperationDefinitionNode,
    WeakMap<
      {
        [key: string]: FragmentDefinitionNode;
      },
      Doc
    >
  >
>();

/**
 * Returns the {@link Doc} for the given resolveInfo. Really this only depends
 * on the schema, the document (query, mutation, subscription) and the
 * fragments.
 */
export function getDoc(resolveInfo: GraphQLResolveInfo): Doc {
  const schema = resolveInfo.schema;
  const document = resolveInfo.operation;
  const fragments = resolveInfo.fragments;

  // This is an unrolled loop because it's extremely hot.
  // TODO: would be less error-prone to do this with a macro; fortunately
  // TypeScript catches most of the issues.
  let docByFragmentsByDocument = docByFragmentsByDocumentBySchema.get(schema);
  if (!docByFragmentsByDocument) {
    docByFragmentsByDocument = new WeakMap();
    docByFragmentsByDocumentBySchema.set(schema, docByFragmentsByDocument);
  }
  let docByFragments = docByFragmentsByDocument.get(document);
  if (!docByFragments) {
    docByFragments = new WeakMap();
    docByFragmentsByDocument.set(document, docByFragments);
  }
  let doc = docByFragments.get(fragments);
  if (!doc) {
    doc = new Doc(schema, document, fragments);
    docByFragments.set(fragments, doc);
  }

  return doc;
}
