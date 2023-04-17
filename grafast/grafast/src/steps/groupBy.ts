import chalk from "chalk";

import type { ExecutableStep } from "../step.js";
import { isListCapableStep } from "../step.js";
import type { __ItemStep } from "./__item.js";
import { each } from "./each.js";
import type {
  __ListTransformStep,
  ListTransformItemPlanCallback,
  ListTransformReduce,
} from "./listTransform.js";
import { listTransform } from "./listTransform.js";

export type GroupByPlanMemo = Map<unknown, unknown[]>;

const reduceCallback: ListTransformReduce<GroupByPlanMemo, any> = (
  memo,
  entireItemValue,
  idx,
) => {
  let list = memo.get(idx);
  if (!list) {
    list = [];
    memo.set(idx, list);
  }
  list.push(entireItemValue);
  return memo;
};

const initialState = (): GroupByPlanMemo => new Map();

/**
 * Takes a single dimensional list plan and a mapper that returns a grouping
 * key. Returns a plan that results in a Map where the keys are the grouping
 * keys and the values are lists of the original entries that match these
 * grouping keys.
 */
export function groupBy<
  TListStep extends ExecutableStep<readonly any[]>,
  TItemStep extends ExecutableStep<number>,
>(
  listStep: TListStep,
  mapper: ListTransformItemPlanCallback<TListStep, TItemStep>,
): __ListTransformStep<TListStep, TItemStep, GroupByPlanMemo, any> {
  return listTransform<TListStep, TItemStep, GroupByPlanMemo, any>({
    listStep,
    itemPlanCallback: mapper,
    initialState,
    reduceCallback: reduceCallback,
    listItem: isListCapableStep(listStep)
      ? (itemPlan) => {
          return each(itemPlan as any, ($item) =>
            listStep.listItem($item as any),
          );
        }
      : undefined,
    meta: `groupBy:${chalk.yellow(listStep.id)}${
      mapper.name ? `/${mapper.name}` : ""
    }`,
  });
}
