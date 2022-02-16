import type { InputPlan } from "../input";
import type { CrystalResultsList, CrystalValuesList } from "../interfaces";
import { ExecutablePlan } from "../plan";
import { arrayOfLength } from "../utils";
import { constant } from "./constant";

export interface PageInfoCapablePlan extends ExecutablePlan<any> {
  hasNextPage(): ExecutablePlan<boolean>;
  hasPreviousPage(): ExecutablePlan<boolean>;
  startCursor(): ExecutablePlan<string | null>;
  endCursor(): ExecutablePlan<string | null>;
}

export interface ConnectionCapablePlan<TItemPlan extends ExecutablePlan<any>>
  extends ExecutablePlan<
    ReadonlyArray<TItemPlan extends ExecutablePlan<infer U> ? U : any>
  > {
  clone(...args: any[]): ConnectionCapablePlan<TItemPlan>; // TODO: `this`
  pageInfo(
    $connectionPlan: ConnectionPlan<
      TItemPlan,
      ConnectionCapablePlan<TItemPlan>,
      any
    >,
  ): PageInfoCapablePlan;
  setFirst($plan: InputPlan): void;
  setLast($plan: InputPlan): void;
  setOffset($plan: InputPlan): void;
  setBefore($plan: InputPlan): void;
  setAfter($plan: InputPlan): void;
}

const EMPTY_OBJECT = Object.freeze(Object.create(null));

export class ConnectionPlan<
  TItemPlan extends ExecutablePlan<any>,
  TPlan extends ConnectionCapablePlan<TItemPlan>,
  TNodePlan extends ExecutablePlan<any> = ExecutablePlan<any>,
> extends ExecutablePlan<unknown> {
  static $$export = {
    moduleName: "graphile-crystal",
    exportName: "ConnectionPlan",
  };
  sync = true;

  private subplanId: string;

  // Pagination stuff
  private _firstDepId: number | null = null;
  private _lastDepId: number | null = null;
  private _offsetDepId: number | null = null;
  private _beforeDepId: number | null = null;
  private _afterDepId: number | null = null;

  constructor(
    subplan: TPlan,
    public readonly itemPlan: ($item: TItemPlan) => TNodePlan,
    public readonly cursorPlan: (
      $item: TItemPlan,
    ) => ExecutablePlan<string | null>,
  ) {
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
    return this._firstDepId != null
      ? (this.getDep(this._firstDepId) as InputPlan)
      : null;
  }
  public setFirst($firstPlan: InputPlan) {
    if (this._firstDepId != null) {
      throw new Error(`${this}->setFirst already called`);
    }
    this._firstDepId = this.addDependency($firstPlan);
  }
  public getLast(): InputPlan | null {
    return this._lastDepId != null
      ? (this.getDep(this._lastDepId) as InputPlan)
      : null;
  }
  public setLast($lastPlan: InputPlan) {
    if (this._lastDepId != null) {
      throw new Error(`${this}->setLast already called`);
    }
    this._lastDepId = this.addDependency($lastPlan);
  }
  public getOffset(): InputPlan | null {
    return this._offsetDepId != null
      ? (this.getDep(this._offsetDepId) as InputPlan)
      : null;
  }
  public setOffset($offsetPlan: InputPlan) {
    if (this._offsetDepId != null) {
      throw new Error(`${this}->setOffset already called`);
    }
    this._offsetDepId = this.addDependency($offsetPlan);
  }
  public getBefore(): InputPlan | null {
    return this._beforeDepId != null
      ? (this.getDep(this._beforeDepId) as InputPlan)
      : null;
  }
  public setBefore($beforePlan: InputPlan) {
    if (this._beforeDepId != null) {
      throw new Error(`${this}->setBefore already called`);
    }
    this._beforeDepId = this.addDependency($beforePlan);
  }
  public getAfter(): InputPlan | null {
    return this._afterDepId != null
      ? (this.getDep(this._afterDepId) as InputPlan)
      : null;
  }
  public setAfter($afterPlan: InputPlan) {
    if (this._afterDepId != null) {
      throw new Error(`${this}->setAfter already called`);
    }
    this._afterDepId = this.addDependency($afterPlan);
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

  public wrapEdge($edge: TItemPlan): EdgePlan<TItemPlan, TPlan, TNodePlan> {
    return new EdgePlan(this, $edge);
  }

  public pageInfo(): PageInfoCapablePlan {
    const plan = this.getPlan(this.subplanId) as TPlan;
    return plan.pageInfo(this);
  }

  public execute(
    values: Array<CrystalValuesList<any>>,
  ): CrystalResultsList<Record<string, never>> {
    // Fake execution; data actually comes from the child plans
    return arrayOfLength(values[0].length, EMPTY_OBJECT);
  }
}

export class EdgePlan<
  TItemPlan extends ExecutablePlan<any>,
  TPlan extends ConnectionCapablePlan<TItemPlan>,
  TNodePlan extends ExecutablePlan<any> = ExecutablePlan<any>,
> extends ExecutablePlan {
  static $$export = {
    moduleName: "graphile-crystal",
    exportName: "EdgePlan",
  };
  sync = true;

  private connectionPlanId: string;

  constructor(
    $connection: ConnectionPlan<TItemPlan, TPlan, TNodePlan>,
    $item: TItemPlan,
  ) {
    super();
    this.connectionPlanId = $connection.id;
    this.addDependency($item);
  }

  getConnectionPlan(): ConnectionPlan<TItemPlan, TPlan, TNodePlan> {
    return this.getPlan(this.connectionPlanId) as any;
  }

  getItemPlan(): TItemPlan {
    return this.getDep(0) as any;
  }

  node(): TNodePlan {
    return this.getConnectionPlan().itemPlan(this.getItemPlan());
  }

  cursor(): ExecutablePlan<string | null> {
    return this.getConnectionPlan().cursorPlan(this.getItemPlan());
  }

  execute(values: Array<CrystalValuesList<any>>): CrystalResultsList<any> {
    // Fake execution; data actually comes from the child plans
    return arrayOfLength(values[0].length, EMPTY_OBJECT);
  }
}

export function connection<
  TItemPlan extends ExecutablePlan<any>,
  TPlan extends ConnectionCapablePlan<TItemPlan>,
  TNodePlan extends ExecutablePlan<any> = ExecutablePlan<any>,
>(
  plan: TPlan,
  itemPlan: ($item: TItemPlan) => TNodePlan,
  cursorPlan: ($item: TItemPlan) => ExecutablePlan<string | null>,
): ConnectionPlan<TItemPlan, TPlan, TNodePlan> {
  return new ConnectionPlan(plan, itemPlan, cursorPlan);
}
