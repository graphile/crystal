import { Plan } from "../plan";
import type { AccessPlan } from "./access";
import { access } from "./access";

/**
 * Implements `__ValuePlan(aether)` which is never executed; it's purely
 * internal - we populate the value as part of the algorithm - see
 * `GetValuePlanId` and `PopulateValuePlan`.
 */
export class __ValuePlan<TData> extends Plan<TData> {
  toStringMeta(): string | null {
    switch (this) {
      case this.aether.rootValuePlan:
        return "rootValue";
      case this.aether.variableValuesPlan:
        return "variableValues";
      case this.aether.contextPlan:
        return "context";
      default:
        return null;
    }
  }

  execute(): never {
    throw new Error("__ValuePlan must never execute");
  }

  get<TAttr extends string>(
    attrName: TAttr,
  ): AccessPlan<TData extends { [key: string]: any } ? TData[TAttr] : never> {
    return access(this, [attrName]);
  }

  at<TIndex extends number>(
    index: TIndex,
  ): AccessPlan<TData extends Array<any> ? TData[TIndex] : never> {
    return access(this, [index]);
  }
}
