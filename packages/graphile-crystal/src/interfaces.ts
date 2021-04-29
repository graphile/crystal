import { Plan } from "./plan";
import { UniqueId } from "./utils";
import { Deferred } from "./deferred";

export const $$crystalContext = Symbol("context");
export const $$data = Symbol("data");
export const $$id = Symbol("id");
export const $$idByPathIdentity = Symbol("idByPathIdentity");
export const $$indexesByPathIdentity = Symbol("indexesByPathIdentity");

export interface CrystalObject<TData> {
  [$$id]: UniqueId;
  [$$crystalContext]: CrystalContext;
  [$$idByPathIdentity]: { [pathIdentity: string]: UniqueId };
  [$$indexesByPathIdentity]: { [pathIdentity: string]: number[] };
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
    [planId: number]: {
      [id: /* UniqueId */ symbol]: any;
    };
  };
  metaByPlanId: {
    [planId: number]: object;
  };
  rootId: UniqueId;
}
