import type {
  CallbackOrDescriptor,
  FunctionalityObject,
} from "./interfaces.js";
import { isPromiseLike } from "./utils.js";

export type MiddlewareNext<TResult> = () => TResult;

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
    return executeMiddleware(
      activityName,
      true,
      middlewares,
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
  ) {
    const middlewares = this.middlewares[activityName];
    if (middlewares === undefined) {
      return activity(arg);
    }
    const m = middlewares.length - 1;
    return executeMiddleware(
      activityName,
      false,
      middlewares,
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
      : () =>
          executeMiddleware(
            activityName,
            allowAsync,
            middlewares,
            activity,
            arg,
            idx + 1,
            maxIdx,
          );
  const middleware = middlewares[idx];
  const result = middleware(next, arg) as any;
  if (!allowAsync && isPromiseLike(result)) {
    throw new Error(
      `'${String(
        activityName,
      )}' is a synchronous activity, all middlewares must be synchronous but the middleware at index ${idx} returned a promise.`,
    );
  }
  return result;
}
