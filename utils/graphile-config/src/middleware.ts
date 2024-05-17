import type { PluginHook } from "./interfaces.js";

export type MiddlewareNext<TResult> = () => TResult;

export type MiddlewareObject<T> = Record<
  keyof T,
  PluginHook<(...args: any[]) => any>
>;

type ActivityFn<
  TActivities extends MiddlewareObject<TActivities>,
  TActivityName extends keyof TActivities,
> = TActivities[TActivityName] extends PluginHook<infer U> ? U : never;
type ActivityParameter<
  TActivities extends MiddlewareObject<TActivities>,
  TActivityName extends keyof TActivities,
> = TActivities[TActivityName] extends PluginHook<(arg: infer U) => any>
  ? U
  : never;

type RealActivityFn<
  TActivities extends MiddlewareObject<TActivities>,
  TActivityName extends keyof TActivities,
> = TActivities[TActivityName] extends PluginHook<
  (...args: infer UArgs) => infer UResult
>
  ? (next: MiddlewareNext<UResult>, ...args: UArgs) => UResult
  : never;

export class Middlewares<TActivities extends MiddlewareObject<TActivities>> {
  middlewares: {
    [key in keyof TActivities]?: Array<RealActivityFn<TActivities, key>>;
  } = Object.create(null);

  register<TActivityName extends keyof TActivities>(
    event: TActivityName,
    fn: RealActivityFn<TActivities, TActivityName>,
  ): void {
    const list = this.middlewares[event];
    if (list !== undefined) {
      list.push(fn);
    } else {
      this.middlewares[event] = [fn];
    }
  }

  run<TActivityName extends keyof TActivities>(
    activityName: TActivityName,
    activity: (
      arg: ActivityParameter<TActivities, TActivityName>,
    ) => ReturnType<ActivityFn<TActivities, TActivityName>>,
    arg: ActivityParameter<TActivities, TActivityName>,
  ) {
    const middlewares = this.middlewares[activityName];
    if (middlewares === undefined) {
      return activity(arg);
    }
    const m = middlewares.length - 1;
    return executeMiddleware(middlewares, activity, arg, 0, m);
  }
}

function executeMiddleware<
  TActivities extends MiddlewareObject<TActivities>,
  TActivityName extends keyof TActivities,
>(
  middlewares: ReadonlyArray<RealActivityFn<TActivities, TActivityName>>,
  activity: (
    arg: ActivityParameter<TActivities, TActivityName>,
  ) => ReturnType<ActivityFn<TActivities, TActivityName>>,
  arg: ActivityParameter<TActivities, TActivityName>,
  idx: number,
  maxIdx: number,
): ReturnType<ActivityFn<TActivities, TActivityName>> {
  const next =
    idx === maxIdx
      ? () => activity(arg)
      : () => executeMiddleware(middlewares, activity, arg, idx + 1, maxIdx);
  const middleware = middlewares[idx];
  return middleware(next, arg) as any;
}
