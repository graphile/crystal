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
   * Skip this many rows. Always null unless `paginationSupport.offset` is `true`.
   *
   * If `after` is set, the offset applies after the `after`.
   */
  offset: number | null;

  /**
   * A cursor representing the "exclusive lower bound" for the results -
   * skip over anything up to and including this cursor. Always `null` unless
   * `paginationSupport.cursor` is `true`.
   *
   * Note: if `reverse` is `true`, this applies after the collection has been
   * reversed (i.e. if `reverse` is true then `after` is equivalent to the
   * `before` argument exposed through GraphQL.
   */
  after: TCursorValue | null;

  /**
   * If we're paginating backwards then the collection should be reversed
   * before applying the limit, offset and after. Always `false` unless
   * `paginationSupport.cursor` is `true`.
   */
  reverse: boolean;
}

/**
 * Describes what a plan may implement for ConnectionStep to be able to
 * utilise it in the most optimal way.
 *
 * Implementing this is optional, but:
 *
 * - `connectionClone` must be implemented if you want to support any
 *   pagination optimization, to save us from mutating a step that we don't
 *   "own"
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
export interface ConnectionOptimizedStep<
  TItemStep extends Step = Step,
  TNodeStep extends Step = TItemStep,
  TCursorValue = string,
> extends Step {
  /**
   * Clone the plan, ignoring the pagination parameters.
   *
   * Required if we're to apply conditions to the step (via `applyPagination`)
   * otherwise we're manipulating a potentially unrelated step.
   *
   * Useful for implementing things like `totalCount` or aggregates.
   */
  connectionClone(
    $connection: ConnectionStep<TItemStep, TNodeStep, TCursorValue, any>,
    ...args: any[]
  ): ConnectionOptimizedStep<TItemStep, TNodeStep, TCursorValue>; // TODO: `this`

  /**
   * If set, we assume that you support at least `limit` pagination, even on an
   * empty object.
   *
   * Must not be set without also implementing `applyPagination` and `connectionClone`.
   */
  paginationSupport: PaginationFeatures;

  /**
   * Receives the pagination parameters that were declared to be supported by
   * `paginationSupport`.
   *
   * Must not be implemented without also adding `paginationSupport` and `connectionClone`.
   */
  applyPagination($params: Step<PaginationParams<TCursorValue>>): void;

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
}

const EMPTY_OBJECT = Object.freeze(Object.create(null));

interface ConnectionResult {
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  items: ReadonlyArray<unknown>;
}

type ConnectionCapableStep<
  TItemStep extends Step,
  TNodeStep extends Step = TItemStep,
  TCursorValue = string,
