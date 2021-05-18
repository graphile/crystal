import { Plan } from "../plan";
import { access, AccessPlan } from "./access";

/**
 * Implements `__ValuePlan(aether)` which is never executed; it's purely
 * internal - we populate the value as part of the algorithm - see
 * `GetValuePlanId` and `PopulateValuePlan`.
 *
 * @internal
 */
export class __ValuePlan extends Plan {
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
