import type { CrystalResultsList, CrystalValuesList } from "../interfaces";
import type { ListCapablePlan } from "../plan";
import { ExecutablePlan } from "../plan";

export type TransformReduce<TMemo, TItemPlanData> = (
  memo: TMemo,
  entireItemValue: unknown,
  itemPlanData: TItemPlanData,
) => TMemo;

export interface TransformOptions<TItemPlan extends ExecutablePlan, TMemo> {
  initialState: () => TMemo;
  reduceCallback: TransformReduce<
    TMemo,
    TItemPlan extends ExecutablePlan<infer U> ? U : never
  >;
  finalizeCallback?: (data: TMemo) => TMemo;
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
  TItemPlan extends ExecutablePlan,
  TMemo,
> extends ExecutablePlan<TMemo> {
  static $$export = {
    moduleName: "graphile-crystal",
    exportName: "TransformPlan",
  };

  public transformOptions: TransformOptions<TItemPlan, TMemo>;

  constructor(
    listPlan: TListPlan,
    public itemPlanCallback: (
      listItemPlan: ReturnType<TListPlan["listItem"]>,
    ) => TItemPlan,
    options: TransformOptions<TItemPlan, TMemo>,
  ) {
    super();
    this.addDependency(listPlan);
    this.transformOptions = options;
  }

  deduplicate(
    peers: __TransformPlan<any, any, any>[],
  ): __TransformPlan<TListPlan, TItemPlan, TMemo> {
    for (const peer of peers) {
      if (
        peer.itemPlanCallback === this.itemPlanCallback &&
        peer.transformOptions.initialState ===
          this.transformOptions.initialState &&
        peer.transformOptions.reduceCallback ===
          this.transformOptions.reduceCallback &&
        peer.transformOptions.finalizeCallback ===
          this.transformOptions.finalizeCallback
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
  TItemPlan extends ExecutablePlan,
  TMemo,
>(
  listPlan: TListPlan,
  itemPlanCallback: (
    listItemPlan: ReturnType<TListPlan["listItem"]>,
  ) => TItemPlan,
  options: TransformOptions<TItemPlan, TMemo>,
): __TransformPlan<TListPlan, TItemPlan, TMemo> {
  return new __TransformPlan(listPlan, itemPlanCallback, options);
}
