import type { __ItemStep, Deferred, ExecutionDetails } from "../index.js";
import { defer, isExecutableStep } from "../index.js";
import type {
  GrafastResultsList,
  Maybe,
  PromiseOrDirect,
} from "../interfaces.js";
import type { Multistep, UnwrapMultistep } from "../multistep.js";
import { isMultistep, multistep } from "../multistep.js";
import { ExecutableStep, isListLikeStep, isObjectLikeStep } from "../step.js";
import { arrayOfLength, canonicalJSONStringify } from "../utils.js";
import { access } from "./access.js";

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
  TData extends TItem | ReadonlyArray<TItem>,
  TParams extends Record<string, any>,
  TUnarySpec = never,
> = {
  (
    specs: ReadonlyArray<TSpec>,
    options: LoadOptions<TItem, TParams, TUnarySpec>,
  ): PromiseOrDirect<ReadonlyArray<Maybe<TData>>>;
  displayName?: string;
};

export type LoadOneCallback<
  TSpec,
  TItem,
  TParams extends Record<string, any>,
  TUnarySpec = never,
> = LoadCallback<TSpec, TItem, TItem, TParams, TUnarySpec>;
export type LoadManyCallback<
  TSpec,
  TItem,
  TParams extends Record<string, any>,
  TUnarySpec = never,
> = LoadCallback<TSpec, TItem, ReadonlyArray<TItem>, TParams, TUnarySpec>;

/**
 * A TypeScript Identity Function to help you strongly type your
 * LoadOneCallback.
 */
export function loadOneCallback<
  TSpec,
  TItem,
  TParams extends Record<string, any>,
  TUnarySpec = never,
>(
  callback: LoadOneCallback<TSpec, TItem, TParams, TUnarySpec>,
): LoadOneCallback<TSpec, TItem, TParams, TUnarySpec> {
  return callback;
}
/**
 * A TypeScript Identity Function to help you strongly type your
 * LoadManyCallback.
 */
export function loadManyCallback<
  TSpec,
  TItem,
  TParams extends Record<string, any>,
  TUnarySpec = never,
