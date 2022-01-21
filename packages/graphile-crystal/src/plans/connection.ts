import type { InputPlan } from "../input";
import type { CrystalResultsList, CrystalValuesList } from "../interfaces";
import { ExecutablePlan } from "../plan";

export interface PageInfoCapablePlan extends ExecutablePlan<any> {
  hasNextPage(): ExecutablePlan<boolean>;
  hasPreviousPage(): ExecutablePlan<boolean>;
  startCursor(): ExecutablePlan<string | null>;
  endCursor(): ExecutablePlan<string | null>;
}

export interface ConnectionCapablePlan<T = any>
  extends ExecutablePlan<ReadonlyArray<T>> {
  clone(...args: any[]): ConnectionCapablePlan<any>; // TODO: `this`
  pageInfo($connectionPlan: ConnectionPlan<any>): PageInfoCapablePlan;
  setFirst($plan: InputPlan): void;
  setLast($plan: InputPlan): void;
  setOffset($plan: InputPlan): void;
  setBefore($plan: InputPlan): void;
  setAfter($plan: InputPlan): void;
}

export class ConnectionPlan<
  TPlan extends ConnectionCapablePlan,
> extends ExecutablePlan<unknown> {
  static $$export = {
    moduleName: "graphile-crystal",
    exportName: "ConnectionPlan",
  };

  private subplanId: number;

  // Pagination stuff
  private _firstId: number | null = null;
  private _lastId: number | null = null;
  private _offsetId: number | null = null;
  private _beforeId: number | null = null;
  private _afterId: number | null = null;

  constructor(subplan: TPlan) {
    super();
    // This is a _soft_ reference to the plan; we're not adding it as a
    // dependency since we do not actually need it to execute; it's our
    // children that need access to it.
    this.subplanId = subplan.id;
  }

  public toStringMeta(): string {
    return String(this.subplanId);
  }

  public getFirst(): InputPlan | null {
    return this._firstId != null
      ? (this.getDep(this._firstId) as InputPlan)
      : null;
  }
  public setFirst($firstPlan: InputPlan) {
    if (this._firstId != null) {
      throw new Error(`${this}->setFirst already called`);
    }
    this._firstId = this.addDependency($firstPlan);
  }
  public getLast(): InputPlan | null {
    return this._lastId != null
      ? (this.getDep(this._lastId) as InputPlan)
      : null;
  }
  public setLast($lastPlan: InputPlan) {
    if (this._lastId != null) {
      throw new Error(`${this}->setLast already called`);
    }
    this._lastId = this.addDependency($lastPlan);
  }
  public getOffset(): InputPlan | null {
    return this._offsetId != null
      ? (this.getDep(this._offsetId) as InputPlan)
      : null;
  }
  public setOffset($offsetPlan: InputPlan) {
    if (this._offsetId != null) {
      throw new Error(`${this}->setOffset already called`);
    }
    this._offsetId = this.addDependency($offsetPlan);
  }
  public getBefore(): InputPlan | null {
    return this._beforeId != null
      ? (this.getDep(this._beforeId) as InputPlan)
      : null;
  }
  public setBefore($beforePlan: InputPlan) {
    if (this._beforeId != null) {
      throw new Error(`${this}->setBefore already called`);
    }
    this._beforeId = this.addDependency($beforePlan);
  }
  public getAfter(): InputPlan | null {
    return this._afterId != null
      ? (this.getDep(this._afterId) as InputPlan)
      : null;
  }
  public setAfter($afterPlan: InputPlan) {
    if (this._afterId != null) {
      throw new Error(`${this}->setAfter already called`);
    }
    this._afterId = this.addDependency($afterPlan);
  }

  /**
   * This should not be called after 'finalizeArguments' has been called.
   */
  public getSubplan(): TPlan {
    if (this.isArgumentsFinalized) {
      throw new Error(
        "Forbidden to call ConnectionPlan.getSubplan after arguments finalize",
      );
    }
    const plan = this.getPlan(this.subplanId) as TPlan;
    return plan;
  }

  /**
   * This represents the entire collection with conditions and ordering
   * applied, but without any pagination constraints (before, after, first,
   * last, offset) applied. It's useful for the following:
   *
   * - performing aggregates e.g. totalCount across the entire collection
   * - determining fields for pageInfo, e.g. is there a next/previous page
   *
   * This cannot be called before 'finalizeArguments' has been called.
   */
  public cloneSubplanWithoutPagination(
    ...args: Parameters<TPlan["clone"]>
  ): TPlan {
    if (!this.isArgumentsFinalized) {
      throw new Error(
        "Forbidden to call ConnectionPlan.nodes before arguments finalize",
      );
    }
    const plan = this.getPlan(this.subplanId) as TPlan;
    const clonedPlan = plan.clone(...args) as TPlan;
    return clonedPlan;
  }

  /**
   * This represents a single page from the collection - not only have
   * conditions and ordering been applied but we've also applied the pagination
   * constraints (before, after, first, last, offset). It's useful for
   * returning the actual edges and nodes of the connection.
   *
   * This cannot be called before 'finalizeArguments' has been called.
   */
  public cloneSubplanWithPagination(
    ...args: Parameters<TPlan["clone"]>
  ): TPlan {
    const clonedPlan = this.cloneSubplanWithoutPagination(...args);

    {
      const plan = this.getBefore();
      if (plan) {
        clonedPlan.setBefore(plan);
      }
    }
    {
      const plan = this.getAfter();
      if (plan) {
        clonedPlan.setAfter(plan);
      }
    }
    {
      const plan = this.getFirst();
      if (plan) {
        clonedPlan.setFirst(plan);
      }
    }
    {
      const plan = this.getLast();
      if (plan) {
        clonedPlan.setLast(plan);
      }
    }
    {
      const plan = this.getOffset();
      if (plan) {
        clonedPlan.setOffset(plan);
      }
    }

    return clonedPlan;
  }

  public pageInfo(): PageInfoCapablePlan {
    const plan = this.getPlan(this.subplanId) as TPlan;
    return plan.pageInfo(this);
  }

  public execute(
    values: CrystalValuesList<any[]>,
  ): CrystalResultsList<Record<string, never>> {
    return values.map(() => ({}));
  }
}

export function connection<TPlan extends ConnectionCapablePlan>(
  plan: TPlan,
): ConnectionPlan<TPlan> {
  return new ConnectionPlan(plan);
}
