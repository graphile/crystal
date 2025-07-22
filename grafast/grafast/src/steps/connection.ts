import * as assert from "../assert.js";
import type {
  ExecutionDetails,
  FieldArgs,
  GrafastResultsList,
  Maybe,
  UnbatchedExecutionExtra,
} from "../interfaces.js";
import type { Step } from "../step.js";
import { UnbatchedStep } from "../step.js";
import { arrayOfLength } from "../utils.js";
import { access } from "./access.js";
import { constant, ConstantStep } from "./constant.js";
import { each } from "./each.js";
import { lambda } from "./lambda.js";

type ParametersExceptFirst<F> = F extends (arg0: any, ...rest: infer R) => any
  ? R
  : never[];

/**
 * Indicates which features are supported for pagination; support for `limit`
 * is assumed even in the case of an empty object. Features unsupported can be
 * emulated by the `connection()` step (but this is less efficient than
 * handling it yourself).
 */
export interface PaginationFeatures {
  /**
   * If you want to support reverse pagination, supporting `reverse` is vital.
   * Without it, we must fetch the entire collection (no limit, offset, or
   * cursor) in order to access the last entries. To support `reverse`, all you
   * need to do is fetch in the inverse order. It is recommended that if you do
   * not support `reverse` that you do not expose the reverse pagination
   * arguments (`before` and `last`) as part of a GraphQL schema.
   */
  reverse?: boolean;

  /**
   * If you support cursor pagination you must provide a
   * `.cursorForItem($item, $index)` method that returns the cursor to use for
   * the given item, and we will assume yout support (and you must support) the
   * `after` parameter in `PaginationParams`.
   */
  cursor?: boolean;

  /**
   * If you support offset pagination, set this to true. If you also set
   * `cursor` to true, then the offset must apply _from_ the cursor; if you do
   * not support combining `offset` and `cursor` together then you should set
   * `offset` to false (and raise an issue so we can add new options for that).
   */
  offset?: boolean;
}

export interface PaginationParams<TCursorValue = string> {
  /**
   * Fetch only this many rows. If null, apply no limit.
   */
  limit: number | null;

  /**
   * Skip this many rows; only provided if `paginationSupport.offset` is `true`.
   *
   * If `after` is set, the offset applies after the `after`.
   */
  offset?: number | null;

  /**
   * A cursor representing the "exclusive lower bound" for the results -
   * skip over anything up to and including this cursor. Only provided if
   * `paginationSupport.cursor` is `true`.
   *
   * Note: if `reverse` is set, this applies after the collection has been
   * reversed (i.e. if `reverse` is true then `after` is equivalent to the
   * `before` argument exposed through GraphQL.
   */
  after?: TCursorValue | null;

  /**
   * If we're paginating backwards then the collection should be reversed
   * before applying the limit, offset and after. Only provided if
   * `paginationSupport.cursor` is `true`.
   */
  reverse?: boolean;
}

/**
 * Describes what a plan may implement for ConnectionStep to be able to
 * utilise it in the most optimal way.
 *
 * Every part of this is optional, but:
 *
 * - `paginationSupport` should be set (even an empty object) if your data
 *   source supports setting a limit
 * - `paginationSupport.reverse` should be implemented if you plan to support
 *   reverse pagination (`before`, `last` arguments in GraphQL pagination)
 * - either `paginationSupport.offset` or `paginationSupport.cursor` are
 *   highly recommended for efficiency
 *
 * Be sure to read the documentation of the features you indicate support for!
 *
 * @param TItemStep - Represents an item in the collection, typically equivalent to an _edge_.
 * @param TNodeStep - A derivative of TItemStep that represents the _node_ itself. Defaults to TItemStep.
 * @param TCursorValue - If your step wants us to parse the cursor for you, the result of the parse. Useful for throwing an error before the fetch if the cursor is invalid.
 */
export interface ConnectionCapableStep<
  TItemStep extends Step = Step,
  TNodeStep extends Step = TItemStep,
  TCursorValue = string,
