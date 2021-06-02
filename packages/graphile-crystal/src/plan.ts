import * as assert from "assert";
import chalk from "chalk";
import type { GraphQLObjectType } from "graphql";
import { inspect } from "util";

import type { Aether } from "./aether";
import { GLOBAL_PATH } from "./constants";
import { isDev, noop } from "./dev";
import {
  getCurrentAether,
  getCurrentParentPathIdentity,
  globalState,
} from "./global";
import type {
  CrystalResultsList,
  CrystalValuesList,
  PromiseOrDirect,
} from "./interfaces";
import { crystalPrintPathIdentity } from "./utils";

function reallyAssertFinalized(plan: BasePlan): void {
  if (!plan.isFinalized) {
    throw new Error(
      "Plan is not finalized; did you forget to call super.finalize()?",
    );
  }
}

// Optimise this away in production.
export const assertFinalized = !isDev ? noop : reallyAssertFinalized;

/**
 * The base abstract plan type; you should not extend this directly - instead
 * use an ExecutablePlan (for use when planning output fields) or a
 * ModifierPlan (for use when planning arguments/input fields).
 *
 * @remarks
 *
 * Though it might seem that ModifierPlan should be used for all inputs
 * (arguments, input objects), this is not the case. When planning an output
 * field, all inputs to it (including arguments, parent plan, context, etc)
 * should be other executable plans. The only time that ModifierPlan is used is
 * when writing specific plans as part of the argument or input field
 * definitions themself; even in these cases the inputs to these plan resolvers
 * will be ExecutablePlans.
 */
export abstract class BasePlan {
  public readonly aether: Aether;
  public isFinalized = false;
  public debug = globalState.debug;
  public parentPathIdentity: string;
  protected readonly createdWithParentPathIdentity: string;

  constructor() {
    const aether = getCurrentAether();
    this.aether = aether;
    this.parentPathIdentity = GLOBAL_PATH;
    this.createdWithParentPathIdentity = getCurrentParentPathIdentity();
  }

  public toString(): string {
    const meta = this.toStringMeta();
    return chalk.bold.blue(
      `${this.constructor.name.replace(/Plan$/, "")}${
        meta != null && meta.length ? chalk.grey(`<${meta}>`) : ""
      }@${crystalPrintPathIdentity(this.parentPathIdentity)}`,
    );
  }

  /**
   * This metadata will be merged into toString when referencing this plan.
   */
  public toStringMeta(): string | null {
    return null;
  }

  public finalize(): void {
    if (!this.isFinalized) {
      this.isFinalized = true;
    } else {
      throw new Error(
        `Plan ${this} has already been finalized - do not call finalize from user code!`,
      );
    }
  }
}

/**
 * Executable plans are the plans associated with leaves on the GraphQL tree,
 * they must be able to execute to return values.
 */
export abstract class ExecutablePlan<TData = any> extends BasePlan {
  /**
   * The ids for plans this plan will need data from in order to execute. NOTE:
   * it's important we use the id and not the plan here otherwise when we swap
   * out plans during optimisation things will go awry.
   *
   * @internal
   */
  private readonly _dependencies: number[] = [];

  /**
   * The ids for plans this plan will need data from in order to execute.
   */
  public readonly dependencies: ReadonlyArray<number> = this._dependencies;

  /**
   * The ids for plans this plan might execute; e.g. in `BranchPlan`.  NOTE: it's important
   * we use the id and not the plan here otherwise when we swap out plans
   * during optimisation things will go awry.
   */
  private readonly _children: number[] = [];

  /**
   * The ids for plans this plan might execute; e.g. in `BranchPlan`.
   */
  public readonly children: ReadonlyArray<number> = this._children;

  public readonly id: number;
  public readonly groupId: number;

  constructor() {
    super();
    this.groupId = this.aether.groupId;
    this.id = this.aether.plans.push(this) - 1;
  }

  public toString(): string {
    const meta = this.toStringMeta();
    return chalk.bold.blue(
      `${this.constructor.name.replace(/Plan$/, "")}${
        meta != null && meta.length ? chalk.grey(`<${meta}>`) : ""
      }[${inspect(this.id, {
        colors: true,
      })}@${crystalPrintPathIdentity(this.parentPathIdentity)}]`,
    );
  }

