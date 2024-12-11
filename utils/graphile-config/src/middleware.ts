import type {
  CallbackOrDescriptor,
  FunctionalityObject,
  PromiseOrDirect,
} from "./interfaces.js";
import { isPromiseLike } from "./utils.js";

export interface MiddlewareNext<TRawResult> {
  (): TRawResult;
  callback(
    callback: (
      error: object | null,
      result: Awaited<TRawResult>,
    ) => TRawResult | Awaited<TRawResult>,
  ): TRawResult;
}

type ActivityFn<
  TActivities extends FunctionalityObject<TActivities>,
  TActivityName extends keyof TActivities,
> = TActivities[TActivityName] extends CallbackOrDescriptor<infer UFn>
  ? UFn
  : never;
type ActivityParameter<
  TActivities extends FunctionalityObject<TActivities>,
  TActivityName extends keyof TActivities,
> = TActivities[TActivityName] extends CallbackOrDescriptor<
  (arg: infer UArg) => any
>
  ? UArg
  : never;

type RealActivityFn<
  TActivities extends FunctionalityObject<TActivities>,
  TActivityName extends keyof TActivities,
> = TActivities[TActivityName] extends CallbackOrDescriptor<
  (arg: infer UArg) => infer UResult
>
  ? (next: MiddlewareNext<UResult>, arg: UArg) => UResult
  : never;

export class Middleware<TActivities extends FunctionalityObject<TActivities>> {
  middleware: {
    [key in keyof TActivities]?: Array<RealActivityFn<TActivities, key>>;
  } = Object.create(null);

  register<TActivityName extends keyof TActivities>(
    event: TActivityName,
    fn: RealActivityFn<TActivities, TActivityName>,
  ): void {
    const list = this.middleware[event];
    if (list !== undefined) {
      list.push(fn);
    } else {
      this.middleware[event] = [fn];
    }
  }

  run<TActivityName extends keyof TActivities>(
    activityName: TActivityName,
    arg: ActivityParameter<TActivities, TActivityName>,
    activity: (
      arg: ActivityParameter<TActivities, TActivityName>,
    ) => ReturnType<ActivityFn<TActivities, TActivityName>>,
  ): ReturnType<ActivityFn<TActivities, TActivityName>> {
    const middleware = this.middleware[activityName];
    if (middleware === undefined) {
      return activity(arg);
    }
    const m = middleware.length - 1;
    return executeMiddleware(
      activityName,
      true,
      middleware,
      activity,
      arg,
      0,
      m,
    );
  }
  runSync<TActivityName extends keyof TActivities>(
    activityName: TActivityName,
    arg: ActivityParameter<TActivities, TActivityName>,
    activity: (
      arg: ActivityParameter<TActivities, TActivityName>,
    ) => ReturnType<ActivityFn<TActivities, TActivityName>>,
  ): ReturnType<ActivityFn<TActivities, TActivityName>> {
    const middleware = this.middleware[activityName];
    if (middleware === undefined) {
      return activity(arg);
    }
    const m = middleware.length - 1;
    return executeMiddleware(
      activityName,
      false,
      middleware,
      activity,
      arg,
      0,
      m,
    );
  }
}

function executeMiddleware<
  TActivities extends FunctionalityObject<TActivities>,
  TActivityName extends keyof TActivities,
>(
  activityName: TActivityName,
  allowAsync: boolean,
  middlewareList: ReadonlyArray<RealActivityFn<TActivities, TActivityName>>,
  activity: (
    arg: ActivityParameter<TActivities, TActivityName>,
  ) => ReturnType<ActivityFn<TActivities, TActivityName>>,
  arg: ActivityParameter<TActivities, TActivityName>,
  idx: number,
  maxIdx: number,
): ReturnType<ActivityFn<TActivities, TActivityName>> {
  const next = makeNext<ReturnType<ActivityFn<TActivities, TActivityName>>>(
    idx === maxIdx
      ? () => activity(arg)
      : () =>
          executeMiddleware(
            activityName,
            allowAsync,
            middlewareList,
            activity,
            arg,
            idx + 1,
            maxIdx,
          ),
  );
  const middleware = middlewareList[idx];
  const result = middleware(next as MiddlewareNext<unknown>, arg) as any;
  if (!allowAsync && isPromiseLike(result)) {
    throw new Error(
      `'${String(
        activityName,
      )}' is a synchronous activity, all middleware must be synchronous but the middleware at index ${idx} returned a promise.`,
    );
  }
  return result;
}

function makeNext<TRawResult>(
  fn: () => TRawResult,
): MiddlewareNext<TRawResult> {
  let called = false;
  const next = fn as MiddlewareNext<TRawResult>;
  next.callback = (callback) => {
    if (called) {
      throw new Error(`next() was already called; don't call it twice!`);
    }
    called = true;
    let result: PromiseOrDirect<Awaited<TRawResult>>;
    try {
      result = fn() as PromiseOrDirect<Awaited<TRawResult>>;
    } catch (error) {
      return callback(error, undefined as any);
    }
    if (isPromiseLike(result)) {
      return result.then(
        (result) => callback(null, result) as Awaited<TRawResult> | TRawResult,
        callback as any,
      ) as TRawResult;
    } else {
      return callback(null, result);
    }
  };
  return next;
}

export type MiddlewareHandlers<
  TActivities extends FunctionalityObject<TActivities>,
> = {
  [key in keyof TActivities]?: CallbackOrDescriptor<
    TActivities[key] extends (...args: infer UArgs) => infer UResult
      ? (next: MiddlewareNext<UResult>, ...args: UArgs) => UResult
      : never
  >;
};
