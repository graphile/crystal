import { CrystalContext, CrystalWrappedData } from "./interfaces";

/**
 * A plan represents a method to fetch a "future value". Plans are mutable,
 * they may be mutated directly (via the methods they expose), or indirectly
 * (e.g. the optimisation phase might squash plans together, etc). They must
 * not be mutated after they are finalized.
 */
export abstract class Plan<TOutput> {
  private finalized = false;
  private dependencyCounter = 0;
  private dependencies: {
    [internalIdentifier: string]: Plan<any>;
  } = {};

  constructor() {}

  /**
   * Adds this plan as a dependency, returning an internal identifier (that
   * will not be rewritten) which we can use to refer to this plan.
   */
  protected addDependency(plan: Plan<any>): string {
    this.assertNotFinalized();
    const id = String(this.dependencyCounter++);
    this.dependencies[id] = plan;
    return id;
  }

  /**
   * Throws an error if the plan is already finalized. All subclasses must call
   * this before mutating the plan.
   */
  protected assertNotFinalized(): void {
    if (this.finalized) {
      throw new Error("Plan is  it cannot be modified");
    }
  }

  /**
   * Prevents any further modifications to this plan; use before cloning,
   * exporting, etc. Calling finalize multiple times is perfectly safe, it is
   * idempotent.
   */
  public finalize(): this {
    if (!this.finalized) {
      this.finalized = true;
    }
    return this;
  }

  /**
   * Crystal takes care of the batching; `eval` is then called with all the
   * values from the batch, and must return an array of results where each
   * entry in the results relates to the entry in the incoming values. In this
   * way, it's similar to DataLoader.
   */
  public abstract eval(
    crystal: CrystalContext,
    values: CrystalWrappedData[],
  ): Array<TOutput> | Promise<Array<TOutput>> | Array<Promise<TOutput>> | Promise<Array<Promise<TOutput>>>;
}
