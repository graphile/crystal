import type { CrystalResultsList, CrystalValuesList } from "../interfaces";
import type { ListCapablePlan } from "../plan";
import {
  assertListCapablePlan,
  ExecutablePlan,
  isListCapablePlan,
} from "../plan";
import type { __ItemPlan } from "./__item";

export class EachPlan<
    TSourceData,
    TOutputData,
    TSourceItemPlan extends ExecutablePlan<TSourceData> = ExecutablePlan<TSourceData>,
    TResultItemPlan extends ExecutablePlan<TOutputData> = ExecutablePlan<TOutputData>,
  >
  extends ExecutablePlan<ReadonlyArray<TSourceData>>
  implements ListCapablePlan<TOutputData>
{
  static $$export = {
    moduleName: "graphile-crystal",
    exportName: "EachPlan",
  };

  listPlanId: number;

  constructor(
    listPlan: ListCapablePlan<TSourceData, TSourceItemPlan>,
    private mapper: (itemPlan: TSourceItemPlan) => TResultItemPlan,
  ) {
    super();
    /*
    if (!isListCapablePlan(listPlan)) {
      throw new Error(
        `EachPlan called with plan ${listPlan}, but that isn't a list capable plan`,
      );
    }
    */
    this.listPlanId = this.addDependency(listPlan);
  }

  originalListPlan(): ListCapablePlan<TSourceData, TSourceItemPlan> {
    const plan = this.getPlan(this.dependencies[this.listPlanId]);
    // assertListCapablePlan(plan, this.createdWithParentPathIdentity);
    return plan as ListCapablePlan<TSourceData, TSourceItemPlan>;
  }

  listItem(itemPlan: __ItemPlan<this>): TResultItemPlan {
    const originalListItem = this.originalListPlan().listItem?.(itemPlan);
    const mappedPlan = this.mapper(originalListItem ?? itemPlan);
    return mappedPlan;
  }

  execute(
    values: CrystalValuesList<[TSourceData[]]>,
  ): CrystalResultsList<TSourceData[]> {
    return values.map((v) => v[this.listPlanId]);
  }
}

export function each<
  TSourceData,
  TOutputData,
  TSourceItemPlan extends ExecutablePlan<TSourceData> = ExecutablePlan<TSourceData>,
  TResultItemPlan extends ExecutablePlan<TOutputData> = ExecutablePlan<TOutputData>,
>(
  listPlan: ListCapablePlan<TSourceData, TSourceItemPlan>,
  mapper: (itemPlan: TSourceItemPlan) => TResultItemPlan,
): EachPlan<TSourceData, TOutputData, TSourceItemPlan, TResultItemPlan> {
  return new EachPlan<
    TSourceData,
    TOutputData,
    TSourceItemPlan,
    TResultItemPlan
  >(listPlan, mapper);
}
