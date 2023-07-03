import * as assert from "../assert.js";
import type { Bucket } from "../bucket.js";
import { isDev } from "../dev.js";
import { executeBucket, newBucket } from "../engine/executeBucket.js";
import type { LayerPlanReasonSubroutine } from "../engine/LayerPlan.js";
import { LayerPlan } from "../engine/LayerPlan.js";
import { withGlobalLayerPlan } from "../engine/lib/withGlobalLayerPlan.js";
import type { GrafastError } from "../error.js";
import type {
  ExecutionExtra,
  GrafastResultsList,
  GrafastValuesList,
} from "../interfaces.js";
import type { ListCapableStep } from "../step.js";
import { ExecutableStep, isListCapableStep } from "../step.js";
import { __ItemStep } from "./__item.js";

/**
 * @internal
 */
export class DeepEvalStep extends ExecutableStep {
  static $$export = {
    moduleName: "grafast",
    exportName: "DeepEvalStep",
  };

  // TODO: change this to 'true' and rewrite execute to be synchronous
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
        const $newListItem = deepEval($listItem as any);

        if (
          this.isSyncAndSafe &&
          (!$__listItem.isSyncAndSafe ||
            !$listItem.isSyncAndSafe ||
            !$newListItem.isSyncAndSafe)
        ) {
          // TODO: log this deopt?
          this.isSyncAndSafe = false;
        }
        return $newListItem;
      },
    );
    this.subroutineLayer.setRootStep(itemPlan);

    this.operationPlan.finishSubroutine(this, this.subroutineLayer);
  }

  async execute(
    _count: number,
    values: [GrafastValuesList<any[] | null | undefined | GrafastError>],
    extra: ExecutionExtra,
  ): Promise<GrafastResultsList<any[]>> {
    const bucket = extra._bucket;

    const childLayerPlan = this.subroutineLayer;
    const copyStepIds = childLayerPlan.copyStepIds;

    const store: Bucket["store"] = new Map();
    const polymorphicPathList: (string | null)[] = [];
    const iterators: Array<Set<AsyncIterator<any> | Iterator<any>>> = [];
    const map: Map<number, number[]> = new Map();
    let size = 0;

    // TODO: do this better!
    const itemStepId = this.operationPlan.dangerouslyGetStep(
      this.itemStepId,
    ).id;
    if (itemStepId == null) {
      throw new Error(
        "GrafastInternalError<b3a2bff9-15c6-47e2-aa82-19c862324f1a>: listItem layer plan has no rootStepId",
      );
    }
    store.set(itemStepId, []);

    // Prepare store with an empty list for each copyPlanId
    for (const planId of copyStepIds) {
      store.set(planId, []);
      if (!bucket.store.has(planId)) {
        throw new Error(
          `GrafastInternalError<14f2b4c6-f951-44d6-ad6b-2eace3330b84>: plan '${planId}' (${this.operationPlan.dangerouslyGetStep(
            planId,
          )}) listed in copyStepIds but not available in parent bucket for ${this}`,
        );
      }
    }

    const listValues = values[0];

    // We'll typically be creating more listItem bucket entries than we
    // have parent buckets, so we must "multiply up" the store entries.
    for (
      let originalIndex = 0;
      originalIndex < listValues.length;
      originalIndex++
    ) {
      const list = listValues[originalIndex];
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
          store.get(itemStepId)![newIndex] = list[j];
          for (const planId of copyStepIds) {
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
          hasErrors: bucket.hasErrors,
          polymorphicPathList,
          iterators,
        },
        bucket.metaByMetaKey,
      );
      await executeBucket(childBucket, extra._requestContext);
    }

    const depResults = store.get(childLayerPlan.rootStep!.id)!;

    return listValues.map((list: any, originalIndex: number) => {
      if (list == null) {
        return list;
      }
      const indexes = map.get(originalIndex);
      if (!Array.isArray(list) || !Array.isArray(indexes)) {
        // TODO: should this be an error?
        console.warn(
          `Either list or values was not an array when processing ${this}`,
        );
        return null;
      }
      const values = indexes.map((idx) => {
        const val = depResults[idx];
        if (val instanceof Error) {
          throw val;
        }
        return val;
      });
      if (isDev) {
        assert.strictEqual(
          list.length,
          values.length,
          "GrafastInternalError<43cb302e-673b-4881-8c4c-f2d00fe5a3d7>: The list and values length must match for a DeepEvalStep",
        );
      }
      return values;
    });
  }
}

// TODO: document this better. (Had to do it for `each($items, $item =>
// object({...}))` JSON transform in pg-many-to-many

// TODO: rename this! Don't want to confuse with `eval()`.
// Ideas: "evaluate", "resolve", "conclude", "finalize", "execute".
// Don't like any of these really. `deepEvaluate` is probably the best, but is
// it worth the effort?
/**
 * If you want to use a step that might represent a list and you need all of
 * the `listItem` transforms to have already taken place (e.g. you're going to
 * send the result to an external service) rather than processing them through
 * the GraphQL response, then you may need to `deepEval` it.
 */
export function deepEval($step: ExecutableStep) {
  if (isListCapableStep($step)) {
    return new DeepEvalStep($step);
  } else {
    // No eval necessary
    return $step;
  }
}
