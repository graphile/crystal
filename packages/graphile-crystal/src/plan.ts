import * as assert from "assert";
import chalk from "chalk";
import { Aether, GLOBAL_PATH, ROOT_PATH } from "./aether";
import {
  getCurrentAether,
  getCurrentParentPathIdentity,
  globalState,
} from "./global";
import { isDev, noop } from "./dev";
import { inspect } from "util";
import { GraphQLObjectType } from "graphql";
import {
  CrystalValuesList,
  CrystalResultsList,
  PromiseOrDirect,
} from "./interfaces";
import { crystalPrintPathIdentity } from "./utils";

function reallyAssertFinalized(plan: Plan): void {
  if (!plan.isFinalized) {
    throw new Error(
      "Plan is not finalized; did you forget to call super.finalize()?",
    );
  }
}

// Optimise this away in production.
export const assertFinalized = !isDev ? noop : reallyAssertFinalized;

export abstract class Plan<TData = any> {
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

  public readonly aether: Aether;
  public isFinalized = false;
  public readonly id: number;
  public readonly groupId: number;
  public parentPathIdentity: string;
  private createdWithParentPathIdentity: string;
  public debug = globalState.debug;

  constructor() {
    const aether = getCurrentAether();
    this.aether = aether;
    this.groupId = aether.groupId;
    this.parentPathIdentity = GLOBAL_PATH;
    this.createdWithParentPathIdentity = getCurrentParentPathIdentity();
    this.id = aether.plans.push(this) - 1;
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

  /**
   * This metadata will be merged into toString when referencing this plan.
   */
  public toStringMeta(): string | null {
    return null;
  }

  protected addDependency(plan: Plan): number {
    if (this.isFinalized) {
      throw new Error(
        "You cannot add a dependency after the plan is finalized.",
      );
    }
    if (isDev) {
      assert.ok(
        plan instanceof Plan,
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
  public abstract execute(
    values: CrystalValuesList<ReadonlyArray<any>>,
    meta: {},
  ): PromiseOrDirect<CrystalResultsList<TData>>;

  /**
   * Our chance to replace ourself with one of our peers.
   */
  public deduplicate(_peers: Plan[]): Plan {
    return this;
  }

  /**
   * Our chance to optimise the plan (which could go as far as to inline the
   * plan into the parent plan).
   */
  public optimize(): Plan {
    return this;
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

export type PolymorphicPlan = Plan & {
  planForType(objectType: GraphQLObjectType): Plan;
};

export type ArgumentPlan = Plan & {
  null(): void;
};
