import type { GrafastResultsList, JSONValue } from "../interfaces.ts";
import { $$noExec, Step } from "../step.ts";
import type { AccessStep } from "./access.ts";
import { access } from "./access.ts";

/**
 * Implements `__ValueStep(operationPlan)` which is never executed; it's purely
 * internal - we populate the value as part of the algorithm - see
 * `GetValueStepId` and `PopulateValueStep`.
 */
export class __ValueStep<TData> extends Step<TData> {
  static $$export = {
    moduleName: "grafast",
    exportName: "__ValueStep",
  };
  isSyncAndSafe = true;
  [$$noExec] = true;

  constructor(isImmutable: boolean) {
    super();
    this._isImmutable = isImmutable;
  }

  public planJSONExtra(): undefined | Record<string, JSONValue> {
    if (this.layerPlan.reason.type === "combined") {
      return { combined: true };
    }
  }

  toStringMeta(): string | null {
    switch (this) {
      case this.operationPlan.rootValueStep:
        return "rootValue";
      case this.operationPlan.variableValuesStep as __ValueStep<unknown>:
        return "variableValues";
      case this.operationPlan.contextStep as __ValueStep<unknown>:
        return "context";
      default:
        return null;
    }
  }

  execute(): GrafastResultsList<TData> {
    // This is still an "executable plan"; we just side-step execution internally.
    throw new Error(
      `GrafastInternalError<7696a514-f452-4d47-92d3-85aeb5b23f48>: ${this} is a __ValueStep and thus must never execute`,
    );
  }

  __inferGet?: {
    [TAttr in keyof TData]: AccessStep<TData[TAttr]>;
  };
  get<TAttr extends keyof TData>(attrName: TAttr): AccessStep<TData[TAttr]> {
    return this.cacheStep("get", attrName, () =>
      access(this, [attrName as string]),
    );
  }

  at<TIndex extends keyof TData>(index: TIndex): AccessStep<TData[TIndex]> {
    return this.cacheStep("at", index, () => access(this, [index as number]));
  }
}
