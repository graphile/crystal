import type { CallbackOrDescriptor, FunctionalityObject } from "./interfaces.js";
export interface MiddlewareNext<TRawResult> {
    (): TRawResult;
    callback(callback: (error: object | null, result: Awaited<TRawResult>) => TRawResult | Awaited<TRawResult>): TRawResult;
}
type ActivityFn<TActivities extends FunctionalityObject<TActivities>, TActivityName extends keyof TActivities> = TActivities[TActivityName] extends CallbackOrDescriptor<infer UFn> ? UFn : never;
type ActivityParameter<TActivities extends FunctionalityObject<TActivities>, TActivityName extends keyof TActivities> = TActivities[TActivityName] extends CallbackOrDescriptor<(arg: infer UArg) => any> ? UArg : never;
type RealActivityFn<TActivities extends FunctionalityObject<TActivities>, TActivityName extends keyof TActivities> = TActivities[TActivityName] extends CallbackOrDescriptor<(arg: infer UArg) => infer UResult> ? (next: MiddlewareNext<UResult>, arg: UArg) => UResult : never;
export declare class Middleware<TActivities extends FunctionalityObject<TActivities>> {
    middleware: {
        [key in keyof TActivities]?: Array<RealActivityFn<TActivities, key>>;
    };
    register<TActivityName extends keyof TActivities>(activityName: TActivityName, fn: RealActivityFn<TActivities, TActivityName>): void;
    run<TActivityName extends keyof TActivities>(activityName: TActivityName, arg: ActivityParameter<TActivities, TActivityName>, activity: (arg: ActivityParameter<TActivities, TActivityName>) => ReturnType<ActivityFn<TActivities, TActivityName>>): ReturnType<ActivityFn<TActivities, TActivityName>>;
    runSync<TActivityName extends keyof TActivities>(activityName: TActivityName, arg: ActivityParameter<TActivities, TActivityName>, activity: (arg: ActivityParameter<TActivities, TActivityName>) => ReturnType<ActivityFn<TActivities, TActivityName>>): ReturnType<ActivityFn<TActivities, TActivityName>>;
}
export type MiddlewareHandlers<TActivities extends FunctionalityObject<TActivities>> = {
    [key in keyof TActivities]?: CallbackOrDescriptor<TActivities[key] extends (...args: infer UArgs) => infer UResult ? (next: MiddlewareNext<UResult>, ...args: UArgs) => UResult : never>;
};
export {};
//# sourceMappingURL=middleware.d.ts.map