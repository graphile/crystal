import * as assert from "../assert.js";
import type { Bucket } from "../bucket.js";
import { isDev } from "../dev.js";
import { executeBucket, newBucket } from "../engine/executeBucket.js";
import type { LayerPlanReasonSubroutine } from "../engine/LayerPlan.js";
import { LayerPlan } from "../engine/LayerPlan.js";
import { withGlobalLayerPlan } from "../engine/lib/withGlobalLayerPlan.js";
import type { GrafastError } from "../error.js";
import type { ConnectionCapableStep, ExecutionDetails } from "../index.js";
import type {
  ExecutionExtra,
  GrafastResultsList,
  GrafastValuesList,
} from "../interfaces.js";
import type { ListCapableStep } from "../step.js";
import { $$deepDepSkip, ExecutableStep, isListCapableStep } from "../step.js";
import { __ItemStep } from "./__item.js";

export type ListTransformReduce<TMemo, TItemPlanData> = (
  memo: TMemo,
  entireItemValue: unknown,
  itemPlanData: TItemPlanData,
) => TMemo;

export type ListTransformItemPlanCallback<
  TListStep extends ExecutableStep<readonly any[]>,
  TDepsStep extends ExecutableStep,
> = (
  listItemPlan: TListStep extends ListCapableStep<any, any>
    ? ReturnType<TListStep["listItem"]>
    : __ItemStep<any>,
) => TDepsStep;

export interface ListTransformOptions<
  TListStep extends ExecutableStep<readonly any[]>,
  TDepsStep extends ExecutableStep,
  TMemo,
  TItemStep extends ExecutableStep | undefined = undefined,
> {
  listStep: TListStep;
  itemPlanCallback: ListTransformItemPlanCallback<TListStep, TDepsStep>;
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
  TListStep extends ExecutableStep<readonly any[]> = ExecutableStep<
    readonly any[]
  >,
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
  public itemPlanCallback: ListTransformItemPlanCallback<TListStep, TDepsStep>;
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
      listStep,
      itemPlanCallback,
      initialState,
      reduceCallback,
      finalizeCallback,
      listItem,
      meta,
      optimize,
      connectionClone,
    } = options;
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
    return this.getDep(this.listStepDepId) as TListStep;
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

  async executeV2({
    count,
    values,
    unaries,
    extra,
  }: ExecutionDetails<[any[] | null | undefined | GrafastError]>): Promise<
    GrafastResultsList<TMemo>
  > {
    const bucket = extra._bucket;

    const childLayerPlan = this.subroutineLayer;
    const { copyUnaryStepIds, copyBatchStepIds, rootStep } = childLayerPlan;

    const store: Bucket["store"] = new Map();
    const unaryStore = new Map();
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
    if (itemStep._isUnary) {
      // handled later
    } else {
      store.set(itemStepId, []);
    }

    for (const stepId of copyUnaryStepIds) {
      unaryStore.set(stepId, bucket.unaryStore.get(stepId));
      if (isDev && !bucket.unaryStore.has(stepId)) {
        throw new Error(
          `GrafastInternalError<2be5c2c6-a7f8-4002-93a0-6ace5a89a962>: unary step '${stepId}' (${this.operationPlan.dangerouslyGetStep(
            stepId,
          )}) listed in copyUnaryStepIds but not available in parent bucket for ${this}`,
        );
      }
    }
    // Prepare store with an empty list for each copyPlanId
    for (const stepId of copyBatchStepIds) {
      store.set(stepId, []);
      if (isDev && !bucket.store.has(stepId)) {
        throw new Error(
          `GrafastInternalError<26f20f5a-a38a-4f0d-8889-f04bc56d95b3>: step '${stepId}' (${this.operationPlan.dangerouslyGetStep(
            stepId,
          )}) listed in copyBatchStepIds but not available in parent bucket for ${this}`,
        );
      }
    }

    const listStepValues = values[this.listStepDepId];
    const listStepUnary = unaries[this.listStepDepId];

    // We'll typically be creating more listItem bucket entries than we
    // have parent buckets, so we must "multiply up" the store entries.
    for (let originalIndex = 0; originalIndex < count; originalIndex++) {
      const list =
        listStepValues === null ? listStepUnary : listStepValues[originalIndex];
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
          if (itemStep._isUnary) {
            unaryStore.set(itemStepId, list[j]);
          } else {
            store.get(itemStepId)![newIndex] = list[j];
          }
          for (const planId of copyBatchStepIds) {
            store.get(planId)![newIndex] =
              bucket.store.get(planId)![originalIndex];
          }
        }
      }
    }

    if (size > 0) {
      const childBucket = newBucket(
        {
          layerPlan: childLayerPlan,
          size,
          store,
          unaryStore,
          hasErrors: bucket.hasErrors,
          polymorphicPathList,
          iterators,
        },
        bucket.metaByMetaKey,
      );
      await executeBucket(childBucket, extra._requestContext);
    }

    const [depResults, unaryResult] = rootStep?._isUnary
      ? [null, unaryStore.get(rootStep!.id)]
      : [store.get(rootStep!.id)!, null];

    const results: any[] = [];
    for (let originalIndex = 0; originalIndex < count; originalIndex++) {
      const list =
        listStepValues === null ? listStepUnary : listStepValues[originalIndex];

      if (list == null) {
        results.push(list);
        continue;
      }
      const indexes = map.get(originalIndex);
      if (!Array.isArray(list) || !Array.isArray(indexes)) {
        // ERRORS: should this be an error?
        console.warn(
          `Either list or values was not an array when processing ${this}`,
        );
        results.push(null);
        continue;
      }
      const values = indexes.map((idx) =>
        depResults === null ? unaryResult : depResults[idx],
      );
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
      results.push(finalResult);
    }
    return results;
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
  TListStep extends ExecutableStep<readonly any[]>,
  TDepsStep extends ExecutableStep,
  TMemo,
  TItemStep extends ExecutableStep | undefined = undefined,
>(
  options: ListTransformOptions<TListStep, TDepsStep, TMemo, TItemStep>,
): __ListTransformStep<TListStep, TDepsStep, TMemo, TItemStep> {
  return new __ListTransformStep(options);
}
