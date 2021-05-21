import type { CrystalResultsList, CrystalValuesList } from "../interfaces";
import { Plan } from "../plan";
import type { __ListItemPlan, ListCapablePlan } from "./__listItem";
import { isListCapablePlan } from "./__listItem";

export class EachPlan<TData = any, TResult = any>
  extends Plan<ReadonlyArray<TResult>>
  implements ListCapablePlan<TResult> {
  listPlanId: number;

  constructor(
    listPlan: ListCapablePlan<TData>,
    private mapper: (item: TData) => TResult,
  ) {
    super();
    if (!isListCapablePlan(listPlan)) {
      throw new Error(
        `EachPlan called with plan ${listPlan}, but that isn't a list capable plan`,
      );
    }
    this.listPlanId = this.addDependency(listPlan);
  }

  listItem(
    _itemPlan: __ListItemPlan<Plan<ReadonlyArray<TData>>>,
  ): Plan<TResult> {
    throw new Error("Each can currently only be used during optimization");
    /*
    const originalListItem = (this.aether.plans[
      this.dependencies[this.listPlanId]
    ] as ListCapablePlan<TData>).listItem(itemPlan);
    const mappedPlan = this.mapper(originalListItem);
    console.log(
      `RETURNING MAPPED LIST ITEM PLAN ${mappedPlan} DEPENDENT ON ${itemPlan} via ${originalListItem}`,
    );
    return mappedPlan;
    */
  }

  execute(values: CrystalValuesList<[TData[]]>): CrystalResultsList<TResult[]> {
    console.log("EACH");
    console.dir(values, { depth: 8 });
    return values.map((v) => {
      const list = v[this.listPlanId];
      if (Array.isArray(list)) {
        return list.map(this.mapper);
      } else {
        return list;
      }
    });
  }
}

export function each<TData = any, TResult = any>(
  listPlan: ListCapablePlan<TData>,
  mapper: (item: TData) => TResult,
): EachPlan<TData, TResult> {
  return new EachPlan(listPlan, mapper);
}
