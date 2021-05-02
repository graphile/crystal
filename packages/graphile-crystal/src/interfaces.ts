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
  resultByIdByPlanId: {
    [planId: number]: Record<UniqueId, any> | undefined;
  };
  metaByPlanId: {
    [planId: number]: object | undefined;
  };
  rootId: UniqueId;
}
