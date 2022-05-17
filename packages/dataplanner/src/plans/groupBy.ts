import chalk from "chalk";
import { getNamedType } from "graphql";

import { getCurrentGraphQLType } from "../global.js";
import type { ExecutablePlan } from "../plan.js";
import { isListCapablePlan } from "../plan.js";
import type { __ItemPlan } from "./__item.js";
import { each } from "./each.js";
import type {
  __ListTransformPlan,
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
  TListPlan extends ExecutablePlan<readonly any[]>,
  TItemPlan extends ExecutablePlan<number>,
>(
  listPlan: TListPlan,
  mapper: ListTransformItemPlanCallback<TListPlan, TItemPlan>,
): __ListTransformPlan<TListPlan, TItemPlan, GroupByPlanMemo, any> {
  const currentGraphQLType = getCurrentGraphQLType();
  if (!currentGraphQLType) {
    throw new Error("partitionByIndex cannot be used in this position");
  }
  const namedType = getNamedType(currentGraphQLType);
  return listTransform<TListPlan, TItemPlan, GroupByPlanMemo, any>({
    listPlan,
    itemPlanCallback: mapper,
    initialState,
    reduceCallback: reduceCallback,
    listItem: isListCapablePlan(listPlan)
      ? (itemPlan) => {
          return each(itemPlan as any, ($item) =>
            listPlan.listItem($item as any),
          );
        }
      : undefined,
    namedType,
    meta: `groupBy:${chalk.yellow(listPlan.id)}${
      mapper.name ? `/${mapper.name}` : ""
    }`,
  });
}
