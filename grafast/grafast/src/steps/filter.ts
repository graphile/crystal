import chalk from "chalk";

import type { ListCapableStep, Step } from "../step.ts";
import { isListCapableStep } from "../step.ts";
import type { __ItemStep } from "./__item.ts";
import type { ItemsStep, StepRepresentingList } from "./connection.ts";
import type {
  __ListTransformStep,
  ListTransformItemPlanCallback,
  ListTransformReduce,
} from "./listTransform.ts";
import { listTransform } from "./listTransform.ts";

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
  TListStep extends StepRepresentingList<any>,
  TItemStep extends Step<boolean>,
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
