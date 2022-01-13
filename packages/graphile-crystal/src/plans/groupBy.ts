import type { ExecutablePlan, ListCapablePlan } from "../plan";
import type { __ItemPlan } from "./__item";
import type { __TransformPlan, TransformReduce } from "./transform";
import { transform } from "./transform";

const reduceCallback: TransformReduce<unknown[][], number> = (
  memo,
  entireItemValue,
  idx,
) => {
  if (!memo[idx]) {
    memo[idx] = [];
  }
  memo[idx].push(entireItemValue);
  return memo;
};

const initialState = () => [];

// TODO: rename so we're not confusing vs lodash' groupBy (which does something a little different)
export function groupBy<
  TListPlan extends ListCapablePlan<any, any>,
  TItemPlan extends ExecutablePlan<number>,
>(
  listPlan: TListPlan,
  mapper: (listItemPlan: ReturnType<TListPlan["listItem"]>) => TItemPlan,
): __TransformPlan<TListPlan, TItemPlan, unknown[][]> {
  return transform<TListPlan, TItemPlan, unknown[][]>({
    listPlan,
    itemPlanCallback: mapper,
    initialState,
    reduceCallback,
  });
}