> extends Step {
  /**
   * If set, we assume that you support at least `limit` pagination, even on an
   * empty object.
   *
   * Must not be set without also implementing `applyPagination`.
   */
  paginationSupport?: PaginationFeatures;

  /**
   * Receives the pagination parameters that were declared to be supported by
   * `paginationSupport`.
   *
   * Must not be implemented without also adding `paginationSupport`.
   */
  applyPagination?($params: Step<PaginationParams<TCursorValue>>): void;

  /**
   * Optionally implement this and we will parse the cursor for you before
   * handing it to `applyPagination`.
   *
   * Must not be added unless `paginationSupport.cursor` is `true`.
   */
  parseCursor?($cursor: Step<Maybe<string>>): Step<Maybe<TCursorValue>>;

  /**
   * Turn a value from the list into an item step
   */
  listItem?($item: Step<unknown>): TItemStep;

  /**
   * Given the $item and the $index, return a step representing the cursor.
   *
   * Must be implemented if and only if `paginationSupport.cursor` is `true`.
   */
  cursorForItem?($item: TItemStep): Step<string>;

  /**
   * If the `$item` represents an edge rather than the node, return the node to
   * use instead.
   */
  nodeForItem?($item: TItemStep): TNodeStep;

  /**
   * Clone the plan, ignoring the pagination parameters.
   *
   * Useful for implementing things like `totalCount` or aggregates.
   */
  connectionClone?(
    $connection: ConnectionStep<TItemStep, TNodeStep, TCursorValue, any>,
    ...args: any[]
  ): ConnectionCapableStep<TItemStep, TNodeStep, TCursorValue>; // TODO: `this`
}

const EMPTY_OBJECT = Object.freeze(Object.create(null));

interface ConnectionResult {
  items: ReadonlyArray<unknown>;
}

/**
 * Handles GraphQL cursor pagination in a standard and consistent way
 * indepdenent of data source.
 */
export class ConnectionStep<
  TItemStep extends Step,
  TNodeStep extends Step = TItemStep,
  TCursorValue = string,
  TCollectionStep extends ConnectionCapableStep<
    TItemStep,
    TNodeStep,
    TCursorValue
  > = ConnectionCapableStep<TItemStep, TNodeStep, TCursorValue>,