> =
  | ConnectionOptimizedStep<TItemStep, TNodeStep, TCursorValue>
  | StepWithItems
  | Step<readonly any[]>;

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

  private collectionRefId: number;
  private collectionDepId: number | null = null;

  // Pagination stuff
  private _firstDepId: number | null = null;
  private _lastDepId: number | null = null;
  private _offsetDepId: number | null = null;
  private _beforeDepId: number | null | undefined = undefined;
  private _afterDepId: number | null | undefined = undefined;

  /** If `null` we **must not** mess with this.getSubplan() */
  private collectionPaginationSupport: PaginationFeatures | null;

  /** If the user asks for details of `hasNextPage`/`hasPreviousPage`, then fetch one extra */
  private fetchOneExtra = false;
  private needsCursor = false;

  constructor(subplan: TCollectionStep) {
    super();
    const refId = this.addRef(subplan);
    if (!refId) {
      throw new Error(`${this} couldn't depend on ${subplan}`);
    }
    this.collectionRefId = refId;
    if (
      "paginationSupport" in subplan &&
      "connectionClone" in subplan &&
      "applyPagination" in subplan
    ) {
      this.collectionPaginationSupport = subplan.paginationSupport;
    } else {
      this.collectionPaginationSupport = null;
    }
  }

  public getSubplan(): TCollectionStep {
    return this.getRef(this.collectionRefId) as TCollectionStep;
  }

  private _getSubplan() {
    return this.getSubplan() as TCollectionStep &
      Partial<ConnectionOptimizedStep<TItemStep, TNodeStep, TCursorValue>>;
  }

  /**
   * This represents a single page from the collection - not only have
   * conditions and ordering been applied but we've also applied the pagination
   * constraints (before, after, first, last, offset). It's useful for
   * returning the actual edges and nodes of the connection.
   *
   * This cannot be called before the arguments have been finalized.
   */
  private setupSubplanWithPagination() {
    if (this.collectionDepId != null) {
      return this.getDepOptions(this.collectionDepId).step as TCollectionStep &
        Partial<ConnectionOptimizedStep<TItemStep, TNodeStep, TCursorValue>>;
    }
    const subplan = this._getSubplan();
    if (this.collectionPaginationSupport) {
      // Clone it so we can mess with it
      const $clone = subplan.connectionClone!(this);
      this.collectionDepId = this.addDependency($clone);
      return $clone;
    } else {
      // It's pure, don't change it!
      this.collectionDepId = this.addDependency(subplan);
      return subplan as TCollectionStep &
        Partial<ConnectionOptimizedStep<TItemStep, TNodeStep, TCursorValue>>;
    }
  }

  public toStringMeta(): string {
    return String(this.getRef(this.collectionRefId)?.id);
  }

  public setNeedsNextPage() {
    this.fetchOneExtra = true;
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
      this._getSubplan().parseCursor?.($beforePlan) ?? $beforePlan;
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
      this._getSubplan().parseCursor?.($afterPlan) ?? $afterPlan;
    this._afterDepId = this.addUnaryDependency({
      step: $parsedAfterPlan,
      nonUnaryMessage: () =>
        `${this}.setAfter(...) must be passed a _unary_ step, but ${$parsedAfterPlan} (and presumably ${$afterPlan}) is not unary. See: https://err.red/gud#connection`,
    });
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
    ...args: ParametersExceptFirst<
      TCollectionStep extends ConnectionOptimizedStep<
        TItemStep,
        TNodeStep,
        TCursorValue
      >
        ? TCollectionStep["connectionClone"]
        : never
    >
  ): TCollectionStep {
    if (!this.isArgumentsFinalized) {
      throw new Error(
        "Forbidden to call ConnectionStep.nodes before arguments finalize",
      );
    }
    const plan = this._getSubplan();
    if (typeof plan.connectionClone !== "function") {
      throw new Error(`${plan} does not support cloning the subplan`);
    }
    const clonedPlan = plan.connectionClone(this, ...args) as TCollectionStep;
    return clonedPlan;
  }

  private paginationParams() {
    if (!this.collectionPaginationSupport) {
      throw new Error(
        `Subplan must support pagination optimization to call this method`,
      );
    }
    return new ConnectionParamsStep<TCursorValue>({
      paginationSupport: this.collectionPaginationSupport,
      fetchOneExtra: this.fetchOneExtra,
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
    const subplan = this.setupSubplanWithPagination();
    const $item = subplan.listItem?.($rawItem) ?? ($rawItem as TItemStep);
    if (typeof subplan.nodeForItem === "function") {
      return subplan.nodeForItem($item);
    } else {
      return $item as unknown as TNodeStep;
    }
  };

  public edgePlan = ($rawItem: Step<unknown>, $index: Step<number>) => {
    const subplan = this.setupSubplanWithPagination();
    const $item = subplan.listItem?.($rawItem) ?? ($rawItem as TItemStep);
    return new EdgeStep<TItemStep, TNodeStep>(this, $item, $index);
  };

  public edges(): Step {
    this.setupSubplanWithPagination();
    const $items = access(this, "items");
    return each($items, this.edgePlan);
  }

  public nodes() {
    this.setupSubplanWithPagination();
    const $items = access(this, "items");
    return each($items, this.nodePlan);
  }

  public cursorPlan($item: TItemStep, $index: Step<number>) {
    this.needsCursor = true;
    const subplan = this._getSubplan();
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
    if (this.collectionPaginationSupport && this.collectionDepId != null) {
      const $clone = this.getDepOptions(this.collectionDepId)
        .step as TCollectionStep & ConnectionOptimizedStep;
      $clone.applyPagination(this.paginationParams());
    }
    /*
     * **IMPORTANT**: no matter the arguments, we cannot optimize ourself away
     * by replacing ourself with a constant because otherwise errors in
     * cursors/etc will be pushed down a level.
     */
    return this;
  }
  deduplicatedWith(replacement: ConnectionStep<any, any, any, any>) {
    if (this.needsCursor) {
      replacement.needsCursor = true;
    }
    if (this.fetchOneExtra) {
      replacement.fetchOneExtra = true;
    }
  }

  public execute({
    count,
    values,
    indexMap,
  }: ExecutionDetails): GrafastResultsList<ConnectionResult | null> {
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
        let hasNext = false;
        let sliced = false;
        const diy = !isForwardPagination && !alreadyReversed;
        if (diy) {
          sliced = true;
          items = [...items].reverse();
        }
        if (sliceStart > 0) {
          sliced = true;
          items = items.slice(sliceStart);
        }
        if (limit != null) {
          if (this.fetchOneExtra) {
            hasNext = limitFromEnd != null ? false : items.length >= limit;
            if (hasNext) {
              sliced = true;
              items = items.slice(0, limit - 1);
            }
          } else {
            if (limit < items.length) {
              sliced = true;
              items = items.slice(0, limit);
            }
          }
        }
        if (limitFromEnd != null && limitFromEnd < items.length) {
          sliced = true;
          items = items.slice(items.length - limitFromEnd);
        }
        if (alreadyReversed || diy) {
          items = (sliced ? (items as Array<unknown>) : [...items]).reverse();
        }

        const hasNextPage = isForwardPagination ? hasNext : false;
        const hasPreviousPage = isForwardPagination ? false : hasNext;

        return {
          // TODO: we should probably pass some info through so PageInfo can be extended
          // collectionMeta: collectionValue === list ? null : collectionValue,
          pageInfo: {
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

export class EdgeStep<
  TItemStep extends Step,
  TNodeStep extends Step = Step,
> extends UnbatchedStep {
  static $$export = {
    moduleName: "grafast",
    exportName: "EdgeStep",
  };
  isSyncAndSafe = true;

  private readonly cursorDepId: number | null = null;
  private connectionRefId: number | null;

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
    const $connection = this.getConnectionStep();
    const $item = this.getItemStep();
    const $index = this.getIndexStep();
    return $connection.cursorPlan($item, $index);
  }

  deduplicate(_peers: EdgeStep<any, any>[]): EdgeStep<TItemStep, TNodeStep>[] {
    return _peers;
  }

  unbatchedExecute(_extra: UnbatchedExecutionExtra, record: any): any {
    // Handle nulls; everything else comes from the child plans
    return record == null ? null : EMPTY_OBJECT;
  }
}

const warned = false;

interface ConnectionParams {
  fieldArgs?: FieldArgs;

  /** @internal */
  nodePlan?: never;
  /** @internal */
  edgeDataPlan?: never;
  /** @internal */
  cursorPlan?: never;
}

/**
 * Wraps a collection fetch to provide the utilities for working with GraphQL
 * cursor connections.
 */
export function connection<
  TItemStep extends Step,
  TNodeStep extends Step = TItemStep,
  TCursorValue = string,
  TCollectionStep extends ConnectionOptimizedStep<
    TItemStep,
    TNodeStep,
    TCursorValue
  > = ConnectionOptimizedStep<TItemStep, TNodeStep, TCursorValue>,
>(
  step: TCollectionStep,
  params?: ConnectionParams,
): ConnectionStep<TItemStep, TNodeStep, TCursorValue, TCollectionStep> {
  if (
    typeof params === "function" ||
    params?.nodePlan ||
    params?.edgeDataPlan ||
    params?.cursorPlan
  ) {
    throw new Error(
      `connection() was completely overhauled during the beta; this usage is no longer supported. Usage is much more straightforward now.`,
    );
  }
  const $connection = new ConnectionStep<
    TItemStep,
    TNodeStep,
    TCursorValue,
    TCollectionStep
  >(step);
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

interface StepWithItems<TItem = any> extends Step {
  items(): Step<ReadonlyArray<TItem>>;
}
export type ItemsStep<T extends StepWithItems | Step<readonly any[]>> =
  T extends StepWithItems ? ReturnType<T["items"]> : T;

export function itemsOrStep<T extends Step<readonly any[]> | StepWithItems>(
  $step: T,
): Step<readonly any[]> {
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

export class ConnectionParamsStep<TCursorValue> extends UnbatchedStep<
  PaginationParams<TCursorValue>
> {
  static $$export = {
    moduleName: "grafast",
    exportName: "ConnectionParamsStep",
  };
  private paginationSupport: PaginationFeatures;
  private fetchOneExtra: boolean;
  // Pagination stuff
  private firstDepId: number | null;
  private lastDepId: number | null;
  private offsetDepId: number | null;
  private beforeDepId: number | null;
  private afterDepId: number | null;
  constructor(options: {
    paginationSupport: PaginationFeatures;
    fetchOneExtra: boolean;
    first: Step<Maybe<number>> | null;
    last: Step<Maybe<number>> | null;
    offset: Step<Maybe<number>> | null;
    before: Step<Maybe<TCursorValue>> | null;
    after: Step<Maybe<TCursorValue>> | null;
  }) {
    super();
    const {
      paginationSupport,
      fetchOneExtra,
      first,
      last,
      offset,
      before,
      after,
    } = options;
    this.paginationSupport = paginationSupport;
    this.fetchOneExtra = fetchOneExtra;
    this.firstDepId = this.addUnaryDependency(first ?? constant(null));
    this.lastDepId = this.addUnaryDependency(last ?? constant(null));
    this.offsetDepId = this.addUnaryDependency(offset ?? constant(null));
    this.beforeDepId = this.addUnaryDependency(before ?? constant(null));
    this.afterDepId = this.addUnaryDependency(after ?? constant(null));
    assert.strictEqual(this.firstDepId, 0, "first must be dep 0");
    assert.strictEqual(this.lastDepId, 1, "last must be dep 1");
    assert.strictEqual(this.offsetDepId, 2, "offset must be dep 2");
    assert.strictEqual(this.beforeDepId, 3, "before must be dep 3");
    assert.strictEqual(this.afterDepId, 4, "after must be dep 4");
  }
  unbatchedExecute(
    extra: UnbatchedExecutionExtra,
    gqlFirst: Maybe<number>,
    gqlLast: Maybe<number>,
    gqlOffset: Maybe<number>,
    gqlBefore: Maybe<string>,
    gqlAfter: Maybe<string>,
  ): PaginationParams<TCursorValue> {
    const {
      paginationSupport: {
        reverse: supportsReverse,
        offset: supportsOffset,
        cursor: supportCursor,
      },
      fetchOneExtra,
    } = this;
    const limit = null;
    const offset = null;
    const after = null;
    const reverse = false;
    // TODO: implement logic
    return {
      limit,
      offset,
      after,
      reverse,
    };
  }
}
