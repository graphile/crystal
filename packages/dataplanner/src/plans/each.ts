import chalk from "chalk";
import { getNamedType } from "graphql";

import { getCurrentGraphQLType } from "../global.js";
import type { ExecutablePlan, ListCapablePlan } from "../plan.js";
import { isListCapablePlan } from "../plan.js";
import type { __ItemPlan } from "./__item.js";
import type { __ListTransformPlan } from "./listTransform.js";
import { listTransform } from "./listTransform.js";

const eachReduceCallback = (memo: any[], item: any) => {
  memo.push(item);
  return memo;
};
const eachItemPlanCallback = (itemPlan: ExecutablePlan) => itemPlan;
const eachInitialState = () => [] as any;

const outerCache = new WeakMap<any, WeakMap<any, any>>();
const eachCallbackForListPlan = (
  listPlan: ListCapablePlan<any>,
  mapper: any,
): any => {
  let innerCache = outerCache.get(listPlan);
  if (!innerCache) {
    innerCache = new WeakMap();
    outerCache.set(listPlan, innerCache);
  }
  let result = innerCache.get(mapper);
  if (!result) {
    result = (itemPlan: any) =>
      mapper(listPlan.listItem(itemPlan as any) as any);
    innerCache.set(mapper, result);
  }
  return result;
};

/**
 * Transforms a list by wrapping each element in the list with the given mapper.
 */
export function each<
  TListPlan extends ExecutablePlan<readonly any[]>,
  TResultItemPlan extends ExecutablePlan<any>,
>(
  listPlan: TListPlan,
  mapper: (
    itemPlan: TListPlan extends ListCapablePlan<any, any>
      ? ReturnType<TListPlan["listItem"]>
      : __ItemPlan<any>,
  ) => TResultItemPlan,
): __ListTransformPlan<any, any, any, any> {
  const currentGraphQLType = getCurrentGraphQLType();
  if (!currentGraphQLType) {
    throw new Error("partitionByIndex cannot be used in this position");
  }
  const namedType = getNamedType(currentGraphQLType);
  return listTransform<any, any, any, any>({
    listPlan,
    itemPlanCallback: eachItemPlanCallback,
    initialState: eachInitialState,
    reduceCallback: eachReduceCallback,
    listItem: isListCapablePlan(listPlan)
      ? eachCallbackForListPlan(listPlan, mapper)
      : mapper,
    namedType,
    meta: `each:${chalk.yellow(listPlan.id)}${
      mapper.name ? `/${mapper.name}` : ""
    }`,
  });
}
