import type { InputPlan } from "../input";
import type { CrystalResultsList, CrystalValuesList } from "../interfaces";
import { ExecutablePlan } from "../plan";

export interface PageInfoCapablePlan extends ExecutablePlan<any> {
  hasNextPage(): ExecutablePlan<boolean>;
  hasPreviousPage(): ExecutablePlan<boolean>;
}

export interface ConnectionCapablePlan<
  T extends ReadonlyArray<any> = ReadonlyArray<any>,
> extends ExecutablePlan<T> {
  clone(...args: any[]): ConnectionCapablePlan<any>; // TODO: `this`
  pageInfo(): PageInfoCapablePlan;
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

  public setFirst($firstPlan: InputPlan) {
    if (this._firstId) {
      throw new Error(`${this}->setFirst already called`);
    }
    this._firstId = $firstPlan.id;
  }
  public setLast($lastPlan: InputPlan) {
    if (this._lastId) {
      throw new Error(`${this}->setLast already called`);
    }
    this._lastId = $lastPlan.id;
  }
  public setOffset($offsetPlan: InputPlan) {
    if (this._offsetId) {
      throw new Error(`${this}->setOffset already called`);
    }
    this._offsetId = $offsetPlan.id;
  }
  public setBefore($beforePlan: InputPlan) {
    if (this._beforeId) {
      throw new Error(`${this}->setBefore already called`);
    }
    this._beforeId = $beforePlan.id;
  }
  public setAfter($afterPlan: InputPlan) {
    if (this._afterId) {
      throw new Error(`${this}->setAfter already called`);
    }
    this._afterId = $afterPlan.id;
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

    if (this._beforeId) {
      clonedPlan.setBefore(this.getPlan(this._beforeId) as InputPlan);
    }
    if (this._afterId) {
      clonedPlan.setAfter(this.getPlan(this._afterId) as InputPlan);
    }
    if (this._firstId) {
      clonedPlan.setFirst(this.getPlan(this._firstId) as InputPlan);
    }
    if (this._lastId) {
      clonedPlan.setLast(this.getPlan(this._lastId) as InputPlan);
    }
    if (this._offsetId) {
      clonedPlan.setOffset(this.getPlan(this._offsetId) as InputPlan);
    }

    return clonedPlan;
  }

  public pageInfo() {
    const plan = this.getPlan(this.subplanId) as TPlan;
    return plan.clone().pageInfo();
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
