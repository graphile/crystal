import { isAsyncIterable, isIterable } from "iterall";

import * as assert from "../assert.js";
import { defer } from "../deferred.js";
import { currentFieldStreamDetails } from "../engine/lib/withGlobalLayerPlan.js";
import type {
  BaseGraphQLArguments,
  ExecutionDetails,
  ExecutionDetailsStream,
  FieldArgs,
  GrafastResultsList,
  Maybe,
  PromiseOrDirect,
  StepOptimizeOptions,
  UnbatchedExecutionExtra,
} from "../interfaces.js";
import { Step, UnbatchedStep } from "../step.js";
import {
  asyncIteratorWithCleanup,
  maybeArraysMatch,
  terminateIterable,
} from "../utils.js";
import { access } from "./access.js";
import { constant, ConstantStep } from "./constant.js";
import { each } from "./each.js";
import { first } from "./first.js";
import { lambda } from "./lambda.js";
import { last } from "./last.js";

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
   * cursor) in order to access the last entries.
   *
   * If you support `reverse` you MUST also support `cursor`, otherwise a
   * request such as `last: 3` cannot determine the cursors to use (since we
   * would need to know the length of the collection), and since cursors must
   * be the same values whether paginating forwards or backwards. If you cannot
   * support cursor, then simply do not indicate that you support `reverse` and
   * `connection()` will take care of pagination for you.
   *
   * To support `reverse`, you need to be able to apply the other supported
   * params from the end of the collection working backwards (`after` becomes
   * `before`, `offset` skips the nodes at the end instead of the start,
   * `limit` is applied such that it limits from the end rather than from the
   * start). One way to implement this is to reverse the ordering, apply the
   * params as normal, and then reverse the ordering back again. Do **NOT**
   * return the list in reverse order.
   *
   * It is recommended that if you do not support `reverse` that you do not
   * expose the reverse pagination arguments (`before` and `last`) as part of a
   * GraphQL schema, since `connection()` will need to fetch your entire
   * collection to implement pagination.
   */
  reverse?: boolean;

  /**
   * If you support cursor pagination you must provide a
   * `.cursorForItem($item)` method that returns the cursor to use for
   * the given item, and we will assume yout support (and you must support) the
   * `after` parameter in `PaginationParams`.
   *
   * If this is true but `reverse` is not, we will reject all attempts to do
   * reverse pagination (because a cursor cannot be applied by us, even if we
   * were to fetch the full collection). You should therefore strongly consider
   * implementing `reverse` support, or simply do not allow reverse pagination
   * through your schema.
   */
  cursor?: boolean;

  /**
   * If you support offset pagination, set this to true. If you also set
   * `cursor` to true, then the offset must apply _from_ the cursor; if have
   * `cursor` enabled and do not support combining `offset` and `cursor`
   * together then you should set `offset` to `false` (and raise an issue so we
   * can add new options for that).
   */
  offset?: boolean;

  /**
   * Set this if your collection supports every feature of GraphQL pagination,
   * and implements the `ConnectionHandlingStep` interface. Instead of caling
   * `applyPagination` as we do for `ConnectionOptimizedStep`, we will pass
   * each individual parameter through to your collection step. Your collection
   * step is also responsible for implementing the
   * `hasNextPage`/`hasPreviousPage` logic, and must yield from execution an
   * object conforming to `ConnectionHandlingResult`.
   */
  full?: boolean;
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
   * Note: if `reverse` is `true`, this applies in the reverse direction (i.e.
   * if `after` becomes equivalent to the `before` argument exposed through
   * GraphQL).
   */
  after: TCursorValue | null;

  /**
   * If we're paginating backwards then the collection should apply the other
   * parameters (`limit`, `offset`, `after`) in reverse (from the end of the
   * collection). Always `false` unless `paginationSupport.cursor` is `true`.
   */
  reverse: boolean;

  /**
   * This will be non-null if it's desirable for the underlying step to stream.
   * Underlying step should detect whether to stream or not from
   * `(executionDetails.stream ?? params?.stream)` - works exactly as
   * `executionDetails.stream`.
   */
  stream: ExecutionDetailsStream | null;

  /* ---------------------------------------- */

  /**
   * True if `after` or `first` is set, or if neither `before` or `last` is
   * set.
   *
   * @internal
   */
  __isForwardPagination: boolean;

  /**
   * How many records to trim off the front of the stream; typically used where
   * the underlying collection doesn't support 'offset'.
   *
   * @internal
   */
  __skipOver: number;

  /**
   * Stop after this many rows. Only used for reverse numerical pagination when
   * `limit` is unsupported.
   *
   * @internal
   */
  __limit: number | null;

  /**
   * True if we know there's definitely more records.
   * False if we know there's definitely no more records.
   * Otherwise a tuple saying which side of the remaining result we should pick
   * from (and drop from) to determine if there's a next page.
   *
   * If side = `l` then we need to retain records until we hit `limit`. When we
   * start dropping records, we set `hasMore` to true.
   *
   * If side = `r` then we can stream through `limit` records and then stop
   * sending records, but we consume one extra to see if `hasMore` is true or
   * not.
   *
   * @internal
   */
  __hasMore: boolean | [side: "l" | "r", limit: number];
}

/**
 * Describes what a plan may implement for ConnectionStep to be able to
 * utilise it in the most optimal way.
 *
 * Implementing this is optional, but:
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
 * @param TItem - The data represented by an individual list item
 * @param TNodeStep - A derivative of TEdgeStep that represents the _node_ itself. Defaults to TEdgeStep.
 * @param TEdgeStep - Represents an item in the collection, typically equivalent to an _edge_.
 * @param TCursorValue - If your step wants us to parse the cursor for you, the result of the parse. Useful for throwing an error before the fetch if the cursor is invalid.
 */
