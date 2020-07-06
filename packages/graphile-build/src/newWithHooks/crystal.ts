import {
  GraphQLResolveInfo,
  OperationDefinitionNode,
  GraphQLSchema,
  SelectionSetNode,
  SelectionNode,
  DocumentNode,
  visit,
  visitWithTypeInfo,
  GraphQLObjectType,
  isListType,
  isNonNullType,
  isNamedType,
  GraphQLNamedType,
  GraphQLUnionType,
  GraphQLInterfaceType,
  isUnionType,
  isObjectType,
  isInterfaceType,
} from "graphql";
import { getAliasFromResolveInfo } from "graphql-parse-resolve-info";
import { Path } from "graphql/jsutils/Path";
import mergeAST from "../mergeAst";
import assert from "assert";

const $$plan = Symbol("plan");
const $$data = Symbol("data");
const $$root = Symbol("root");
// Used to ease creation of PathIdentity
const $$path = Symbol("path");

/**
 * e.g. `Query.allUsers>UsersConnection.nodes>User.username`
 */
type PathIdentity = string;

/**
 * Weak maps cannot use a primitive as a key; so we use this object as a
 * fallback.
 */
const WEAK_MAP_FALLBACK_KEY = {};

/**
 * Every path ({@link getPathIdentityFromResolveInfo}) within our GraphQL
 * document can have its own unique Batch; the batch is responsible for
 * grouping all operations required to feed data to this resolver across all
 * the times it will be called. Note that because arguments and selection sets
 * can differ for different paths, we cannot batch at purely the resolver
 * level.
 */
class Batch {
  constructor(
    private graphile: GraphileEngine.GraphQLObjectTypeGraphileExtension,
  ) {}
}

interface PathInfo {
  graphile: GraphileEngine.GraphQLObjectTypeGraphileExtension | null;
}

function populateInfo(
  schema: GraphQLSchema,
  infoByPathIdentity: Map<PathIdentity, PathInfo>,
  selectionSet: SelectionSetNode,
  parentType: GraphQLObjectType | GraphQLUnionType | GraphQLInterfaceType,
  path = "",
) {
  for (const selection of selectionSet.selections) {
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
        const pathIdentity =
          path + (path ? ">" : "") + `${parentType.name}.${alias}`;
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

        if (isObjectType(parentType)) {
          infoByPathIdentity.set(pathIdentity, {
            graphile,
          });
        } else {
          // TODO!
          // NOTE TO SELF: I think this is the wrong approach. We shouldn't list
          // out all possibilities for an interface, e.g. "search results" might
          // return a Node, but only actually implement 4 nodes not all 200;
          // exhaustively listing them all is expensive and unnecessary. Perhaps
          // the plan for interfaces should factor in the particular return
          // types?
        }

        if (selection.selectionSet) {
          populateInfo(
            schema,
            infoByPathIdentity,
            selection.selectionSet,
            unwrappedType,
            pathIdentity,
          );
        }
        break;
      }
      case "InlineFragment": {
        if (
          !selection.typeCondition ||
          (selection.typeCondition &&
            selection.typeCondition.name.value === parentType.name)
        ) {
          // Redundant fragment
          populateInfo(
            schema,
            infoByPathIdentity,
            selection.selectionSet,
            parentType,
            path,
          );
          break;
        }
        const fragmentType = schema.getType(selection.typeCondition.name.value);
        assert(
          fragmentType,
          "Couldn't find type associated with this fragment",
        );
        populateInfo(
          schema,
          infoByPathIdentity,
          selection.selectionSet,
          fragmentType,
          path,
        );
      }
    }
  }
}

/**
 * The Aether represents a GraphQL Document (query, mutation, subscription)
 * within a GraphQL schema. It's used for calculating/caching Batch entries
 * during GraphQL execution.
 *
 * See {@link getAether} for additional details.
 */
class Aether {
  private batches: Map<PathIdentity, Batch>;
  private infoByPathIdentity: Map<PathIdentity, PathInfo>;

  constructor(
    private schema: GraphQLSchema,
    private document: OperationDefinitionNode,
  ) {
    this.batches = new Map();
    this.infoByPathIdentity = new Map();

    const rootType =
      document.operation === "query"
        ? schema.getQueryType()?.name
        : document.operation === "mutation"
        ? schema.getMutationType()?.name
        : document.operation === "subscription"
        ? schema.getSubscriptionType()?.name
        : null;
    if (!rootType) {
      throw new Error("Could not determine root type of GraphQL query.");
    }

    populateInfo(
      schema,
      this.infoByPathIdentity,
      document.selectionSet,
      rootType,
    );

    /*
    // IMPORTANT: all fallback values MUST be global constants, otherwise we might
    // make multiple Aethers for the same operation.
    const rootValue = resolveInfo.rootValue || WEAK_MAP_FALLBACK_KEY;
    const variables = resolveInfo.variableValues || WEAK_MAP_FALLBACK_KEY;
    */
  }

