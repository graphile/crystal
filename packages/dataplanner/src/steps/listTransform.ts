import * as assert from "assert";
import type { GraphQLNamedType, GraphQLOutputType } from "graphql";

import type { Bucket } from "../bucket.js";
import { isDev } from "../dev.js";
import { executeBucket, newBucket } from "../engine/executeBucket.js";
import type { LayerPlanReasonSubroutine } from "../engine/LayerPlan.js";
import { LayerPlan } from "../engine/LayerPlan.js";
import { withGlobalLayerPlan } from "../engine/lib/withGlobalLayerPlan.js";
import type { CrystalError } from "../error.js";
import type {
  CrystalResultsList,
  CrystalValuesList,
  ExecutionExtra,
} from "../interfaces.js";
import type { ListCapableStep } from "../step.js";
import { ExecutableStep, isListCapableStep } from "../step.js";
import { isPromiseLike } from "../utils.js";
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
  listPlan: TListStep;
  // TODO: rename this:
  itemPlanCallback: ListTransformItemPlanCallback<TListStep, TDepsStep>;
  initialState(): TMemo;
  reduceCallback: ListTransformReduce<
    TMemo,
    TDepsStep extends ExecutableStep<infer U> ? U : never
  >;
  listItem?(itemPlan: ExecutableStep<any>): TItemStep;
  finalizeCallback?(data: TMemo): TMemo;
  namedType: GraphQLNamedType & GraphQLOutputType;
  meta?: string;
}

/**
 * **Experimental.**
 *
 * A "special" plan that has custom handling in Crystal. Used for turning lists
 * into other things (or maybe more lists!).
 *
 * It's recommended that you don't use this directly, please use one of the
 * functions that uses this under the hood such as `filter()`.
 */
export class __ListTransformStep<
  TListStep extends ExecutableStep<readonly any[]>,
  TDepsStep extends ExecutableStep,
  TMemo,
  TItemStep extends ExecutableStep | undefined = undefined,
