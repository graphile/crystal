import { defer } from "../deferred.js";
import type { Deferred, ExecutionDetails } from "../index.js";
import type {
  GrafastResultsList,
  Maybe,
  PromiseOrDirect,
} from "../interfaces.js";
import type { Multistep, UnwrapMultistep } from "../multistep.js";
import { multistep } from "../multistep.js";
import { Step } from "../step.js";
import { canonicalJSONStringify, recordsMatch } from "../utils.js";
import type { IOEquivalence } from "./_loadCommon.js";
import {
  ioEquivalenceMatches,
  makeAccessMap,
  nextTick,
  paramSig,
} from "./_loadCommon.js";
import { access } from "./access.js";
import { constant } from "./constant.js";

export interface LoadOneInfo<
  TItem,
  TParams extends Record<string, any>,
  TUnarySpec = never,
> {
  unary: TUnarySpec;
  attributes: ReadonlyArray<keyof TItem>;
  params: Partial<TParams>;
}

export type LoadOneCallback<
  TSpec,
  TItem,
  TData extends Maybe<TItem> = Maybe<TItem>,
  TParams extends Record<string, any> = Record<string, any>,
  TUnarySpec = never,
> = {
  (
    specs: ReadonlyArray<TSpec>,
    info: LoadOneInfo<TItem, TParams, TUnarySpec>,
  ): PromiseOrDirect<ReadonlyArray<TData>>;
  displayName?: string;
};

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
  load: LoadOneCallback<TSpec, TItem, TData, TParams, TUnarySpec>,
): LoadOneCallback<TSpec, TItem, TData, TParams, TUnarySpec> {
  return load;
}

interface LoadOneBatch {
  deferred: Deferred<any>;
  batchSpecs: readonly any[];
}

interface LoadOneMeta {
  cache?: Map<any, any>;
  loadBatchesByLoad?:
    | Map<LoadOneCallback<any, any, any, any>, LoadOneBatch[]>
    | undefined;
}

const idByLoad = new WeakMap<LoadOneCallback<any, any, any, any>, string>();
let loadCounter = 0;

export class LoadOneStep<
  const TMultistep extends Multistep,
  TItem,
  TData extends Maybe<TItem>,
  TParams extends Record<string, any>,
  const TUnaryMultistep extends Multistep = never,
