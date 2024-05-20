import type { CallbackDescriptor, FunctionalityObject } from "./interfaces.js";

export type MiddlewareNext<TResult> = () => TResult;

type ActivityFn<
  TActivities extends FunctionalityObject<TActivities>,
  TActivityName extends keyof TActivities,
> = TActivities[TActivityName] extends CallbackDescriptor<infer UFn>
  ? UFn
  : never;
type ActivityParameter<
  TActivities extends FunctionalityObject<TActivities>,
  TActivityName extends keyof TActivities,
> = TActivities[TActivityName] extends CallbackDescriptor<
  (arg: infer UArg) => any
>
  ? UArg
  : never;

type RealActivityFn<
  TActivities extends FunctionalityObject<TActivities>,
  TActivityName extends keyof TActivities,
> = TActivities[TActivityName] extends CallbackDescriptor<
  (arg: infer UArg) => infer UResult
>
  ? (next: MiddlewareNext<UResult>, arg: UArg) => UResult
  : never;

export class Middlewares<TActivities extends FunctionalityObject<TActivities>> {
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
    arg: ActivityParameter<TActivities, TActivityName>,
    activity: (
      arg: ActivityParameter<TActivities, TActivityName>,
    ) => ReturnType<ActivityFn<TActivities, TActivityName>>,
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
  TActivities extends FunctionalityObject<TActivities>,
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