>(
  callback: LoadManyCallback<TSpec, TItem, TParams, TUnarySpec>,
): LoadManyCallback<TSpec, TItem, TParams, TUnarySpec> {
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
  TParams extends Record<string, any>,
> extends ExecutableStep<TItem> {
  static $$export = {
    moduleName: "grafast",
    exportName: "LoadedRecordStep",
  };

  isSyncAndSafe = true;

  attributes = new Set<keyof TItem>();
  params: Partial<TParams> = Object.create(null);
  constructor(
    $data: ExecutableStep<TItem>,
    private isSingle: boolean,
    private sourceDescription: string,
    // Only safe to reference this during planning phase
    private ioEquivalence: Record<string, ExecutableStep>,
  ) {
    super();
    this.addDependency($data);
  }
  toStringMeta() {
    return this.sourceDescription ?? null;
  }
  get(attr: keyof TItem & (string | number)) {
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
    value: TParams[TParamKey],
  ): void {
    if (!this.isSingle) {
      throw new Error(
        "setParam should not be called on list items - call it on the collection (`loadMany()` step)",
      );
    }
    this.params[paramKey] = value;
  }
  optimize() {
    const $source = this.getDepDeep(0);
    if ($source instanceof LoadStep) {
      // Tell our parent we only need certain attributes
      $source.addAttributes(this.attributes);
      for (const [key, value] of Object.entries(this.params)) {
        $source.setParam(key, value);
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
  }: ExecutionDetails<[TItem]>): GrafastResultsList<TItem> {
    return values0.isBatch
      ? values0.entries
      : arrayOfLength(count, values0.value);
  }
}

export class LoadStep<
  const TMultistep extends Multistep,
  TItem,
  TData extends TItem | ReadonlyArray<TItem>,
  TParams extends Record<string, any>,
  const TUnaryMultistep extends Multistep = never,
> extends ExecutableStep {
  /* implements ListCapableStep<TItem, LoadedRecordStep<TItem, TParams>> */
  static $$export = { moduleName: "grafast", exportName: "LoadStep" };

  public isSyncAndSafe = false;

  loadOptions: Omit<
    LoadOptions<TItem, TParams, UnwrapMultistep<TUnaryMultistep>>,
    "unary"
  > | null = null;
  loadOptionsKey = "";

  attributes = new Set<keyof TItem>();
  params: Partial<TParams> = Object.create(null);
  unaryDepId: number | null = null;
  constructor(
    spec: TMultistep,
    unarySpec: TUnaryMultistep | null,
    private ioEquivalence:
      | null
      | string
      | { [key in keyof UnwrapMultistep<TMultistep>]?: string | null },
    private load: LoadCallback<
      UnwrapMultistep<TMultistep>,
      TItem,
      TData,
      TParams,
      UnwrapMultistep<TUnaryMultistep>
    >,
  ) {
    super();
    const $spec = multistep(spec);
    this.addDependency($spec);
    const $unarySpec = unarySpec == null ? null : multistep(unarySpec);
    if ($unarySpec) {
      this.unaryDepId = this.addUnaryDependency($unarySpec);
    }
  }
  toStringMeta() {
    return this.load.displayName || this.load.name;
  }
  private makeAccessMap(): Record<string, ExecutableStep> {
    const map = Object.create(null);
    const $spec = this.getDep(0);
    if (this.ioEquivalence == null) {
      return map;
    } else if (typeof this.ioEquivalence === "string") {
      map[this.ioEquivalence] = $spec;
      return map;
    } else if (Array.isArray(this.ioEquivalence)) {
      for (let i = 0, l = this.ioEquivalence.length; i < l; i++) {
        const key = this.ioEquivalence[i];
        map[key] = isListLikeStep($spec) ? $spec.at(i) : access($spec, [i]);
      }
      return map;
    } else if (typeof this.ioEquivalence === "object") {
      for (const key of Object.keys(this.ioEquivalence)) {
        const attr =
          this.ioEquivalence[key as keyof UnwrapMultistep<TMultistep>];
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
  listItem($item: __ItemStep<TItem>) {
    return new LoadedRecordStep<TItem, TParams>(
      $item,
      false,
      this.toStringMeta(),
      this.makeAccessMap(),
    );
  }
  single(): TData extends ReadonlyArray<any>
    ? never
    : LoadedRecordStep<TItem, TParams> {
    return new LoadedRecordStep(
      this,
      true,
      this.toStringMeta(),
      this.makeAccessMap(),
    ) as any;
  }
  setParam<TParamKey extends keyof TParams>(
    paramKey: TParamKey,
    value: TParams[TParamKey],
  ): void {
    this.params[paramKey] = value;
  }
  addAttributes(attributes: Set<keyof TItem>): void {
    for (const attribute of attributes) {
      this.attributes.add(attribute);
    }
  }
  finalize() {
    // Find all steps of this type that use the same callback and have
    // equivalent params and then match their list of attributes together.
    const stringifiedParams = canonicalJSONStringify(this.params);
    const kin = this.operationPlan
      .getStepsByStepClass(LoadStep)
      .filter((step) => {
        if (step.id === this.id) return false;
        if (step.load !== this.load) return false;
        if (canonicalJSONStringify(step.params) !== stringifiedParams)
          return false;
        return true;
      });
    for (const otherStep of kin) {
      for (const attr of otherStep.attributes) {
        this.attributes.add(attr as any);
      }
    }

    // Build the loadOptions
    this.loadOptions = {
      attributes: [...this.attributes].sort(),
      params: this.params,
    };
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
    values: [values0, values1],
    extra,
  }: ExecutionDetails<
    [UnwrapMultistep<TMultistep>, UnwrapMultistep<TUnaryMultistep>]
  >): PromiseOrDirect<GrafastResultsList<Maybe<TData>>> {
    const meta = extra.meta as LoadMeta;
    let cache = meta.cache;
    if (!cache) {
      cache = new Map();
      meta.cache = cache;
    }
    const batch = new Map<UnwrapMultistep<TMultistep>, number[]>();
    const unary = values1?.isBatch === false ? values1.value : undefined;

    const results: Array<PromiseOrDirect<Maybe<TData>>> = [];
    for (let i = 0; i < count; i++) {
      const spec = values0.at(i);
      if (cache.has(spec)) {
        results.push(cache.get(spec)!);
      } else {
        // We'll fill this in in a minute
        const index = results.push(null) - 1;
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
      const deferred = defer<ReadonlyArray<Maybe<TData>>>();
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
        const loadOptions = this.loadOptions!;
        process.nextTick(() => {
          // Don't allow adding anything else to the batch
          meta.loadBatchesByLoad!.delete(this.load);
          executeBatches(loadBatches!, this.load, {
            ...loadOptions,
            unary: unary as UnwrapMultistep<TUnaryMultistep>,
          });
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
  TData extends TItem | ReadonlyArray<TItem>,
  TParams extends Record<string, any>,
  const TUnaryMultistep extends Multistep = never,
>(
  spec: TMultistep,
  unarySpec: TUnaryMultistep | null,
  ioEquivalence:
    | null
    | string
    | { [key in keyof UnwrapMultistep<TMultistep>]?: string | null },
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
  TParams extends Record<string, any> = Record<string, any>,
  const TUnaryMultistep extends Multistep = never,
>(
  spec: TMultistep,
  loadCallback: LoadManyCallback<
    UnwrapMultistep<TMultistep>,
    TItem,
    TParams,
    UnwrapMultistep<TUnaryMultistep>
  >,
): LoadStep<
  UnwrapMultistep<TMultistep>,
  TItem,
  ReadonlyArray<TItem>,
  TParams,
  UnwrapMultistep<TUnaryMultistep>
>;
export function loadMany<
  const TMultistep extends Multistep,
  TItem,
  TParams extends Record<string, any> = Record<string, any>,
  const TUnaryMultistep extends Multistep = never,
>(
  spec: TMultistep,
  ioEquivalence:
    | null
    | string
    | (UnwrapMultistep<TMultistep> extends [...any[]]
        ? { [key in keyof UnwrapMultistep<TMultistep>]: string | null }
        : UnwrapMultistep<TMultistep> extends Record<string, any>
        ? { [key in keyof UnwrapMultistep<TMultistep>]?: string | null }
        : never),
  loadCallback: LoadManyCallback<
    UnwrapMultistep<TMultistep>,
    TItem,
    TParams,
    UnwrapMultistep<TUnaryMultistep>
  >,
): LoadStep<
  UnwrapMultistep<TMultistep>,
  TItem,
  ReadonlyArray<TItem>,
  TParams,
  UnwrapMultistep<TUnaryMultistep>
>;
export function loadMany<
  const TMultistep extends Multistep,
  TItem,
  TParams extends Record<string, any> = Record<string, any>,
  const TUnaryMultistep extends Multistep = never,
>(
  spec: TMultistep,
  unarySpec: TUnaryMultistep | null,
  loadCallback: LoadManyCallback<
    UnwrapMultistep<TMultistep>,
    TItem,
    TParams,
    UnwrapMultistep<TUnaryMultistep>
  >,
): LoadStep<
  UnwrapMultistep<TMultistep>,
  TItem,
  ReadonlyArray<TItem>,
  TParams,
  UnwrapMultistep<TUnaryMultistep>
>;
export function loadMany<
  const TMultistep extends Multistep,
  TItem,
  TParams extends Record<string, any> = Record<string, any>,
  const TUnaryMultistep extends Multistep = never,
>(
  spec: TMultistep,
  unarySpec: TUnaryMultistep | null,
  ioEquivalence:
    | null
    | string
    | (UnwrapMultistep<TMultistep> extends [...any[]]
        ? { [key in keyof UnwrapMultistep<TMultistep>]: string | null }
        : UnwrapMultistep<TMultistep> extends Record<string, any>
        ? { [key in keyof UnwrapMultistep<TMultistep>]?: string | null }
        : never),
  loadCallback: LoadManyCallback<
    UnwrapMultistep<TMultistep>,
    TItem,
    TParams,
    UnwrapMultistep<TUnaryMultistep>
  >,
): LoadStep<
  UnwrapMultistep<TMultistep>,
  TItem,
  ReadonlyArray<TItem>,
  TParams,
  UnwrapMultistep<TUnaryMultistep>
>;
export function loadMany<
  const TMultistep extends Multistep,
  TItem,
  TParams extends Record<string, any> = Record<string, any>,
  const TUnaryMultistep extends Multistep = never,
>(
  spec: TMultistep,
  loadCallbackOrIoEquivalenceOrUnarySpec:
    | LoadManyCallback<
        UnwrapMultistep<TMultistep>,
        TItem,
        TParams,
        UnwrapMultistep<TUnaryMultistep>
      >
    | null
    | string
    | TUnaryMultistep,
  loadCallbackOrIoEquivalence?:
    | LoadManyCallback<UnwrapMultistep<TMultistep>, TItem, TParams>
    | null
    | string
    | { [key in keyof UnwrapMultistep<TMultistep>]?: string | null },
  loadCallbackOnly?: LoadManyCallback<
    UnwrapMultistep<TMultistep>,
    TItem,
    TParams,
    UnwrapMultistep<TUnaryMultistep>
  >,
): LoadStep<
  UnwrapMultistep<TMultistep>,
  TItem,
  ReadonlyArray<TItem>,
  TParams,
  UnwrapMultistep<TUnaryMultistep>
> {
  if (loadCallbackOnly) {
    return load(
      spec,
      loadCallbackOrIoEquivalenceOrUnarySpec as TUnaryMultistep | null,
      loadCallbackOrIoEquivalence as
        | null
        | string
        | { [key in keyof UnwrapMultistep<TMultistep>]?: string | null },
      loadCallbackOnly as LoadManyCallback<
        UnwrapMultistep<TMultistep>,
        TItem,
        TParams,
        UnwrapMultistep<TUnaryMultistep>
      >,
    ) as LoadStep<
      UnwrapMultistep<TMultistep>,
      TItem,
      ReadonlyArray<TItem>,
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
        TParams,
        UnwrapMultistep<TUnaryMultistep>
      >,
    ) as LoadStep<
      UnwrapMultistep<TMultistep>,
      TItem,
      ReadonlyArray<TItem>,
      TParams,
      UnwrapMultistep<TUnaryMultistep>
    >;
  }
  // Unary step is definitely null; 3 arguments
  else if (loadCallbackOrIoEquivalence) {
    return load(
      spec,
      null,
      loadCallbackOrIoEquivalenceOrUnarySpec,
      loadCallbackOrIoEquivalence as LoadManyCallback<
        UnwrapMultistep<TMultistep>,
        TItem,
        TParams,
        UnwrapMultistep<TUnaryMultistep>
      >,
    ) as LoadStep<
      UnwrapMultistep<TMultistep>,
      TItem,
      ReadonlyArray<TItem>,
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
        TParams,
        UnwrapMultistep<TUnaryMultistep>
      >,
    ) as LoadStep<
      UnwrapMultistep<TMultistep>,
      TItem,
      ReadonlyArray<TItem>,
      TParams,
      UnwrapMultistep<TUnaryMultistep>
    >;
  }
}

export function loadOne<
  const TMultistep extends Multistep,
  TItem,
  TParams extends Record<string, any> = Record<string, any>,
>(
  spec: TMultistep,
  loadCallback: LoadOneCallback<
    UnwrapMultistep<TMultistep>,
    TItem,
    TParams,
    never
  >,
): LoadedRecordStep<TItem, TParams>;
export function loadOne<
  const TMultistep extends Multistep,
  TItem,
  TParams extends Record<string, any> = Record<string, any>,
>(
  spec: TMultistep,
  ioEquivalence:
    | null
    | string
    | { [key in keyof UnwrapMultistep<TMultistep>]?: string | null },
  loadCallback: LoadOneCallback<
    UnwrapMultistep<TMultistep>,
    TItem,
    TParams,
    never
  >,
): LoadedRecordStep<TItem, TParams>;
export function loadOne<
  const TMultistep extends Multistep,
  TItem,
  TParams extends Record<string, any> = Record<string, any>,
  const TUnaryMultistep extends Multistep = never,
>(
  spec: TMultistep,
  unarySpec: TUnaryMultistep | null,
  loadCallback: LoadOneCallback<
    UnwrapMultistep<TMultistep>,
    TItem,
    TParams,
    UnwrapMultistep<TUnaryMultistep>
  >,
): LoadedRecordStep<TItem, TParams>;
export function loadOne<
  const TMultistep extends Multistep,
  TItem,
  TParams extends Record<string, any> = Record<string, any>,
  const TUnaryMultistep extends Multistep = never,
>(
  spec: TMultistep,
  unarySpec: TUnaryMultistep | null,
  ioEquivalence:
    | null
    | string
    | { [key in keyof UnwrapMultistep<TMultistep>]?: string | null },
  loadCallback: LoadOneCallback<
    UnwrapMultistep<TMultistep>,
    TItem,
    TParams,
    UnwrapMultistep<TUnaryMultistep>
  >,
): LoadedRecordStep<TItem, TParams>;
export function loadOne<
  const TMultistep extends Multistep,
  TItem,
  TParams extends Record<string, any> = Record<string, any>,
  const TUnaryMultistep extends Multistep = never,
>(
  spec: TMultistep,
  loadCallbackOrIoEquivalenceOrUnarySpec:
    | LoadOneCallback<
        UnwrapMultistep<TMultistep>,
        TItem,
        TParams,
        UnwrapMultistep<TUnaryMultistep>
      >
    | null
    | string
    | { [key in keyof UnwrapMultistep<TMultistep>]?: string | null }
    | TUnaryMultistep,
  loadCallbackOrIoEquivalence?:
    | LoadOneCallback<
        UnwrapMultistep<TMultistep>,
        TItem,
        TParams,
        UnwrapMultistep<TUnaryMultistep>
      >
    | null
    | string
    | { [key in keyof UnwrapMultistep<TMultistep>]?: string | null },
  loadCallbackOnly?: LoadOneCallback<
    UnwrapMultistep<TMultistep>,
    TItem,
    TParams,
    UnwrapMultistep<TUnaryMultistep>
  >,
): LoadedRecordStep<TItem, TParams> {
  if (loadCallbackOnly) {
    return load(
      spec,
      loadCallbackOrIoEquivalenceOrUnarySpec as TUnaryMultistep | null,
      loadCallbackOrIoEquivalence as
        | null
        | string
        | { [key in keyof UnwrapMultistep<TMultistep>]?: string | null },
      loadCallbackOnly as LoadOneCallback<
        UnwrapMultistep<TMultistep>,
        TItem,
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
      loadCallbackOrIoEquivalenceOrUnarySpec,
      loadCallbackOrIoEquivalence as LoadOneCallback<
        UnwrapMultistep<TMultistep>,
        TItem,
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
        TParams,
        UnwrapMultistep<TUnaryMultistep>
      >,
    ).single();
  }
}
