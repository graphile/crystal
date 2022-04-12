import chalk from "chalk";
import { getNamedType } from "graphql";

import { getCurrentGraphQLType } from "../global";
import type { ExecutablePlan, ListCapablePlan } from "../plan";
import { isListCapablePlan } from "../plan";
import type { __ItemPlan } from "./__item";
import type {
  __ListTransformPlan,
  ListTransformItemPlanCallback,
  ListTransformReduce,
} from "./listTransform";
import { listTransform } from "./listTransform";

type Memo = unknown[];

const reduceCallback: ListTransformReduce<Memo, boolean> = (
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
  filterCallback: ListTransformItemPlanCallback<TListPlan, TItemPlan>,
): __ListTransformPlan<
  TListPlan,
  TItemPlan,
  Memo,
  TListPlan extends ListCapablePlan<any, any>
    ? ReturnType<TListPlan["listItem"]>
    : __ItemPlan<any>
> {
  const currentGraphQLType = getCurrentGraphQLType();
  if (!currentGraphQLType) {
    throw new Error("partitionByIndex cannot be used in this position");
  }
  const namedType = getNamedType(currentGraphQLType);
  return listTransform<TListPlan, TItemPlan, Memo, any>({
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
