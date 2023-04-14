import chalk from "chalk";

import type { ExecutableStep, ListCapableStep } from "../step.js";
import { isListCapableStep } from "../step.js";
import { __ItemStep } from "./__item.js";
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
  TResultItemStep extends ExecutableStep,
>(
  listStep: TListStep,
  mapper: (
    itemPlan: TListStep extends ListCapableStep<any, any>
      ? ReturnType<TListStep["listItem"]>
      : __ItemStep<any>,
  ) => TResultItemStep,
): __ListTransformStep<any, any, any, any> {
  return listTransform<any, any, any, any>({
    listStep,
    itemPlanCallback: eachItemPlanCallback,
    initialState: eachInitialState,
    reduceCallback: eachReduceCallback,
    listItem: isListCapableStep(listStep)
      ? eachCallbackForListPlan(listStep, mapper)
      : mapper,
    meta: `each:${chalk.yellow(listStep.id)}${
      mapper.name ? `/${mapper.name}` : ""
    }`,
    optimize(this) {
      const layerPlan = this.subroutineLayer;
      const rootStep = layerPlan.rootStep;
      if (
        rootStep instanceof __ItemStep &&
        rootStep.dependencies[0].layerPlan !== layerPlan
      ) {
        // We don't do anything; replace ourself with our parent
        this.operationPlan.deleteLayerPlan(layerPlan);
        return this.getListStep();
      }
      return this;
    },
  });
}
