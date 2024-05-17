import type { PluginHook, PromiseOrDirect } from "./interfaces.js";

export type MiddlewareNext = () => PromiseOrDirect<void>;

export type MiddlewareObject<T> = Record<
  keyof T,
  PluginHook<(next: MiddlewareNext, ...args: any[]) => any>
>;

type ActivityFn<
  TActivities extends MiddlewareObject<TActivities>,
  TActivityName extends keyof TActivities,
> = TActivities[TActivityName] extends PluginHook<infer U> ? U : never;

export class Middlewares<TActivities extends MiddlewareObject<TActivities>> {
  middlewares: {
    [key in keyof TActivities]?: Array<ActivityFn<TActivities, key>>;
  } = Object.create(null);

  register<TActivityName extends keyof TActivities>(
    event: TActivityName,
    fn: ActivityFn<TActivities, TActivityName>,
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
      ...args: Parameters<ActivityFn<TActivities, TActivityName>>
    ) => ReturnType<ActivityFn<TActivities, TActivityName>>,
    ...args: Parameters<ActivityFn<TActivities, TActivityName>>
  ) {
    const middlewares = this.middlewares[activityName];
    if (middlewares === undefined) {
      return activity(...args);
    }
    const m = middlewares.length - 1;
    return executeMiddleware(middlewares, activity, args, 0, m);
  }
}

function executeMiddleware<
  TActivities extends MiddlewareObject<TActivities>,
  TActivityName extends keyof TActivities,
>(
  middlewares: ReadonlyArray<ActivityFn<TActivities, TActivityName>>,
  activity: (
    ...args: Parameters<ActivityFn<TActivities, TActivityName>>
  ) => ReturnType<ActivityFn<TActivities, TActivityName>>,
  args: Parameters<ActivityFn<TActivities, TActivityName>>,
  idx: number,
  maxIdx: number,
): ReturnType<ActivityFn<TActivities, TActivityName>> {
  const next =
    idx === maxIdx
      ? () => activity(...args)
      : () => executeMiddleware(middlewares, activity, args, idx + 1, maxIdx);
  const middleware = middlewares[idx];
  return middleware(next, ...args);
}
