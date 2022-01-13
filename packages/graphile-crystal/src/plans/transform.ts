import type { CrystalResultsList, CrystalValuesList } from "../interfaces";
import type { ListCapablePlan } from "../plan";
import { ExecutablePlan } from "../plan";
import type { __ItemPlan } from "./__item";

export type TransformReduce<TMemo, TItemPlanData> = (
  memo: TMemo,
  entireItemValue: unknown,
  itemPlanData: TItemPlanData,
) => TMemo;

export interface TransformOptions<
  TListPlan extends ListCapablePlan<any, any>,
  TDepsPlan extends ExecutablePlan,
  TMemo,
  TItemPlan extends ExecutablePlan | undefined = undefined,
> {
  listPlan: TListPlan;
  // TODO: rename this:
  itemPlanCallback(listItemPlan: ReturnType<TListPlan["listItem"]>): TDepsPlan;
  initialState(): TMemo;
  reduceCallback: TransformReduce<
    TMemo,
    TDepsPlan extends ExecutablePlan<infer U> ? U : never
  >;
  listItem?(itemPlan: __ItemPlan<this>): TItemPlan;
  finalizeCallback?(data: TMemo): TMemo;
}

/**
 * **Experimental.**
 *
 * A "special" plan that has custom handling in Crystal.
 *
 * @internal
 */
export class __TransformPlan<
  TListPlan extends ListCapablePlan<any, any>,
  TDepsPlan extends ExecutablePlan,
  TMemo,
  TItemPlan extends ExecutablePlan | undefined = undefined,
> extends ExecutablePlan<TMemo> {
  static $$export = {
    moduleName: "graphile-crystal",
    exportName: "TransformPlan",
  };

  private listPlanId: number;
  public itemPlanCallback: (
    listItemPlan: ReturnType<TListPlan["listItem"]>,
  ) => TDepsPlan;
  public initialState: () => TMemo;
  public reduceCallback: TransformReduce<
    TMemo,
    TDepsPlan extends ExecutablePlan<infer U> ? U : never
  >;
  public finalizeCallback?: (data: TMemo) => TMemo;
  public listItem?: (itemPlan: __ItemPlan<this>) => TItemPlan;

  constructor(
    options: TransformOptions<TListPlan, TDepsPlan, TMemo, TItemPlan>,
  ) {
    super();
    const {
      listPlan,
      itemPlanCallback,
      initialState,
      reduceCallback,
      finalizeCallback,
      listItem,
    } = options;
    this.listPlanId = this.addDependency(listPlan);
    this.itemPlanCallback = itemPlanCallback;
    this.initialState = initialState;
    this.reduceCallback = reduceCallback;
    this.finalizeCallback = finalizeCallback;
    this.listItem = listItem;
  }

  getListPlan(): TListPlan {
    return this.getDep(this.listPlanId) as TListPlan;
  }

  deduplicate(
    peers: __TransformPlan<any, any, any, any>[],
  ): __TransformPlan<TListPlan, TDepsPlan, TMemo, TItemPlan> {
    for (const peer of peers) {
      if (
        peer.itemPlanCallback === this.itemPlanCallback &&
        peer.initialState === this.initialState &&
        peer.reduceCallback === this.reduceCallback &&
        peer.finalizeCallback === this.finalizeCallback &&
        peer.listItem === this.listItem
      ) {
        return peer;
      }
    }
    return this;
  }

  execute(
    values: CrystalValuesList<
      [TListPlan extends ListCapablePlan<infer U, any> ? U[] : never]
    >,
  ): CrystalResultsList<TMemo> {
    return values.map(([_list]) => {
      throw new Error("TODO");
    });
  }
}

export function transform<
  TListPlan extends ListCapablePlan<any, any>,
  TDepsPlan extends ExecutablePlan,
  TMemo,
  TItemPlan extends ExecutablePlan | undefined = undefined,
>(
  options: TransformOptions<TListPlan, TDepsPlan, TMemo, TItemPlan>,
): __TransformPlan<TListPlan, TDepsPlan, TMemo, TItemPlan> {
  return new __TransformPlan(options);
}
