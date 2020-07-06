import {
  GraphQLResolveInfo,
  OperationDefinitionNode,
  GraphQLSchema,
} from "graphql";
import { getAliasFromResolveInfo } from "graphql-parse-resolve-info";
import { Path } from "graphql/jsutils/Path";

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

/**
 * The Aether defines a context within which our plans execute; see
 * {@link getAether} for additional details.
 */
class Aether {
  batches: Map<string, Batch>;

  constructor() {
    this.batches = new Map();
  }

  /**
   * Gets (or creates) the batch for a given path identity.
   */
  getBatch(
    graphile: GraphileEngine.GraphQLObjectTypeGraphileExtension,
    pathIdentity: PathIdentity,
  ) {
    let batch = this.batches.get(pathIdentity);
    if (batch) {
      return batch;
    }
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
  WeakMap<
    OperationDefinitionNode,
    WeakMap<
      any,
      WeakMap<GraphileEngine.GraphileResolverContext, WeakMap<any, Aether>>
    >
  >
>();

/**
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
function getAether(
  context: GraphileEngine.GraphileResolverContext,
  resolveInfo: GraphQLResolveInfo,
): Aether {
  // IMPORTANT: all fallback values MUST be global constants, otherwise we might
  // make multiple Aethers for the same operation.
  const schema = resolveInfo.schema;
  const document = resolveInfo.operation;
  const rootValue = resolveInfo.rootValue || WEAK_MAP_FALLBACK_KEY;
  const variables = resolveInfo.variableValues || WEAK_MAP_FALLBACK_KEY;

  // This is an unrolled loop because it's extremely hot.
  // TODO: this'd be better as a macro
  let a = weakPathRoot.get(schema);
  if (!a) {
    a = new WeakMap();
    weakPathRoot.set(schema, a);
  }
  let b = a.get(document);
  if (!b) {
    b = new WeakMap();
    a.set(document, b);
  }
  let c = b.get(rootValue);
  if (!c) {
    c = new WeakMap();
    b.set(rootValue, c);
  }
  let d = c.get(context);
  if (!d) {
    d = new WeakMap();
    c.set(context, d);
  }
  let aether = d.get(variables);
  if (!aether) {
    aether = new Aether();
    d.set(variables, aether);
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
 * Gets the batch associated with a particular resolver.
 *
 * @param graphile - Contains the plans, etc
 * @param args - Since a batch runs for a single (optionally aliased) field in
 *   the operation, we know that the args for all entries within the batch will
 *   be the same.
 * @param context - As with args, will be the same for all entries in the batch.
 * @param info - Required to determine the Aether in which the batch runs.
 */
export function getBatch(
  graphile: GraphileEngine.GraphQLObjectTypeGraphileExtension,
  args: { [key: string]: any },
  context: GraphileEngine.GraphileResolverContext,
  info: GraphQLResolveInfo,
) {
  // First: get the aether for this operation
  const aether = getAether(context, info);

  // Second: identify this position in the operation (batch plan execution)
  const identity = getPathIdentityFromResolveInfo(info);

  // Finally: get the batch
  return aether.getBatch(graphile, identity /*, args, context */);
}

/**
 * Called from each GraphQL resolver; this tracks down (or creates) the plan
 * for this specific field, executes it, and returns the result (which should
 * be data the resolver requires).
 *
 * Called from `graphileWrapResolver`.
 */
export function getDataForResolver(
  graphile: GraphileEngine.GraphQLObjectTypeGraphileExtension,
  parent: any,
  args: { [key: string]: any },
  context: GraphileEngine.GraphileResolverContext,
  info: GraphQLResolveInfo,
): any {
  const aether = getAether(context, info);
  const identity = getPathIdentityFromResolveInfo(info, parent?.[$$path]);
  const batch = aether.getBatch(graphile, identity /*, args, context */);
  if (parent && parent[$$plan]) {
    // Our plan has already executed
  } else {
    // We're the root plan
  }
}
