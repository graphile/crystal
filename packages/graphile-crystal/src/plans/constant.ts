import type { CrystalResultsList, CrystalValuesList } from "../interfaces";
import { ExecutablePlan } from "../plan";

/**
 * Converts a constant value (e.g. a string/number/etc) into a plan
 */
export class ConstantPlan<TData> extends ExecutablePlan<TData> {
  static $$export = {
    moduleName: "graphile-crystal",
    exportName: "ConstantPlan",
  };
  sync = true;

  constructor(private data: TData) {
    super();
  }

  execute(values: [[undefined]]): CrystalResultsList<TData> {
    return new Array(values[0].length).fill(this.data);
  }
}

function isTemplateStringsArray(data: any): data is TemplateStringsArray {
  return (
    Array.isArray(data) &&
    "raw" in data &&
    Array.isArray((data as TemplateStringsArray).raw)
  );
}

// Call this as a template string or as a function. Only intended for handling scalar values, not arrays/objects/etc.
export function constant(
  strings: TemplateStringsArray & [string],
): ConstantPlan<string>;
export function constant<TData>(data: TData): ConstantPlan<TData>;
export function constant<TData>(
  data: TData | (TemplateStringsArray & [TData]),
): ConstantPlan<TData> {
  if (isTemplateStringsArray(data)) {
    if (data.length !== 1) {
      throw new Error(
        "constant`...` doesn't currently support placeholders; please use 'constant(`...`)' instead",
      );
    }
    return new ConstantPlan<TData>(data[0]);
  }
  return new ConstantPlan<TData>(data);
}
