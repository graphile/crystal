import type { __ItemStep } from "../index.js";
import type {
  ExecutionExtra,
  GrafastResultsList,
  GrafastValuesList,
  PromiseOrDirect,
} from "../interfaces.js";
import { ExecutableStep, isListLikeStep, isObjectLikeStep } from "../step.js";
import { canonicalJSONStringify } from "../utils.js";
import { access } from "./access.js";

export interface LoadOptions<TItem, TParams extends Record<string, any>> {
  attributes: ReadonlyArray<keyof TItem> | null;
  params: Partial<TParams>;
}

type LoadCallback<
  TSpec,
  TItem,
  TData extends TItem | ReadonlyArray<TItem>,
  TParams extends Record<string, any>,
> = {
  (
    specs: ReadonlyArray<TSpec>,
    options: LoadOptions<TItem, TParams>,
  ): PromiseOrDirect<ReadonlyArray<TData>>;
  displayName?: string;
};

export type LoadOneCallback<
  TSpec,
  TItem,
  TParams extends Record<string, any>,
> = LoadCallback<TSpec, TItem, TItem, TParams>;
export type LoadManyCallback<
  TSpec,
  TItem,
  TParams extends Record<string, any>,
> = LoadCallback<TSpec, TItem, ReadonlyArray<TItem>, TParams>;

/**
 * A TypeScript Identity Function to help you strongly type your
 * LoadOneCallback.
 */
export function loadOneCallback<
  TSpec,
  TItem,
  TParams extends Record<string, any>,
>(
  callback: LoadOneCallback<TSpec, TItem, TParams>,
): LoadOneCallback<TSpec, TItem, TParams> {
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
>(
  callback: LoadManyCallback<TSpec, TItem, TParams>,
): LoadManyCallback<TSpec, TItem, TParams> {
  return callback;
}

interface LoadMeta {
  cache?: Map<any, any>;
}

const idByLoad = new WeakMap<LoadCallback<any, any, any, any>, string>();
let loadCounter = 0;

/**
 * You shouldn't create instances of this yourself - use `loadOne` or `loadMany` instead.
 *
 * @internal
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
    private specEquivalent: Record<string, ExecutableStep>,
  ) {
    super();
    this.addDependency($data);
  }
  toStringMeta() {
    return this.sourceDescription ?? null;
  }
  get(attr: keyof TItem & (string | number)) {
    this.attributes.add(attr);

    // Allow auto-collapsing of the waterfall by knowing keys are equivalent
    if (
      this.operationPlan.phase === "plan" &&
      this.specEquivalent[attr as any]
    ) {
      return this.specEquivalent[attr as any];
    }

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
  execute(
    _count: number,
    [records]: [GrafastValuesList<TItem>],
  ): GrafastResultsList<TItem> {
    return records;
  }
}

export class LoadStep<
  TSpec,
  TItem,
  TData extends TItem | ReadonlyArray<TItem>,
  TParams extends Record<string, any>,
> extends ExecutableStep {
  /* implements ListCapableStep<TItem, LoadedRecordStep<TItem, TParams>> */
  static $$export = { moduleName: "grafast", exportName: "LoadStep" };

  loadOptions: LoadOptions<TItem, TParams> | null = null;
  loadOptionsKey = "";

  attributes = new Set<keyof TItem>();
  params: Partial<TParams> = Object.create(null);
  constructor(
    $spec: ExecutableStep<TSpec>,
    private load: LoadCallback<TSpec, TItem, TData, TParams>,
    private specEquivalent?:
      | null
      | string
      | { [key in keyof TSpec]?: string | null },
  ) {
    super();
    this.addDependency($spec);
  }
  toStringMeta() {
    return this.load.displayName || this.load.name;
  }
  private makeAccessMap(): Record<string, ExecutableStep> {
    const map = Object.create(null);
    const $spec = this.getDep(0);
    if (this.specEquivalent == null) {
      return map;
    } else if (typeof this.specEquivalent === "string") {
      map[this.specEquivalent] = $spec;
      return map;
    } else if (Array.isArray(this.specEquivalent)) {
      for (let i = 0, l = this.specEquivalent.length; i < l; i++) {
        const key = this.specEquivalent[i];
        map[key] = isListLikeStep($spec) ? $spec.at(i) : access($spec, [i]);
      }
      return map;
    } else if (typeof this.specEquivalent === "object") {
      for (const key of Object.keys(this.specEquivalent)) {
        map[key] = isObjectLikeStep($spec)
          ? $spec.get(key)
          : access($spec, [key]);
      }
      return map;
    } else {
      throw new Error(
        `specEquivalent passed to loadOne() or loadMany() call not understood`,
      );
    }
  }
  listItem($item: __ItemStep<this>) {
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
      attributes: this.attributes.size ? [...this.attributes].sort() : null,
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
  }

  execute(
    count: number,
    [specs]: [GrafastValuesList<TSpec>],
    extra: ExecutionExtra,
  ): PromiseOrDirect<GrafastResultsList<TData>> {
    const loadOptions = this.loadOptions!;
    const meta = extra.meta as LoadMeta;
    let cache = meta.cache;
    if (!cache) {
      cache = new Map();
      meta.cache = cache;
    }
    const batch = new Map<TSpec, number[]>();

    const results: Array<PromiseOrDirect<TData> | null> = [];
    for (let i = 0; i < count; i++) {
      const spec = specs[i];
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
      return (async () => {
        const batchSpecs = [...batch.keys()];
        const loadResults = await this.load(batchSpecs, loadOptions);
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
        return results as Array<PromiseOrDirect<TData>>;
      })();
    }
    return results as Array<PromiseOrDirect<TData>>;
  }
}

