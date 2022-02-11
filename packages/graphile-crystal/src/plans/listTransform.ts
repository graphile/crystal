import type { GraphQLNamedType, GraphQLOutputType } from "graphql";

import { getCurrentParentPathIdentity } from "../global";
import type { CrystalResultsList } from "../interfaces";
import type { ListCapablePlan } from "../plan";
import { ExecutablePlan } from "../plan";
import type { __ItemPlan } from "./__item";

export type ListTransformReduce<TMemo, TItemPlanData> = (
  memo: TMemo,
  entireItemValue: unknown,
  itemPlanData: TItemPlanData,
) => TMemo;

export type ListTransformItemPlanCallback<
  TListPlan extends ExecutablePlan<readonly any[]>,
  TDepsPlan extends ExecutablePlan,
> = (
  listItemPlan: TListPlan extends ListCapablePlan<any, any>
    ? ReturnType<TListPlan["listItem"]>
    : __ItemPlan<any>,
) => TDepsPlan;

export interface ListTransformOptions<
  TListPlan extends ExecutablePlan<readonly any[]>,
  TDepsPlan extends ExecutablePlan,
  TMemo,
  TItemPlan extends ExecutablePlan | undefined = undefined,
> {
  listPlan: TListPlan;
  // TODO: rename this:
  itemPlanCallback: ListTransformItemPlanCallback<TListPlan, TDepsPlan>;
  initialState(): TMemo;
  reduceCallback: ListTransformReduce<
    TMemo,
    TDepsPlan extends ExecutablePlan<infer U> ? U : never
  >;
  listItem?(itemPlan: ExecutablePlan<any>): TItemPlan;
  finalizeCallback?(data: TMemo): TMemo;
  namedType: GraphQLNamedType & GraphQLOutputType;
  meta?: string;
}

/**
 * **Experimental.**
 *
 * A "special" plan that has custom handling in Crystal.
 *
 * @internal
 */
export class __ListTransformPlan<
  TListPlan extends ExecutablePlan<readonly any[]>,
  TDepsPlan extends ExecutablePlan,
  TMemo,
  TItemPlan extends ExecutablePlan | undefined = undefined,
> extends ExecutablePlan<TMemo> {
  static $$export = {
    moduleName: "graphile-crystal",
    exportName: "__ListTransformPlan",
  };
  sync = true;

  private listPlanId: number;
  public itemPlanCallback: ListTransformItemPlanCallback<TListPlan, TDepsPlan>;
  public initialState: () => TMemo;
  public reduceCallback: ListTransformReduce<
    TMemo,
    TDepsPlan extends ExecutablePlan<infer U> ? U : never
  >;
  public finalizeCallback?: (data: TMemo) => TMemo;
  public listItem?: (itemPlan: __ItemPlan<this>) => TItemPlan;
  public namedType: GraphQLNamedType & GraphQLOutputType;
  private meta: string | null;

  constructor(
    options: ListTransformOptions<TListPlan, TDepsPlan, TMemo, TItemPlan>,
  ) {
    super();
    this.parentPathIdentity = getCurrentParentPathIdentity();
    const {
      listPlan,
      itemPlanCallback,
      initialState,
      reduceCallback,
      finalizeCallback,
      listItem,
      namedType,
      meta,
    } = options;
    this.listPlanId = this.addDependency(listPlan);
    this.itemPlanCallback = itemPlanCallback;
    this.initialState = initialState;
    this.reduceCallback = reduceCallback;
    this.finalizeCallback = finalizeCallback;
    this.listItem = listItem;
    this.namedType = namedType;
    this.meta = meta ?? null;
  }

  toStringMeta() {
    return this.meta;
  }

  getListPlan(): TListPlan {
    return this.getDep(this.listPlanId) as TListPlan;
  }

  dangerouslyGetListPlan(): TListPlan {
    return this.aether.dangerouslyGetPlan(
      this.dependencies[this.listPlanId],
    ) as TListPlan;
  }

  deduplicate(
    peers: __ListTransformPlan<any, any, any, any>[],
  ): __ListTransformPlan<TListPlan, TDepsPlan, TMemo, TItemPlan> {
    for (const peer of peers) {
      if (
        peer.itemPlanCallback === this.itemPlanCallback &&
        peer.initialState === this.initialState &&
        peer.reduceCallback === this.reduceCallback &&
        peer.finalizeCallback === this.finalizeCallback &&
        peer.listItem === this.listItem
      ) {
        // TODO: We shouldn't return `peer` until we alias the replacement id in aether.listTransformDependencyPlanIdByListTransformPlanIdByFieldPathIdentity
        // return peer;
      }
    }
    return this;
  }

  // ListTransform plans must _NOT_ optimize away. They must persist.
  optimize() {
    return this;
  }

  execute(): CrystalResultsList<TMemo> {
    throw new Error(
      "__ListTransformPlan must never execute, Crystal handles this internally",
    );
  }
}

/**
 * **Experimental.**
 *
 * @see ./listTransform.md
 */
export function listTransform<
  TListPlan extends ExecutablePlan<readonly any[]>,
  TDepsPlan extends ExecutablePlan,
  TMemo,
  TItemPlan extends ExecutablePlan | undefined = undefined,
>(
  options: ListTransformOptions<TListPlan, TDepsPlan, TMemo, TItemPlan>,
): __ListTransformPlan<TListPlan, TDepsPlan, TMemo, TItemPlan> {
  return new __ListTransformPlan(options);
}
