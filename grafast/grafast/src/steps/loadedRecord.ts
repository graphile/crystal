import { type __ItemStep, type ExecutionDetails } from "../index.js";
import type { GrafastResultsList, Maybe } from "../interfaces.js";
import { Step } from "../step.js";
import { arrayOfLength, recordsMatch } from "../utils.js";
import { access } from "./access.js";
import { constant } from "./constant.js";
import { LoadManyStep } from "./loadMany.js";

/**
 * You shouldn't create instances of this yourself - use `loadOne` or `loadMany` instead.
 */
export class LoadedRecordStep<
  TItem,
  TData extends Maybe<TItem> = Maybe<TItem>,
  TParams extends Record<string, any> = Record<string, any>,
> extends Step<TData> {
  static $$export = {
    moduleName: "grafast",
    exportName: "LoadedRecordStep",
  };

  isSyncAndSafe = true;

  attributes = new Set<keyof TItem>();
  paramDepIdByKey: {
    [TKey in keyof TParams]: number;
  } = Object.create(null);
  constructor(
    $loadMany: LoadManyStep<any, any, any, any, any>,
    $data: Step<TData>,
    private isSingle: boolean,
    private sourceDescription: Maybe<string>,
    // Only safe to reference this during planning phase
    private ioEquivalence: Record<string, Step>,
  ) {
    super();
    this.addDependency($data);
    this.addDependency($loadMany);
  }
  toStringMeta() {
    return this.sourceDescription ?? null;
  }
  get(attr: keyof TItem & (string | number)) {
    return this.cacheStep("get", attr, () => this._getInner(attr));
  }
  private _getInner(attr: keyof TItem & (string | number)) {
    // Allow auto-collapsing of the waterfall by knowing keys are equivalent
    if (
      this.operationPlan.phase === "plan" &&
      this.ioEquivalence[attr as any]
    ) {
      return this.ioEquivalence[attr as any];
    }

    this.attributes.add(attr);
    return access(this, attr);
  }
  setParam<TParamKey extends keyof TParams>(
    paramKey: TParamKey,
    value: TParams[TParamKey] | Step<TParams[TParamKey]>,
  ): void {
    if (!this.isSingle) {
      throw new Error(
        "setParam should not be called on list items - call it on the collection (`loadMany()` step)",
      );
    }
    this.paramDepIdByKey[paramKey] = this.addUnaryDependency(
      value instanceof Step ? value : constant(value),
    );
  }
  deduplicate(peers: LoadedRecordStep<any, any>[]) {
    return peers.filter(
      (p) =>
        p.isSingle === this.isSingle &&
        p.sourceDescription === this.sourceDescription &&
        recordsMatch(p.ioEquivalence, this.ioEquivalence) &&
        recordsMatch(p.paramDepIdByKey, this.paramDepIdByKey),
    );
  }
  public deduplicatedWith(replacement: LoadedRecordStep<any, any>): void {
    for (const attr of this.attributes) {
      replacement.attributes.add(attr);
    }
  }
  optimize() {
    const $source = this.getDepDeep(1);
    if ($source instanceof LoadManyStep) {
      // Tell our parent we only need certain attributes
      $source.addAttributes(this.attributes);
      for (const [key, depId] of Object.entries(this.paramDepIdByKey)) {
        $source.setParam(key, this.getDep(depId));
      }
    } else {
      // This should never happen
      throw new Error(
        `LoadedRecordStep could not find the parent LoadManyStep; instead found ${$source}`,
      );
    }

    // Record has no run-time behaviour (it's just a plan-time helper), so we
    // can replace ourself with our dependency:
    return this.getDep(0);
  }
  // This'll never be called, due to `optimize` above.
  execute({
    count,
    values: [values0],
  }: ExecutionDetails<[TData]>): GrafastResultsList<TData> {
    return values0.isBatch
      ? values0.entries
      : arrayOfLength(count, values0.value);
  }
}
