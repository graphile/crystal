import { inspect } from "../inspect.js";
import type { ExecutionDetails, GrafastResultsList } from "../interfaces.js";
import { UnbatchedExecutableStep } from "../step.js";
import { arrayOfLength } from "../utils.js";

/**
 * Converts a constant value (e.g. a string/number/etc) into a plan
 */
export class ConstantStep<TData> extends UnbatchedExecutableStep<TData> {
  static $$export = {
    moduleName: "grafast",
    exportName: "ConstantStep",
  };
  isSyncAndSafe = true;

  constructor(
    public readonly data: TData,
    public readonly isSensitive = typeof data !== "boolean" && data != null,
  ) {
    super();
  }
  toStringMeta() {
    // ENHANCE: use nicer simplification
    return this.isSensitive
      ? `[HIDDEN]`
      : inspect(this.data)
          .replace(/[\r\n]/g, " ")
          .slice(0, 60);
  }

  deduplicate(peers: readonly ConstantStep<any>[]) {
    return peers.filter((p) => p.data === this.data);
  }

  executeV2({ count }: ExecutionDetails): GrafastResultsList<TData> {
    return arrayOfLength(count, this.data);
  }

  eval() {
    return this.data;
  }

  evalIs(value: any) {
    return this.data === value;
  }

  evalIsEmpty() {
    return (
      typeof this.data === "object" &&
      this.data !== null &&
      Object.keys(this.data).length === 0
    );
  }

  unbatchedExecute() {
    return this.data;
  }

  isNull() {
    return this.data === null;
  }
  isUndefined() {
    return this.data === undefined;
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
export function constant<const TString extends string>(
  strings: TemplateStringsArray & [TString],
): ConstantStep<TString>;
export function constant<TData>(
  data: TData,
  isSecret?: boolean,
): ConstantStep<TData>;
export function constant<TData>(
  data: TData | (TemplateStringsArray & [TData]),
  isSecret?: boolean,
): ConstantStep<TData> {
  if (isTemplateStringsArray(data)) {
    if (data.length !== 1) {
      throw new Error(
        "constant`...` doesn't currently support placeholders; please use 'constant(`...`)' instead",
      );
    }
    return new ConstantStep<TData>(data[0], false);
  }
  return new ConstantStep<TData>(data, isSecret);
}
