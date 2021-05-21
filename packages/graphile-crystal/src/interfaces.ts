import { Deferred } from "./deferred";
import { Plan } from "./plan";
import { UniqueId } from "./utils";

export const $$crystalContext = Symbol("context");
export const $$data = Symbol("data");
export const $$id = Symbol("id");
export const $$indexes = Symbol("indexes");
export const $$pathIdentity = Symbol("pathIdentity");
export const $$crystalObjectByPathIdentity = Symbol(
  "crystalObjectByPathIdentity",
);
export const $$indexesByPathIdentity = Symbol("indexesByPathIdentity");

export interface CrystalObject<TData> {
  [$$id]: UniqueId;
  [$$pathIdentity]: string;
  [$$indexes]: ReadonlyArray<number>;
  [$$crystalContext]: CrystalContext;
  [$$crystalObjectByPathIdentity]: {
    [pathIdentity: string]: CrystalObject<any> | undefined;
  };
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
   * - Next is the crystal object that represents the parent field instance (if
   *   the parent field was part of a list then each value within this list will
   *   have a different, unique, crystal object).
   * - Finally we have the plan result data. Note that this could be anything.
   *
   */
  resultByCrystalObjectByPlanId: Map<number, Map<CrystalObject<any>, any>>;

  metaByPlanId: {
    [planId: number]: object | undefined;
  };

  rootId: UniqueId;

  rootCrystalObject: CrystalObject<any>;
}

// These values are just to make reading the code a little clearer
export type CrystalValuesList<T> = ReadonlyArray<T>;
export type CrystalResultsList<T> = ReadonlyArray<T>;
export type PromiseOrDirect<T> = Promise<T> | T;