export interface ConnectionOptimizedStep<
  TItem,
  TNodeStep extends Step = Step<TItem>,
  TEdgeStep extends EdgeCapableStep<TItem, TNodeStep> = EdgeStep<
    TItem,
    TNodeStep
  >,
  TCursorValue = string,
> extends Step {
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
   * Clone the plan, ignoring the pagination parameters.
   *
   * Useful for implementing things like `totalCount` or aggregates.
   */
  connectionClone?(
    ...args: any[]
  ): ConnectionOptimizedStep<TItem, TNodeStep, TEdgeStep, TCursorValue>; // TODO: `this`

  /**
   * Optionally implement this and we will parse the cursor for you before
   * handing it to `applyPagination`.
   *
   * Must not be added unless `paginationSupport.cursor` is `true`.
   */
  parseCursor?($cursor: Step<Maybe<string>>): Step<Maybe<TCursorValue>>;

  /**
   * If the `$item` represents an edge rather than the node, return the node to
   * use instead.
   */
  nodeForItem?($item: Step<TItem>): TNodeStep;

  /**
   * Turn a value from the list into an item step
   */
  edgeForItem?($item: Step<MaybeIndexed<TItem>>): TEdgeStep;

  /**
   * Used as a fallback if nodeForItem isn't implemented.
   */
  listItem?($item: Step<TItem>): TNodeStep;

  /**
   * Given the $item, return a step representing the cursor.
   *
   * Must be implemented if and only if `paginationSupport.cursor` is `true`.
   */
  cursorForItem?($item: Step<TItem>): Step<string>;
}

/** The result of a "ConnectionHandlingStep". */
export interface ConnectionHandlingResult<
  TItem,
> /* extends ConnectionResult */ {
  hasNextPage: PromiseOrDirect<boolean>;
  hasPreviousPage: PromiseOrDirect<boolean>;
  items: ReadonlyArray<TItem> | AsyncIterable<TItem>;
}

export interface ConnectionHandlingStep<
  TItem,
  TNodeStep extends Step = Step<TItem>,
  TEdgeStep extends EdgeCapableStep<TItem, TNodeStep> = EdgeStep<
    TItem,
    TNodeStep
  >,
  TCursorValue = string,
> extends Step<Maybe<ConnectionHandlingResult<TItem>>>,
    Pick<
      ConnectionOptimizedStep<TItem, TNodeStep, TEdgeStep, TCursorValue>,
      "parseCursor" | "nodeForItem" | "edgeForItem" | "listItem"
    >,
    Required<
      Pick<
        ConnectionOptimizedStep<TItem, TNodeStep, TEdgeStep, TCursorValue>,
        "cursorForItem"
      >
    > {
  /**
   * Clone the plan, ignoring the pagination parameters.
   *
   * Useful for implementing things like `totalCount` or aggregates.
   */
  connectionClone?(
    ...args: any[]
  ): ConnectionHandlingStep<TItem, TNodeStep, TEdgeStep, TCursorValue>; // TODO: `this`

  paginationSupport: {
    full: true;
  } /* satisfies PaginationFeatures */;

  setFirst($first: Step<Maybe<number>>): void;
  setLast($last: Step<Maybe<number>>): void;
  setOffset($offset: Step<Maybe<number>>): void;
  setBefore($before: Step<Maybe<TCursorValue>>): void;
  setAfter($after: Step<Maybe<TCursorValue>>): void;

  /**
   * Called when `hasNextPage`/`hasPreviousPage` are requested.
   */
  setNeedsHasMore(): void;

  // TODO: would be better to expose this as
  // `setInitialCount(Step<number | null>): void` and only call it once.
  /**
   * Passes the stream options that this collection is accessed with. This may
   * happen more than once (e.g. if you have
   * `nodes @stream(...) {...}, edges @stream(...) {...}`). If so, `null` wins,
   * and failing that, the largest `initialCount` wins.
   *
   * WARNING: This may be called more than once!
   */
  addStreamDetails?(
    $streamDetails: Step<ExecutionDetailsStream | null> | null,
  ): void;
}

const EMPTY_OBJECT = Object.freeze(Object.create(null));
const EMPTY_CONNECTION_RESULT: ConnectionResult<never> = Object.freeze({
  items: Object.freeze([]),
  hasNextPage: false,
  hasPreviousPage: false,
});

interface Indexed<TItem> {
  index: number;
  item: TItem;
}
function indexedItem<TItem>(item: TItem, index: number): Indexed<TItem> {
  return { index, item };
}
type MaybeIndexed<TItem> = TItem | Indexed<TItem>;

interface ConnectionResult<TItem> {
  hasNextPage: PromiseOrDirect<boolean>;
  hasPreviousPage: PromiseOrDirect<boolean>;
  items:
    | ReadonlyArray<MaybeIndexed<TItem>>
    | Iterable<MaybeIndexed<TItem>>
    | AsyncIterable<MaybeIndexed<TItem>>;
}

interface EdgeCapableStep<
  TItem,
  TNodeStep extends Step,
  TEdgeDataStep extends Step = Step<TItem>,
> extends Step {
  node(): TNodeStep;
  cursor(): Step<string>;
  data(): TEdgeDataStep;
}

export type StepRepresentingList<
  TItem,
  TNodeStep extends Step = Step<TItem>,
  TEdgeStep extends EdgeCapableStep<TItem, TNodeStep> = EdgeStep<
    TItem,
    TNodeStep
  >,
  TCursorValue = string,
> =
  | ConnectionOptimizedStep<TItem, TNodeStep, TEdgeStep, TCursorValue>
  | StepWithItems<TItem>
  | Step<Maybe<readonly TItem[]>>;

/**
 * Handles GraphQL cursor pagination in a standard and consistent way
 * indepdenent of data source.
 */
