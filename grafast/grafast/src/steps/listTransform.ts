import * as assert from "../assert.js";
import type { Bucket } from "../bucket.js";
import { isDev } from "../dev.js";
import {
  batchExecutionValue,
  executeBucket,
  newBucket,
  unaryExecutionValue,
} from "../engine/executeBucket.js";
import type { LayerPlanReasonSubroutine } from "../engine/LayerPlan.js";
import { LayerPlan } from "../engine/LayerPlan.js";
import { withGlobalLayerPlan } from "../engine/lib/withGlobalLayerPlan.js";
import type { ConnectionCapableStep, ExecutionDetails } from "../index.js";
import type { GrafastResultsList } from "../interfaces.js";
import { $$deepDepSkip } from "../interfaces.js";
import type { ListCapableStep } from "../step.js";
import { ExecutableStep, isListCapableStep } from "../step.js";
import { __ItemStep } from "./__item.js";
import type { ItemsStep } from "./connection.js";
import { itemsOrStep } from "./connection.js";

export type ListTransformReduce<TMemo, TItemPlanData> = (
  memo: TMemo,
  entireItemValue: unknown,
  itemPlanData: TItemPlanData,
) => TMemo;

export type ListTransformItemPlanCallback<
  TListStep extends ExecutableStep<readonly any[]>,
  TDepsStep extends ExecutableStep,
> = (
  listItemPlan: ItemsStep<TListStep> extends ListCapableStep<any, any>
    ? ReturnType<ItemsStep<TListStep>["listItem"]>
    : __ItemStep<any>,
) => TDepsStep;

export interface ListTransformOptions<
  TListStep extends
    | ExecutableStep<readonly any[]>
    | ConnectionCapableStep<ExecutableStep<any>, any>,
  TDepsStep extends ExecutableStep,
  TMemo,
  TItemStep extends ExecutableStep | undefined = undefined,
> {
  listStep: TListStep;
  itemPlanCallback: ListTransformItemPlanCallback<
    ItemsStep<TListStep>,
    TDepsStep
  >;
  initialState(): TMemo;
  reduceCallback: ListTransformReduce<
    TMemo,
    TDepsStep extends ExecutableStep<infer U> ? U : never
  >;
  listItem?(itemPlan: ExecutableStep): TItemStep;
  finalizeCallback?(data: TMemo): TMemo;
  meta?: string;
  optimize?: (
    this: __ListTransformStep<TListStep, TDepsStep, TMemo, TItemStep>,
  ) => ExecutableStep;
  connectionClone?: ConnectionCapableStep<TListStep, any>["connectionClone"];
}

/**
 * **Experimental.**
 *
 * A "special" plan that has custom handling in Grafast. Used for turning lists
 * into other things (or maybe more lists!).
 *
 * It's recommended that you don't use this directly, please use one of the
 * functions that uses this under the hood such as `filter()`.
 */
export class __ListTransformStep<
  TListStep extends
    | ExecutableStep<readonly any[]>
    | ConnectionCapableStep<any, any> =
    | ExecutableStep<readonly any[]>
    | ConnectionCapableStep<any, any>,
  TDepsStep extends ExecutableStep = ExecutableStep,
  TMemo = any,
  TItemStep extends ExecutableStep | undefined = ExecutableStep | undefined,
