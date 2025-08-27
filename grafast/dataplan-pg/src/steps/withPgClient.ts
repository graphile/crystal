import type {
  ExecutionDetails,
  GrafastResultsList,
  LoadOneCallback,
  LoadOneLoader,
  LoadOneStep,
  Maybe,
  Multistep,
  ObjectStep,
  Thunk,
  UnwrapMultistep,
} from "grafast";
import { constant, loadOne, Step } from "grafast";

import type {
  PgClient,
  PgExecutor,
  PgExecutorContextPlans,
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
  TData,
  TResult,
  TPgClient extends PgClient = PgClient,
>(
  executor: PgExecutor,
  $data:
    | Step<TData>
    | (TData extends null | undefined ? null | undefined : never),
  callback: SideEffectWithPgClientStepCallback<TData, TResult, TPgClient>,
) {
  return new SideEffectWithPgClientStep(
    executor,
    $data ?? constant($data as TData),
    callback,
  );
}

export function sideEffectWithPgClientTransaction<
  TData,
  TResult,
  TPgClient extends PgClient = PgClient,
>(
  executor: PgExecutor,
  $data:
    | Step<TData>
    | (TData extends null | undefined ? null | undefined : never),
  callback: SideEffectWithPgClientStepCallback<TData, TResult, TPgClient>,
) {
  return sideEffectWithPgClient<TData, TResult, TPgClient>(
    executor,
    $data ?? constant($data as TData),
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
  const TShared extends Record<string, Step> = never,
>(
  executor: PgExecutor,
  lookup: TLookup,
  loader: LoaderOrCallback<
    UnwrapMultistep<TLookup>,
    TItem,
    TData,
    TParams,
    TShared & { pgClient: Step<PgClient> }
  >,
): LoadOneStep<
  UnwrapMultistep<TLookup>,
  TItem,
  TData,
  TParams,
  TShared & { pgClient: Step<PgClient> }
> {
  const newLoader = getLoader(executor, loader);
  return loadOne(lookup, newLoader);
}

type LoaderOrCallback<
  TLookup extends Multistep,
  TItem,
  TData extends Maybe<TItem>,
  TParams extends Record<string, any>,
  TShared extends Record<string, Step>,
> =
  | LoadOneCallback<UnwrapMultistep<TLookup>, TItem, TData, TParams, TShared>
  | LoadOneLoader<UnwrapMultistep<TLookup>, TItem, TData, TParams, TShared>;
const transformedLoaderCache = new WeakMap<PgExecutor, WeakMap<any, any>>();

function getLoader<
  TLookup extends Multistep,
  TItem,
  TData extends Maybe<TItem>,
  TParams extends Record<string, any>,
  TShared extends Record<string, Step>,
>(
  executor: PgExecutor,
  loader: LoaderOrCallback<
    UnwrapMultistep<TLookup>,
    TItem,
    TData,
    TParams,
    TShared & { pgClient: Step<PgClient> }
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
    const loaderObject = (
      typeof loader === "function" ? { load: loader } : loader
    ) as LoadOneLoader<
      UnwrapMultistep<TLookup>,
      TItem,
      TData,
      TParams,
      TShared & { pgClient: Step<PgClient> }
    >;
    const transformedLoader: LoadOneLoader<
      UnwrapMultistep<TLookup>,
      TItem,
      TData,
      TParams,
      TShared & { pgExecutorContext: ObjectStep<PgExecutorContextPlans> }
    > = {
      ...loaderObject,
      shared: () => ({
        ...unthunk(loaderObject.shared as TShared),
        pgExecutorContext: executor.context(),
      }),
      load(specs, info) {
        const {
          shared: { pgExecutorContext, ...moreShared },
          ...moreInfo
        } = info;
        return pgExecutorContext.withPgClient(
          pgExecutorContext.pgSettings,
          (pgClient) =>
            Promise.resolve(
              loaderObject.load(specs, {
                ...moreInfo,
                shared: {
                  ...(moreShared as unknown as TShared),
                  pgClient,
                } as any,
                unary: {
                  ...(moreShared as unknown as TShared),
                  pgClient,
                } as any,
              }),
            ),
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