function load<
  TSpec,
  TItem,
  TData extends TItem | ReadonlyArray<TItem>,
  TParams extends Record<string, any>,
>(
  $spec: ExecutableStep<TSpec>,
  specEquivalent: null | string | { [key in keyof TSpec]?: string | null },
  loadCallback: LoadCallback<TSpec, TItem, TData, TParams>,
) {
  return new LoadStep($spec, loadCallback, specEquivalent);
}

export function loadMany<
  TSpec,
  TItem,
  TParams extends Record<string, any> = Record<string, any>,
>(
  $spec: ExecutableStep<TSpec>,
  loadCallback: LoadManyCallback<TSpec, TItem, TParams>,
): LoadStep<TSpec, TItem, ReadonlyArray<TItem>, TParams>;
export function loadMany<
  TSpec,
  TItem,
  TParams extends Record<string, any> = Record<string, any>,
>(
  $spec: ExecutableStep<TSpec>,
  specEquivalent:
    | null
    | string
    | (TSpec extends [...any[]]
        ? { [key in keyof TSpec]: string | null }
        : TSpec extends Record<string, any>
        ? { [key in keyof TSpec]?: string | null }
        : never),
  loadCallback: LoadManyCallback<TSpec, TItem, TParams>,
): LoadStep<TSpec, TItem, ReadonlyArray<TItem>, TParams>;
export function loadMany<
  TSpec,
  TItem,
  TParams extends Record<string, any> = Record<string, any>,
>(
  $spec: ExecutableStep<TSpec>,
  loadCallbackOrSpecEquivalent:
    | LoadManyCallback<TSpec, TItem, TParams>
    | null
    | string
    | { [key in keyof TSpec]?: string | null },
  loadCallbackOnly?: LoadManyCallback<TSpec, TItem, TParams>,
): LoadStep<TSpec, TItem, ReadonlyArray<TItem>, TParams> {
  if (loadCallbackOnly) {
    return load(
      $spec,
      loadCallbackOrSpecEquivalent as
        | null
        | string
        | { [key in keyof TSpec]?: string | null },
      loadCallbackOnly as LoadManyCallback<TSpec, TItem, TParams>,
    ) as LoadStep<TSpec, TItem, ReadonlyArray<TItem>, TParams>;
  } else {
    return load(
      $spec,
      null,
      loadCallbackOrSpecEquivalent as LoadManyCallback<TSpec, TItem, TParams>,
    ) as LoadStep<TSpec, TItem, ReadonlyArray<TItem>, TParams>;
  }
}

export function loadOne<
  TSpec,
  TItem,
  TParams extends Record<string, any> = Record<string, any>,
>(
  $spec: ExecutableStep<TSpec>,
  loadCallback: LoadOneCallback<TSpec, TItem, TParams>,
): LoadedRecordStep<TItem, TParams>;
export function loadOne<
  const TSpec,
  TItem,
  TParams extends Record<string, any> = Record<string, any>,
>(
  $spec: ExecutableStep<TSpec>,
  specEquivalent: null | string | { [key in keyof TSpec]?: string | null },
  loadCallback: LoadOneCallback<TSpec, TItem, TParams>,
): LoadedRecordStep<TItem, TParams>;
export function loadOne<
  TSpec,
  TItem,
  TParams extends Record<string, any> = Record<string, any>,
>(
  $spec: ExecutableStep<TSpec>,
  loadCallbackOrSpecEquivalent:
    | LoadOneCallback<TSpec, TItem, TParams>
    | null
    | string
    | { [key in keyof TSpec]?: string | null },
  loadCallbackOnly?: LoadOneCallback<TSpec, TItem, TParams>,
): LoadedRecordStep<TItem, TParams> {
  if (loadCallbackOnly) {
    return load(
      $spec,
      loadCallbackOrSpecEquivalent as
        | null
        | string
        | { [key in keyof TSpec]?: string | null },
      loadCallbackOnly as LoadOneCallback<TSpec, TItem, TParams>,
    ).single();
  } else {
    return load(
      $spec,
      null,
      loadCallbackOrSpecEquivalent as LoadOneCallback<TSpec, TItem, TParams>,
    ).single();
  }
}
