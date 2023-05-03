import type { __ItemStep } from "../index.js";
import type {
  ExecutionExtra,
  GrafastResultsList,
  GrafastValuesList,
  PromiseOrDirect,
} from "../interfaces.js";
import { ExecutableStep } from "../step.js";
import { canonicalJSONStringify } from "../utils.js";
import { access } from "./access.js";

export interface LoadOptions<TData, TParams extends Record<string, any>> {
  attributes: ReadonlyArray<
    TData extends ReadonlyArray<infer UItemData> ? keyof UItemData : keyof TData
  > | null;
  params: Partial<TParams>;
}

export type LoadCallback<TSpec, TData, TParams extends Record<string, any>> = {
  (
    specs: ReadonlyArray<TSpec>,
    options: LoadOptions<TData, TParams>,
  ): PromiseOrDirect<ReadonlyArray<TData>>;
  displayName?: string;
};

/**
 * A TypeScript Identity Function to help you strongly type your
 * LoadCallback.
 */
export function loadCallback<TSpec, TData, TParams extends Record<string, any>>(
  callback: LoadCallback<TSpec, TData, TParams>,
): LoadCallback<TSpec, TData, TParams> {
  return callback;
}

interface LoadMeta {
  cache?: Map<any, any>;
}

const idByLoad = new WeakMap<LoadCallback<any, any, any>, string>();
let loadCounter = 0;

/**
 * You shouldn't create instances of this yourself - use `load` or `loadOne`.
 *
 * @internal
 */
export class LoadedRecordStep<
  TData,
  TParams extends Record<string, any>,
> extends ExecutableStep<TData> {
  static $$export = {
    moduleName: "grafast",
    exportName: "LoadedRecordStep",
  };

  isSyncAndSafe = true;

  attributes = new Set<keyof TData>();
  params: Partial<TParams> = Object.create(null);
  constructor(
    $data: ExecutableStep<TData>,
    private sourceDescription?: string,
  ) {
    super();
    this.addDependency($data);
  }
  toStringMeta() {
    return this.sourceDescription ?? null;
  }
  get(attr: keyof TData & (string | number)) {
    this.attributes.add(attr);
    return access(this, attr);
  }
  setParam<TParamKey extends keyof TParams>(
    paramKey: TParamKey,
    value: TParams[TParamKey],
  ): void {
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
    [records]: [GrafastValuesList<TData>],
  ): GrafastResultsList<TData> {
    return records;
  }
}

export class LoadStep<
  TSpec,
  TData,
  TParams extends Record<string, any>,
> extends ExecutableStep {
  /*
  implements
    ListCapableStep<
      TData extends ReadonlyArray<infer UItemData> ? UItemData : never,
      LoadedRecordStep<
        TData extends ReadonlyArray<infer UItemData> ? UItemData : never,
        TParams
      >
    >
*/
  static $$export = { moduleName: "grafast", exportName: "LoadStep" };

  loadOptions: LoadOptions<TData, TParams> | null = null;
  loadOptionsKey = "";

  attributes = new Set<
    TData extends ReadonlyArray<infer UItemData> ? keyof UItemData : keyof TData
  >();
  params: Partial<TParams> = Object.create(null);
  constructor(
    $spec: ExecutableStep<TSpec>,
    private load: LoadCallback<TSpec, TData, TParams>,
  ) {
    super();
    this.addDependency($spec);
  }
  toStringMeta() {
    return this.load.displayName || this.load.name;
  }
  listItem($item: __ItemStep<this>) {
    return new LoadedRecordStep<
      TData extends ReadonlyArray<infer UItemData> ? UItemData : never,
      TParams
    >($item, this.toStringMeta());
  }
  single(): TData extends ReadonlyArray<any>
    ? never
    : LoadedRecordStep<TData, TParams> {
    return new LoadedRecordStep(this, this.toStringMeta()) as any;
  }
  setParam<TParamKey extends keyof TParams>(
    paramKey: TParamKey,
    value: TParams[TParamKey],
  ): void {
    this.params[paramKey] = value;
  }
  addAttributes(
    attributes: Set<
      TData extends ReadonlyArray<infer UChildData>
        ? keyof UChildData
        : keyof TData
    >,
  ): void {
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

function load<TSpec, TData, TParams extends Record<string, any>>(
  $spec: ExecutableStep<TSpec>,
  loadCallback: LoadCallback<TSpec, TData, TParams>,
) {
  return new LoadStep($spec, loadCallback);
}

export function loadMany<TSpec, TItemData, TParams extends Record<string, any>>(
  $spec: ExecutableStep<TSpec>,
  loadCallback: LoadCallback<TSpec, ReadonlyArray<TItemData>, TParams>,
) {
  return load($spec, loadCallback);
}

export function loadOne<TSpec, TData, TParams extends Record<string, any>>(
  $spec: ExecutableStep<TSpec>,
  loadCallback: LoadCallback<TSpec, TData, TParams>,
) {
  return load($spec, loadCallback).single();
}
