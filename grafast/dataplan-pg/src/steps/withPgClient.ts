import type {
  ExecutionDetails,
  GrafastResultsList,
  LoadManyInfo,
  LoadManyLoader,
  LoadManyStep,
  LoadOneInfo,
  LoadOneLoader,
  LoadOneStep,
  Maybe,
  Multistep,
  PromiseOrDirect,
  Thunk,
  UnwrapMultistep,
} from "grafast";
import { loadMany, loadOne, multistep, Step } from "grafast";

import type {
  PgClient,
  PgExecutor,
  PgExecutorContext,
  WithPgClient,
} from "../executor";

export type SideEffectWithPgClientStepCallback<
  TData,
  TResult,
  TPgClient extends PgClient = PgClient,
> = (client: TPgClient, data: TData) => Promise<TResult>;

/**
 * Runs the given `callback` against the given `executor` using any plan data
 * from `$data` (which can be `constant(null)` if you don't need it). Typically
 * useful for running custom transactions.
 */
export class SideEffectWithPgClientStep<
  TData = any,
  TResult = any,
  TPgClient extends PgClient = PgClient,
> extends Step<TResult> {
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "SideEffectWithPgClientStep",
  };

  isSyncAndSafe = false;

  /**
   * Tells us what we're dealing with - data type, columns, where to insert it,
   * what it's called, etc.
   */
  public readonly executor: PgExecutor;

  /**
   * The id for the PostgreSQL context plan.
   */
  private contextId: number;

  /**
   * The id for the data plan.
   */
  private dataId: number;

  constructor(
    executor: PgExecutor,
    $data: Step<TData>,
    private callback: SideEffectWithPgClientStepCallback<
      TData,
      TResult,
      TPgClient
    >,
  ) {
    super();
    this.executor = executor;
    this.contextId = this.addDependency(this.executor.context());
    this.dataId = this.addDependency($data);

    // Be sure to set this _after_ we've added the dependencies - we don't want them to be dependent on us!
    this.hasSideEffects = true;
  }

  execute({
    indexMap,
    values,
  }: ExecutionDetails<
    [{ pgSettings: any; withPgClient: WithPgClient<TPgClient> }, TData]
  >): GrafastResultsList<TResult> {
    const contextDep = values[this.contextId as 0];
    const dataDep = values[this.dataId as 1];
    return indexMap((i) => {
      const context = contextDep.at(i);
      const data = dataDep.at(i);
      const { withPgClient, pgSettings } = context;
      return withPgClient(pgSettings, (client) => this.callback(client, data));
    });
  }
}

export function sideEffectWithPgClient<
  const TInMultistep extends Multistep,
  TResult,
  TPgClient extends PgClient = PgClient,
>(
  executor: PgExecutor,
  spec: TInMultistep,
  callback: SideEffectWithPgClientStepCallback<
    UnwrapMultistep<TInMultistep>,
    TResult,
    TPgClient
  >,
) {
  const $data = multistep(spec);
  return new SideEffectWithPgClientStep(executor, $data, callback);
}

export function sideEffectWithPgClientTransaction<
  const TInMultistep extends Multistep,
  TResult,
  TPgClient extends PgClient = PgClient,
>(
  executor: PgExecutor,
  spec: TInMultistep,
  callback: SideEffectWithPgClientStepCallback<
    UnwrapMultistep<TInMultistep>,
    TResult,
    TPgClient
  >,
) {
  return sideEffectWithPgClient<TInMultistep, TResult, TPgClient>(
    executor,
    spec,
    (client, data) =>
      client.withTransaction((txClient) => callback(txClient, data)),
  );
}
/** @deprecated Use `sideEffectWithPgClient` or `loadOneWithPgClient` or `loadManyWithPgClient` instead */
export const withPgClient = sideEffectWithPgClient;
/** @deprecated Use `sideEffectWithPgClientTransaction` instead (or `loadOneWithPgClient`/`loadManyWithPgClient` if you're not doing a mutation) */
export const withPgClientTransaction = sideEffectWithPgClientTransaction;

export function loadOneWithPgClient<
  const TLookup extends Multistep,
  TItem,
  TData extends Maybe<TItem> = Maybe<TItem>,
  TParams extends Record<string, any> = Record<string, any>,
  const TShared extends Record<string, Step> = Record<string, never>,
>(
  executor: PgExecutor,
  lookup: TLookup,
  loader: LoadOneWithPgClientLoader<
    UnwrapMultistep<TLookup>,
    TItem,
    TData,
    TParams,
    TShared
  >,
): LoadOneStep<UnwrapMultistep<TLookup>, TItem, TData, TParams, TShared> {
  const newLoader = transformLoadOneLoader(executor, loader);
  return loadOne(lookup, newLoader);
}

export type LoadOneWithPgClientCallback<
  TSpec,
  TItem,
  TData extends Maybe<TItem> = Maybe<TItem>,
  TParams extends Record<string, any> = Record<string, any>,
  TUnarySpec = never,
> = {
  (
    pgClient: PgClient,
    lookups: ReadonlyArray<TSpec>,
    info: LoadOneInfo<TItem, TParams, TUnarySpec>,
  ): PromiseOrDirect<ReadonlyArray<TData>>;
  displayName?: string;
};

type LoadOneWithPgClientLoader<
  TSpec,
  TItem,
  TData extends Maybe<TItem>,
  TParams extends Record<string, any>,
  TShared extends Record<string, Step>,
> =
  | LoadOneWithPgClientCallback<TSpec, TItem, TData, TParams, never>
  | (Omit<LoadOneLoader<TSpec, TItem, TData, TParams, TShared>, "load"> & {
      load: LoadOneWithPgClientCallback<
        TSpec,
        TItem,
        TData,
        TParams,
        UnwrapMultistep<TShared>
      >;
    });
