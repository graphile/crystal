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

export interface LoadOneOptions<TData, TParams extends Record<string, any>> {
  attributes: ReadonlyArray<keyof TData> | null;
  params: Partial<TParams>;
}

export type LoadOneCallback<
  TSpec,
  TData,
  TParams extends Record<string, any>,
> = {
  (
    specs: ReadonlyArray<TSpec>,
    options: LoadOneOptions<TData, TParams>,
  ): PromiseOrDirect<ReadonlyArray<TData>>;
  displayName?: string;
};

/**
 * A TypeScript Identity Function to help you strongly type your
 * LoadManyCallback.
 */
export function loadOneCallback<
  TSpec,
  TData,
  TParams extends Record<string, any>,
>(
  callback: LoadOneCallback<TSpec, TData, TParams>,
): LoadOneCallback<TSpec, TData, TParams> {
  return callback;
}

interface LoadOneMeta {
  cache?: Map<any, any>;
}

const idByLoad = new WeakMap<LoadOneCallback<any, any, any>, string>();
let loadCounter = 0;

export class LoadOneStep<
  TSpec,
  TData,
  TParams extends Record<string, any>,
> extends ExecutableStep {
  static $$export = { moduleName: "grafast", exportName: "LoadOneStep" };

  loadOptions: LoadOneOptions<TData, TParams> | null = null;
  loadOptionsKey = "";

  attributes = new Set<keyof TData>();
  params: Partial<TParams> = Object.create(null);
  constructor(
    $spec: ExecutableStep<TSpec>,
    private load: LoadOneCallback<TSpec, TData, TParams>,
  ) {
    super();
    this.addDependency($spec);
  }
  toStringMeta() {
    return this.load.displayName || this.load.name;
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
  finalize() {
    // Find all steps of this type that use the same callback and have
    // equivalent params and then match their list of attributes together.
    const stringifiedParams = canonicalJSONStringify(this.params);
    const kin = this.operationPlan
      .getStepsByStepClass(LoadOneStep)
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
    this.metaKey = `LoadOneStep|${loadId}|${this.loadOptionsKey}`;
  }
  execute(
    count: number,
    [specs]: [GrafastValuesList<TSpec>],
    extra: ExecutionExtra,
  ): PromiseOrDirect<GrafastResultsList<TData>> {
    const loadOptions = this.loadOptions!;
    const meta = extra.meta as LoadOneMeta;
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

export function loadOne<TSpec, TData, TParams extends Record<string, any>>(
  $spec: ExecutableStep<TSpec>,
  load: LoadOneCallback<TSpec, TData, TParams>,
) {
  return new LoadOneStep($spec, load);
}
