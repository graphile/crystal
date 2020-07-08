import { GraphQLResolveInfo } from "graphql";
import { PathIdentity } from "./interfaces";
import { Path } from "graphql/jsutils/Path";

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
export function getPathIdentityFromResolveInfo(
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
