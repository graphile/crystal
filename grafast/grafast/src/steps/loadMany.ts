import type {
  __ItemStep,
  ConnectionOptimizedStep,
  ExecutionDetails,
} from "../index.js";
import type {
  GrafastResultsList,
  Maybe,
  PromiseOrDirect,
} from "../interfaces.js";
import type { Multistep, UnwrapMultistep } from "../multistep.js";
import { multistep } from "../multistep.js";
import { Step } from "../step.js";
import { canonicalJSONStringify, recordsMatch } from "../utils.js";
import {
  executeLoad,
  type IOEquivalence,
  ioEquivalenceMatches,
  makeAccessMap,
  paramSig,
} from "./_loadCommon.js";
import { access } from "./access.js";
import type { PaginationFeatures, PaginationParams } from "./connection.js";
import { constant } from "./constant.js";
import { LoadedRecordStep } from "./loadedRecord.js";

export interface LoadManyInfo<
  TItem,
  TParams extends Record<string, any>,
  TLoadContext = never,
> {
  unary: TLoadContext;
  attributes: ReadonlyArray<keyof TItem>;
  params: Partial<TParams>;
}

export type LoadManyCallback<
  TLookup,
  TItem,
  TData extends Maybe<ReadonlyArray<Maybe<TItem>>> = Maybe<
    ReadonlyArray<Maybe<TItem>>
  >,
  TParams extends Record<string, any> = Record<string, any>,
  TLoadContext = never,
> = {
  (
    lookups: ReadonlyArray<TLookup>,
    info: LoadManyInfo<TItem, TParams, TLoadContext>,
  ): PromiseOrDirect<ReadonlyArray<TData>>;
  displayName?: string;
};

/**
 * A TypeScript Identity Function to help you strongly type your
 * LoadManyCallback.
 */
export function loadManyCallback<
  TLookup,
  TItem,
  TData extends Maybe<ReadonlyArray<Maybe<TItem>>> = Maybe<
    ReadonlyArray<Maybe<TItem>>
  >,
  TParams extends Record<string, any> = Record<string, any>,
  TLoadContext = never,
>(
  load: LoadManyCallback<TLookup, TItem, TData, TParams, TLoadContext>,
): LoadManyCallback<TLookup, TItem, TData, TParams, TLoadContext> {
  return load;
}

const idByLoad = new WeakMap<LoadManyCallback<any, any, any, any>, string>();
let loadCounter = 0;

interface LoadManyBaseParams {
  [key: string]: Maybe<any>;
  reverse?: Maybe<boolean>;
  after?: Maybe<string>;
  offset?: Maybe<number>;
  limit?: Maybe<number>;
}

