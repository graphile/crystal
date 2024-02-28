import * as assert from "../assert.js";
import type { Bucket } from "../bucket.js";
import { isDev } from "../dev.js";
import { executeBucket, newBucket } from "../engine/executeBucket.js";
import type { LayerPlanReasonSubroutine } from "../engine/LayerPlan.js";
import { LayerPlan } from "../engine/LayerPlan.js";
import { withGlobalLayerPlan } from "../engine/lib/withGlobalLayerPlan.js";
import type { GrafastError } from "../error.js";
import type { ExecutionDetails, GrafastResultsList } from "../interfaces.js";
import type { ListCapableStep } from "../step.js";
import { ExecutableStep, isListCapableStep } from "../step.js";
import { __ItemStep } from "./__item.js";

/**
 * @internal
 */
export class ApplyTransformsStep extends ExecutableStep {
  static $$export = {
    moduleName: "grafast",
    exportName: "ApplyTransformsStep",
  };

  // OPTIMIZE: if all the steps in the inner bucket are synchronous then theoretically we can be synchronous too
  isSyncAndSafe = false;

  /** Set during query planning.  */
  public itemStepId!: number;

  /**
   * @internal
   */
  public subroutineLayer: LayerPlan<LayerPlanReasonSubroutine>;

  constructor(listPlan: ListCapableStep<any, any>) {
    super();
    this.addDependency(listPlan);

    // Plan this subroutine
    this.subroutineLayer = new LayerPlan(this.operationPlan, this.layerPlan, {
      type: "subroutine",
      parentStep: this,
    });
    const itemPlan = withGlobalLayerPlan(
      this.subroutineLayer,
      listPlan.polymorphicPaths,
      () => {
        // This does NOT use `itemPlanFor` because __ListTransformPlans are special.
        const $__listItem = new __ItemStep(listPlan);
        $__listItem.transformStepId = this.id;
        this.itemStepId = $__listItem.id;
        const $listItem = isListCapableStep(listPlan)
          ? listPlan.listItem($__listItem)
          : $__listItem;
        const $newListItem = applyTransforms($listItem as any);

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

  async executeV2({
    count,
    values: [values0],
    extra,
  }: ExecutionDetails<[any[] | null | undefined | GrafastError]>): Promise<
    GrafastResultsList<any[]>
  > {
    const bucket = extra._bucket;

    const childLayerPlan = this.subroutineLayer;
    const { copyBatchStepIds, copyUnaryStepIds, rootStep } = childLayerPlan;

    const store: Bucket["store"] = new Map();
    const unaryStore = new Map();
    const polymorphicPathList: (string | null)[] = [];
    const iterators: Array<Set<AsyncIterator<any> | Iterator<any>>> = [];
    const map: Map<number, number[]> = new Map();
    let size = 0;

    // ENHANCE: do this better!
    const itemStep = this.operationPlan.dangerouslyGetStep(this.itemStepId);
    const itemStepId = itemStep.id;
    if (itemStepId == null) {
      throw new Error(
        "GrafastInternalError<b3a2bff9-15c6-47e2-aa82-19c862324f1a>: listItem layer plan has no rootStepId",
      );
    }
    if (itemStep._isUnary) {
      // Handled later
    } else {
      store.set(itemStepId, []);
    }

    for (const stepId of copyUnaryStepIds) {
      unaryStore.set(stepId, bucket.unaryStore.get(stepId));
      if (isDev && !bucket.unaryStore.has(stepId)) {
        throw new Error(
          `GrafastInternalError<68675bbd-bc15-4c4a-902a-61c0de616325>: unary step '${stepId}' (${this.operationPlan.dangerouslyGetStep(
            stepId,
          )}) listed in copyUnaryStepIds but not available in parent bucket for ${this}`,
        );
      }
    }
    // Prepare store with an empty list for each copyBatchPlanId
    for (const stepId of copyBatchStepIds) {
      store.set(stepId, []);
      if (isDev && !bucket.store.has(stepId)) {
        throw new Error(
          `GrafastInternalError<14f2b4c6-f951-44d6-ad6b-2eace3330b84>: step '${stepId}' (${this.operationPlan.dangerouslyGetStep(
            stepId,
          )}) listed in copyBatchStepIds but not available in parent bucket for ${this}`,
        );
      }
    }

    // We'll typically be creating more listItem bucket entries than we
    // have parent buckets, so we must "multiply up" the store entries.
    for (let originalIndex = 0; originalIndex < count; originalIndex++) {
      const list = values0.isBatch
        ? values0.entries[originalIndex]
        : values0.value;
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
          for (const stepId of copyBatchStepIds) {
            store.get(stepId)![newIndex] =
              bucket.store.get(stepId)![originalIndex];
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
      ? [null, unaryStore.get(rootStep.id)]
      : [store.get(rootStep!.id)!, null];

    const results: any[] = [];
    for (let originalIndex = 0; originalIndex < count; originalIndex++) {
      const list = values0.isBatch
        ? values0.entries[originalIndex]
        : values0.value;
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
      const values = indexes.map((idx) => {
        const val = depResults === null ? unaryResult : depResults[idx];
        if (val instanceof Error) {
          throw val;
        }
        return val;
      });
      if (isDev) {
        assert.strictEqual(
          list.length,
          values.length,
          "GrafastInternalError<43cb302e-673b-4881-8c4c-f2d00fe5a3d7>: The list and values length must match for a ApplyTransformsStep",
        );
      }
      results.push(values);
    }
    return results;
  }
}

// TODO: document this better. (Had to do it for `each($items, $item =>
// object({...}))` JSON transform in pg-many-to-many

/**
 * If you want to use a step that might represent a list and you need all of
 * the `listItem` transforms to have already taken place (e.g. you're going to
 * send the result to an external service) rather than processing them through
 * the GraphQL response, then you may need to call `applyTransforms` on it.
 */
export function applyTransforms($step: ExecutableStep) {
  if (isListCapableStep($step)) {
    return new ApplyTransformsStep($step);
  } else {
    // No eval necessary
    return $step;
  }
}