  protected addDependency(plan: ExecutablePlan): number {
    if (this.isFinalized) {
      throw new Error(
        "You cannot add a dependency after the plan is finalized.",
      );
    }
    if (isDev) {
      assert.ok(
        plan instanceof ExecutablePlan,
        `Error occurred when adding dependency for '${this}', value passed was not a plan, it was '${inspect(
          plan,
        )}'`,
      );
    }
    /*
     * We set our actual parentPathIdentity to be the shortest parentPathIdentity of all
     * of our dependencies; this effectively means that we only care about list
     * boundaries (since __ListItemPlan opts out of this) which allows us to
     * optimise more plans.
     */
    if (plan.parentPathIdentity.length > this.parentPathIdentity.length) {
      this.parentPathIdentity = plan.parentPathIdentity;
      if (
        !this.createdWithParentPathIdentity.startsWith(this.parentPathIdentity)
      ) {
        throw new Error(
          `${this} was created in '${this.createdWithParentPathIdentity}' but we have a dependency on '${this.parentPathIdentity}' which is outside of this path.`,
        );
      }
    }
    return this._dependencies.push(plan.id) - 1;
  }

  /**
   * Our chance to replace ourself with one of our peers.
   */
  public deduplicate(_peers: ExecutablePlan[]): ExecutablePlan {
    return this;
  }

  /**
   * Our chance to optimise the plan (which could go as far as to inline the
   * plan into the parent plan).
   */
  public optimize(): ExecutablePlan {
    return this;
  }

  /**
   * This function will be called with a `values` list: an array of entries for
   * each incoming crystal object, where each entry in the array is a list of
   * the values retrieved from executing the plans in `this.dependencies` for
   * that crystal object.
   *
   * It must return a list with the same length as `values`, where each value
   * in the list relates to the result of executing this plan for the
   * corresponding entry in the `values` list.
   *
   * IMPORTANT: it is up to the execute function to cache/memoize results as
   * appropriate for performance, this can be done via the `meta` object.
   *
   * The `meta` object is an empty object stored to `crystalContext.metaByPlan`
   * that can be used to store anything this plan needs. We recommend that you
   * add attributes to meta for each purpose (e.g. use `meta.cache` for
   * memoizing results) so that you can expand your usage of meta in future.
   */
  abstract execute(
    values: CrystalValuesList<ReadonlyArray<any>>,
    meta: Record<string, unknown>,
  ): PromiseOrDirect<CrystalResultsList<TData>>;
}

export function isExecutablePlan<TData = any>(
  plan: BasePlan,
): plan is ExecutablePlan<TData> {
  return "execute" in plan && typeof (plan as any).execute === "function";
}

export function assertExecutablePlan<TData>(
  plan: BasePlan,
  pathIdentity: string,
): asserts plan is ExecutablePlan<TData> {
  if (!isExecutablePlan(plan)) {
    throw new Error(
      `The plan returned from '${pathIdentity}' should be an executable plan, but it does not implement the 'execute' method.`,
    );
  }
}

export type PolymorphicPlan = ExecutablePlan & {
  planForType(objectType: GraphQLObjectType): ExecutablePlan;
};

/**
 * Modifier plans modify their parent plan (which may be another ModifierPlan
 * or an ExecutablePlan). First they gather all the requirements from their
 * children (if any) being applied to them, then they apply themselves to their
 * parent plan. This application is done through the `apply()` method.
 *
 * Modifier plans do not use dependencies.
 */
export abstract class ModifierPlan<
  TParentPlan extends ExecutablePlan | ModifierPlan<any>,
> extends BasePlan {
  constructor(protected readonly parent: TParentPlan) {
    super();
  }

  abstract apply(): void;
}

export function isModifierPlan<
  TParentPlan extends ExecutablePlan | ModifierPlan<any>,
>(plan: BasePlan): plan is ModifierPlan<TParentPlan> {
  return "apply" in plan && typeof (plan as any).apply === "function";
}

export function assertModifierPlan<
  TParentPlan extends ExecutablePlan | ModifierPlan<any>,
>(
  plan: BasePlan,
  pathIdentity: string,
): asserts plan is ModifierPlan<TParentPlan> {
  if (!isModifierPlan(plan)) {
    throw new Error(
      `The plan returned from '${pathIdentity}' should be an modifier plan, but it does not implement the 'apply' method.`,
    );
  }
}
