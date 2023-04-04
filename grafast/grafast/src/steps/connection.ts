import * as assert from "../assert.js";
import type { InputStep } from "../input.js";
import type {
  ExecutionExtra,
  GrafastResultsList,
  GrafastValuesList,
} from "../interfaces.js";
import type { ExecutableStep } from "../step.js";
import { UnbatchedExecutableStep } from "../step.js";
import { arrayOfLength } from "../utils.js";
import { each } from "./each.js";

type ParametersExceptFirst<F> = F extends (arg0: any, ...rest: infer R) => any
  ? R
  : never[];

/**
 * Describes what a plan needs to implement in order to be suitable for
 * supplying what the `PageInfo` type requires.
 */
export interface PageInfoCapableStep extends ExecutableStep {
  hasNextPage(): ExecutableStep<boolean>;
  hasPreviousPage(): ExecutableStep<boolean>;
  startCursor(): ExecutableStep<string | null>;
  endCursor(): ExecutableStep<string | null>;
}

/**
 * Describes what a plan needs to implement in order to be suitable for
 * supplying what a ConnectionStep requires.
 */
export interface ConnectionCapableStep<
  TItemStep extends ExecutableStep,
  TCursorStep extends ExecutableStep,
> extends ExecutableStep<
    ReadonlyArray<TItemStep extends ExecutableStep<infer U> ? U : any>
  > {
  /**
   * Clone the plan; it's recommended that you add `$connection` as a
   * dependency so that you can abort execution early in the case of errors
   * (e.g. if the cursors cannot be parsed).
   */
  connectionClone(
    $connection: ConnectionStep<TItemStep, TCursorStep, any, any>,
    ...args: any[]
  ): ConnectionCapableStep<TItemStep, TCursorStep>; // TODO: `this`
  pageInfo(
    $connection: ConnectionStep<
      TItemStep,
      TCursorStep,
      ConnectionCapableStep<TItemStep, TCursorStep>,
      any
    >,
  ): PageInfoCapableStep;
  setFirst($plan: InputStep): void;
  setLast($plan: InputStep): void;
  setOffset($plan: InputStep): void;

  parseCursor($plan: InputStep): TCursorStep | null | undefined;
  setBefore($plan: TCursorStep): void;
  setAfter($plan: TCursorStep): void;
}

const EMPTY_OBJECT = Object.freeze(Object.create(null));

/**
 * Handles GraphQL cursor pagination in a standard and consistent way
 * indepdenent of data source.
 */
export class ConnectionStep<
  TItemStep extends ExecutableStep,
  TCursorStep extends ExecutableStep,
  TStep extends ConnectionCapableStep<TItemStep, TCursorStep>,
  TNodeStep extends ExecutableStep = ExecutableStep,
