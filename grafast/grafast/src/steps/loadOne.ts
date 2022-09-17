import type { __ItemStep } from "../index.js";
import type {
  CrystalResultsList,
  CrystalValuesList,
  PromiseOrDirect,
} from "../interfaces.js";
import { ExecutableStep } from "../step.js";
import { RecordStep } from "./record.js";

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

export class LoadOneStep<
  TSpec,
  TData,
  TParams extends Record<string, any>,
> extends ExecutableStep {
  static $$export = { moduleName: "grafast", exportName: "LoadOneStep" };

  loadOptions: LoadOneOptions<TData, TParams> | null = null;

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
    CrystalResultsList<TData>
  > {
    return this.load(specs, this.loadOptions!);
  }
}

export function loadOne<TSpec, TData, TParams extends Record<string, any>>(
  $spec: ExecutableStep<TSpec>,
  load: LoadOneCallback<TSpec, TData, TParams>,
) {
  return new RecordStep(new LoadOneStep($spec, load));
}
