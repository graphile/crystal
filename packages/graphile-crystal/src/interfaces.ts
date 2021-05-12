import { Plan } from "./plan";
import { UniqueId } from "./utils";
import { Deferred } from "./deferred";

export const $$crystalContext = Symbol("context");
export const $$data = Symbol("data");
export const $$id = Symbol("id");
export const $$indexes = Symbol("indexes");
export const $$pathIdentity = Symbol("pathIdentity");
export const $$idByPathIdentity = Symbol("idByPathIdentity");
export const $$indexesByPathIdentity = Symbol("indexesByPathIdentity");

export interface CrystalObject<TData> {
  [$$id]: UniqueId;
  [$$pathIdentity]: string;
  [$$indexes]: ReadonlyArray<number>;
  [$$crystalContext]: CrystalContext;
  [$$idByPathIdentity]: { [pathIdentity: string]: UniqueId | undefined };
  [$$indexesByPathIdentity]: {
    [pathIdentity: string]: ReadonlyArray<number> | undefined;
  };
  [$$data]: TData;
}

export interface Batch {
  pathIdentity: string;
  crystalContext: CrystalContext;
  plan: Plan;
  entries: Array<[CrystalObject<any>, Deferred<any>]>;
}

export interface CrystalContext {
  /**
   * This is the plan result cache. Plans can be executed more than once due to
   * parts of the tree being delayed (possibly due to @stream/@defer, possibly
   * just due to the resolvers for one "layer" not all completing at the same
   * time), so we cannot rely on writing the results all at once.
   *
   * The cache consists of multiple layers:
   *
   * - First is the plan ID; note that a plan is always created within the
   *   context of a specific field within a specific operation, so it has an
   *   inherent path identity.
   * - Next is the unique ID for the parent field instance (if the parent field
   *   was part of a list then each instance of this parent field within the list
   *   will have a different unique id).
   * - Next is the indexes of the current field instance within the parent
   *   field instance - if the parent field does not return a list then this will
   *   be an empty array, if the parent field returns a list (or list of lists,
   *   or list of list of lists, ...) then this will be an array of the indicies
   *   within these lists.
   * - Finally we have the plan result data. Note that this could be anything.
   *
   */
  resultByIdByPlanId: {
    [planId: number]:
      | Record<UniqueId, Map<string /* indexes, joined with commas */, any>>
      | undefined;
  };

  metaByPlanId: {
    [planId: number]: object | undefined;
  };

  rootId: UniqueId;
}
