import chalk from "chalk";
import { getNamedType } from "graphql";

import { getGlobalState } from "../global";
import type { ExecutablePlan, ListCapablePlan } from "../plan";
import { isListCapablePlan } from "../plan";
import type { __ItemPlan } from "./__item";
import { each } from "./each";
import type {
  __TransformPlan,
  TransformItemPlanCallback,
  TransformReduce,
} from "./transform";
import { transform } from "./transform";

type Memo = unknown[];

const reduceCallback: TransformReduce<Memo, boolean> = (
  memo,
  entireItemValue,
  include,
) => {
  if (include) {
    memo.push(entireItemValue);
  }
  return memo;
};

const initialState = (): Memo => [];

/**
 * Filters a list plan to only include entries for which the `filterCallback`
 * plan results in a truthy value.
 */
export function filter<
  TListPlan extends ExecutablePlan<readonly any[]>,
  TItemPlan extends ExecutablePlan<boolean>,
>(
  listPlan: TListPlan,
  filterCallback: TransformItemPlanCallback<TListPlan, TItemPlan>,
): __TransformPlan<
  TListPlan,
  TItemPlan,
  Memo,
  TListPlan extends ListCapablePlan<any, any>
    ? ReturnType<TListPlan["listItem"]>
    : __ItemPlan<any>
> {
  const currentGraphQLType = getGlobalState().currentGraphQLType;
  if (!currentGraphQLType) {
    throw new Error("partitionByIndex cannot be used in this position");
  }
  const namedType = getNamedType(currentGraphQLType);
  return transform<TListPlan, TItemPlan, Memo, any>({
    listPlan,
    itemPlanCallback: filterCallback,
    initialState,
    reduceCallback: reduceCallback,
    listItem: isListCapablePlan(listPlan)
      ? (itemPlan) => listPlan.listItem(itemPlan as any)
      : undefined,
    namedType,
    meta: `filter:${chalk.yellow(listPlan.id)}${
      filterCallback.name ? `/${filterCallback.name}` : ""
    }`,
  });
}