> extends UnbatchedStep<ConnectionResult | null> {
  static $$export = {
    moduleName: "grafast",
    exportName: "ConnectionStep",
  };
  isSyncAndSafe = true;

  private collectionDepId: number;

  // Pagination stuff
  private _firstDepId: number | null = null;
  private _lastDepId: number | null = null;
  private _offsetDepId: number | null = null;
  private _beforeDepId: number | null | undefined = undefined;
  private _afterDepId: number | null | undefined = undefined;

  private collectionPaginationSupport: PaginationFeatures | null;

  // TYPES: if subplan is `ConnectionCapableStep<EdgeCapableStep<any>>` then `nodePlan`/`cursorPlan` aren't needed; otherwise `cursorPlan` is required.
  constructor(subplan: TCollectionStep) {
    super();
    this.collectionDepId = this.addDependency(subplan);
    this.collectionPaginationSupport = subplan.paginationSupport ?? null;
  }

  public toStringMeta(): string {
    return String(this.getDepOptions(this.collectionDepId).step.id);
  }

  public getFirst(): Step<number | null | undefined> | null {
    return this.maybeGetDep<Step<number | null | undefined>>(this._firstDepId);
  }
  public setFirst(first: Step<number | null | undefined> | number) {
    if (this._firstDepId != null) {
      throw new Error(`${this}->setFirst already called`);
    }
    const $first = typeof first === "number" ? constant(first) : first;
    this._firstDepId = this.addUnaryDependency({
      step: $first,
      nonUnaryMessage: () =>
        `${this}.setFirst(...) must be passed a _unary_ step, but ${$first} is not unary. See: https://err.red/gud#connection`,
    });
  }
  public getLast(): Step<number | null | undefined> | null {
    return this.maybeGetDep<Step<number | null | undefined>>(this._lastDepId);
  }
  public setLast(last: Step<number | null | undefined> | number) {
    if (this._lastDepId != null) {
      throw new Error(`${this}->setLast already called`);
    }
    const $last = typeof last === "number" ? constant(last) : last;
    this._lastDepId = this.addUnaryDependency({
      step: $last,
      nonUnaryMessage: () =>
        `${this}.setLast(...) must be passed a _unary_ step, but ${$last} is not unary. See: https://err.red/gud#connection`,
    });
  }
  public getOffset(): Step<number | null | undefined> | null {
    return this.maybeGetDep<Step<number | null | undefined>>(this._offsetDepId);
  }
  public setOffset(offset: Step<number | null | undefined> | number) {
    if (this._offsetDepId != null) {
      throw new Error(`${this}->setOffset already called`);
    }
    const $offset = typeof offset === "number" ? constant(offset) : offset;
    this._offsetDepId = this.addUnaryDependency({
      step: $offset,
      nonUnaryMessage: () =>
        `${this}.setOffset(...) must be passed a _unary_ step, but ${$offset} is not unary. See: https://err.red/gud#connection`,
    });
  }
  public getBefore(): Step<Maybe<TCursorValue>> | null {
    return this.maybeGetDep<Step<Maybe<TCursorValue>>>(this._beforeDepId, true);
  }
  public setBefore($beforePlan: Step<Maybe<string>>) {
    if ($beforePlan instanceof ConstantStep && $beforePlan.data == null) {
      return;
    }
    if (this._beforeDepId !== undefined) {
      throw new Error(`${this}->setBefore already called`);
    }
    const $parsedBeforePlan =
      this.getSubplan().parseCursor?.($beforePlan) ?? $beforePlan;
    this._beforeDepId = this.addUnaryDependency({
      step: $parsedBeforePlan,
      nonUnaryMessage: () =>
        `${this}.setBefore(...) must be passed a _unary_ step, but ${$parsedBeforePlan} (and presumably ${$beforePlan}) is not unary. See: https://err.red/gud#connection`,
    });
  }
  public getAfter(): Step<Maybe<TCursorValue>> | null {
    return this.maybeGetDep<Step<Maybe<TCursorValue>>>(this._afterDepId, true);
  }
  public setAfter($afterPlan: Step<Maybe<string>>) {
    if ($afterPlan instanceof ConstantStep && $afterPlan.data == null) {
      return;
    }
    if (this._afterDepId !== undefined) {
      throw new Error(`${this}->setAfter already called`);
    }
    const $parsedAfterPlan =
      this.getSubplan().parseCursor?.($afterPlan) ?? $afterPlan;
    this._afterDepId = this.addUnaryDependency({
      step: $parsedAfterPlan,
      nonUnaryMessage: () =>
        `${this}.setAfter(...) must be passed a _unary_ step, but ${$parsedAfterPlan} (and presumably ${$afterPlan}) is not unary. See: https://err.red/gud#connection`,
    });
  }

  public getSubplan(): TCollectionStep {
    return this.getDepOptions(this.collectionDepId).step as TCollectionStep;
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
    ...args: ParametersExceptFirst<TCollectionStep["connectionClone"]>
  ): TCollectionStep {
    if (!this.isArgumentsFinalized) {
      throw new Error(
        "Forbidden to call ConnectionStep.nodes before arguments finalize",
      );
    }
    const plan = this.getSubplan();
    if (typeof plan.connectionClone !== "function") {
      throw new Error(`${plan} does not support cloning the subplan`);
    }
    const clonedPlan = plan.connectionClone(this, ...args) as TCollectionStep;
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
    // TYPES: ugh. The `|[]` shouldn't be needed.
    ...args: ParametersExceptFirst<TCollectionStep["connectionClone"]> | []
  ): TCollectionStep {
    const clonedPlan = this.cloneSubplanWithoutPagination(...(args as any));
    if (typeof clonedPlan.applyPagination === "function") {
      clonedPlan.applyPagination(this.paginationParams());
    }
    return clonedPlan;
  }

  public paginationParams() {
    const step = this.getSubplan();
    return new ConnectionParamsStep(step.paginationSupport, {
      before: this.getBefore(),
      after: this.getAfter(),
      first: this.getFirst(),
      last: this.getLast(),
      offset: this.getOffset(),
    });
  }

  /**
   * Subplans may call this from their `setBefore`/`setAfter`/etc plans in order
   * to add a dependency to us, which is typically useful for adding validation
   * functions so that they are thrown "earlier", avoiding error bubbling.
   */
  public addValidation(callback: () => Step) {
    this.withMyLayerPlan(() => {
      this.addDependency(callback());
    });
  }

  public get(fieldName: string) {
    switch (fieldName) {
      case "edges":
        return this.edges();
      case "nodes":
        return this.nodes();
      case "pageInfo":
        return this.pageInfo();
      default:
        return constant(undefined);
    }
  }

  public nodePlan = ($rawItem: Step<unknown>, _$index: Step<number>) => {
    const subplan = this.getSubplan();
    const $item = subplan.listItem?.($rawItem) ?? ($rawItem as TItemStep);
    if (typeof subplan.nodeForItem === "function") {
      return subplan.nodeForItem($item);
    } else {
      return $item as unknown as TNodeStep;
    }
  };

  public edgePlan = ($rawItem: Step<unknown>, $index: Step<number>) => {
    const subplan = this.getSubplan();
    const $item = subplan.listItem?.($rawItem) ?? ($rawItem as TItemStep);
    return new EdgeStep<TItemStep, TNodeStep>(this, $item, $index);
  };

  public edges(): Step {
    const $items = access(this, "items");
    return each($items, this.edgePlan);
  }

  public nodes() {
    const $items = access(this, "items");
    return each($items, this.nodePlan);
  }

  cursorPlan($item: TItemStep, $index: Step<number>) {
    const subplan = this.getSubplan();
    if (typeof subplan.cursorForItem === "function") {
      return subplan.cursorForItem($item);
    } else {
      return lambda($index, encodeNumericCursor);
    }
  }

  public pageInfo() {
    return new PageInfoStep(this);
  }

  public optimize() {
    /*
     * **IMPORTANT**: no matter the arguments, we cannot optimize ourself away
     * by replacing ourself with a constant because otherwise errors in
     * cursors/etc will be pushed down a level.
     */
    return this;
  }

  public execute({
    count,
    values,
    indexMap,
  }: ExecutionDetails): GrafastResultsList<ConnectionResult> {
    const collectionDep = values[this.collectionDepId];
    const first =
      this._firstDepId != null ? values[this._firstDepId].unaryValue() : null;
    const last =
      this._lastDepId != null ? values[this._lastDepId].unaryValue() : null;
    const offset =
      this._offsetDepId != null ? values[this._offsetDepId].unaryValue() : null;
    const before =
      this._beforeDepId != null ? values[this._beforeDepId].unaryValue() : null;
    const after =
      this._afterDepId != null ? values[this._afterDepId].unaryValue() : null;

    const isForwardPagination =
      first != null || after != null || (before == null && last == null);
    if (first != null && (!Number.isSafeInteger(first) || first < 0)) {
      throw new Error("Invalid 'first'");
    }
    if (last != null && (!Number.isSafeInteger(last) || last < 0)) {
      throw new Error("Invalid 'last'");
    }
    if (isForwardPagination && before != null) {
      throw new Error(
        `May not set both 'after' and 'before': please paginate only forwards or backwards.`,
      );
    }
    if (!isForwardPagination && offset != null) {
      throw new Error(`May not combine 'offset' with backward pagination.`);
    }

    let limit = null;
    let limitFromEnd = null;
    let sliceStart = 0;
    let alreadyReversed = false;
    if (isForwardPagination) {
      if (after != null) {
        // Assert: before == null
        if (this.collectionPaginationSupport?.cursor) {
          // Already applied
        } else {
          // Collection doesn't support cursors; we must be using numeric cursors
          sliceStart = decodeNumericCursor(after);
        }
      }
      if (offset != null) {
        if (this.collectionPaginationSupport?.offset) {
          // Already applied
        } else {
          sliceStart += offset;
        }
      }
      if (first != null) {
        limit = first;
      }
      if (last != null) {
        limitFromEnd = last;
      }
    } else {
      // Backward pagination
      if (this.collectionPaginationSupport?.reverse) {
        // Collection will have reversed the data
        alreadyReversed = true;
        if (before != null) {
          // Assert: after == null
          if (this.collectionPaginationSupport?.cursor) {
            // Already applied
          } else {
            // Collection doesn't support cursors; we must be using numeric cursors
            sliceStart = decodeNumericCursor(before);
          }
        }
      } else {
        // Collection doesn't support reversing the data, we must do everything ourselves
        sliceStart = decodeNumericCursor(before);
      }
      if (last != null) {
        limit = last;
      }
      if (first != null) {
        limitFromEnd = first;
      }
    }

    return indexMap((i) => {
      const collectionValue = collectionDep.at(i);
      // The value is either a list of items, or an object that contains the
      // `items` key.
      const list = Array.isArray(collectionValue)
        ? collectionValue
        : collectionValue?.items;
      if (list != null) {
        // Now we need to apply our pagination stuff to it
        let items = list as ReadonlyArray<unknown>;
        let sliced = false;
        const diy = !isForwardPagination && !alreadyReversed;
        if (diy) {
          sliced = true;
          items = [...items].reverse();
        }
        if (sliceStart > 0 || limit != null) {
          sliced = true;
          items = items.slice(
            sliceStart,
            limit != null ? sliceStart + limit : items.length,
          );
        }
        if (limitFromEnd != null && limitFromEnd < items.length) {
          sliced = true;
          items = items.slice(items.length - limitFromEnd);
        }
        if (alreadyReversed || diy) {
          items = (sliced ? (items as Array<unknown>) : [...items]).reverse();
        }

        return {
          pageInfo: {
            startCursor,
            endCursor,
            hasNextPage,
            hasPreviousPage,
          },
          items,
        };
      } else {
        return null;
      }
    });
  }

  public unbatchedExecute() {
    return EMPTY_OBJECT;
  }
}

