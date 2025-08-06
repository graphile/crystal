import type { ExecutionDetails } from "../index.js";
import type {
  GrafastResultsList,
  Maybe,
  PromiseOrDirect,
  Thunk,
} from "../interfaces.js";
import type { Multistep, UnwrapMultistep } from "../multistep.js";
import { multistep } from "../multistep.js";
import { Step } from "../step.js";
import { canonicalJSONStringify, recordsMatch } from "../utils.js";
import type { IOEquivalence } from "./_loadCommon.js";
import {
  executeLoad,
  ioEquivalenceMatches,
  makeAccessMap,
  paramSig,
} from "./_loadCommon.js";
import { access } from "./access.js";
import { constant } from "./constant.js";

export interface LoadOneInfo<
  TItem,
  TParams extends Record<string, any>,
  TShared = never,
> {
  shared: TShared;
  attributes: ReadonlyArray<keyof TItem>;
  params: Partial<TParams>;

  /** @deprecated Please use 'shared' instead. It's simply renamed */
  unary: TShared;
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

const idByLoad = new WeakMap<LoadOneCallback<any, any, any, any>, string>();
let loadCounter = 0;

export class LoadOneStep<
  const TLookup extends Multistep,
  TItem,
  TData extends Maybe<TItem>,
  TParams extends Record<string, any>,
  const TShared extends Multistep = never,
> extends Step<TData> {
  static $$export = { moduleName: "grafast", exportName: "LoadOneStep" };

  public isSyncAndSafe = false;

  loadInfo: Omit<
    LoadOneInfo<TItem, TParams, UnwrapMultistep<TShared>>,
    "shared" | "unary" | "params"
  > | null = null;
  loadInfoKey = "";

  attributes = new Set<keyof TItem>();
  paramDepIdByKey: {
    [TKey in keyof TParams]: number;
  } = Object.create(null);
  sharedDepId: number | null = null;
  private ioEquivalence: IOEquivalence<TLookup> | null;
  private load: LoadOneCallback<
    UnwrapMultistep<TLookup>,
    TItem,
    TData,
    TParams,
    UnwrapMultistep<TShared>
  >;
  constructor(
    lookup: TLookup,
    loader: LoadOneLoader<TLookup, TItem, TData, TParams, TShared>,
  ) {
    super();

    const { load, shared, ioEquivalence } = loader;
    this.load = load;
    if (typeof this.load !== "function") {
      throw new Error(
        `Invalid options passed to LoadOneStep - there must be a 'load' function!`,
      );
    }
    this.ioEquivalence = ioEquivalence ?? null;

    const $spec = multistep(lookup, "load");
    this.addDependency($spec);

    if (shared != null) {
      const $shared = multistep(shared, "loadUnary");
      this.sharedDepId = this.addUnaryDependency($shared);
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
    this.loadInfoKey = canonicalJSONStringify(this.loadInfo);
    let loadId = idByLoad.get(this.load);
    if (!loadId) {
      loadId = String(++loadCounter);
      idByLoad.set(this.load, loadId);
    }
    this.metaKey = `LoadOneStep|${loadId}|${this.loadInfoKey}`;
    super.finalize();
  }

  execute(
    details: ExecutionDetails,
  ): PromiseOrDirect<GrafastResultsList<TData>> {
    return executeLoad(
      details,
      this.sharedDepId,
      this.paramDepIdByKey,
      this.loadInfo!,
      this.load,
    );
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

export interface LoadOneLoader<
  TLookup extends Multistep,
  TItem,
  TData extends Maybe<TItem> = Maybe<TItem>,
  TParams extends Record<string, any> = Record<string, any>,
  TShared extends Multistep = never,
> {
  /**
   * The function that actually loads data from the backend
   */
  load: LoadOneCallback<
    UnwrapMultistep<TLookup>,
    TItem,
    TData,
    TParams,
    UnwrapMultistep<TShared>
  >;

  /**
   * Details of anything your `load` function will need access to, for example
   * database connections, API clients, etc.
   */
  shared?: Thunk<TShared>;

  /**
   * Details of which attributes on the output are equivalent to those on the
   * input (if any), useful for reducing unnecessary fetches (e.g. load the
   * friends of a user by their id without ever loading the user).
   */
  ioEquivalence?: IOEquivalence<TLookup>;
}

/**
 * Loads an individual record identified by the `lookup` using the `loader`.
 *
 * @param lookup - A step/multistep representing the value to look up - could be an
 * identifier or combination of identifiers.
 * @param loader - The function to load this, or a LoadManyLoader object containing such a function
 */
export function loadOne<
  const TLookup extends Multistep,
  TItem,
  TData extends Maybe<TItem> = Maybe<TItem>,
  TParams extends Record<string, any> = Record<string, any>,
  const TShared extends Multistep = never,
>(
  lookup: TLookup,
  loader:
    | LoadOneCallback<
        UnwrapMultistep<TLookup>,
        TItem,
        TData,
        TParams,
        never // If you want context, you must use the loader object
      >
    | LoadOneLoader<TLookup, TItem, TData, TParams, TShared>,
): LoadOneStep<TLookup, TItem, TData, TParams, TShared> {
  if (arguments.length > 2) {
    throw new Error(
      "The signature of loadOne has changed, additional arguments should now be passed via a 'loader' object: `loadOne(lookup, loader)` where `loader` is either a `load` function or object containing it `{ load, shared?, ioEquivalence?, paginationSupport? }`",
    );
  }
  return new LoadOneStep(
    lookup,
    typeof loader === "function"
      ? ({ load: loader } as LoadOneLoader<
          TLookup,
          TItem,
          TData,
          TParams,
          TShared
        >)
      : loader,
  );
}