> extends UnbatchedExecutableStep<unknown> {
  static $$export = {
    moduleName: "grafast",
    exportName: "ConnectionStep",
  };
  isSyncAndSafe = true;

  private subplanId: number;

  // Pagination stuff
  private _firstDepId: number | null = null;
  private _lastDepId: number | null = null;
  private _offsetDepId: number | null = null;
  private _beforeDepId: number | null | undefined = undefined;
  private _afterDepId: number | null | undefined = undefined;

  // TODO:TS: if subplan is `ConnectionCapableStep<EdgeCapableStep<any>>` then `itemPlan`/`cursorPlan` aren't needed; otherwise `cursorPlan` is required.
  constructor(
    subplan: TStep,
    public readonly itemPlan?: ($item: TItemStep) => TNodeStep,
    public readonly cursorPlan?: (
      $item: TItemStep,
    ) => ExecutableStep<string | null> | undefined,
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

  public getFirst(): InputStep | null {
    return this._firstDepId != null
      ? (this.getDep(this._firstDepId) as InputStep)
      : null;
  }
  public setFirst($firstPlan: InputStep) {
    if (this._firstDepId != null) {
      throw new Error(`${this}->setFirst already called`);
    }
    this._firstDepId = this.addDependency($firstPlan);
  }
  public getLast(): InputStep | null {
    return this._lastDepId != null
      ? (this.getDep(this._lastDepId) as InputStep)
      : null;
  }
  public setLast($lastPlan: InputStep) {
    if (this._lastDepId != null) {
      throw new Error(`${this}->setLast already called`);
    }
    this._lastDepId = this.addDependency($lastPlan);
  }
  public getOffset(): InputStep | null {
    return this._offsetDepId != null
      ? (this.getDep(this._offsetDepId) as InputStep)
      : null;
  }
  public setOffset($offsetPlan: InputStep) {
    if (this._offsetDepId != null) {
      throw new Error(`${this}->setOffset already called`);
    }
    this._offsetDepId = this.addDependency($offsetPlan);
  }
  public getBefore(): TCursorStep | null {
    return this._beforeDepId != null
      ? (this.getDep(this._beforeDepId) as TCursorStep)
      : null;
  }
  public setBefore($beforePlan: InputStep) {
    if (this._beforeDepId !== undefined) {
      throw new Error(`${this}->setBefore already called`);
    }
    const $parsedBeforePlan = this.getSubplan().parseCursor($beforePlan);
    this._beforeDepId = $parsedBeforePlan
      ? this.addDependency($parsedBeforePlan)
      : null;
  }
  public getAfter(): TCursorStep | null {
    return this._afterDepId != null
      ? (this.getDep(this._afterDepId) as TCursorStep)
      : null;
  }
  public setAfter($afterPlan: InputStep) {
    if (this._afterDepId !== undefined) {
      throw new Error(`${this}->setAfter already called`);
    }
    const $parsedAfterPlan = this.getSubplan().parseCursor($afterPlan);
    this._afterDepId = $parsedAfterPlan
      ? this.addDependency($parsedAfterPlan)
      : null;
  }

  /**
   * This should not be called after the arguments have been finalized.
   */
  public getSubplan(): TStep {
    if (this.isArgumentsFinalized) {
      throw new Error(
        "Forbidden to call ConnectionStep.getSubplan after arguments finalize",
      );
    }
    const plan = this.getStep(this.subplanId) as TStep;
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
   * This cannot be called before the arguments have been finalized.
   */
  public cloneSubplanWithoutPagination(
    ...args: ParametersExceptFirst<TStep["connectionClone"]>
  ): TStep {
    if (!this.isArgumentsFinalized) {
      throw new Error(
        "Forbidden to call ConnectionStep.nodes before arguments finalize",
      );
    }
    const plan = this.getStep(this.subplanId) as TStep;
    const clonedPlan = plan.connectionClone(this, ...args) as TStep;
    return clonedPlan;
  }

  /**
   * This represents a single page from the collection - not only have
   * conditions and ordering been applied but we've also applied the pagination
   * constraints (before, after, first, last, offset). It's useful for
   * returning the actual edges and nodes of the connection.
   *
   * This cannot be called before the arguments have been finalized.
   */
  public cloneSubplanWithPagination(
    // TODO:TS: ugh. The `|[]` shouldn't be needed.
    ...args: ParametersExceptFirst<TStep["connectionClone"]> | []
  ): TStep {
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
      // Assuming the subplan is an EdgeCapableStep
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
    $edge: TItemStep,
  ): EdgeStep<TItemStep, TCursorStep, TStep, TNodeStep> {
    return new EdgeStep(this, $edge);
  }

  public pageInfo(): PageInfoCapableStep {
    const plan = this.getStep(this.subplanId) as TStep;
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
    values: Array<GrafastValuesList<any>>,
  ): GrafastResultsList<Record<string, never>> {
    // Fake execution; data actually comes from the child plans
    return arrayOfLength(values[0].length, EMPTY_OBJECT);
  }

  public unbatchedExecute() {
    return EMPTY_OBJECT;
  }
}

export interface EdgeCapableStep<TNodeStep extends ExecutableStep>
  extends ExecutableStep {
  node(): TNodeStep;
  cursor(): ExecutableStep<string | null>;
}

export class EdgeStep<
    TItemStep extends ExecutableStep,
    TCursorStep extends ExecutableStep,
    TStep extends ConnectionCapableStep<TItemStep, TCursorStep>,
    TNodeStep extends ExecutableStep = ExecutableStep,
  >
  extends UnbatchedExecutableStep
  implements EdgeCapableStep<TNodeStep>
{
  static $$export = {
    moduleName: "grafast",
    exportName: "EdgeStep",
  };
  isSyncAndSafe = true;

  private connectionDepId: number;
  private readonly cursorDepId: number | null;
  private needCursor = false;

  constructor(
    $connection: ConnectionStep<TItemStep, TCursorStep, TStep, TNodeStep>,
    $item: TItemStep,
    private skipCursor = false,
  ) {
    super();
    const itemDepId = this.addDependency($item);
    assert.strictEqual(
      itemDepId,
      0,
      "GrafastInternalError<89cc75cd-ccaf-4b7e-873f-a629c36d55f7>: item must be first dependency",
    );
    if (!skipCursor) {
      const $cursor =
        $connection.cursorPlan?.($item) ??
        (
          $item as ExecutableStep & { cursor?: () => ExecutableStep }
        ).cursor?.();
      if (!$cursor) {
        throw new Error(`No cursor plan known for '${$item}'`);
      }
      this.cursorDepId = this.addDependency($cursor);
      assert.strictEqual(
        this.cursorDepId,
        1,
        "GrafastInternalError<46e4b5ca-0c11-4737-973d-0edd0be060c9>: cursor must be second dependency",
      );
    } else {
      this.cursorDepId = null;
    }
    this.connectionDepId = this.addDependency($connection);
  }

  private getConnectionStep(): ConnectionStep<
    TItemStep,
    TCursorStep,
    TStep,
    TNodeStep
  > {
    return this.getDep(this.connectionDepId) as any;
  }

  private getItemStep(): TItemStep {
    return this.getDep(0) as any;
  }

  node(): TNodeStep {
    const $item = this.getItemStep();
    return this.getConnectionStep().itemPlan?.($item) ?? ($item as any);
  }

  cursor(): ExecutableStep<string | null> {
    this.needCursor = true;
    return this.getDep(this.cursorDepId!);
  }

  optimize() {
    if (!this.needCursor && this.cursorDepId !== null) {
      return new EdgeStep(this.getConnectionStep(), this.getItemStep(), true);
    }
    return this;
  }

  deduplicate(
    _peers: EdgeStep<any, any, any, any>[],
  ): EdgeStep<TItemStep, TCursorStep, TStep, TNodeStep>[] {
    return _peers;
  }

  deduplicatedWith(replacement: EdgeStep<any, any, any, any>) {
    if (this.needCursor) {
      replacement.needCursor = true;
    }
  }

  unbatchedExecute(extra: ExecutionExtra, record: any, cursor: any): any {
    // Handle nulls; everything else comes from the child plans
    return record == null && (this.cursorDepId == null || cursor == null)
      ? null
      : EMPTY_OBJECT;
  }
}

/**
 * Wraps a collection fetch to provide the utilities for working with GraphQL
 * cursor connections.
 */
export function connection<
  TItemStep extends ExecutableStep,
  TCursorStep extends ExecutableStep,
  TStep extends ConnectionCapableStep<TItemStep, TCursorStep>,
  TNodeStep extends ExecutableStep = ExecutableStep,
>(
  step: TStep,
  itemPlan?: ($item: TItemStep) => TNodeStep,
  cursorPlan?: ($item: TItemStep) => ExecutableStep<string | null>,
): ConnectionStep<TItemStep, TCursorStep, TStep, TNodeStep> {
  return new ConnectionStep(step, itemPlan, cursorPlan);
}
