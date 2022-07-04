import chalk from "chalk";
import { getNamedType } from "graphql";

import { getCurrentGraphQLType } from "../global.js";
import type { ExecutableStep, ListCapableStep } from "../step.js";
import { isListCapableStep } from "../step.js";
import type { __ItemStep } from "./__item.js";
import type { __ListTransformStep } from "./listTransform.js";
import { listTransform } from "./listTransform.js";

const eachReduceCallback = (memo: any[], item: any) => {
  memo.push(item);
  return memo;
};
const eachItemPlanCallback = (itemPlan: ExecutableStep) => itemPlan;
const eachInitialState = () => [] as any;

const outerCache = new WeakMap<any, WeakMap<any, any>>();
const eachCallbackForListPlan = (
  listPlan: ListCapableStep<any>,
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
  TListStep extends ExecutableStep<readonly any[]>,
  TResultItemStep extends ExecutableStep<any>,
>(
  listPlan: TListStep,
  mapper: (
    itemPlan: TListStep extends ListCapableStep<any, any>
      ? ReturnType<TListStep["listItem"]>
      : __ItemStep<any>,
  ) => TResultItemStep,
): __ListTransformStep<any, any, any, any> {
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
    listItem: isListCapableStep(listPlan)
      ? eachCallbackForListPlan(listPlan, mapper)
      : mapper,
    namedType,
    meta: `each:${chalk.yellow(listPlan.id)}${
      mapper.name ? `/${mapper.name}` : ""
    }`,
  });
}
