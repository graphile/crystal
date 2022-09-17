import type { CrystalResultsList, CrystalValuesList } from "../interfaces.js";
import { ExecutableStep } from "../step.js";
import { access } from "./access.js";
import { LoadManyStep } from "./loadMany.js";
import { LoadOneStep } from "./loadOne.js";

/**
 * You shouldn't create instances of this yourself - use `loadMany` or `loadOne`.
 *
 * @internal
 */
export class RecordStep<TData> extends ExecutableStep<TData> {
  static $$export = { moduleName: "grafast", exportName: "RecordStep" };

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
  execute([records]: [CrystalValuesList<TData>]): CrystalResultsList<TData> {
    return records;
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
    } else if ($source instanceof LoadOneStep) {
      // Tell our parent we only need certain attributes
      $source.addAttributes(this.attributes);
    } else {
      // This should never happen
      console.warn(
        `RecordStep could not find the parent GetOne/GetMany; instead found ${$source}`,
      );
    }

    // Record has no run-time behaviour (it's just a plan-time helper), so we
    // can replace ourself with our dependency:
    return this.getDep(0);
  }
}