export class LoadManyStep<
    const TLookup extends Multistep,
    TItem,
    TData extends Maybe<ReadonlyArray<Maybe<TItem>>>, // loadMany
    TParams extends LoadManyBaseParams = any,
    const TLoadContext extends Multistep = never,
  >
  extends Step<TData>
  implements Partial<ConnectionOptimizedStep<TItem, any, any, any>>
{
  static $$export = { moduleName: "grafast", exportName: "LoadManyStep" };

  public isSyncAndSafe = false;

  loadInfo: Omit<
    LoadManyInfo<TItem, TParams, UnwrapMultistep<TLoadContext>>,
    "unary" | "params"
  > | null = null;
  loadInfoKey = "";

  attributes = new Set<keyof TItem>();
  paramDepIdByKey: {
    [TKey in keyof TParams]: number;
  } = Object.create(null);
  unaryDepId: number | null = null;
  private ioEquivalence: IOEquivalence<TLookup> | null;
  private load: LoadManyCallback<
    UnwrapMultistep<TLookup>,
    TItem,
    TData,
    TParams,
    UnwrapMultistep<TLoadContext>
  >;
  paginationSupport?: PaginationFeatures;
  constructor(
    options: LoadManyArguments<TLookup, TItem, TData, TParams, TLoadContext>,
  ) {
    super();
    // TODO: prompt users to disable this if they don't need it.
    this.cloneStreams = true;

    const { lookup, load, unary, ioEquivalence, paginationSupport } = options;
    this.load = load;
    if (typeof this.load !== "function") {
      throw new Error(
        `Invalid options passed to LoadManyStep - there must be a 'load' function!`,
      );
    }
    this.ioEquivalence = ioEquivalence ?? null;

    const $lookup = multistep(lookup, "load");
    this.addDependency($lookup);

    if (unary != null) {
      const $unary = multistep(unary, "loadUnary");
      this.unaryDepId = this.addUnaryDependency($unary);
    }

    if (!paginationSupport) {
      delete this.applyPagination;
    } else {
      this.paginationSupport = paginationSupport;
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
  listItem($item: Step) {
    return new LoadedRecordStep<
      TItem,
      TData extends Maybe<ReadonlyArray<infer U>>
        ? U extends Maybe<TItem>
          ? U
          : never
        : never,
      TParams
    >($item, false, this.toStringMeta(), this.getAccessMap());
  }
  setParam<TParamKey extends keyof TParams>(
    paramKey: TParamKey,
    value: TParams[TParamKey] | Step<Maybe<TParams[TParamKey]>>,
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
  public deduplicate(peers: readonly LoadManyStep<any, any, any, any, any>[]) {
    return peers.filter(
      (p) =>
        p.load === this.load &&
        ioEquivalenceMatches(p.ioEquivalence, this.ioEquivalence) &&
        recordsMatch(p.paramDepIdByKey, this.paramDepIdByKey),
    );
  }
  public deduplicatedWith(
    replacement: LoadManyStep<any, any, any, any, any>,
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
      .getStepsByStepClass(LoadManyStep)
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
    this.loadInfo = { attributes };

    // If the canonicalJSONStringify is the same, then we deem that the options are the same
    this.loadInfoKey = canonicalJSONStringify(this.loadInfo);
    let loadId = idByLoad.get(this.load);
    if (!loadId) {
      loadId = String(++loadCounter);
      idByLoad.set(this.load, loadId);
    }
    this.metaKey = `LoadManyStep|${loadId}|${this.loadInfoKey}`;
    super.finalize();
  }

  execute(
    details: ExecutionDetails,
  ): PromiseOrDirect<GrafastResultsList<TData>> {
    return executeLoad(
      details,
      this.unaryDepId,
      this.paramDepIdByKey,
      this.loadInfo!,
      this.load,
    );
  }

  applyPagination?($params: Step<PaginationParams<any>>): void {
    this.setParam("reverse", access($params, "reverse"));
    this.setParam("after", access($params, "after"));
    this.setParam("offset", access($params, "offset"));
    this.setParam("limit", access($params, "limit"));
  }

  connectionClone() {
    const lookup = this.getDep(0) as TLookup;
    const { load, ioEquivalence } = this;
    const unary =
      this.unaryDepId != null
        ? (this.getDep(this.unaryDepId) as TLoadContext)
        : (null as any as TLoadContext);
    const $clone = new LoadManyStep({
      lookup,
      load,
      unary,
      ioEquivalence,
    });

    // Copy attributes?
    for (const attr of this.attributes) {
      $clone.attributes.add(attr);
    }

    // Clone over all params except for pagination params
    for (const [key, depId] of Object.entries(this.paramDepIdByKey)) {
      if (
        key === "reverse" ||
        key === "after" ||
        key === "offset" ||
        key === "limit"
      ) {
        // Skip pagination param
        continue;
      }
      $clone.setParam(key, this.getDep(depId) as Step<any>);
    }

    return $clone as typeof $clone &
      ConnectionOptimizedStep<any, any, any, any>;
  }
}

export interface LoadManyArguments<
  TLookup extends Multistep,
  TItem,
  TData extends Maybe<ReadonlyArray<Maybe<TItem>>> = Maybe<
    ReadonlyArray<Maybe<TItem>>
  >,
  TParams extends LoadManyBaseParams = LoadManyBaseParams,
  TLoadContext extends Multistep = never,
> {
  lookup: TLookup;
  load: LoadManyCallback<
    UnwrapMultistep<TLookup>,
    TItem,
    TData,
    TParams,
    UnwrapMultistep<TLoadContext>
  >;
  unary?: TLoadContext;
  ioEquivalence?: IOEquivalence<TLookup>;
  paginationSupport?: PaginationFeatures;
}

export function loadMany<
  const TLookup extends Multistep,
  TItem,
  TData extends Maybe<ReadonlyArray<Maybe<TItem>>> = Maybe<
    ReadonlyArray<Maybe<TItem>>
  >,
  TParams extends Record<string, any> = Record<string, any>,
  const TLoadContext extends Multistep = never,
>(
  options: LoadManyArguments<TLookup, TItem, TData, TParams, TLoadContext>,
): LoadManyStep<
  UnwrapMultistep<TLookup>,
  TItem,
  TData,
  TParams,
  UnwrapMultistep<TLoadContext>
> {
  if (arguments.length > 1) {
    throw new Error(
      "The signature of loadMany has changed, it now accepts an object: `loadMany({ lookup, load, unary?, ioEquivalence? })`",
    );
  }
  return new LoadManyStep(options);
}
