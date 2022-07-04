import type { GraphQLNamedType, GraphQLOutputType } from "graphql";

import { getCurrentParentPathIdentity } from "../global.js";
import type { CrystalResultsList } from "../interfaces.js";
import type { ListCapableStep } from "../step.js";
import { ExecutableStep } from "../step.js";
import type { __ItemStep } from "./__item.js";

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
  isSyncAndSafe = true;

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
  public itemStepId: string | null = null;

  constructor(
    options: ListTransformOptions<TListStep, TDepsStep, TMemo, TItemStep>,
  ) {
    super();
    this.parentPathIdentity = getCurrentParentPathIdentity();
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
  }

  toStringMeta() {
    return this.meta;
  }

  getListStep(): TListStep {
    return this.getDep(this.listPlanDepId) as TListStep;
  }

  dangerouslyGetListPlan(): TListStep {
    return this.aether.dangerouslyGetStep(
      this.dependencies[this.listPlanDepId],
    ) as TListStep;
  }

  deduplicate(
    peers: __ListTransformStep<any, any, any, any>[],
  ): __ListTransformStep<TListStep, TDepsStep, TMemo, TItemStep> {
    for (const peer of peers) {
      if (
        peer.itemPlanCallback === this.itemPlanCallback &&
        peer.initialState === this.initialState &&
        peer.reduceCallback === this.reduceCallback &&
        peer.finalizeCallback === this.finalizeCallback &&
        peer.listItem === this.listItem
      ) {
        // TODO: We shouldn't return `peer` until we alias the replacement id in
        // aether.listTransformDependencyPlanIdByListTransformPlanIdByFieldPathIdentity.
        // Also `itemPlanIdByListTransformStepId`.
        //
        // return peer;
      }
    }
    return this;
  }

  // ListTransform plans must _NOT_ optimize away. They must persist.
  optimize() {
    return this;
  }

  finalize() {
    // __ListTransformStep must list all their child chain's external
    // dependencies as their own so that pluarility is correct for the
    // buckets.
    const transformDependencyStepId =
      this.aether.transformDependencyPlanIdByTransformStepId[this.id];
    const transformDependencyPlan = this.aether.dangerouslyGetStep(
      transformDependencyStepId,
    );

    const externalDependencies = new Set<ExecutableStep>();
    const listPlan = this.aether.dangerouslyGetStep(this.dependencies[0]);

    const recurse = (innerPlan: ExecutableStep): boolean => {
      if (innerPlan === listPlan) {
        return true;
      }
      let hasInternal = false;
      const externals = [];
      for (const depId of innerPlan.dependencies) {
        const dep = this.aether.dangerouslyGetStep(depId);
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
      const itemStepId = this.aether.itemPlanIdByListTransformStepId[this.id]!;
      const itemPlan = this.aether.dangerouslyGetStep(itemStepId);
      for (const dep of externalDependencies) {
        this.addDependency(dep);
        (itemPlan.dependencies as Array<string>).push(dep.id);
      }
    }
    return super.finalize();
  }

  execute(): CrystalResultsList<TMemo> {
    throw new Error(
      "__ListTransformStep must never execute, Crystal handles this internally",
    );
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