> extends ExecutableStep<TMemo> {
  static $$export = {
    moduleName: "dataplanner",
    exportName: "__ListTransformStep",
  };
  // TODO: change this to 'true' and rewrite execute to be synchronous
  isSyncAndSafe = false;

  private listPlanDepId: number;
  public itemPlanCallback: ListTransformItemPlanCallback<TListStep, TDepsStep>;
  public initialState: () => TMemo;
  public reduceCallback: ListTransformReduce<
    TMemo,
    TDepsStep extends ExecutableStep<infer U> ? U : never
  >;
  public finalizeCallback?: (data: TMemo) => TMemo;
  public listItem?: (itemPlan: __ItemStep<this>) => TItemStep;
  public namedType: GraphQLNamedType & GraphQLOutputType;
  private meta: string | null;

  /** Set during query planning.  */
  public itemStepId!: number;

  private subroutineLayer: LayerPlan<LayerPlanReasonSubroutine>;

  constructor(
    options: ListTransformOptions<TListStep, TDepsStep, TMemo, TItemStep>,
  ) {
    super();
    const {
      listPlan,
      itemPlanCallback,
      initialState,
      reduceCallback,
      finalizeCallback,
      listItem,
      namedType,
      meta,
    } = options;
    this.listPlanDepId = this.addDependency(listPlan);
    this.itemPlanCallback = itemPlanCallback;
    this.initialState = initialState;
    this.reduceCallback = reduceCallback;
    this.finalizeCallback = finalizeCallback;
    this.listItem = listItem;
    this.namedType = namedType;
    this.meta = meta ?? null;

    // Plan this subroutine
    this.subroutineLayer = new LayerPlan(
      this.layerPlan.operationPlan,
      this.layerPlan,
      {
        type: "subroutine",
        parentPlanId: this.id,
      },
      listPlan.polymorphicPaths,
    );
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
        const $newListItem = this.itemPlanCallback($listItem as any);

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
    this.subroutineLayer.rootStepId = itemPlan.id;

    this.opPlan.finishSubroutine(this, this.subroutineLayer);
  }

  toStringMeta() {
    return this.meta;
  }

  getListStep(): TListStep {
    return this.getDep(this.listPlanDepId) as TListStep;
  }

  dangerouslyGetListPlan(): TListStep {
    return this.opPlan.dangerouslyGetStep(
      this.dependencies[this.listPlanDepId],
    ) as TListStep;
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
    // TODO: We shouldn't return `peer` until we alias the replacement id in
    // opPlan.listTransformDependencyPlanIdByListTransformPlanIdByFieldPathIdentity.
    // Also `itemPlanIdByListTransformStepId`.
    //
    // return peer;
  }

  // ListTransform plans must _NOT_ optimize away. They must persist.
  optimize() {
    return this;
  }

  finalize() {
    // TODO: the commented code below needs to be factored into the new planner.
    /*
    // __ListTransformStep must list all their child chain's external
    // dependencies as their own so that pluarility is correct for the
    // buckets.
    const transformDependencyStepId =
      this.opPlan.transformDependencyPlanIdByTransformStepId[this.id];
    const transformDependencyPlan = this.opPlan.dangerouslyGetStep(
      transformDependencyStepId,
    );

    const externalDependencies = new Set<ExecutableStep>();
    const listPlan = this.opPlan.dangerouslyGetStep(this.dependencies[0]);

    const recurse = (innerPlan: ExecutableStep): boolean => {
      if (innerPlan === listPlan) {
        return true;
      }
      let hasInternal = false;
      const externals = [];
      for (const depId of innerPlan.dependencies) {
        const dep = this.opPlan.dangerouslyGetStep(depId);
        const internal = recurse(dep);
        if (internal) {
          hasInternal = true;
        } else {
          externals.push(dep);
        }
      }
      if (hasInternal && externals.length > 0) {
        externals.forEach((external) => {
          externalDependencies.add(external);
        });
      }
      return hasInternal;
    };

    recurse(transformDependencyPlan);
    if (externalDependencies.size > 0) {
      const itemStepId = this.opPlan.itemPlanIdByListTransformStepId[this.id]!;
      const itemPlan = this.opPlan.dangerouslyGetStep(itemStepId);
      for (const dep of externalDependencies) {
        this.addDependency(dep);
        (itemPlan.dependencies as Array<string>).push(dep.id);
      }
    }
    */
    return super.finalize();
  }

  async execute(
    values: [CrystalValuesList<any[] | null | undefined | CrystalError>],
    extra: ExecutionExtra,
  ): Promise<CrystalResultsList<TMemo>> {
    const bucket = extra._bucket;

    const childLayerPlan = this.subroutineLayer;
    const copyStepIds = childLayerPlan.copyPlanIds;

    const store: Bucket["store"] = Object.create(null);
    const polymorphicPathList: string[] = [];
    const map: Map<number, number[]> = new Map();
    let size = 0;

    // TODO: do this better!
    const itemStepId = this.opPlan.dangerouslyGetStep(this.itemStepId).id;
    assert.ok(
      itemStepId != null,
      "GraphileInternalError<b3a2bff9-15c6-47e2-aa82-19c862324f1a>: listItem layer plan has no rootStepId",
    );
    store[itemStepId] = [];

    // Prepare store with an empty list for each copyPlanId
    for (const planId of copyStepIds) {
      store[planId] = [];
      if (!bucket.store[planId]) {
        throw new Error(
          `GraphileInternalError<14f2b4c6-f951-44d6-ad6b-2eace3330b84>: plan '${planId}' (${this.layerPlan.operationPlan.dangerouslyGetStep(
            planId,
          )}) listed in copyStepIds but not available in parent bucket for ${this}`,
        );
      }
    }

    const listValues = values[this.listPlanDepId];

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
          store[itemStepId][newIndex] = list[j];
          for (const planId of copyStepIds) {
            store[planId][newIndex] = bucket.store[planId][originalIndex];
          }
        }
      }
    }

    if (size > 0) {
      const childBucket = newBucket({
        layerPlan: childLayerPlan,
        size,
        store,
        hasErrors: bucket.hasErrors,
        polymorphicPathList,
      });
      await executeBucket(childBucket, extra._requestContext);
    }

    const depResults = store[childLayerPlan.rootStepId!];

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
      const values = indexes.map((idx) => depResults[idx]);
      if (isDev) {
        assert.strictEqual(
          list.length,
          values.length,
          "GraphileInternalError<c85b6936-d406-4801-9c6b-625a567d32ff>: The list and values length must match for a __ListTransformStep",
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
 * A "special" plan that has custom handling in Crystal. Used for turning lists
 * into other things (or maybe more lists!).
 *
 * {@page ~dataplanner/steps/listTransform.md}
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
