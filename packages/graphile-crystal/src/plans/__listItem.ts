import { getCurrentParentPathIdentity } from "../global";
import { Plan } from "../plan";

export class __ListItemPlan<
  TParentPlan extends Plan<ReadonlyArray<any>>
> extends Plan<TParentPlan extends Plan<ReadonlyArray<infer U>> ? U : never> {
  constructor(parentPlan: TParentPlan) {
    super();
    this.addDependency(parentPlan);
    this.parentPathIdentity = getCurrentParentPathIdentity();
  }

  execute(): never {
    throw new Error("__ListItemPlan must never execute");
  }
}
