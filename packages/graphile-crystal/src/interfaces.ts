import { Plan } from "./plan";

export const $$crystalContext = Symbol("context");
export const $$idByPathIdentity = Symbol("idByPathIdentity");
export const $$indexesByPathIdentity = Symbol("indexesByPathIdentity");
export const $$data = Symbol("data");

export interface CrystalObject<TData> {
  [$$crystalContext]: CrystalContext;
  [$$idByPathIdentity]: { [pathIdentity: string]: number };
  [$$indexesByPathIdentity]: { [pathIdentity: string]: number[] };
  [$$data]: TData;
}

export interface Batch {
  pathIdentity: string;
  crystalContext: CrystalContext;
  plan: Plan;
  entries: Array<[CrystalObject<any>, DeferredResult]>;
}
