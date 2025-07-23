import { defer } from "../deferred.js";
import type {
  __ItemStep,
  ConnectionOptimizedStep,
  Deferred,
  ExecutionDetails,
} from "../index.js";
import type {
  GrafastResultsList,
  Maybe,
  PromiseOrDirect,
} from "../interfaces.js";
import type { Multistep, UnwrapMultistep } from "../multistep.js";
import { isMultistep, multistep } from "../multistep.js";
import { isListLikeStep, isObjectLikeStep, Step } from "../step.js";
import {
  arrayOfLength,
  arraysMatch,
  canonicalJSONStringify,
  isTuple,
  recordsMatch,
  stableStringSortFirstTupleEntry,
} from "../utils.js";
import { access } from "./access.js";
import { constant } from "./constant.js";

const nextTick: (cb: () => void) => void =
  typeof process !== "undefined" && typeof process.nextTick === "function"
    ? (cb) => process.nextTick(cb)
    : (cb) => setTimeout(cb, 0);

export interface LoadOptions<
  TItem,
  TParams extends Record<string, any>,
  TUnarySpec = never,
> {
  unary: TUnarySpec;
  attributes: ReadonlyArray<keyof TItem>;
  params: Partial<TParams>;
}

type LoadCallback<
  TSpec,
  TItem,
  TData extends
    | Maybe<TItem> // loadOne
    | Maybe<ReadonlyArray<Maybe<TItem>>>, // loadMany
  TParams extends Record<string, any>,
  TUnarySpec = never,
> = {
  (
    specs: ReadonlyArray<TSpec>,
    options: LoadOptions<TItem, TParams, TUnarySpec>,
  ): PromiseOrDirect<ReadonlyArray<TData>>;
  displayName?: string;
};

export type LoadOneCallback<
  TSpec,
  TItem,
  TData extends Maybe<TItem> = Maybe<TItem>,
  TParams extends Record<string, any> = Record<string, any>,
  TUnarySpec = never,
> = LoadCallback<TSpec, TItem, TData, TParams, TUnarySpec>;
export type LoadManyCallback<
  TSpec,
  TItem,
  TData extends Maybe<ReadonlyArray<Maybe<TItem>>> = Maybe<
    ReadonlyArray<Maybe<TItem>>
  >,
  TParams extends Record<string, any> = Record<string, any>,
  TUnarySpec = never,
> = LoadCallback<TSpec, TItem, TData, TParams, TUnarySpec>;

/**
 * A TypeScript Identity Function to help you strongly type your
 * LoadOneCallback.
 */
export function loadOneCallback<
  TSpec,
  TItem,
  TData extends Maybe<TItem> = Maybe<TItem>,
  TParams extends Record<string, any> = Record<string, any>,
  TUnarySpec = never,
>(
  callback: LoadOneCallback<TSpec, TItem, TData, TParams, TUnarySpec>,
): LoadOneCallback<TSpec, TItem, TData, TParams, TUnarySpec> {
  return callback;
}
/**
 * A TypeScript Identity Function to help you strongly type your
 * LoadManyCallback.
 */
export function loadManyCallback<
  TSpec,
  TItem,
  TData extends Maybe<ReadonlyArray<Maybe<TItem>>> = Maybe<
    ReadonlyArray<Maybe<TItem>>
  >,
  TParams extends Record<string, any> = Record<string, any>,
  TUnarySpec = never,
>(
  callback: LoadManyCallback<TSpec, TItem, TData, TParams, TUnarySpec>,
): LoadManyCallback<TSpec, TItem, TData, TParams, TUnarySpec> {
  return callback;
}

interface LoadBatch {
  deferred: Deferred<any>;
  batchSpecs: readonly any[];
}

interface LoadMeta {
  cache?: Map<any, any>;
  loadBatchesByLoad?:
    | Map<LoadCallback<any, any, any, any>, LoadBatch[]>
    | undefined;
}