> extends Step<TData> {
  static $$export = { moduleName: "grafast", exportName: "LoadOneStep" };

  public isSyncAndSafe = false;

  loadInfo: Omit<
    LoadOneInfo<TItem, TParams, UnwrapMultistep<TUnaryMultistep>>,
    "unary" | "params"
  > | null = null;
  loadOptionsKey = "";

  attributes = new Set<keyof TItem>();
  paramDepIdByKey: {
    [TKey in keyof TParams]: number;
  } = Object.create(null);
  unaryDepId: number | null = null;
  private ioEquivalence: IOEquivalence<TMultistep> | null;
  private load: LoadOneCallback<
    UnwrapMultistep<TMultistep>,
    TItem,
    TData,
    TParams,
    UnwrapMultistep<TUnaryMultistep>
  >;
  constructor(
    options: LoadOneOptions<TMultistep, TItem, TData, TParams, TUnaryMultistep>,
  ) {
    super();

    const { lookup: value, load, unary: unary, ioEquivalence } = options;
    this.load = load;
    this.ioEquivalence = ioEquivalence ?? null;

    const $spec = multistep(value, "load");
    this.addDependency($spec);

    if (unary != null) {
      const $unarySpec = multistep(unary, "loadUnary");
      this.unaryDepId = this.addUnaryDependency($unarySpec);
    }
  }
  toStringMeta() {
    return this.load.displayName || this.load.name;
  }

  private _accessMap: Record<string, Step> | null = null;
  private getAccessMap(): Record<string, Step> {
    return (this._accessMap ??= makeAccessMap(
      this.getDep(0),
      this.ioEquivalence,
    ));
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
  public deduplicate(peers: readonly LoadOneStep<any, any, any, any, any>[]) {
    return peers.filter(
      (p) =>
        p.load === this.load &&
        ioEquivalenceMatches(p.ioEquivalence, this.ioEquivalence) &&
        recordsMatch(p.paramDepIdByKey, this.paramDepIdByKey),
    );
  }
  public deduplicatedWith(
    replacement: LoadOneStep<any, any, any, any, any>,
  ): void {
    for (const attr of this.attributes) {
      replacement.attributes.add(attr);
    }
  }
  _paramSig?: string;
  getParamSignature() {
    return (this._paramSig ??= paramSig(
      this.paramDepIdByKey,
      (depId) => this.getDepOptions(depId).step.id,
    ));
  }
  finalize() {
    // Find all steps of this type that use the same callback and have
    // equivalent params and then match their list of attributes together.
    const paramSig = this.getParamSignature();
    const kin = this.operationPlan
      .getStepsByStepClass(LoadOneStep)
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

    // Build the loadInfo
    const attributes = [...this.attributes].sort();
    this.loadInfo = { attributes };

    // If the canonicalJSONStringify is the same, then we deem that the options are the same
    this.loadOptionsKey = canonicalJSONStringify(this.loadInfo);
    let loadId = idByLoad.get(this.load);
    if (!loadId) {
      loadId = String(++loadCounter);
      idByLoad.set(this.load, loadId);
    }
    this.metaKey = `LoadOneStep|${loadId}|${this.loadOptionsKey}`;
    super.finalize();
  }

  execute({
    count,
    values,
    extra,
  }: ExecutionDetails<
    [UnwrapMultistep<TMultistep>, UnwrapMultistep<TUnaryMultistep>]
  >): PromiseOrDirect<GrafastResultsList<TData>> {
    const meta = extra.meta as LoadOneMeta;
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
    const loadInfo: LoadOneInfo<
      TItem,
      TParams,
      UnwrapMultistep<TUnaryMultistep>
    > = {
      ...this.loadInfo!,
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
      const loadBatch: LoadOneBatch = { deferred, batchSpecs };
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
          executeBatches(loadBatches!, this.load, loadInfo);
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

  // Things that were originally in LoadedRecordStep
  get(attr: keyof TItem & (string | number)) {
    return this.cacheStep("get", attr, () => this._getInner(attr));
  }
  private _getInner(attr: keyof TItem & (string | number)) {
    if (this.operationPlan.phase === "plan") {
      // Allow auto-collapsing of the waterfall by knowing keys are equivalent
      const accessMap = this.getAccessMap();
      const $step = accessMap[attr as any];
      if ($step) {
        return $step;
      }
    }

    this.attributes.add(attr);
    return access(this, attr);
  }
}

async function executeBatches(
  loadBatches: readonly LoadOneBatch[],
  load: LoadOneCallback<any, any, any, any, any>,
  loadInfo: LoadOneInfo<any, any, any>,
) {
  try {
    const numberOfBatches = loadBatches.length;
    if (numberOfBatches === 1) {
      const [loadBatch] = loadBatches;
      loadBatch.deferred.resolve(load(loadBatch.batchSpecs, loadInfo));
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
      const results = await load(allBatchSpecs, loadInfo);
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

interface LoadOneOptions<
  TLookup extends Multistep,
  TItem,
  TData extends Maybe<TItem> = Maybe<TItem>,
  TParams extends Record<string, any> = Record<string, any>,
  TLoadContext extends Multistep = never,
> {
  /**
   * A step/multistep representing the value to look up - could be an
   * identifier or combination of identifiers.
   */
  lookup: TLookup;

  /**
   * The function that actually loads data from the backend
   */
  load: LoadOneCallback<
    UnwrapMultistep<TLookup>,
    TItem,
    TData,
    TParams,
    UnwrapMultistep<TLoadContext>
  >;

  /**
   * Details of anything your `load` function will need access to, for example
   * database connections, API clients, etc.
   */
  unary?: TLoadContext;

  /**
   * Details of which attributes on the output are equivalent to those on the
   * input (if any), useful for reducing unnecessary fetches (e.g. load the
   * friends of a user by their id without ever loading the user).
   */
  ioEquivalence?: IOEquivalence<TLookup>;
}

export function loadOne<
  const TLookup extends Multistep,
  TItem,
  TData extends Maybe<TItem> = Maybe<TItem>,
  TParams extends Record<string, any> = Record<string, any>,
  const TLoadContext extends Multistep = never,
>(
  options: LoadOneOptions<TLookup, TItem, TData, TParams, TLoadContext>,
): LoadOneStep<TLookup, TItem, TData, TParams, TLoadContext> {
  return new LoadOneStep(options);
}
