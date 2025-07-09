export type AnyCallback = (...args: any[]) => any;
export type CallbackDescriptor<T extends AnyCallback> = {
    provides?: (keyof GraphileConfig.Plugins | keyof GraphileConfig.Provides)[];
    before?: (keyof GraphileConfig.Plugins | keyof GraphileConfig.Provides)[];
    after?: (keyof GraphileConfig.Plugins | keyof GraphileConfig.Provides)[];
    callback: T;
};
export type PromiseOrDirect<T> = T | PromiseLike<T>;
export type CallbackOrDescriptor<T extends AnyCallback> = T | CallbackDescriptor<T>;
export type UnwrapCallback<T extends CallbackOrDescriptor<AnyCallback> | ReadonlyArray<CallbackDescriptor<AnyCallback>>> = T extends CallbackOrDescriptor<infer U> ? U : T extends ReadonlyArray<CallbackDescriptor<infer U>> ? U : never;
export type FunctionalityObject<T> = Record<keyof T, CallbackOrDescriptor<AnyCallback> | ReadonlyArray<CallbackDescriptor<AnyCallback>>>;
//# sourceMappingURL=interfaces.d.ts.map