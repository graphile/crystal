import chalk from "chalk";

import type { ExecutableStep, ListCapableStep } from "../step.js";
import { isListCapableStep } from "../step.js";
import type { __ItemStep } from "./__item.js";
import type { ConnectionCapableStep, ItemsStep } from "./connection.js";
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
  TListStep extends
    | ExecutableStep<readonly any[]>
    | ConnectionCapableStep<any, any>,
  TItemStep extends ExecutableStep<boolean>,
>(
  listStep: TListStep,
  filterCallback: ListTransformItemPlanCallback<
    ItemsStep<TListStep>,
    TItemStep
  >,
): __ListTransformStep<
  TListStep,
  TItemStep,
  FilterPlanMemo,
  TListStep extends ListCapableStep<any, any>
    ? ReturnType<TListStep["listItem"]>
    : __ItemStep<any>
> {
  return listTransform<TListStep, TItemStep, FilterPlanMemo, any>({
    listStep,
    itemPlanCallback: filterCallback,
    initialState,
    reduceCallback: reduceCallback,
    listItem: isListCapableStep(listStep)
      ? (itemPlan) => listStep.listItem(itemPlan as any)
      : undefined,
    meta: `filter:${chalk.yellow(listStep.id)}${
      filterCallback.name ? `/${filterCallback.name}` : ""
    }`,
  });
}
