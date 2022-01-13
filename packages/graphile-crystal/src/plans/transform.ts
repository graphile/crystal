import type { CrystalResultsList, CrystalValuesList } from "../interfaces";
import type { ListCapablePlan } from "../plan";
import { ExecutablePlan } from "../plan";

export type TransformReduce<TMemo, TItemPlanData> = (
  memo: TMemo,
  entireItemValue: unknown,
  itemPlanData: TItemPlanData,
) => TMemo;

export interface TransformOptions<
  TListPlan extends ListCapablePlan<any, any>,
  TItemPlan extends ExecutablePlan,
  TMemo,
> {
  listPlan: TListPlan;
  // TODO: rename this:
  itemPlanCallback: (
    listItemPlan: ReturnType<TListPlan["listItem"]>,
  ) => TItemPlan;
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

  public itemPlanCallback: (
    listItemPlan: ReturnType<TListPlan["listItem"]>,
  ) => TItemPlan;
  public initialState: () => TMemo;
  public reduceCallback: TransformReduce<
    TMemo,
    TItemPlan extends ExecutablePlan<infer U> ? U : never
  >;
  public finalizeCallback?: (data: TMemo) => TMemo;

  constructor(options: TransformOptions<TListPlan, TItemPlan, TMemo>) {
    super();
    const {
      listPlan,
      itemPlanCallback,
      initialState,
      reduceCallback,
      finalizeCallback,
    } = options;
    this.addDependency(listPlan);
    this.itemPlanCallback = itemPlanCallback;
    this.initialState = initialState;
    this.reduceCallback = reduceCallback;
    this.finalizeCallback = finalizeCallback;
  }

  deduplicate(
    peers: __TransformPlan<any, any, any>[],
  ): __TransformPlan<TListPlan, TItemPlan, TMemo> {
    for (const peer of peers) {
      if (
        peer.itemPlanCallback === this.itemPlanCallback &&
        peer.initialState === this.initialState &&
        peer.reduceCallback === this.reduceCallback &&
        peer.finalizeCallback === this.finalizeCallback
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
  options: TransformOptions<TListPlan, TItemPlan, TMemo>,
): __TransformPlan<TListPlan, TItemPlan, TMemo> {
  return new __TransformPlan(options);
}
