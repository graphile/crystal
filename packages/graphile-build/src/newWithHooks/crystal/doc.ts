import {
  GraphQLSchema,
  OperationDefinitionNode,
  GraphQLResolveInfo,
  GraphQLObjectType,
} from "graphql";
import { GraphQLRootValue, GraphQLVariables, PathIdentity } from "./interfaces";
import { Aether } from "./aether";

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
    WeakMap<
      GraphileEngine.GraphileResolverContext,
      WeakMap<GraphQLVariables, Aether>
    >
  >;

  private digestsByPathIdentity: Map<PathIdentity, PathDigestVariant[]>;

  public readonly rootType: GraphQLObjectType;

  constructor(
    public readonly schema: GraphQLSchema,
    public readonly document: OperationDefinitionNode,
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
  getAether(
    context: GraphileEngine.GraphileResolverContext,
    resolveInfo: GraphQLResolveInfo,
  ) {
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

  digestForPath(pathIdentity: PathIdentity, variables: GraphQLVariables) {
    // Determine if this path has already been digested
  }
}

/**
 * See definition an documentation of {@link getDoc} for more information.
 *
 * @internal
 */
const docByDocumentBySchema = new WeakMap<
  GraphQLSchema,
  WeakMap<OperationDefinitionNode, Doc>
>();

/**
 * Returns the {@link Doc} for the given resolveInfo. Really this only depends
 * on the schema and the document (query, mutation, subscription).
 */
export function getDoc(resolveInfo: GraphQLResolveInfo): Doc {
  const schema = resolveInfo.schema;
  const document = resolveInfo.operation;

  // This is an unrolled loop because it's extremely hot.
  // TODO: would be less error-prone to do this with a macro; fortunately
  // TypeScript catches most of the issues.
  let docByDocument = docByDocumentBySchema.get(schema);
  if (!docByDocument) {
    docByDocument = new WeakMap();
    docByDocumentBySchema.set(schema, docByDocument);
  }
  let doc = docByDocument.get(document);
  if (!doc) {
    doc = new Doc(schema, document);
    docByDocument.set(document, doc);
  }

  return doc;
}
