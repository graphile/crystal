import type { Deferred } from "../deferred.js";
import { defer } from "../deferred.js";
import type { __ItemStep } from "../index.js";
import type {
  CrystalResultsList,
  CrystalValuesList,
  ExecutionExtra,
  PromiseOrDirect,
} from "../interfaces.js";
import { ExecutableStep } from "../step.js";
import { canonicalJSONStringify } from "../utils.js";
import { access } from "./access.js";

export interface LoadManyOptions<TData, TParams extends Record<string, any>> {
  attributes: ReadonlyArray<keyof TData> | null;
  params: Partial<TParams>;
}

export type LoadManyCallback<
  TSpec,
  TData,
  TParams extends Record<string, any>,
> = {
  (
    specs: ReadonlyArray<TSpec>,
    options: LoadManyOptions<TData, TParams>,
  ): PromiseOrDirect<ReadonlyArray<ReadonlyArray<TData>>>;
  displayName?: string;
};

/**
 * A TypeScript Identity Function to help you strongly type your
 * LoadManyCallback.
 */
export function loadManyCallback<
  TSpec,
  TData,
  TParams extends Record<string, any>,
>(
  callback: LoadManyCallback<TSpec, TData, TParams>,
): LoadManyCallback<TSpec, TData, TParams> {
  return callback;
}

/**
 * You shouldn't create instances of this yourself - use `loadMany` or `loadOne`.
 *
 * @internal
 */
export class LoadManySingleRecordStep<TData> extends ExecutableStep<TData> {
  static $$export = {
    moduleName: "grafast",
    exportName: "LoadManySingleRecordStep",
  };

  isSyncAndSafe = true;

  attributes = new Set<keyof TData>();
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
  optimize() {
    const $source = this.getDepDeep(0);
    if ($source instanceof LoadManyStep) {
      // Tell our parent we only need certain attributes
      $source.addAttributes(this.attributes);
    } else {
      // This should never happen
      console.warn(
        `LoadManySingleRecordStep could not find the parent LoadManyStep; instead found ${$source}`,
      );
    }

    // Record has no run-time behaviour (it's just a plan-time helper), so we
    // can replace ourself with our dependency:
    return this.getDep(0);
  }
  execute([records]: [CrystalValuesList<TData>]): CrystalResultsList<TData> {
    return records;
  }
}

interface LoadManyMeta {
  cacheByOptionsByCallback?: Map<
    LoadManyCallback<any, any, any>,
    Map<string, Map<any, PromiseLike<any>>>
  >;
}

export class LoadManyStep<
  TSpec,
  TData,
  TParams extends Record<string, any>,
> extends ExecutableStep {
  static $$export = { moduleName: "grafast", exportName: "LoadManyStep" };
  metaKey = "LoadManyStep";

  loadOptions: LoadManyOptions<TData, TParams> | null = null;
  loadOptionsKey = "";

  attributes = new Set<keyof TData>();
  params: Partial<TParams> = Object.create(null);
  constructor(
    $spec: ExecutableStep<TSpec>,
    private load: LoadManyCallback<TSpec, TData, TParams>,
  ) {
    super();
    this.addDependency($spec);
  }
  toStringMeta() {
    return this.load.displayName || this.load.name;
  }
  listItem($item: __ItemStep<TData>) {
    return new LoadManySingleRecordStep($item, this.toStringMeta());
  }
  setParam<TParamKey extends keyof TParams>(
    paramKey: TParamKey,
    value: TParams[TParamKey],
  ): void {
    this.params[paramKey] = value;
  }
  addAttributes(attributes: Set<keyof TData>): void {
    for (const column of attributes) {
      this.attributes.add(column);
    }
  }
  finalize() {
    // Find all steps of this type that use the same callback and have
    // equivalent params and then match their list of attributes together.
    const stringifiedParams = canonicalJSONStringify(this.params);
    const kin = (
      this.opPlan.getStepsByMetaKey(this.metaKey) as LoadManyStep<
        any,
        any,
        any
      >[]
    ).filter((step) => {
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
  }
  execute(
    [specs]: [CrystalValuesList<TSpec>],
    extra: ExecutionExtra,
  ): PromiseOrDirect<CrystalResultsList<ReadonlyArray<TData>>> {
    const loadOptions = this.loadOptions!;
    const meta = extra.meta as LoadManyMeta;
    let cacheByOptionsByCallback = meta.cacheByOptionsByCallback;
    if (!cacheByOptionsByCallback) {
      cacheByOptionsByCallback = new Map();
      meta.cacheByOptionsByCallback = cacheByOptionsByCallback;
    }
    let cacheByOptions = cacheByOptionsByCallback.get(this.load);
    if (!cacheByOptions) {
      cacheByOptions = new Map();
      cacheByOptionsByCallback.set(this.load, cacheByOptions);
    }
    let cache = cacheByOptions.get(this.loadOptionsKey);
    if (!cache) {
      cache = new Map();
      cacheByOptions.set(this.loadOptionsKey, cache);
    }
    const batchSpecs: Array<TSpec> = [];
    const batchDeferreds: Array<Deferred<ReadonlyArray<TData>>> = [];

    const results: Array<PromiseOrDirect<ReadonlyArray<TData>>> = [];
    for (let i = 0, l = specs.length; i < l; i++) {
      const spec = specs[i];
      const cachedResult = cache.get(spec);
      if (cachedResult) {
        results.push(cachedResult);
      } else {
        const result = defer<ReadonlyArray<TData>>();
        results.push(result);
        cache.set(spec, result);
        batchSpecs.push(spec);
        batchDeferreds.push(result);
      }
    }
    if (batchSpecs.length > 0) {
      (async () => {
        try {
          const results = await this.load(batchSpecs, loadOptions);
          for (let i = 0, l = batchDeferreds.length; i < l; i++) {
            batchDeferreds[i].resolve(results[i]);
          }
        } catch (e) {
          batchDeferreds.forEach((deferred) => deferred.reject(e));
        }
      })();
    }
    return results;
  }
}

export function loadMany<TSpec, TData, TParams extends Record<string, any>>(
  $spec: ExecutableStep<TSpec>,
  load: LoadManyCallback<TSpec, TData, TParams>,
) {
  return new LoadManyStep($spec, load);
}
