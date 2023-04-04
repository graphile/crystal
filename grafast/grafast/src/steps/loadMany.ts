import type { __ItemStep } from "../index.js";
import type {
  ExecutionExtra,
  GrafastResultsList,
  GrafastValuesList,
  PromiseOrDirect,
} from "../interfaces.js";
import type { ListCapableStep } from "../step.js";
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

const idByLoad = new WeakMap<LoadManyCallback<any, any, any>, string>();
let loadCounter = 0;

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
  execute(
    _count: number,
    [records]: [GrafastValuesList<TData>],
  ): GrafastResultsList<TData> {
    return records;
  }
}

interface LoadManyMeta {
  cache?: Map<any, readonly any[]>;
}

export class LoadManyStep<TSpec, TData, TParams extends Record<string, any>>
  extends ExecutableStep
  implements ListCapableStep<TData, LoadManySingleRecordStep<TData>>
{
  static $$export = { moduleName: "grafast", exportName: "LoadManyStep" };

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
  listItem($item: __ItemStep<this>) {
    return new LoadManySingleRecordStep<TData>($item, this.toStringMeta());
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
    const kin = this.opPlan.getStepsByStepClass(LoadManyStep).filter((step) => {
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
    this.metaKey = `LoadManyStep|${loadId}|${this.loadOptionsKey}`;
  }

  execute(
    count: number,
    [specs]: [GrafastValuesList<TSpec>],
    extra: ExecutionExtra,
  ): PromiseOrDirect<GrafastResultsList<ReadonlyArray<TData>>> {
    const loadOptions = this.loadOptions!;
    const meta = extra.meta as LoadManyMeta;
    let cache = meta.cache;
    if (!cache) {
      cache = new Map();
      meta.cache = cache;
    }
    const batch = new Map<TSpec, number[]>();

    const results: Array<PromiseOrDirect<readonly TData[]> | null> = [];
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
        return results as Array<PromiseOrDirect<readonly TData[]>>;
      })();
    }
    return results as Array<PromiseOrDirect<readonly TData[]>>;
  }
}

export function loadMany<TSpec, TData, TParams extends Record<string, any>>(
  $spec: ExecutableStep<TSpec>,
  load: LoadManyCallback<TSpec, TData, TParams>,
) {
  return new LoadManyStep($spec, load);
}
