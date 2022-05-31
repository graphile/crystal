import type { InputPlan } from "../input.js";
import type { CrystalResultsList, CrystalValuesList } from "../interfaces.js";
import { ExecutablePlan } from "../plan.js";
import { arrayOfLength } from "../utils.js";
import { each } from "./each.js";

type ParametersExceptFirst<F> = F extends (arg0: any, ...rest: infer R) => any
  ? R
  : never[];

/**
 * Describes what a plan needs to implement in order to be suitable for
 * supplying what the `PageInfo` type requires.
 */
export interface PageInfoCapablePlan extends ExecutablePlan<any> {
  hasNextPage(): ExecutablePlan<boolean>;
  hasPreviousPage(): ExecutablePlan<boolean>;
  startCursor(): ExecutablePlan<string | null>;
  endCursor(): ExecutablePlan<string | null>;
}

/**
 * Describes what a plan needs to implement in order to be suitable for
 * supplying what a ConnectionPlan requires.
 */
export interface ConnectionCapablePlan<
  TItemPlan extends ExecutablePlan<any>,
  TCursorPlan extends ExecutablePlan<any>,
> extends ExecutablePlan<
    ReadonlyArray<TItemPlan extends ExecutablePlan<infer U> ? U : any>
  > {
  /**
   * Clone the plan; it's recommended that you add `$connection` as a
   * dependency so that you can abort execution early in the case of errors
   * (e.g. if the cursors cannot be parsed).
   */
  connectionClone(
    $connection: ConnectionPlan<TItemPlan, TCursorPlan, any, any>,
    ...args: any[]
  ): ConnectionCapablePlan<TItemPlan, TCursorPlan>; // TODO: `this`
  pageInfo(
    $connection: ConnectionPlan<
      TItemPlan,
      TCursorPlan,
      ConnectionCapablePlan<TItemPlan, TCursorPlan>,
      any
    >,
  ): PageInfoCapablePlan;
  setFirst($plan: InputPlan): void;
  setLast($plan: InputPlan): void;
  setOffset($plan: InputPlan): void;

  parseCursor($plan: InputPlan): TCursorPlan | null | undefined;
  setBefore($plan: TCursorPlan): void;
  setAfter($plan: TCursorPlan): void;
}

const EMPTY_OBJECT = Object.freeze(Object.create(null));

/**
 * Handles GraphQL cursor pagination in a standard and consistent way
 * indepdenent of data source.
 */
export class ConnectionPlan<
  TItemPlan extends ExecutablePlan<any>,
  TCursorPlan extends ExecutablePlan<any>,
  TPlan extends ConnectionCapablePlan<TItemPlan, TCursorPlan>,
  TNodePlan extends ExecutablePlan<any> = ExecutablePlan<any>,
