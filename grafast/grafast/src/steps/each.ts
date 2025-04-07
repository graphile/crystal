import chalk from "chalk";

import type { ListCapableStep, Step } from "../step.js";
import { isListCapableStep } from "../step.js";
import { __ItemStep } from "./__item.js";
import type {
  ConnectionCapableStep,
  ConnectionStep,
  ItemsStep,
} from "./connection.js";
import type { __ListTransformStep } from "./listTransform.js";
import { listTransform } from "./listTransform.js";

const eachReduceCallback = (memo: any[], item: any) => {
  memo.push(item);
  return memo;
};
const eachItemPlanCallback = (itemPlan: Step) => itemPlan;
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
  TListStep extends
    | (Step<readonly any[]> & Partial<ConnectionCapableStep<any, any>>)
    | ConnectionCapableStep<any, any>,
  TResultItemStep extends Step,
>(
  listStep: TListStep,
  mapper: (
    itemPlan: ItemsStep<TListStep> extends ListCapableStep<any, any>
      ? ReturnType<ItemsStep<TListStep>["listItem"]>
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
    optimize(this: __ListTransformStep<any>) {
      const layerPlan = this.subroutineLayer;
      const rootStep = layerPlan.rootStep;
      if (
        rootStep instanceof __ItemStep &&
        rootStep.getParentStep().layerPlan !== layerPlan
      ) {
        // We don't do anything; replace ourself with our parent
        return this.getListStep();
      }
      return this;
    },
    ...(listStep.connectionClone != null
      ? {
          connectionClone(
            this: __ListTransformStep<TListStep>,
            $connection: ConnectionStep<any, any, any, any>,
            ...args: any[]
          ): ConnectionCapableStep<any, any> {
            const $list = this.getListStep() as TListStep &
              ConnectionCapableStep<any, any>;
            const $clonedList = $list.connectionClone(
              $connection,
              ...args,
            ) as TListStep & ConnectionCapableStep<any, any>;
            return each($clonedList, mapper) as __ListTransformStep<TListStep> &
              ConnectionCapableStep<any, any>;
          },
        }
      : null),
  });
}