const idByLoad = new WeakMap<LoadCallback<any, any, any, any>, string>();
let loadCounter = 0;

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
    $data: Step<TData>,
    private isSingle: boolean,
    private sourceDescription: string,
    // Only safe to reference this during planning phase
    private ioEquivalence: Record<string, Step>,
  ) {
    super();
    this.addDependency($data);
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
    const $source = this.getDepDeep(0);
    if ($source instanceof LoadStep) {
      // Tell our parent we only need certain attributes
      $source.addAttributes(this.attributes);
      for (const [key, depId] of Object.entries(this.paramDepIdByKey)) {
        $source.setParam(key, this.getDep(depId));
      }
    } else {
      // This should never happen
      console.warn(
        `LoadedRecordStep could not find the parent LoadStep; instead found ${$source}`,
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

export class LoadStep<
    const TMultistep extends Multistep,
    TItem,
    TData extends
      | Maybe<TItem> // loadOne
      | Maybe<ReadonlyArray<Maybe<TItem>>>, // loadMany
    TParams extends Record<string, any> & {
      first?: Maybe<number>;
      last?: Maybe<number>;
      offset?: Maybe<number>;
      before?: Maybe<string>;
      after?: Maybe<string>;
    },
    const TUnaryMultistep extends Multistep = never,
  >
  extends Step<TData>
  implements ConnectionOptimizedStep<TItem, any, any, any>
{
  static $$export = { moduleName: "grafast", exportName: "LoadStep" };

  public isSyncAndSafe = false;

  loadOptions: Omit<
    LoadOptions<TItem, TParams, UnwrapMultistep<TUnaryMultistep>>,
    "unary" | "params"
  > | null = null;
  loadOptionsKey = "";

  attributes = new Set<keyof TItem>();
  paramDepIdByKey: {
    [TKey in keyof TParams]: number;
  } = Object.create(null);
  unaryDepId: number | null = null;
  constructor(
    spec: TMultistep,
    unarySpec: TUnaryMultistep | null,
    private ioEquivalence: IOEquivalence<TMultistep>,
    private load: LoadCallback<
      UnwrapMultistep<TMultistep>,
      TItem,
      TData,
      TParams,
      UnwrapMultistep<TUnaryMultistep>
    >,
  ) {
    super();
    const $spec = multistep(spec, "load");
    this.addDependency($spec);
    const $unarySpec =
      unarySpec == null ? null : multistep(unarySpec, "loadUnary");
    if ($unarySpec) {
      this.unaryDepId = this.addUnaryDependency($unarySpec);
    }
  }
  toStringMeta() {
    return this.load.displayName || this.load.name;
  }
  private makeAccessMap(): Record<string, Step> {
    const map = Object.create(null);
    const $spec = this.getDep(0);
    if (this.ioEquivalence == null) {
      return map;
    } else if (typeof this.ioEquivalence === "string") {
      map[this.ioEquivalence] = $spec;
      return map;
    } else if (isTuple(this.ioEquivalence)) {
      for (let i = 0, l = this.ioEquivalence.length; i < l; i++) {
        const key = this.ioEquivalence[i];
        map[key] = isListLikeStep($spec) ? $spec.at(i) : access($spec, [i]);
      }
      return map;
    } else if (typeof this.ioEquivalence === "object") {
      for (const key of Object.keys(this.ioEquivalence)) {
        const attr = this.ioEquivalence[key as any];
        if (attr != null) {
          map[attr] = isObjectLikeStep($spec)
            ? $spec.get(key)
            : access($spec, [key]);
        }
      }
      return map;
    } else {
      throw new Error(
        `ioEquivalence passed to loadOne() or loadMany() call not understood`,
      );
    }
  }
  listItem($item: Step) {
    return new LoadedRecordStep<
      TItem,
      TData extends Maybe<ReadonlyArray<infer U>>
        ? U extends Maybe<TItem>
          ? U
          : never
        : never,
      TParams
    >($item, false, this.toStringMeta(), this.makeAccessMap());
  }
  single(): TData extends Maybe<TItem>
    ? LoadedRecordStep<TItem, TData, TParams>
    : never {
    return new LoadedRecordStep(
      this,
      true,
      this.toStringMeta(),
      this.makeAccessMap(),
    ) as any;
  }
  setParam<TParamKey extends keyof TParams>(
    paramKey: TParamKey,
    value: TParams[TParamKey] | Step<TParams[TParamKey]>,
  ): void {
    this.paramDepIdByKey[paramKey] = this.addUnaryDependency(
      value instanceof Step ? value : constant(value),
    );
  }
  addAttributes(attributes: Set<keyof TItem>): void {
    for (const attribute of attributes) {
      this.attributes.add(attribute);
    }
  }
  public deduplicate(peers: readonly LoadStep<any, any, any, any, any>[]) {
    return peers.filter(
      (p) =>
        p.load === this.load &&
        ioEquivalenceMatches(p.ioEquivalence, this.ioEquivalence) &&
        recordsMatch(p.paramDepIdByKey, this.paramDepIdByKey),
    );
  }
  public deduplicatedWith(
    replacement: LoadStep<any, any, any, any, any>,
  ): void {
    for (const attr of this.attributes) {
      replacement.attributes.add(attr);
    }
  }
  _paramSig?: string;
  getParamSignature() {
    if (!this._paramSig) {
      // No more params allowed!
      Object.freeze(this.paramDepIdByKey);
      this._paramSig = JSON.stringify(
        Object.fromEntries(
          Object.entries(this.paramDepIdByKey)
            .map(
              ([key, depId]) =>
                [key, this.getDepOptions(depId).step.id] as const,
            )
            .sort(stableStringSortFirstTupleEntry),
        ),
      );
    }
    return this._paramSig;
  }
  finalize() {
    // Find all steps of this type that use the same callback and have
    // equivalent params and then match their list of attributes together.
    const paramSig = this.getParamSignature();
    const kin = this.operationPlan
      .getStepsByStepClass(LoadStep)
      .filter((step) => {
        if (step.id === this.id) return false;
        if (step.load !== this.load) return false;
        if (step.getParamSignature() !== paramSig) return false;
        return true;
      });
    for (const otherStep of kin) {
      for (const attr of otherStep.attributes) {
        this.attributes.add(attr as any);
      }
    }

    // Build the loadOptions
    const attributes = [...this.attributes].sort();
    this.loadOptions = { attributes };

    // If the canonicalJSONStringify is the same, then we deem that the options are the same
    this.loadOptionsKey = canonicalJSONStringify(this.loadOptions);
    let loadId = idByLoad.get(this.load);
    if (!loadId) {
      loadId = String(++loadCounter);
      idByLoad.set(this.load, loadId);
    }
    this.metaKey = `LoadStep|${loadId}|${this.loadOptionsKey}`;
    super.finalize();
  }

  execute({
    count,
    values,
    extra,
  }: ExecutionDetails<
    [UnwrapMultistep<TMultistep>, UnwrapMultistep<TUnaryMultistep>]
  >): PromiseOrDirect<GrafastResultsList<TData>> {
    const meta = extra.meta as LoadMeta;
    let cache = meta.cache;
    if (!cache) {
      cache = new Map();
      meta.cache = cache;
    }
    const batch = new Map<UnwrapMultistep<TMultistep>, number[]>();
    const values0 = values[0];
    const unary =
      this.unaryDepId != null
        ? (values[
            this.unaryDepId
          ].unaryValue() as UnwrapMultistep<TUnaryMultistep>)
        : (undefined as never);
    const params = Object.fromEntries(
      Object.entries(this.paramDepIdByKey).map(([key, depId]) => [
        key,
        values[depId].unaryValue(),
      ]),
    ) as Partial<TParams>;
    const loadOptions: LoadOptions<
      TItem,
      TParams,
      UnwrapMultistep<TUnaryMultistep>
    > = {
      ...this.loadOptions!,
      params,
      unary,
    };

    const results: Array<PromiseOrDirect<TData>> = [];
    for (let i = 0; i < count; i++) {
      const spec = values0.at(i);
      if (cache.has(spec)) {
        results.push(cache.get(spec)!);
      } else {
        // We'll fill this in in a minute
        const index = results.push(null as any) - 1;
        const existingIdx = batch.get(spec);
        if (existingIdx !== undefined) {
          existingIdx.push(index);
        } else {
          batch.set(spec, [index]);
        }
      }
    }
    const pendingCount = batch.size;
    if (pendingCount > 0) {
      const deferred = defer<ReadonlyArray<TData>>();
      const batchSpecs = [...batch.keys()];
      const loadBatch: LoadBatch = { deferred, batchSpecs };
      if (!meta.loadBatchesByLoad) {
        meta.loadBatchesByLoad = new Map();
      }
      let loadBatches = meta.loadBatchesByLoad.get(this.load);
      if (loadBatches) {
        // Add to existing batch load
        loadBatches.push(loadBatch);
      } else {
        // Create new batch load
        loadBatches = [loadBatch];
        meta.loadBatchesByLoad.set(this.load, loadBatches);
        // Guaranteed by the metaKey to be equivalent for all entries sharing the same `meta`. Note equivalent is not identical; key order may change.
        nextTick(() => {
          // Don't allow adding anything else to the batch
          meta.loadBatchesByLoad!.delete(this.load);
          executeBatches(loadBatches!, this.load, loadOptions);
        });
      }
      return (async () => {
        const loadResults = await deferred;
        for (
          let pendingIndex = 0;
          pendingIndex < pendingCount;
          pendingIndex++
        ) {
          const spec = batchSpecs[pendingIndex];
          const targetIndexes = batch.get(spec)!;
          const loadResult = loadResults[pendingIndex];
          cache.set(spec, loadResult);
          for (const targetIndex of targetIndexes) {
            results[targetIndex] = loadResult;
          }
        }
        return results;
      })();
    }
    return results;
  }
}

async function executeBatches(
  loadBatches: readonly LoadBatch[],
  load: LoadCallback<any, any, any, any, any>,
  loadOptions: LoadOptions<any, any, any>,
) {
  try {
    const numberOfBatches = loadBatches.length;
    if (numberOfBatches === 1) {
      const [loadBatch] = loadBatches;
      loadBatch.deferred.resolve(load(loadBatch.batchSpecs, loadOptions));
      return;
    } else {
      // Do some tick-batching!
      const indexStarts: number[] = [];
      const allBatchSpecs: any[] = [];
      for (let i = 0; i < numberOfBatches; i++) {
        const loadBatch = loadBatches[i];
        indexStarts[i] = allBatchSpecs.length;
        for (const batchSpec of loadBatch.batchSpecs) {
          allBatchSpecs.push(batchSpec);
        }
      }
      const results = await load(allBatchSpecs, loadOptions);
      for (let i = 0; i < numberOfBatches; i++) {
        const loadBatch = loadBatches[i];
        const start = indexStarts[i];
        const stop = indexStarts[i + 1] ?? allBatchSpecs.length;
        const entries = results.slice(start, stop);
        loadBatch.deferred.resolve(entries);
      }
    }
  } catch (e) {
    for (const loadBatch of loadBatches) {
      loadBatch.deferred.reject(e);
    }
  }
}

function load<
  const TMultistep extends Multistep,
  TItem,
  TData extends
    | Maybe<TItem> // loadOne
    | Maybe<ReadonlyArray<Maybe<TItem>>>, // loadMany
  TParams extends Record<string, any>,
  const TUnaryMultistep extends Multistep = never,
>(
  spec: TMultistep,
  unarySpec: TUnaryMultistep | null,
  ioEquivalence: IOEquivalence<TMultistep>,
  loadCallback: LoadCallback<
    UnwrapMultistep<TMultistep>,
    TItem,
    TData,
    TParams,
    UnwrapMultistep<TUnaryMultistep>
  >,
) {
  return new LoadStep(spec, unarySpec, ioEquivalence, loadCallback);
}

export function loadMany<
  const TMultistep extends Multistep,
  TItem,
  TData extends Maybe<ReadonlyArray<Maybe<TItem>>> = Maybe<
    ReadonlyArray<Maybe<TItem>>
  >,
  TParams extends Record<string, any> = Record<string, any>,
  const TUnaryMultistep extends Multistep = never,
>(
  spec: TMultistep,
  loadCallback: LoadManyCallback<
    UnwrapMultistep<TMultistep>,
    TItem,
    TData,
    TParams,
    UnwrapMultistep<TUnaryMultistep>
  >,
): LoadStep<
  UnwrapMultistep<TMultistep>,
  TItem,
  TData,
  TParams,
  UnwrapMultistep<TUnaryMultistep>
>;
export function loadMany<
  const TMultistep extends Multistep,
  TItem,
  TData extends Maybe<ReadonlyArray<Maybe<TItem>>> = Maybe<
    ReadonlyArray<Maybe<TItem>>
  >,
  TParams extends Record<string, any> = Record<string, any>,
  const TUnaryMultistep extends Multistep = never,
>(
  spec: TMultistep,
  ioEquivalence: IOEquivalence<TMultistep>,
  loadCallback: LoadManyCallback<
    UnwrapMultistep<TMultistep>,
    TItem,
    TData,
    TParams,
    UnwrapMultistep<TUnaryMultistep>
  >,
): LoadStep<
  UnwrapMultistep<TMultistep>,
  TItem,
  TData,
  TParams,
  UnwrapMultistep<TUnaryMultistep>
>;
export function loadMany<
  const TMultistep extends Multistep,
  TItem,
  TData extends Maybe<ReadonlyArray<Maybe<TItem>>> = Maybe<
    ReadonlyArray<Maybe<TItem>>
  >,
  TParams extends Record<string, any> = Record<string, any>,
  const TUnaryMultistep extends Multistep = never,
>(
  spec: TMultistep,
  unarySpec: TUnaryMultistep | null,
  loadCallback: LoadManyCallback<
    UnwrapMultistep<TMultistep>,
    TItem,
    TData,
    TParams,
    UnwrapMultistep<TUnaryMultistep>
  >,
): LoadStep<
  UnwrapMultistep<TMultistep>,
  TItem,
  TData,
  TParams,
  UnwrapMultistep<TUnaryMultistep>
>;
export function loadMany<
  const TMultistep extends Multistep,
  TItem,
  TData extends Maybe<ReadonlyArray<Maybe<TItem>>> = Maybe<
    ReadonlyArray<Maybe<TItem>>
  >,
  TParams extends Record<string, any> = Record<string, any>,
  const TUnaryMultistep extends Multistep = never,
>(
  spec: TMultistep,
  unarySpec: TUnaryMultistep | null,
  ioEquivalence: IOEquivalence<TMultistep>,
  loadCallback: LoadManyCallback<
    UnwrapMultistep<TMultistep>,
    TItem,
    TData,
    TParams,
    UnwrapMultistep<TUnaryMultistep>
  >,
): LoadStep<
  UnwrapMultistep<TMultistep>,
  TItem,
  TData,
  TParams,
  UnwrapMultistep<TUnaryMultistep>
>;
export function loadMany<
  const TMultistep extends Multistep,
  TItem,
  TData extends Maybe<ReadonlyArray<Maybe<TItem>>> = Maybe<
    ReadonlyArray<Maybe<TItem>>
  >,
  TParams extends Record<string, any> = Record<string, any>,
  const TUnaryMultistep extends Multistep = never,
>(
  spec: TMultistep,
  loadCallbackOrIoEquivalenceOrUnarySpec:
    | LoadManyCallback<
        UnwrapMultistep<TMultistep>,
        TItem,
        TData,
        TParams,
        UnwrapMultistep<TUnaryMultistep>
      >
    | IOEquivalence<TMultistep>
    | TUnaryMultistep,
  loadCallbackOrIoEquivalence?:
    | LoadManyCallback<UnwrapMultistep<TMultistep>, TItem, TData, TParams>
    | IOEquivalence<TMultistep>,
  loadCallbackOnly?: LoadManyCallback<
    UnwrapMultistep<TMultistep>,
    TItem,
    TData,
    TParams,
    UnwrapMultistep<TUnaryMultistep>
  >,
): LoadStep<
  UnwrapMultistep<TMultistep>,
  TItem,
  TData,
  TParams,
  UnwrapMultistep<TUnaryMultistep>
> {
  if (loadCallbackOnly) {
    return load(
      spec,
      loadCallbackOrIoEquivalenceOrUnarySpec as TUnaryMultistep | null,
      loadCallbackOrIoEquivalence as IOEquivalence<TMultistep>,
      loadCallbackOnly as LoadManyCallback<
        UnwrapMultistep<TMultistep>,
        TItem,
        TData,
        TParams,
        UnwrapMultistep<TUnaryMultistep>
      >,
    ) as LoadStep<
      UnwrapMultistep<TMultistep>,
      TItem,
      TData,
      TParams,
      UnwrapMultistep<TUnaryMultistep>
    >;
  }
  // At most 3 arguments
  else if (
    isMultistep<TUnaryMultistep>(loadCallbackOrIoEquivalenceOrUnarySpec)
  ) {
    return load(
      spec,
      loadCallbackOrIoEquivalenceOrUnarySpec,
      null,
      loadCallbackOrIoEquivalence as LoadManyCallback<
        UnwrapMultistep<TMultistep>,
        TItem,
        TData,
        TParams,
        UnwrapMultistep<TUnaryMultistep>
      >,
    ) as LoadStep<
      UnwrapMultistep<TMultistep>,
      TItem,
      TData,
      TParams,
      UnwrapMultistep<TUnaryMultistep>
    >;
  }
  // Unary step is definitely null; 3 arguments
  else if (loadCallbackOrIoEquivalence) {
    return load(
      spec,
      null,
      loadCallbackOrIoEquivalenceOrUnarySpec as IOEquivalence<TMultistep>,
      loadCallbackOrIoEquivalence as LoadManyCallback<
        UnwrapMultistep<TMultistep>,
        TItem,
        TData,
        TParams,
        UnwrapMultistep<TUnaryMultistep>
      >,
    ) as LoadStep<
      UnwrapMultistep<TMultistep>,
      TItem,
      TData,
      TParams,
      UnwrapMultistep<TUnaryMultistep>
    >;
  }
  // 2 arguments
  else {
    return load(
      spec,
      null,
      null,
      loadCallbackOrIoEquivalenceOrUnarySpec as LoadManyCallback<
        UnwrapMultistep<TMultistep>,
        TItem,
        TData,
        TParams,
        UnwrapMultistep<TUnaryMultistep>
      >,
    ) as LoadStep<
      UnwrapMultistep<TMultistep>,
      TItem,
      TData,
      TParams,
      UnwrapMultistep<TUnaryMultistep>
    >;
  }
}

type IOEquivalence<TMultistep extends Multistep> =
  | null
  | string
  | (UnwrapMultistep<TMultistep> extends readonly [...(readonly any[])]
      ? {
          [key in Exclude<keyof UnwrapMultistep<TMultistep>, keyof any[]>]:
            | string
            | null;
        }
      : UnwrapMultistep<TMultistep> extends Record<string, any>
        ? { [key in keyof UnwrapMultistep<TMultistep>]?: string | null }
        : never);

export function loadOne<
  const TMultistep extends Multistep,
  TItem,
  TData extends Maybe<TItem> = Maybe<TItem>,
  TParams extends Record<string, any> = Record<string, any>,
  const TUnaryMultistep extends Multistep = never,
>(
  spec: TMultistep,
  loadCallback: LoadOneCallback<
    UnwrapMultistep<TMultistep>,
    TItem,
    TData,
    TParams,
    UnwrapMultistep<TUnaryMultistep>
  >,
): LoadedRecordStep<TItem, TData, TParams>;
export function loadOne<
  const TMultistep extends Multistep,
  TItem,
  TData extends Maybe<TItem> = Maybe<TItem>,
  TParams extends Record<string, any> = Record<string, any>,
  const TUnaryMultistep extends Multistep = never,
>(
  spec: TMultistep,
  ioEquivalence: IOEquivalence<TMultistep>,
  loadCallback: LoadOneCallback<
    UnwrapMultistep<TMultistep>,
    TItem,
    TData,
    TParams,
    UnwrapMultistep<TUnaryMultistep>
  >,
): LoadedRecordStep<TItem, TData, TParams>;
export function loadOne<
  const TMultistep extends Multistep,
  TItem,
  TData extends Maybe<TItem> = Maybe<TItem>,
  TParams extends Record<string, any> = Record<string, any>,
  const TUnaryMultistep extends Multistep = never,
>(
  spec: TMultistep,
  unarySpec: TUnaryMultistep | null,
  loadCallback: LoadOneCallback<
    UnwrapMultistep<TMultistep>,
    TItem,
    TData,
    TParams,
    UnwrapMultistep<TUnaryMultistep>
  >,
): LoadedRecordStep<TItem, TData, TParams>;
export function loadOne<
  const TMultistep extends Multistep,
  TItem,
  TData extends Maybe<TItem> = Maybe<TItem>,
  TParams extends Record<string, any> = Record<string, any>,
  const TUnaryMultistep extends Multistep = never,
>(
  spec: TMultistep,
  unarySpec: TUnaryMultistep | null,
  ioEquivalence: IOEquivalence<TMultistep>,
  loadCallback: LoadOneCallback<
    UnwrapMultistep<TMultistep>,
    TItem,
    TData,
    TParams,
    UnwrapMultistep<TUnaryMultistep>
  >,
): LoadedRecordStep<TItem, TData, TParams>;
export function loadOne<
  const TMultistep extends Multistep,
  TItem,
  TData extends Maybe<TItem> = Maybe<TItem>,
  TParams extends Record<string, any> = Record<string, any>,
  const TUnaryMultistep extends Multistep = never,
>(
  spec: TMultistep,
  loadCallbackOrIoEquivalenceOrUnarySpec:
    | LoadOneCallback<
        UnwrapMultistep<TMultistep>,
        TItem,
        TData,
        TParams,
        UnwrapMultistep<TUnaryMultistep>
      >
    | IOEquivalence<TMultistep>
    | TUnaryMultistep,
  loadCallbackOrIoEquivalence?:
    | LoadOneCallback<
        UnwrapMultistep<TMultistep>,
        TItem,
        TData,
        TParams,
        UnwrapMultistep<TUnaryMultistep>
      >
    | IOEquivalence<TMultistep>,
  loadCallbackOnly?: LoadOneCallback<
    UnwrapMultistep<TMultistep>,
    TItem,
    TData,
    TParams,
    UnwrapMultistep<TUnaryMultistep>
  >,
): LoadedRecordStep<TItem, TData, TParams> {
  if (loadCallbackOnly) {
    return load(
      spec,
      loadCallbackOrIoEquivalenceOrUnarySpec as TUnaryMultistep | null,
      loadCallbackOrIoEquivalence as IOEquivalence<TMultistep>,
      loadCallbackOnly as LoadOneCallback<
        UnwrapMultistep<TMultistep>,
        TItem,
        TData,
        TParams,
        UnwrapMultistep<TUnaryMultistep>
      >,
    ).single();
  }
  // At most 3 arguments
  else if (
    isMultistep<TUnaryMultistep>(loadCallbackOrIoEquivalenceOrUnarySpec)
  ) {
    return load(
      spec,
      loadCallbackOrIoEquivalenceOrUnarySpec,
      null,
      loadCallbackOrIoEquivalence as LoadOneCallback<
        UnwrapMultistep<TMultistep>,
        TItem,
        TData,
        TParams,
        UnwrapMultistep<TUnaryMultistep>
      >,
    ).single();
  }
  // Unary step is definitely null; 3 arguments
  else if (loadCallbackOrIoEquivalence) {
    return load(
      spec,
      null,
      loadCallbackOrIoEquivalenceOrUnarySpec as IOEquivalence<TMultistep>,
      loadCallbackOrIoEquivalence as LoadOneCallback<
        UnwrapMultistep<TMultistep>,
        TItem,
        TData,
        TParams,
        UnwrapMultistep<TUnaryMultistep>
      >,
    ).single();
  } else {
    return load(
      spec,
      null,
      null,
      loadCallbackOrIoEquivalenceOrUnarySpec as LoadOneCallback<
        UnwrapMultistep<TMultistep>,
        TItem,
        TData,
        TParams,
        UnwrapMultistep<TUnaryMultistep>
      >,
    ).single();
  }
}

function ioEquivalenceMatches(
  io1: IOEquivalence<Multistep>,
  io2: IOEquivalence<Multistep>,
): boolean {
  if (io1 === io2) return true;

  if (io1 == null) return false;
  if (io2 == null) return false;

  if (typeof io1 === "string") return false;
  if (typeof io2 === "string") return false;

  if (Array.isArray(io1)) {
    if (!Array.isArray(io2)) return false;
    return arraysMatch(io1, io2);
  } else {
    if (Array.isArray(io2)) return false;
    return recordsMatch(io1, io2);
  }
}
