import { inspect } from "util";

import { isDev } from "./dev";

/**
 * PlanResults stores the results from plan execution. A `PlanResults` instance
 * is typically accessed via the `CrystalObject` to which it belongs, however
 * they also exist independently during plan execution when the `CrystalObject`
 * has not yet been built - they may be assigned to a `CrystalObject` later.
 *
 * Execution results of plans are partitioned into "buckets" based on the
 * "level" and "branch" of the (concrete or future) CrystalObject within the
 * GraphQL operation resolution.
 *
 * "Level" refers to the `commonAncestorPathIdentity` of the relevant plan -
 * i.e. at what point in the GraphQL operation is it first referenced such that
 * all fields under this point can share its results.  We could use the root
 * path identity for everything that doesn't come under a list, but it's
 * preferable to push the commonAncestorPathIdentity to be the deepest
 * pathIdentity that's still a common ancestor (and doesn't cross a
 * __ListItemPlan boundary) because it enables garbage collection to discard
 * values when they're no longer needed.
 *
 * "Branch" refers to the fact that PlanResults branch for each list item
 * returned from a list (or, more specifically, a `__ListItemPlan`) - plans
 * dependent on sibling items will store results to separate (per-item) caches.
 *
 * "Bucket" is a cache object (currently a Map) for a given "level" and
 * "branch" that stores the results of plans at that level by their `id`s.
 * PlanResults store mulitple "buckets".
 *
 * Critically, "buckets" for the same `pathIdentity` will be shared (by
 * reference) with _descendent_ PlanResults - so if a great grandchild
 * PlanResults writes to a bucket that was inherited from its grandparent then
 * its parent, grandparent, child and cousin PlanResults can also access this
 * data. However, child PlanResults will likely add their own buckets to which
 * the parent PlanResults will not have access - this allows the data to be
 * partitioned based on list and field boundaries so that the cache can be
 * garbage collected by the JavaScript garbage collector even before the
 * operation has fully completed. This is particularly useful in `@stream`,
 * `@defer` and subscriptions since we do not want the data generated during
 * these operations to be retained until the operation completes - we only need
 * to retain it until it has been sent to the client in the relevant payload.
 *
 * @remarks API inspired by Map.
 */
export class PlanResults {
  private store: { [pathIdentity: string]: Map<number, any> | undefined } =
    Object.create(null);

  constructor(inheritFrom?: PlanResults) {
    if (inheritFrom) {
      Object.assign(this.store, inheritFrom.store);
    }
  }

  /**
   * Sets the plan result for the given plan.commonAncestorPathIdentity and
   * plan.id.
   */
  public set(
    commonAncestorPathIdentity: string,
    planId: number,
    data: any,
  ): any {
    const s =
      this.store[commonAncestorPathIdentity] ??
      (this.store[commonAncestorPathIdentity] = new Map());
    if (isDev && s.has(planId) && s.get(planId) !== data) {
      throw new Error(
        `Attempted to overwrite value for plan '${planId}' at path identity '${commonAncestorPathIdentity}' from '${inspect(
          s.get(planId),
          { colors: true },
        )}' to '${inspect(data, { colors: true })}'`,
      );
    }
    return s.set(planId, data);
  }

  /**
   * Gets the plan result (if any) for the given plan.commonAncestorPathIdentity and
   * plan.id.
   */
  public get(commonAncestorPathIdentity: string, planId: number): any {
    return this.store[commonAncestorPathIdentity]?.get(planId);
  }

  /**
   * Determines if there is a plan result for the given
   * plan.commonAncestorPathIdentity and plan.id.
   */
  public has(commonAncestorPathIdentity: string, planId: number): boolean {
    return this.store[commonAncestorPathIdentity]?.has(planId) ?? false;
  }

  /**
   * Determines if there is a "bucket" for the given "commonAncestorPathIdentity".
   */
  public hasPathIdentity(commonAncestorPathIdentity: string): boolean {
    return !!this.store[commonAncestorPathIdentity];
  }
}
