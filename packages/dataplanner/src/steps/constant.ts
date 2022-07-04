import type { CrystalResultsList } from "../interfaces.js";
import { ExecutableStep } from "../plan.js";
import { arrayOfLength } from "../utils.js";

/**
 * Converts a constant value (e.g. a string/number/etc) into a plan
 */
export class ConstantStep<TData> extends ExecutableStep<TData> {
  static $$export = {
    moduleName: "dataplanner",
    exportName: "ConstantStep",
  };
  isSyncAndSafe = true;

  constructor(private data: TData) {
    super();
  }

  execute(values: [[undefined]]): CrystalResultsList<TData> {
    return arrayOfLength(values[0].length, this.data);
  }
}

function isTemplateStringsArray(data: any): data is TemplateStringsArray {
  return (
    Array.isArray(data) &&
    "raw" in data &&
    Array.isArray((data as TemplateStringsArray).raw)
  );
}

/**
 * Call this as a template string or as a function. Only intended for handling
 * scalar values, not arrays/objects/etc.
 */
export function constant(
  strings: TemplateStringsArray & [string],
): ConstantStep<string>;
export function constant<TData>(data: TData): ConstantStep<TData>;
export function constant<TData>(
  data: TData | (TemplateStringsArray & [TData]),
): ConstantStep<TData> {
  if (isTemplateStringsArray(data)) {
    if (data.length !== 1) {
      throw new Error(
        "constant`...` doesn't currently support placeholders; please use 'constant(`...`)' instead",
      );
    }
    return new ConstantStep<TData>(data[0]);
  }
  return new ConstantStep<TData>(data);
}
