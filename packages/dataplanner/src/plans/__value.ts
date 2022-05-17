import { ExecutablePlan } from "../plan.js";
import type { AccessPlan } from "./access.js";
import { access } from "./access.js";

/**
 * Implements `__ValuePlan(aether)` which is never executed; it's purely
 * internal - we populate the value as part of the algorithm - see
 * `GetValuePlanId` and `PopulateValuePlan`.
 */
export class __ValuePlan<TData> extends ExecutablePlan<TData> {
  static $$export = {
    moduleName: "dataplanner",
    exportName: "__ValuePlan",
  };
  isSyncAndSafe = true;

  constructor() {
    super();
    this.parentPathIdentity = this.createdWithParentPathIdentity;
  }

  toStringMeta(): string | null {
    switch (this) {
      case this.aether.rootValuePlan:
        return "rootValue";
      case this.aether.variableValuesPlan as __ValuePlan<unknown>:
        return "variableValues";
      case this.aether.contextPlan as __ValuePlan<unknown>:
        return "context";
      default:
        return null;
    }
  }

  execute(): never {
    // This is still an "executable plan"; we just side-step execution internally.
    throw new Error(
      `GraphileInternalError<7696a514-f452-4d47-92d3-85aeb5b23f48>: ${this} is a __ValuePlan and thus must never execute`,
    );
  }

  get<TAttr extends keyof TData>(attrName: TAttr): AccessPlan<TData[TAttr]> {
    return access(this, [attrName as string]);
  }

  at<TIndex extends keyof TData>(index: TIndex): AccessPlan<TData[TIndex]> {
    return access(this, [index as number]);
  }
}
