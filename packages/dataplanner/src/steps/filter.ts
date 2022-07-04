import chalk from "chalk";
import { getNamedType } from "graphql";

import { getCurrentGraphQLType } from "../global.js";
import type { ExecutableStep, ListCapableStep } from "../step.js";
import { isListCapableStep } from "../step.js";
import type { __ItemStep } from "./__item.js";
import type {
  __ListTransformStep,
  ListTransformItemPlanCallback,
  ListTransformReduce,
} from "./listTransform.js";
import { listTransform } from "./listTransform.js";

export type FilterPlanMemo = unknown[];

const reduceCallback: ListTransformReduce<FilterPlanMemo, boolean> = (
  memo,
  entireItemValue,
  include,
) => {
  if (include) {
    memo.push(entireItemValue);
  }
  return memo;
};

const initialState = (): FilterPlanMemo => [];

/**
 * Filters a list plan to only include entries for which the `filterCallback`
 * plan results in a truthy value.
 */
export function filter<
  TListStep extends ExecutableStep<readonly any[]>,
  TItemStep extends ExecutableStep<boolean>,
>(
  listPlan: TListStep,
  filterCallback: ListTransformItemPlanCallback<TListStep, TItemStep>,
): __ListTransformStep<
  TListStep,
  TItemStep,
  FilterPlanMemo,
  TListStep extends ListCapableStep<any, any>
    ? ReturnType<TListStep["listItem"]>
    : __ItemStep<any>
> {
  const currentGraphQLType = getCurrentGraphQLType();
  if (!currentGraphQLType) {
    throw new Error("partitionByIndex cannot be used in this position");
  }
  const namedType = getNamedType(currentGraphQLType);
  return listTransform<TListStep, TItemStep, FilterPlanMemo, any>({
    listPlan,
    itemPlanCallback: filterCallback,
    initialState,
    reduceCallback: reduceCallback,
    listItem: isListCapableStep(listPlan)
      ? (itemPlan) => listPlan.listItem(itemPlan as any)
      : undefined,
    namedType,
    meta: `filter:${chalk.yellow(listPlan.id)}${
      filterCallback.name ? `/${filterCallback.name}` : ""
    }`,
  });
}
