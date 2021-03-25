import {
  PathIdentity,
  CrystalResult,
  $$path,
  $$batch,
  GraphQLContext,
} from "./interfaces";
import { Batch } from "./batch";
import { Doc } from "./doc";
import { GraphQLResolveInfo } from "graphql";
import { getPathIdentityFromResolveInfo } from "./utils";
import { isCrystalResult } from "./crystalResult";

/**
 * The Aether represents the context in which resolvers run; we can assume that
 * all resolvers that run in the same Aether would give identical results for
 * the same inputs.
 *
 * We'd typically like an {@link Aether} to be defined for a single operation
 * execution, but this is hard to determine from inside the schema, and it also
 * prevents certain optimizations such as sharing execution information between
 * identical queries from the same user across concurrent requests. So instead,
 * we consider: what things could cause a plan to have a different outcome?
 *
 * - schema: different schema, everything's different
 * - document/operationName: different operation, different plan dependencies/etc
 * - rootValue: rarely passed, but if it is, it may define a different
 *   runtime context
 * - context: if the context differs, then things like user authentication
 *   could differ, so we may not be able to reuse previous values
 * - variables: if the variables differ, the plans may differ
 *
 * If the schema, document or operationName change, we need a new Aether.
 * Within a single operation execution, we'd expect all of these to be
 * consistent.
 *
 * For `rootValue`, `context` and `variables` it's a little more subtle; we
 * only care about changes to these that affect planning - if there are any
 * diferences that do this then we should use a separate Aether. But if these
 * values are _compatible_ (even if they're not the same) we can use the same
 * aether.
 *
 * Interestingly, this catches the case where a `graphql(...)` execution occurs
 * within a resolver; in that case the operation would differ so we'd define a
 * new aether for it. I believe this is desired.
 *
 * The Aether is used for calculating/caching Batch entries during GraphQL
 * execution.
 *
 * Aether's exist within a `Doc`, so `schema` and `document`/`operationName`
 * are handled already; and the Doc's `getAether` method handles the other
 * concerns.
 *
 * See {@link Doc.getAether} for additional details.
 *
 * @internal
 */
export class Aether {
  private batches: Map<PathIdentity, Batch>;

  constructor(
    public readonly doc: Doc,
    public readonly variables: { [key: string]: any },
    public readonly context: GraphQLContext,
    public readonly rootValue: any,
  ) {
    this.batches = new Map();
  }

  /**
   * Gets (or creates) the batch for a given path identity within the current
   * Aether.
   *
   * @param parent - The result of the previous plan execution (null if root
   *   query)
   * @param args - Since a batch runs for a single (optionally aliased) field
   *   in the operation, we know that the args for all entries within the batch
   *   will be the same.
   * @param context - As with args, will be the same for all entries in the
   *   batch.
   * @param info - Mostly needed for the path identity.
   */
  getBatch(
    parent: unknown,
    args: { [key: string]: unknown },
    context: GraphQLContext,
    info: GraphQLResolveInfo,
  ): Batch {
    const parentCrystalResult: CrystalResult | null = isCrystalResult(parent)
      ? parent
      : null;
    const pathIdentity = getPathIdentityFromResolveInfo(
      info,
      parentCrystalResult ? parentCrystalResult[$$path] : undefined,
    );
    if (
      parentCrystalResult &&
      parentCrystalResult[$$batch].appliesTo(pathIdentity)
    ) {
      // There's already a batch root and it applies to us 🎉
      return parentCrystalResult[$$batch];
    }

    // We must be the batch root.
    // First, see if this pathIdentity has already created a batch:
    let batch = this.batches.get(pathIdentity);
    if (!batch) {
      // No existing batch, we must be the first call to getBatch within this
      // aether for this pathIdentity. Create a batch and cache it so all my
      // counterparts will use it too.
      batch = new Batch(this, parent, args, context, info);
      this.batches.set(pathIdentity, batch);
    }

    return batch;
  }
}