export interface EdgeCapableStep<TNodeStep extends Step> extends Step {
  node(): TNodeStep;
  cursor(): Step<string | null>;
}

export function assertEdgeCapableStep<TNodeStep extends Step>(
  $step: Step | EdgeCapableStep<TNodeStep>,
): asserts $step is EdgeCapableStep<TNodeStep> {
  const $typed = $step as Step & {
    node?: any;
    cursor?: any;
  };
  if (
    typeof $typed.node !== "function" ||
    typeof $typed.cursor !== "function"
  ) {
    throw new Error(`Expected a EdgeCapableStep, but found '${$step}'`);
  }
}

export class EdgeStep<TItemStep extends Step, TNodeStep extends Step = Step>
  extends UnbatchedStep
  implements EdgeCapableStep<TNodeStep>
{
  static $$export = {
    moduleName: "grafast",
    exportName: "EdgeStep",
  };
  isSyncAndSafe = true;

  private readonly cursorDepId: number | null;
  private connectionRefId: number | null;
  private needCursor = false;

  constructor(
    $connection: ConnectionStep<TItemStep, TNodeStep, any, any>,
    $item: TItemStep,
    $index: Step<number>,
  ) {
    super();
    const itemDepId = this.addDependency($item);
    const indexDepId = this.addDependency($index);
    assert.strictEqual(
      itemDepId,
      0,
      "GrafastInternalError<89cc75cd-ccaf-4b7e-873f-a629c36d55f7>: item must be first dependency",
    );
    assert.strictEqual(
      indexDepId,
      1,
      "GrafastInternalError<cfed94c3-f2f0-41e7-a05e-bd514f31e55c>: index must be second dependency",
    );
    this.connectionRefId = this.addRef($connection);
  }

  public get(fieldName: string) {
    switch (fieldName) {
      case "node":
        return this.node();
      case "cursor":
        return this.cursor();
      default:
        return constant(undefined);
    }
  }

  private getConnectionStep() {
    return this.getRef(this.connectionRefId) as ConnectionStep<
      TItemStep,
      TNodeStep,
      any,
      any
    >;
  }

  private getItemStep() {
    // We know we're not using flags
    return this.getDepOptions<TItemStep>(0).step;
  }
  private getIndexStep() {
    // We know we're not using flags
    return this.getDepOptions<Step<number>>(0).step;
  }

  // public data(): TEdgeDataStep {
  //   const $item = this.getItemStep();
  //   return this.getConnectionStep().edgeDataPlan?.($item) ?? ($item as any);
  // }

  node(): TNodeStep {
    const $item = this.getItemStep();
    const $index = this.getIndexStep();
    return this.getConnectionStep().nodePlan($item, $index);
  }

  cursor(): Step<string | null> {
    this.needCursor = true;
    const $connection = this.getRef(this.connectionRefId);
    if (!($connection instanceof ConnectionStep)) {
      throw new Error(`Expected ${$connection} to be a ConnectionStep.`);
    }
    const $cursor = $connection.cursorPlan($item);
    this.cursorDepId = this.addDependency($cursor);
    assert.strictEqual(
      this.cursorDepId,
      1,
      "GrafastInternalError<46e4b5ca-0c11-4737-973d-0edd0be060c9>: cursor must be second dependency",
    );

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

  unbatchedExecute(
    _extra: UnbatchedExecutionExtra,
    record: any,
    cursor: any,
  ): any {
    // Handle nulls; everything else comes from the child plans
    return record == null && (this.cursorDepId == null || cursor == null)
      ? null
      : EMPTY_OBJECT;
  }
}

let warned = false;

interface ConnectionParams {
  fieldArgs?: FieldArgs;
}

/**
 * Wraps a collection fetch to provide the utilities for working with GraphQL
 * cursor connections.
 */
export function connection<
  TItemStep extends Step,
  TCursorStep extends Step,
  TStep extends ConnectionCapableStep<TItemStep, TCursorStep>,
  TEdgeDataStep extends Step = TItemStep,
  TNodeStep extends Step = Step,
>(
  step: TStep,
  params?: ConnectionParams<TItemStep, TEdgeDataStep, TNodeStep>,
): ConnectionStep<TItemStep, TCursorStep, TStep, TEdgeDataStep, TNodeStep> {
  if (typeof params === "function") {
    if (!warned) {
      warned = true;
      console.warn(
        `The call signature for connection() has changed, arguments after the first argument should be specified via a config object`,
      );
    }
    return connection(step, {
      // eslint-disable-next-line prefer-rest-params
      nodePlan: arguments[1] as any,
      // eslint-disable-next-line prefer-rest-params
      cursorPlan: arguments[2] as any,
    });
  }
  const $connection = new ConnectionStep<
    TItemStep,
    TCursorStep,
    TStep,
    TEdgeDataStep,
    TNodeStep
  >(step, params);
  const fieldArgs = params?.fieldArgs;
  if (fieldArgs) {
    const { $first, $last, $before, $after, $offset } = fieldArgs;
    // Connections may have a mixture of these arguments, so we must check each exists
    if ($first) $connection.setFirst($first);
    if ($last) $connection.setLast($last);
    if ($before) $connection.setBefore($before);
    if ($after) $connection.setAfter($after);
    if ($offset) $connection.setOffset($offset);
  }
  return $connection;
}

export type ItemsStep<
  T extends Step<readonly any[]> | ConnectionCapableStep<any, any>,
> = T extends ConnectionCapableStep<any, any> ? ReturnType<T["items"]> : T;

export function itemsOrStep<
  T extends Step<readonly any[]> | ConnectionCapableStep<any, any>,
>($step: T): Step<readonly any[]> {
  return "items" in $step && typeof $step.items === "function"
    ? $step.items()
    : $step;
}

function encodeNumericCursor(index: number): string {
  return Buffer.from(String(index), "utf8").toString("base64");
}
function decodeNumericCursor(cursor: string): number {
  const i = parseInt(Buffer.from(cursor, "base64").toString("utf8"), 10);
  if (!Number.isSafeInteger(i) || i < 0) {
    throw new Error(`Invalid cursor`);
  }
  return i;
}
