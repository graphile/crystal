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
import { flagError } from "../error.js";
import {
  type ExecutionDetails,
  FLAG_ERROR,
  type GrafastResultsList,
} from "../interfaces.js";
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

  async execute({
    indexMap,
    values: [values0],
    extra,
  }: ExecutionDetails<[any[] | null | undefined | Error]>): Promise<
    GrafastResultsList<any[] | null | undefined>
  > {
    const bucket = extra._bucket;

    const childLayerPlan = this.subroutineLayer;
    const { copyStepIds, rootStep } = childLayerPlan;

    const store: Bucket["store"] = new Map();
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
      store.set(itemStepId, unaryExecutionValue(values0.at(0)));
    } else {
      store.set(itemStepId, batchExecutionValue([]));
    }

    for (const stepId of copyStepIds) {
      const ev = bucket.store.get(stepId)!;
      if (!ev) {
        throw new Error(
          `GrafastInternalError<68675bbd-bc15-4c4a-902a-61c0de616325>: unary step '${stepId}' (${this.operationPlan.dangerouslyGetStep(
            stepId,
          )}) listed in copyStepIds but not available in parent bucket for ${this}`,
        );
      }
      if (ev.isBatch) {
        // Prepare store with an empty list for each copyBatchPlanId
        store.set(stepId, batchExecutionValue([]));
      } else {
        store.set(stepId, ev);
      }
    }

    // We'll typically be creating more listItem bucket entries than we
    // have parent buckets, so we must "multiply up" the store entries.
    indexMap((originalIndex) => {
      const list = values0.at(originalIndex);
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
            // TODO: check for error?
            ev._setResult(newIndex, list[j], 0);
          }
          for (const copyStepId of copyStepIds) {
            const ev = store.get(copyStepId)!;
            if (ev.isBatch) {
              const orig = bucket.store.get(copyStepId)!;
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

    const depResults = store.get(rootStep!.id)!;

    return indexMap((originalIndex) => {
      const list = values0.at(originalIndex);
      if (list == null) {
        return list;
      }
      const indexes = map.get(originalIndex);
      if (!Array.isArray(list) || !Array.isArray(indexes)) {
        // Not a list value; just pass it straight through
        return list as any;
      }
      const values = indexes.map((idx) => {
        const val = depResults.at(idx);
        if (depResults._flagsAt(idx) & FLAG_ERROR) {
          // throw val;
          return flagError(val);
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
      return values;
    });
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