const transformedLoaderCache = new WeakMap<PgExecutor, WeakMap<any, any>>();

// Identical, other than types, to transformLoadManyLoader
function transformLoadOneLoader<
  TLookup extends Multistep,
  TItem,
  TData extends Maybe<TItem>,
  TParams extends Record<string, any>,
  TShared extends Record<string, Step>,
>(
  executor: PgExecutor,
  loader: LoadOneWithPgClientLoader<
    UnwrapMultistep<TLookup>,
    TItem,
    TData,
    TParams,
    TShared
  >,
) {
  let cacheByExecutor = transformedLoaderCache.get(executor);
  if (!cacheByExecutor) {
    cacheByExecutor = new WeakMap();
    transformedLoaderCache.set(executor, cacheByExecutor);
  }
  const existing = cacheByExecutor.get(loader);
  if (existing) {
    return existing;
  } else {
    const loaderObject =
      typeof loader === "function"
        ? { load: loader, shared: undefined }
        : loader;
    const transformedLoader: LoadOneLoader<
      UnwrapMultistep<TLookup>,
      TItem,
      TData,
      TParams,
      TShared & { pgExecutorContext: Step<PgExecutorContext> }
    > = {
      ...loaderObject,
      shared: () => ({
        ...unthunk(loaderObject.shared as Thunk<TShared>),
        pgExecutorContext: executor.context(),
      }),
      load(lookups, info) {
        const {
          shared: { pgExecutorContext },
        } = info;
        return pgExecutorContext.withPgClient(
          pgExecutorContext.pgSettings,
          (pgClient) =>
            Promise.resolve(loaderObject.load(pgClient, lookups, info as any)),
        );
      },
    };
    cacheByExecutor.set(loader, transformedLoader);
    return transformedLoader;
  }
}

// Identical, other than types, to transformLoadOneLoader
function transformLoadManyLoader<
  TLookup extends Multistep,
  TItem,
  TData extends Maybe<ReadonlyArray<Maybe<TItem>>>,
  TParams extends Record<string, any>,
  TShared extends Record<string, Step>,
>(
  executor: PgExecutor,
  loader: LoadManyWithPgClientLoader<
    UnwrapMultistep<TLookup>,
    TItem,
    TData,
    TParams,
    TShared
  >,
) {
  let cacheByExecutor = transformedLoaderCache.get(executor);
  if (!cacheByExecutor) {
    cacheByExecutor = new WeakMap();
    transformedLoaderCache.set(executor, cacheByExecutor);
  }
  const existing = cacheByExecutor.get(loader);
  if (existing) {
    return existing;
  } else {
    const loaderObject =
      typeof loader === "function"
        ? { load: loader, shared: undefined }
        : loader;
    const transformedLoader: LoadManyLoader<
      UnwrapMultistep<TLookup>,
      TItem,
      TData,
      TParams,
      TShared & { pgExecutorContext: Step<PgExecutorContext> }
    > = {
      ...loaderObject,
      shared: () => ({
        ...unthunk(loaderObject.shared as Thunk<TShared>),
        pgExecutorContext: executor.context(),
      }),
      load(lookups, info) {
        const {
          shared: { pgExecutorContext },
        } = info;
        return pgExecutorContext.withPgClient(
          pgExecutorContext.pgSettings,
          (pgClient) =>
            Promise.resolve(loaderObject.load(pgClient, lookups, info as any)),
        );
      },
    };
    cacheByExecutor.set(loader, transformedLoader);
    return transformedLoader;
  }
}

function unthunk<T>(t: Thunk<T>): T {
  return typeof t === "function" ? (t as () => T)() : t;
}

export type LoadManyWithPgClientCallback<
  TSpec,
  TItem,
  TData extends Maybe<ReadonlyArray<Maybe<TItem>>> = Maybe<
    ReadonlyArray<Maybe<TItem>>
  >,
  TParams extends Record<string, any> = Record<string, any>,
  TUnarySpec = never,
> = {
  (
    pgClient: PgClient,
    lookups: ReadonlyArray<TSpec>,
    info: LoadManyInfo<TItem, TParams, TUnarySpec>,
  ): PromiseOrDirect<ReadonlyArray<TData>>;
  displayName?: string;
};

type LoadManyWithPgClientLoader<
  TSpec,
  TItem,
  TData extends Maybe<ReadonlyArray<Maybe<TItem>>>,
  TParams extends Record<string, any>,
  TShared extends Record<string, Step>,
> =
  | LoadManyWithPgClientCallback<TSpec, TItem, TData, TParams, never>
  | (Omit<LoadManyLoader<TSpec, TItem, TData, TParams, TShared>, "load"> & {
      load: LoadManyWithPgClientCallback<
        TSpec,
        TItem,
        TData,
        TParams,
        UnwrapMultistep<TShared>
      >;
    });

export function loadManyWithPgClient<
  const TLookup extends Multistep,
  TItem,
  TData extends Maybe<ReadonlyArray<Maybe<TItem>>> = Maybe<
    ReadonlyArray<Maybe<TItem>>
  >,
  TParams extends Record<string, any> = Record<string, any>,
  const TShared extends Record<string, Step> = Record<string, never>,
>(
  executor: PgExecutor,
  lookup: TLookup,
  loader: LoadManyWithPgClientLoader<
    UnwrapMultistep<TLookup>,
    TItem,
    TData,
    TParams,
    TShared
  >,
): LoadManyStep<UnwrapMultistep<TLookup>, TItem, TData, TParams, TShared> {
  const newLoader = transformLoadManyLoader(executor, loader);
  return loadMany(lookup, newLoader);
}
