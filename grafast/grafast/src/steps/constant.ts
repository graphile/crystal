import { inspect } from "../inspect.js";
import type { ExecutionDetails, GrafastResultsList } from "../interfaces.js";
import { ExecutableStep, UnbatchedExecutableStep } from "../step.js";
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
    const t = typeof data;
    if (
      data == null ||
      t === "boolean" ||
      t === "number" ||
      (t === "string" && t.length < 200)
    ) {
      this.peerKey = t + "|" + String(data);
    }
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

  execute({ count }: ExecutionDetails): GrafastResultsList<TData> {
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

  evalLength() {
    return Array.isArray(this.data) ? this.data.length : null;
  }

  evalKeys(): ReadonlyArray<keyof TData & string> | null {
    if (this.data == null || typeof this.data !== "object") {
      return null;
    } else {
      const data = this.data;
      return (Object.keys(data) as Array<keyof typeof data>).filter(
        (k) => data[k] !== undefined,
      ) as ReadonlyArray<keyof TData & string>;
    }
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

  get(key: string) {
    const value =
      typeof this.data === "object" &&
      this.data !== null &&
      Object.hasOwn(this.data, key)
        ? (this.data as Record<string, any>)[key]
        : undefined;
    return constant(value);
  }

  at(index: number) {
    const value = Array.isArray(this.data) ? this.data[index] : undefined;
    return constant(value);
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

// Have to overwrite the getDepOrConstant method due to circular dependency
(ExecutableStep.prototype as any).getDepOrConstant = function <TData>(
  this: ExecutableStep,
  depId: number | null,
  fallback: TData,
): ExecutableStep<TData> {
  return this.maybeGetDep(depId) ?? constant(fallback);
};
