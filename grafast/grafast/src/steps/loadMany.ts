import type { __ItemStep } from "../index.js";
import type {
  CrystalResultsList,
  CrystalValuesList,
  PromiseOrDirect,
} from "../interfaces.js";
import { ExecutableStep } from "../step.js";
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

export class LoadManyStep<
  TSpec,
  TData,
  TParams extends Record<string, any>,
> extends ExecutableStep {
  static $$export = { moduleName: "grafast", exportName: "LoadManyStep" };

  loadOptions: LoadManyOptions<TData, TParams> | null = null;

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
    return new LoadManySingleRecordStep($item);
  }
  addAttributes(attributes: Set<keyof TData>): void {
    for (const column of attributes) {
      this.attributes.add(column);
    }
  }
  finalize() {
    this.loadOptions = {
      attributes: this.attributes.size ? [...this.attributes] : null,
      params: this.params,
    };
  }
  execute([specs]: [CrystalValuesList<TSpec>]): PromiseOrDirect<
    CrystalResultsList<ReadonlyArray<TData>>
  > {
    return this.load(specs, this.loadOptions!);
  }
}

export function loadMany<TSpec, TData, TParams extends Record<string, any>>(
  $spec: ExecutableStep<TSpec>,
  load: LoadManyCallback<TSpec, TData, TParams>,
) {
  return new LoadManyStep($spec, load);
}
