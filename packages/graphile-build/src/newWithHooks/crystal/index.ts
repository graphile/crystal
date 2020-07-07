import { GraphQLResolveInfo } from "graphql";
import { getDoc } from "./doc";
import { CrystalResult } from "./interfaces";

/**
 * Called from each GraphQL resolver; this tracks down (or creates) the plan
 * for this specific field, executes it, and returns the result (which should
 * be data the resolver requires).
 *
 * @remarks
 * Called from `graphileWrapResolver`.
 *
 * MUST run synchronously, otherwise we might not batch correctly.
 */
export function executePlanFromResolver(
  parent: any,
  args: { [key: string]: any },
  context: GraphileEngine.GraphileResolverContext,
  info: GraphQLResolveInfo,
): Promise<CrystalResult> {
  const doc = getDoc(info);
  const aether = doc.getAether(context, info);
  const batch = aether.getBatch(parent, args, context, info);
  return batch.getResultFor(parent, info);
}
