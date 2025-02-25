import { inspect } from "../inspect.js";
import type {
  ExecutionDetails,
  GrafastResultsList,
  JSONValue,
} from "../interfaces.js";
import { Step, UnbatchedStep } from "../step.js";
import { arrayOfLength } from "../utils.js";
import { operationPlan } from "./index.js";

/**
 * Converts a constant value (e.g. a string/number/etc) into a plan
 */
export class ConstantStep<TData> extends UnbatchedStep<TData> {
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
      : inspect(this.data, {
          compact: Infinity,
          breakLength: Infinity,
        })
          .replace(/[\r\n]/g, " ")
          .replaceAll("[Object: null prototype] ", "§")
          .slice(0, 60);
  }

  public planJSONExtra(): undefined | Record<string, JSONValue> {
    if (this.isSensitive) return;
    const data = this.data as unknown;
    if (
      data == null ||
      typeof data === "boolean" ||
      typeof data === "number" ||
      typeof data === "string"
    ) {
      return {
        constant: {
          type: typeof data,
        },
      };
    }
  }

  deduplicate(peers: readonly ConstantStep<any>[]) {
    return peers.filter((p) => p.data === this.data);
  }

  execute({ count }: ExecutionDetails): GrafastResultsList<TData> {
    return arrayOfLength(count, this.data);
  }

  /** @internal */
  eval() {
    return this.data;
  }

  /** @internal */
  evalIs(value: any) {
    return this.data === value;
  }

  /** @internal */
  evalIsEmpty() {
    return (
      typeof this.data === "object" &&
      this.data !== null &&
      Object.keys(this.data).length === 0
    );
  }

  /** @internal */
  evalLength() {
    return Array.isArray(this.data) ? this.data.length : null;
  }

  /** @internal */
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
    return constant(data[0], false);
  }
  const opPlan = operationPlan();
  const makeConst = () =>
    operationPlan().withRootLayerPlan(
      () => new ConstantStep<TData>(data, isSecret),
    );
  const t = typeof data;
  if (
    data == null ||
    t === "boolean" ||
    t === "string" ||
    t === "number" ||
    t === "symbol"
  ) {
    return opPlan.cacheStep(
      opPlan.contextStep,
      isSecret ? `constant-secret` : `constant`,
      data as null | undefined | boolean | string | number | symbol,
      makeConst,
    );
  } else {
    return makeConst();
  }
}

// Have to overwrite the getDepOrConstant method due to circular dependency
(Step.prototype as any).getDepOrConstant = function <TData>(
  this: Step,
  depId: number | null,
  fallback: TData,
): Step<TData> {
  return this.maybeGetDep(depId) ?? constant(fallback, false);
};