> extends ExecutableStep<TMemo> {
  static $$export = {
    moduleName: "grafast",
    exportName: "__ListTransformStep",
  };
  // OPTIMIZE: if all the steps in the inner bucket are synchronous then theoretically we can be synchronous too
  isSyncAndSafe = false;

  private listStepDepId: number;
  public itemPlanCallback: ListTransformItemPlanCallback<
    ItemsStep<TListStep>,
    TDepsStep
  >;
  public initialState: () => TMemo;
  public reduceCallback: ListTransformReduce<
    TMemo,
    TDepsStep extends ExecutableStep<infer U> ? U : never
  >;
  public finalizeCallback?: (data: TMemo) => TMemo;
  public listItem?: (itemPlan: __ItemStep<this>) => TItemStep;
  private meta: string | null;
  public connectionClone?: ConnectionCapableStep<
    TListStep,
    any
  >["connectionClone"];

  /** Set during query planning.  */
  public itemStepId!: number;

  /**
   * @internal
   */
  public subroutineLayer: LayerPlan<LayerPlanReasonSubroutine>;

  constructor(
    options: ListTransformOptions<TListStep, TDepsStep, TMemo, TItemStep>,
  ) {
    super();
    const {
      listStep: rawListStep,
      itemPlanCallback,
      initialState,
      reduceCallback,
      finalizeCallback,
      listItem,
      meta,
      optimize,
      connectionClone,
    } = options;
    const listStep = itemsOrStep(rawListStep);
    this.listStepDepId = this.addDependency(listStep);
    this.itemPlanCallback = itemPlanCallback;
    this.initialState = initialState;
    this.reduceCallback = reduceCallback;
    this.finalizeCallback = finalizeCallback;
    this.listItem = listItem;
    this.meta = meta ?? null;
    if (optimize !== undefined) {
      this.optimize = optimize;
    }
    this.connectionClone = connectionClone;

    // Plan this subroutine
    this.subroutineLayer = new LayerPlan(this.operationPlan, this.layerPlan, {
      type: "subroutine",
      parentStep: this,
    });
    const itemPlan = withGlobalLayerPlan(
      this.subroutineLayer,
      listStep.polymorphicPaths,
      () => {
        // This does NOT use `itemPlanFor` because __ListTransformPlans are special.
        const $__listItem = new __ItemStep(listStep);
        $__listItem.transformStepId = this.id;
        this.itemStepId = $__listItem.id;
        const $listItem = isListCapableStep(listStep)
          ? listStep.listItem($__listItem)
          : $__listItem;
        const $newListItem = this.itemPlanCallback($listItem as any);

        if (
          this.isSyncAndSafe &&
          (!$__listItem.isSyncAndSafe ||
            !$listItem.isSyncAndSafe ||
            !$newListItem.isSyncAndSafe)
        ) {
          this.isSyncAndSafe = false;
        }
        return $newListItem;
      },
    );
    this.subroutineLayer.setRootStep(itemPlan);

    this.operationPlan.finishSubroutine(this, this.subroutineLayer);
  }

  toStringMeta() {
    return this.meta;
  }

  getListStep(): TListStep {
    return this.getDep<TListStep>(this.listStepDepId);
  }

  [$$deepDepSkip]() {
    return this.getListStep();
  }

  dangerouslyGetListPlan(): TListStep {
    return this.dependencies[this.listStepDepId] as TListStep;
  }

  deduplicate(
    peers: __ListTransformStep<any, any, any, any>[],
  ): __ListTransformStep<TListStep, TDepsStep, TMemo, TItemStep>[] {
    return peers.filter(
      (peer) =>
        peer.itemPlanCallback === this.itemPlanCallback &&
        peer.initialState === this.initialState &&
        peer.reduceCallback === this.reduceCallback &&
        peer.finalizeCallback === this.finalizeCallback &&
        peer.listItem === this.listItem,
    );
  }

  // ListTransform plans must _NOT_ optimize away. They must persist (unless
  // the options overrides this)
  optimize(): ExecutableStep {
    return this;
  }

  async execute({
    indexForEach,
    indexMap,
    values,
    extra,
  }: ExecutionDetails<[any[] | null | undefined | Error]>): Promise<
    GrafastResultsList<TMemo>
  > {
    const bucket = extra._bucket;

    const childLayerPlan = this.subroutineLayer;
    const { copyStepIds, rootStep } = childLayerPlan;
    if (rootStep === null) {
      throw new Error(`rootStep of ${childLayerPlan} must not be null.`);
    }

    const store: Bucket["store"] = new Map();
    const polymorphicPathList: (string | null)[] = [];
    const iterators: Array<Set<AsyncIterator<any> | Iterator<any>>> = [];
    const map: Map<number, number[]> = new Map();
    let size = 0;

    // ENHANCE: do this better!
    const itemStep = this.operationPlan.dangerouslyGetStep(this.itemStepId)!;
    const itemStepId = itemStep.id;
    if (itemStepId == null) {
      throw new Error(
        "GrafastInternalError<b3a2bff9-15c6-47e2-aa82-19c862324f1a>: listItem layer plan has no rootStepId",
      );
    }

    const listStepValue = values[this.listStepDepId];

    if (itemStep._isUnary) {
      const list = listStepValue.unaryValue();
      store.set(
        itemStepId,
        unaryExecutionValue(Array.isArray(list) ? list[0] : list),
      );
    } else {
      store.set(itemStepId, batchExecutionValue([]));
    }

    for (const stepId of copyStepIds) {
      const ev = bucket.store.get(stepId);
      if (!ev) {
        throw new Error(
          `GrafastInternalError<2be5c2c6-a7f8-4002-93a0-6ace5a89a962>: unary step '${stepId}' (${this.operationPlan.dangerouslyGetStep(
            stepId,
          )}) listed in copyStepIds but not available in parent bucket for ${this}`,
        );
      }
      if (ev.isBatch) {
        // Prepare store with an empty list for each copyPlanId
        store.set(stepId, batchExecutionValue([]));
      } else {
        store.set(stepId, ev);
      }
    }

    // We'll typically be creating more listItem bucket entries than we
    // have parent buckets, so we must "multiply up" the store entries.
    indexForEach((originalIndex) => {
      const list = listStepValue.at(originalIndex);
      if (Array.isArray(list)) {
        const newIndexes: number[] = [];
        map.set(originalIndex, newIndexes);
        for (let j = 0, l = list.length; j < l; j++) {
          const newIndex = size++;
          newIndexes.push(newIndex);
          polymorphicPathList[newIndex] =
            bucket.polymorphicPathList[originalIndex];
          // Copying across the iterators because we do NOT call outputBucket,
          // so we need to ensure any streams are cleaned up.
          iterators[newIndex] = bucket.iterators[originalIndex];
          const ev = store.get(itemStepId)!;
          if (ev.isBatch) {
            ev._setResult(newIndex, list[j], 0);
          }
          for (const planId of copyStepIds) {
            const ev = store.get(planId)!;
            if (ev.isBatch) {
              const orig = bucket.store.get(planId)!;
              ev._setResult(
                newIndex,
                orig.at(originalIndex),
                orig._flagsAt(originalIndex),
              );
            }
          }
        }
      }
    });

    if (size > 0) {
      const childBucket = newBucket(
        {
          layerPlan: childLayerPlan,
          size,
          store,
          flagUnion: bucket.flagUnion,
          polymorphicPathList,
          iterators,
        },
        bucket.metaByMetaKey,
      );
      await executeBucket(childBucket, extra._requestContext);
    }

    const depResults = store.get(rootStep.id)!;

    return indexMap((originalIndex) => {
      const list = listStepValue.at(originalIndex);
      if (list == null) {
        return list;
      }
      const indexes = map.get(originalIndex);
      if (!Array.isArray(list) || !Array.isArray(indexes)) {
        // ERRORS: should this be an error?
        console.warn(
          `Either list or values was not an array when processing ${this}`,
        );
        return null;
      }
      const values = indexes.map((idx) => depResults.at(idx));
      if (isDev) {
        assert.strictEqual(
          list.length,
          values.length,
          "GrafastInternalError<c85b6936-d406-4801-9c6b-625a567d32ff>: The list and values length must match for a __ListTransformStep",
        );
      }
      const initialState = this.initialState();
      const reduceResult = list.reduce(
        (memo, entireItemValue, listEntryIndex) =>
          this.reduceCallback(memo, entireItemValue, values[listEntryIndex]),
        initialState,
      );
      const finalResult = this.finalizeCallback
        ? this.finalizeCallback(reduceResult)
        : reduceResult;
      return finalResult;
    });
  }
}

/**
 * **Experimental.**
 *
 * A "special" plan that has custom handling in Grafast. Used for turning lists
 * into other things (or maybe more lists!).
 *
 * {@page ~grafast/steps/listTransform.md}
 */
export function listTransform<
  TListStep extends
    | ExecutableStep<readonly any[]>
    | ConnectionCapableStep<any, any>,
  TDepsStep extends ExecutableStep,
  TMemo,
  TItemStep extends ExecutableStep | undefined = undefined,
>(
  options: ListTransformOptions<TListStep, TDepsStep, TMemo, TItemStep>,
): __ListTransformStep<TListStep, TDepsStep, TMemo, TItemStep> {
  return new __ListTransformStep(options);
}
