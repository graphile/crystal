import { Plan } from "../plan";
import type { AccessPlan } from "./access";
import { access } from "./access";

/**
 * Implements `__ValuePlan(aether)` which is never executed; it's purely
 * internal - we populate the value as part of the algorithm - see
 * `GetValuePlanId` and `PopulateValuePlan`.
 *
 * @internal
 */
export class __ValuePlan extends Plan {
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

  get(attrName: string): AccessPlan {
    return access(this, [attrName]);
  }

  at(index: number): AccessPlan {
    return access(this, [index]);
  }
}