export class ConnectionStep<
  TItem,
  TNodeStep extends Step = Step<TItem>,
  TEdgeDataStep extends Step = Step<TItem>,
  TEdgeStep extends EdgeCapableStep<TItem, TNodeStep, TEdgeDataStep> = EdgeStep<
    TItem,
    TNodeStep,
    TEdgeDataStep
  >,
  TCursorValue = string,
  TCollectionStep extends StepRepresentingList<
    TItem,
    TNodeStep,
    TEdgeStep,
    TCursorValue
  > = StepRepresentingList<TItem, TNodeStep, TEdgeStep, TCursorValue>,
> extends Step<ConnectionResult<TItem> | null> {
  static $$export = {
    moduleName: "grafast",
    exportName: "ConnectionStep",
  };
  isSyncAndSafe = false;

  private neededCollection = false;
  private collectionDepId: number;
  /**
   * null = unknown
   */
  private _mightStream: boolean | null = null;

  // Pagination stuff
  private _firstDepId: number | null = null;
  private _lastDepId: number | null = null;
  private _offsetDepId: number | null = null;
  private _beforeDepId: number | null | undefined = undefined;
  private _afterDepId: number | null | undefined = undefined;

  /** If `null` we **must not** mess with this.getSubplan() */
  private collectionPaginationSupport: PaginationFeatures | null;

  /** If the user asks for details of `hasNextPage`/`hasPreviousPage`, then fetch one extra */
  private needsHasMore = false;
  private needsCursor = false;

  private paramsDepId: number | null;

  edgeDataPlan: ($rawItem: Step<TItem>) => TEdgeDataStep;

  constructor(
    subplan: TCollectionStep,
    params: Omit<ConnectionParams<any, TItem, TEdgeDataStep>, "fieldArgs"> = {},
  ) {
    super();
    if (params.edgeDataPlan) {
      this.edgeDataPlan = params.edgeDataPlan!;
    } else {
      this.edgeDataPlan = (i) => i as TEdgeDataStep;
    }
    if (
      "paginationSupport" in subplan &&
      subplan.paginationSupport != null &&
      (subplan.paginationSupport.full || "applyPagination" in subplan)
    ) {
      this.collectionPaginationSupport = subplan.paginationSupport;
      if (this.collectionPaginationSupport.full) {
        this.paramsDepId = null;
      } else {
        const $params = new ConnectionParamsStep<TCursorValue>(
          this.collectionPaginationSupport,
        );
        this.paramsDepId = this.addUnaryDependency($params);
        subplan.applyPagination($params);
      }
      this.collectionDepId = this.addDependency(subplan);
    } else {
      const $params = new ConnectionParamsStep<TCursorValue>(null);
      this.paramsDepId = this.addUnaryDependency($params);
      this.collectionPaginationSupport = null;
      // It's pure, don't change it!
      this.collectionDepId = this.addDependency(subplan);
    }
  }

  public mightStream() {
    return this._mightStream === true;
  }

  public getSubplan(): TCollectionStep {
    return this.getDepOptions(this.collectionDepId).step as TCollectionStep;
  }

  private _getSubplan() {
    return this.getSubplan() as TCollectionStep &
      Partial<
        ConnectionOptimizedStep<TItem, TNodeStep, TEdgeStep, TCursorValue>
      >;
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
    this.neededCollection = true;
    return this.getDepOptions(this.collectionDepId).step as TCollectionStep &
      Partial<
        ConnectionOptimizedStep<TItem, TNodeStep, TEdgeStep, TCursorValue>
      >;
  }

  private getHandler():
    | (TCollectionStep &
        ConnectionHandlingStep<TItem, TNodeStep, TEdgeStep, TCursorValue>)
    | ConnectionParamsStep<TCursorValue> {
    if (this.collectionPaginationSupport?.full) {
      return this.setupSubplanWithPagination() as any;
    } else {
      return this.paginationParams();
    }
  }

  public toStringMeta(): string {
    return String(this.getDepOptions(this.collectionDepId).step.id);
  }

  public setNeedsHasMore() {
    this.needsHasMore = true;
    this.setupSubplanWithPagination();
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
    this.getHandler().setFirst($first);
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
    this.getHandler().setLast($last);
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
    this.getHandler().setOffset($offset);
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
      this._getSubplan().parseCursor?.($beforePlan) ??
      ($beforePlan as Step<Maybe<TCursorValue>>);
    this._beforeDepId = this.addUnaryDependency({
      step: $parsedBeforePlan,
      nonUnaryMessage: () =>
        `${this}.setBefore(...) must be passed a _unary_ step, but ${$parsedBeforePlan} (and presumably ${$beforePlan}) is not unary. See: https://err.red/gud#connection`,
    });
    this.getHandler().setBefore($parsedBeforePlan);
  }
  public getAfter(): Step<Maybe<TCursorValue>> | null {
    // TODO: Move all of these to params, get rid of our dep here.
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
      this._getSubplan().parseCursor?.($afterPlan) ??
      ($afterPlan as Step<Maybe<TCursorValue>>);
    this._afterDepId = this.addUnaryDependency({
      step: $parsedAfterPlan,
      nonUnaryMessage: () =>
        `${this}.setAfter(...) must be passed a _unary_ step, but ${$parsedAfterPlan} (and presumably ${$afterPlan}) is not unary. See: https://err.red/gud#connection`,
    });
    this.getHandler().setAfter($parsedAfterPlan);
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
    ...args: Parameters<
      TCollectionStep extends
        | ConnectionOptimizedStep<TItem, TNodeStep, TEdgeStep, TCursorValue>
        | ConnectionHandlingStep<TItem, TNodeStep, TEdgeStep, TCursorValue>
        ? Exclude<TCollectionStep["connectionClone"], undefined>
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
    const clonedPlan = plan.connectionClone(...args) as TCollectionStep;
    return clonedPlan;
  }

  private paginationParams() {
    if (this.collectionPaginationSupport?.full) {
      throw new Error(`Full pagination support does not generate params`);
    }
    return this.getDepOptions(this.paramsDepId!)
      .step as ConnectionParamsStep<TCursorValue>;
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

  public listItem($rawItem: Step<TItem>) {
    return this.nodePlan($rawItem);
  }

  public getUnindexedItem($rawItem: Step<MaybeIndexed<TItem>>) {
    const $item = this.collectionPaginationSupport?.cursor
      ? ($rawItem as Step<TItem>)
      : (access($rawItem as Step<Indexed<TItem>>, "item") as Step<TItem>);
    return $item;
  }
  public nodePlan = ($rawItem: Step<MaybeIndexed<TItem>>) => {
    const $item = this.getUnindexedItem($rawItem);
    const subplan = this.setupSubplanWithPagination();
    if (typeof subplan.nodeForItem === "function") {
      return subplan.nodeForItem($item);
    } else if (typeof subplan.listItem === "function") {
      return subplan.listItem($item);
    } else {
      return $item as unknown as TNodeStep;
    }
  };

  public edgePlan = ($rawItem: Step<MaybeIndexed<TItem>>) => {
    const subplan = this.setupSubplanWithPagination();
    if (typeof subplan.edgeForItem === "function") {
      return subplan.edgeForItem($rawItem);
    } else {
      return new EdgeStep<TItem, TNodeStep, TEdgeStep>(this, $rawItem);
    }
  };

  private captureStream() {
    const $streamDetails = currentFieldStreamDetails();
    this.getHandler().addStreamDetails?.($streamDetails);
    if ($streamDetails === null) {
      this._mightStream = false;
    } else if (this._mightStream === null) {
      // Only override if it was unknown
      this._mightStream = true;
    }
  }

  public edges(): Step {
    this.captureStream();
    this.setupSubplanWithPagination();
    return each(this._items(), this.edgePlan as any);
  }

  public nodes() {
    this.captureStream();
    this.setupSubplanWithPagination();
    return each(this._items(), this.nodePlan as any);
  }

  public items() {
    return this.nodes();
  }

  /** @internal */
  public _items() {
    return this.withMyLayerPlan(() =>
      this.operationPlan.cacheStep(
        this,
        "_items",
        null,
        () => new ConnectionItemsStep(this),
      ),
    );
  }

  public cursorPlan($rawItem: Step<MaybeIndexed<TItem>>) {
    this.needsCursor = true;
    const subplan = this._getSubplan();
    if (
      this.collectionPaginationSupport?.cursor ||
      this.collectionPaginationSupport?.full
    ) {
      const $item = $rawItem as Step<TItem>;
      return subplan.cursorForItem!($item);
    } else {
      const $indexed = $rawItem as Step<Indexed<TItem>>;
      // We're doing cursors, which also means we're NOT doing reverse.
      // NOTE: there won't be a needsHasMore causing an extra row fetch when
      // doing numeric pagination backwards - we know there's another record if
      // we start > 0
      const $leftPad = access(this.paginationParams(), "__skipOver");
      const $offset = access(this.paginationParams(), "offset", 0);
      const $index = access($indexed, "index") as Step<number>;
      return lambda([$leftPad, $offset, $index], encodeNumericCursor);
    }
  }

  public pageInfo() {
    return new PageInfoStep(this);
  }

  public optimize() {
    if (!this.neededCollection) {
      return constant(EMPTY_CONNECTION_RESULT);
    }
    if (this.needsHasMore) {
      this.getHandler().setNeedsHasMore();
    }
    /*
     * **IMPORTANT**: no matter the arguments, we cannot optimize ourself away
     * by replacing ourself with a constant because otherwise errors in
     * cursors/etc will be pushed down a level.
     */
    return this;
  }
  deduplicatedWith(replacement: ConnectionStep<any, any, any, any, any>) {
    if (this.neededCollection) {
      replacement.neededCollection = true;
    }
    if (this.needsCursor) {
      replacement.needsCursor = true;
    }
    if (this.needsHasMore) {
      replacement.needsHasMore = true;
    }
  }

  public execute({
    values,
    indexMap,
  }: ExecutionDetails): GrafastResultsList<ConnectionResult<TItem> | null> {
    if (!this.neededCollection) {
      // The main collection is not actually fetched, so we don't need to do
      // any pagination stuff. Could be they just wanted `totalCount` for
      // example.
      return indexMap(() => EMPTY_CONNECTION_RESULT);
    }
    const collectionDep = values[this.collectionDepId];
    const params =
      this.paramsDepId != null
        ? (values[
            this.paramsDepId
          ].unaryValue() as PaginationParams<TCursorValue>)
        : null;
    return indexMap((i) => {
      const collectionValue = collectionDep.at(i);

      if (params === null) {
        // collection handles everything
        const result = collectionValue as ConnectionHandlingResult<any>;
        if (
          !this._mightStream &&
          result.items != null &&
          !Array.isArray(result.items)
        ) {
          // Except it might return a stream which we should turn into an array.
          return (async () => ({
            ...result,
            items: await iterableToArray(result.items),
          }))();
        } else {
          return result;
        }
      }

      // The value is either a list of items, or an object that contains the
      // `items` key.
      let mode: Mode = MODE_NULL;
      let collection:
        | Array<TItem>
        | Iterable<TItem>
        | AsyncIterable<TItem>
        | null = null;
      if (collectionValue == null) {
        mode = MODE_NULL;
      } else if (Array.isArray(collectionValue)) {
        collection = collectionValue;
        mode = MODE_ARRAY;
      } else if (isIterable(collectionValue)) {
        collection = collectionValue; // [Symbol.iterator]();
        mode = MODE_ITERABLE;
      } else if (isAsyncIterable(collectionValue)) {
        collection = collectionValue; //[Symbol.asyncIterator]();
        mode = MODE_ASYNC_ITERABLE;
      } else if (
        typeof collectionValue === "object" &&
        "items" in collectionValue
      ) {
        const items = collectionValue.items;
        if (items == null) {
          mode = MODE_NULL;
        } else if (Array.isArray(items)) {
          collection = items;
          mode = MODE_ARRAY;
        } else if (isIterable(items)) {
          collection = items; // [Symbol.iterator]();
          mode = MODE_ITERABLE;
        } else if (isAsyncIterable(items)) {
          collection = items; // [Symbol.asyncIterator]();
          mode = MODE_ASYNC_ITERABLE;
        } else {
          // WTF?
          mode = MODE_NULL;
        }
      } else {
        // WTF?
        mode = MODE_NULL;
      }
      if (mode === MODE_NULL || collection === null) {
        return null;
      }

      if (
        this._mightStream !== true &&
        (mode === MODE_ITERABLE || mode === MODE_ASYNC_ITERABLE)
      ) {
        // Convert to array, then process
        return iterableToArray(collection).then((array) =>
          makeProcessedCollection(
            MODE_ARRAY,
            array,
            params,
            !this.collectionPaginationSupport?.cursor,
          ),
        );
      } else {
        return makeProcessedCollection(
          mode,
          collection,
          params,
          !this.collectionPaginationSupport?.cursor,
        );
      }
    });
  }
}

const MODE_NULL = 0;
const MODE_ARRAY = 1;
const MODE_ITERABLE = 2;
const MODE_ASYNC_ITERABLE = 3;
type Mode =
  | typeof MODE_NULL
  | typeof MODE_ARRAY
  | typeof MODE_ITERABLE
  | typeof MODE_ASYNC_ITERABLE;
function makeProcessedCollection<TItem>(
  mode: Exclude<Mode, typeof MODE_NULL>,
  collection: Array<TItem> | Iterable<TItem> | AsyncIterable<TItem>,
  params: PaginationParams<any>,
  wrapIndicies: boolean,
): ConnectionResult<TItem> {
  const { __isForwardPagination, __hasMore, __skipOver, __limit } = params;

  // If we don't need to do anything, return the underlying collection directly
  if (
    __skipOver === 0 &&
    __limit === null &&
    typeof __hasMore === "boolean" &&
    (!wrapIndicies || Array.isArray(collection))
  ) {
    const hasNextPage = __isForwardPagination ? __hasMore : false;
    const hasPreviousPage = __isForwardPagination ? __hasMore : false;
    const items = wrapIndicies
      ? (collection as ReadonlyArray<TItem>).map(indexedItem)
      : collection;
    return { items, hasNextPage, hasPreviousPage };
  }

  let hasNext: boolean | PromiseLike<boolean>;
  let items:
    | Array<MaybeIndexed<TItem>>
    | Iterable<MaybeIndexed<TItem>>
    | AsyncIterable<MaybeIndexed<TItem>>;
  if (mode === MODE_ARRAY) {
    let array = collection as ReadonlyArray<TItem>;
    if (__skipOver > 0) {
      array = array.slice(__skipOver);
    }
    if (__limit != null) {
      array = array.slice(0, __limit);
    }
    if (typeof __hasMore === "boolean") {
      hasNext = __hasMore;
    } else {
      const [side, limit] = __hasMore;
      if (side === "l") {
        if (array.length > limit) {
          hasNext = true;
          array = array.slice(array.length - limit);
        } else {
          hasNext = false;
        }
      } else {
        if (array.length > limit) {
          hasNext = true;
          array = array.slice(0, limit);
        } else {
          hasNext = false;
        }
      }
    }
    items = wrapIndicies ? array.map(indexedItem) : array;
  } else {
    const deferredHasNext =
      typeof __hasMore === "boolean" ? null : defer<boolean>();
    hasNext = deferredHasNext ?? (__hasMore as boolean);
    let didHaveNext = false;
    let started = false;
    items = asyncIteratorWithCleanup(
      (async function* () {
        let skip = __skipOver;
        let index = 0;
        const accumulator: TItem[] | null =
          typeof __hasMore !== "boolean" && __hasMore[0] === "l" ? [] : null;
        started = true;
        for await (const item of collection) {
          if (skip > 0) {
            --skip;
          } else if (__limit === null || index < __limit) {
            if (typeof __hasMore === "boolean") {
              yield wrapIndicies ? { index, item } : item;
            } else {
              const limit = __hasMore[1];
              if (accumulator /* same as __hasMore[0] === "l" */) {
                // DO NOT USE `index` IN THIS BRANCH
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const index = null;

                if (accumulator.length < limit) {
                  // All good
                } else {
                  // Drop one!
                  accumulator.shift();
                  didHaveNext = true;
                }
                accumulator.push(item);
              } else {
                if (index < limit) {
                  yield wrapIndicies ? { index, item } : item;
                } else {
                  didHaveNext = true;
                  break;
                }
              }
            }
            index++;
          } else {
            break;
          }
        }
        if (accumulator) {
          index = 0;
          for (const item of accumulator) {
            yield wrapIndicies ? { index, item } : item;
            ++index;
          }
        }
      })(),
      () => {
        if (deferredHasNext) {
          deferredHasNext.resolve(didHaveNext);
        }
        if (!started) {
          terminateIterable(collection);
        }
      },
    );
  }
  const hasNextPage = __isForwardPagination ? hasNext : false;
  const hasPreviousPage = __isForwardPagination ? false : hasNext;

  return {
    hasNextPage,
    hasPreviousPage,
    items,
  };
}

export class EdgeStep<
  TItem,
  TNodeStep extends Step = Step,
  TEdgeDataStep extends Step = Step<TItem>,
> extends UnbatchedStep {
  static $$export = {
    moduleName: "grafast",
    exportName: "EdgeStep",
  };
  isSyncAndSafe = true;

  private connectionRefId: number | null;

  constructor(
    $connection: ConnectionStep<TItem, TNodeStep, any, any, any>,
    $rawItem: Step<MaybeIndexed<TItem>>,
  ) {
    super();
    const itemDepId = this.addDependency($rawItem);
    assert.strictEqual(
      itemDepId,
      0,
      "GrafastInternalError<89cc75cd-ccaf-4b7e-873f-a629c36d55f7>: item must be first dependency",
    );
    this.connectionRefId = this.addRef($connection);
  }

  public get(fieldName: string) {
    switch (fieldName) {
      case "node":
        return this.node();
      case "cursor":
        return this.cursor();
      case "data":
        return this.data();
      default:
        return constant(undefined);
    }
  }

  private getConnectionStep() {
    return this.getRef(this.connectionRefId) as ConnectionStep<
      TItem,
      TNodeStep,
      any,
      any,
      any,
      TEdgeDataStep
    >;
  }

  private getRawItemStep() {
    // We know we're not using flags
    return this.getDepOptions<Step<MaybeIndexed<TItem>>>(0).step;
  }
  private getItemStep(): Step<TItem> {
    const $rawItem = this.getRawItemStep();
    return this.getConnectionStep().getUnindexedItem($rawItem);
  }

  data(): TEdgeDataStep {
    const $connection = this.getConnectionStep();
    const $item = this.getItemStep();
    return $connection.edgeDataPlan($item);
  }

  node(): TNodeStep {
    const $rawItem = this.getRawItemStep();
    return this.getConnectionStep().nodePlan($rawItem);
  }

  private cursorDepId: number | null = null;
  cursor(): Step<string> {
    if (this.cursorDepId == null) {
      const $connection = this.getConnectionStep();
      const $rawItem = this.getRawItemStep();
      const $cursor = this.withMyLayerPlan(() =>
        $connection.cursorPlan($rawItem),
      );
      this.cursorDepId = this.addDependency($cursor);
      if (this.cursorDepId !== 1) {
        throw new Error(
          `Expected cursor to have depId = 1, but instead it got depId ${this.cursorDepId}`,
        );
      }
      return $cursor;
    } else {
      return this.getDepOptions(this.cursorDepId).step;
    }
  }

  deduplicate(_peers: EdgeStep<any, any>[]): EdgeStep<TItem, TNodeStep>[] {
    return _peers;
  }

  unbatchedExecute(
    _extra: UnbatchedExecutionExtra,
    record: any,
    cursor: any,
  ): any {
    // Handle nulls; everything else comes from the child plans
    return record == null || (this.cursorDepId === 1 && cursor == null)
      ? null
      : EMPTY_OBJECT;
  }
}

interface ConnectionParams<
  TObj extends BaseGraphQLArguments = any,
  TItem = any,
  TEdgeDataStep extends Step = Step<TItem>,
> {
  fieldArgs?: FieldArgs<TObj>;
  edgeDataPlan?: ($item: Step<TItem>) => TEdgeDataStep;

  /** @internal */
  nodePlan?: never;
  /** @internal */
  cursorPlan?: never;
}

/**
 * Wraps a collection fetch to provide the utilities for working with GraphQL
 * cursor connections.
 */
export function connection<
  TItem,
  TNodeStep extends Step = Step<TItem>,
  TEdgeDataStep extends Step = Step<TItem>,
  TEdgeStep extends EdgeCapableStep<TItem, TNodeStep, TEdgeDataStep> = EdgeStep<
    TItem,
    TNodeStep,
    TEdgeDataStep
  >,
  TCursorValue = any,
  TCollectionStep extends StepRepresentingList<
    TItem,
    TNodeStep,
    TEdgeStep,
    TCursorValue
  > = StepRepresentingList<TItem, TNodeStep, TEdgeStep, TCursorValue>,
  TFieldArgs extends BaseGraphQLArguments = any,
>(
  step: TCollectionStep,
  params?: ConnectionParams<TFieldArgs, TItem, TEdgeDataStep>,
): ConnectionStep<
  TItem,
  TNodeStep,
  TEdgeDataStep,
  TEdgeStep,
  TCursorValue,
  TCollectionStep
> {
  if (typeof params === "function" || params?.nodePlan || params?.cursorPlan) {
    throw new Error(
      `connection() was completely overhauled during the beta; this usage is no longer supported. Usage is much more straightforward now.`,
    );
  }
  const $connection = new ConnectionStep<
    TItem,
    TNodeStep,
    TEdgeDataStep,
    TEdgeStep,
    TCursorValue,
    TCollectionStep
  >(step, params);
  const fieldArgs = params?.fieldArgs;
  if (fieldArgs) {
    const { $first, $last, $before, $after, $offset } = fieldArgs as FieldArgs;
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
  items(): Step<Maybe<ReadonlyArray<TItem>>>;
}
export type ItemsStep<TStep extends StepRepresentingList<any>> =
  TStep extends StepWithItems ? ReturnType<TStep["items"]> : TStep;

export function itemsOrStep<
  T extends Step<Maybe<readonly any[]>> | StepWithItems,
>($step: T): Step<Maybe<readonly any[]>> {
  return "items" in $step && typeof $step.items === "function"
    ? $step.items()
    : $step;
}

function encodeNumericCursor(index: number | readonly number[]): string {
  const cursor =
    typeof index === "number" ? index : index.reduce((memo, n) => memo + n, 0);
  return Buffer.from(String(cursor), "utf8").toString("base64");
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
  /** sync and safe because it's unary; an error thrown for one is thrown for all */
  public isSyncAndSafe = true;
  private needsHasMore = false;
  // Pagination stuff
  private firstDepId: number | null = null;
  private lastDepId: number | null = null;
  private offsetDepId: number | null = null;
  private beforeDepId: number | null = null;
  private afterDepId: number | null = null;
  private streamDetailsDepIds: number[] | null = [];
  constructor(private paginationSupport: PaginationFeatures | null) {
    super();
  }
  setFirst($first: Step<Maybe<number>>) {
    if (this.firstDepId != null) throw new Error(`first already set`);
    this.firstDepId = this.addUnaryDependency($first);
  }
  setLast($last: Step<Maybe<number>>) {
    if (this.lastDepId != null) throw new Error(`last already set`);
    this.lastDepId = this.addUnaryDependency($last);
  }
  setOffset($offset: Step<Maybe<number>>) {
    if (this.offsetDepId != null) throw new Error(`offset already set`);
    this.offsetDepId = this.addUnaryDependency($offset);
  }
  setBefore($before: Step<Maybe<TCursorValue>>) {
    if (this.beforeDepId != null) throw new Error(`before already set`);
    this.beforeDepId = this.addUnaryDependency($before);
  }
  setAfter($after: Step<Maybe<TCursorValue>>) {
    if (this.afterDepId != null) throw new Error(`after already set`);
    this.afterDepId = this.addUnaryDependency($after);
  }
  setNeedsHasMore() {
    this.needsHasMore = true;
  }
  addStreamDetails($details: Step<ExecutionDetailsStream | null> | null) {
    if ($details) {
      this.streamDetailsDepIds?.push(this.addUnaryDependency($details));
    } else {
      // Explicitly disable streaming
      this.streamDetailsDepIds = null;
    }
  }

  /**
   * True if it's possible this'll stream, false if we've not
   * been told anything about streaming.
   */
  public mightStream() {
    return (
      this.streamDetailsDepIds != null && this.streamDetailsDepIds.length > 0
    );
  }

  deduplicate(
    peers: ConnectionParamsStep<any>[],
  ): ConnectionParamsStep<TCursorValue>[] {
    return peers.filter(
      (p) =>
        p.paginationSupport === this.paginationSupport &&
        p.firstDepId === this.firstDepId &&
        p.afterDepId === this.afterDepId &&
        p.offsetDepId === this.offsetDepId &&
        p.beforeDepId === this.beforeDepId &&
        p.afterDepId === this.afterDepId &&
        maybeArraysMatch(p.streamDetailsDepIds, this.streamDetailsDepIds),
    ) as ConnectionParamsStep<TCursorValue>[];
  }
  public deduplicatedWith(replacement: ConnectionParamsStep<any>): void {
    if (this.needsHasMore) {
      replacement.needsHasMore = true;
    }
  }
  unbatchedExecute(
    extra: UnbatchedExecutionExtra,
    ...values: any[]
  ): PaginationParams<TCursorValue> {
    /** If we should stream, set this (to 0 or more), otherwise leave it null */
    let initialCount: number | null = null;
    if (this.streamDetailsDepIds != null) {
      for (const depId of this.streamDetailsDepIds) {
        const v = values[depId] as ExecutionDetailsStream | null;
        if (v != null) {
          const c = v.initialCount ?? 0;
          if (initialCount === null || c > initialCount) {
            initialCount = c;
          }
        }
      }
    }
    const stream: ExecutionDetailsStream | null =
      initialCount != null ? { initialCount } : null;

    const first: Maybe<number> =
      this.firstDepId != null ? values[this.firstDepId] : null;
    const last: Maybe<number> =
      this.lastDepId != null ? values[this.lastDepId] : null;
    const offset: Maybe<number> =
      this.offsetDepId != null ? values[this.offsetDepId] : null;
    const before: Maybe<TCursorValue> =
      this.beforeDepId != null ? values[this.beforeDepId] : null;
    const after: Maybe<TCursorValue> =
      this.afterDepId != null ? values[this.afterDepId] : null;
    const { needsHasMore } = this;
    const {
      reverse: supportsReverse,
      offset: supportsOffset,
      cursor: supportsCursor,
    } = this.paginationSupport ?? {};
    const supportsLimit = this.paginationSupport != null;
    /** How many records do we need to skip over in addition to a limit implied by `first`/`last`? */
    const params: PaginationParams<TCursorValue> = {
      __skipOver: 0,
      __isForwardPagination: true,
      __hasMore: false,
      __limit: null,
      limit: null,
      offset: null,
      after: null,
      reverse: false,
      stream,
    };

    const isForwardPagination =
      first != null || after != null || (before == null && last == null);
    if (first != null && (!Number.isSafeInteger(first) || first < 0)) {
      throw new Error("Invalid 'first'");
    }
    if (last != null && (!Number.isSafeInteger(last) || last < 0)) {
      throw new Error("Invalid 'last'");
    }

    // Setting boht first and last makes queries nonsensical.
    // https://relay.dev/graphql/connections.htm#note-95f8a
    if (first != null && before != null) {
      throw new Error(
        "You must not set both `first` and `before`; specify `first` and optionally `after` to paginate forwards, or `last` and optionally `before` to paginate backwards.",
      );
    }
    if (last != null && after != null) {
      throw new Error(
        "You must not set `last` and `after`; specify `first` and optionally `after` to paginate forwards, or `last` and optionally `before` to paginate backwards; ",
      );
    }
    if (first != null && last != null) {
      throw new Error(
        "It is not permitted to set both 'first' and 'last' in the same field.",
      );
    }

    if (!isForwardPagination && offset != null) {
      throw new Error(`May not combine 'offset' with backward pagination.`);
    }

    params.__isForwardPagination = isForwardPagination;
    if (isForwardPagination) {
      // Forwards: after, offset, first
      if (supportsCursor) {
        // Limit definitely supported
        if (after != null) {
          params.after = after;
        }
        if (offset != null) {
          if (supportsOffset) {
            params.offset = (params.offset ?? 0) + offset;
          } else {
            params.__skipOver += offset;
          }
        }
        if (first != null) {
          params.limit = params.__skipOver + first + (needsHasMore ? 1 : 0);
          params.__hasMore = needsHasMore ? ["r", first] : false;
        } else {
          // Just fetch the lot
          params.__hasMore = false;
        }
      } else {
        // Collection doesn't support cursors; we must be using numeric cursors
        let initialIndex = 0;
        if (after != null) {
          initialIndex = decodeNumericCursor(after as string) + 1;
        }
        if (offset != null) {
          initialIndex += offset;
        }
        let beforeIndex = Infinity;
        if (first != null) {
          beforeIndex = initialIndex + first;
        }

        if (supportsOffset) {
          params.offset = initialIndex;
        } else {
          params.__skipOver = initialIndex;
        }

        if (Number.isFinite(beforeIndex)) {
          const max = beforeIndex - initialIndex;
          if (supportsLimit) {
            params.limit = params.__skipOver + max + (needsHasMore ? 1 : 0);
            params.__hasMore = needsHasMore ? ["r", max] : false;
          } else {
            // We're using __hasMore as a hack to apply our limit
            params.__hasMore = ["r", max];
          }
        } else {
          // There is no limit
          params.__hasMore = false;
        }
      }
    } else {
      // Backwards: before, last
      if (supportsReverse) {
        if (!supportsCursor) {
          throw new Error(
            "If reverse pagination is supported, cursor pagination must also be supported.",
          );
        }
        params.reverse = true;
        if (before != null) {
          params.after = before;
        }
        if (last != null) {
          params.limit = last + (needsHasMore ? 1 : 0);
          params.__hasMore = needsHasMore ? ["l", last] : false;
        } else {
          // Just fetch the lot
          params.__hasMore = false;
        }
      } else {
        if (supportsCursor) {
          throw new Error(
            "This cursor-supporting collection does not support reverse pagination.",
          );
        }
        // Implement numeric cursor pagination
        if (before != null) {
          const beforeIndex = decodeNumericCursor(before as string);
          let initialIndex = 0;
          if (last != null) {
            initialIndex = Math.max(0, beforeIndex - last);
          }
          if (supportsOffset) {
            params.offset = initialIndex;
          } else {
            params.__skipOver = initialIndex;
          }
          const max = beforeIndex - initialIndex;
          if (supportsLimit) {
            params.limit = params.__skipOver + max;
          } else {
            params.__limit = max;
          }
          // In this special case, hasNext is simply whether we started
          // fetching > 0 or not
          params.__hasMore = initialIndex > 0;
        } else if (last != null) {
          //params.__retain = last + (needsHasMore ? 1 : 0);
          //params.__hasMore = needsHasMore ? ["l", last] : false;

          // Hackily use the __hasMore retain mechanism to trim the collection
          params.__hasMore = ["l", last];
        } else {
          throw new Error(
            `GrafastInternalError<62c60e68-2925-41a7-837c-674234acab1b>: This code should be unreachable`,
          );
        }
      }
    }

    return params;
  }
}

class PageInfoStep extends UnbatchedStep<ConnectionResult<any>> {
  static $$export = {
    moduleName: "grafast",
    exportName: "PageInfoStep",
  };
  public isSyncAndSafe = true;
  constructor($connection: ConnectionStep<any, any, any, any, any, any>) {
    super();
    this.addDependency($connection);
  }

  get(key: string) {
    const $connection = this.getDepOptions(0).step as ConnectionStep<
      any,
      any,
      any,
      any,
      any,
      any
    >;
    switch (key) {
      case "hasNextPage": {
        $connection.setNeedsHasMore();
        return access($connection, "hasNextPage");
      }
      case "hasPreviousPage": {
        $connection.setNeedsHasMore();
        return access($connection, "hasPreviousPage");
      }
      case "startCursor": {
        // Get first node, get cursor for it
        const $first = first($connection._items());
        return $connection.cursorPlan($first);
      }
      case "endCursor": {
        // Get first node, get cursor for it
        const $last = last($connection._items());
        return $connection.cursorPlan($last);
      }
      default: {
        // TODO: allow expansion
        return constant(undefined);
      }
    }
  }
  unbatchedExecute(
    _extra: UnbatchedExecutionExtra,
    _connection: ConnectionResult<any>,
  ) {
    return _connection;
  }
}

export class ConnectionItemsStep extends Step {
  static $$export = {
    moduleName: "grafast",
    exportName: "ConnectionItemsStep",
  };

  public isSyncAndSafe = false;
  public cloneStreams = true;

  constructor($connection: ConnectionStep<any, any, any, any, any, any>) {
    super();
    this.addStrongDependency($connection);
  }

  public getConnection() {
    return this.getDepOptions(0).step as ConnectionStep<
      any,
      any,
      any,
      any,
      any,
      any
    >;
  }

  public optimize(_options: StepOptimizeOptions): Step {
    // If false, connection guarantees an array
    this.cloneStreams = this.getConnection().mightStream();
    return this;
  }

  public deduplicate(_peers: readonly ConnectionItemsStep[]) {
    return _peers;
  }

  execute(executionDetails: ExecutionDetails) {
    const connection = executionDetails.values[0];
    return executionDetails.indexMap((i) => connection.at(i)?.items);
  }
}

async function iterableToArray<T>(
  input: Iterable<T> | AsyncIterable<T>,
): Promise<ReadonlyArray<T>> {
  const items: T[] = [];
  for await (const item of input) {
    items.push(item);
  }
  return items;
}