> extends ExecutablePlan<unknown> {
  static $$export = {
    moduleName: "dataplanner",
    exportName: "ConnectionPlan",
  };
  isSyncAndSafe = true;

  private subplanId: string;

  // Pagination stuff
  private _firstDepId: number | null = null;
  private _lastDepId: number | null = null;
  private _offsetDepId: number | null = null;
  private _beforeDepId: number | null | undefined = undefined;
  private _afterDepId: number | null | undefined = undefined;

  // TODO:TS: if subplan is `ConnectionCapablePlan<EdgeCapablePlan<any>>` then `itemPlan`/`cursorPlan` aren't needed; otherwise `cursorPlan` is required.
  constructor(
    subplan: TPlan,
    public readonly itemPlan?: ($item: TItemPlan) => TNodePlan,
    public readonly cursorPlan?: (
      $item: TItemPlan,
    ) => ExecutablePlan<string | null> | undefined,
  ) {
    super();
    if (!cursorPlan) {
      // TODO: Assert that the `itemPlan` has a `.cursor()` method.
    }
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
  public getBefore(): TCursorPlan | null {
    return this._beforeDepId != null
      ? (this.getDep(this._beforeDepId) as TCursorPlan)
      : null;
  }
  public setBefore($beforePlan: InputPlan) {
    if (this._beforeDepId !== undefined) {
      throw new Error(`${this}->setBefore already called`);
    }
    const $parsedBeforePlan = this.getSubplan().parseCursor($beforePlan);
    this._beforeDepId = $parsedBeforePlan
      ? this.addDependency($parsedBeforePlan)
      : null;
  }
  public getAfter(): TCursorPlan | null {
    return this._afterDepId != null
      ? (this.getDep(this._afterDepId) as TCursorPlan)
      : null;
  }
  public setAfter($afterPlan: InputPlan) {
    if (this._afterDepId !== undefined) {
      throw new Error(`${this}->setAfter already called`);
    }
    const $parsedAfterPlan = this.getSubplan().parseCursor($afterPlan);
    this._afterDepId = $parsedAfterPlan
      ? this.addDependency($parsedAfterPlan)
      : null;
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
    ...args: ParametersExceptFirst<TPlan["connectionClone"]>
  ): TPlan {
    if (!this.isArgumentsFinalized) {
      throw new Error(
        "Forbidden to call ConnectionPlan.nodes before arguments finalize",
      );
    }
    const plan = this.getPlan(this.subplanId) as TPlan;
    const clonedPlan = plan.connectionClone(this, ...args) as TPlan;
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
    // TODO:TS: ugh. The `|[]` shouldn't be needed.
    ...args: ParametersExceptFirst<TPlan["connectionClone"]> | []
  ): TPlan {
    const clonedPlan = this.cloneSubplanWithoutPagination(...(args as any));

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

  public edges() {
    if (this.cursorPlan || this.itemPlan) {
      return each(this.cloneSubplanWithPagination(), ($intermediate) =>
        this.wrapEdge($intermediate as any),
      );
    } else {
      // Assuming the subplan is an EdgeCapablePlan
      return this.cloneSubplanWithPagination();
    }
  }

  public nodes() {
    if (this.itemPlan) {
      return each(this.cloneSubplanWithPagination(), ($intermediate) =>
        this.itemPlan!($intermediate as any),
      );
    } else {
      return this.cloneSubplanWithPagination();
    }
  }

  public wrapEdge(
    $edge: TItemPlan,
  ): EdgePlan<TItemPlan, TCursorPlan, TPlan, TNodePlan> {
    return new EdgePlan(this, $edge);
  }

  public pageInfo(): PageInfoCapablePlan {
    const plan = this.getPlan(this.subplanId) as TPlan;
    return plan.pageInfo(this);
  }

  /*

  **IMPORTANT**: we cannot optimize this by replacing ourself with a constant
  because otherwise errors in cursors/etc will be pushed down a level.

  public optimize() {
    return constant(EMPTY_OBJECT);
  }
  */

  public execute(
    values: Array<CrystalValuesList<any>>,
  ): CrystalResultsList<Record<string, never>> {
    // Fake execution; data actually comes from the child plans
    return arrayOfLength(values[0].length, EMPTY_OBJECT);
  }
}

export interface EdgeCapablePlan<TNodePlan extends ExecutablePlan<any>>
  extends ExecutablePlan<any> {
  node(): TNodePlan;
  cursor(): ExecutablePlan<string | null>;
}

export class EdgePlan<
    TItemPlan extends ExecutablePlan<any>,
    TCursorPlan extends ExecutablePlan<any>,
    TPlan extends ConnectionCapablePlan<TItemPlan, TCursorPlan>,
    TNodePlan extends ExecutablePlan<any> = ExecutablePlan<any>,
  >
  extends ExecutablePlan
  implements EdgeCapablePlan<TNodePlan>
{
  static $$export = {
    moduleName: "dataplanner",
    exportName: "EdgePlan",
  };
  isSyncAndSafe = true;

  private connectionPlanId: string;

  constructor(
    $connection: ConnectionPlan<TItemPlan, TCursorPlan, TPlan, TNodePlan>,
    $item: TItemPlan,
  ) {
    super();
    this.connectionPlanId = $connection.id;
    this.addDependency($item);
  }

  private getConnectionPlan(): ConnectionPlan<
    TItemPlan,
    TCursorPlan,
    TPlan,
    TNodePlan
  > {
    return this.getPlan(this.connectionPlanId) as any;
  }

  private getItemPlan(): TItemPlan {
    return this.getDep(0) as any;
  }

  node(): TNodePlan {
    const $item = this.getItemPlan();
    return this.getConnectionPlan().itemPlan?.($item) ?? ($item as any);
  }

  cursor(): ExecutablePlan<string | null> {
    const $item = this.getItemPlan();
    const $cursor =
      this.getConnectionPlan().cursorPlan?.($item) ??
      ($item as ExecutablePlan & { cursor?: () => ExecutablePlan }).cursor?.();
    if ($cursor) {
      return $cursor;
    } else {
      throw new Error(`No cursor plan known for '${$item}'`);
    }
  }

  execute(values: Array<CrystalValuesList<any>>): CrystalResultsList<any> {
    // Fake execution; data actually comes from the child plans
    return arrayOfLength(values[0].length, EMPTY_OBJECT);
  }
}

/**
 * Wraps a collection fetch to provide the utilities for working with GraphQL
 * cursor connections.
 */
export function connection<
  TItemPlan extends ExecutablePlan<any>,
  TCursorPlan extends ExecutablePlan<any>,
  TPlan extends ConnectionCapablePlan<TItemPlan, TCursorPlan>,
  TNodePlan extends ExecutablePlan<any> = ExecutablePlan<any>,
>(
  plan: TPlan,
  itemPlan?: ($item: TItemPlan) => TNodePlan,
  cursorPlan?: ($item: TItemPlan) => ExecutablePlan<string | null>,
): ConnectionPlan<TItemPlan, TCursorPlan, TPlan, TNodePlan> {
  return new ConnectionPlan(plan, itemPlan, cursorPlan);
}
