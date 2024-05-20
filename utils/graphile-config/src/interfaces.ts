export type OrderedCallback<T extends (...args: any[]) => any> = {
  provides?: string[];
  before?: string[];
  after?: string[];
  callback: T;
};

export type PromiseOrDirect<T> = T | PromiseLike<T>;

export type CallbackDescriptor<
  T extends (...args: any[]) => PromiseOrDirect<UnwrapCallback<any> | void>,
> = T | OrderedCallback<T>;

export type UnwrapCallback<
  T extends CallbackDescriptor<(...args: any[]) => any>,
> = T extends CallbackDescriptor<infer U> ? U : never;

/* BACKWARDS COMPATIBILITY */

/** @deprecated Use OrderedCallback */
export type PluginHookObject<T extends (...args: any[]) => any> =
  OrderedCallback<T>;
/** @deprecated Use CallbackDescriptor */
export type PluginHook<
  T extends (...args: any[]) => PromiseOrDirect<UnwrapCallback<any> | void>,
> = CallbackDescriptor<T>;
/** @deprecated Use UnwrapCallback */
export type PluginHookCallback<
  T extends CallbackDescriptor<(...args: any[]) => any>,
> = UnwrapCallback<T>;
