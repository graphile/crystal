import chalk from "chalk";
import { inspect } from "util";

import { crystalColor, crystalPrintPathIdentity } from "./crystalPrint";
import { sharedNull } from "./utils";

const isDev = process.env.GRAPHILE_ENV === "development";
let planResultsId = 0;

/**
 * @internal
 */
export interface PlanResultsBucket {
  [planId: string]: any;
}

// TODO: rewrite this comment to refer to bucketId rather than commonAncestorPathIdentity
// TODO: completely remove this API if we can as part of replacing execution-v1 with execution-v2
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
 * `__ItemPlan` boundary) because it enables garbage collection to discard
 * values when they're no longer needed.
 *
 * "Branch" refers to the fact that PlanResults branch for each list item
 * returned from a list (or, more specifically, a `__ItemPlan`) - plans
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
  id = planResultsId++;
  private store: { [pathIdentity: string]: PlanResultsBucket | undefined };

  constructor(inheritFrom?: PlanResults) {
    if (inheritFrom) {
      this.store = Object.create(inheritFrom.store);
    } else {
      this.store = Object.create(sharedNull);
    }
  }

  toString(): string {
    const keys: string[] = [];
    for (const key in this.store) {
      keys.push(key);
    }
    keys.sort((a, z) => z.length - a.length)[0] ?? "?";
    return chalk.bold(
      crystalColor(
        `PlanResults[${this.id}:${chalk.bold.grey(
          crystalPrintPathIdentity(keys[0] ?? "?"),
        )}]`,
        this.id,
      ),
    );
  }

  /**
   * Sets the plan result for the given plan.bucketId and
   * plan.id.
   */
  public set(bucketId: number, planId: string, data: any): any {
    const bucket = this.getBucket(bucketId);
    if (isDev && planId in bucket) {
      throw new Error(
        `${this}: Attempted to overwrite value for plan '${planId}' at bucket id '${bucketId}' from '${inspect(
          bucket[planId],
          { colors: true },
        )}' to '${inspect(data, { colors: true })}'`,
      );
    }
    bucket[planId] = data;
    return;
  }

  /**
   * Gets the plan result (if any) for the given plan.bucketId and
   * plan.id.
   */
  public get(bucketId: number, planId: string): any {
    return this.store[bucketId]?.[planId];
  }

  /**
   * Gets the bucket into which plan results are stored for plans with the
   * given bucketId.
   *
   * @internal
   *
   * (This is internal because we may change from objects to maps or vice versa
   * depending on benchmark results.)
   */
  public getBucket(bucketId: number): PlanResultsBucket {
    return (
      this.store[bucketId] ?? (this.store[bucketId] = Object.create(sharedNull))
    );
  }

  /**
   * Determines if there is a plan result for the given
   * plan.bucketId and plan.id.
   */
  public has(bucketId: number, planId: string): boolean {
    return this.store[bucketId] !== undefined
      ? planId in this.store[bucketId]!
      : false;
  }

  /**
   * Determines if there is a "bucket" for the given "bucketId".
   */
  public hasBucketId(bucketId: number): boolean {
    return this.store[bucketId] !== undefined;
  }
}