  /**
   * Gets (or creates) the batch for a given path identity.
   *
   * @param graphile - Contains the plans, etc
   * @param parent - The result of the previous plan execution (null if root query)
   * @param args - Since a batch runs for a single (optionally aliased) field in
   *   the operation, we know that the args for all entries within the batch will
   *   be the same.
   * @param context - As with args, will be the same for all entries in the batch.
   * @param info - Required to determine the Aether in which the batch runs.
   */
  getBatch(
    parent: any,
    args: { [key: string]: unknown },
    context: GraphileEngine.GraphileResolverContext,
    info: GraphQLResolveInfo,
  ) {
    const pathIdentity = getPathIdentityFromResolveInfo(info, parent?.[$$path]);
    let batch = this.batches.get(pathIdentity);
    if (batch) {
      return batch;
    }

    const graphile: GraphileEngine.GraphQLObjectTypeGraphileExtension =
      extensions?.graphile || {};
    const { plan } = graphile;

    batch = new Batch(graphile);
    this.batches.set(pathIdentity, batch);
    return batch;
  }
}

/**
 * See definition an documentation of {@link getAether} for more information.
 */
const weakPathRoot = new WeakMap<
  GraphQLSchema,
  WeakMap<OperationDefinitionNode, Aether>
>();

/**
 * The {@link Aether} is like an analysis of our incoming document, with all
 * the plans understood. This allows us to do work up front such that following
 * requests for the same document can reuse the existing plans over and over.
 *
 * If the schema or document changes, then a different Aether should be
 * used since the fields/plans/etc will differ. For the same schema/document,
 * the plans may be affected by variables, context, rootValue; but the Aether
 * itself deals with this in an efficient manner.
 */
function getAether(resolveInfo: GraphQLResolveInfo): Aether {
  const schema = resolveInfo.schema;
  const document = resolveInfo.operation;

  // This is an unrolled loop because it's extremely hot.
  // TODO: this'd be better as a macro
  let a = weakPathRoot.get(schema);
  if (!a) {
    a = new WeakMap();
    weakPathRoot.set(schema, a);
  }
  let aether = a.get(document);
  if (!aether) {
    aether = new Aether(schema, document);
    a.set(document, aether);
  }

  return aether;
}

/**
 * Returns the path identity of a field resolver.
 *
 * In Graphile Engine, we batch plan execution by the specific field that the
 * user requested, factoring in the parent type, arguments, directives and
 * selection set. We cannot use simply the type and field name, since the same
 * field name can be specified multiple times with different arguments. We
 * cannot use Type and alias, because the same alias may be referred to on the
 * same type in multiple places in the operation, but referring to different
 * things (different field, different arguments). Even if we handled these
 * differences, the different selection sets would affect how our plan
 * executes. If we pin based on the path, then interfaces/unions could get us
 * into trouble, as the selection set may differ even when the path is the
 * same. We might thing that we could use the path and the parent type, but
 * again this would fall down if something closer to the root were a union or
 * interface. So: we must use the parent type and alias/field name at every
 * step in the path, or have another way of uniquely identifying this specific
 * field resolution.
 *
 * An example identifier might look like:
 *
 *     Query.allUsers>UsersConnection.nodes>User.username
 */
function getPathIdentityFromResolveInfo(
  resolveInfo: GraphQLResolveInfo,
  parentPath?: PathIdentity,
): PathIdentity {
  if (parentPath) {
    return parentPath + `>${resolveInfo.path.typename}.${resolveInfo.path.key}`;
  } else {
    const path = [];
    let currentPath: Path | undefined = resolveInfo.path;
    while (currentPath) {
      path.push(`${currentPath.typename}.${currentPath.key}`);
      currentPath = currentPath.prev;
    }
    return path.reverse().join(">");
  }
}

/**
 * Called from each GraphQL resolver; this tracks down (or creates) the plan
 * for this specific field, executes it, and returns the result (which should
 * be data the resolver requires).
 *
 * Called from `graphileWrapResolver`.
 */
export function executePlanFromResolver(
  parent: any,
  args: { [key: string]: any },
  context: GraphileEngine.GraphileResolverContext,
  info: GraphQLResolveInfo,
): {
  data: any;
  plan: any;
} {
  const aether = getAether(info);
  const batch = aether.getBatch(parent, args, context, info);
  if (parent && parent[$$plan]) {
    // Our plan has already executed
  } else {
    // We're the root plan
  }
  return {
    data: null,
    plan: null,
  };
}

/*

DEPRECATED NOTES

Relating to getAether:

 * We'd typically like an {@link Aether} to be defined for a single operation
 * execution, but this is hard to determine from inside the schema, and it also
 * prevents certain optimizations such as sharing execution information between
 * identical queries from the same user across concurrent requests. So instead,
 * we consider: what things could cause a plan to have a different outcome?
 *
 * - schema: different schema, everything's different
 * - document: different operation, different plan dependencies/etc
 * - rootValue: rarely passed, but if it is, it probably defines a different
 *   runtime context
 * - context: if the context differs, then things like user authentication
 *   could differ, so we can't reuse previous values
 * - variables: if the variables differ, the plans differ
 *
 * If any of the above change, we need a new aether. But within a single
 * operation execution, we'd expect all of these to be consistent.
 *
 * Interestingly, this also catches the case where a `graphql(...)` execution
 * occurs within a resolver; in that case the document would differ so we'd
 * define a new aether for it. I believe this is desired.
 
 
*/
