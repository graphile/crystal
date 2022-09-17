import type { __ItemStep } from "../index.js";
import type {
  CrystalResultsList,
  CrystalValuesList,
  PromiseOrDirect,
} from "../interfaces.js";
import { ExecutableStep } from "../step.js";
import { RecordStep } from "./record.js";

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
    return new RecordStep($item);
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
