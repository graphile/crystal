import { Plan } from "./plan";
import { UniqueId } from "./utils";

export const $$crystalContext = Symbol("context");
export const $$idByPathIdentity = Symbol("idByPathIdentity");
export const $$indexesByPathIdentity = Symbol("indexesByPathIdentity");
export const $$data = Symbol("data");

export interface CrystalObject<TData> {
  [$$crystalContext]: CrystalContext;
  [$$idByPathIdentity]: { [pathIdentity: string]: UniqueId };
  [$$indexesByPathIdentity]: { [pathIdentity: string]: number[] };
  [$$data]: TData;
}

export interface Batch {
  pathIdentity: string;
  crystalContext: CrystalContext;
  plan: Plan;
  entries: Array<[CrystalObject<any>, DeferredResult]>;
}

export interface CrystalContext {
  resultByIdByPlanId: {
    [planId: number]: {
      [id: /* UniqueId */ string]: any;
    };
  };
  metaByPlanId: {
    [planId: number]: object;
  };
  rootId: UniqueId;
}
