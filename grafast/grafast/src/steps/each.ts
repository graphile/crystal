import chalk from "chalk";

import type { Maybe } from "../index.ts";
import type { ListCapableStep, Step } from "../step.ts";
import { isListCapableStep } from "../step.ts";
import { __ItemStep } from "./__item.ts";
import type {
  ConnectionHandlingStep,
  ConnectionOptimizedStep,
  ItemsStep,
  StepRepresentingList,
} from "./connection.ts";
import { __ListTransformStep, listTransform } from "./listTransform.ts";

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
 * True if the mapper doesn't do anything in our own subroutine (it's applied
 * to each item in the consuming list's layer plan instead), so our list is
 * our list step's list, unchanged.
 */
function eachYieldsListStep(this: __ListTransformStep<any>) {
  const layerPlan = this.subroutineLayer;
  const rootStep = layerPlan.rootStep;
  return (
    rootStep instanceof __ItemStep &&
    rootStep.getParentStep().layerPlan !== layerPlan
  );
}

function eachOptimize(this: __ListTransformStep<any>) {
  if (eachYieldsListStep.call(this)) {
    // We don't do anything; replace ourself with our parent
    return this.getListStep();
  }
  return this;
}

function eachStreamSourceDepIndex(this: __ListTransformStep<any>) {
  // A stream of our list step's list is a stream of ours.
  return eachYieldsListStep.call(this) ? this.listStepDepId : null;
}

/**
 * Transforms a list by wrapping each element in the list with the given mapper.
 */
export function each<
  TListStep extends StepRepresentingList<any> &
    Partial<
      | ConnectionOptimizedStep<any, any, any, any>
      | ConnectionHandlingStep<any, any, any, any>
    >,
  TResultItemStep extends Step,
>(
  listStep: TListStep,
  mapper: (
    itemPlan: ItemsStep<TListStep> extends ListCapableStep<any, any>
      ? ReturnType<ItemsStep<TListStep>["listItem"]>
      : Step<TListStep extends Step<Maybe<ReadonlyArray<infer U>>> ? U : any>,
  ) => TResultItemStep,
): __ListTransformStep<any, any, any, any> {
  const $each = listTransform<any, any, any, any>({
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
    optimize: eachOptimize,
    ...(listStep.connectionClone != null
      ? {
          connectionClone(
            this: __ListTransformStep<TListStep>,
            ...args: any[]
          ) {
            const $list = this.getListStep() as TListStep &
              ConnectionOptimizedStep<any, any>;
            const $clonedList = $list.connectionClone!(...args) as TListStep &
              ConnectionOptimizedStep<any, any>;
            return each($clonedList, mapper) as __ListTransformStep<TListStep> &
              // TYPES: this should also include ConnectionHandlingStep
              ConnectionOptimizedStep<any, any>;
          },
        }
      : null),
  });
  $each.streamSourceDepIndex = eachStreamSourceDepIndex;
  return $each;
}

export function isSkippableEach($step: Step): $step is __ListTransformStep {
  if ($step instanceof __ListTransformStep) {
    return (
      $step.itemPlanCallback === eachItemPlanCallback &&
      $step.initialState === eachInitialState &&
      $step.reduceCallback === eachReduceCallback &&
      $step.optimize === eachOptimize &&
      $step.optimize() === $step.getListStep()
    );
  }
  return false;
}
